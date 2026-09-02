import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAtom } from 'jotai';
import { darkModeState, namesListState, removeState, winnerPromptEnabledState, confettiEnabledState } from '../../shared/globalState';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import List from '../List';
import WinnerMessage from '../WinnerMessage';
import Toggle from '../Toggle';

/* ── Spring config ─────────────────────────────────────────── */
const sheetSpring = { type: 'spring', stiffness: 380, damping: 36, mass: 0.9 };

/* ── Shared style constants ────────────────────────────────── */
const pageLinkClass =
  'flex items-center gap-3 px-3 py-3 rounded-xl text-[0.84rem] font-medium text-gray-600 dark:text-gray-400 active:bg-indigo-500/10 dark:active:bg-indigo-400/10 transition-all duration-150 [-webkit-tap-highlight-color:transparent]';

const bottomBarItemClass =
  'flex flex-col items-center gap-[5px] px-2 py-1.5 rounded-[10px] text-[0.65rem] font-semibold uppercase tracking-[0.06em] text-gray-500 dark:text-gray-500 active:bg-indigo-500/10 dark:active:bg-indigo-400/10 transition-all duration-150 [-webkit-tap-highlight-color:transparent] cursor-pointer select-none';

/* ── Component ─────────────────────────────────────────────── */
const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useAtom(darkModeState);
  const [namesList, setNamesList] = useAtom(namesListState);
  const [shouldRemoveName, setShouldRemoveName] = useAtom(removeState);
  const [isWinnerPromptEnabled, setIsWinnerPromptEnabled] = useAtom(winnerPromptEnabledState);
  const [isConfettiEnabled, setIsConfettiEnabled] = useAtom(confettiEnabledState);
  const contentRef = useRef(null);
  const touchStartY = useRef(0);

  /* Lock body scroll when sheet is open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const close = useCallback(() => setIsOpen(false), []);

  /* Drag-to-dismiss */
  const handleDragEnd = useCallback((_, info) => {
    if (info.offset.y > 64 || info.velocity.y > 280) close();
  }, [close]);

  /* Swipe-down on scrollable content when at top */
  const handleTouchStart = useCallback((e) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);
  const handleTouchEnd = useCallback((e) => {
    const delta = e.changedTouches[0].clientY - touchStartY.current;
    if (delta > 80 && contentRef.current && contentRef.current.scrollTop <= 0) close();
  }, [close]);

  return (
    <div className="md:hidden">
      {/* ── FAB Toggle ──────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]
          flex items-center gap-2 h-10 px-[18px] rounded-full
          bg-white/92 dark:bg-gray-900/92
          border border-indigo-500/20 dark:border-indigo-400/15
          backdrop-blur-[14px]
          shadow-[0_4px_20px_rgba(0,0,0,0.14),0_0_0_1px_rgba(99,102,241,0.18)]
          dark:shadow-[0_4px_24px_rgba(0,0,0,0.35),0_0_0_1px_rgba(129,140,248,0.15)]
          text-gray-600 dark:text-indigo-300
          active:scale-[0.96] transition-transform
          focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-[3px]
          cursor-pointer [-webkit-tap-highlight-color:transparent] select-none
          ${isOpen ? 'pointer-events-none opacity-0' : ''}`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.08em]">菜单</span>
      </button>

      {/* ── Sheet + Backdrop ────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="sheet-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9998] bg-black/35 backdrop-blur-[3px]"
              onClick={close}
            />

            {/* Bottom Sheet */}
            <motion.div
              key="sheet-panel"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={sheetSpring}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.35 }}
              onDragEnd={handleDragEnd}
              className="fixed bottom-0 left-0 right-0 z-[9999] flex flex-col max-h-[82vh]
                rounded-t-[20px]
                bg-white/[0.97] dark:bg-[#0c0c14]/[0.97]
                backdrop-blur-[20px]
                border-t border-indigo-500/[0.18] dark:border-indigo-400/[0.15]
                shadow-[0_-8px_40px_rgba(0,0,0,0.14)] dark:shadow-[0_-8px_40px_rgba(0,0,0,0.55)]"
            >
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-3 cursor-grab active:cursor-grabbing">
                <div className="w-9 h-1 rounded-full bg-indigo-500/25 dark:bg-indigo-400/20" />
              </div>

              {/* ── Scrollable Content ──────────────────────── */}
              <div
                ref={contentRef}
                className="flex-1 overflow-y-auto px-4 pb-3 flex flex-col gap-5
                  [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden"
                onPointerDownCapture={(e) => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >

                {/* Settings */}
                <section>
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-gray-400 dark:text-gray-600 pb-2 mb-2 border-b border-indigo-500/10 dark:border-indigo-400/10">
                    设置
                  </p>
                  <div className="flex flex-col gap-3">
                    <div>
                      <p className="section-label mb-2">参与者</p>
                      <List
                        value={namesList}
                        onChange={(e) => setNamesList(e)}
                        onClear={() => setNamesList([])}
                      />
                    </div>
                    <div className="border-t border-gray-100 dark:border-gray-800/50" />
                    <div>
                      <p className="section-label">自定义</p>
                      <WinnerMessage />
                    </div>
                    <div className="border-t border-gray-100 dark:border-gray-800/50" />
                    <div>
                      <p className="section-label mb-2">行为</p>
                      <div className="flex flex-col gap-2.5">
                      <Toggle
                        isOn={shouldRemoveName}
                        handleToggle={() => setShouldRemoveName(!shouldRemoveName)}
                        label="抽中后移除"
                        hiddenMobile={false}
                      />
                      <Toggle
                        isOn={isWinnerPromptEnabled}
                        handleToggle={() => setIsWinnerPromptEnabled(!isWinnerPromptEnabled)}
                        label="显示中奖提示"
                        hiddenMobile={false}
                      />
                      <Toggle
                        isOn={isConfettiEnabled}
                        handleToggle={() => setIsConfettiEnabled(!isConfettiEnabled)}
                        label="显示彩带特效"
                        hiddenMobile={false}
                      />
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* ── Bottom Bar ──────────────────────────────── */}
              <div
                className="flex items-center justify-around border-t border-indigo-500/10 dark:border-indigo-400/10 px-4 pt-3"
                style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom))' }}
              >
                <Link to="/" onClick={close} className={bottomBarItemClass}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  首页
                </Link>

                <Link to="/features" onClick={close} className={bottomBarItemClass}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  功能特性
                </Link>

                <button onClick={close} className={bottomBarItemClass}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  关闭
                </button>

                <div className={bottomBarItemClass}>
                  <DarkModeSwitch
                    checked={isDarkMode}
                    onChange={() => setIsDarkMode(d => !d)}
                    size={16}
                    moonColor="#818cf8"
                    sunColor="#f59e0b"
                  />
                  {isDarkMode ? '深色' : '浅色'}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileNav;
