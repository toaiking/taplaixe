import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertOctagon,
  ArrowLeft,
  Bookmark,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Flame,
  LayoutGrid,
  Lightbulb,
  Send,
  Sparkles,
  Trophy,
  X,
  Zap,
} from 'lucide-react';
import { CHAPTERS } from '../data/chapters';
import { useAppStore } from '../store/useAppStore';
import { ExamResult, PracticeSourceMode, Question } from '../types/question';
import { hapticError, hapticSuccess, hapticTap } from '../utils/haptics';
import { getQuestionExplanation } from '../utils/mnemonics';
import { BottomSheet } from './BottomSheet';
import { ImageLightbox } from './ImageLightbox';
import { QuestionCard } from './QuestionCard';
import { QuestionMatrix } from './QuestionMatrix';

interface QuizWorkspaceProps {
  mode: 'practice' | 'exam';
  questions: Question[];
  title: string;
  examMeta?: {
    key?: string;
    durationMinutes: number;
    passScore: number;
    requireNoCriticalError: boolean;
  };
  onExit: () => void;
  onRestartExam?: () => void;
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const QuizWorkspace: React.FC<QuizWorkspaceProps> = ({
  mode,
  questions: initialQuestions,
  title,
  examMeta,
  onExit,
  onRestartExam,
}) => {
  const {
    practicePreset,
    srs,
    bookmarks,
    keywordMode,
    autoAdvance,
    toggleKeywordMode,
    toggleAutoAdvance,
    recordAnswer,
    toggleBookmark,
    saveExamResult,
    setCheatSheetOpen,
    cheatSheetOpen,
  } = useAppStore();

  const [studyMode, setStudyMode] = useState<'learn' | 'test'>(
    mode === 'exam' ? 'test' : 'learn'
  );
  const [chapterFilter, setChapterFilter] = useState<number | 'all'>(
    mode === 'practice' ? practicePreset.chapter : 'all'
  );
  const [sourceFilter] = useState<PracticeSourceMode>(
    mode === 'practice' ? practicePreset.sourceMode : 'all'
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [eliminated, setEliminated] = useState<Record<number, number[]>>({});
  const [timeLeft, setTimeLeft] = useState(
    examMeta ? examMeta.durationMinutes * 60 : 0
  );
  const [showDrawer, setShowDrawer] = useState(false);
  const [showMatrixSheet, setShowMatrixSheet] = useState(false);
  const [showExplanationSheet, setShowExplanationSheet] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const autoAdvanceTimerRef = useRef<number | null>(null);
  const optionLongPressRef = useRef<number | null>(null);
  const optionLongPressedRef = useRef<boolean>(false);

  useEffect(() => {
    if (mode === 'practice') {
      setChapterFilter(practicePreset.chapter);
      setCurrentIndex(0);
    }
  }, [mode, practicePreset]);

  useEffect(() => {
    setShowExplanationSheet(false);
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
        autoAdvanceTimerRef.current = null;
      }
    };
  }, [currentIndex]);

