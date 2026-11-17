import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  Compass,
  Gauge,
  IdCard,
  Search,
  Sparkles,
  X,
  ZoomIn,
} from 'lucide-react';
import { Question } from '../types/question';

interface CheatSheetModalProps {
  open: boolean;
  questions: Question[];
  onClose: () => void;
  onZoomImage: (src: string) => void;
}

type SheetTab = 'signs' | 'speed' | 'licenses' | 'tips' | 'search';

const SIGN_COMPARISONS = [
  {
    title: 'Cấm rẽ trái vs Cấm quay đầu',
    left: { name: 'Cấm rẽ trái (P.123a)', qId: 309 },
    right: { name: 'Cấm quay đầu (P.124a)', qId: 311 },
    same: 'Đều là biển báo cấm hình tròn, viền đỏ, nền trắng, mũi tên đen gạch chéo đỏ.',
    diff: 'Cấm rẽ trái VẪN ĐƯỢC quay đầu xe; Cấm quay đầu VẪN ĐƯỢC rẽ trái.',
  },
  {
    title: 'Đường ưu tiên vs Đường không ưu tiên',
    left: { name: 'Giao với đường không ưu tiên (W.207)', qId: 382 },
    right: { name: 'Giao với đường ưu tiên (W.208)', qId: 383 },
    same: 'Đều là biển báo nguy hiểm tam giác viền đỏ, nền vàng.',
    diff: 'Tam giác xuôi nét dọc dày = mình trên đường ưu tiên; Tam giác lộn ngược = phải nhường đường.',
  },
  {
    title: 'Đường đôi vs Đường hai chiều',
    left: { name: 'Bắt đầu đường đôi (W.235)', qId: 393 },
    right: { name: 'Đường hai chiều (W.204)', qId: 380 },
    same: 'Đều cảnh báo đoạn đường có xe chạy 2 chiều ngược nhau.',
    diff: 'Đường đôi có dải phân cách cứng ở giữa; Đường hai chiều không có dải phân cách.',
  },
  {
    title: 'Cấm dừng và đỗ vs Cấm đỗ xe',
    left: { name: 'Cấm dừng và đỗ (P.130)', qId: 316 },
    right: { name: 'Cấm đỗ xe (P.131a)', qId: 317 },
    same: 'Đều là biển tròn nền xanh lam, viền đỏ.',
    diff: '2 gạch chéo (chữ X) = Cấm cả dừng lẫn đỗ; 1 gạch chéo = Được dừng tạm, cấm đỗ.',
  },
];

const SPEED_DATA = [
  {
    area: 'in',
    road: 'double',
    vehicle: 'Mọi loại xe cơ giới (trừ xe máy chuyên dùng, xe gắn máy)',
    speed: 60,
  },
  {
    area: 'in',
    road: 'two_way',
    vehicle: 'Mọi loại xe cơ giới (trừ xe máy chuyên dùng, xe gắn máy)',
    speed: 50,
  },
  {
    area: 'out',
    road: 'double',
    vehicle: 'Ô tô con, ô tô chở người ≤ 29 chỗ, ô tô tải ≤ 3.5 tấn',
    speed: 90,
  },
  {
    area: 'out',
    road: 'double',
    vehicle: 'Ô tô chở người > 29 chỗ, ô tô tải > 3.5 tấn (trừ buýt)',
    speed: 80,
  },
  {
    area: 'out',
    road: 'double',
    vehicle: 'Ô tô buýt, đầu kéo kéo sơ-mi rơ-moóc, xe mô tô',
    speed: 70,
  },
  {
    area: 'out',
    road: 'double',
    vehicle: 'Ô tô kéo rơ-moóc, kéo xe khác, xe trộn bê tông',
    speed: 60,
  },
  {
    area: 'out',
    road: 'two_way',
    vehicle: 'Ô tô con, ô tô chở người ≤ 29 chỗ, ô tô tải ≤ 3.5 tấn',
    speed: 80,
  },
  {
    area: 'out',
    road: 'two_way',
    vehicle: 'Ô tô chở người > 29 chỗ, ô tô tải > 3.5 tấn (trừ buýt)',
    speed: 70,
  },
  {
    area: 'out',
    road: 'two_way',
    vehicle: 'Ô tô buýt, đầu kéo kéo sơ-mi rơ-moóc, xe mô tô',
    speed: 60,
  },
  {
    area: 'out',
    road: 'two_way',
    vehicle: 'Ô tô kéo rơ-moóc, kéo xe khác, xe trộn bê tông',
    speed: 50,
  },
];

