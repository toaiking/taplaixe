import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  History,
  Layers,
  Play,
  Shuffle,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { EXAM_CONFIGS } from '../data/chapters';
import { useAppStore } from '../store/useAppStore';
import { ExamConfig, ExamResult, Question } from '../types/question';
import { QuizWorkspace } from './QuizWorkspace';

interface ExamLobbyViewProps {
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

export const ExamLobbyView: React.FC<ExamLobbyViewProps> = ({ questions }) => {
  const { examHistory, srs } = useAppStore();
  const [lobbyTab, setLobbyTab] = useState<LobbyTab>('fixed');
  const [selectedClassId, setSelectedClassId] = useState<string>('B');
  const [activeExam, setActiveExam] = useState<{
    runId: number;
    title: string;
    questions: Question[];
    meta: {
      key?: string;
      durationMinutes: number;
      passScore: number;
      requireNoCriticalError: boolean;
    };
  } | null>(null);

  const selectedLicenseConfig = useMemo(
    () => EXAM_CONFIGS.find((c) => c.id === selectedClassId) ?? EXAM_CONFIGS[1],
    [selectedClassId]
  );

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

    setActiveExam({
      runId: Date.now(),
      title: label,
      questions: generated,
      meta: {
        key,
        durationMinutes: config.durationMinutes,
        passScore: config.passScore,
        requireNoCriticalError: true,
      },
    });
  };

  const startTopicExam = (topicId: string) => {
    if (topicId === 'critical_60') {
      setActiveExam({
        runId: Date.now(),
        title: 'Bộ 60 Câu Điểm Liệt',
        questions: questions.filter((q) => q.isCritical),
        meta: {
          key: 'topic_critical_60',
          durationMinutes: 30,
          passScore: 60,
          requireNoCriticalError: true,
        },
      });
    } else if (topicId === 'hard_50') {
      const pool = shuffleWithRng(
        questions.filter(
          (q) =>
            q.isCritical ||
            q.question.toLowerCase().includes('tốc độ') ||
            q.question.toLowerCase().includes('khoảng cách') ||
            q.question.toLowerCase().includes('nồng độ cồn') ||
            q.question.toLowerCase().includes('vạch')
        ),
        mulberry32(202505)
      ).slice(0, 50);
      setActiveExam({
        runId: Date.now(),
        title: 'Top 50 Câu Dễ Nhầm & Bẫy',
        questions: pool,
        meta: {
          key: 'topic_hard_50',
          durationMinutes: 30,
          passScore: 45,
          requireNoCriticalError: true,
        },
      });
    } else if (topicId === 'signs_30') {
      setActiveExam({
        runId: Date.now(),
        title: 'Chuyên đề 30 Câu Biển Báo',
        questions: shuffleWithRng(
          questions.filter((q) => q.chapter === 5),
          Math.random
        ).slice(0, 30),
        meta: {
          durationMinutes: 20,
          passScore: 27,
          requireNoCriticalError: false,
        },
      });
    } else if (topicId === 'sahinh_30') {
      setActiveExam({
        runId: Date.now(),
        title: 'Chuyên đề 30 Câu Sa Hình',
        questions: shuffleWithRng(
          questions.filter((q) => q.chapter === 6),
          Math.random
        ).slice(0, 30),
        meta: {
          durationMinutes: 20,
          passScore: 27,
          requireNoCriticalError: false,
        },
      });
    } else if (topicId === 'wrong_personal' && wrongQuestions.length > 0) {
      const pool = wrongQuestions.slice(0, 40);
      setActiveExam({
        runId: Date.now(),
        title: `Đề Ôn Câu Hay Sai (${pool.length} câu)`,
        questions: pool,
        meta: {
          durationMinutes: Math.max(10, Math.ceil(pool.length * 0.7)),
          passScore: Math.ceil(pool.length * 0.9),
          requireNoCriticalError: true,
        },
      });
    }
  };

