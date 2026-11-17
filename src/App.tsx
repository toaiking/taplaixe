import React, { useEffect, useState } from 'react';
import questionsData from './data/questions.json';
import { CheatSheetView } from './components/CheatSheetView';
import { DashboardView } from './components/DashboardView';
import { ExamHubView } from './components/ExamHubView';
import { ImageLightbox } from './components/ImageLightbox';
import { Navbar } from './components/Navbar';
import { QuizWorkspace } from './components/QuizWorkspace';
import { useAppStore } from './store/useAppStore';
import { Question } from './types/question';

const questions = questionsData as Question[];

export function App() {
  const { activeScreen, setActiveScreen, darkMode } = useAppStore();
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
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <Navbar />

      <main className="flex flex-1 flex-col pb-20 md:pb-8">
        {activeScreen === 'dashboard' && <DashboardView questions={questions} />}
        {activeScreen === 'practice' && (
          <QuizWorkspace
            mode="practice"
            questions={questions}
            title="Ôn Tập Lý Thuyết 600 Câu"
            onExit={() => setActiveScreen('dashboard')}
          />
        )}
        {activeScreen === 'exam' && <ExamHubView questions={questions} />}
        {activeScreen === 'handbook' && (
          <CheatSheetView
            questions={questions}
            onZoomImage={(src) => setGlobalLightboxSrc(src)}
          />
        )}
      </main>

      <ImageLightbox
        src={globalLightboxSrc}
        onClose={() => setGlobalLightboxSrc(null)}
      />
    </div>
  );
}

export default App;
