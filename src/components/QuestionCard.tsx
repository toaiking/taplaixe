import React from 'react';
import { Bookmark, Flame, ZoomIn } from 'lucide-react';
import { Question } from '../types/question';
import { HighlightedText } from './HighlightedText';

interface QuestionCardProps {
  question: Question;
  displayIndex: number;
  totalCount: number;
  isBookmarked: boolean;
  keywordMode: boolean;
  onToggleBookmark: () => void;
  onOpenLightbox: (src: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  displayIndex,
  totalCount,
  isBookmarked,
  keywordMode,
  onToggleBookmark,
  onOpenLightbox,
}) => {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-gray-900">
      <div className="space-y-4">
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
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 ${
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

        {/* Question Text */}
        <h2 className="text-lg font-semibold leading-relaxed text-slate-900 md:text-xl dark:text-slate-100">
          <HighlightedText
            text={question.question}
            extraKeywords={question.keywords}
            enabled={keywordMode}
          />
        </h2>
      </div>

      {/* Fixed Light Image Container */}
      {question.image && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => onOpenLightbox(question.image!)}
            className="group relative flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
          >
            <img
              src={question.image}
              alt={`Hình minh họa câu ${question.id}`}
              className="max-h-[260px] w-auto object-contain"
            />
            <span className="pointer-events-none absolute right-2.5 bottom-2.5 inline-flex items-center gap-1.5 rounded-lg bg-slate-900/75 px-2.5 py-1 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
              <ZoomIn className="h-3.5 w-3.5" />
              Bấm để phóng to (Phím Z)
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
