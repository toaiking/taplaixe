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

const NAV_ITEMS: { id: ScreenId; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Trang chủ', icon: <Home className="h-5 w-5" /> },
  { id: 'practice', label: 'Ôn tập', icon: <BookOpen className="h-5 w-5" /> },
  { id: 'exam', label: 'Thi thử', icon: <ClipboardCheck className="h-5 w-5" /> },
  { id: 'handbook', label: 'Sổ tay', icon: <Lightbulb className="h-5 w-5" /> },
];

export const Navbar: React.FC = () => {
  const {
    activeScreen,
    setActiveScreen,
    darkMode,
    toggleDarkMode,
    keywordMode,
    toggleKeywordMode,
  } = useAppStore();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
          {/* Brand (Zutobi-inspired clean pill icon) */}
          <button
            onClick={() => setActiveScreen('dashboard')}
            className="flex items-center gap-2.5 text-left transition-opacity hover:opacity-85"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-emerald-600 text-white shadow-sm shadow-teal-600/25">
              <CarFront className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-tight text-slate-900 sm:text-base dark:text-white">
                GPLX 600
              </div>
              <div className="hidden text-[11px] font-medium text-slate-500 sm:block dark:text-slate-400">
                Chuẩn Cục CSGT 2025
              </div>
            </div>
          </button>

          {/* Desktop Centered Nav */}
          <nav className="hidden items-center gap-1 rounded-full bg-slate-100 p-1 md:flex dark:bg-slate-800">
            {NAV_ITEMS.map((item) => {
              const active = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveScreen(item.id)}
                  className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                    active
                      ? 'bg-white text-teal-700 shadow-xs dark:bg-slate-900 dark:text-teal-400'
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
              title="Bật/tắt tô sáng từ khóa quyết định"
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                keywordMode
                  ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-300'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Từ khóa</span>
              <span className="rounded-full bg-black/5 px-1.5 py-0.5 text-[10px] font-bold uppercase dark:bg-white/10">
                {keywordMode ? 'Bật' : 'Tắt'}
              </span>
            </button>

            <button
              onClick={toggleDarkMode}
              aria-label="Chuyển giao diện Sáng / Tối"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Native-style Fixed Mobile Bottom Tab Bar */}
      <nav
        aria-label="Điều hướng chính"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden dark:border-slate-800 dark:bg-slate-900/95"
      >
        <div className="mx-auto flex max-w-md items-center justify-around">
          {NAV_ITEMS.map((item) => {
            const active = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1 text-[11px] font-semibold transition-all ${
                  active
                    ? 'text-teal-700 dark:text-teal-400'
                    : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                }`}
              >
                <div
                  className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${
                    active ? 'bg-teal-50 dark:bg-teal-500/15' : ''
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
