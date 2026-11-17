import React, { useMemo, useState } from 'react';
import { Question } from '../types/question';

export type MatrixFilter = 'all' | 'unanswered' | 'wrong' | 'critical' | 'pinned';

interface QuestionMatrixProps {
  questions: Question[];
  currentIndex: number;
  answers: Record<number, number>;
  bookmarks: number[];
  pinnedQuestions?: number[];
  isExamMode: boolean;
  touchMode?: boolean;
  onSelectIndex: (idx: number) => void;
}

export const QuestionMatrix: React.FC<QuestionMatrixProps> = ({
  questions,
  currentIndex,
  answers,
  bookmarks,
  pinnedQuestions = [],
  isExamMode,
  touchMode = false,
  onSelectIndex,
}) => {
  const [filter, setFilter] = useState<MatrixFilter>('all');

  const visibleItems = useMemo(() => {
    return questions
      .map((q, idx) => ({ q, idx }))
      .filter(({ q }) => {
        const userAns = answers[q.id];
        if (filter === 'unanswered') return userAns === undefined;
        if (filter === 'wrong')
          return userAns !== undefined && userAns !== q.correctAnswer;
        if (filter === 'critical') return q.isCritical;
        if (filter === 'pinned') return pinnedQuestions.includes(q.id);
        return true;
      });
  }, [questions, answers, filter, pinnedQuestions]);

  return (
    <div className="flex h-full flex-col">
      {/* Slim Underline Tabs */}
      <div className="mb-4 flex items-center gap-4 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'all' as MatrixFilter, label: 'Tất cả' },
          { id: 'unanswered' as MatrixFilter, label: 'Chưa làm' },
          ...(!isExamMode ? [{ id: 'wrong' as MatrixFilter, label: 'Câu sai' }] : []),
          { id: 'pinned' as MatrixFilter, label: 'Đã ghim' },
          { id: 'critical' as MatrixFilter, label: 'Điểm liệt' },
        ].map((tab) => {
          const active = filter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`-mb-px border-b-2 pb-2.5 text-xs font-semibold transition-colors ${
                active
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Flat Borderless Cells */}
      <div
        className={`grid flex-1 overflow-y-auto pr-1 content-start ${
          touchMode ? 'grid-cols-6 gap-2.5' : 'grid-cols-5 gap-2'
        }`}
      >
        {visibleItems.map(({ q, idx }) => {
          const isCurrent = idx === currentIndex;
          const userAns = answers[q.id];
          const isDone = userAns !== undefined;
          const isBookmarked = bookmarks.includes(q.id);

          let cellCls =
            'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700';

          if (isDone) {
            if (isExamMode) {
              cellCls =
                'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300';
            } else if (userAns === q.correctAnswer) {
              cellCls =
                'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300';
            } else {
              cellCls =
                'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300';
            }
          }

          if (isCurrent) {
            cellCls =
              'bg-blue-50 text-blue-700 font-bold ring-2 ring-blue-600 dark:bg-blue-950/60 dark:text-blue-300';
          }

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onSelectIndex(idx)}
              className={`relative flex items-center justify-center rounded-lg font-mono text-xs transition-colors ${
                touchMode ? 'h-12 text-sm' : 'h-9'
              } ${cellCls}`}
            >
              {isExamMode ? idx + 1 : q.id}
              {q.isCritical && (
                <span
                  title="Câu điểm liệt"
                  className="absolute top-1 left-1 h-1.5 w-1.5 rounded-full bg-red-500"
                />
              )}
              {(isBookmarked || pinnedQuestions.includes(q.id)) && (
                <span
                  title={pinnedQuestions.includes(q.id) ? 'Đã ghim' : 'Đã đánh dấu'}
                  className={`absolute top-1 right-1 h-1.5 w-1.5 rounded-full ${
                    pinnedQuestions.includes(q.id) ? 'bg-indigo-500' : 'bg-amber-400'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