const LICENSES_2025 = [
  { cls: 'A1', age: '18', desc: 'Mô tô 2 bánh ≤ 125 cm³ (hoặc công suất điện ≤ 11 kW).' },
  { cls: 'A', age: '18', desc: 'Mô tô 2 bánh > 125 cm³ (hoặc > 11 kW) và xe hạng A1.' },
  { cls: 'B1', age: '18', desc: 'Mô tô 3 bánh và các loại xe quy định cho hạng A1.' },
  { cls: 'B', age: '18', desc: 'Ô tô đến 8 chỗ (không kể lái xe); ô tô tải ≤ 3.500 kg.' },
  { cls: 'C1', age: '18', desc: 'Ô tô tải & chuyên dùng > 3.500 kg đến 7.500 kg.' },
  { cls: 'C', age: '21', desc: 'Ô tô tải & chuyên dùng > 7.500 kg.' },
  { cls: 'D1', age: '24', desc: 'Ô tô chở người > 8 chỗ đến 16 chỗ (không kể lái xe).' },
  { cls: 'D2', age: '24', desc: 'Ô tô chở người > 16 chỗ đến 29 chỗ (không kể lái xe).' },
  { cls: 'D', age: '27', desc: 'Ô tô chở người > 29 chỗ; ô tô chở người giường nằm.' },
];

