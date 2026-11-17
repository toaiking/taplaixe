import React, { useEffect, useState } from 'react';
import { BellRing, X } from 'lucide-react';
import questionsData from './data/questions.json';
import { CheatSheetView } from './components/CheatSheetView';
import { DashboardView } from './components/DashboardView';
import { ExamHubView } from './components/ExamHubView';
import { ImageLightbox } from './components/ImageLightbox';
import { Navbar } from './components/Navbar';
import { QuizWorkspace } from './components/QuizWorkspace';
import { useAppStore } from './store/useAppStore';
import { Question } from './types/question';
import { sendStudyNotification } from './utils/scheduler';

const questions = questionsData as Question[];

export function App() {
  const {
    activeScreen,
    setActiveScreen,
    darkMode,
    studySchedule,
    updateStudySchedule,
    navigateToPractice,
  } = useAppStore();
  const [globalLightboxSrc, setGlobalLightboxSrc] = useState<string | null>(null);
  const [reminderBanner, setReminderBanner] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Background Study Schedule Checker (every 30s)
  useEffect(() => {
    if (!studySchedule.enabled) return;

    const checkSchedule = () => {
      const now = new Date();
      const day = now.getDay();
      if (!studySchedule.days.includes(day)) return;

      const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}`;
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        '0'
      )}-${String(now.getDate()).padStart(2, '0')}`;

      if (hhmm === studySchedule.time && studySchedule.lastNotifiedDate !== todayStr) {
        updateStudySchedule({ lastNotifiedDate: todayStr });
        setReminderBanner(true);
        sendStudyNotification(
          'Đến giờ ôn thi GPLX 600 Câu!',
          `Mục tiêu hôm nay: ${studySchedule.dailyGoal} câu. Hãy vào ôn ngay để giữ vững phong độ!`
        );
      }
    };

    checkSchedule();
    const timer = window.setInterval(checkSchedule, 30000);
    return () => clearInterval(timer);
  }, [studySchedule, updateStudySchedule]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <Navbar />

      {/* In-app Reminder Toast Banner */}
      {reminderBanner && (
        <div className="border-b border-indigo-200 bg-indigo-50 px-6 py-3 dark:border-indigo-900 dark:bg-indigo-950/60">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-sm font-medium text-indigo-900 dark:text-indigo-100">
              <BellRing className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>
                Đã đến giờ ôn tập ({studySchedule.time}) — Mục tiêu{' '}
                <strong>{studySchedule.dailyGoal} câu</strong> hôm nay!
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setReminderBanner(false);
                  navigateToPractice({
                    chapter: 'all',
                    sourceMode: studySchedule.focusMode,
                  });
                }}
                className="rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800 dark:bg-indigo-600"
              >
                Vào ôn ngay →
              </button>
              <button
                type="button"
                onClick={() => setReminderBanner(false)}
                className="rounded-lg p-1 text-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

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