  const activeQuestions = useMemo(() => {
    if (mode === 'exam') return initialQuestions;

    let list = initialQuestions.filter((q) => {
      if (chapterFilter !== 'all' && q.chapter !== chapterFilter) return false;
      if (practicePreset.onlyWithImage && !q.image) return false;
      const box = srs[q.id]?.box ?? 'unlearned';
      if (practicePreset.onlyUnmastered && box === 'mastered') return false;

      if (sourceFilter === 'critical' && !q.isCritical) return false;
      if (sourceFilter === 'wrong' && box !== 'wrong') return false;
      if (sourceFilter === 'bookmarked' && !bookmarks.includes(q.id)) return false;
      if (sourceFilter === 'speed_distance') {
        const lower = q.question.toLowerCase();
        if (!lower.includes('tốc độ') && !lower.includes('khoảng cách')) return false;
      }
      if (sourceFilter === 'taplo') {
        if (!((q.id >= 227 && q.id <= 231) || (q.id >= 286 && q.id <= 300))) return false;
      }
      if (sourceFilter === 'csgt_markings') {
        const lower = q.question.toLowerCase();
        if (
          q.id !== 36 &&
          q.id !== 37 &&
          !lower.includes('cảnh sát giao thông') &&
          !lower.includes('vạch')
        ) {
          return false;
        }
      }
      return true;
    });

    if (sourceFilter === 'srs') {
      const priority = { wrong: 0, unlearned: 1, learning: 2, mastered: 3 };
      list = [...list].sort((a, b) => {
        const pa = priority[srs[a.id]?.box ?? 'unlearned'];
        const pb = priority[srs[b.id]?.box ?? 'unlearned'];
        if (pa !== pb) return pa - pb;
        return a.id - b.id;
      });
    }

    return list;
  }, [
    mode,
    initialQuestions,
    chapterFilter,
    sourceFilter,
    practicePreset,
    srs,
    bookmarks,
  ]);

  const safeIndex = Math.min(currentIndex, Math.max(0, activeQuestions.length - 1));
  const currentQ = activeQuestions[safeIndex];

