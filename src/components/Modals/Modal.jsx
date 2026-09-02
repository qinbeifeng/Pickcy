import { Fragment, useState, useEffect, useCallback } from 'react'
import { Dialog, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import {darkModeState} from '../../shared/globalState';
import {useAtomValue} from "jotai";

const IDLE_DELAY = 2000;

const Modal = (props) => {
  const isDarkModeEnabled = useAtomValue(darkModeState);
  const [idle, setIdle] = useState(false);
  const [hovered, setHovered] = useState(false);

  const resetIdle = useCallback(() => {
    setIdle(false);
  }, []);

  useEffect(() => {
    if (!props.isOpen) {
      setIdle(false);
      setHovered(false);
      return;
    }
    const timer = setTimeout(() => setIdle(true), IDLE_DELAY);
    const onActivity = () => {
      setIdle(false);
      clearTimeout(timer);
    };
    window.addEventListener('mousemove', onActivity, { once: true });
    window.addEventListener('touchstart', onActivity, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', onActivity);
      window.removeEventListener('touchstart', onActivity);
    };
  }, [props.isOpen, idle]);

  return (
    <Transition appear show={props.isOpen} as={Fragment}>
      <Dialog
        as="div"
        className={`fixed inset-0 z-[60] overflow-y-auto ${isDarkModeEnabled ? 'dark' : ''}`}
        onClose={() => props.onClose(false)}
      >
        <div
          className="min-h-screen px-4 flex items-center justify-center cursor-pointer"
          onClick={() => props.onClose(false)}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" aria-hidden="true" />
          </TransitionChild>

          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-90 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-90 translate-y-4"
          >
            <div
              className={`relative w-full max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 text-center cursor-pointer ring-2 transition-all duration-300 ${
                hovered
                  ? 'ring-violet-500/70 dark:ring-violet-400/60 animate-pulse-ring'
                  : 'ring-violet-500/40 dark:ring-violet-500/30'
              }`}
              onClick={() => props.onClose(false)}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >

              <DialogTitle
                as="p"
                className={`text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 transition-all duration-300 ${props.title ? 'opacity-100 h-auto mb-5' : 'opacity-0 h-0 mb-0'}`}
              >
                {props.title}
              </DialogTitle>

              <p className="text-5xl font-extrabold bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent break-words leading-tight py-2">
                {props.body}
              </p>

              <p className={`text-xs text-gray-300 dark:text-gray-600 tracking-wide transition-all duration-300 overflow-hidden ${hovered || idle ? 'opacity-100 max-h-8 mt-8' : 'opacity-0 max-h-0 mt-0'}`}>
                <span className="hidden md:inline">点击此处关闭</span>
                <span className="md:hidden">轻触此处关闭</span>
              </p>

              <button className="h-0 w-0 overflow-hidden" />
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
