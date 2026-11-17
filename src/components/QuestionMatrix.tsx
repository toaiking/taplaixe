import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Question } from '../types/question';

export type MatrixFilter = 'all' | 'unanswered' | 'wrong' | 'critical';

interface QuestionMatrixProps {
  questions: Question[];
  currentIndex: number;
  answers: Record<number, number>;
  bookmarks: number[];
  isExamMode: boolean;
  onSelectIndex: (idx: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const QuestionMatrix: React.FC<QuestionMatrixProps> = ({
  questions,
  currentIndex,
  answers,
  bookmarks,
  isExamMode,
  onSelectIndex,
  onPrev,
  onNext,
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
        return true;
      });
  }, [questions, answers, filter]);

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-gray-900">
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Header & Quick Filter Pills */}
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Bảng câu hỏi ({visibleItems.length})
          </span>
        </div>

        <div className="mb-3 flex flex-wrap gap-1.5">
          {[
            { id: 'all' as MatrixFilter, label: 'Tất cả' },
            { id: 'unanswered' as MatrixFilter, label: 'Chưa làm' },
            ...(!isExamMode ? [{ id: 'wrong' as MatrixFilter, label: 'Câu sai' }] : []),
            { id: 'critical' as MatrixFilter, label: 'Điểm liệt' },
          ].map((pill) => {
            const active = filter === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setFilter(pill.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* 5-col Matrix */}
        <div className="grid max-h-[calc(100vh-17rem)] grid-cols-5 gap-2 overflow-y-auto pr-1 content-start">
          {visibleItems.map(({ q, idx }) => {
            const isCurrent = idx === currentIndex;
            const userAns = answers[q.id];
            const isDone = userAns !== undefined;
            const isBookmarked = bookmarks.includes(q.id);

            let cellCls =
              'border-slate-200 bg-white text-slate-700 hover:border-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200';

            if (isDone) {
              if (isExamMode) {
                cellCls =
                  'border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-500/40 dark:bg-blue-950/50 dark:text-blue-200';
              } else if (userAns === q.correctAnswer) {
                cellCls =
                  'border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-500/50 dark:bg-emerald-950/40 dark:text-emerald-300';
              } else {
                cellCls =
                  'border-rose-500 bg-rose-50 text-rose-800 dark:border-rose-500/50 dark:bg-rose-950/40 dark:text-rose-300';
              }
            }

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onSelectIndex(idx)}
                className={`relative flex h-10 items-center justify-center rounded-lg border font-mono text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 ${cellCls} ${
                  isCurrent
                    ? 'ring-2 ring-blue-600 ring-offset-1 dark:ring-offset-gray-900'
                    : ''
                }`}
              >
                {isExamMode ? idx + 1 : q.id}
                {q.isCritical && (
                  <span
                    title="Câu điểm liệt"
                    className="absolute top-1 left-1 h-1.5 w-1.5 rounded-full bg-red-500"
                  />
                )}
                {isBookmarked && (
                  <span
                    title="Đã đánh dấu"
                    className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-amber-400"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Prev / Next */}
      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <ChevronLeft className="h-4 w-4" />
          Câu trước
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={currentIndex >= questions.length - 1}
          className="flex items-center justify-center gap-1 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-40"
        >
          Câu tiếp
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