  if (activeExam) {
    return (
      <QuizWorkspace
        key={activeExam.runId}
        mode="exam"
        questions={activeExam.questions}
        title={activeExam.title}
        examMeta={activeExam.meta}
        onExit={() => setActiveExam(null)}
        onRestartExam={() =>
          setActiveExam((prev) =>
            prev ? { ...prev, runId: Date.now() } : null
          )
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5 p-4 md:p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900">
        <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl dark:text-slate-100">
          Phòng Thi Sát Hạch & Bộ Đề Đa Dạng (2025)
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Chọn từ 20 bộ đề cố định theo từng hạng bằng, đề ngẫu nhiên hoặc đề luyện chuyên đề.
        </p>

        {/* Lobby Tabs */}
        <div className="mt-5 flex flex-wrap gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
          <button
            onClick={() => setLobbyTab('fixed')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-colors sm:text-sm ${
              lobbyTab === 'fixed'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            <Layers className="h-4 w-4" />
            Bộ 20 Đề Chuẩn
          </button>
          <button
            onClick={() => setLobbyTab('random')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-colors sm:text-sm ${
              lobbyTab === 'random'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            <Shuffle className="h-4 w-4" />
            Đề Thi Ngẫu Nhiên
          </button>
          <button
            onClick={() => setLobbyTab('topic')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-colors sm:text-sm ${
              lobbyTab === 'topic'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Đề Luyện Chuyên Đề
          </button>
        </div>

        {/* Fixed 20 Sets */}
        {lobbyTab === 'fixed' && (
          <div className="mt-5 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Hạng GPLX:
              </span>
              {EXAM_CONFIGS.map((cfg) => (
                <button
                  key={cfg.id}
                  onClick={() => setSelectedClassId(cfg.id)}
                  className={`rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-colors ${
                    selectedClassId === cfg.id
                      ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {cfg.name}
                </button>
              ))}
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              <strong>{selectedLicenseConfig.name}:</strong> {selectedLicenseConfig.subtitle} •
              Điểm đạt:{' '}
              <strong className="font-mono">
                ≥ {selectedLicenseConfig.passScore}/{selectedLicenseConfig.totalQuestions}
              </strong>{' '}
              (Không sai câu điểm liệt)
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => {
                const key = `${selectedLicenseConfig.id}_set_${num}`;
                const best = bestByExamKey[key];
                return (
                  <button
                    key={num}
                    onClick={() => startStandardExam(selectedLicenseConfig, num)}
                    className={`group flex flex-col justify-between rounded-xl border p-3.5 text-left transition-colors hover:border-blue-500 ${
                      best?.passed
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                        : best
                          ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30'
                          : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 dark:text-slate-100">
                        Đề số {num}
                      </span>
                      {best?.passed ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : best ? (
                        <XCircle className="h-4 w-4 text-rose-600" />
                      ) : (
                        <Play className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600" />
                      )}
                    </div>
                    <div className="mt-2 font-mono text-[11px] font-semibold tabular-nums text-slate-500 dark:text-slate-400">
                      {best
                        ? `${best.passed ? 'ĐẠT' : 'TRƯỢT'} (${best.correctCount}/${best.totalQuestions})`
                        : `${selectedLicenseConfig.totalQuestions} câu • ${selectedLicenseConfig.durationMinutes}p`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Random Exam */}
        {lobbyTab === 'random' && (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EXAM_CONFIGS.map((cfg) => (
              <div
                key={cfg.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                      {cfg.name}
                    </span>
                    <span className="rounded-lg bg-blue-50 px-2.5 py-0.5 font-mono text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                      ≥ {cfg.passScore}/{cfg.totalQuestions}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    {cfg.subtitle}
                  </p>
                </div>
                <button
                  onClick={() => startStandardExam(cfg)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
                >
                  <Shuffle className="h-4 w-4" />
                  Tạo đề ngẫu nhiên
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Topic Drills */}
        {lobbyTab === 'topic' && (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: 'critical_60',
                title: 'Bộ 60 Câu Điểm Liệt',
                desc: 'Kiểm tra toàn bộ 60 câu điểm liệt (60/60 đạt).',
                badge: '60 câu • 30 phút',
              },
              {
                id: 'hard_50',
                title: 'Top 50 Câu Dễ Nhầm & Bẫy',
                desc: 'Tốc độ, khoảng cách, nồng độ cồn, vạch kẻ đường.',
                badge: '50 câu • 30 phút',
              },
              {
                id: 'signs_30',
                title: 'Chuyên Đề Biển Báo',
                desc: '30 câu ngẫu nhiên thuộc Chương 5.',
                badge: '30 câu • 20 phút',
              },
              {
                id: 'sahinh_30',
                title: 'Chuyên Đề Sa Hình',
                desc: '30 câu ngẫu nhiên thuộc Chương 6.',
                badge: '30 câu • 20 phút',
              },
              {
                id: 'wrong_personal',
                title: 'Đề Ôn Câu Hay Sai (Cá Nhân)',
                desc:
                  wrongQuestions.length > 0
                    ? `Tạo đề từ ${wrongQuestions.length} câu sai trong SRS.`
                    : 'Chưa có câu sai nào trong SRS.',
                badge: `${wrongQuestions.length} câu sai`,
                disabled: wrongQuestions.length === 0,
              },
            ].map((t) => (
              <div
                key={t.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950"
              >
                <div>
                  <span className="inline-block rounded-lg border border-slate-200 bg-white px-2.5 py-0.5 font-mono text-[11px] font-bold text-slate-600 dark:border-slate-700 dark:bg-gray-900 dark:text-slate-300">
                    {t.badge}
                  </span>
                  <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">
                    {t.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {t.desc}
                  </p>
                </div>
                <button
                  disabled={t.disabled}
                  onClick={() => startTopicExam(t.id)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-40"
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
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
            <History className="h-4 w-4 text-blue-600" />
            Lịch sử thi gần đây
          </h2>
          <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
            {examHistory.slice(0, 8).map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-xs sm:text-sm"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {item.examName}
                  </span>
                  <span className="ml-2 text-xs text-slate-400">
                    {new Date(item.date).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold tabular-nums text-slate-600 dark:text-slate-300">
                    {item.correctCount}/{item.totalQuestions} ({formatTime(item.durationSeconds)})
                  </span>
                  {item.passed ? (
                    <span className="rounded-lg bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                      ĐẠT
                    </span>
                  ) : (
                    <span className="rounded-lg bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                      {item.failedByCritical ? 'TRƯỢT (ĐIỂM LIỆT)' : 'TRƯỢT'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
