import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  CarFront,
  Compass,
  Flame,
  Gauge,
  HeartHandshake,
  Lightbulb,
  Play,
  RotateCcw,
  ShieldAlert,
  Signpost,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { CHAPTERS } from '../data/chapters';
import { useAppStore } from '../store/useAppStore';
import { Question } from '../types/question';

interface DashboardViewProps {
  questions: Question[];
}

const CHAPTER_ICONS: Record<number, React.ReactNode> = {
  1: <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
  2: <HeartHandshake className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
  3: <Gauge className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />,
  4: <Wrench className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
  5: <Signpost className="h-5 w-5 text-rose-600 dark:text-rose-400" />,
  6: <Compass className="h-5 w-5 text-teal-600 dark:text-teal-400" />,
};

export const DashboardView: React.FC<DashboardViewProps> = ({ questions }) => {
  const {
    srs,
    streakDays,
    examHistory,
    navigateToPractice,
    setActiveScreen,
    setCheatSheetOpen,
    resetProgress,
  } = useAppStore();
  const [confirmReset, setConfirmReset] = useState(false);

  const stats = useMemo(() => {
    let mastered = 0;
    let learning = 0;
    let wrong = 0;
    let criticalMastered = 0;
    let totalCorrect = 0;
    let totalWrong = 0;

    for (const q of questions) {
      const p = srs[q.id];
      const box = p?.box ?? 'unlearned';
      if (box === 'mastered') {
        mastered++;
        if (q.isCritical) criticalMastered++;
      } else if (box === 'learning') {
        learning++;
      } else if (box === 'wrong') {
        wrong++;
      }
      if (p) {
        totalCorrect += p.correctCount;
        totalWrong += p.wrongCount;
      }
    }

    const totalAttempts = totalCorrect + totalWrong;
    const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
    // Readiness weighted: 60% mastered/600 + 25% criticalMastered/60 + 15% learning/600
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
      learning,
      wrong,
      criticalMastered,
      accuracy,
      readiness,
      totalAttempts,
    };
  }, [questions, srs]);

  // SVG Ring math
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (stats.readiness / 100) * circumference;

  return (
    <div className="mx-auto max-w-7xl space-y-5 p-4 md:p-6">
      {/* Bento Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
        {/* Khối Hero (Col-span-8) */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 md:col-span-8 dark:border-slate-800 dark:bg-gray-900">
          <div className="flex flex-col-reverse justify-between gap-6 sm:flex-row sm:items-center">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-500/30 dark:bg-blue-950/50 dark:text-blue-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  Chuẩn Cục CSGT 2025
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 font-mono text-xs font-bold tabular-nums text-amber-800 dark:border-amber-500/30 dark:bg-amber-950/50 dark:text-amber-300">
                  🔥 {streakDays} ngày liên tiếp
                </span>
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
                Chỉ số sẵn sàng thi đỗ
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Đã thuộc{' '}
                <strong className="font-mono text-slate-900 dark:text-slate-100">
                  {stats.mastered}/{questions.length}
                </strong>{' '}
                câu hỏi • Tỷ lệ chính xác{' '}
                <strong className="font-mono text-emerald-700 dark:text-emerald-400">
                  {stats.accuracy}%
                </strong>{' '}
                • Đã làm{' '}
                <strong className="font-mono text-slate-900 dark:text-slate-100">
                  {examHistory.length}
                </strong>{' '}
                đề thi thử.
              </p>
            </div>

            {/* SVG Progress Ring */}
            <div className="relative flex h-28 w-28 shrink-0 items-center justify-center self-start sm:self-center">
              <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-100 dark:text-slate-800"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="text-blue-600 transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-2xl font-extrabold tabular-nums text-slate-900 dark:text-slate-100">
                  {stats.readiness}%
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Readiness
                </span>
              </div>
            </div>
          </div>

          {/* Primary CTAs */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() =>
                navigateToPractice({ chapter: 'all', sourceMode: 'srs' })
              }
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 sm:flex-none"
            >
              <Play className="h-4 w-4 fill-current" />
              Tiếp tục lộ trình thông minh
            </button>
            <button
              onClick={() => setActiveScreen('exam')}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition-colors hover:border-blue-400 hover:bg-blue-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 sm:flex-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              <CarFront className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              Thi thử sát hạch ngay
            </button>
            <button
              onClick={() => setCheatSheetOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Lightbulb className="h-4 w-4 text-amber-500" />
              Sổ tay so sánh nhanh
            </button>
          </div>
        </div>

        {/* Khối Trạm Cấp Cứu (Col-span-4) */}
        <div className="flex flex-col gap-4 md:col-span-4">
          <button
            onClick={() =>
              navigateToPractice({ chapter: 'all', sourceMode: 'critical' })
            }
            className="group flex flex-1 flex-col justify-between rounded-2xl border border-red-300 bg-red-50/70 p-5 text-left transition-colors hover:border-red-500 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/30 dark:border-red-500/40 dark:bg-red-950/30 dark:hover:bg-red-950/50"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700 dark:bg-red-900/50 dark:text-red-300">
                <Flame className="h-3.5 w-3.5" />
                Trạm Cấp Cứu
              </span>
              <span className="font-mono text-sm font-bold tabular-nums text-red-700 dark:text-red-300">
                {stats.criticalMastered}/60 thuộc
              </span>
            </div>
            <div className="mt-3">
              <h2 className="text-base font-bold text-red-900 dark:text-red-200">
                60 Câu Điểm Liệt
              </h2>
              <p className="mt-1 text-xs text-red-700/80 dark:text-red-300/80">
                Sai 1 câu trượt toàn bài. Bắt buộc nắm chắc 100%.
              </p>
            </div>
          </button>

          <button
            onClick={() =>
              navigateToPractice({ chapter: 'all', sourceMode: 'wrong' })
            }
            className="group flex flex-1 flex-col justify-between rounded-2xl border border-amber-300 bg-amber-50/70 p-5 text-left transition-colors hover:border-amber-500 hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/30 dark:border-amber-500/40 dark:bg-amber-950/30 dark:hover:bg-amber-950/50"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                <AlertTriangle className="h-3.5 w-3.5" />
                Mistake Bank
              </span>
              <span className="font-mono text-sm font-bold tabular-nums text-amber-800 dark:text-amber-300">
                {stats.wrong} câu sai
              </span>
            </div>
            <div className="mt-3">
              <h2 className="text-base font-bold text-amber-950 dark:text-amber-200">
                Ngân Hàng Câu Hay Sai
              </h2>
              <p className="mt-1 text-xs text-amber-800/80 dark:text-amber-300/80">
                Tự động gom các câu từng chọn sai để ôn tập dứt điểm.
              </p>
            </div>
          </button>
        </div>

        {/* Khối 6 Chương Lý Thuyết (Col-span-12 -> 3 cột) */}
        <div className="md:col-span-12">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              6 Chương Lý Thuyết Chuẩn 2025
            </h2>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Đã thuộc
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400" /> Đang nhớ
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" /> Làm sai
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CHAPTERS.map((chap) => {
              const chapQs = questions.filter((q) => q.chapter === chap.id);
              const total = chapQs.length || 1;
              const masteredCnt = chapQs.filter(
                (q) => srs[q.id]?.box === 'mastered'
              ).length;
              const learningCnt = chapQs.filter(
                (q) => srs[q.id]?.box === 'learning'
              ).length;
              const wrongCnt = chapQs.filter(
                (q) => srs[q.id]?.box === 'wrong'
              ).length;

              const pMastered = (masteredCnt / total) * 100;
              const pLearning = (learningCnt / total) * 100;
              const pWrong = (wrongCnt / total) * 100;

              return (
                <button
                  key={chap.id}
                  onClick={() =>
                    navigateToPractice({ chapter: chap.id, sourceMode: 'all' })
                  }
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left transition-colors hover:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 dark:border-slate-800 dark:bg-gray-900 dark:hover:border-blue-500"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                        {CHAPTER_ICONS[chap.id]}
                      </div>
                      <span className="font-mono text-xs font-semibold tabular-nums text-slate-500 dark:text-slate-400">
                        {chapQs.length} câu ({chap.range[0]}–{chap.range[1]})
                      </span>
                    </div>
                    <h3 className="mt-3.5 text-sm font-bold text-slate-900 group-hover:text-blue-600 sm:text-base dark:text-slate-100 dark:group-hover:text-blue-400">
                      {chap.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {chap.description}
                    </p>
                  </div>

                  {/* 3-color Segmented Progress Bar */}
                  <div className="mt-4">
                    <div className="mb-1.5 flex justify-between font-mono text-[11px] font-semibold tabular-nums text-slate-500 dark:text-slate-400">
                      <span>Đã thuộc: {masteredCnt}/{chapQs.length}</span>
                      <span>{Math.round(pMastered)}%</span>
                    </div>
                    <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${pMastered}%` }}
                      />
                      <div
                        className="h-full bg-amber-400 transition-all duration-300"
                        style={{ width: `${pLearning}%` }}
                      />
                      <div
                        className="h-full bg-rose-500 transition-all duration-300"
                        style={{ width: `${pWrong}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Specialized Topic Quick Drills */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-gray-900">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Chuyên đề luyện nhanh
          </h2>
          <button
            onClick={() => navigateToPractice({ chapter: 'all', sourceMode: 'all' })}
            className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Mở toàn bộ 600 câu →
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            {
              label: 'Tốc độ & Khoảng cách',
              preset: { chapter: 'all' as const, sourceMode: 'speed_distance' as const },
            },
            {
              label: 'Đèn Taplo & Kỹ thuật (227–231, 286–300)',
              preset: { chapter: 'all' as const, sourceMode: 'taplo' as const },
            },
            {
              label: 'Hiệu lệnh CSGT & Vạch kẻ đường',
              preset: { chapter: 'all' as const, sourceMode: 'csgt_markings' as const },
            },
            {
              label: 'Toàn bộ câu có hình ảnh (318 câu)',
              preset: { chapter: 'all' as const, sourceMode: 'all' as const, onlyWithImage: true },
            },
            {
              label: 'Câu chưa thuộc lòng',
              preset: { chapter: 'all' as const, sourceMode: 'all' as const, onlyUnmastered: true },
            },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => navigateToPractice(item.preset)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-blue-500 hover:bg-blue-50/60 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-400"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Progress */}
      <div className="flex justify-end">
        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-rose-500"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Đặt lại tiến độ học tập
          </button>
        ) : (
          <div className="flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-xs dark:border-red-500/40 dark:bg-red-950/40">
            <ShieldAlert className="h-4 w-4 text-red-600" />
            <span className="font-semibold text-red-800 dark:text-red-200">
              Xóa toàn bộ tiến độ & lịch sử thi?
            </span>
            <button
              onClick={() => {
                resetProgress();
                setConfirmReset(false);
              }}
              className="rounded-lg bg-red-600 px-2.5 py-1 font-semibold text-white hover:bg-red-700"
            >
              Xác nhận
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="rounded-lg bg-white px-2.5 py-1 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Hủy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
