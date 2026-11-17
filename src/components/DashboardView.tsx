import React, { useMemo, useState } from 'react';
import { CHAPTERS } from '../data/chapters';
import { useAppStore } from '../store/useAppStore';
import { Question } from '../types/question';

interface DashboardViewProps {
  questions: Question[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ questions }) => {
  const {
    srs,
    examHistory,
    navigateToPractice,
    setActiveScreen,
    resetProgress,
  } = useAppStore();
  const [confirmReset, setConfirmReset] = useState(false);

  const stats = useMemo(() => {
    let mastered = 0;
    let learning = 0;
    let wrong = 0;
    let criticalMastered = 0;

    for (const q of questions) {
      const box = srs[q.id]?.box ?? 'unlearned';
      if (box === 'mastered') {
        mastered++;
        if (q.isCritical) criticalMastered++;
      } else if (box === 'learning') {
        learning++;
      } else if (box === 'wrong') {
        wrong++;
      }
    }

    const readiness = Math.min(
      100,
      Math.round(
        (mastered / questions.length) * 65 +
          (criticalMastered / 60) * 25 +
          (learning / questions.length) * 10
      )
    );

    return {
      mastered,
      wrong,
      criticalMastered,
      readiness,
    };
  }, [questions, srs]);

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-6 py-10">
      {/* Khu vực 1: Minimal Hero Strip */}
      <section className="flex flex-col justify-between gap-6 border-b border-zinc-200/80 pb-8 md:flex-row md:items-end dark:border-zinc-800/80">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
            TIẾN ĐỘ TỔNG QUAN
          </div>
          <div className="mt-1 flex flex-wrap items-baseline">
            <span className="text-4xl font-semibold tracking-tight tabular-nums text-zinc-900 dark:text-zinc-100">
              {stats.mastered} / {questions.length}
            </span>
            <span className="ml-3 text-sm text-zinc-500 dark:text-zinc-400">
              {stats.readiness}% sẵn sàng • {examHistory.length} đề đã thi
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() =>
                navigateToPractice({ chapter: 'all', sourceMode: 'srs' })
              }
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
            >
              Bắt đầu học
            </button>
            <button
              onClick={() => setActiveScreen('exam')}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Thi thử sát hạch
            </button>
          </div>
        </div>

        {/* 2 Stat Columns (No colored boxes) */}
        <div className="flex items-center gap-10">
          <button
            onClick={() =>
              navigateToPractice({ chapter: 'all', sourceMode: 'critical' })
            }
            className="group text-left"
          >
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              <span>Điểm liệt</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 font-mono text-xl font-medium tabular-nums text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-200 dark:group-hover:text-white">
              <span>{stats.criticalMastered} / 60</span>
              <span className="text-sm text-zinc-400 transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </div>
          </button>

          <button
            onClick={() =>
              navigateToPractice({ chapter: 'all', sourceMode: 'wrong' })
            }
            className="group text-left"
          >
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              <span>Câu làm sai</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 font-mono text-xl font-medium tabular-nums text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-200 dark:group-hover:text-white">
              <span>{stats.wrong} câu</span>
              <span className="text-sm text-zinc-400 transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* Khu vực 2: Hairline Border Grid (6 Chapters) */}
      <section>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-zinc-500">
          NỘI DUNG 6 CHƯƠNG
        </h2>

        <div className="grid grid-cols-1 gap-[1px] overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-200/80 md:grid-cols-3 dark:border-zinc-800/60 dark:bg-zinc-800/60">
          {CHAPTERS.map((chap) => {
            const chapQs = questions.filter((q) => q.chapter === chap.id);
            const total = chapQs.length || 1;
            const masteredCnt = chapQs.filter(
              (q) => srs[q.id]?.box === 'mastered'
            ).length;
            const pct = Math.round((masteredCnt / total) * 100);

            return (
              <button
                key={chap.id}
                onClick={() =>
                  navigateToPractice({ chapter: chap.id, sourceMode: 'all' })
                }
                className="flex flex-col justify-between bg-white p-6 text-left transition-colors hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900/80"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-xs text-zinc-500">
                    <span>CHƯƠNG {String(chap.id).padStart(2, '0')}</span>
                    <span className="tabular-nums">
                      {masteredCnt}/{chapQs.length}
                    </span>
                  </div>
                  <h3 className="mt-3 mb-1.5 text-base font-medium text-zinc-900 dark:text-zinc-100">
                    {chap.shortTitle}
                  </h3>
                  <p className="line-clamp-1 text-xs text-zinc-500">
                    {chap.description}
                  </p>
                </div>

                <div className="mt-5 h-[2px] w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                  <div
                    className="h-full bg-zinc-900 transition-all duration-300 dark:bg-zinc-200"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Khu vực 3: Minimal Text Links */}
      <section className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-zinc-500">
        <span>Luyện theo nhóm:</span>
        <button
          onClick={() =>
            navigateToPractice({ chapter: 'all', sourceMode: 'critical' })
          }
          className="underline-offset-4 hover:text-zinc-900 hover:underline dark:hover:text-zinc-200"
        >
          60 câu điểm liệt
        </button>
        <button
          onClick={() =>
            navigateToPractice({
              chapter: 'all',
              sourceMode: 'all',
              onlyWithImage: true,
            })
          }
          className="underline-offset-4 hover:text-zinc-900 hover:underline dark:hover:text-zinc-200"
        >
          318 câu có hình ảnh
        </button>
        <button
          onClick={() =>
            navigateToPractice({ chapter: 'all', sourceMode: 'speed_distance' })
          }
          className="underline-offset-4 hover:text-zinc-900 hover:underline dark:hover:text-zinc-200"
        >
          Tốc độ &amp; Khoảng cách
        </button>
        <button
          onClick={() =>
            navigateToPractice({ chapter: 5, sourceMode: 'all' })
          }
          className="underline-offset-4 hover:text-zinc-900 hover:underline dark:hover:text-zinc-200"
        >
          Biển báo &amp; Sa hình
        </button>

        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="underline-offset-4 hover:text-zinc-900 hover:underline dark:hover:text-zinc-200"
          >
            Đặt lại tiến độ
          </button>
        ) : (
          <span className="inline-flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
            <span>Xác nhận xóa?</span>
            <button
              onClick={() => {
                resetProgress();
                setConfirmReset(false);
              }}
              className="font-medium text-red-600 underline-offset-4 hover:underline dark:text-red-400"
            >
              Xóa
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="underline-offset-4 hover:underline"
            >
              Hủy
            </button>
          </span>
        )}
      </section>
    </div>
  );
};
