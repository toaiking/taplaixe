import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  EyeOff,
  Play,
  RotateCcw,
  Search,
  Shuffle,
  Sparkles,
  X,
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

type SimTab = 'study' | 'exam' | 'guide';
type PartKey = 'part1' | 'part2' | 'part3' | 'part4';

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

const PART_KEYS: PartKey[] = ['part1', 'part2', 'part3', 'part4'];

const PART_META: {
  key: PartKey;
  shortLabel: string;
  badge: string;
  title: string;
  summaryField: 'name' | 'indirect' | 'direct' | 'action';
}[] = [
  {
    key: 'part1',
    shortLabel: '1. Tên TH',
    badge: '0,25đ',
    title: 'Câu 1: Tình huống giao thông trong video là gì?',
    summaryField: 'name',
  },
  {
    key: 'part2',
    shortLabel: '2. Gián tiếp',
    badge: '0,25đ',
    title: 'Câu 2: Dấu hiệu nhận biết GIÁN TIẾP từ xa là gì?',
    summaryField: 'indirect',
  },
  {
    key: 'part3',
    shortLabel: '3. Trực tiếp',
    badge: '0,25đ',
    title: 'Câu 3: Dấu hiệu nhận biết TRỰC TIẾP khi nguy cơ xuất hiện?',
    summaryField: 'direct',
  },
  {
    key: 'part4',
    shortLabel: '4. Xử lý',
    badge: '0,25đ',
    title: 'Câu 4: Phương án xử lý như thế nào để đảm bảo an toàn?',
    summaryField: 'action',
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
  const [activeStudyPart, setActiveStudyPart] = useState<PartKey>('part1');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showMobilePicker, setShowMobilePicker] = useState<boolean>(false);
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
  const [activeExamPart, setActiveExamPart] = useState<PartKey>('part1');
  const [examAnswers, setExamAnswers] = useState<Record<number, SimPartAnswers>>({});
  const [examTimeLeft, setExamTimeLeft] = useState<number>(15 * 60);
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);

  const studyVideoRef = useRef<HTMLVideoElement | null>(null);
  const examVideoRef = useRef<HTMLVideoElement | null>(null);
  const stepAdvanceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (stepAdvanceTimerRef.current) {
        window.clearTimeout(stepAdvanceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(SIM_LAST_ID_KEY, String(selectedId));
    } catch {
      // Ignore
    }
    setActiveStudyPart('part1');
  }, [selectedId]);

  useEffect(() => {
    setActiveExamPart('part1');
  }, [examIdx]);

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

  useEffect(() => {
    if (activeExam && !examSubmitted && examTimeLeft === 0) {
      handleSubmitExam();
    }
  }, [activeExam, examSubmitted, examTimeLeft]);

  const handleSelectStudyAnswer = (
    sit: SimSituation,
    partKey: PartKey,
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

    if (opt.isCorrect) {
      const idx = PART_KEYS.indexOf(partKey);
      if (idx >= 0 && idx < PART_KEYS.length - 1) {
        if (stepAdvanceTimerRef.current) window.clearTimeout(stepAdvanceTimerRef.current);
        stepAdvanceTimerRef.current = window.setTimeout(() => {
          setActiveStudyPart(PART_KEYS[idx + 1]);
        }, 420);
      }
    }
  };

  const handleSelectExamAnswer = (partKey: PartKey, label: 'A' | 'B' | 'C') => {
    if (examSubmitted) return;
    hapticTap();

    setExamAnswers((prev) => ({
      ...prev,
      [examIdx]: {
        ...(prev[examIdx] || {}),
        [partKey]: label,
      },
    }));

    const idx = PART_KEYS.indexOf(partKey);
    if (idx >= 0 && idx < PART_KEYS.length - 1) {
      if (stepAdvanceTimerRef.current) window.clearTimeout(stepAdvanceTimerRef.current);
      stepAdvanceTimerRef.current = window.setTimeout(() => {
        setActiveExamPart(PART_KEYS[idx + 1]);
      }, 220);
    }
  };

  const startExamSet = (maDe: number, customIds?: number[], customTitle?: string) => {
    const setObj = SIM_EXAM_SETS.find((e) => e.maDe === maDe);
    const ids = customIds ?? setObj?.questions ?? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const sits = ids
      .map((id) => SIM_SITUATIONS.find((s) => s.id === id))
      .filter((s): s is SimSituation => Boolean(s));

    setActiveExam({
      maDe,
      title: customTitle ?? `Đề số ${maDe}`,
      situations: sits,
    });
    setExamIdx(0);
    setActiveExamPart('part1');
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
    startExamSet(0, picked.map((s) => s.id), 'Đề ngẫu nhiên');
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
      const bestScore = prev
        ? Math.max(prev.score, examScoreSummary.totalScore)
        : examScoreSummary.totalScore;
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

  // ============================================================================
  // ACTIVE EXAM WORKSPACE (Single-line header, zero wasted space)
  // ============================================================================
  if (tab === 'exam' && activeExam) {
    const currentSit = activeExam.situations[examIdx] ?? activeExam.situations[0];
    const currentAns = examAnswers[examIdx] || {};
    const activeMeta = PART_META.find((m) => m.key === activeExamPart) ?? PART_META[0];
    const activeOpts = currentSit.parts[activeExamPart];
    const chosenForActivePart = currentAns[activeExamPart];

    return (
      <div className="mx-auto w-full max-w-6xl space-y-2.5 px-3 py-2.5 sm:space-y-3.5 sm:px-6 sm:py-4">
        {/* Single-line Exam Bar */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => setActiveExam(null)}
              className="shrink-0 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              ← Thoát
            </button>
            <span className="truncate text-xs font-bold text-slate-900 sm:text-sm dark:text-slate-100">
              {activeExam.title} • Câu {examIdx + 1}/10
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold ${
                examTimeLeft <= 60 && !examSubmitted
                  ? 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400'
                  : 'bg-white border border-slate-200 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              {formatTimer(examTimeLeft)}
            </div>

            {!examSubmitted ? (
              <button
                type="button"
                onClick={handleSubmitExam}
                className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-indigo-600"
              >
                Nộp bài
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
                className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-semibold text-white"
              >
                <RotateCcw className="h-3 w-3" />
                Thi lại
              </button>
            )}
          </div>
        </div>

        {/* Result Banner when submitted */}
        {examSubmitted && examScoreSummary && (
          <div
            className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3.5 py-2 text-xs ${
              examScoreSummary.passed
                ? 'border-emerald-300 bg-emerald-50/80 text-emerald-900 dark:border-emerald-700/60 dark:bg-emerald-950/40 dark:text-emerald-200'
                : 'border-rose-300 bg-rose-50/80 text-rose-900 dark:border-rose-700/60 dark:bg-rose-950/40 dark:text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {examScoreSummary.passed ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              ) : (
                <XCircle className="h-4 w-4 shrink-0 text-rose-600" />
              )}
              <span className="font-mono text-sm font-bold">
                {examScoreSummary.totalScore.toFixed(2)} / 10,0đ
              </span>
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-bold text-white ${
                  examScoreSummary.passed ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              >
                {examScoreSummary.passed ? 'ĐẠT (≥ 7,0)' : 'CHƯA ĐẠT'}
              </span>
            </div>
            <span className="text-[11px] opacity-85">
              Chạm #1–#10 để xem đáp án từng câu
            </span>
          </div>
        )}

        {/* Single-row 10-question strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
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
              'border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300';
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
              cls =
                'border-slate-900 bg-slate-900 text-white font-bold dark:border-indigo-500 dark:bg-indigo-600';
            }

            return (
              <button
                key={sit.id}
                type="button"
                onClick={() => setExamIdx(idx)}
                className={`flex min-w-[52px] flex-1 items-center justify-between gap-1 rounded-lg border px-2 py-1 font-mono text-[11px] transition-all ${cls}`}
              >
                <span>#{idx + 1}</span>
                <span className="text-[10px] opacity-80">
                  {examSubmitted ? `${sitScore}đ` : `${count}/4`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Split Exam Workspace */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:gap-5">
          {/* Left: Clean Video Player (No extra header bar) */}
          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-black shadow-xs dark:border-slate-800">
              <div className="aspect-video max-h-[33vh] w-full bg-black sm:max-h-none">
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
          </div>

          {/* Right: 4-Step Tabbed Question Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs sm:p-5 lg:col-span-6 dark:border-slate-800 dark:bg-slate-900">
            <div>
              <div className="grid grid-cols-4 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/90">
                {PART_META.map((pm) => {
                  const isCurrentPart = activeExamPart === pm.key;
                  const ansLabel = currentAns[pm.key];
                  const isCorrectAfterSubmit =
                    examSubmitted &&
                    currentSit.parts[pm.key].find((o) => o.label === ansLabel)?.isCorrect;

                  return (
                    <button
                      key={pm.key}
                      type="button"
                      onClick={() => setActiveExamPart(pm.key)}
                      className={`flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-semibold transition-all ${
                        isCurrentPart
                          ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-900 dark:text-white'
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                      }`}
                    >
                      <span className="truncate">{pm.shortLabel}</span>
                      {examSubmitted ? (
                        isCorrectAfterSubmit ? (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                        ) : (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                        )
                      ) : ansLabel ? (
                        <span className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                          ({ansLabel})
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 sm:text-sm dark:text-slate-100">
                    {activeMeta.title}
                  </span>
                  <span className="shrink-0 rounded bg-indigo-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                    {activeMeta.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  {activeOpts.map((opt) => {
                    const isSelected = chosenForActivePart === opt.label;
                    let optCls =
                      'border-slate-200/80 bg-slate-50/70 text-slate-800 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200';

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
                        onClick={() => handleSelectExamAnswer(activeExamPart, opt.label)}
                        className={`flex w-full items-start gap-2.5 rounded-xl border px-3 py-2.5 text-left text-xs transition-colors sm:text-sm ${optCls}`}
                      >
                        <span className="font-mono font-bold">{opt.label}.</span>
                        <span className="flex-1 leading-snug">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-slate-800">
              <button
                type="button"
                disabled={examIdx === 0}
                onClick={() => setExamIdx((i) => Math.max(0, i - 1))}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200"
              >
                <ChevronLeft className="h-4 w-4" /> Câu trước
              </button>

              <span className="font-mono text-[11px] text-slate-400">
                TH #{currentSit.id}
              </span>

              {examIdx < activeExam.situations.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setExamIdx((i) => i + 1)}
                  className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-indigo-600"
                >
                  Câu tiếp <ChevronRight className="h-4 w-4" />
                </button>
              ) : !examSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmitExam}
                  className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
                >
                  <Check className="h-4 w-4" /> Chấm điểm
                </button>
              ) : (
                <span className="text-xs font-medium text-slate-400">Hết đề</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentStudyAns = studyAnswers[currentStudySituation.id] || {};
  const currentIdxInFiltered = filteredSituations.findIndex(
    (s) => s.id === currentStudySituation.id
  );
  const activeStudyMeta =
    PART_META.find((m) => m.key === activeStudyPart) ?? PART_META[0];
  const activeStudyOpts = currentStudySituation.parts[activeStudyPart];
  const chosenStudyOpt = currentStudyAns[activeStudyPart];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-2.5 px-3 py-2.5 sm:space-y-4 sm:px-6 sm:py-4">
      {/* ONE SINGLE COMPACT CONTROL BAR (No bulky title banner, no wrapping!) */}
      <div className="flex items-center justify-between gap-2">
        {/* Left: Compact Mode Tabs */}
        <div className="inline-flex rounded-xl border border-slate-200/80 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
          {(
            [
              { id: 'study', label: 'Ôn 120 câu' },
              { id: 'exam', label: 'Thi 18 đề' },
              { id: 'guide', label: 'Quy định' },
            ] as { id: SimTab; label: string }[]
          ).map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                  active
                    ? 'bg-slate-900 text-white dark:bg-indigo-600'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right: Quick Situation Picker & Hint Toggle (when in Study mode) */}
        {tab === 'study' ? (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowMobilePicker(true)}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200/80 bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-slate-800 hover:bg-slate-50 lg:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              <span>TH {currentStudySituation.id}/120</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            <span className="hidden rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 font-mono text-xs font-semibold text-slate-600 lg:inline-block dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              Đã thuộc {masteredIds.length}/120 tình huống
            </span>

            <button
              type="button"
              onClick={() => setShowHint((v) => !v)}
              className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                showHint
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                  : 'border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
              }`}
            >
              {showHint ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>Đáp án</span>
            </button>
          </div>
        ) : (
          <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
            {masteredIds.length}/120 đã thuộc
          </span>
        )}
      </div>

      {/* =====================================================================
          TAB 1: ÔN TẬP 120 TÌNH HUỐNG
      ===================================================================== */}
      {tab === 'study' && (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:gap-5">
          {/* Desktop Left Sidebar */}
          <div className="hidden flex-col rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs lg:col-span-4 lg:flex lg:h-[calc(100vh-8.5rem)] dark:border-slate-800 dark:bg-slate-900">
            <div className="space-y-2 border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm số (1..120) hoặc tên..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pr-3 pl-8 text-xs outline-none focus:border-slate-900 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
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
                className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
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
                    className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-xs transition-colors ${
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

          {/* Main Study Workspace: Clean Video + 4-Step Question Card */}
          <div className="space-y-2.5 lg:col-span-8 sm:space-y-3.5">
            {/* Clean Video Player (No extra header bar!) */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-black shadow-2xs dark:border-slate-800">
              <div className="aspect-video max-h-[34vh] w-full bg-black sm:max-h-none">
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
            </div>

            {/* 4-Step Tabbed Question Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs sm:p-5 dark:border-slate-800 dark:bg-slate-900">
              {/* 4-Part Step Selector Bar */}
              <div className="grid grid-cols-4 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/90">
                {PART_META.map((pm) => {
                  const isActive = activeStudyPart === pm.key;
                  const pickedLabel = currentStudyAns[pm.key];
                  const pickedObj = currentStudySituation.parts[pm.key].find(
                    (o) => o.label === pickedLabel
                  );

                  return (
                    <button
                      key={pm.key}
                      type="button"
                      onClick={() => setActiveStudyPart(pm.key)}
                      className={`flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-semibold transition-all ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-900 dark:text-white'
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                      }`}
                    >
                      <span className="truncate">{pm.shortLabel}</span>
                      {pickedObj && (
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                            pickedObj.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Optional Compact Inline Hint Pill */}
              {showHint && (
                <div className="mt-2.5 flex items-start gap-2 rounded-xl border border-indigo-200/80 bg-indigo-50/70 px-3 py-2 text-xs text-indigo-950 dark:border-indigo-800/60 dark:bg-indigo-950/40 dark:text-indigo-200">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <span className="font-semibold">Đáp án {activeStudyMeta.shortLabel}: </span>
                    {currentStudySituation[activeStudyMeta.summaryField]}
                  </div>
                </div>
              )}

              {/* Active Part Question & 3 Options */}
              <div className="mt-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 sm:text-sm dark:text-slate-100">
                    {activeStudyMeta.title}
                  </span>
                  <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    TH {currentStudySituation.id} • {activeStudyMeta.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  {activeStudyOpts.map((opt) => {
                    const isPicked = chosenStudyOpt === opt.label;
                    let cls =
                      'border-slate-200/80 bg-slate-50/70 text-slate-800 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200';

                    if (chosenStudyOpt) {
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
                          handleSelectStudyAnswer(
                            currentStudySituation,
                            activeStudyPart,
                            opt
                          )
                        }
                        className={`flex w-full items-start gap-2.5 rounded-xl border px-3 py-2.5 text-left text-xs transition-colors sm:text-sm ${cls}`}
                      >
                        <span className="font-mono font-bold">{opt.label}.</span>
                        <span className="flex-1 leading-snug">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Compact Bottom Navigation Row */}
              <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-slate-800">
                <button
                  type="button"
                  disabled={currentIdxInFiltered <= 0}
                  onClick={() => {
                    if (currentIdxInFiltered > 0) {
                      setSelectedId(filteredSituations[currentIdxInFiltered - 1].id);
                    }
                  }}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200"
                >
                  <ChevronLeft className="h-4 w-4" /> TH trước
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStudyAnswers((prev) => {
                      const copy = { ...prev };
                      delete copy[currentStudySituation.id];
                      return copy;
                    });
                    setActiveStudyPart('part1');
                  }}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Làm lại
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
                  className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-40 dark:bg-indigo-600"
                >
                  TH tiếp <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Bottom Sheet Picker for 120 Situations */}
          {showMobilePicker && (
            <div
              className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/60 backdrop-blur-xs lg:hidden"
              onClick={() => setShowMobilePicker(false)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-[82vh] flex-col rounded-t-2xl bg-white p-4 shadow-2xl dark:bg-slate-900"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Chọn tình huống ({filteredSituations.length}/120)
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowMobilePicker(false)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Nhập số (1..120) hoặc từ khóa..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-3 pl-9 text-xs outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    />
                  </div>
                  <select
                    value={chapterFilter}
                    onChange={(e) => setChapterFilter(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <option value={0}>Tất cả 6 chương (120 tình huống)</option>
                    {SIM_CHAPTERS.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        {ch.name} ({ch.count} câu)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-2 flex-1 space-y-1 overflow-y-auto">
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
                          setShowMobilePicker(false);
                        }}
                        className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-xs ${
                          active
                            ? 'bg-slate-900 font-semibold text-white dark:bg-indigo-600'
                            : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300'
                        }`}
                      >
                        <div className="min-w-0 flex-1 truncate">
                          <span className="font-mono font-bold">TH {item.id}:</span> {item.name}
                        </div>
                        {isMastered && (
                          <CheckCircle2
                            className={`h-4 w-4 shrink-0 ${
                              active ? 'text-emerald-300' : 'text-emerald-600'
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 2: THI THỬ 18 BỘ ĐỀ CHUẨN
      ===================================================================== */}
      {tab === 'exam' && !activeExam && (
        <div className="space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div>
              <h2 className="text-sm font-bold text-slate-900 sm:text-base dark:text-slate-100">
                18 Bộ Đề Kiểm Tra Mô Phỏng (Thông tư 17/2026/TT-BXD)
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                10 tình huống / đề • Thang điểm 10 (0,25đ / ý) • 15 phút • Đạt từ 7,0/10 điểm.
              </p>
            </div>
            <button
              type="button"
              onClick={startRandomExam}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-indigo-600"
            >
              <Shuffle className="h-3.5 w-3.5" />
              Đề ngẫu nhiên
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
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
                  className={`group flex flex-col justify-between rounded-2xl border p-3.5 text-left transition-all hover:shadow-sm ${borderCls}`}
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
                  <div className="mt-1 truncate text-[10px] text-slate-400">
                    TH: {setItem.questions.slice(0, 5).join(', ')}...
                  </div>
                  <div className={`mt-2 font-mono text-xs font-semibold ${statusCls}`}>
                    {statusText}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: QUY ĐỊNH & 6 CHƯƠNG MÔ PHỎNG 2026
      ===================================================================== */}
      {tab === 'guide' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/60 p-4 sm:p-6 dark:border-indigo-900/60 dark:bg-indigo-950/30">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-block rounded-md bg-indigo-600 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-white">
                Thông tư 17/2026/TT-BXD
              </span>
              <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                Hiệu lực từ 01/07/2026
              </span>
            </div>
            <h2 className="mt-2 text-sm font-bold text-slate-900 sm:text-base dark:text-slate-100">
              Cách tính điểm bài kiểm tra mô phỏng năm 2026 (Thang điểm 10)
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              Mỗi đề gồm <strong>10 tình huống</strong> (15 phút), đạt từ <strong>7,0 / 10 điểm</strong>. Mỗi tình huống tối đa <strong>1,0 điểm</strong> chia đều cho <strong>4 câu trắc nghiệm (0,25đ/câu)</strong>:
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {[
                {
                  step: 'Câu 1 • 0,25đ',
                  title: 'Tên tình huống',
                  desc: 'Nhận diện đúng tình huống nguy hiểm trong video.',
                },
                {
                  step: 'Câu 2 • 0,25đ',
                  title: 'Dấu hiệu gián tiếp',
                  desc: 'Yếu tố che khuất tầm nhìn, biển báo hoặc giao lộ từ xa.',
                },
                {
                  step: 'Câu 3 • 0,25đ',
                  title: 'Dấu hiệu trực tiếp',
                  desc: 'Khoảnh khắc đối tượng nguy hiểm trực tiếp xuất hiện.',
                },
                {
                  step: 'Câu 4 • 0,25đ',
                  title: 'Phương án xử lý',
                  desc: 'Chủ động rà phanh, giảm tốc độ và nhường đường.',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-xl border border-indigo-200/60 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                    {item.step}
                  </div>
                  <div className="mt-0.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </div>
                  <p className="mt-1 text-[11px] leading-snug text-slate-600 dark:text-slate-400">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SIM_CHAPTERS.map((ch) => {
              const doneInChap = masteredIds.filter(
                (id) => id >= ch.range[0] && id <= ch.range[1]
              ).length;
              return (
                <div
                  key={ch.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        TH {ch.range[0]}–{ch.range[1]}
                      </span>
                      <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {doneInChap}/{ch.count} đã thuộc
                      </span>
                    </div>
                    <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">
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
                    className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-indigo-600"
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
