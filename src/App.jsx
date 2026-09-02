import { Route, Routes } from "react-router-dom";
import { useAtomValue } from "jotai";
import { darkModeState } from "./shared/globalState";
import { Analytics } from '@vercel/analytics/react';

import Nav from "./components/Nav/Nav";
import MobileNav from "./components/Nav/MobileNav";
import Home from './pages/Home';
import Features from './pages/Features';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';

import './styles/index.css';

export default function App() {
  const isDarkModeEnabled = useAtomValue(darkModeState);

  return (
    <div className={`flex flex-col min-h-screen relative overflow-x-hidden ${isDarkModeEnabled ? 'dark bg-[#0c0c14] text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <Nav />
      <div className={'flex-1 flex justify-center px-4 md:px-8'}>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/features' element={<Features/>} />
          <Route path='/privacy' element={<Privacy/>} />
          <Route path='/terms' element={<Terms/>} />
          <Route path='/cookies' element={<Cookies/>} />
        </Routes>
      </div>
      <MobileNav />

      {/* ── Footer ── */}
      <footer className="relative pb-28 md:pb-0 bg-white dark:bg-[#0c0c14]">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
      </footer>
      <Analytics />
    </div>
  );
}
