import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bookmark, Lightbulb, ZoomIn } from 'lucide-react';
import { Question } from '../types/question';
import { hapticTap } from '../utils/haptics';
import { getQuestionExplanation } from '../utils/mnemonics';
import { HighlightedText } from './HighlightedText';

interface QuestionCardProps {
  question: Question;
  isBookmarked: boolean;
  keywordMode: boolean;
  onToggleBookmark: () => void;
  onEnableKeywords: () => void;
  onOpenLightbox: (src: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
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
    <div className="p-5 sm:p-7">
      {/* Minimalist Eyebrow Row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
            Câu {question.id}
          </span>
          {question.isCritical && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600 dark:bg-red-950/50 dark:text-red-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-600 dark:bg-red-400" />
              Điểm liệt
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onToggleBookmark}
          title="Đánh dấu câu hỏi (B hoặc Space)"
          aria-label="Đánh dấu câu hỏi"
          className={`rounded-lg p-1.5 transition-colors ${
            isBookmarked
              ? 'text-amber-500'
              : 'text-slate-300 hover:text-amber-500 dark:text-slate-600 dark:hover:text-amber-400'
          }`}
        >
          <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
        </button>
      </div>

      {/* Long-press Quick Tip Tooltip */}
      <AnimatePresence>
        {showLongPressTip && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            onClick={() => setShowLongPressTip(false)}
            className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/90 p-3 text-xs text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/50 dark:text-amber-200"
          >
            <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
            <div className="flex-1">
              <strong>Mẹo nhanh:</strong> {exp.quickTip}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question Text */}
      <h2
        onTouchStart={startLongPress}
        onTouchEnd={cancelLongPress}
        onTouchMove={cancelLongPress}
        onContextMenu={(e) => {
          if (window.matchMedia('(pointer: coarse)').matches) {
            e.preventDefault();
          }
        }}
        className="mt-3 select-none text-lg leading-relaxed font-semibold text-slate-900 md:text-xl dark:text-slate-100"
      >
        <HighlightedText
          text={question.question}
          extraKeywords={question.keywords}
          enabled={keywordMode}
          maxMatches={1}
        />
      </h2>

      {/* Illustration Image directly below question (mt-6, no dead space!) */}
      {question.image && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => {
              hapticTap();
              onOpenLightbox(question.image!);
            }}
            className="group relative flex w-full items-center justify-center rounded-xl border border-slate-100 bg-slate-50/70 p-5 transition-colors hover:border-slate-200 active:scale-[0.99]"
          >
            <img
              src={question.image}
              alt={`Hình minh họa câu ${question.id}`}
              className="max-h-[250px] w-auto object-contain"
            />
            <span className="absolute right-2.5 bottom-2.5 inline-flex items-center gap-1 rounded-lg bg-slate-900/70 px-2 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
              <ZoomIn className="h-3 w-3" />
              Phóng to (Z)
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