export const CheatSheetModal: React.FC<CheatSheetModalProps> = ({
  open,
  questions,
  onClose,
  onZoomImage,
}) => {
  const [tab, setTab] = useState<SheetTab>('signs');
  const [areaFilter, setAreaFilter] = useState<'in' | 'out'>('in');
  const [roadFilter, setRoadFilter] = useState<'double' | 'two_way'>('double');
  const [query, setQuery] = useState('');

  const filteredSpeeds = useMemo(
    () => SPEED_DATA.filter((r) => r.area === areaFilter && r.road === roadFilter),
    [areaFilter, roadFilter]
  );

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return questions.slice(0, 12);
    return questions
      .filter(
        (item) =>
          String(item.id) === q ||
          item.question.toLowerCase().includes(q) ||
          item.options.some((o) => o.toLowerCase().includes(q))
      )
      .slice(0, 30);
  }, [questions, query]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-xs sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Sổ Tay So Sánh Nhanh & Tra Cứu 2025
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Các cặp biển báo dễ nhầm, ma trận tốc độ & khoảng cách an toàn.
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-1.5 border-b border-slate-200 bg-slate-50 px-5 py-2.5 dark:border-slate-800 dark:bg-slate-950">
              {[
                { id: 'signs' as SheetTab, label: 'Cặp biển dễ lừa', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
                { id: 'speed' as SheetTab, label: 'Tốc độ & Khoảng cách', icon: <Gauge className="h-3.5 w-3.5" /> },
                { id: 'licenses' as SheetTab, label: 'Hạng GPLX 2025', icon: <IdCard className="h-3.5 w-3.5" /> },
                { id: 'tips' as SheetTab, label: 'Mẹo sa hình 5 bước', icon: <Sparkles className="h-3.5 w-3.5" /> },
                { id: 'search' as SheetTab, label: 'Tra cứu 600 câu', icon: <Search className="h-3.5 w-3.5" /> },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    tab === t.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-gray-900 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {tab === 'signs' && (
                <div className="grid gap-4 md:grid-cols-2">
                  {SIGN_COMPARISONS.map((pair) => {
                    const leftQ = questions.find((q) => q.id === pair.left.qId);
                    const rightQ = questions.find((q) => q.id === pair.right.qId);
                    return (
                      <div
                        key={pair.title}
                        className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/50"
                      >
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {pair.title}
                        </h3>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          {[
                            { label: pair.left.name, q: leftQ },
                            { label: pair.right.name, q: rightQ },
                          ].map((side) => (
                            <div
                              key={side.label}
                              className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-2.5 text-center"
                            >
                              {side.q?.image && (
                                <button
                                  type="button"
                                  onClick={() => onZoomImage(side.q!.image!)}
                                  className="mb-2 flex h-24 w-full items-center justify-center"
                                >
                                  <img
                                    src={side.q.image}
                                    alt={side.label}
                                    className="max-h-full w-auto object-contain"
                                  />
                                </button>
                              )}
                              <span className="text-[11px] font-bold text-blue-700">
                                {side.label}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 grid grid-cols-2 divide-x divide-slate-200 rounded-lg border border-slate-200 bg-white text-xs dark:divide-slate-800 dark:border-slate-800 dark:bg-gray-900">
                          <div className="p-2.5">
                            <div className="font-bold text-slate-500">Điểm giống</div>
                            <p className="mt-1 text-slate-700 dark:text-slate-300">{pair.same}</p>
                          </div>
                          <div className="p-2.5">
                            <div className="font-bold text-blue-600 dark:text-blue-400">
                              Khác biệt cốt lõi
                            </div>
                            <p className="mt-1 font-medium text-slate-800 dark:text-slate-200">
                              {pair.diff}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {tab === 'speed' && (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-950">
                      <button
                        onClick={() => setAreaFilter('in')}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                          areaFilter === 'in'
                            ? 'bg-white text-blue-600 dark:bg-gray-900 dark:text-blue-400'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        Trong khu đông dân cư
                      </button>
                      <button
                        onClick={() => setAreaFilter('out')}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                          areaFilter === 'out'
                            ? 'bg-white text-blue-600 dark:bg-gray-900 dark:text-blue-400'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        Ngoài khu đông dân cư
                      </button>
                    </div>

                    <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-950">
                      <button
                        onClick={() => setRoadFilter('double')}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                          roadFilter === 'double'
                            ? 'bg-white text-blue-600 dark:bg-gray-900 dark:text-blue-400'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        Đường đôi (Có dải phân cách)
                      </button>
                      <button
                        onClick={() => setRoadFilter('two_way')}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                          roadFilter === 'two_way'
                            ? 'bg-white text-blue-600 dark:bg-gray-900 dark:text-blue-400'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        Đường 2 chiều
                      </button>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                    {filteredSpeeds.map((row) => (
                      <div
                        key={row.vehicle}
                        className="flex items-center justify-between gap-4 p-3.5"
                      >
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          {row.vehicle}
                        </span>
                        <span className="shrink-0 rounded-lg bg-blue-50 px-3 py-1 font-mono text-base font-bold tabular-nums text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                          {row.speed} km/h
                        </span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="mb-2.5 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                      <Compass className="h-4 w-4 text-emerald-600" />
                      Khoảng cách an toàn tối thiểu
                    </h3>
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                      {[
                        { v: '60 km/h', d: '35 m' },
                        { v: '60–80 km/h', d: '55 m' },
                        { v: '80–100 km/h', d: '70 m' },
                        { v: '100–120 km/h', d: '100 m' },
                      ].map((item) => (
                        <div
                          key={item.v}
                          className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-950"
                        >
                          <div className="text-xs font-medium text-slate-500">{item.v}</div>
                          <div className="mt-1 font-mono text-lg font-bold text-emerald-700 dark:text-emerald-400">
                            {item.d}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tab === 'licenses' && (
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full border-collapse text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                        <th className="p-3 font-bold">Hạng</th>
                        <th className="p-3 font-bold">Tuổi</th>
                        <th className="p-3 font-bold">Phạm vi điều khiển (Luật 2025)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {LICENSES_2025.map((r) => (
                        <tr key={r.cls}>
                          <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                            {r.cls}
                          </td>
                          <td className="p-3 font-mono font-semibold">{r.age}</td>
                          <td className="p-3 text-slate-700 dark:text-slate-300">{r.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {tab === 'tips' && (
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    {
                      title: 'Quy tắc giải sa hình 5 bước',
                      lines: [
                        '1. Nhất chớm: Xe đã vào giao lộ trước đi trước.',
                        '2. Nhì ưu: Hỏa → Sự → An → Thương.',
                        '3. Tam đường: Xe trên đường ưu tiên đi trước.',
                        '4. Tứ hướng: Bên phải không vướng đi trước.',
                        '5. Ngũ hành: Rẽ phải → Đi thẳng → Rẽ trái.',
                      ],
                    },
                    {
                      title: 'Từ khóa chốt đáp án 3 giây',
                      lines: [
                        'Thấy "Bị nghiêm cấm" / "Không được phép" → Chọn ngay.',
                        'Thấy "Giảm tốc độ, đi sát về bên phải" → Chọn ngay.',
                        'Nồng độ cồn khi lái xe ô tô / mô tô = 0 tuyệt đối.',
                        'Vạch vàng phân 2 chiều ngược; vạch trắng phân làn cùng chiều.',
                      ],
                    },
                  ].map((box) => (
                    <div
                      key={box.title}
                      className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950"
                    >
                      <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {box.title}
                      </h3>
                      <ul className="mt-2.5 space-y-1.5 text-xs leading-relaxed text-slate-700 sm:text-sm dark:text-slate-300">
                        {box.lines.map((l) => (
                          <li key={l}>{l}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'search' && (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Nhập số câu (vd: 301) hoặc từ khóa..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-950"
                    />
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {searchResults.map((q) => (
                      <div
                        key={q.id}
                        className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-950"
                      >
                        <div className="flex items-center justify-between">
                          <span className="rounded bg-blue-600 px-2 py-0.5 font-mono text-xs font-bold text-white">
                            Câu {q.id}
                          </span>
                          <span className="text-xs text-slate-400">Chương {q.chapter}</span>
                        </div>
                        <p className="mt-2 text-xs font-semibold text-slate-900 sm:text-sm dark:text-slate-100">
                          {q.question}
                        </p>
                        {q.image && (
                          <button
                            type="button"
                            onClick={() => onZoomImage(q.image!)}
                            className="relative mt-2 flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white p-2"
                          >
                            <img
                              src={q.image}
                              alt={`Câu ${q.id}`}
                              className="max-h-28 w-auto object-contain"
                            />
                            <ZoomIn className="absolute right-2 bottom-2 h-3.5 w-3.5 text-slate-400" />
                          </button>
                        )}
                        <div className="mt-2 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                          Đáp án {q.correctAnswer + 1}: {q.options[q.correctAnswer]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
