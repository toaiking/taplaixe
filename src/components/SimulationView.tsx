import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  EyeOff,
  Film,
  Play,
  RotateCcw,
  Search,
  Shuffle,
  Sparkles,
  XCircle,
} from 'lucide-react';
import {
  SIM_CHAPTERS,
  SIM_EXAM_SETS,
  SIM_SITUATIONS,
  SimOption,
  SimSituation,
} from '../data/simulationData';
import { hapticError, hapticSuccess, hapticTap } from '../utils/haptics';
import { SegmentedControl } from './SegmentedControl';

type SimTab = 'study' | 'exam' | 'guide';

interface SimPartAnswers {
  part1?: 'A' | 'B' | 'C';
  part2?: 'A' | 'B' | 'C';
  part3?: 'A' | 'B' | 'C';
  part4?: 'A' | 'B' | 'C';
}

interface SimExamRecord {
  score: number;
  passed: boolean;
  timestamp: number;
}

const SIM_HISTORY_KEY = 'gplx_sim_2026_exam_history';
const SIM_MASTERED_KEY = 'gplx_sim_2026_mastered';
const SIM_LAST_ID_KEY = 'gplx_sim_2026_last_id';

const PART_META: {
  key: keyof SimPartAnswers;
  badge: string;
  title: string;
}[] = [
  {
    key: 'part1',
    badge: 'Phần 1 • 0,25đ',
    title: '1. Tình huống giao thông trong video là gì?',
  },
  {
    key: 'part2',
    badge: 'Phần 2 • 0,25đ',
    title: '2. Dấu hiệu nhận biết GIÁN TIẾP của tình huống này là gì?',
  },
  {
    key: 'part3',
    badge: 'Phần 3 • 0,25đ',
    title: '3. Dấu hiệu nhận biết TRỰC TIẾP của tình huống này là gì?',
  },
  {
    key: 'part4',
    badge: 'Phần 4 • 0,25đ',
    title: '4. Phương án xử lý như thế nào để đảm bảo an toàn?',
  },
];

