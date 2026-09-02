import {useState, useCallback, useRef, useEffect} from 'react';
import {useAtom, useAtomValue} from "jotai";
import {namesListState, winnerMessageState, spinModeState, winnerPromptEnabledState, confettiEnabledState} from "../shared/globalState";
import useConfetti, { confettiStyles } from '../shared/useConfetti';

import ButtonPrimary from './Buttons/ButtonPrimary';
import Modal from './Modals/Modal';
import SpinWheel from './SpinWheel';

import ReactCanvasConfetti from "react-canvas-confetti";

const ITEM_HEIGHT = 40;    // 列表项高度 h-10 (2.5rem)
const SLOT_HEIGHT = 280;   // 滚动窗口高度（7 项）
const TARGET_SPEED = 1600; // 峰值滚动速度 px/s
const DECEL = 0.05;        // 减速系数（每帧指数衰减）
const STOP_SPEED = 30;     // 低于此速度即进入定格对齐

const Wheel = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [drawnName, setDrawnName] = useState();
  const winnerMessageValue = useAtomValue(winnerMessageState);
  const [namesList, setNamesList] = useAtom(namesListState);
  const [isSpinMode, setIsSpinMode] = useAtom(spinModeState);
  const isWinnerPromptEnabled = useAtomValue(winnerPromptEnabledState);
  const isConfettiEnabled = useAtomValue(confettiEnabledState);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef(null);
  const { getInstance, fire } = useConfetti();

  // ── 名单列表纵向滚动抽名 ───────────────────────────────────
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const offsetRef = useRef(0);       // 当前滚动偏移（px，浮点）
  const speedRef = useRef(0);        // 当前速度（px/s）
  const modeRef = useRef('idle');    // 'idle' | 'spinning' | 'decelerating' | 'settling'
  const settleStartRef = useRef(0);
  const settleTargetRef = useRef(0);
  const settleStartTimeRef = useRef(0);
  const settleWinnerRef = useRef(-1);

  const [rolling, setRolling] = useState(false);
  const [decelerating, setDecelerating] = useState(false);

  const getCleanNames = () => {
    const raw = typeof namesList === 'string' ? namesList : '';
    return raw
      .split("\n")
      .map(item => item.replace(/\s+$/, ""))
      .filter(item => item !== '');
  };

  const cleanedNames = getCleanNames();
  const cleanedNamesRef = useRef(cleanedNames);
  cleanedNamesRef.current = cleanedNames;

  // 根据名单长度动态决定重复份数，保证短名单也能无缝循环滚动
  const repeatCount = cleanedNames.length === 0
    ? 0
    : Math.max(2, Math.ceil(1 + SLOT_HEIGHT / (cleanedNames.length * ITEM_HEIGHT)) + 1);
  const repeatedNames = Array.from({ length: repeatCount }, () => cleanedNames).flat();

  const isEmpty = cleanedNames.length === 0;

  /* 静默停止滚动（切换模式 / 卸载时用，不结算结果） */
  const cancelRolling = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = null;
    modeRef.current = 'idle';
    speedRef.current = 0;
    setRolling(false);
    setDecelerating(false);
  }, []);

  /* 结算结果：定格后确定中奖名字 */
  const finishRolling = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = null;
    modeRef.current = 'idle';
    speedRef.current = 0;
    setRolling(false);
    setDecelerating(false);

    const names = cleanedNamesRef.current;
    const idx = settleWinnerRef.current;
    if (idx < 0 || idx >= names.length) return;
    const drawn = names[idx];
    setDrawnName(drawn);
    setIsOpen(true);
    if (isConfettiEnabled) fire();
    if (props.removeName) {
      setNamesList(names.filter(n => n !== drawn).join("\n"));
    }
  }, [isConfettiEnabled, fire, props.removeName, setNamesList]);

  /* 开始滚动：名单列表连续纵向翻滚，加速到峰值后等待手动暂停 */
  const startRolling = useCallback(() => {
    const n = cleanedNamesRef.current.length;
    if (n === 0) return;
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const total = n * ITEM_HEIGHT;
    offsetRef.current = ((offsetRef.current % total) + total) % total;
    speedRef.current = 0;
    settleWinnerRef.current = -1;
    modeRef.current = 'spinning';
    setRolling(true);
    setDecelerating(false);

    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1); // 秒，防止切后台后跳帧
      last = now;
      const totalNow = cleanedNamesRef.current.length * ITEM_HEIGHT;

      if (modeRef.current === 'spinning') {
        speedRef.current = Math.min(speedRef.current + dt * 4000, TARGET_SPEED);
      } else if (modeRef.current === 'decelerating') {
        speedRef.current *= Math.pow(DECEL, dt); // 指数减速，像轮盘一样逐渐慢下来
        if (speedRef.current < STOP_SPEED) {
          // 进入定格对齐：把中奖线正对的名字滚到居中
          const count = cleanedNamesRef.current.length;
          const p = offsetRef.current + SLOT_HEIGHT / 2; // 中奖线对应的轨道位置
          const winnerLoop = Math.floor(p / ITEM_HEIGHT);
          settleWinnerRef.current = ((winnerLoop % count) + count) % count;

          settleStartRef.current = offsetRef.current;
          settleTargetRef.current = winnerLoop * ITEM_HEIGHT + ITEM_HEIGHT / 2 - SLOT_HEIGHT / 2;
          settleStartTimeRef.current = now;
          modeRef.current = 'settling';
        }
      } else if (modeRef.current === 'settling') {
        const t = Math.min((now - settleStartTimeRef.current) / 350, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        offsetRef.current = settleStartRef.current + (settleTargetRef.current - settleStartRef.current) * eased;
        if (trackRef.current) {
          trackRef.current.style.transform = `translateY(${-offsetRef.current}px)`;
        }
        if (t >= 1) {
          finishRolling();
          return;
        }
        animRef.current = requestAnimationFrame(loop);
        return;
      }

      if (modeRef.current !== 'idle') {
        offsetRef.current = (offsetRef.current + speedRef.current * dt) % totalNow;
        if (trackRef.current) {
          trackRef.current.style.transform = `translateY(${-offsetRef.current}px)`;
        }
      }
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
  }, [finishRolling]);

  /* 暂停：触发减速定格 */
  const stopRolling = useCallback(() => {
    if (modeRef.current === 'spinning') {
      modeRef.current = 'decelerating';
      setDecelerating(true);
    }
  }, []);

  /* 卸载时清理动画 */
  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(f => {
      if (f) setZoom(1);
      return !f;
    });
  }, []);
  const zoomIn  = useCallback(() => setZoom(z => Math.min(+(z + 0.1).toFixed(1), 1.5)), []);
  const zoomOut = useCallback(() => setZoom(z => Math.max(+(z - 0.1).toFixed(1), 0.5)), []);

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : '';
    if (isFullscreen) {
      document.body.classList.add('fullscreen-mode');
    } else {
      document.body.classList.remove('fullscreen-mode');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('fullscreen-mode');
    };
  }, [isFullscreen]);

  useEffect(() => {
    if (!isFullscreen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
        setZoom(1);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const winnerPrompt = isWinnerPromptEnabled
    ? (winnerMessageValue && winnerMessageValue.length > 0 ? winnerMessageValue : '🎉 恭喜，中奖者是...')
    : '';

  return (
    <>
      <div
        ref={containerRef}
        className={isFullscreen
          ? 'fixed inset-0 z-40 bg-gray-50 dark:bg-[#0c0c14] flex flex-col items-center'
          : 'flex flex-col items-center gap-6 w-full py-8 px-4 sm:px-6'
        }
      >
        <div
          className={isFullscreen ? 'w-full max-w-lg mx-auto flex flex-col gap-6 items-center flex-1 min-h-0 py-4 px-4' : 'contents'}
        >

        {/* Page header — hidden in fullscreen */}
        {!isFullscreen && (
          <div className='text-center'>
            <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
              {isSpinMode ? '旋转转盘' : '随机抽取名字'}
            </h1>
            <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
              {isEmpty
                ? '在设置中添加名字以开始'
                : `共 ${cleanedNames.length} 位参与者`}
            </p>
          </div>
        )}

        {/* Mode toggle + fullscreen + zoom */}
        <div className='flex items-center gap-2 self-center'>
          <div className='flex items-center p-1 bg-gray-100 dark:bg-gray-800/60 rounded-xl'>
            <button
              onClick={() => setIsSpinMode(false)}
              className={`flex items-center gap-1.5 px-4 py-2.5 sm:px-3 sm:py-1.5 rounded-lg text-sm sm:text-xs font-medium transition-all duration-150 cursor-pointer ${
                !isSpinMode
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <svg className='w-5 h-5 sm:w-3.5 sm:h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 10h16M4 14h16M4 18h16' />
              </svg>
              列表
            </button>
            <button
              onClick={() => { cancelRolling(); setIsSpinMode(true); }}
              className={`flex items-center gap-1.5 px-4 py-2.5 sm:px-3 sm:py-1.5 rounded-lg text-sm sm:text-xs font-medium transition-all duration-150 cursor-pointer ${
                isSpinMode
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <svg className='w-5 h-5 sm:w-3.5 sm:h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 2a10 10 0 100 20A10 10 0 0012 2zm0 0v10m0 0l-3-3m3 3l3-3' />
              </svg>
              转盘
            </button>
          </div>
          {isFullscreen && (
            <div className='flex items-center gap-1 bg-gray-100 dark:bg-gray-800/60 rounded-xl p-1'>
              <button
                onClick={zoomOut}
                disabled={zoom <= 0.5}
                className='w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-base font-medium leading-none'
                title='缩小'
              >
                −
              </button>
              <span className='text-xs font-medium text-gray-500 dark:text-gray-400 w-9 text-center tabular-nums'>
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={zoomIn}
                disabled={zoom >= 1.5}
                className='w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-base font-medium leading-none'
                title='放大'
              >
                +
              </button>
            </div>
          )}
          <button
            onClick={toggleFullscreen}
            className='p-2 rounded-xl text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-all duration-150 cursor-pointer [-webkit-tap-highlight-color:transparent]'
            title={isFullscreen ? '退出全屏' : '进入全屏'}
          >
            {isFullscreen ? (
              <svg className='w-5 h-5 sm:w-4 sm:h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            ) : (
              <svg className='w-5 h-5 sm:w-4 sm:h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4' />
              </svg>
            )}
          </button>
        </div>

        {isSpinMode ? (
          <div className={isFullscreen ? 'flex-1 min-h-0 flex items-center justify-center w-full' : 'contents'}>
            <div style={isFullscreen ? { transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 150ms ease' } : undefined}>
              <SpinWheel removeName={props.removeName} />
            </div>
          </div>
        ) : (
          <div className={isFullscreen ? 'flex-1 min-h-0 flex flex-col items-center justify-center w-full' : 'contents'}>
            <div
              className={isFullscreen ? 'flex flex-col items-center gap-6 w-full' : 'contents'}
              style={isFullscreen ? { transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 150ms ease' } : undefined}
            >
            {/* Participants card — the list itself scrolls */}
            <div className='w-full card overflow-hidden animate-slide-up'>
              {isEmpty ? (
                <div className='flex flex-col items-center justify-center py-16 px-6 text-center'>
                  <div className='w-16 h-16 sm:w-14 sm:h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-4'>
                    <svg className='w-9 h-9 sm:w-7 sm:h-7 text-indigo-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
                    </svg>
                  </div>
                  <p className='text-base sm:text-sm font-medium text-gray-500 dark:text-gray-400'>还没有参与者</p>
                  <p className='mt-1 text-sm sm:text-xs text-gray-400 dark:text-gray-500'>打开设置添加名字</p>
                </div>
              ) : (
                <>
                  {/* 列表头 */}
                  <div className='px-5 py-3 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between'>
                    <span className='section-label'>参与者</span>
                    <span className='text-xs font-bold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 rounded-full'>
                      {cleanedNames.length}
                    </span>
                  </div>

                  {/* 滚动窗口：参与者列表纵向翻滚 */}
                  <div
                    className='relative overflow-hidden'
                    style={{ height: `${SLOT_HEIGHT}px` }}
                  >
                    {/* 中间中奖线 */}
                    <div className='absolute left-0 right-0 top-1/2 -translate-y-1/2 h-10 border-y-2 border-indigo-400/50 pointer-events-none z-10' />
                    {/* 滚动轨道 */}
                    <div ref={trackRef} className='will-change-transform'>
                      {repeatedNames.map((name, idx) => (
                        <div key={idx} className='h-10 flex items-center gap-3 px-5'>
                          <span className='flex-shrink-0 w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold'>
                            {(idx % cleanedNames.length) + 1}
                          </span>
                          <span className='text-sm truncate text-gray-700 dark:text-gray-300'>{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Pick button — 开始 / 暂停 二合一 */}
            <ButtonPrimary
              value={rolling ? (decelerating ? '减速中…' : '暂停') : '开始抽取'}
              onClick={rolling ? stopRolling : startRolling}
              disabled={isEmpty}
              tooltip={'请先在设置中添加名字'}
              divClass={'w-full'}
            />
            </div>
          </div>
        )}
        </div>
      </div>

      {!isSpinMode && (
        <>
          <Modal
            isOpen={isOpen}
            title={winnerPrompt}
            body={drawnName}
            onClose={(isClose) => setIsOpen(isClose)}
          />
          <ReactCanvasConfetti onInit={getInstance} style={confettiStyles} />
        </>
      )}
    </>
  );
};

export default Wheel;
