import React, { useEffect, useState } from 'react';
import questionsData from './data/questions.json';
import { CheatSheetModal } from './components/CheatSheetModal';
import { DashboardView } from './components/DashboardView';
import { ExamLobbyView } from './components/ExamLobbyView';
import { ImageLightbox } from './components/ImageLightbox';
import { Navbar } from './components/Navbar';
import { QuizWorkspace } from './components/QuizWorkspace';
import { useAppStore } from './store/useAppStore';
import { Question } from './types/question';

const questions = questionsData as Question[];

export function App() {
  const {
    activeScreen,
    setActiveScreen,
    darkMode,
    cheatSheetOpen,
    setCheatSheetOpen,
  } = useAppStore();

  const [globalLightboxSrc, setGlobalLightboxSrc] = useState<string | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100">
      {activeScreen === 'practice' ? (
        <QuizWorkspace
          mode="practice"
          questions={questions}
          title="Ôn Tập Lý Thuyết 600 Câu"
          onExit={() => setActiveScreen('dashboard')}
        />
      ) : (
        <>
          <Navbar />
          <main className="pb-24 md:pb-10">
            {activeScreen === 'dashboard' && <DashboardView questions={questions} />}
            {activeScreen === 'exam' && <ExamLobbyView questions={questions} />}
          </main>
        </>
      )}

      <CheatSheetModal
        open={cheatSheetOpen}
        questions={questions}
        onClose={() => setCheatSheetOpen(false)}
        onZoomImage={(src) => setGlobalLightboxSrc(src)}
      />

      <ImageLightbox
        src={globalLightboxSrc}
        onClose={() => setGlobalLightboxSrc(null)}
      />
    </div>
  );
}

export default App;