  const goNext = () => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    setCurrentIndex((i) => Math.min(activeQuestions.length - 1, i + 1));
  };

  const goPrev = () => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    setCurrentIndex((i) => Math.max(0, i - 1));
  };

  const handleSelectOption = (optIdx: number) => {
    if (!currentQ || examResult) return;
    if (studyMode === 'learn' && answers[currentQ.id] !== undefined) return;

    const isCorrect = optIdx === currentQ.correctAnswer;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: optIdx }));

    if (studyMode === 'learn') {
      recordAnswer(currentQ.id, isCorrect);
      if (isCorrect) {
        hapticSuccess();
        if (autoAdvance && safeIndex < activeQuestions.length - 1) {
          autoAdvanceTimerRef.current = window.setTimeout(() => {
            setCurrentIndex((i) => Math.min(activeQuestions.length - 1, i + 1));
          }, 700);
        }
      } else {
        hapticError();
        if (window.innerWidth < 1024) {
          setShowExplanationSheet(true);
        }
      }
    } else {
      hapticTap();
    }
  };

  const toggleEliminateOption = (qId: number, optIdx: number) => {
    hapticTap();
    setEliminated((prev) => {
      const cur = prev[qId] ?? [];
      const next = cur.includes(optIdx)
        ? cur.filter((x) => x !== optIdx)
        : [...cur, optIdx];
      return { ...prev, [qId]: next };
    });
  };

  const handleSubmit = () => {
    let correctCount = 0;
    let failedByCritical = false;
    const requireNoCrit = examMeta?.requireNoCriticalError ?? true;

    for (const q of activeQuestions) {
      const userAns = answers[q.id];
      const isCorrect = userAns === q.correctAnswer;
      if (isCorrect) {
        correctCount++;
      } else if (q.isCritical && requireNoCrit) {
        failedByCritical = true;
      }
      if (userAns !== undefined) {
        recordAnswer(q.id, isCorrect);
      }
    }

    const passScore =
      examMeta?.passScore ?? Math.ceil(activeQuestions.length * 0.85);
    const passed = !failedByCritical && correctCount >= passScore;
    const durationSec = examMeta
      ? examMeta.durationMinutes * 60 - timeLeft
      : 0;

    const result: ExamResult = {
      id: `${Date.now()}`,
      examKey: examMeta?.key,
      examName: title,
      date: Date.now(),
      totalQuestions: activeQuestions.length,
      correctCount,
      passScore,
      passed,
      failedByCritical,
      durationSeconds: durationSec,
      questionIds: activeQuestions.map((q) => q.id),
      answers,
    };

    if (mode === 'exam') {
      saveExamResult(result);
    }
    setShowSubmitModal(false);
    setExamResult(result);
  };

  useEffect(() => {
    if (mode !== 'exam' || examResult) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [mode, timeLeft, examResult]);

  // Global Keyboard Shortcuts: 1-4, Arrows, Enter, H, Z, B, Space, G
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        showSubmitModal ||
        showMatrixSheet ||
        showExplanationSheet ||
        cheatSheetOpen ||
        examResult
      ) {
        return;
      }
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLSelectElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (lightboxSrc) {
        if (e.key === 'Escape' || e.key.toLowerCase() === 'z') {
          e.preventDefault();
          setLightboxSrc(null);
        }
        return;
      }

      if (e.key.toLowerCase() === 'g') {
        e.preventDefault();
        setShowDrawer((v) => !v);
        return;
      }

      if (showDrawer) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setShowDrawer(false);
        }
        return;
      }

      if (['1', '2', '3', '4'].includes(e.key)) {
        if (!currentQ) return;
        const idx = parseInt(e.key, 10) - 1;
        if (idx < currentQ.options.length) {
          e.preventDefault();
          handleSelectOption(idx);
        }
      } else if (
        e.key === 'ArrowRight' ||
        e.key === 'ArrowDown' ||
        e.key === 'Enter'
      ) {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goPrev();
      } else if (e.key.toLowerCase() === 'h') {
        e.preventDefault();
        toggleKeywordMode();
      } else if (e.key.toLowerCase() === 'z') {
        if (currentQ?.image) {
          e.preventDefault();
          setLightboxSrc(currentQ.image);
        }
      } else if (e.key.toLowerCase() === 'b' || e.key === ' ') {
        if (currentQ) {
          e.preventDefault();
          toggleBookmark(currentQ.id);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    currentQ,
    activeQuestions.length,
    lightboxSrc,
    showDrawer,
    showSubmitModal,
    showMatrixSheet,
    showExplanationSheet,
    cheatSheetOpen,
    examResult,
    answers,
    studyMode,
    autoAdvance,
  ]);

  const answeredCount = useMemo(
    () => activeQuestions.filter((q) => answers[q.id] !== undefined).length,
    [activeQuestions, answers]
  );

  // EXAM RESULT VIEW
  if (examResult) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pb-20 dark:bg-slate-950">
        <div className="mx-auto max-w-5xl space-y-5 p-4 md:p-6">
          <div
            className={`rounded-2xl border-2 p-6 ${
              examResult.passed
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                : 'border-rose-500 bg-rose-50 dark:bg-rose-950/30'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white ${
                    examResult.passed ? 'bg-emerald-600' : 'bg-rose-600'
                  }`}
                >
                  {examResult.passed ? (
                    <Trophy className="h-7 w-7" />
                  ) : (
                    <AlertOctagon className="h-7 w-7" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    Kết quả: {examResult.examName}
                  </div>
                  <h1
                    className={`text-2xl font-extrabold ${
                      examResult.passed
                        ? 'text-emerald-800 dark:text-emerald-300'
                        : 'text-rose-800 dark:text-rose-300'
                    }`}
                  >
                    {examResult.passed
                      ? 'ĐẠT SÁT HẠCH!'
                      : examResult.failedByCritical
                        ? 'TRƯỢT NGAY LẬP TỨC — SAI CÂU ĐIỂM LIỆT'
                        : 'CHƯA ĐẠT — CẦN ÔN THÊM'}
                  </h1>
                  <p className="mt-1 font-mono text-sm font-semibold tabular-nums text-slate-700 dark:text-slate-300">
                    Đúng {examResult.correctCount}/{examResult.totalQuestions} câu (Yêu cầu ≥{' '}
                    {examResult.passScore})
                    {examResult.durationSeconds > 0 &&
                      ` • Thời gian ${formatTime(examResult.durationSeconds)}`}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {onRestartExam && (
                  <button
                    onClick={onRestartExam}
                    className="min-h-[48px] rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
                  >
                    Làm lại đề
                  </button>
                )}
                <button
                  onClick={onExit}
                  className="min-h-[48px] rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-gray-900 dark:text-slate-200"
                >
                  Quay lại
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Xem lại chi tiết bài làm
            </h2>
            {activeQuestions.map((q, idx) => {
              const userAns = examResult.answers[q.id];
              const isCorrect = userAns === q.correctAnswer;
              const exp = getQuestionExplanation(q);

              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border bg-white p-5 dark:bg-gray-900 ${
                    isCorrect
                      ? 'border-emerald-200 dark:border-emerald-800'
                      : 'border-rose-300 dark:border-rose-800'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600">
                        CÂU {idx + 1} (#{q.id})
                      </span>
                      {q.isCritical && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
                          <Flame className="h-3 w-3" /> Điểm liệt
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-xs font-bold ${
                        isCorrect ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isCorrect ? '✓ Đúng' : userAns === undefined ? 'Chưa chọn' : '✕ Sai'}
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {q.question}
                  </p>

                  {q.image && (
                    <button
                      type="button"
                      onClick={() => setLightboxSrc(q.image)}
                      className="mt-3 inline-flex rounded-xl border border-slate-100 bg-slate-50 p-2"
                    >
                      <img
                        src={q.image}
                        alt={`Câu ${q.id}`}
                        className="max-h-40 w-auto object-contain"
                      />
                    </button>
                  )}

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {q.options.map((opt, oIdx) => {
                      const isRight = oIdx === q.correctAnswer;
                      const isPicked = oIdx === userAns;
                      let cls =
                        'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300';
                      if (isRight) {
                        cls =
                          'border-emerald-500 bg-emerald-50 font-semibold text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200';
                      } else if (isPicked) {
                        cls =
                          'border-rose-500 bg-rose-50 font-semibold text-rose-900 dark:bg-rose-950/50 dark:text-rose-200';
                      }
                      return (
                        <div key={oIdx} className={`rounded-xl border px-3 py-2 text-xs ${cls}`}>
                          [{oIdx + 1}] {opt}
                        </div>
                      );
                    })}
                  </div>

                  {!isCorrect && (
                    <div className="mt-3 rounded-r-xl border-l-4 border-blue-600 bg-blue-50/80 p-3 text-xs text-slate-700 dark:bg-blue-950/40 dark:text-slate-200">
                      <div>
                        <strong>💡 Mẹo nhớ 3 giây:</strong> {exp.quickTip}
                      </div>
                      <div className="mt-1">
                        <strong>📖 Căn cứ luật:</strong> {exp.legalBasis}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      </div>
    );
  }

  const chosen = currentQ ? answers[currentQ.id] : undefined;
  const showFeedback = studyMode === 'learn' && chosen !== undefined;
  const explanation = currentQ ? getQuestionExplanation(currentQ) : null;
  const isBookmarked = currentQ ? bookmarks.includes(currentQ.id) : false;
  const eliminatedList = currentQ ? eliminated[currentQ.id] ?? [] : [];
  const progressPct = activeQuestions.length
    ? Math.round(((safeIndex + 1) / activeQuestions.length) * 100)
    : 0;
  const chapterMeta = currentQ
    ? CHAPTERS.find((c) => c.id === currentQ.chapter)
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] lg:h-screen lg:overflow-hidden dark:bg-slate-950">
      {/* 1. Ultra-Clean Top Header Bar (h-14) */}
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-200/60 bg-white/80 px-4 backdrop-blur md:px-6 dark:border-slate-800 dark:bg-gray-900/80">
        {/* Left: Minimal Arrow + Chapter Name */}
        <div className="flex min-w-0 items-center gap-2.5">
          <button
            type="button"
            onClick={onExit}
            aria-label="Quay lại"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="truncate text-sm font-medium text-slate-500 dark:text-slate-400">
            {mode === 'exam'
              ? title
              : chapterMeta
                ? `Chương ${chapterMeta.id}: ${chapterMeta.shortTitle}`
                : title}
          </span>
        </div>

        {/* Center: Linear Progress Bar */}
        <div className="hidden items-center gap-2.5 md:flex">
          <div className="h-1.5 w-48 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
            {activeQuestions.length ? `${safeIndex + 1} / ${activeQuestions.length}` : '0 / 0'}
          </span>
        </div>

        {/* Right: Minimalist Segmented Control + Ghost Tools */}
        <div className="flex items-center gap-1.5">
          {mode === 'practice' && (
            <div className="hidden rounded-lg bg-slate-100 p-0.5 sm:flex dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setStudyMode('learn')}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  studyMode === 'learn'
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-gray-900 dark:text-slate-100'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                Học
              </button>
              <button
                type="button"
                onClick={() => setStudyMode('test')}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  studyMode === 'test'
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-gray-900 dark:text-slate-100'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                Thi
              </button>
            </div>
          )}

          {studyMode === 'learn' && (
            <button
              type="button"
              onClick={() => {
                hapticTap();
                toggleAutoAdvance();
              }}
              title="Tự động chuyển câu sau 700ms khi chọn đúng"
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                autoAdvance
                  ? 'text-blue-600 hover:bg-slate-100 dark:text-blue-400 dark:hover:bg-slate-800'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Tự chuyển</span>
            </button>
          )}

          <button
            type="button"
            onClick={toggleKeywordMode}
            title="Highlight Từ khóa (H)"
            className={`hidden items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors lg:inline-flex ${
              keywordMode
                ? 'text-amber-700 hover:bg-slate-100 dark:text-amber-300 dark:hover:bg-slate-800'
                : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Từ khóa</span>
          </button>

          <button
            type="button"
            onClick={() => setCheatSheetOpen(true)}
            title="Sổ tay so sánh nhanh"
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Sổ tay</span>
          </button>

          {/* Slide-over Question Drawer Trigger [ ☷ Câu X/N ] */}
          {currentQ && (
            <button
              type="button"
              onClick={() => setShowDrawer(true)}
              title="Bảng câu hỏi (Phím G)"
              className="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-mono text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 lg:inline-flex dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>
                Câu {currentQ.id}/{activeQuestions.length}
              </span>
            </button>
          )}

          {mode === 'exam' && (
            <div
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-mono text-xs font-bold tabular-nums ${
                timeLeft < 120
                  ? 'bg-red-50 text-red-600 dark:bg-red-950/40'
                  : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              {formatTime(timeLeft)}
            </div>
          )}

          {(mode === 'exam' || studyMode === 'test') && (
            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <Send className="h-3 w-3" />
              <span>Nộp bài</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. Unified Zen Canvas */}
      {!currentQ ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center dark:border-slate-800 dark:bg-gray-900">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Không có câu hỏi nào trong bộ lọc này.
            </p>
            <button
              onClick={onExit}
              className="mt-4 min-h-[44px] rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white"
            >
              Quay về trang chủ
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center p-3 pb-24 lg:overflow-hidden lg:p-6 lg:pb-6">
          <motion.div
            key={currentQ.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60 || info.velocity.x < -400) {
                if (safeIndex < activeQuestions.length - 1) {
                  hapticTap();
                  goNext();
                }
              } else if (info.offset.x > 60 || info.velocity.x > 400) {
                if (safeIndex > 0) {
                  hapticTap();
                  goPrev();
                }
              }
            }}
            initial={{ opacity: 0.94, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.14 }}
            className="w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] lg:max-h-[calc(100vh-7.5rem)] dark:border-slate-800 dark:bg-gray-900"
          >
            <div className="grid grid-cols-1 divide-y divide-slate-100 lg:grid-cols-12 lg:divide-x lg:divide-y-0 dark:divide-slate-800 [@media(min-width:768px)_and_(pointer:coarse)]:grid-cols-2 [@media(min-width:768px)_and_(pointer:coarse)]:divide-x [@media(min-width:768px)_and_(pointer:coarse)]:divide-y-0">
              {/* NỬA TRÁI (~55% -> col-span-7): Context Zone */}
              <div className="lg:col-span-7 lg:max-h-[calc(100vh-7.5rem)] lg:overflow-y-auto">
                <QuestionCard
                  question={currentQ}
                  isBookmarked={isBookmarked}
                  keywordMode={keywordMode}
                  onToggleBookmark={() => {
                    hapticTap();
                    toggleBookmark(currentQ.id);
                  }}
                  onEnableKeywords={() => {
                    if (!keywordMode) toggleKeywordMode();
                  }}
                  onOpenLightbox={(src) => setLightboxSrc(src)}
                />
              </div>

              {/* NỬA PHẢI (~45% -> col-span-5): Action Zone */}
              <div className="flex flex-col justify-between p-5 sm:p-7 lg:col-span-5 lg:max-h-[calc(100vh-7.5rem)] lg:overflow-y-auto">
                <div className="space-y-3">
                  {/* Refined Option Cards */}
                  <div className="flex flex-col gap-3">
                    {currentQ.options.map((opt, idx) => {
                      const isCorrectOpt = idx === currentQ.correctAnswer;
                      const isChosen = idx === chosen;
                      const isEliminated = eliminatedList.includes(idx);

                      let cardCls =
                        'border-slate-200/90 bg-white hover:border-blue-500/60 hover:bg-blue-50/20 dark:border-slate-800 dark:bg-gray-900 dark:hover:border-blue-500/50';
                      let keycapCls =
                        'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
                      let textCls = 'text-slate-700 dark:text-slate-200';

                      if (showFeedback) {
                        if (isCorrectOpt) {
                          cardCls =
                            'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30';
                          keycapCls = 'bg-emerald-500 text-white';
                          textCls = 'text-emerald-950 dark:text-emerald-100';
                        } else if (isChosen) {
                          cardCls =
                            'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30';
                          keycapCls = 'bg-rose-500 text-white';
                          textCls = 'text-rose-950 dark:text-rose-100';
                        } else {
                          cardCls =
                            'border-slate-200/60 bg-slate-50/40 opacity-55 dark:border-slate-800 dark:bg-slate-950/30';
                        }
                      } else if (isChosen) {
                        cardCls = 'border-blue-600 bg-blue-50/30 dark:bg-blue-950/30';
                        keycapCls = 'bg-blue-600 text-white';
                      } else if (isEliminated) {
                        cardCls =
                          'border-slate-200/70 bg-slate-50/60 opacity-45 dark:border-slate-800 dark:bg-slate-950';
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={showFeedback}
                          onTouchStart={() => {
                            optionLongPressedRef.current = false;
                            optionLongPressRef.current = window.setTimeout(() => {
                              optionLongPressedRef.current = true;
                              toggleEliminateOption(currentQ.id, idx);
                            }, 400);
                          }}
                          onTouchEnd={() => {
                            if (optionLongPressRef.current) {
                              clearTimeout(optionLongPressRef.current);
                              optionLongPressRef.current = null;
                            }
                          }}
                          onTouchMove={() => {
                            if (optionLongPressRef.current) {
                              clearTimeout(optionLongPressRef.current);
                              optionLongPressRef.current = null;
                            }
                          }}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            toggleEliminateOption(currentQ.id, idx);
                          }}
                          onClick={() => {
                            if (optionLongPressedRef.current) {
                              optionLongPressedRef.current = false;
                              return;
                            }
                            handleSelectOption(idx);
                          }}
                          className={`flex min-h-[48px] w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 ${cardCls}`}
                        >
                          <span
                            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-xs font-semibold ${keycapCls}`}
                          >
                            {showFeedback && isCorrectOpt ? (
                              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                            ) : showFeedback && isChosen && !isCorrectOpt ? (
                              <X className="h-3.5 w-3.5 stroke-[2.5]" />
                            ) : (
                              idx + 1
                            )}
                          </span>
                          <span
                            className={`flex-1 text-[15px] font-medium leading-normal ${textCls} ${
                              isEliminated && !showFeedback ? 'line-through' : ''
                            }`}
                          >
                            {opt}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Desktop Inline Smart Explanation Callout */}
                  {showFeedback && explanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="hidden space-y-1 rounded-r-xl border-l-4 border-blue-600 bg-blue-50/70 p-3.5 text-xs text-slate-700 lg:block dark:bg-blue-950/35 dark:text-slate-200"
                    >
                      <div>
                        <strong className="text-blue-700 dark:text-blue-300">
                          💡 Mẹo nhớ 3 giây:
                        </strong>{' '}
                        {explanation.quickTip}
                      </div>
                      <div className="leading-relaxed text-slate-600 dark:text-slate-300">
                        <strong>📖 Căn cứ luật:</strong> {explanation.legalBasis}
                      </div>
                    </motion.div>
                  )}

                  {/* Mobile Floating Explanation Pill */}
                  {showFeedback && explanation && (
                    <button
                      type="button"
                      onClick={() => setShowExplanationSheet(true)}
                      className="flex min-h-[48px] w-full items-center justify-between rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-2.5 text-left text-xs font-semibold text-blue-700 lg:hidden dark:border-blue-500/40 dark:bg-blue-950/40 dark:text-blue-300"
                    >
                      <span className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        Xem giải thích & Mẹo nhớ
                      </span>
                      <ChevronUp className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Desktop Prev / Next Navigation right below options */}
                <div className="mt-6 hidden items-center justify-between gap-3 border-t border-slate-100 pt-4 lg:flex dark:border-slate-800">
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={safeIndex === 0}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Câu trước
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={safeIndex >= activeQuestions.length - 1}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-40"
                  >
                    Câu tiếp
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Subtle Centered Shortcut Hint */}
          <p className="mt-3 hidden text-center text-[11px] text-slate-400 lg:block">
            1-4 Chọn • ←/→ Chuyển • H Từ khóa • Z Phóng to • B Lưu • G Bảng câu hỏi
          </p>
        </div>
      )}

      {/* Ergonomic Floating Thumb-Bar (Mobile & Touch < 1024px) */}
      {currentQ && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden dark:border-slate-800 dark:bg-gray-900/95">
          <div className="flex h-16 items-center justify-between gap-2 px-3">
            <button
              type="button"
              onClick={() => {
                hapticTap();
                goPrev();
              }}
              disabled={safeIndex === 0}
              aria-label="Câu trước"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition-transform duration-75 active:scale-[0.95] active:bg-slate-200 disabled:opacity-35 dark:bg-slate-800 dark:text-slate-200"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <motion.button
              type="button"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y < -25) {
                  hapticTap();
                  setShowMatrixSheet(true);
                }
              }}
              onClick={() => {
                hapticTap();
                setShowMatrixSheet(true);
              }}
              className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-slate-100 px-3 font-mono text-xs font-bold text-slate-800 transition-transform duration-75 active:scale-[0.98] active:bg-slate-200 dark:bg-slate-800 dark:text-slate-100"
            >
              <span>
                Câu {currentQ.id} ({safeIndex + 1}/{activeQuestions.length})
              </span>
              <ChevronUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </motion.button>

            <button
              type="button"
              onClick={() => {
                hapticTap();
                toggleBookmark(currentQ.id);
              }}
              aria-label="Đánh dấu"
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-75 active:scale-[0.95] ${
                isBookmarked
                  ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => {
                hapticTap();
                toggleKeywordMode();
              }}
              aria-label="Từ khóa"
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-75 active:scale-[0.95] ${
                keywordMode
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              <Lightbulb className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                hapticTap();
                goNext();
              }}
              disabled={safeIndex >= activeQuestions.length - 1}
              aria-label="Câu tiếp"
              className="flex h-12 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm transition-transform duration-75 active:scale-[0.95] active:bg-blue-700 disabled:opacity-35"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Desktop Slide-Over Drawer (Hidden by default, opens with [ ☷ Câu X/N ] or key G) */}
      <AnimatePresence>
        {showDrawer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 hidden justify-end bg-slate-950/30 backdrop-blur-[1px] lg:flex"
            onClick={() => setShowDrawer(false)}
          >
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-80 flex-col border-l border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-gray-900"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Danh sách câu ({activeQuestions.length})
                </span>
                <button
                  type="button"
                  onClick={() => setShowDrawer(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="min-h-0 flex-1">
                <QuestionMatrix
                  questions={activeQuestions}
                  currentIndex={safeIndex}
                  answers={answers}
                  bookmarks={bookmarks}
                  isExamMode={studyMode === 'test'}
                  onSelectIndex={(idx) => {
                    setCurrentIndex(idx);
                    setShowDrawer(false);
                  }}
                />
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Sheet 1: Question Matrix */}
      <BottomSheet
        open={showMatrixSheet}
        title={`Bảng câu hỏi (${activeQuestions.length} câu)`}
        expandable={true}
        onClose={() => setShowMatrixSheet(false)}
      >
        <QuestionMatrix
          questions={activeQuestions}
          currentIndex={safeIndex}
          answers={answers}
          bookmarks={bookmarks}
          isExamMode={studyMode === 'test'}
          touchMode={true}
          onSelectIndex={(idx) => {
            hapticTap();
            setCurrentIndex(idx);
            setShowMatrixSheet(false);
          }}
        />
      </BottomSheet>

      {/* Mobile Bottom Sheet 2: Explanation & Mẹo nhớ */}
      <BottomSheet
        open={showExplanationSheet}
        title="Giải thích & Mẹo ghi nhớ"
        expandable={false}
        onClose={() => setShowExplanationSheet(false)}
      >
        {explanation && currentQ && (
          <div className="space-y-3 pt-1">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm font-semibold text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-200">
              Đáp án đúng [{currentQ.correctAnswer + 1}]:{' '}
              {currentQ.options[currentQ.correctAnswer]}
            </div>
            <div className="space-y-2 rounded-r-xl border-l-4 border-blue-600 bg-blue-50/80 p-4 text-sm text-slate-700 dark:bg-blue-950/40 dark:text-slate-200">
              <div>
                <strong className="text-blue-700 dark:text-blue-300">
                  💡 Mẹo nhớ 3 giây:
                </strong>{' '}
                {explanation.quickTip}
              </div>
              <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                <strong>📖 Căn cứ luật:</strong> {explanation.legalBasis}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowExplanationSheet(false);
                setCheatSheetOpen(true);
              }}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <BookOpen className="h-4 w-4 text-blue-600" />
              Mở Sổ Tay So Sánh Biển Báo
            </button>
          </div>
        )}
      </BottomSheet>

      {/* Custom Submit Confirmation Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
            onClick={() => setShowSubmitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Xác nhận nộp bài?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Đã hoàn thành {answeredCount}/{activeQuestions.length} câu hỏi.
                  </p>
                </div>
              </div>

              {answeredCount < activeQuestions.length && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-medium text-amber-800 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-200">
                  Bạn vẫn còn{' '}
                  <strong>{activeQuestions.length - answeredCount} câu chưa trả lời</strong>.
                  Các câu bỏ trống sẽ tính là sai.
                </div>
              )}

              <div className="mt-5 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="min-h-[44px] rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  Tiếp tục làm bài
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="min-h-[44px] rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700"
                >
                  Nộp bài ngay
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ImageLightbox
        src={lightboxSrc}
        alt={currentQ ? `Hình minh họa câu ${currentQ.id}` : undefined}
        onClose={() => setLightboxSrc(null)}
      />
    </div>
  );
};
