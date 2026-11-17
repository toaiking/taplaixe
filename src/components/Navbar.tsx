import React from 'react';
import {
  BookOpen,
  CarFront,
  ClipboardCheck,
  Home,
  Lightbulb,
  Moon,
  Sparkles,
  Sun,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { ScreenId } from '../types/question';
import { InstallAppButton } from './InstallAppButton';

export const Navbar: React.FC = () => {
  const {
    activeScreen,
    setActiveScreen,
    setCheatSheetOpen,
    darkMode,
    toggleDarkMode,
    keywordMode,
    toggleKeywordMode,
  } = useAppStore();

  const navItems: { id: ScreenId | 'cheatsheet'; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Trang chủ', icon: <Home className="h-5 w-5" /> },
    { id: 'practice', label: 'Ôn tập', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'exam', label: 'Thi thử', icon: <ClipboardCheck className="h-5 w-5" /> },
    { id: 'cheatsheet', label: 'Sổ tay', icon: <Lightbulb className="h-5 w-5" /> },
  ];

  const handleNav = (id: ScreenId | 'cheatsheet') => {
    if (id === 'cheatsheet') {
      setCheatSheetOpen(true);
    } else {
      setActiveScreen(id);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-gray-900/95">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          {/* Brand */}
          <button
            onClick={() => setActiveScreen('dashboard')}
            className="flex items-center gap-2.5 text-left transition-opacity hover:opacity-85"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
              <CarFront className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-tight text-slate-900 sm:text-base dark:text-slate-100">
                GPLX 600 Câu
              </div>
              <div className="hidden text-[11px] font-medium text-slate-500 sm:block dark:text-slate-400">
                Chuẩn Cục CSGT 2025
              </div>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 md:flex dark:border-slate-800 dark:bg-slate-950">
            {navItems.map((item) => {
              const active = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
                    active
                      ? 'bg-white text-blue-600 dark:bg-gray-900 dark:text-blue-400'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  <span className="[&>svg]:h-4 [&>svg]:w-4">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <InstallAppButton />

            <button
              onClick={toggleKeywordMode}
              title="Bật/tắt Highlight Từ Khóa (H)"
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
                keywordMode
                  ? 'border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-500/40 dark:bg-amber-950/50 dark:text-amber-200'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Từ khóa</span>
            </button>

            <button
              onClick={toggleDarkMode}
              aria-label="Chuyển giao diện Sáng / Tối"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar */}
      <nav
        aria-label="Điều hướng chính"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden dark:border-slate-800 dark:bg-gray-900/95"
      >
        <div className="mx-auto flex max-w-md items-center justify-around">
          {navItems.map((item) => {
            const active = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1 text-[11px] font-semibold transition-colors ${
                  active
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                <div
                  className={`flex h-7 w-11 items-center justify-center rounded-full ${
                    active ? 'bg-blue-50 dark:bg-blue-950/50' : ''
                  }`}
                >
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
