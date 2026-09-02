import { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useAtom, useAtomValue } from 'jotai';
import { namesListState, winnerMessageState, darkModeState, winnerPromptEnabledState, confettiEnabledState } from '../shared/globalState';
import useConfetti, { confettiStyles } from '../shared/useConfetti';
import Modal from './Modals/Modal';
import ReactCanvasConfetti from 'react-canvas-confetti';

const CANVAS_SIZE = 600;
const DPR = window.devicePixelRatio || 1;

const SEG_COLORS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#ec4899',
  '#f43f5e', '#f97316', '#f59e0b', '#10b981',
  '#06b6d4', '#3b82f6', '#84cc16', '#6366f1',
];

function truncate(str, max) {
  return str.length > max ? str.slice(0, max - 1) + '…' : str;
}

export default function SpinWheel({ removeName }) {
  const canvasRef = useRef(null);
  const rotationRef = useRef(0);
  const animRef = useRef(null);
  const speedRef = useRef(0);
  const modeRef = useRef('idle'); // 'idle' | 'spinning' | 'decelerating'

  const [spinning, setSpinning] = useState(false);
  const [decelerating, setDecelerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [drawnName, setDrawnName] = useState('');

  const [namesList, setNamesList] = useAtom(namesListState);
  const winnerMessage = useAtomValue(winnerMessageState);
  const isDarkMode = useAtomValue(darkModeState);
  const isWinnerPromptEnabled = useAtomValue(winnerPromptEnabledState);
  const isConfettiEnabled = useAtomValue(confettiEnabledState);

  const names = (() => {
    const raw = typeof namesList === 'string' ? namesList : '';
    return raw.split('\n').map(s => s.replace(/\s+$/, '')).filter(Boolean);
  })();

  const isEmpty = names.length === 0;

  const winnerPrompt = isWinnerPromptEnabled
    ? (winnerMessage && winnerMessage.length > 0 ? winnerMessage : '🎉 恭喜，中奖者是...')
    : '';

  const drawWheel = useCallback((rot, dark = isDarkMode) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const sz = CANVAS_SIZE * DPR;
    const cx = sz / 2;
    const cy = sz / 2;
    const radius = sz / 2 - 4 * DPR;
    const n = names.length;

    ctx.clearRect(0, 0, sz, sz);

    if (n === 0) {
      // Empty state — matches the list view card theme
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
      ctx.fillStyle = dark ? '#1f2937' : '#ffffff'; // card: bg-white dark:bg-gray-800
      ctx.fill();
      ctx.strokeStyle = dark ? 'rgba(55,65,81,0.5)' : '#f3f4f6'; // dark:border-gray-700/50 / border-gray-100
      ctx.lineWidth = 2 * DPR;
      ctx.stroke();

      // Icon circle: bg-indigo-50 dark:bg-indigo-900/20  (circular)
      const iconCY = cy - 32 * DPR;
      ctx.beginPath();
      ctx.arc(cx, iconCY, 32 * DPR, 0, 2 * Math.PI);
      ctx.fillStyle = dark ? 'rgba(49,27,146,0.2)' : '#eef2ff';
      ctx.fill();

      // Group/people icon (same SVG path as list empty state), drawn via Path2D
      const iconScale = 1.5 * DPR;
      ctx.save();
      ctx.translate(cx - 12 * iconScale, iconCY - 12 * iconScale);
      ctx.scale(iconScale, iconScale);
      ctx.strokeStyle = '#818cf8';
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke(new Path2D('M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'));
      ctx.restore();

      // "No participants yet": text-gray-500 dark:text-gray-400
      ctx.fillStyle = dark ? '#9ca3af' : '#6b7280';
      ctx.font = `600 ${16 * DPR}px system-ui,-apple-system,sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('还没有参与者', cx, cy + 24 * DPR);

      // Hint: text-gray-400 dark:text-gray-500
      ctx.fillStyle = dark ? '#6b7280' : '#9ca3af';
      ctx.font = `${14 * DPR}px system-ui,-apple-system,sans-serif`;
      ctx.fillText('打开设置添加名字', cx, cy + 46 * DPR);
      return;
    }

    const seg = (2 * Math.PI) / n;
    const maxChars = n <= 6 ? 16 : n <= 12 ? 11 : n <= 20 ? 8 : 6;
    const fontSize = (n <= 8 ? 13 : n <= 16 ? 11 : 9) * DPR;

    for (let i = 0; i < n; i++) {
      const sa = -Math.PI / 2 + rot + i * seg;
      const ea = sa + seg;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, sa, ea);
      ctx.closePath();
      ctx.fillStyle = SEG_COLORS[i % SEG_COLORS.length];
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label
      const midA = sa + seg / 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(midA);
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.font = `600 ${fontSize}px system-ui,-apple-system,sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 3;
      ctx.fillText(truncate(names[i], maxChars), radius * 0.88, 0);
      ctx.restore();
    }

    // Outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Center hub
    ctx.beginPath();
    ctx.arc(cx, cy, 14 * DPR, 0, 2 * Math.PI);
    const hub = ctx.createRadialGradient(cx - 3, cy - 3, 2, cx, cy, 14);
    hub.addColorStop(0, '#c4b5fd');
    hub.addColorStop(1, '#4f46e5');
    ctx.fillStyle = hub;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [names, isDarkMode]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    drawWheel(rotationRef.current);
  }, [drawWheel]);

  useEffect(() => () => { if (animRef.current) cancelAnimationFrame(animRef.current); }, []);

  const { getInstance, fire } = useConfetti();

  /* 结算：根据当前旋转角度确定指针所指向的扇形 */
  const finishSpin = useCallback(() => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
    modeRef.current = 'idle';
    speedRef.current = 0;
    setSpinning(false);
    setDecelerating(false);

    const n = names.length;
    const seg = (2 * Math.PI) / n;
    const rot = rotationRef.current;
    // 指针在顶部（-π/2），扇形 i 中心对齐指针时满足 rot ≡ -(i + 0.5) * seg (mod 2π)
    let winnerIdx = Math.round((-rot / seg) - 0.5);
    winnerIdx = ((winnerIdx % n) + n) % n;

    if (removeName) {
      setNamesList(names.filter((_, i) => i !== winnerIdx).join('\n'));
    }
    setDrawnName(names[winnerIdx]);
    setIsOpen(true);
    if (isConfettiEnabled) fire();
  }, [names, removeName, setNamesList, isConfettiEnabled, fire]);

  /* 开始旋转：持续加速到目标转速，等待用户手动暂停 */
  const startSpin = useCallback(() => {
    if (modeRef.current !== 'idle' || names.length === 0) return;
    modeRef.current = 'spinning';
    setSpinning(true);
    setDecelerating(false);

    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1); // 秒，防止切后台后跳帧
      last = now;

      if (modeRef.current === 'spinning') {
        const target = 8; // 目标转速 rad/s
        speedRef.current = Math.min(speedRef.current + dt * 24, target);
      } else if (modeRef.current === 'decelerating') {
        speedRef.current *= Math.pow(0.05, dt); // 指数减速，像轮盘一样逐渐慢下来
        if (speedRef.current < 0.02) {
          finishSpin();
          return;
        }
      }

      rotationRef.current += speedRef.current * dt;
      drawWheel(rotationRef.current);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
  }, [names, drawWheel, finishSpin]);

  /* 暂停：触发减速定格 */
  const requestStop = useCallback(() => {
    if (modeRef.current === 'spinning') {
      modeRef.current = 'decelerating';
      setDecelerating(true);
    }
  }, []);

  return (
    <>
      {/* Wheel canvas with pointer */}
      <div className='relative flex items-center justify-center w-full'>
        {/* Downward-pointing pointer above the wheel */}
        <div
          className='absolute z-10'
          style={{
            top: 0,
            left: '50%',
            transform: 'translate(-50%, -6px)',
            width: 0, height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '20px solid #6366f1',
            filter: 'drop-shadow(0 2px 6px rgba(99,102,241,0.5))',
          }}
        />
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE * DPR}
          height={CANVAS_SIZE * DPR}
          className={`rounded-full transition duration-500 ease-in-out ${isEmpty ? '' : 'shadow-xl shadow-indigo-500/20'}`}
          style={{ width: '100%', maxWidth: CANVAS_SIZE, aspectRatio: '1' }}
        />
        {/* Clickable center hub overlay — tap to spin */}
        {!isEmpty && (
        <button
          onClick={!spinning ? startSpin : requestStop}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-200 ${
            decelerating
              ? 'cursor-not-allowed opacity-80'
              : 'cursor-pointer hover:scale-110 active:scale-95'
          }`}
          style={{
            width: '15%',
            height: '15%',
            background: 'radial-gradient(circle at 40% 40%, #c4b5fd, #4f46e5)',
            boxShadow: '0 2px 12px rgba(99,102,241,0.4)',
            border: '2px solid rgba(255,255,255,0.9)',
          }}
          title={spinning ? (decelerating ? '减速中…' : '点击暂停') : '开始旋转！'}
        >
          {spinning ? (
            <svg className='w-5 h-5 sm:w-4 sm:h-4 animate-spin text-white' fill='none' viewBox='0 0 24 24'>
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
              <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
            </svg>
          ) : (
            <svg className='w-5 h-5 sm:w-4 sm:h-4 text-white drop-shadow-sm' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z' />
            </svg>
          )}
        </button>
        )}
      </div>

      {/* Hint text — positioned absolutely so it doesn't affect layout */}
      <div className='relative w-full h-0'>
        {!isEmpty && !spinning && (
          <p className='absolute left-0 right-0 top-1 text-xs text-gray-400 dark:text-gray-500 text-center animate-pulse'>
            点击中心开始旋转，再次点击暂停
          </p>
        )}
      </div>

      <Modal
        isOpen={isOpen}
        title={winnerPrompt}
        body={drawnName}
        onClose={(v) => setIsOpen(v)}
      />
      {createPortal(
        <ReactCanvasConfetti onInit={getInstance} style={confettiStyles} />,
        document.body
      )}
    </>
  );
}
