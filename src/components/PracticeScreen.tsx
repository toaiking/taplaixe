import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Flame,
  Grid,
  Image as ImageIcon,
  Layers,
  Lightbulb,
  RotateCw,
  SlidersHorizontal,
  X,
  XCircle,
  ZoomIn,
} from 'lucide-react';
import { CHAPTERS } from '../data/chapters';
import { useAppStore } from '../store/useAppStore';
import { PracticeSourceMode, Question, SRSBox } from '../types/question';
import { getQuestionExplanation } from '../utils/mnemonics';
import { HighlightedText } from './HighlightedText';
import { LightboxModal } from './LightboxModal';

interface PracticeScreenProps {
  questions: Question[];
}

const BOX_LABELS: Record<SRSBox, { label: string; cls: string }> = {
  unlearned: {
    label: 'Chưa học',
    cls: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  },
  wrong: {
    label: 'Hay sai',
    cls: 'bg-[#FEE2E2] text-[#EF4444] dark:bg-rose-500/20 dark:text-rose-300',
  },
  learning: {
    label: 'Đang nhớ',
    cls: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  },
  mastered: {
    label: 'Đã thuộc',
    cls: 'bg-[#D1FAE5] text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  },
};

export const PracticeScreen: React.FC<PracticeScreenProps> = ({ questions }) => {
  const {
    practicePreset,
    srs,
    bookmarks,
    keywordMode,
    recordAnswer,
    setSRSBox,
    toggleBookmark,
    setActiveScreen,
  } = useAppStore();

  const [chapter, setChapter] = useState<number | 'all'>(practicePreset.chapter);
  const [sourceMode, setSourceMode] = useState<PracticeSourceMode>(
    practicePreset.sourceMode
  );
  const [onlyWithImage, setOnlyWithImage] = useState<boolean>(
    Boolean(practicePreset.onlyWithImage)
  );
  const [onlyUnmastered, setOnlyUnmastered] = useState<boolean>(
    Boolean(practicePreset.onlyUnmastered)
  );
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [showGridDrawer, setShowGridDrawer] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setChapter(practicePreset.chapter);
    setSourceMode(practicePreset.sourceMode);
    setOnlyWithImage(Boolean(practicePreset.onlyWithImage));
    setOnlyUnmastered(Boolean(practicePreset.onlyUnmastered));
    setCurrentIndex(0);
  }, [practicePreset]);

  const filteredQuestions = useMemo(() => {
    let list = questions.filter((q) => {
      if (chapter !== 'all' && q.chapter !== chapter) return false;
      if (onlyWithImage && !q.image) return false;
      const box = srs[q.id]?.box ?? 'unlearned';
      if (onlyUnmastered && box === 'mastered') return false;

      if (sourceMode === 'critical' && !q.isCritical) return false;
      if (sourceMode === 'wrong' && box !== 'wrong') return false;
      if (sourceMode === 'bookmarked' && !bookmarks.includes(q.id)) return false;
      if (sourceMode === 'speed_distance') {
        const lower = q.question.toLowerCase();
        if (!lower.includes('tốc độ') && !lower.includes('khoảng cách')) return false;
      }
      if (sourceMode === 'taplo') {
        if (!((q.id >= 227 && q.id <= 231) || (q.id >= 286 && q.id <= 300))) return false;
      }
      if (sourceMode === 'csgt_markings') {
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

    if (sourceMode === 'srs') {
      const priority: Record<SRSBox, number> = {
        wrong: 0,
        unlearned: 1,
        learning: 2,
        mastered: 3,
      };
      list = [...list].sort((a, b) => {
        const pa = priority[srs[a.id]?.box ?? 'unlearned'];
        const pb = priority[srs[b.id]?.box ?? 'unlearned'];
        if (pa !== pb) return pa - pb;
        return a.id - b.id;
      });
    }

    return list;
  }, [questions, chapter, sourceMode, onlyWithImage, onlyUnmastered, srs, bookmarks]);

  const safeIndex = Math.min(currentIndex, Math.max(0, filteredQuestions.length - 1));
  const currentQ = filteredQuestions[safeIndex];

  useEffect(() => {
    setFlashcardFlipped(false);
  }, [safeIndex, currentQ?.id]);

  const handleSelectOption = (optIdx: number) => {
    if (!currentQ || flashcardMode) return;
    if (selectedAnswers[currentQ.id] !== undefined) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: optIdx }));
    recordAnswer(currentQ.id, optIdx === currentQ.correctAnswer);
  };

  const handleResetCurrent = () => {
    if (!currentQ) return;
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
    setFlashcardFlipped(false);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (lightboxSrc || showGridDrawer) return;
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLSelectElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setCurrentIndex((i) => Math.min(filteredQuestions.length - 1, i + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setCurrentIndex((i) => Math.max(0, i - 1));
      } else if (e.key === ' ') {
        e.preventDefault();
        if (currentQ) toggleBookmark(currentQ.id);
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        if (!currentQ) return;
        const idx = parseInt(e.key, 10) - 1;
        if (idx < currentQ.options.length) {
          handleSelectOption(idx);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [filteredQuestions.length, currentQ, lightboxSrc, showGridDrawer, selectedAnswers, flashcardMode]);

  const chosen = currentQ ? selectedAnswers[currentQ.id] : undefined;
  const isAnswered = chosen !== undefined;
  const explanation = currentQ ? getQuestionExplanation(currentQ) : null;
  const currentBox: SRSBox = currentQ ? srs[currentQ.id]?.box ?? 'unlearned' : 'unlearned';
  const isBookmarked = currentQ ? bookmarks.includes(currentQ.id) : false;

  const progressPercent = filteredQuestions.length
    ? Math.round(((safeIndex + 1) / filteredQuestions.length) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 sm:py-6">
      {/* Zutobi-style Top Bar */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setActiveScreen('dashboard')}
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200/70 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Trang chủ</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              showFilters
                ? 'border-teal-600 bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300'
                : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Bộ lọc</span>
          </button>

          <div className="flex rounded-full bg-slate-200/70 p-0.5 dark:bg-slate-800">
            <button
              onClick={() => setFlashcardMode(false)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                !flashcardMode
                  ? 'bg-white text-teal-700 shadow-2xs dark:bg-slate-900 dark:text-teal-400'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Trắc nghiệm
            </button>
            <button
              onClick={() => setFlashcardMode(true)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                flashcardMode
                  ? 'bg-white text-teal-700 shadow-2xs dark:bg-slate-900 dark:text-teal-400'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Flashcard
            </button>
          </div>

          <button
            onClick={() => setShowGridDrawer(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <Grid className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Danh sách</span>
            <span className="text-[11px] text-teal-600 dark:text-teal-400">
              {filteredQuestions.length ? `${safeIndex + 1}/${filteredQuestions.length}` : '0'}
            </span>
          </button>
        </div>
      </div>

      {/* Zutobi Milestone Stepper Progress Bar */}
      <div className="mt-4 mb-6">
        <div className="relative flex items-center justify-between">
          <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-slate-200 dark:bg-slate-800" />
          <div
            className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 bg-teal-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
          {[0, 33, 66, 100].map((milestone) => {
            const reached = progressPercent >= milestone;
            return (
              <div
                key={milestone}
                className={`relative z-10 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 bg-white transition-colors dark:bg-slate-900 ${
                  reached
                    ? 'border-teal-600'
                    : 'border-slate-300 dark:border-slate-700'
                }`}
              >
                {reached && <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Collapsible Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-5 overflow-hidden"
          >
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-[#1E293B]">
              <select
                value={sourceMode}
                onChange={(e) => {
                  setSourceMode(e.target.value as PracticeSourceMode);
                  setCurrentIndex(0);
                }}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-teal-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="all">Tất cả câu hỏi</option>
                <option value="srs">Ôn tập SRS (Hay sai trước)</option>
                <option value="critical">60 Câu Điểm Liệt</option>
                <option value="wrong">Chỉ câu hay sai</option>
                <option value="speed_distance">Chuyên đề: Tốc độ & Khoảng cách</option>
                <option value="taplo">Chuyên đề: Đèn Taplo & Kỹ thuật</option>
                <option value="csgt_markings">Chuyên đề: CSGT & Vạch kẻ đường</option>
                <option value="bookmarked">Câu đã đánh dấu ({bookmarks.length})</option>
              </select>

              <select
                value={chapter}
                onChange={(e) => {
                  const v = e.target.value;
                  setChapter(v === 'all' ? 'all' : Number(v));
                  setCurrentIndex(0);
                }}
                className="max-w-[230px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-teal-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="all">Tất cả 6 chương (600 câu)</option>
                {CHAPTERS.map((c) => (
                  <option key={c.id} value={c.id}>
                    Chương {c.id}: {c.shortTitle}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  setOnlyWithImage((v) => !v);
                  setCurrentIndex(0);
                }}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold ${
                  onlyWithImage
                    ? 'border-teal-600 bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300'
                    : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <ImageIcon className="h-3.5 w-3.5" />
                Có hình ảnh
              </button>

              <button
                onClick={() => {
                  setOnlyUnmastered((v) => !v);
                  setCurrentIndex(0);
                }}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold ${
                  onlyUnmastered
                    ? 'border-teal-600 bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300'
                    : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                Chưa thuộc
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Centered Zutobi-style Learning Canvas */}
      {!currentQ ? (
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs dark:border-slate-800 dark:bg-[#1E293B]">
          <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
            Không có câu hỏi nào phù hợp với bộ lọc hiện tại.
          </p>
          <button
            onClick={() => {
              setChapter('all');
              setSourceMode('all');
              setOnlyWithImage(false);
              setOnlyUnmastered(false);
            }}
            className="mt-4 rounded-full bg-teal-600 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Xem toàn bộ 600 câu
          </button>
        </div>
      ) : (
        <div className="mx-auto max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.16 }}
              className="space-y-5"
            >
              {/* Meta Badges Row */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-teal-600 px-3 py-1 text-xs font-bold text-white">
                    Câu {currentQ.id}
                  </span>
                  <span className="rounded-full bg-slate-200/70 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Chương {currentQ.chapter}
                  </span>
                  {currentQ.isCritical && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#FEE2E2] px-2.5 py-1 text-xs font-bold text-[#EF4444] dark:bg-rose-500/20">
                      <Flame className="h-3.5 w-3.5" />
                      ĐIỂM LIỆT
                    </span>
                  )}
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${BOX_LABELS[currentBox].cls}`}
                  >
                    {BOX_LABELS[currentBox].label}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {(isAnswered || flashcardFlipped) && (
                    <button
                      onClick={handleResetCurrent}
                      title="Làm lại câu này"
                      className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 dark:hover:bg-slate-800"
                    >
                      <RotateCw className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => toggleBookmark(currentQ.id)}
                    title="Đánh dấu (Space)"
                    className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                      isBookmarked
                        ? 'border-amber-300 bg-amber-50 text-[#F59E0B] dark:border-amber-500/40 dark:bg-amber-500/15'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    <Bookmark
                      className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-[#F59E0B]' : ''}`}
                    />
                    <span>{isBookmarked ? 'Đã lưu' : 'Lưu'}</span>
                  </button>
                </div>
              </div>

              {/* Image First (Zutobi-style centered visual focal point) */}
              {currentQ.image && (
                <button
                  type="button"
                  onClick={() => setLightboxSrc(currentQ.image)}
                  className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-3 shadow-sm transition-all hover:border-teal-600 hover:shadow-md"
                >
                  <img
                    src={currentQ.image}
                    alt={`Minh họa câu ${currentQ.id}`}
                    className="max-h-64 w-auto object-contain sm:max-h-72"
                  />
                  <span className="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-slate-900/75 px-2.5 py-1 text-[11px] font-semibold text-white">
                    <ZoomIn className="h-3.5 w-3.5" />
                    Phóng to
                  </span>
                </button>
              )}

              {/* Question Prompt */}
              <h2 className="text-center text-base font-bold leading-relaxed text-slate-900 sm:text-lg dark:text-white">
                <HighlightedText
                  text={currentQ.question}
                  extraKeywords={currentQ.keywords}
                  enabled={keywordMode}
                />
              </h2>

              {/* Tactile Option Cards */}
              {!flashcardMode ? (
                <div className="space-y-2.5">
                  {currentQ.options.map((opt, idx) => {
                    const isCorrectOpt = idx === currentQ.correctAnswer;
                    const isChosen = idx === chosen;

                    let cardCls =
                      'border-slate-200/80 bg-white shadow-xs hover:border-teal-500 hover:shadow-sm active:scale-[0.99] dark:border-slate-700/80 dark:bg-[#1E293B] dark:hover:border-teal-400';
                    let badgeCls =
                      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200';

                    if (isAnswered) {
                      if (isCorrectOpt) {
                        cardCls =
                          'border-[#10B981] bg-[#D1FAE5]/70 text-slate-900 shadow-xs dark:border-emerald-500 dark:bg-emerald-500/20 dark:text-white';
                        badgeCls = 'bg-[#10B981] text-white';
                      } else if (isChosen) {
                        cardCls =
                          'border-[#EF4444] bg-[#FEE2E2]/70 text-slate-900 shadow-xs dark:border-rose-500 dark:bg-rose-500/20 dark:text-white';
                        badgeCls = 'bg-[#EF4444] text-white';
                      } else {
                        cardCls =
                          'border-slate-200/60 bg-white/60 opacity-60 dark:border-slate-800 dark:bg-slate-900/40';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswered}
                        className={`flex w-full items-start gap-3.5 rounded-2xl border-2 p-4 text-left transition-all ${cardCls}`}
                      >
                        <span
                          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${badgeCls}`}
                        >
                          {idx + 1}
                        </span>
                        <span className="flex-1 text-sm font-medium leading-relaxed sm:text-[15px]">
                          <HighlightedText
                            text={opt}
                            extraKeywords={currentQ.keywords}
                            enabled={keywordMode}
                          />
                        </span>
                        {isAnswered && isCorrectOpt && (
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#10B981]" />
                        )}
                        {isAnswered && isChosen && !isCorrectOpt && (
                          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#EF4444]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  {!flashcardFlipped ? (
                    <button
                      onClick={() => setFlashcardFlipped(true)}
                      className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-teal-400 bg-teal-50/60 py-10 text-teal-700 transition-colors hover:bg-teal-50 dark:border-teal-500/40 dark:bg-teal-500/10 dark:text-teal-300"
                    >
                      <Eye className="h-7 w-7" />
                      <span className="text-sm font-bold">Chạm để lật xem đáp án đúng</span>
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-2xl border-2 border-[#10B981] bg-[#D1FAE5]/60 p-4 dark:border-emerald-500 dark:bg-emerald-500/20">
                        <div className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-300">
                          Đáp án đúng ({currentQ.correctAnswer + 1})
                        </div>
                        <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                          {currentQ.options[currentQ.correctAnswer]}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => {
                            setSRSBox(currentQ.id, 'wrong');
                            setCurrentIndex((i) =>
                              Math.min(filteredQuestions.length - 1, i + 1)
                            );
                          }}
                          className="rounded-2xl bg-[#FEE2E2] px-2 py-3 text-xs font-bold text-[#EF4444] hover:bg-rose-200 dark:bg-rose-500/20"
                        >
                          Hay sai
                        </button>
                        <button
                          onClick={() => {
                            setSRSBox(currentQ.id, 'learning');
                            setCurrentIndex((i) =>
                              Math.min(filteredQuestions.length - 1, i + 1)
                            );
                          }}
                          className="rounded-2xl bg-amber-100 px-2 py-3 text-xs font-bold text-amber-700 hover:bg-amber-200 dark:bg-amber-500/20 dark:text-amber-300"
                        >
                          Đang nhớ
                        </button>
                        <button
                          onClick={() => {
                            setSRSBox(currentQ.id, 'mastered');
                            setCurrentIndex((i) =>
                              Math.min(filteredQuestions.length - 1, i + 1)
                            );
                          }}
                          className="rounded-2xl bg-[#D1FAE5] px-2 py-3 text-xs font-bold text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300"
                        >
                          Đã thuộc
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Explanation Card */}
              {(isAnswered || (flashcardMode && flashcardFlipped)) && explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-teal-200 bg-teal-50/70 p-4 dark:border-teal-500/30 dark:bg-teal-500/10"
                >
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-teal-700 dark:text-teal-300">
                    <Lightbulb className="h-4 w-4" />
                    {explanation.rule}
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                    {explanation.tip}
                  </p>
                </motion.div>
              )}

              {/* Bottom Thumb-friendly Controls */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                  disabled={safeIndex === 0}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-700 shadow-xs transition-all hover:bg-slate-50 active:scale-[0.98] disabled:opacity-40 dark:border-slate-700 dark:bg-[#1E293B] dark:text-slate-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Câu trước
                </button>
                <button
                  onClick={() =>
                    setCurrentIndex((i) => Math.min(filteredQuestions.length - 1, i + 1))
                  }
                  disabled={safeIndex >= filteredQuestions.length - 1}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-teal-600 py-3.5 text-sm font-bold text-white shadow-sm shadow-teal-600/20 transition-all hover:bg-teal-700 active:scale-[0.98] disabled:opacity-40"
                >
                  Câu tiếp
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Slide-over Question Grid Drawer */}
      <AnimatePresence>
        {showGridDrawer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-xs"
            onClick={() => setShowGridDrawer(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="flex h-full w-full max-w-sm flex-col bg-white p-5 shadow-2xl dark:bg-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Danh sách câu hỏi ({filteredQuestions.length})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Chấm đỏ góc trên là câu điểm liệt
                  </p>
                </div>
                <button
                  onClick={() => setShowGridDrawer(false)}
                  className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 grid flex-1 grid-cols-5 gap-2 overflow-y-auto pr-1 content-start">
                {filteredQuestions.map((q, idx) => {
                  const isActive = idx === safeIndex;
                  const box = srs[q.id]?.box ?? 'unlearned';
                  let cls =
                    'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300';
                  if (box === 'mastered') {
                    cls =
                      'border-emerald-300 bg-[#D1FAE5] text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-300';
                  } else if (box === 'wrong') {
                    cls =
                      'border-rose-300 bg-[#FEE2E2] text-[#EF4444] dark:border-rose-500/40 dark:bg-rose-500/20 dark:text-rose-300';
                  } else if (box === 'learning') {
                    cls =
                      'border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/20 dark:text-amber-300';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setShowGridDrawer(false);
                      }}
                      className={`relative rounded-xl border py-2 text-xs font-bold transition-all ${cls} ${
                        isActive ? 'ring-2 ring-teal-600 ring-offset-1 dark:ring-offset-slate-900' : ''
                      }`}
                    >
                      {q.id}
                      {q.isCritical && (
                        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#EF4444]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <LightboxModal
        src={lightboxSrc}
        alt={currentQ ? `Hình minh họa câu ${currentQ.id}` : undefined}
        onClose={() => setLightboxSrc(null)}
      />
    </div>
  );
};