function formatTimer(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const SimulationView: React.FC = () => {
  const [tab, setTab] = useState<SimTab>('study');

  // Study mode state
  const [selectedId, setSelectedId] = useState<number>(() => {
    try {
      const saved = Number(localStorage.getItem(SIM_LAST_ID_KEY));
      if (saved >= 1 && saved <= 120) return saved;
    } catch {
      // Ignore
    }
    return 1;
  });
  const [chapterFilter, setChapterFilter] = useState<number>(0); // 0 = all
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [studyAnswers, setStudyAnswers] = useState<Record<number, SimPartAnswers>>({});
  const [showSummaryCard, setShowSummaryCard] = useState<boolean>(true);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [masteredIds, setMasteredIds] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem(SIM_MASTERED_KEY);
      return raw ? (JSON.parse(raw) as number[]) : [];
    } catch {
      return [];
    }
  });

  // Exam mode state
  const [examHistory, setExamHistory] = useState<Record<number, SimExamRecord>>(() => {
    try {
      const raw = localStorage.getItem(SIM_HISTORY_KEY);
      return raw ? (JSON.parse(raw) as Record<number, SimExamRecord>) : {};
    } catch {
      return {};
    }
  });
  const [activeExam, setActiveExam] = useState<{
    maDe: number;
    title: string;
    situations: SimSituation[];
  } | null>(null);
  const [examIdx, setExamIdx] = useState<number>(0);
  const [examAnswers, setExamAnswers] = useState<Record<number, SimPartAnswers>>({});
  const [examTimeLeft, setExamTimeLeft] = useState<number>(15 * 60);
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);

  const studyVideoRef = useRef<HTMLVideoElement | null>(null);
  const examVideoRef = useRef<HTMLVideoElement | null>(null);

  // Save last viewed situation in study mode
  useEffect(() => {
    try {
      localStorage.setItem(SIM_LAST_ID_KEY, String(selectedId));
    } catch {
      // Ignore
    }
  }, [selectedId]);

  const filteredSituations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return SIM_SITUATIONS.filter((s) => {
      if (chapterFilter !== 0 && s.chapter !== chapterFilter) return false;
      if (!q) return true;
      return (
        String(s.id) === q ||
        `th ${s.id}` === q ||
        s.name.toLowerCase().includes(q) ||
        s.indirect.toLowerCase().includes(q) ||
        s.direct.toLowerCase().includes(q) ||
        s.action.toLowerCase().includes(q)
      );
    });
  }, [chapterFilter, searchQuery]);

  const currentStudySituation = useMemo(
    () => SIM_SITUATIONS.find((s) => s.id === selectedId) ?? SIM_SITUATIONS[0],
    [selectedId]
  );

  // Apply playbackRate to video
  useEffect(() => {
    if (studyVideoRef.current) {
      studyVideoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate, currentStudySituation.id]);

  // Exam timer
  useEffect(() => {
    if (!activeExam || examSubmitted) return;
    const timer = window.setInterval(() => {
      setExamTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [activeExam, examSubmitted]);

  // Auto-submit exam when timer reaches 0
  useEffect(() => {
    if (activeExam && !examSubmitted && examTimeLeft === 0) {
      handleSubmitExam();
    }
  }, [activeExam, examSubmitted, examTimeLeft]);

  const handleSelectStudyAnswer = (
    sit: SimSituation,
    partKey: keyof SimPartAnswers,
    opt: SimOption
  ) => {
    if (opt.isCorrect) {
      hapticSuccess();
    } else {
      hapticError();
    }

    setStudyAnswers((prev) => {
      const current = { ...(prev[sit.id] || {}), [partKey]: opt.label };
      const next = { ...prev, [sit.id]: current };

      // Check if all 4 parts are answered correctly
      const p1Ok = sit.parts.part1.find((o) => o.label === current.part1)?.isCorrect;
      const p2Ok = sit.parts.part2.find((o) => o.label === current.part2)?.isCorrect;
      const p3Ok = sit.parts.part3.find((o) => o.label === current.part3)?.isCorrect;
      const p4Ok = sit.parts.part4.find((o) => o.label === current.part4)?.isCorrect;

      if (p1Ok && p2Ok && p3Ok && p4Ok && !masteredIds.includes(sit.id)) {
        const updatedMastered = [...masteredIds, sit.id];
        setMasteredIds(updatedMastered);
        try {
          localStorage.setItem(SIM_MASTERED_KEY, JSON.stringify(updatedMastered));
        } catch {
          // Ignore
        }
      }
      return next;
    });
  };

  const startExamSet = (maDe: number, customIds?: number[], customTitle?: string) => {
    const setObj = SIM_EXAM_SETS.find((e) => e.maDe === maDe);
    const ids = customIds ?? setObj?.questions ?? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const sits = ids
      .map((id) => SIM_SITUATIONS.find((s) => s.id === id))
      .filter((s): s is SimSituation => Boolean(s));

    setActiveExam({
      maDe,
      title: customTitle ?? `Đề kiểm tra mô phỏng số ${maDe}`,
      situations: sits,
    });
    setExamIdx(0);
    setExamAnswers({});
    setExamTimeLeft(15 * 60);
    setExamSubmitted(false);
  };

  const startRandomExam = () => {
    const copy = [...SIM_SITUATIONS];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    const picked = copy.slice(0, 10).sort((a, b) => a.id - b.id);
    startExamSet(0, picked.map((s) => s.id), 'Đề mô phỏng ngẫu nhiên (10 tình huống)');
  };

  const examScoreSummary = useMemo(() => {
    if (!activeExam) return null;
    let totalScore = 0;
    const perSituation: number[] = [];

    activeExam.situations.forEach((sit, idx) => {
      const ans = examAnswers[idx] || {};
      let sScore = 0;
      if (sit.parts.part1.find((o) => o.label === ans.part1)?.isCorrect) sScore += 0.25;
      if (sit.parts.part2.find((o) => o.label === ans.part2)?.isCorrect) sScore += 0.25;
      if (sit.parts.part3.find((o) => o.label === ans.part3)?.isCorrect) sScore += 0.25;
      if (sit.parts.part4.find((o) => o.label === ans.part4)?.isCorrect) sScore += 0.25;
      perSituation.push(sScore);
      totalScore += sScore;
    });

    const rounded = Math.round(totalScore * 100) / 100;
    return {
      totalScore: rounded,
      passed: rounded >= 7.0,
      perSituation,
    };
  }, [activeExam, examAnswers]);

  const handleSubmitExam = () => {
    if (!activeExam || !examScoreSummary) return;
    setExamSubmitted(true);
    if (examScoreSummary.passed) {
      hapticSuccess();
    } else {
      hapticError();
    }

    if (activeExam.maDe > 0) {
      const prev = examHistory[activeExam.maDe];
      const bestScore = prev ? Math.max(prev.score, examScoreSummary.totalScore) : examScoreSummary.totalScore;
      const updated: Record<number, SimExamRecord> = {
        ...examHistory,
        [activeExam.maDe]: {
          score: bestScore,
          passed: bestScore >= 7.0,
          timestamp: Date.now(),
        },
      };
      setExamHistory(updated);
      try {
        localStorage.setItem(SIM_HISTORY_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
    }
  };

  // Render Active Exam Workspace
  if (tab === 'exam' && activeExam) {
    const currentSit = activeExam.situations[examIdx] ?? activeExam.situations[0];
    const currentAns = examAnswers[examIdx] || {};

    return (
      <div className="mx-auto max-w-6xl space-y-5 px-4 py-5 md:px-6">
        {/* Top Exam Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white px-5 py-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveExam(null)}
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              ← Thoát đề
            </button>
            <div>
              <h2 className="text-sm font-bold text-slate-900 sm:text-base dark:text-slate-100">
                {activeExam.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                10 tình huống • Thang điểm 10 (0,25đ / ý) • Đạt ≥ 7,0 điểm
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-mono text-xs font-bold ${
                examTimeLeft <= 60 && !examSubmitted
                  ? 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400'
                  : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              {formatTimer(examTimeLeft)}
            </div>

            {!examSubmitted ? (
              <button
                type="button"
                onClick={handleSubmitExam}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500"
              >
                Chấm điểm ngay
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  startExamSet(
                    activeExam.maDe,
                    activeExam.situations.map((s) => s.id),
                    activeExam.title
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Làm lại đề này
              </button>
            )}
          </div>
        </div>

        {/* Result Banner when submitted */}
        {examSubmitted && examScoreSummary && (
          <div
            className={`rounded-2xl border p-5 ${
              examScoreSummary.passed
                ? 'border-emerald-300 bg-emerald-50/70 dark:border-emerald-700/60 dark:bg-emerald-950/30'
                : 'border-rose-300 bg-rose-50/70 dark:border-rose-700/60 dark:bg-rose-950/30'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {examScoreSummary.passed ? (
                  <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <XCircle className="h-8 w-8 text-rose-600 dark:text-rose-400" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {examScoreSummary.totalScore.toFixed(2)} / 10,0 điểm
                    </span>
                    <span
                      className={`rounded-md px-2.5 py-0.5 text-xs font-bold ${
                        examScoreSummary.passed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-600 text-white'
                      }`}
                    >
                      {examScoreSummary.passed ? 'ĐẠT YÊU CẦU (≥ 7,0)' : 'CHƯA ĐẠT (< 7,0)'}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                    Bấm vào từng ô Tình huống 1–10 bên dưới để xem lại đáp án đúng và giải thích.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 10 Situation Pills */}
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {activeExam.situations.map((sit, idx) => {
            const ans = examAnswers[idx] || {};
            const count =
              (ans.part1 ? 1 : 0) +
              (ans.part2 ? 1 : 0) +
              (ans.part3 ? 1 : 0) +
              (ans.part4 ? 1 : 0);
            const isCurrent = idx === examIdx;
            const sitScore = examScoreSummary?.perSituation[idx] ?? 0;

            let cls =
              'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300';
            if (examSubmitted) {
              cls =
                sitScore >= 0.75
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : sitScore > 0
                    ? 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                    : 'border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-300';
            } else if (count === 4) {
              cls =
                'border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300';
            } else if (count > 0) {
              cls =
                'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300';
            }

            if (isCurrent) {
              cls += ' ring-2 ring-slate-900 dark:ring-indigo-400 font-bold';
            }

            return (
              <button
                key={sit.id}
                type="button"
                onClick={() => setExamIdx(idx)}
                className={`flex flex-col items-center justify-center rounded-xl border py-2 text-xs transition-all ${cls}`}
              >
                <span className="font-mono">Câu {idx + 1}</span>
                <span className="text-[10px] opacity-80">
                  {examSubmitted ? `${sitScore.toFixed(2)}đ` : `${count}/4 ý`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Split Exam Workspace */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Left: Video Player */}
          <div className="space-y-4 lg:col-span-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-950 shadow-sm dark:border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-slate-200">
                <span className="font-mono font-semibold text-indigo-400">
                  Tình huống {examIdx + 1}/10 (Mã TH #{currentSit.id})
                </span>
                <span>Chương {currentSit.chapter}</span>
              </div>
              <div className="aspect-video w-full bg-black">
                <video
                  ref={examVideoRef}
                  key={currentSit.videoUrl}
                  src={currentSit.videoUrl}
                  controls
                  playsInline
                  autoPlay
                  className="h-full w-full object-contain"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={examIdx === 0}
                onClick={() => setExamIdx((i) => Math.max(0, i - 1))}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <ChevronLeft className="h-4 w-4" /> Tình huống trước
              </button>
              <button
                type="button"
                disabled={examIdx >= activeExam.situations.length - 1}
                onClick={() =>
                  setExamIdx((i) => Math.min(activeExam.situations.length - 1, i + 1))
                }
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-40 dark:bg-indigo-600"
              >
                Tình huống tiếp <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right: 4 Multiple-Choice Questions (0.25đ each) */}
          <div className="space-y-3.5 lg:col-span-6">
            {PART_META.map((pm) => {
              const opts = currentSit.parts[pm.key];
              const chosenLabel = currentAns[pm.key];

              return (
                <div
                  key={pm.key}
                  className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="mb-2.5 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {pm.title}
                    </span>
                    <span className="shrink-0 rounded-md bg-indigo-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                      {pm.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {opts.map((opt) => {
                      const isSelected = chosenLabel === opt.label;
                      let optCls =
                        'border-slate-200/80 bg-slate-50/60 text-slate-700 hover:bg-slate-100/80 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200';

                      if (examSubmitted) {
                        if (opt.isCorrect) {
                          optCls =
                            'border-emerald-400 bg-emerald-50 text-emerald-900 font-semibold dark:border-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-200';
                        } else if (isSelected && !opt.isCorrect) {
                          optCls =
                            'border-rose-400 bg-rose-50 text-rose-900 dark:border-rose-600 dark:bg-rose-950/50 dark:text-rose-200';
                        }
                      } else if (isSelected) {
                        optCls =
                          'border-slate-900 bg-slate-900 text-white font-semibold dark:border-indigo-500 dark:bg-indigo-600';
                      }

                      return (
                        <button
                          key={opt.label}
                          type="button"
                          disabled={examSubmitted}
                          onClick={() => {
                            hapticTap();
                            setExamAnswers((prev) => ({
                              ...prev,
                              [examIdx]: {
                                ...(prev[examIdx] || {}),
                                [pm.key]: opt.label,
                              },
                            }));
                          }}
                          className={`flex w-full items-start gap-2.5 rounded-xl border px-3 py-2 text-left text-xs transition-colors ${optCls}`}
                        >
                          <span className="font-mono font-bold">{opt.label}.</span>
                          <span className="flex-1 leading-relaxed">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const currentStudyAns = studyAnswers[currentStudySituation.id] || {};
  const currentIdxInFiltered = filteredSituations.findIndex(
    (s) => s.id === currentStudySituation.id
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:px-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-0.5 font-mono text-xs font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
            <Film className="h-3.5 w-3.5" />
            Thông tư 17/2026/TT-BXD • 120 Tình Huống Giao Thông
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            120 Tình Huống Mô Phỏng 2026
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            480 câu hỏi trắc nghiệm nhận diện nguy cơ (4 ý × 0,25đ = 1,0đ/tình huống) • Đã thuộc{' '}
            <strong className="font-mono text-slate-800 dark:text-slate-200">
              {masteredIds.length}/120
            </strong>{' '}
            tình huống.
          </p>
        </div>

        <SegmentedControl
          value={tab}
          onChange={setTab}
          options={[
            { id: 'study', label: 'Ôn 120 Tình Huống' },
            { id: 'exam', label: 'Thi Thử 18 Đề' },
            { id: 'guide', label: 'Quy Định 2026' },
          ]}
        />
      </div>

      {/* TAB 1: Ôn tập 120 Tình huống */}
      {tab === 'study' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Sidebar: Filter + 120 Situation Selector */}
          <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs lg:col-span-4 lg:h-[calc(100vh-12rem)] dark:border-slate-800 dark:bg-slate-900">
            <div className="space-y-2.5 border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm số (1..120) hoặc tên tình huống..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-3 pl-9 text-xs outline-none focus:border-slate-900 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>

              <select
                value={chapterFilter}
                onChange={(e) => {
                  const chap = Number(e.target.value);
                  setChapterFilter(chap);
                  if (chap !== 0) {
                    const meta = SIM_CHAPTERS.find((c) => c.id === chap);
                    if (meta) setSelectedId(meta.range[0]);
                  }
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value={0}>Tất cả 6 chương (120 tình huống)</option>
                {SIM_CHAPTERS.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.name} ({ch.count} câu)
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-2 flex-1 space-y-1 overflow-y-auto pr-1">
              {filteredSituations.map((item) => {
                const active = item.id === currentStudySituation.id;
                const isMastered = masteredIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      hapticTap();
                      setSelectedId(item.id);
                    }}
                    className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-xs transition-colors ${
                      active
                        ? 'bg-slate-900 font-semibold text-white dark:bg-indigo-600'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="min-w-0 flex-1 truncate">
                      <span className="font-mono font-bold">TH {item.id}:</span> {item.name}
                    </div>
                    {isMastered && (
                      <CheckCircle2
                        className={`h-3.5 w-3.5 shrink-0 ${
                          active ? 'text-emerald-300' : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Workspace: Video + Summary + 4 Questions */}
          <div className="space-y-5 lg:col-span-8">
            {/* Video Card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
                <div>
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    TÌNH HUỐNG {currentStudySituation.id} / 120 • CHƯƠNG {currentStudySituation.chapter}
                  </span>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {currentStudySituation.name}
                  </h2>
                </div>

                <div className="flex items-center gap-1.5">
                  {[1, 1.25, 1.5].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setPlaybackRate(rate)}
                      className={`rounded-lg px-2 py-1 font-mono text-[11px] font-semibold transition-colors ${
                        playbackRate === rate
                          ? 'bg-slate-900 text-white dark:bg-indigo-600'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowSummaryCard((v) => !v)}
                    className="ml-1 inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                  >
                    {showSummaryCard ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" /> Ẩn gợi ý
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" /> Hiện gợi ý
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="aspect-video w-full bg-black">
                <video
                  ref={studyVideoRef}
                  key={currentStudySituation.videoUrl}
                  src={currentStudySituation.videoUrl}
                  controls
                  playsInline
                  autoPlay
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Prev / Next Navigation Bar */}
              <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 dark:border-slate-800">
                <button
                  type="button"
                  disabled={currentIdxInFiltered <= 0}
                  onClick={() => {
                    if (currentIdxInFiltered > 0) {
                      setSelectedId(filteredSituations[currentIdxInFiltered - 1].id);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200"
                >
                  <ChevronLeft className="h-4 w-4" /> Tình huống trước
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setStudyAnswers((prev) => {
                      const copy = { ...prev };
                      delete copy[currentStudySituation.id];
                      return copy;
                    })
                  }
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Làm lại 4 câu này
                </button>

                <button
                  type="button"
                  disabled={
                    currentIdxInFiltered === -1 ||
                    currentIdxInFiltered >= filteredSituations.length - 1
                  }
                  onClick={() => {
                    if (
                      currentIdxInFiltered !== -1 &&
                      currentIdxInFiltered < filteredSituations.length - 1
                    ) {
                      setSelectedId(filteredSituations[currentIdxInFiltered + 1].id);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-40 dark:bg-indigo-600"
                >
                  Tình huống tiếp <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* 4-Part Key Summary Box */}
            {showSummaryCard && (
              <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/50 p-5 dark:border-indigo-900/50 dark:bg-indigo-950/30">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold tracking-wider text-indigo-700 uppercase dark:text-indigo-300">
                  <Sparkles className="h-4 w-4" />
                  Tóm tắt 4 ý ăn trọn 1,0 điểm (Mỗi ý 0,25 điểm)
                </div>
                <div className="grid gap-3 text-xs sm:grid-cols-2">
                  <div className="rounded-xl bg-white/90 p-3 dark:bg-slate-900/90">
                    <div className="font-mono text-[11px] font-bold text-slate-400">
                      1. TÊN TÌNH HUỐNG (0,25đ)
                    </div>
                    <div className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                      {currentStudySituation.name}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/90 p-3 dark:bg-slate-900/90">
                    <div className="font-mono text-[11px] font-bold text-slate-400">
                      2. DẤU HIỆU GIÁN TIẾP (0,25đ)
                    </div>
                    <div className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                      {currentStudySituation.indirect}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/90 p-3 dark:bg-slate-900/90">
                    <div className="font-mono text-[11px] font-bold text-slate-400">
                      3. DẤU HIỆU TRỰC TIẾP (0,25đ)
                    </div>
                    <div className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                      {currentStudySituation.direct}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/90 p-3 dark:bg-slate-900/90">
                    <div className="font-mono text-[11px] font-bold text-slate-400">
                      4. PHƯƠNG ÁN XỬ LÝ AN TOÀN (0,25đ)
                    </div>
                    <div className="mt-1 font-semibold text-emerald-700 dark:text-emerald-400">
                      {currentStudySituation.action}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4 Interactive Multiple-Choice Sub-Questions */}
            <div className="grid gap-4 sm:grid-cols-2">
              {PART_META.map((pm) => {
                const opts = currentStudySituation.parts[pm.key];
                const chosen = currentStudyAns[pm.key];

                return (
                  <div
                    key={pm.key}
                    className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="mb-2.5 flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {pm.title}
                      </span>
                      <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {pm.badge}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {opts.map((opt) => {
                        const isPicked = chosen === opt.label;
                        let cls =
                          'border-slate-200/80 bg-slate-50/70 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300';

                        if (chosen) {
                          if (opt.isCorrect) {
                            cls =
                              'border-emerald-400 bg-emerald-50 text-emerald-900 font-semibold dark:border-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-200';
                          } else if (isPicked) {
                            cls =
                              'border-rose-400 bg-rose-50 text-rose-900 dark:border-rose-600 dark:bg-rose-950/50 dark:text-rose-200';
                          }
                        }

                        return (
                          <button
                            key={opt.label}
                            type="button"
                            onClick={() =>
                              handleSelectStudyAnswer(currentStudySituation, pm.key, opt)
                            }
                            className={`flex w-full items-start gap-2 rounded-xl border px-3 py-2 text-left text-xs transition-colors ${cls}`}
                          >
                            <span className="font-mono font-bold">{opt.label}.</span>
                            <span className="flex-1 leading-relaxed">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Thi thử 18 Bộ đề chuẩn */}
      {tab === 'exam' && !activeExam && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                18 Bộ Đề Kiểm Tra Mô Phỏng (Chuẩn Thông tư 17/2026/TT-BXD)
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Mỗi đề gồm 10 tình huống (40 câu trắc nghiệm × 0,25đ = 10 điểm) • Thời gian 15 phút • Đạt từ 7,0/10 điểm.
              </p>
            </div>
            <button
              type="button"
              onClick={startRandomExam}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500"
            >
              <Shuffle className="h-4 w-4" />
              Tạo đề ngẫu nhiên (10 TH)
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
            {SIM_EXAM_SETS.map((setItem) => {
              const rec = examHistory[setItem.maDe];
              let borderCls =
                'border-slate-200/80 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900';
              let statusText = 'Chưa làm';
              let statusCls = 'text-slate-400';

              if (rec?.passed) {
                borderCls =
                  'border-emerald-300 bg-emerald-50/40 hover:border-emerald-400 dark:border-emerald-700/60 dark:bg-emerald-950/20';
                statusText = `Đạt • ${rec.score.toFixed(2)}/10`;
                statusCls = 'text-emerald-700 dark:text-emerald-400';
              } else if (rec) {
                borderCls =
                  'border-rose-300 bg-rose-50/40 hover:border-rose-400 dark:border-rose-700/60 dark:bg-rose-950/20';
                statusText = `Chưa đạt • ${rec.score.toFixed(2)}/10`;
                statusCls = 'text-rose-600 dark:text-rose-400';
              }

              return (
                <button
                  key={setItem.maDe}
                  type="button"
                  onClick={() => startExamSet(setItem.maDe)}
                  className={`group flex flex-col justify-between rounded-2xl border p-4 text-left transition-all hover:shadow-sm ${borderCls}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Đề số {setItem.maDe}
                    </span>
                    {rec?.passed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : rec ? (
                      <XCircle className="h-4 w-4 text-rose-500" />
                    ) : (
                      <Play className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" />
                    )}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-400">
                    TH: {setItem.questions.slice(0, 4).join(', ')}...
                  </div>
                  <div className={`mt-2.5 font-mono text-xs font-semibold ${statusCls}`}>
                    {statusText}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Quy định & Trọng tâm 6 chương Mô phỏng 2026 */}
      {tab === 'guide' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/60 p-6 dark:border-indigo-900/60 dark:bg-indigo-950/30">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-block rounded-md bg-indigo-600 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-white">
                Thông tư 17/2026/TT-BXD
              </span>
              <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                Ban hành 29/04/2026 • Hiệu lực từ 01/07/2026
              </span>
            </div>
            <h2 className="mt-2.5 text-base font-bold text-slate-900 dark:text-slate-100">
              Quy định kiểm tra mô phỏng các tình huống giao thông năm 2026
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
              Theo <strong>Thông tư 17/2026/TT-BXD</strong> (sửa đổi, bổ sung Thông tư 14/2025/TT-BXD), bài kiểm tra kết thúc học phần mô phỏng gồm <strong>10 tình huống</strong> (thời gian 15 phút), chấm trên <strong>thang điểm 10</strong> (đạt từ <strong>7,0 / 10 điểm</strong> trở lên). Mỗi tình huống tối đa <strong>1,0 điểm</strong> được chia thành <strong>4 câu hỏi trắc nghiệm (mỗi câu 0,25 điểm)</strong> thay vì bấm phím Space căn giây:
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              {[
                {
                  step: 'Phần 1 • 0,25 điểm',
                  title: 'Nhận diện Tên tình huống',
                  desc: 'Xác định đúng bản chất nguy cơ giao thông đang diễn ra trong đoạn video.',
                },
                {
                  step: 'Phần 2 • 0,25 điểm',
                  title: 'Dấu hiệu Gián tiếp',
                  desc: 'Nhận biết sớm yếu tố khuất tầm nhìn, biển báo, giao lộ, thời tiết hoặc địa hình từ xa.',
                },
                {
                  step: 'Phần 3 • 0,25 điểm',
                  title: 'Dấu hiệu Trực tiếp',
                  desc: 'Phát hiện khoảnh khắc đối tượng nguy hiểm trực tiếp xuất hiện (đèn phanh sáng, xe lấn làn, người bước ra).',
                },
                {
                  step: 'Phần 4 • 0,25 điểm',
                  title: 'Phương án Xử lý',
                  desc: 'Chọn cách xử lý lái xe an toàn: chủ động rà phanh, giảm tốc độ, giữ khoảng cách và nhường đường.',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-xl border border-indigo-200/60 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                    {item.step}
                  </div>
                  <div className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SIM_CHAPTERS.map((ch) => {
              const doneInChap = masteredIds.filter(
                (id) => id >= ch.range[0] && id <= ch.range[1]
              ).length;
              return (
                <div
                  key={ch.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-slate-100 px-2.5 py-0.5 font-mono text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        Tình huống {ch.range[0]}–{ch.range[1]}
                      </span>
                      <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {doneInChap}/{ch.count} đã thuộc
                      </span>
                    </div>
                    <h3 className="mt-2.5 text-base font-bold text-slate-900 dark:text-slate-100">
                      {ch.name}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {ch.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setChapterFilter(ch.id);
                      setSelectedId(ch.range[0]);
                      setTab('study');
                    }}
                    className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-indigo-600"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Ôn chương {ch.id} ({ch.count} TH)
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
