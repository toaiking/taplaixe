import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { ScreenId } from '../types/question';
import { InstallAppButton } from './InstallAppButton';

const NAV_ITEMS: { id: ScreenId; label: string }[] = [
  { id: 'dashboard', label: 'Trang chủ' },
  { id: 'practice', label: 'Ôn tập' },
  { id: 'exam', label: 'Thi thử' },
  { id: 'handbook', label: 'Sổ tay' },
];

export const Navbar: React.FC = () => {
  const { activeScreen, setActiveScreen, darkMode, toggleDarkMode } =
    useAppStore();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          {/* Left: App Icon + Brand Name (No "2025" text) */}
          <button
            type="button"
            onClick={() => setActiveScreen('dashboard')}
            className="flex items-center gap-2.5 text-left transition-opacity hover:opacity-85"
          >
            <img
              src="/favicon.svg"
              alt="Logo GPLX 600"
              className="h-8 w-8 rounded-lg shadow-2xs"
            />
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
              GPLX 600
            </span>
            <span
              title={`Phiên bản commit #${__APP_COMMIT__}`}
              className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400"
            >
              #{__APP_COMMIT__}
            </span>
          </button>

          {/* Center: 4 Official Tabs with fixed-height bottom underline */}
          <nav className="hidden h-16 items-stretch gap-7 md:flex">
            {NAV_ITEMS.map((item) => {
              const active = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveScreen(item.id)}
                  className={`inline-flex h-full items-center border-b-2 text-sm transition-colors ${
                    active
                      ? 'border-slate-900 font-semibold text-slate-900 dark:border-white dark:text-white'
                      : 'border-transparent font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Install + Theme Toggle */}
          <div className="flex items-center gap-2">
            <InstallAppButton />
            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label="Chuyển giao diện Sáng / Tối"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      {activeScreen !== 'practice' && (
        <nav
          aria-label="Điều hướng chính"
          className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden dark:border-slate-800 dark:bg-slate-900/95"
        >
          <div className="mx-auto flex max-w-md items-center justify-around">
            {NAV_ITEMS.map((item) => {
              const active = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveScreen(item.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                    active
                      ? 'font-semibold text-slate-900 dark:text-white'
                      : 'font-medium text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
};
