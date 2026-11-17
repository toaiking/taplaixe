import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  History,
  Play,
  Shuffle,
  XCircle,
} from 'lucide-react';
import {
  EXAM_CONFIGS_108_2026,
  EXAM_CONFIGS_TRANSITIONAL,
} from '../data/chapters';
import { useAppStore } from '../store/useAppStore';
import { ExamConfig, ExamResult, Question } from '../types/question';
import { QuizWorkspace } from './QuizWorkspace';
import { SegmentedControl } from './SegmentedControl';

interface ExamHubViewProps {
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
  const isAllowedChapter = (chap: number) => (config.chapterWeights[chap] ?? 0) > 0;

  const criticalPool = shuffleWithRng(
    allQuestions.filter((q) => q.isCritical && isAllowedChapter(q.chapter)),
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
      allQuestions.filter((q) => !chosenIds.has(q.id) && isAllowedChapter(q.chapter)),
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

export const ExamHubView: React.FC<ExamHubViewProps> = ({ questions }) => {
  const { examHistory, srs } = useAppStore();
  const [lobbyTab, setLobbyTab] = useState<LobbyTab>('fixed');
  const [examStandard, setExamStandard] = useState<'tt108' | 'transitional'>('tt108');
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

  const activeConfigs =
    examStandard === 'tt108' ? EXAM_CONFIGS_108_2026 : EXAM_CONFIGS_TRANSITIONAL;

  const selectedLicenseConfig = useMemo(
    () =>
      activeConfigs.find((c) => c.id === selectedClassId || c.name === selectedClassId) ??
      activeConfigs.find((c) => c.name === 'Hạng B') ??
      activeConfigs[0],
    [activeConfigs, selectedClassId]
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
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      {/* Page Title directly on bg-slate-50 */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Phòng Thi Sát Hạch 2026
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Theo Thông tư 108/2026/TT-BCA của Bộ Công an • Đạt tối thiểu 90% và không sai câu điểm liệt.
          </p>
        </div>

        <SegmentedControl
          value={lobbyTab}
          onChange={setLobbyTab}
          options={[
            { id: 'fixed', label: 'Bộ 20 Đề Chuẩn' },
            { id: 'random', label: 'Đề Ngẫu Nhiên' },
            { id: 'topic', label: 'Đề Chuyên Đề' },
          ]}
        />
      </div>

      {/* Standard Switcher: TT 108/2026/TT-BCA vs Transitional TT 12/2025 */}
      {(lobbyTab === 'fixed' || lobbyTab === 'random') && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <strong className="font-semibold text-slate-900 dark:text-slate-100">
              Quy chuẩn đề thi (Điều 41 TT 108/2026/TT-BCA):
            </strong>{' '}
            {examStandard === 'tt108'
              ? 'Phụ lục I, II, III TT 108/2026 (40–80 câu, đạt ≥ 90%, áp dụng từ 01/03/2027)'
              : 'Giai đoạn chuyển tiếp TT 12/2025 (25–45 câu, áp dụng đến hết 28/02/2027)'}
          </div>
          <SegmentedControl
            value={examStandard}
            onChange={(val) => {
              setExamStandard(val);
              const nextList =
                val === 'tt108' ? EXAM_CONFIGS_108_2026 : EXAM_CONFIGS_TRANSITIONAL;
              const matchByName = nextList.find(
                (c) => c.name === selectedLicenseConfig.name
              );
              setSelectedClassId(matchByName ? matchByName.id : nextList[0].id);
            }}
            options={[
              { id: 'tt108', label: 'TT 108/2026 (40–80 câu)' },
              { id: 'transitional', label: 'Đến 28/02/2027 (25–45 câu)' },
            ]}
          />
        </div>
      )}

      {/* TAB 1: Bộ 20 Đề Chuẩn */}
      {lobbyTab === 'fixed' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SegmentedControl
              value={selectedLicenseConfig.id}
              onChange={setSelectedClassId}
              options={activeConfigs.map((c) => ({ id: c.id, label: c.name }))}
            />
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
              {selectedLicenseConfig.totalQuestions} câu •{' '}
              {selectedLicenseConfig.durationMinutes} phút • Đạt ≥{' '}
              {selectedLicenseConfig.passScore}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => {
              const key = `${selectedLicenseConfig.id}_set_${num}`;
              const best = bestByExamKey[key];

              let borderCls =
                'border-slate-200/80 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900';
              let statusText = 'Chưa thi';
              let statusCls = 'text-slate-400';

              if (best?.passed) {
                borderCls =
                  'border-emerald-300 bg-emerald-50/40 hover:border-emerald-400 dark:border-emerald-700/60 dark:bg-emerald-950/20';
                statusText = `Đã đạt • ${best.correctCount}/${best.totalQuestions}`;
                statusCls = 'text-emerald-700 dark:text-emerald-400';
              } else if (best) {
                borderCls =
                  'border-rose-300 bg-rose-50/40 hover:border-rose-400 dark:border-rose-700/60 dark:bg-rose-950/20';
                statusText = `Chưa đạt • ${best.correctCount}/${best.totalQuestions}`;
                statusCls = 'text-rose-600 dark:text-rose-400';
              }

              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => startStandardExam(selectedLicenseConfig, num)}
                  className={`group flex flex-col justify-between rounded-2xl border p-4 text-left transition-all hover:shadow-sm ${borderCls}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Đề số {num}
                    </span>
                    {best?.passed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : best ? (
                      <XCircle className="h-4 w-4 text-rose-500" />
                    ) : (
                      <Play className="h-3.5 w-3.5 text-slate-400 transition-colors group-hover:text-slate-900 dark:group-hover:text-white" />
                    )}
                  </div>
                  <div className={`mt-2.5 font-mono text-xs font-medium tabular-nums ${statusCls}`}>
                    {statusText}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Đề Ngẫu Nhiên */}
      {lobbyTab === 'random' && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {activeConfigs.map((cfg) => (
            <div
              key={cfg.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {cfg.name}
                  </span>
                  <span className="rounded-md bg-indigo-50 px-2.5 py-1 font-mono text-xs font-semibold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300">
                    ≥ {cfg.passScore}/{cfg.totalQuestions}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                  {cfg.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => startStandardExam(cfg)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-xs transition-all hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500"
              >
                <Shuffle className="h-4 w-4" />
                Tạo đề ngẫu nhiên
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Đề Chuyên Đề */}
      {lobbyTab === 'topic' && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
              title: 'Đề Ôn Câu Hay Sai',
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
              className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <span className="inline-block rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {t.badge}
                </span>
                <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-slate-100">
                  {t.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {t.desc}
                </p>
              </div>
              <button
                type="button"
                disabled={t.disabled}
                onClick={() => startTopicExam(t.id)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-xs transition-all hover:bg-slate-800 disabled:opacity-40 dark:bg-indigo-600 dark:hover:bg-indigo-500"
              >
                <Play className="h-4 w-4 fill-current" />
                Bắt đầu làm đề
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Exam History */}
      {examHistory.length > 0 && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
            <History className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Lịch sử thi gần đây
          </h2>
          <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
            {examHistory.slice(0, 8).map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2 py-3 text-xs sm:text-sm"
              >
                <div>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {item.examName}
                  </span>
                  <span className="ml-2 text-xs text-slate-400">
                    {new Date(item.date).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-medium tabular-nums text-slate-600 dark:text-slate-300">
                    {item.correctCount}/{item.totalQuestions} ({formatTime(item.durationSeconds)})
                  </span>
                  {item.passed ? (
                    <span className="rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                      Đạt
                    </span>
                  ) : (
                    <span className="rounded-md bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                      {item.failedByCritical ? 'Trượt (Điểm liệt)' : 'Chưa đạt'}
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
