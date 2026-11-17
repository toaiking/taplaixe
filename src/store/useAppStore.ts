import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ExamResult,
  PracticePreset,
  QuestionProgress,
  SRSBox,
  ScreenId,
} from '../types/question';

function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

function isYesterday(prevDateStr: string, todayStr: string): boolean {
  const prev = new Date(prevDateStr + 'T00:00:00');
  const today = new Date(todayStr + 'T00:00:00');
  const diffDays = Math.round((today.getTime() - prev.getTime()) / 86400000);
  return diffDays === 1;
}

interface AppState {
  darkMode: boolean;
  keywordMode: boolean;
  activeScreen: ScreenId;
  practicePreset: PracticePreset;
  srs: Record<number, QuestionProgress>;
  bookmarks: number[];
  examHistory: ExamResult[];
  streakDays: number;
  lastStudyDate: string | null;
  cheatSheetOpen: boolean;

  toggleDarkMode: () => void;
  toggleKeywordMode: () => void;
  setActiveScreen: (screen: ScreenId) => void;
  setCheatSheetOpen: (open: boolean) => void;
  navigateToPractice: (preset: PracticePreset) => void;
  recordAnswer: (questionId: number, isCorrect: boolean) => void;
  setSRSBox: (questionId: number, box: SRSBox) => void;
  toggleBookmark: (questionId: number) => void;
  saveExamResult: (result: ExamResult) => void;
  resetProgress: () => void;
}

const DEFAULT_PRESET: PracticePreset = {
  chapter: 'all',
  sourceMode: 'all',
  onlyWithImage: false,
  onlyUnmastered: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      darkMode: false,
      keywordMode: true,
      activeScreen: 'dashboard',
      practicePreset: DEFAULT_PRESET,
      srs: {},
      bookmarks: [],
      examHistory: [],
      streakDays: 1,
      lastStudyDate: null,
      cheatSheetOpen: false,

      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      toggleKeywordMode: () => set((state) => ({ keywordMode: !state.keywordMode })),

      setActiveScreen: (screen) => set({ activeScreen: screen }),

      setCheatSheetOpen: (open) => set({ cheatSheetOpen: open }),

      navigateToPractice: (preset) =>
        set({
          practicePreset: preset,
          activeScreen: 'practice',
        }),

      recordAnswer: (questionId, isCorrect) =>
        set((state) => {
          const prev = state.srs[questionId] ?? {
            box: 'unlearned' as SRSBox,
            correctCount: 0,
            wrongCount: 0,
            lastReviewed: 0,
          };

          let nextBox: SRSBox = prev.box;
          if (isCorrect) {
            if (prev.box === 'unlearned' || prev.box === 'wrong') {
              nextBox = 'learning';
            } else {
              nextBox = 'mastered';
            }
          } else {
            nextBox = 'wrong';
          }

          const today = getTodayStr();
          let nextStreak = state.streakDays || 1;
          if (state.lastStudyDate && state.lastStudyDate !== today) {
            nextStreak = isYesterday(state.lastStudyDate, today)
              ? state.streakDays + 1
              : 1;
          }

          return {
            lastStudyDate: today,
            streakDays: nextStreak,
            srs: {
              ...state.srs,
              [questionId]: {
                box: nextBox,
                correctCount: prev.correctCount + (isCorrect ? 1 : 0),
                wrongCount: prev.wrongCount + (isCorrect ? 0 : 1),
                lastReviewed: Date.now(),
              },
            },
          };
        }),

      setSRSBox: (questionId, box) =>
        set((state) => {
          const prev = state.srs[questionId] ?? {
            box: 'unlearned' as SRSBox,
            correctCount: 0,
            wrongCount: 0,
            lastReviewed: 0,
          };
          return {
            srs: {
              ...state.srs,
              [questionId]: {
                ...prev,
                box,
                lastReviewed: Date.now(),
              },
            },
          };
        }),

      toggleBookmark: (questionId) =>
        set((state) => {
          const exists = state.bookmarks.includes(questionId);
          return {
            bookmarks: exists
              ? state.bookmarks.filter((id) => id !== questionId)
              : [...state.bookmarks, questionId],
          };
        }),

      saveExamResult: (result) =>
        set((state) => ({
          examHistory: [result, ...state.examHistory].slice(0, 30),
        })),

      resetProgress: () =>
        set({
          srs: {},
          bookmarks: [],
          examHistory: [],
          streakDays: 1,
          lastStudyDate: null,
        }),
    }),
    {
      name: 'taplaixe-2025-storage',
      partialize: (state) => ({
        darkMode: state.darkMode,
        keywordMode: state.keywordMode,
        srs: state.srs,
        bookmarks: state.bookmarks,
        examHistory: state.examHistory,
        streakDays: state.streakDays,
        lastStudyDate: state.lastStudyDate,
      }),
    }
  )
);
