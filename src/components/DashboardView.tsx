import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  BookOpen,
  Compass,
  Film,
  Flame,
  Gauge,
  HeartHandshake,
  Pin,
  RotateCcw,
  Signpost,
  Wrench,
} from 'lucide-react';
import { CHAPTERS } from '../data/chapters';
import { useAppStore } from '../store/useAppStore';
import { Question } from '../types/question';
import { StudyScheduleModal } from './StudyScheduleModal';

interface DashboardViewProps {
  questions: Question[];
}

const CHAPTER_ICONS: Record<number, React.ReactNode> = {
  1: <BookOpen className="h-5 w-5" />,
  2: <HeartHandshake className="h-5 w-5" />,
  3: <Gauge className="h-5 w-5" />,
  4: <Wrench className="h-5 w-5" />,
  5: <Signpost className="h-5 w-5" />,
  6: <Compass className="h-5 w-5" />,
};

export const DashboardView: React.FC<DashboardViewProps> = ({ questions }) => {
  const {
    srs,
    pinnedQuestions,
    lastPracticeMap,
    studySchedule,
    navigateToPractice,
    setActiveScreen,
    resetProgress,
  } = useAppStore();
  const [confirmReset, setConfirmReset] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const lastSavedQId = lastPracticeMap['all_srs'] ?? lastPracticeMap['all_all'];

  const stats = useMemo(() => {
    let mastered = 0;
    let learning = 0;
    let wrong = 0;
    let unlearned = 0;
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
      } else {
        unlearned++;
      }
    }

    const total = questions.length || 1;
    return {
      mastered,
      learning,
      wrong,
      unlearned,
      criticalMastered,
      pMastered: (mastered / total) * 100,
      pLearning: (learning / total) * 100,
      pWrong: (wrong / total) * 100,
    };
  }, [questions, srs]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-8">
      {/* Top Bento Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Col-span-8: Progress & Multi-Segment Bar */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-7 shadow-2xs lg:col-span-8 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-4xl font-bold tracking-tight tabular-nums text-slate-900 dark:text-slate-100">
                  {stats.mastered} / {questions.length}
                </span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  câu đã thuộc
                </span>
              </div>
              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Chuẩn Cục CSGT 2026
              </span>
            </div>

            {/* Multi-Segment Progress Bar */}
            <div className="my-5 flex h-3 w-full gap-0.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${stats.pMastered}%` }}
              />
              <div
                className="h-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${stats.pLearning}%` }}
              />
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${stats.pWrong}%` }}
              />
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Đã thuộc ({stats.mastered})
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                Đang học ({stats.learning})
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Cần ôn lại ({stats.wrong})
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                Chưa học ({stats.unlearned})
              </span>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() =>
                navigateToPractice({ chapter: 'all', sourceMode: 'srs' })
              }
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-xs transition-all hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500"
            >
              {lastSavedQId
                ? `Tiếp tục học (Câu ${lastSavedQId}) →`
                : 'Bắt đầu lộ trình học →'}
            </button>
            <button
              type="button"
              onClick={() => setActiveScreen('exam')}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Thi thử đề ngẫu nhiên
            </button>
          </div>
        </div>

        {/* Col-span-4: 3 Focus Cards (Điểm liệt, Hay sai, Đã ghim) */}
        <div className="flex flex-col justify-between gap-3.5 lg:col-span-4">
          <button
            type="button"
            onClick={() =>
              navigateToPractice({ chapter: 'all', sourceMode: 'critical' })
            }
            className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-slate-200/80 border-l-4 border-l-rose-500 bg-white p-4.5 text-left transition-all hover:shadow-md dark:border-slate-800 dark:border-l-rose-500 dark:bg-slate-900"
          >
            <div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-slate-100">
                <Flame className="h-4 w-4 text-rose-500" />
                60 Câu Điểm Liệt
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Bắt buộc đúng 100% khi thi
              </p>
            </div>
            <span className="font-mono text-lg font-semibold tabular-nums text-rose-600 dark:text-rose-400">
              {stats.criticalMastered}/60
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              navigateToPractice({ chapter: 'all', sourceMode: 'wrong' })
            }
            className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-slate-200/80 border-l-4 border-l-amber-500 bg-white p-4.5 text-left transition-all hover:shadow-md dark:border-slate-800 dark:border-l-amber-500 dark:bg-slate-900"
          >
            <div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-slate-100">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Ngân Hàng Câu Hay Sai
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Các câu cần xử lý ngay
              </p>
            </div>
            <span className="font-mono text-lg font-semibold tabular-nums text-amber-600 dark:text-amber-400">
              {stats.wrong}
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              navigateToPractice({ chapter: 'all', sourceMode: 'pinned' })
            }
            className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-slate-200/80 border-l-4 border-l-indigo-500 bg-white p-4.5 text-left transition-all hover:shadow-md dark:border-slate-800 dark:border-l-indigo-500 dark:bg-slate-900"
          >
            <div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-slate-100">
                <Pin className="h-4 w-4 text-indigo-500" />
                Câu Hỏi Đã Ghim
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Các câu bạn tự ghim để xem lại
              </p>
            </div>
            <span className="font-mono text-lg font-semibold tabular-nums text-indigo-600 dark:text-indigo-400">
              {pinnedQuestions.length}
            </span>
          </button>
        </div>
      </div>

      {/* Study Schedule & Reminder Strip */}
      <div className="flex flex-col justify-between gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-5 sm:flex-row sm:items-center sm:px-6 sm:py-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start gap-3 sm:items-center">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Bell className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {studySchedule.enabled
                ? `Lịch ôn tập lúc ${studySchedule.time} • Mục tiêu ${studySchedule.dailyGoal} câu/ngày`
                : 'Đặt lịch ôn tập & nhận thông báo nhắc giờ học'}
            </div>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {studySchedule.enabled
                ? 'Thông báo tự động sẽ gửi khi đến giờ học đã chọn.'
                : 'Tạo thói quen ôn thi 15 phút mỗi ngày để đạt tỷ lệ đỗ tối đa.'}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {studySchedule.enabled && (
            <button
              type="button"
              onClick={() =>
                navigateToPractice({
                  chapter: 'all',
                  sourceMode: studySchedule.focusMode,
                })
              }
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800 dark:bg-indigo-600"
            >
              Ôn theo lịch →
            </button>
          )}
          <button
            type="button"
            onClick={() => setScheduleOpen(true)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {studySchedule.enabled ? 'Chỉnh lịch' : 'Tạo lịch ôn tập'}
          </button>
        </div>
      </div>

      {/* 120 Traffic Simulation 2026 Strip */}
      <div className="flex flex-col justify-between gap-3.5 rounded-2xl border border-indigo-200/80 bg-indigo-50/50 p-5 sm:flex-row sm:items-center sm:px-6 sm:py-4 dark:border-indigo-900/60 dark:bg-indigo-950/30">
        <div className="flex items-start gap-3 sm:items-center">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <Film className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                120 Tình Huống Mô Phỏng Giao Thông 2026
              </span>
              <span className="shrink-0 whitespace-nowrap rounded-md bg-indigo-600 px-2 py-0.5 font-mono text-[10px] font-semibold text-white">
                TT 17/2026/TT-BXD
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              120 video tình huống thực tế + 480 câu trắc nghiệm nhận diện nguy cơ (4 ý × 0,25đ = 1,0đ/câu) &amp; 18 bộ đề chuẩn.
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <button
            type="button"
            onClick={() => setActiveScreen('simulation')}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500"
          >
            Vào ôn 120 tình huống →
          </button>
        </div>
      </div>

      {/* 6 Rich Chapter Cards */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
            6 Chương Lý Thuyết Chuẩn 2026
          </h2>
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Đặt lại tiến độ
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-600 dark:text-slate-300">Xóa toàn bộ tiến độ?</span>
              <button
                type="button"
                onClick={() => {
                  resetProgress();
                  setConfirmReset(false);
                }}
                className="font-semibold text-rose-600 hover:underline"
              >
                Xác nhận
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="font-medium text-slate-500 hover:underline"
              >
                Hủy
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
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
                type="button"
                onClick={() =>
                  navigateToPractice({ chapter: chap.id, sourceMode: 'all' })
                }
                className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 text-left transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/60 bg-slate-50 text-slate-700 transition-colors group-hover:bg-slate-900 group-hover:text-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:group-hover:bg-indigo-600">
                        {CHAPTER_ICONS[chap.id]}
                      </div>
                      <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                        CHƯƠNG {String(chap.id).padStart(2, '0')}
                      </span>
                    </div>
                    <span className="rounded-md bg-slate-50 px-2.5 py-1 font-mono text-xs tabular-nums text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {masteredCnt} / {chapQs.length} câu
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-100">
                    {chap.shortTitle}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {chap.description}
                  </p>
                </div>

                <div className="mt-5">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-400 tabular-nums">{pct}%</span>
                    <span className="font-medium text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-indigo-400">
                      Vào học →
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <StudyScheduleModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
      />
    </div>
  );
};
