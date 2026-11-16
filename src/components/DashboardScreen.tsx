import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Flame,
  Lightbulb,
  RotateCcw,
  Target,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { CHAPTERS } from '../data/chapters';
import { useAppStore } from '../store/useAppStore';
import { Question } from '../types/question';

interface DashboardScreenProps {
  questions: Question[];
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ questions }) => {
  const { srs, navigateToPractice, setActiveScreen, resetProgress, examHistory } =
    useAppStore();
  const [confirmReset, setConfirmReset] = useState(false);

  const stats = useMemo(() => {
    let unlearned = 0;
    let wrong = 0;
    let learning = 0;
    let mastered = 0;
    let totalCorrect = 0;
    let totalWrong = 0;
    let criticalMastered = 0;

    for (const q of questions) {
      const p = srs[q.id];
      const box = p?.box ?? 'unlearned';
      if (box === 'unlearned') unlearned++;
      else if (box === 'wrong') wrong++;
      else if (box === 'learning') learning++;
      else if (box === 'mastered') {
        mastered++;
        if (q.isCritical) criticalMastered++;
      }
      if (p) {
        totalCorrect += p.correctCount;
        totalWrong += p.wrongCount;
      }
    }

    const totalAttempts = totalCorrect + totalWrong;
    const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

    return {
      unlearned,
      wrong,
      learning,
      mastered,
      accuracy,
      criticalMastered,
      totalAttempts,
    };
  }, [questions, srs]);

  const progressPct = Math.round((stats.mastered / questions.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6"
    >
      {/* Hero Summary Card */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-2 dark:border-slate-800 dark:bg-[#1E293B]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#2563EB] dark:bg-blue-500/15 dark:text-blue-400">
                <Target className="h-3.5 w-3.5" />
                Lộ trình ghi nhớ thông minh (SRS)
              </span>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                Tiến độ 600 Câu Lý Thuyết 2025
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Hệ thống tự động đẩy câu hay sai lên đầu và tối ưu ghi nhớ bằng từ khóa.
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-extrabold text-[#2563EB] dark:text-blue-400">
                {stats.mastered}
                <span className="text-lg font-semibold text-slate-400">/{questions.length}</span>
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Câu đã thuộc lòng ({progressPct}%)
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-5">
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#10B981] transition-all duration-500"
                style={{ width: `${Math.max(progressPct, 1)}%` }}
              />
            </div>
          </div>

          {/* 4 SRS Boxes */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 dark:border-slate-700/70 dark:bg-slate-800/60">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Chưa học</div>
              <div className="mt-1 text-xl font-bold text-slate-800 dark:text-slate-100">
                {stats.unlearned}
              </div>
            </div>
            <div className="rounded-xl border border-rose-200 bg-[#FEE2E2]/60 p-3 dark:border-rose-500/30 dark:bg-rose-500/10">
              <div className="text-xs font-medium text-[#EF4444]">Hay sai (Ôn ngay)</div>
              <div className="mt-1 text-xl font-bold text-[#EF4444]">{stats.wrong}</div>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 dark:border-amber-500/30 dark:bg-amber-500/10">
              <div className="text-xs font-medium text-amber-700 dark:text-amber-400">Đang nhớ</div>
              <div className="mt-1 text-xl font-bold text-amber-700 dark:text-amber-400">
                {stats.learning}
              </div>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-[#D1FAE5]/60 p-3 dark:border-emerald-500/30 dark:bg-emerald-500/10">
              <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                Đã thuộc lòng
              </div>
              <div className="mt-1 text-xl font-bold text-[#10B981]">{stats.mastered}</div>
            </div>
          </div>
        </div>

        {/* Accuracy & Exam Stats Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#1E293B]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Tỷ lệ làm đúng
              </span>
              <TrendingUp className="h-5 w-5 text-[#10B981]" />
            </div>
            <div className="mt-2 text-4xl font-extrabold text-slate-900 dark:text-white">
              {stats.accuracy}%
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Trên tổng số {stats.totalAttempts} lượt trả lời
            </p>
          </div>

          <div className="my-4 h-px bg-slate-100 dark:bg-slate-800" />

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Đề thi thử đã làm
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-lg font-bold text-slate-900 dark:text-white">
                <Award className="h-4 w-4 text-[#2563EB]" />
                {examHistory.length} bài thi
              </div>
            </div>
            <button
              onClick={() => setActiveScreen('exam')}
              className="rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              Thi ngay
            </button>
          </div>
        </div>
      </div>

      {/* 4 Quick Action Tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button
          onClick={() =>
            navigateToPractice({ chapter: 'all', sourceMode: 'critical' })
          }
          className="group flex flex-col justify-between rounded-2xl border border-rose-200 bg-white p-5 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:border-[#EF4444] hover:shadow-md dark:border-rose-500/30 dark:bg-[#1E293B]"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FEE2E2] text-[#EF4444] dark:bg-rose-500/20">
              <Flame className="h-6 w-6" />
            </div>
            <span className="rounded-full bg-[#FEE2E2] px-2.5 py-0.5 text-xs font-bold text-[#EF4444] dark:bg-rose-500/20">
              {stats.criticalMastered}/60 thuộc
            </span>
          </div>
          <div className="mt-4">
            <h3 className="font-bold text-slate-900 group-hover:text-[#EF4444] dark:text-white">
              60 Câu Điểm Liệt
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Sai 1 câu trượt toàn bài. Bắt buộc nắm chắc 100%.
            </p>
          </div>
        </button>

        <button
          onClick={() =>
            navigateToPractice({ chapter: 'all', sourceMode: 'srs' })
          }
          className="group flex flex-col justify-between rounded-2xl border border-amber-200 bg-white p-5 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:border-[#F59E0B] hover:shadow-md dark:border-amber-500/30 dark:bg-[#1E293B]"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-[#F59E0B] dark:bg-amber-500/20">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
              {stats.wrong} câu hay sai
            </span>
          </div>
          <div className="mt-4">
            <h3 className="font-bold text-slate-900 group-hover:text-[#F59E0B] dark:text-white">
              Ôn Tập Thông Minh (SRS)
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Ưu tiên đẩy câu hay sai lên đầu để ghi nhớ sâu.
            </p>
          </div>
        </button>

        <button
          onClick={() => setActiveScreen('exam')}
          className="group flex flex-col justify-between rounded-2xl border border-blue-200 bg-white p-5 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:border-[#2563EB] hover:shadow-md dark:border-blue-500/30 dark:bg-[#1E293B]"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-[#2563EB] dark:bg-blue-500/20 dark:text-blue-400">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-[#2563EB] dark:bg-blue-500/20 dark:text-blue-300">
              A1, A, B, C1, C, D
            </span>
          </div>
          <div className="mt-4">
            <h3 className="font-bold text-slate-900 group-hover:text-[#2563EB] dark:text-white">
              Thi Thử Ngẫu Nhiên
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Mô phỏng phòng thi sát hạch, đồng hồ & phím tắt 1-4.
            </p>
          </div>
        </button>

        <button
          onClick={() => setActiveScreen('handbook')}
          className="group flex flex-col justify-between rounded-2xl border border-emerald-200 bg-white p-5 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:border-[#10B981] hover:shadow-md dark:border-emerald-500/30 dark:bg-[#1E293B]"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D1FAE5] text-[#10B981] dark:bg-emerald-500/20">
              <Lightbulb className="h-6 w-6" />
            </div>
            <span className="rounded-full bg-[#D1FAE5] px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
              Cheat Sheets
            </span>
          </div>
          <div className="mt-4">
            <h3 className="font-bold text-slate-900 group-hover:text-[#10B981] dark:text-white">
              Sổ Tay Mẹo & Biển Báo
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Bảng tốc độ, khoảng cách, hạng GPLX 2025 & biển dễ nhầm.
            </p>
          </div>
        </button>
      </div>

      {/* Topic Quick Drills */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#1E293B]">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Ôn tập theo chuyên đề trọng tâm
        </h2>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {[
            {
              label: 'Tốc độ & Khoảng cách',
              preset: { chapter: 'all' as const, sourceMode: 'speed_distance' as const },
            },
            {
              label: 'Đèn Taplo & Kỹ thuật (227-231, 286-300)',
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
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-[#2563EB] hover:bg-blue-50 hover:text-[#2563EB] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-400"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6 Chapters Grid */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <BookOpen className="h-5 w-5 text-[#2563EB]" />
            Ôn Tập Theo 6 Chương (Cục CSGT 2025)
          </h2>
          <button
            onClick={() => navigateToPractice({ chapter: 'all', sourceMode: 'all' })}
            className="flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline dark:text-blue-400"
          >
            Xem toàn bộ 600 câu <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CHAPTERS.map((chap) => {
            const chapQuestions = questions.filter((q) => q.chapter === chap.id);
            const chapMastered = chapQuestions.filter(
              (q) => srs[q.id]?.box === 'mastered'
            ).length;
            const chapWrong = chapQuestions.filter(
              (q) => srs[q.id]?.box === 'wrong'
            ).length;
            const pct = chapQuestions.length
              ? Math.round((chapMastered / chapQuestions.length) * 100)
              : 0;

            return (
              <button
                key={chap.id}
                onClick={() =>
                  navigateToPractice({ chapter: chap.id, sourceMode: 'all' })
                }
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:border-[#2563EB] hover:shadow-md dark:border-slate-800 dark:bg-[#1E293B]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      Câu {chap.range[0]} – {chap.range[1]}
                    </span>
                    <div className="flex items-center gap-2">
                      {chapWrong > 0 && (
                        <span className="rounded-full bg-[#FEE2E2] px-2 py-0.5 text-[11px] font-bold text-[#EF4444] dark:bg-rose-500/20">
                          {chapWrong} sai
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs font-semibold text-[#10B981]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {chapMastered}/{chapQuestions.length}
                      </span>
                    </div>
                  </div>
                  <h3 className="mt-3 font-bold text-slate-900 group-hover:text-[#2563EB] dark:text-white dark:group-hover:text-blue-400">
                    {chap.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {chap.description}
                  </p>
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    <span>Đã thuộc</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-[#2563EB] transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset Progress */}
      <div className="flex justify-end pt-2">
        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-rose-500"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Đặt lại tiến độ học tập
          </button>
        ) : (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs dark:border-rose-500/30 dark:bg-rose-500/10">
            <span className="font-medium text-rose-700 dark:text-rose-300">
              Xóa toàn bộ tiến độ & lịch sử thi?
            </span>
            <button
              onClick={() => {
                resetProgress();
                setConfirmReset(false);
              }}
              className="rounded-lg bg-[#EF4444] px-2.5 py-1 font-semibold text-white hover:bg-rose-600"
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
    </motion.div>
  );
};
