import React, { useEffect } from 'react';
import questionsData from './data/questions.json';
import { DashboardScreen } from './components/DashboardScreen';
import { ExamScreen } from './components/ExamScreen';
import { HandbookScreen } from './components/HandbookScreen';
import { Navbar } from './components/Navbar';
import { PracticeScreen } from './components/PracticeScreen';
import { useAppStore } from './store/useAppStore';
import { Question } from './types/question';

const questions = questionsData as Question[];

export function App() {
  const { activeScreen, darkMode } = useAppStore();

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 transition-colors dark:bg-[#0F172A] dark:text-slate-100">
      <Navbar />
      <main className="pb-24 md:pb-12">
        {activeScreen === 'dashboard' && <DashboardScreen questions={questions} />}
        {activeScreen === 'practice' && <PracticeScreen questions={questions} />}
        {activeScreen === 'exam' && <ExamScreen questions={questions} />}
        {activeScreen === 'handbook' && <HandbookScreen questions={questions} />}
      </main>
    </div>
  );
}

export default App;
