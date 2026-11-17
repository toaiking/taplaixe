import React, { useCallback, useEffect, useState } from 'react';
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
import {
  createBackgroundTicker,
  ensurePushSubscription,
  getTodayStr,
  isScheduleDueNow,
  sendStudyNotification,
  syncScheduleWithBackground,
} from './utils/scheduler';

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

  // Handle Service Worker notification click or ?reminder=1 query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('reminder') === '1') {
      window.history.replaceState({}, '', '/');
      navigateToPractice({
        chapter: 'all',
        sourceMode: studySchedule.focusMode,
      });
    }

    if ('serviceWorker' in navigator) {
      const onSwMessage = (event: MessageEvent) => {
        if (event.data?.type === 'NOTIFICATION_CLICKED') {
          navigateToPractice({
            chapter: 'all',
            sourceMode: studySchedule.focusMode,
          });
        }
      };
      navigator.serviceWorker.addEventListener('message', onSwMessage);
      return () =>
        navigator.serviceWorker.removeEventListener('message', onSwMessage);
    }
  }, [navigateToPractice, studySchedule.focusMode]);

  const checkSchedule = useCallback(() => {
    if (!studySchedule.enabled) return;

    // Pre-sync with Service Worker & Web Push if target time is approaching
    syncScheduleWithBackground(studySchedule).catch(() => {});

    const now = new Date();
    if (
      isScheduleDueNow(
        studySchedule.time,
        studySchedule.days,
        studySchedule.lastNotifiedDate,
        now
      )
    ) {
      const todayStr = getTodayStr(now);
      updateStudySchedule({ lastNotifiedDate: todayStr });
      setReminderBanner(true);
      sendStudyNotification(
        'Đến giờ ôn thi GPLX 600 Câu!',
        `Mục tiêu hôm nay: ${studySchedule.dailyGoal} câu. Bấm để vào ôn tập ngay!`
      );
    }
  }, [studySchedule, updateStudySchedule]);

  // Run schedule checker in a Web Worker every 10s + on mobile wake/visibilitychange/pagehide
  useEffect(() => {
    if (!studySchedule.enabled) return;

    ensurePushSubscription().catch(() => {});
    checkSchedule();

    const stopWorker = createBackgroundTicker(checkSchedule, 10000);

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkSchedule();
      } else {
        // When user switches away or locks screen on mobile, immediately sync upcoming schedule to SW + Web Push
        syncScheduleWithBackground(studySchedule).catch(() => {});
      }
    };
    const onPageHide = () => {
      syncScheduleWithBackground(studySchedule).catch(() => {});
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', checkSchedule);
    window.addEventListener('pagehide', onPageHide);

    return () => {
      stopWorker();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', checkSchedule);
      window.removeEventListener('pagehide', onPageHide);
    };
  }, [studySchedule, checkSchedule]);

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
