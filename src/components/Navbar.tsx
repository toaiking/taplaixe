import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { ScreenId } from '../types/question';

export const Navbar: React.FC = () => {
  const {
    activeScreen,
    setActiveScreen,
    setCheatSheetOpen,
    darkMode,
    toggleDarkMode,
  } = useAppStore();

  const navItems: { id: ScreenId | 'cheatsheet'; label: string }[] = [
    { id: 'dashboard', label: 'Trang chủ' },
    { id: 'practice', label: 'Ôn tập' },
    { id: 'exam', label: 'Thi thử' },
    { id: 'cheatsheet', label: 'Sổ tay' },
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
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-zinc-50/90 backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-950/90">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          {/* Left: Pure Typography Brand */}
          <button
            onClick={() => setActiveScreen('dashboard')}
            className="flex items-center gap-2 text-left transition-opacity hover:opacity-80"
          >
            <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              GPLX 600
            </span>
            <span className="font-mono text-xs text-zinc-400 dark:text-zinc-600">/</span>
            <span className="font-mono text-xs text-zinc-500">2025</span>
          </button>

          {/* Center: 4 Clean Text Links */}
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => {
              const active = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`text-sm transition-colors ${
                    active
                      ? 'font-medium text-zinc-900 dark:text-zinc-100'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Single Theme Toggle Button */}
          <button
            onClick={toggleDarkMode}
            aria-label="Chuyển giao diện Sáng / Tối"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Clean Monochrome Mobile Bottom Bar */}
      <nav
        aria-label="Điều hướng chính"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200/80 bg-zinc-50/95 px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden dark:border-zinc-800/80 dark:bg-zinc-950/95"
      >
        <div className="mx-auto flex max-w-md items-center justify-around">
          {navItems.map((item) => {
            const active = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`py-1.5 text-xs transition-colors ${
                  active
                    ? 'font-semibold text-zinc-900 dark:text-zinc-100'
                    : 'font-medium text-zinc-500 dark:text-zinc-500'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
