import React, { useMemo, useState } from 'react';
import { Compass, Search, ZoomIn } from 'lucide-react';
import { Question } from '../types/question';
import { SegmentedControl } from './SegmentedControl';
import { SignCode, TrafficSignSVG } from './TrafficSignSVG';

interface CheatSheetViewProps {
  questions: Question[];
  onZoomImage: (src: string) => void;
}

type SheetTab = 'signs' | 'speed' | 'licenses' | 'tips' | 'search';

const SIGN_COMPARISONS: {
  title: string;
  left: { name: string; code: SignCode };
  right: { name: string; code: SignCode };
  same: string;
  diff: string;
}[] = [
  {
    title: 'Cấm rẽ trái vs Cấm quay đầu',
    left: { name: 'Cấm rẽ trái (P.123a)', code: 'P.123a' },
    right: { name: 'Cấm quay đầu (P.124a)', code: 'P.124a' },
    same: 'Đều là biển báo cấm hình tròn, viền đỏ, nền trắng, mũi tên đen gạch chéo đỏ.',
    diff: 'Cấm rẽ trái VẪN ĐƯỢC quay đầu xe; Cấm quay đầu VẪN ĐƯỢC rẽ trái.',
  },
  {
    title: 'Đường ưu tiên vs Đường không ưu tiên',
    left: { name: 'Giao với đường không ưu tiên (W.207)', code: 'W.207' },
    right: { name: 'Giao với đường ưu tiên (W.208)', code: 'W.208' },
    same: 'Đều là biển báo nguy hiểm tam giác viền đỏ, nền vàng.',
    diff: 'Tam giác xuôi nét dọc dày = mình trên đường ưu tiên; Tam giác lộn ngược = phải nhường đường.',
  },
  {
    title: 'Đường đôi vs Đường hai chiều',
    left: { name: 'Bắt đầu đường đôi (W.235)', code: 'W.235' },
    right: { name: 'Đường hai chiều (W.204)', code: 'W.204' },
    same: 'Đều cảnh báo đoạn đường có xe chạy 2 chiều ngược nhau.',
    diff: 'Đường đôi có dải phân cách cứng ở giữa; Đường hai chiều không có dải phân cách.',
  },
  {
    title: 'Cấm dừng và đỗ vs Cấm đỗ xe',
    left: { name: 'Cấm dừng và đỗ (P.130)', code: 'P.130' },
    right: { name: 'Cấm đỗ xe (P.131a)', code: 'P.131a' },
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

export const CheatSheetView: React.FC<CheatSheetViewProps> = ({
  questions,
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
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      {/* Header directly on bg-slate-50 */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Sổ Tay So Sánh Nhanh &amp; Tra Cứu 2025
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Biển báo đơn lẻ chuẩn nét, ma trận tốc độ &amp; bảng phân hạng GPLX mới nhất.
          </p>
        </div>

        <SegmentedControl
          value={tab}
          onChange={setTab}
          options={[
            { id: 'signs', label: 'Cặp biển dễ lừa' },
            { id: 'speed', label: 'Tốc độ & Khoảng cách' },
            { id: 'licenses', label: 'Hạng GPLX 2025' },
            { id: 'tips', label: 'Mẹo sa hình' },
            { id: 'search', label: 'Tra cứu 600 câu' },
          ]}
        />
      </div>

      {/* TAB 1: Cặp biển dễ lừa (Crisp Individual Inline SVGs) */}
      {tab === 'signs' && (
        <div className="grid gap-5 md:grid-cols-2">
          {SIGN_COMPARISONS.map((pair) => (
            <div
              key={pair.title}
              className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {pair.title}
              </h2>

              <div className="mt-4 grid grid-cols-2 gap-3.5">
                {[pair.left, pair.right].map((sign) => (
                  <div
                    key={sign.code}
                    className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50/70 p-4 text-center"
                  >
                    <TrafficSignSVG code={sign.code} className="h-24 w-24" />
                    <span className="mt-2.5 text-xs font-semibold text-slate-800">
                      {sign.name}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 divide-x divide-slate-100 rounded-xl border border-slate-200/80 bg-slate-50/50 text-xs dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-950/50">
                <div className="p-3">
                  <div className="font-semibold text-slate-500">Điểm giống</div>
                  <p className="mt-1 leading-relaxed text-slate-700 dark:text-slate-300">
                    {pair.same}
                  </p>
                </div>
                <div className="p-3">
                  <div className="font-semibold text-indigo-600 dark:text-indigo-400">
                    Khác biệt cốt lõi
                  </div>
                  <p className="mt-1 font-medium leading-relaxed text-slate-900 dark:text-slate-100">
                    {pair.diff}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Tốc độ & Khoảng cách */}
      {tab === 'speed' && (
        <div className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SegmentedControl
              value={areaFilter}
              onChange={setAreaFilter}
              options={[
                { id: 'in', label: 'Trong khu đông dân cư' },
                { id: 'out', label: 'Ngoài khu đông dân cư' },
              ]}
            />
            <SegmentedControl
              value={roadFilter}
              onChange={setRoadFilter}
              options={[
                { id: 'double', label: 'Đường đôi (Có dải phân cách)' },
                { id: 'two_way', label: 'Đường 2 chiều' },
              ]}
            />
          </div>

          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200/80 dark:divide-slate-800 dark:border-slate-800">
            {filteredSpeeds.map((row) => (
              <div
                key={row.vehicle}
                className="flex items-center justify-between gap-4 p-4"
              >
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {row.vehicle}
                </span>
                <span className="shrink-0 rounded-lg bg-indigo-50 px-3 py-1 font-mono text-sm font-bold tabular-nums text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                  {row.speed} km/h
                </span>
              </div>
            ))}
          </div>

          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
              <Compass className="h-4 w-4 text-emerald-600" />
              Khoảng cách an toàn tối thiểu
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { v: '60 km/h', d: '35 m' },
                { v: '60–80 km/h', d: '55 m' },
                { v: '80–100 km/h', d: '70 m' },
                { v: '100–120 km/h', d: '100 m' },
              ].map((item) => (
                <div
                  key={item.v}
                  className="rounded-xl border border-slate-200/80 bg-slate-50 p-3.5 text-center dark:border-slate-800 dark:bg-slate-950"
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

      {/* TAB 3: Hạng GPLX 2025 */}
      {tab === 'licenses' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full border-collapse text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                <th className="p-4 font-bold">Hạng</th>
                <th className="p-4 font-bold">Tuổi tối thiểu</th>
                <th className="p-4 font-bold">Phạm vi điều khiển (Luật 2025)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {LICENSES_2025.map((r) => (
                <tr key={r.cls}>
                  <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {r.cls}
                  </td>
                  <td className="p-4 font-mono font-semibold">{r.age}</td>
                  <td className="p-4 text-slate-700 dark:text-slate-300">{r.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: Mẹo sa hình 5 bước */}
      {tab === 'tips' && (
        <div className="grid gap-5 md:grid-cols-2">
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
              className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {box.title}
              </h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {box.lines.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: Tra cứu 600 câu */}
      {tab === 'search' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nhập số câu (vd: 301) hoặc từ khóa..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-11 text-sm outline-none focus:border-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-indigo-500"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {searchResults.map((q) => (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    CÂU {q.id}
                  </span>
                  <span className="text-xs text-slate-400">Chương {q.chapter}</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {q.question}
                </p>
                {q.image && (
                  <button
                    type="button"
                    onClick={() => onZoomImage(q.image!)}
                    className="relative mt-3 flex w-full items-center justify-center rounded-xl border border-slate-100 bg-slate-50/70 p-3"
                  >
                    <img
                      src={q.image}
                      alt={`Câu ${q.id}`}
                      className="max-h-32 w-auto object-contain"
                    />
                    <ZoomIn className="absolute right-2.5 bottom-2.5 h-3.5 w-3.5 text-slate-400" />
                  </button>
                )}
                <div className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                  Đáp án {q.correctAnswer + 1}: {q.options[q.correctAnswer]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
