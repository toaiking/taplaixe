import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertOctagon,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Grid,
  Lightbulb,
  PanelRightClose,
  PanelRightOpen,
  Send,
  Sparkles,
  Trophy,
  X,
  XCircle,
} from 'lucide-react';
import { CHAPTERS } from '../data/chapters';
import { useAppStore } from '../store/useAppStore';
import { ExamResult, PracticeSourceMode, Question } from '../types/question';
import { getQuestionExplanation } from '../utils/mnemonics';
import { HighlightedText } from './HighlightedText';
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
    toggleKeywordMode,
    recordAnswer,
    toggleBookmark,
    saveExamResult,
    setCheatSheetOpen,
    cheatSheetOpen,
  } = useAppStore();

  // Practice mode allows toggling between Learn (show explanation immediately) and Exam-like (hide answers until submit)
  const [studyMode, setStudyMode] = useState<'learn' | 'test'>(
    mode === 'exam' ? 'test' : 'learn'
  );
  const [chapterFilter, setChapterFilter] = useState<number | 'all'>(
    mode === 'practice' ? practicePreset.chapter : 'all'
  );
  const [sourceFilter, setSourceFilter] = useState<PracticeSourceMode>(
    mode === 'practice' ? practicePreset.sourceMode : 'all'
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(
    examMeta ? examMeta.durationMinutes * 60 : 0
  );
  const [showMatrix, setShowMatrix] = useState(true);
  const [showMobileSheet, setShowMobileSheet] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const touchStartX = useRef<number | null>(null);

  // Sync practice preset when entering practice
  useEffect(() => {
    if (mode === 'practice') {
      setChapterFilter(practicePreset.chapter);
      setSourceFilter(practicePreset.sourceMode);
      setCurrentIndex(0);
    }
  }, [mode, practicePreset]);

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

  const handleSelectOption = (optIdx: number) => {
    if (!currentQ || examResult) return;
    if (studyMode === 'learn' && answers[currentQ.id] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: optIdx }));
    if (studyMode === 'learn') {
      recordAnswer(currentQ.id, optIdx === currentQ.correctAnswer);
    }
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

  // Countdown timer in Exam mode
  useEffect(() => {
    if (mode !== 'exam' || examResult) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [mode, timeLeft, examResult]);

  // Global Keyboard Shortcuts: 1-4, Arrows, Enter, H, Z, B, Space
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (showSubmitModal || showMobileSheet || cheatSheetOpen || examResult) return;
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
        setCurrentIndex((i) => Math.min(activeQuestions.length - 1, i + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setCurrentIndex((i) => Math.max(0, i - 1));
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
    showSubmitModal,
    showMobileSheet,
    cheatSheetOpen,
    examResult,
    answers,
    studyMode,
  ]);

  const answeredCount = useMemo(
    () => activeQuestions.filter((q) => answers[q.id] !== undefined).length,
    [activeQuestions, answers]
  );

  // EXAM RESULT VIEW
  if (examResult) {
    return (
      <div className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950">
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
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
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
                    className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
                  >
                    Làm lại đề
                  </button>
                )}
                <button
                  onClick={onExit}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-gray-900 dark:text-slate-200"
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
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        Câu {idx + 1} (Gốc #{q.id})
                      </span>
                      {q.isCritical && (
                        <span className="inline-flex items-center gap-1 rounded-lg border border-red-300 bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600">
                          <Flame className="h-3.5 w-3.5" /> Điểm Liệt
                        </span>
                      )}
                    </div>
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" /> Đúng
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-rose-700 dark:text-rose-400">
                        <XCircle className="h-4 w-4" />{' '}
                        {userAns === undefined ? 'Chưa chọn' : 'Sai'}
                      </span>
                    )}
                  </div>

                  <p className="mt-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {q.question}
                  </p>

                  {q.image && (
                    <button
                      type="button"
                      onClick={() => setLightboxSrc(q.image)}
                      className="mt-3 inline-flex rounded-xl border border-slate-200 bg-white p-2"
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

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 lg:h-screen lg:overflow-hidden dark:bg-slate-950">
      {/* 1. Top Navigation Bar (h-16) */}
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 md:px-6 dark:border-slate-800 dark:bg-gray-900">
        {/* Left: Back + Mode + Chapter */}
        <div className="flex min-w-0 items-center gap-2.5">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Quay lại</span>
          </button>

          <div className="hidden min-w-0 sm:block">
            <div className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
              {title}
            </div>
            {currentQ && (
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Chương {currentQ.chapter}:{' '}
                {CHAPTERS.find((c) => c.id === currentQ.chapter)?.shortTitle}
              </div>
            )}
          </div>
        </div>

        {/* Center: Segmented Toggle + Highlight Toggle + Cheat Sheet */}
        <div className="flex items-center gap-2">
          {mode === 'practice' && (
            <div className="hidden rounded-xl border border-slate-200 bg-slate-100 p-0.5 md:flex dark:border-slate-800 dark:bg-slate-950">
              <button
                type="button"
                onClick={() => setStudyMode('learn')}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                  studyMode === 'learn'
                    ? 'bg-white text-blue-600 dark:bg-gray-900 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Chế độ Học
              </button>
              <button
                type="button"
                onClick={() => setStudyMode('test')}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                  studyMode === 'test'
                    ? 'bg-white text-blue-600 dark:bg-gray-900 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Chế độ Thi
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={toggleKeywordMode}
            title="Bật/tắt Highlight Từ Khóa (Phím H)"
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
              keywordMode
                ? 'border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-500/40 dark:bg-amber-950/50 dark:text-amber-200'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Từ khóa</span>
          </button>

          <button
            type="button"
            onClick={() => setCheatSheetOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <BookOpen className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden lg:inline">Sổ tay</span>
          </button>
        </div>

        {/* Right: Timer + Submit + Matrix Toggle */}
        <div className="flex items-center gap-2">
          {mode === 'exam' && (
            <div
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-sm font-bold tabular-nums md:text-base ${
                timeLeft < 120
                  ? 'border-red-300 bg-red-50 text-red-600 dark:border-red-500/40 dark:bg-red-950/50'
                  : 'border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
              }`}
            >
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              {formatTime(timeLeft)}
            </div>
          )}

          {(mode === 'exam' || studyMode === 'test') && (
            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-blue-700 sm:text-sm"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Nộp bài</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowMatrix((v) => !v)}
            title="Ẩn/hiện bảng câu hỏi"
            className="hidden rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 lg:inline-flex dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            {showMatrix ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRightOpen className="h-4 w-4" />
            )}
          </button>
        </div>
      </header>

      {/* 2. Main Split-Screen Workspace */}
      {!currentQ ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-gray-900">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Không có câu hỏi nào trong bộ lọc này.
            </p>
            <button
              onClick={onExit}
              className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white"
            >
              Quay về trang chủ
            </button>
          </div>
        </div>
      ) : (
        <div
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            touchStartX.current = null;
            if (Math.abs(dx) > 55) {
              if (dx < 0) {
                setCurrentIndex((i) => Math.min(activeQuestions.length - 1, i + 1));
              } else {
                setCurrentIndex((i) => Math.max(0, i - 1));
              }
            }
          }}
          className="grid flex-1 grid-cols-1 gap-4 p-4 pb-24 lg:h-[calc(100vh-4rem)] lg:grid-cols-12 lg:gap-5 lg:overflow-hidden lg:p-5 lg:pb-5"
        >
          {/* CỘT TRÁI (Col-span-5): Context Zone */}
          <div className="lg:col-span-5 lg:h-full lg:overflow-y-auto">
            <QuestionCard
              question={currentQ}
              displayIndex={safeIndex}
              totalCount={activeQuestions.length}
              isBookmarked={bookmarks.includes(currentQ.id)}
              keywordMode={keywordMode}
              onToggleBookmark={() => toggleBookmark(currentQ.id)}
              onOpenLightbox={(src) => setLightboxSrc(src)}
            />
          </div>

          {/* CỘT GIỮA (Col-span-4 or 7 if matrix hidden): Action Zone */}
          <div
            className={`flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 lg:h-full lg:overflow-y-auto dark:border-slate-800 dark:bg-gray-900 ${
              showMatrix ? 'lg:col-span-4' : 'lg:col-span-7'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>Chọn phương án đúng</span>
                <span className="font-mono tabular-nums">
                  {answeredCount}/{activeQuestions.length} đã trả lời
                </span>
              </div>

              {/* Interactive Option Cards */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isCorrectOpt = idx === currentQ.correctAnswer;
                  const isChosen = idx === chosen;

                  let cardCls =
                    'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/40 active:scale-[0.99] dark:border-slate-800 dark:bg-gray-900 dark:hover:border-blue-500 dark:hover:bg-blue-950/20';
                  let keycapCls =
                    'bg-slate-100 border-slate-300 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200';
                  let textCls = 'text-slate-700 dark:text-slate-200';

                  if (showFeedback) {
                    if (isCorrectOpt) {
                      cardCls = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40';
                      keycapCls = 'bg-emerald-500 border-emerald-500 text-white';
                      textCls = 'text-emerald-800 dark:text-emerald-200';
                    } else if (isChosen) {
                      cardCls = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40';
                      keycapCls = 'bg-rose-500 border-rose-500 text-white';
                      textCls = 'text-rose-800 dark:text-rose-200';
                    } else {
                      cardCls =
                        'border-slate-200/70 bg-slate-50/60 opacity-65 dark:border-slate-800 dark:bg-slate-950/40';
                    }
                  } else if (isChosen) {
                    cardCls = 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40';
                    keycapCls = 'bg-blue-600 border-blue-600 text-white';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      disabled={showFeedback}
                      className={`flex w-full items-start gap-3.5 rounded-xl border-2 p-3.5 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 ${cardCls}`}
                    >
                      <span
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border font-mono text-sm font-bold ${keycapCls}`}
                      >
                        {idx + 1}
                      </span>
                      <span className={`flex-1 text-base font-medium leading-normal ${textCls}`}>
                        <HighlightedText
                          text={opt}
                          extraKeywords={currentQ.keywords}
                          enabled={keywordMode}
                        />
                      </span>
                      {showFeedback && isCorrectOpt && (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                      )}
                      {showFeedback && isChosen && !isCorrectOpt && (
                        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Smart Explanation Callout */}
              {showFeedback && explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 space-y-1.5 rounded-r-xl border-l-4 border-blue-600 bg-blue-50/80 p-4 text-sm text-slate-700 dark:bg-blue-950/40 dark:text-slate-200"
                >
                  <div>
                    <strong className="text-blue-700 dark:text-blue-300">
                      💡 Mẹo nhớ 3 giây:
                    </strong>{' '}
                    {explanation.quickTip}
                  </div>
                  <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    <strong>📖 Căn cứ luật:</strong> {explanation.legalBasis}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Desktop Shortcut Legend */}
            <div className="mt-4 hidden items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400 lg:flex dark:border-slate-800">
              <span>
                <kbd className="rounded border border-slate-200 px-1 font-mono dark:border-slate-700">1-4</kbd> Chọn •{' '}
                <kbd className="rounded border border-slate-200 px-1 font-mono dark:border-slate-700">←/→</kbd> Chuyển •{' '}
                <kbd className="rounded border border-slate-200 px-1 font-mono dark:border-slate-700">H</kbd> Từ khóa •{' '}
                <kbd className="rounded border border-slate-200 px-1 font-mono dark:border-slate-700">Z</kbd> Phóng to •{' '}
                <kbd className="rounded border border-slate-200 px-1 font-mono dark:border-slate-700">B</kbd> Lưu
              </span>
            </div>
          </div>

          {/* CỘT PHẢI (Col-span-3): Question Navigator Matrix */}
          {showMatrix && (
            <div className="hidden lg:col-span-3 lg:block lg:h-full lg:overflow-hidden">
              <QuestionMatrix
                questions={activeQuestions}
                currentIndex={safeIndex}
                answers={answers}
                bookmarks={bookmarks}
                isExamMode={studyMode === 'test'}
                onSelectIndex={(idx) => setCurrentIndex(idx)}
                onPrev={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                onNext={() =>
                  setCurrentIndex((i) => Math.min(activeQuestions.length - 1, i + 1))
                }
              />
            </div>
          )}
        </div>
      )}

      {/* Mobile Fixed Bottom Thumb-Zone Navigation Bar */}
      {currentQ && (
        <div className="fixed right-0 bottom-0 left-0 z-30 flex items-center justify-between gap-2 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden dark:border-slate-800 dark:bg-gray-900/95">
          <button
            type="button"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={safeIndex === 0}
            className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <ChevronLeft className="h-4 w-4" />
            Trước
          </button>

          <button
            type="button"
            onClick={() => setShowMobileSheet(true)}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-mono text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <Grid className="h-4 w-4 text-blue-600" />
            {safeIndex + 1}/{activeQuestions.length}
          </button>

          <button
            type="button"
            onClick={() =>
              setCurrentIndex((i) => Math.min(activeQuestions.length - 1, i + 1))
            }
            disabled={safeIndex >= activeQuestions.length - 1}
            className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white disabled:opacity-40"
          >
            Tiếp
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Mobile Bottom Sheet for Question Matrix */}
      <AnimatePresence>
        {showMobileSheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end bg-slate-950/60 lg:hidden"
            onClick={() => setShowMobileSheet(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="h-[75vh] w-full rounded-t-2xl bg-white p-4 dark:bg-gray-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Chọn nhanh câu hỏi
                </span>
                <button
                  onClick={() => setShowMobileSheet(false)}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="h-[calc(100%-2.5rem)]">
                <QuestionMatrix
                  questions={activeQuestions}
                  currentIndex={safeIndex}
                  answers={answers}
                  bookmarks={bookmarks}
                  isExamMode={studyMode === 'test'}
                  onSelectIndex={(idx) => {
                    setCurrentIndex(idx);
                    setShowMobileSheet(false);
                  }}
                  onPrev={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                  onNext={() =>
                    setCurrentIndex((i) => Math.min(activeQuestions.length - 1, i + 1))
                  }
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Submit Confirmation Modal (No browser alert/confirm) */}
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
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  Tiếp tục làm bài
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700"
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
