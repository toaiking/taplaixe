import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertOctagon,
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Grid,
  History,
  Layers,
  Play,
  Send,
  Shuffle,
  Sparkles,
  Trophy,
  X,
  XCircle,
  ZoomIn,
} from 'lucide-react';
import { EXAM_CONFIGS } from '../data/chapters';
import { useAppStore } from '../store/useAppStore';
import { ExamConfig, ExamResult, Question } from '../types/question';
import { getQuestionExplanation } from '../utils/mnemonics';
import { LightboxModal } from './LightboxModal';

interface ExamScreenProps {
  questions: Question[];
}

type LobbyTab = 'fixed' | 'random' | 'topic';

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithRng<T>(arr: T[], rng: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function generateExamQuestions(
  allQuestions: Question[],
  config: ExamConfig,
  seed?: number
): Question[] {
  const rng = seed !== undefined ? mulberry32(seed) : Math.random;
  const chosenIds = new Set<number>();
  const picked: Question[] = [];

  const criticalPool = shuffleWithRng(
    allQuestions.filter((q) => q.isCritical),
    rng
  );
  for (let i = 0; i < Math.min(config.criticalCount, criticalPool.length); i++) {
    picked.push(criticalPool[i]);
    chosenIds.add(criticalPool[i].id);
  }

  const remainingByChapter: Record<number, number> = { ...config.chapterWeights };
  for (const q of picked) {
    if (remainingByChapter[q.chapter] > 0) {
      remainingByChapter[q.chapter]--;
    }
  }

  for (const [chapStr, count] of Object.entries(remainingByChapter)) {
    const chap = Number(chapStr);
    if (count <= 0) continue;
    const pool = shuffleWithRng(
      allQuestions.filter((q) => q.chapter === chap && !chosenIds.has(q.id)),
      rng
    );
    for (let i = 0; i < Math.min(count, pool.length); i++) {
      picked.push(pool[i]);
      chosenIds.add(pool[i].id);
    }
  }

  if (picked.length < config.totalQuestions) {
    const rest = shuffleWithRng(
      allQuestions.filter((q) => !chosenIds.has(q.id)),
      rng
    );
    for (const q of rest) {
      if (picked.length >= config.totalQuestions) break;
      picked.push(q);
    }
  }

  return picked.sort((a, b) => a.chapter - b.chapter || a.id - b.id);
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const ExamScreen: React.FC<ExamScreenProps> = ({ questions }) => {
  const { examHistory, saveExamResult, recordAnswer, srs } = useAppStore();

  const [phase, setPhase] = useState<'lobby' | 'running' | 'result'>('lobby');
  const [lobbyTab, setLobbyTab] = useState<LobbyTab>('fixed');
  const [selectedClassId, setSelectedClassId] = useState<string>('B');
  const [activeConfig, setActiveConfig] = useState<{
    key?: string;
    name: string;
    totalQuestions: number;
    durationMinutes: number;
    passScore: number;
    requireNoCriticalError: boolean;
  }>({
    name: 'Hạng B',
    totalQuestions: 30,
    durationMinutes: 20,
    passScore: 27,
    requireNoCriticalError: true,
  });

  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [lastResult, setLastResult] = useState<ExamResult | null>(null);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [showGridDrawer, setShowGridDrawer] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const selectedLicenseConfig = useMemo(
    () => EXAM_CONFIGS.find((c) => c.id === selectedClassId) ?? EXAM_CONFIGS[1],
    [selectedClassId]
  );

  // Best result map per fixed examKey
  const bestByExamKey = useMemo(() => {
    const map: Record<string, ExamResult> = {};
    for (const r of examHistory) {
      if (!r.examKey) continue;
      const prev = map[r.examKey];
      if (!prev || r.correctCount > prev.correctCount || (r.passed && !prev.passed)) {
        map[r.examKey] = r;
      }
    }
    return map;
  }, [examHistory]);

  const wrongQuestions = useMemo(
    () => questions.filter((q) => srs[q.id]?.box === 'wrong'),
    [questions, srs]
  );

  const launchCustomExam = (
    qList: Question[],
    meta: {
      key?: string;
      name: string;
      durationMinutes: number;
      passScore: number;
      requireNoCriticalError?: boolean;
    }
  ) => {
    setActiveConfig({
      key: meta.key,
      name: meta.name,
      totalQuestions: qList.length,
      durationMinutes: meta.durationMinutes,
      passScore: meta.passScore,
      requireNoCriticalError: meta.requireNoCriticalError ?? true,
    });
    setExamQuestions(qList);
    setCurrentIndex(0);
    setAnswers({});
    setFlagged([]);
    setTimeLeft(meta.durationMinutes * 60);
    setConfirmSubmit(false);
    setPhase('running');
  };

  const startStandardExam = (config: ExamConfig, fixedSetNumber?: number) => {
    const seed =
      fixedSetNumber !== undefined
        ? config.id.split('').reduce((acc, ch) => acc * 31 + ch.charCodeAt(0), 7) +
          fixedSetNumber * 997
        : undefined;
    const generated = generateExamQuestions(questions, config, seed);
    const label =
      fixedSetNumber !== undefined
        ? `${config.name} — Đề số ${fixedSetNumber}`
        : `${config.name} (Ngẫu nhiên)`;
    const key =
      fixedSetNumber !== undefined ? `${config.id}_set_${fixedSetNumber}` : undefined;

    launchCustomExam(generated, {
      key,
      name: label,
      durationMinutes: config.durationMinutes,
      passScore: config.passScore,
      requireNoCriticalError: true,
    });
  };

  const startTopicExam = (topicId: string) => {
    if (topicId === 'critical_60') {
      const list = questions.filter((q) => q.isCritical);
      launchCustomExam(list, {
        key: 'topic_critical_60',
        name: 'Bộ 60 Câu Điểm Liệt',
        durationMinutes: 30,
        passScore: 60,
        requireNoCriticalError: true,
      });
    } else if (topicId === 'hard_50') {
      const pool = shuffleWithRng(
        questions.filter(
          (q) =>
            q.isCritical ||
            q.question.toLowerCase().includes('tốc độ') ||
            q.question.toLowerCase().includes('khoảng cách') ||
            q.question.toLowerCase().includes('niên hạn') ||
            q.question.toLowerCase().includes('nồng độ cồn') ||
            q.question.toLowerCase().includes('vạch')
        ),
        mulberry32(202505)
      ).slice(0, 50);
      launchCustomExam(pool, {
        key: 'topic_hard_50',
        name: 'Top 50 Câu Dễ Nhầm & Bẫy Kinh Điển',
        durationMinutes: 30,
        passScore: 45,
        requireNoCriticalError: true,
      });
    } else if (topicId === 'signs_30') {
      const pool = shuffleWithRng(
        questions.filter((q) => q.chapter === 5),
        Math.random
      ).slice(0, 30);
      launchCustomExam(pool, {
        name: 'Chuyên đề 30 Câu Biển Báo',
        durationMinutes: 20,
        passScore: 27,
        requireNoCriticalError: false,
      });
    } else if (topicId === 'sahinh_30') {
      const pool = shuffleWithRng(
        questions.filter((q) => q.chapter === 6),
        Math.random
      ).slice(0, 30);
      launchCustomExam(pool, {
        name: 'Chuyên đề 30 Câu Sa Hình',
        durationMinutes: 20,
        passScore: 27,
        requireNoCriticalError: false,
      });
    } else if (topicId === 'wrong_personal') {
      if (wrongQuestions.length === 0) return;
      const pool = wrongQuestions.slice(0, 40);
      launchCustomExam(pool, {
        name: `Đề Ôn Câu Hay Sai (${pool.length} câu)`,
        durationMinutes: Math.max(10, Math.ceil(pool.length * 0.7)),
        passScore: Math.ceil(pool.length * 0.9),
        requireNoCriticalError: true,
      });
    }
  };

  const submitExam = () => {
    let correctCount = 0;
    let failedByCritical = false;

    for (const q of examQuestions) {
      const userAns = answers[q.id];
      const isCorrect = userAns === q.correctAnswer;
      if (isCorrect) {
        correctCount++;
      } else if (q.isCritical && activeConfig.requireNoCriticalError) {
        failedByCritical = true;
      }
      if (userAns !== undefined) {
        recordAnswer(q.id, isCorrect);
      }
    }

    const passed = !failedByCritical && correctCount >= activeConfig.passScore;
    const result: ExamResult = {
      id: `${Date.now()}`,
      examKey: activeConfig.key,
      examName: activeConfig.name,
      date: Date.now(),
      totalQuestions: examQuestions.length,
      correctCount,
      passScore: activeConfig.passScore,
      passed,
      failedByCritical,
      durationSeconds: activeConfig.durationMinutes * 60 - timeLeft,
      questionIds: examQuestions.map((q) => q.id),
      answers,
    };

    saveExamResult(result);
    setLastResult(result);
    setConfirmSubmit(false);
    setPhase('result');
  };

  useEffect(() => {
    if (phase !== 'running') return;
    if (timeLeft <= 0) {
      submitExam();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, timeLeft]);

  const currentQ = examQuestions[currentIndex];

  const toggleFlag = (qId: number) => {
    setFlagged((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  useEffect(() => {
    if (phase !== 'running' || !currentQ || lightboxSrc) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setCurrentIndex((i) => Math.min(examQuestions.length - 1, i + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setCurrentIndex((i) => Math.max(0, i - 1));
      } else if (e.key === ' ') {
        e.preventDefault();
        toggleFlag(currentQ.id);
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (idx < currentQ.options.length) {
          setAnswers((prev) => ({ ...prev, [currentQ.id]: idx }));
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase, currentQ, examQuestions.length, lightboxSrc]);

  const answeredCount = useMemo(
    () => examQuestions.filter((q) => answers[q.id] !== undefined).length,
    [examQuestions, answers]
  );

  if (phase === 'lobby') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6"
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#1E293B]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Phòng Thi Sát Hạch & Bộ Đề Đa Dạng (2025)
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Chọn thi theo <strong>20 bộ đề cố định</strong>, <strong>đề ngẫu nhiên</strong>{' '}
                hoặc <strong>đề luyện chuyên đề</strong>. Hỗ trợ phím tắt{' '}
                <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-bold dark:bg-slate-800">
                  1-4
                </kbd>{' '}
                <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-bold dark:bg-slate-800">
                  ←/→
                </kbd>{' '}
                <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-bold dark:bg-slate-800">
                  Space
                </kbd>
                .
              </p>
            </div>
          </div>

          {/* 3 Lobby Mode Tabs */}
          <div className="mt-5 flex flex-wrap gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
            <button
              onClick={() => setLobbyTab('fixed')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all sm:text-sm ${
                lobbyTab === 'fixed'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              <Layers className="h-4 w-4" />
              Bộ 20 Đề Chuẩn (Theo Hạng)
            </button>
            <button
              onClick={() => setLobbyTab('random')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all sm:text-sm ${
                lobbyTab === 'random'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              <Shuffle className="h-4 w-4" />
              Đề Thi Ngẫu Nhiên
            </button>
            <button
              onClick={() => setLobbyTab('topic')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all sm:text-sm ${
                lobbyTab === 'topic'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              Đề Luyện Chuyên Đề
            </button>
          </div>

          {/* TAB 1: Fixed 20 Exam Sets */}
          {lobbyTab === 'fixed' && (
            <div className="mt-5 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Chọn hạng GPLX:
                </span>
                {EXAM_CONFIGS.map((cfg) => (
                  <button
                    key={cfg.id}
                    onClick={() => setSelectedClassId(cfg.id)}
                    className={`rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all ${
                      selectedClassId === cfg.id
                        ? 'border-[#2563EB] bg-blue-50 text-[#2563EB] dark:bg-blue-500/20 dark:text-blue-300'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {cfg.name}
                  </button>
                ))}
              </div>

              <div className="rounded-xl bg-slate-50 px-4 py-2.5 text-xs font-medium text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                <strong>{selectedLicenseConfig.name}:</strong> {selectedLicenseConfig.subtitle} •
                Điểm đạt: <strong>≥ {selectedLicenseConfig.passScore}/{selectedLicenseConfig.totalQuestions}</strong> (Không sai câu điểm liệt)
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => {
                  const key = `${selectedLicenseConfig.id}_set_${num}`;
                  const best = bestByExamKey[key];
                  return (
                    <button
                      key={num}
                      onClick={() => startStandardExam(selectedLicenseConfig, num)}
                      className={`group flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-[#2563EB] hover:shadow-sm ${
                        best?.passed
                          ? 'border-emerald-300 bg-[#D1FAE5]/35 dark:border-emerald-500/40 dark:bg-emerald-500/10'
                          : best
                            ? 'border-rose-300 bg-[#FEE2E2]/35 dark:border-rose-500/40 dark:bg-rose-500/10'
                            : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-extrabold text-slate-900 group-hover:text-[#2563EB] dark:text-white">
                          Đề số {num}
                        </span>
                        {best?.passed ? (
                          <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                        ) : best ? (
                          <XCircle className="h-4 w-4 text-[#EF4444]" />
                        ) : (
                          <Play className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#2563EB]" />
                        )}
                      </div>
                      <div className="mt-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        {best
                          ? `${best.passed ? 'ĐẠT' : 'TRƯỢT'} (${best.correctCount}/${best.totalQuestions})`
                          : `${selectedLicenseConfig.totalQuestions} câu • ${selectedLicenseConfig.durationMinutes} phút`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Random Exam */}
          {lobbyTab === 'random' && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {EXAM_CONFIGS.map((cfg) => (
                <div
                  key={cfg.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-5 transition-all hover:border-[#2563EB] dark:border-slate-700 dark:bg-slate-800/60"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                        {cfg.name}
                      </span>
                      <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-[#2563EB] dark:bg-blue-500/20 dark:text-blue-300">
                        Đạt ≥ {cfg.passScore}/{cfg.totalQuestions}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                      {cfg.subtitle}
                    </p>
                  </div>

                  <button
                    onClick={() => startStandardExam(cfg)}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-2.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-blue-700"
                  >
                    <Shuffle className="h-4 w-4" />
                    Tạo đề ngẫu nhiên
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Topic Drills */}
          {lobbyTab === 'topic' && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  id: 'critical_60',
                  title: 'Bộ 60 Câu Điểm Liệt',
                  desc: 'Thi kiểm tra toàn bộ 60 câu điểm liệt. Yêu cầu đúng 60/60 câu.',
                  badge: '60 câu • 30 phút',
                  accent: 'border-rose-200 hover:border-[#EF4444]',
                  btnCls: 'bg-[#EF4444] hover:bg-rose-600',
                },
                {
                  id: 'hard_50',
                  title: 'Top 50 Câu Dễ Nhầm & Bẫy',
                  desc: 'Tổng hợp các câu hay sai về tốc độ, khoảng cách, nồng độ cồn, vạch kẻ.',
                  badge: '50 câu • 30 phút',
                  accent: 'border-amber-200 hover:border-[#F59E0B]',
                  btnCls: 'bg-[#F59E0B] hover:bg-amber-600',
                },
                {
                  id: 'signs_30',
                  title: 'Chuyên Đề Biển Báo',
                  desc: '30 câu ngẫu nhiên thuộc Chương 5 (Cấm, Nguy hiểm, Hiệu lệnh, Chỉ dẫn).',
                  badge: '30 câu • 20 phút',
                  accent: 'border-blue-200 hover:border-[#2563EB]',
                  btnCls: 'bg-[#2563EB] hover:bg-blue-700',
                },
                {
                  id: 'sahinh_30',
                  title: 'Chuyên Đề Giải Thế Sa Hình',
                  desc: '30 câu ngẫu nhiên thuộc Chương 6 luyện phản xạ thứ tự ưu tiên.',
                  badge: '30 câu • 20 phút',
                  accent: 'border-emerald-200 hover:border-[#10B981]',
                  btnCls: 'bg-[#10B981] hover:bg-emerald-600',
                },
                {
                  id: 'wrong_personal',
                  title: 'Đề Ôn Câu Hay Sai (Cá Nhân)',
                  desc:
                    wrongQuestions.length > 0
                      ? `Tạo đề riêng từ ${wrongQuestions.length} câu bạn từng làm sai trong SRS.`
                      : 'Bạn chưa có câu sai nào trong SRS. Hãy làm bài hoặc luyện tập thêm!',
                  badge: `${wrongQuestions.length} câu hay sai`,
                  accent: 'border-slate-200 hover:border-[#2563EB]',
                  btnCls: 'bg-slate-800 hover:bg-slate-900 dark:bg-[#2563EB]',
                  disabled: wrongQuestions.length === 0,
                },
              ].map((t) => (
                <div
                  key={t.id}
                  className={`flex flex-col justify-between rounded-2xl border bg-slate-50/70 p-5 transition-all dark:bg-slate-800/60 ${t.accent}`}
                >
                  <div>
                    <span className="inline-block rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-slate-600 shadow-2xs dark:bg-slate-900 dark:text-slate-300">
                      {t.badge}
                    </span>
                    <h3 className="mt-3 text-base font-extrabold text-slate-900 dark:text-white">
                      {t.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {t.desc}
                    </p>
                  </div>
                  <button
                    disabled={t.disabled}
                    onClick={() => startTopicExam(t.id)}
                    className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${t.btnCls}`}
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Bắt đầu làm đề
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Exam History */}
        {examHistory.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#1E293B]">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
              <History className="h-5 w-5 text-[#2563EB]" />
              Lịch sử thi gần đây
            </h2>
            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              {examHistory.slice(0, 10).map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {item.examName}
                    </span>
                    <span className="ml-2 text-xs text-slate-400">
                      {new Date(item.date).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {item.correctCount}/{item.totalQuestions} câu (
                      {formatTime(item.durationSeconds)})
                    </span>
                    {item.passed ? (
                      <span className="rounded-full bg-[#D1FAE5] px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                        ĐẠT
                      </span>
                    ) : (
                      <span className="rounded-full bg-[#FEE2E2] px-2.5 py-0.5 text-xs font-bold text-[#EF4444] dark:bg-rose-500/20">
                        {item.failedByCritical ? 'TRƯỢT (ĐIỂM LIỆT)' : 'TRƯỢT'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  if (phase === 'result' && lastResult) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        <div
          className={`rounded-2xl border-2 p-6 shadow-xs ${
            lastResult.passed
              ? 'border-[#10B981] bg-[#D1FAE5]/40 dark:border-emerald-500 dark:bg-emerald-500/10'
              : 'border-[#EF4444] bg-[#FEE2E2]/40 dark:border-rose-500 dark:bg-rose-500/10'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white ${
                  lastResult.passed ? 'bg-[#10B981]' : 'bg-[#EF4444]'
                }`}
              >
                {lastResult.passed ? (
                  <Trophy className="h-7 w-7" />
                ) : (
                  <AlertOctagon className="h-7 w-7" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Kết quả: {lastResult.examName}
                </div>
                <h1
                  className={`text-2xl font-extrabold sm:text-3xl ${
                    lastResult.passed ? 'text-[#10B981]' : 'text-[#EF4444]'
                  }`}
                >
                  {lastResult.passed
                    ? 'CHÚC MỪNG — ĐẠT SÁT HẠCH!'
                    : lastResult.failedByCritical
                      ? 'TRƯỢT NGAY LẬP TỨC (SAI CÂU ĐIỂM LIỆT)'
                      : 'CHƯA ĐẠT — CẦN ÔN THÊM'}
                </h1>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                  Đúng <strong>{lastResult.correctCount}</strong>/{lastResult.totalQuestions} câu
                  (Yêu cầu ≥ {lastResult.passScore}) • Thời gian:{' '}
                  {formatTime(lastResult.durationSeconds)}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => launchCustomExam(examQuestions, activeConfig)}
                className="rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
              >
                Làm lại đề này
              </button>
              <button
                onClick={() => setPhase('lobby')}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Chọn đề khác
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Chi tiết bài làm & Giải thích
          </h2>
          {examQuestions.map((q, idx) => {
            const userAns = lastResult.answers[q.id];
            const isCorrect = userAns === q.correctAnswer;
            const exp = getQuestionExplanation(q);

            return (
              <div
                key={q.id}
                className={`rounded-2xl border bg-white p-5 dark:bg-[#1E293B] ${
                  isCorrect
                    ? 'border-emerald-200 dark:border-emerald-500/30'
                    : 'border-rose-300 dark:border-rose-500/40'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      Đề câu {idx + 1} (Gốc: Câu {q.id})
                    </span>
                    {q.isCritical && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-[#FEE2E2] px-2 py-0.5 text-xs font-bold text-[#EF4444]">
                        <Flame className="h-3.5 w-3.5" />
                        ĐIỂM LIỆT
                      </span>
                    )}
                  </div>
                  {isCorrect ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-[#10B981]">
                      <CheckCircle2 className="h-4 w-4" /> Đúng
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-[#EF4444]">
                      <XCircle className="h-4 w-4" />{' '}
                      {userAns === undefined ? 'Chưa trả lời' : 'Sai'}
                    </span>
                  )}
                </div>

                <p className="mt-2.5 text-sm font-bold text-slate-900 dark:text-white">
                  {q.question}
                </p>

                {q.image && (
                  <button
                    type="button"
                    onClick={() => setLightboxSrc(q.image)}
                    className="mt-3 inline-flex rounded-xl border border-slate-200 bg-white p-2"
                  >
                    <img
                      src={q.image}
                      alt={`Câu ${q.id}`}
                      className="max-h-44 w-auto object-contain"
                    />
                  </button>
                )}

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt, oIdx) => {
                    const isRight = oIdx === q.correctAnswer;
                    const isPicked = oIdx === userAns;
                    let cls =
                      'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300';
                    if (isRight) {
                      cls =
                        'border-[#10B981] bg-[#D1FAE5]/70 font-semibold text-slate-900 dark:bg-emerald-500/20 dark:text-white';
                    } else if (isPicked) {
                      cls =
                        'border-[#EF4444] bg-[#FEE2E2]/70 font-semibold text-slate-900 dark:bg-rose-500/20 dark:text-white';
                    }
                    return (
                      <div key={oIdx} className={`rounded-xl border px-3 py-2 text-xs ${cls}`}>
                        {oIdx + 1}. {opt}
                      </div>
                    );
                  })}
                </div>

                {!isCorrect && (
                  <p className="mt-3 rounded-xl bg-blue-50/70 px-3 py-2 text-xs text-slate-700 dark:bg-blue-500/10 dark:text-slate-200">
                    <strong>{exp.rule}:</strong> {exp.tip}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <LightboxModal src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-4 sm:px-6 sm:py-6">
      {/* Zutobi-style Exam Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={() => setPhase('lobby')}
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/70 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Thoát</span>
        </button>

        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold sm:text-sm ${
              timeLeft < 120
                ? 'bg-[#FEE2E2] text-[#EF4444]'
                : 'bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300'
            }`}
          >
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>

          <button
            onClick={() => setShowGridDrawer(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <Grid className="h-3.5 w-3.5" />
            <span>
              {answeredCount}/{examQuestions.length}
            </span>
          </button>

          <button
            onClick={() => setConfirmSubmit(true)}
            className="flex items-center gap-1.5 rounded-full bg-[#10B981] px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-600 sm:text-sm"
          >
            <Send className="h-3.5 w-3.5" />
            Nộp bài
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-teal-600 transition-all duration-300"
          style={{
            width: `${Math.round(((currentIndex + 1) / Math.max(1, examQuestions.length)) * 100)}%`,
          }}
        />
      </div>

      {confirmSubmit && (
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm dark:border-amber-500/40 dark:bg-amber-500/15">
          <span className="font-semibold text-amber-900 dark:text-amber-200">
            Bạn đã làm {answeredCount}/{examQuestions.length} câu. Xác nhận nộp bài ngay?
          </span>
          <div className="flex gap-2">
            <button
              onClick={submitExam}
              className="rounded-full bg-teal-600 px-4 py-1.5 text-xs font-bold text-white"
            >
              Nộp bài ngay
            </button>
            <button
              onClick={() => setConfirmSubmit(false)}
              className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Làm tiếp
            </button>
          </div>
        </div>
      )}

      {currentQ && (
        <div className="mx-auto max-w-2xl space-y-5 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-teal-600 px-3 py-1 text-xs font-bold text-white">
                Câu {currentIndex + 1}/{examQuestions.length}
              </span>
              <span className="text-xs font-medium text-slate-400">
                #{currentQ.id}
              </span>
            </div>
            <button
              onClick={() => toggleFlag(currentQ.id)}
              className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${
                flagged.includes(currentQ.id)
                  ? 'border-amber-300 bg-amber-50 text-[#F59E0B] dark:bg-amber-500/15'
                  : 'border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              <Bookmark
                className={`h-3.5 w-3.5 ${
                  flagged.includes(currentQ.id) ? 'fill-[#F59E0B]' : ''
                }`}
              />
              Phân vân
            </button>
          </div>

          {currentQ.image && (
            <button
              type="button"
              onClick={() => setLightboxSrc(currentQ.image)}
              className="group relative flex w-full items-center justify-center rounded-2xl border border-slate-200/90 bg-white p-3 shadow-sm hover:border-teal-600"
            >
              <img
                src={currentQ.image}
                alt={`Câu ${currentQ.id}`}
                className="max-h-64 w-auto object-contain sm:max-h-72"
              />
              <span className="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-slate-900/75 px-2.5 py-1 text-[11px] font-semibold text-white">
                <ZoomIn className="h-3.5 w-3.5" /> Phóng to
              </span>
            </button>
          )}

          <h2 className="text-center text-base font-bold leading-relaxed text-slate-900 sm:text-lg dark:text-white">
            {currentQ.question}
          </h2>

          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const selected = answers[currentQ.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() =>
                    setAnswers((prev) => ({ ...prev, [currentQ.id]: idx }))
                  }
                  className={`flex w-full items-start gap-3.5 rounded-2xl border-2 p-4 text-left transition-all active:scale-[0.99] ${
                    selected
                      ? 'border-teal-600 bg-teal-50/70 text-slate-900 shadow-xs dark:border-teal-400 dark:bg-teal-500/20 dark:text-white'
                      : 'border-slate-200/80 bg-white shadow-xs hover:border-teal-500 dark:border-slate-700/80 dark:bg-[#1E293B]'
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                      selected
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="flex-1 text-sm font-medium leading-relaxed sm:text-[15px]">
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white py-3.5 text-sm font-bold shadow-xs disabled:opacity-40 dark:border-slate-700 dark:bg-[#1E293B]"
            >
              <ChevronLeft className="h-4 w-4" /> Câu trước
            </button>
            <button
              onClick={() =>
                setCurrentIndex((i) => Math.min(examQuestions.length - 1, i + 1))
              }
              disabled={currentIndex >= examQuestions.length - 1}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-teal-600 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-teal-700 disabled:opacity-40"
            >
              Câu tiếp <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Slide-over Exam Grid Drawer */}
      <AnimatePresence>
        {showGridDrawer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-xs"
            onClick={() => setShowGridDrawer(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="flex h-full w-full max-w-sm flex-col bg-white p-5 shadow-2xl dark:bg-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Trạng thái bài thi ({answeredCount}/{examQuestions.length})
                </h3>
                <button
                  onClick={() => setShowGridDrawer(false)}
                  className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded bg-teal-600" /> Đang xem
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded bg-[#10B981]" /> Đã làm
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded bg-[#F59E0B]" /> Đánh dấu
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded bg-slate-200 dark:bg-slate-700" /> Chưa làm
                </span>
              </div>

              <div className="mt-4 grid flex-1 grid-cols-5 gap-2 overflow-y-auto pr-1 content-start">
                {examQuestions.map((q, idx) => {
                  const isCurrent = idx === currentIndex;
                  const isDone = answers[q.id] !== undefined;
                  const isFlag = flagged.includes(q.id);

                  let cls =
                    'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300';
                  if (isFlag) {
                    cls = 'border-amber-400 bg-amber-100 text-amber-800';
                  } else if (isDone) {
                    cls = 'border-emerald-400 bg-[#D1FAE5] text-emerald-800';
                  }
                  if (isCurrent) {
                    cls = 'border-teal-600 bg-teal-600 text-white';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setShowGridDrawer(false);
                      }}
                      className={`rounded-xl border py-2 text-xs font-bold transition-all ${cls}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <LightboxModal src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    </div>
  );
};
