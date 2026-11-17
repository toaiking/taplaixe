import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bookmark, Flame, Lightbulb, ZoomIn } from 'lucide-react';
import { Question } from '../types/question';
import { hapticTap } from '../utils/haptics';
import { getQuestionExplanation } from '../utils/mnemonics';
import { HighlightedText } from './HighlightedText';

interface QuestionCardProps {
  question: Question;
  displayIndex: number;
  totalCount: number;
  isBookmarked: boolean;
  keywordMode: boolean;
  onToggleBookmark: () => void;
  onEnableKeywords: () => void;
  onOpenLightbox: (src: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  displayIndex,
  totalCount,
  isBookmarked,
  keywordMode,
  onToggleBookmark,
  onEnableKeywords,
  onOpenLightbox,
}) => {
  const [showLongPressTip, setShowLongPressTip] = useState(false);
  const longPressTimer = useRef<number | null>(null);
  const exp = getQuestionExplanation(question);

  const startLongPress = () => {
    longPressTimer.current = window.setTimeout(() => {
      hapticTap();
      if (!keywordMode) onEnableKeywords();
      setShowLongPressTip(true);
    }, 400);
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-gray-900">
      <div className="space-y-3.5">
        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-lg bg-blue-600 px-2.5 py-1 font-mono text-xs font-bold tabular-nums text-white">
              Câu {question.id}
              <span className="ml-1 font-normal text-blue-100">
                ({displayIndex + 1}/{totalCount})
              </span>
            </span>

            {question.isCritical && (
              <span className="inline-flex items-center gap-1 rounded-lg border border-red-300 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600 dark:border-red-500/40 dark:bg-red-950/50 dark:text-red-400">
                <Flame className="h-3.5 w-3.5" />
                Câu Điểm Liệt
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleBookmark}
            title="Đánh dấu câu hỏi (Phím B hoặc Space)"
            className={`hidden items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors lg:inline-flex ${
              isBookmarked
                ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-300'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <Bookmark
              className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`}
            />
            <span>{isBookmarked ? 'Đã đánh dấu' : 'Đánh dấu'}</span>
          </button>
        </div>

        {/* Long-press Tooltip */}
        <AnimatePresence>
          {showLongPressTip && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              onClick={() => setShowLongPressTip(false)}
              className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-500/40 dark:bg-amber-950/50 dark:text-amber-200"
            >
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div className="flex-1">
                <strong>Mẹo nhanh:</strong> {exp.quickTip}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question Text (Long-press 400ms to reveal quick tip & highlight) */}
        <h2
          onTouchStart={startLongPress}
          onTouchEnd={cancelLongPress}
          onTouchMove={cancelLongPress}
          onContextMenu={(e) => {
            if (window.matchMedia('(pointer: coarse)').matches) {
              e.preventDefault();
            }
          }}
          className="select-none text-base font-semibold leading-relaxed text-slate-900 sm:text-lg md:text-xl dark:text-slate-100"
        >
          <HighlightedText
            text={question.question}
            extraKeywords={question.keywords}
            enabled={keywordMode}
          />
        </h2>
      </div>

      {/* Fixed Light Image Container */}
      {question.image && (
        <div className="mt-3.5">
          <button
            type="button"
            onClick={() => {
              hapticTap();
              onOpenLightbox(question.image!);
            }}
            className="group relative flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white p-3 transition-transform duration-75 hover:border-blue-500 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
          >
            <img
              src={question.image}
              alt={`Hình minh họa câu ${question.id}`}
              className="max-h-[240px] w-auto object-contain sm:max-h-[260px]"
            />
            <span className="absolute right-2.5 bottom-2.5 inline-flex items-center gap-1.5 rounded-lg bg-slate-900/75 px-2.5 py-1 text-[11px] font-semibold text-white lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100">
              <ZoomIn className="h-3.5 w-3.5" />
              Chạm để phóng to
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
