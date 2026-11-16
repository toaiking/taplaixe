import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Car,
  Compass,
  Gauge,
  IdCard,
  Search,
  Sparkles,
  ZoomIn,
} from 'lucide-react';
import { Question } from '../types/question';
import { LightboxModal } from './LightboxModal';

interface HandbookScreenProps {
  questions: Question[];
}

type TabId = 'speed' | 'licenses' | 'signs' | 'tips' | 'search';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'speed', label: 'Tốc độ & Khoảng cách', icon: <Gauge className="h-4 w-4" /> },
  { id: 'licenses', label: 'Hạng GPLX 2025', icon: <IdCard className="h-4 w-4" /> },
  { id: 'signs', label: 'Biển báo dễ nhầm', icon: <AlertTriangle className="h-4 w-4" /> },
  { id: 'tips', label: 'Mẹo giải nhanh', icon: <Sparkles className="h-4 w-4" /> },
  { id: 'search', label: 'Tra cứu 600 câu', icon: <Search className="h-4 w-4" /> },
];

const CONFUSING_SIGN_PAIRS = [
  {
    title: 'Cấm rẽ trái vs Cấm quay đầu',
    left: { label: 'Cấm rẽ trái (P.123a)', desc: 'Cấm rẽ trái nhưng VẪN ĐƯỢC quay đầu xe.', qId: 309 },
    right: { label: 'Cấm quay đầu (P.124a)', desc: 'Cấm quay đầu xe nhưng VẪN ĐƯỢC rẽ trái.', qId: 311 },
  },
  {
    title: 'Giao nhau đường ưu tiên vs Không ưu tiên',
    left: { label: 'Giao với đường không ưu tiên (W.207)', desc: 'Hình tam giác vàng, nét dọc dày, nét ngang mảnh → Xe mình đang trên đường ưu tiên.', qId: 382 },
    right: { label: 'Giao với đường ưu tiên (W.208)', desc: 'Hình tam giác lộn ngược → Phải nhường đường cho xe trên đường ưu tiên.', qId: 383 },
  },
  {
    title: 'Đường đôi vs Đường hai chiều',
    left: { label: 'Bắt đầu / Hết đường đôi (W.235 / W.236)', desc: 'Có dải phân cách ở giữa chia 2 chiều xe chạy riêng biệt.', qId: 393 },
    right: { label: 'Đường hai chiều (W.204)', desc: 'Hai mũi tên ngược chiều song song trên cùng mặt đường (không dải phân cách).', qId: 380 },
  },
  {
    title: 'Cấm dừng và đỗ vs Cấm đỗ xe',
    left: { label: 'Cấm dừng xe và đỗ xe (P.130)', desc: 'Nền xanh, viền đỏ, 2 gạch chéo (chữ X) → Không được dừng, không được đỗ.', qId: 316 },
    right: { label: 'Cấm đỗ xe (P.131a)', desc: 'Nền xanh, viền đỏ, 1 gạch chéo → Được dừng tạm thời, cấm đỗ.', qId: 317 },
  },
];

const LICENSE_TABLE = [
  { cls: 'A1', age: '18 tuổi', desc: 'Xe mô tô 2 bánh dung tích xi-lanh đến 125 cm³ (hoặc công suất điện ≤ 11 kW).' },
  { cls: 'A', age: '18 tuổi', desc: 'Xe mô tô 2 bánh trên 125 cm³ (hoặc > 11 kW) và các loại xe hạng A1.' },
  { cls: 'B1', age: '18 tuổi', desc: 'Xe mô tô 3 bánh và các loại xe quy định cho giấy phép lái xe hạng A1.' },
  { cls: 'B', age: '18 tuổi', desc: 'Ô tô chở người đến 8 chỗ (không kể lái xe); ô tô tải & chuyên dùng khối lượng toàn bộ ≤ 3.500 kg.' },
  { cls: 'C1', age: '18 tuổi', desc: 'Ô tô tải & chuyên dùng khối lượng toàn bộ trên 3.500 kg đến 7.500 kg.' },
  { cls: 'C', age: '21 tuổi', desc: 'Ô tô tải & chuyên dùng khối lượng toàn bộ trên 7.500 kg.' },
  { cls: 'D1', age: '24 tuổi', desc: 'Ô tô chở người trên 8 chỗ đến 16 chỗ (không kể chỗ lái xe).' },
  { cls: 'D2', age: '24 tuổi', desc: 'Ô tô chở người trên 16 chỗ đến 29 chỗ (không kể chỗ lái xe).' },
  { cls: 'D', age: '27 tuổi', desc: 'Ô tô chở người trên 29 chỗ (không kể chỗ lái xe); ô tô chở người giường nằm.' },
  { cls: 'BE / C1E / CE / DE', age: '21–27 tuổi', desc: 'Điều khiển xe hạng B, C1, C, D1, D2, D kéo rơ-moóc có khối lượng toàn bộ > 750 kg.' },
];

export const HandbookScreen: React.FC<HandbookScreenProps> = ({ questions }) => {
  const [activeTab, setActiveTab] = useState<TabId>('speed');
  const [query, setQuery] = useState('');
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return questions.slice(0, 20);
    return questions
      .filter(
        (item) =>
          String(item.id) === q ||
          item.question.toLowerCase().includes(q) ||
          item.options.some((o) => o.toLowerCase().includes(q))
      )
      .slice(0, 40);
  }, [questions, query]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#1E293B]">
        <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl dark:text-white">
          Sổ Tay Mẹo Nhớ & Bảng So Sánh Trực Quan 2025
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Tổng hợp các bảng kiến thức dễ nhầm lẫn nhất để ôn nhanh trước khi vào phòng thi.
        </p>

        {/* Tab Bar */}
        <div className="mt-4 flex flex-wrap gap-2">
          {TABS.map((t) => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all sm:text-sm ${
                  active
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: Speed & Distance */}
      {activeTab === 'speed' && (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#1E293B]">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
              <Car className="h-5 w-5 text-[#2563EB]" />
              Bảng Tốc Độ Tối Đa Cho Phép (km/h)
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                    <th className="p-3 font-bold">Khu vực & Loại xe</th>
                    <th className="p-3 text-center font-bold text-[#2563EB]">Đường đôi (Có dải PC)</th>
                    <th className="p-3 text-center font-bold text-amber-600">Đường 2 chiều (Không PC)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="p-3 font-semibold">Trong khu đông dân cư (Mọi xe cơ giới)</td>
                    <td className="p-3 text-center text-base font-extrabold text-[#2563EB]">60</td>
                    <td className="p-3 text-center text-base font-extrabold text-amber-600">50</td>
                  </tr>
                  <tr>
                    <td className="p-3">Ngoài KĐDC: Ô tô con, ô tô chở người ≤ 29 chỗ, tải ≤ 3.5 tấn</td>
                    <td className="p-3 text-center font-bold text-[#10B981]">90</td>
                    <td className="p-3 text-center font-bold">80</td>
                  </tr>
                  <tr>
                    <td className="p-3">Ngoài KĐDC: Ô tô chở người &gt; 29 chỗ, tải &gt; 3.5 tấn (trừ buýt)</td>
                    <td className="p-3 text-center font-bold">80</td>
                    <td className="p-3 text-center font-bold">70</td>
                  </tr>
                  <tr>
                    <td className="p-3">Ngoài KĐDC: Ô tô buýt, đầu kéo kéo sơ-mi rơ-moóc, mô tô</td>
                    <td className="p-3 text-center font-bold">70</td>
                    <td className="p-3 text-center font-bold">60</td>
                  </tr>
                  <tr>
                    <td className="p-3">Ngoài KĐDC: Ô tô kéo rơ-moóc, ô tô kéo xe khác, trộn bê tông</td>
                    <td className="p-3 text-center font-bold">60</td>
                    <td className="p-3 text-center font-bold">50</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 rounded-xl bg-blue-50 px-3 py-2 text-xs text-slate-700 dark:bg-blue-500/10 dark:text-slate-300">
              <strong>Mẹo nhớ nhanh:</strong> Trong khu đông dân cư luôn là <strong>60 / 50</strong>. Ngoài khu đông dân cư giảm dần mỗi bậc 10 km/h: <strong>90/80 → 80/70 → 70/60 → 60/50</strong>. Xe gắn máy tối đa 40 km/h.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#1E293B]">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
              <Compass className="h-5 w-5 text-[#10B981]" />
              Bảng Khoảng Cách An Toàn Tối Thiểu
            </h2>
            <div className="mt-4 space-y-3">
              {[
                { speed: 'Vận tốc = 60 km/h', dist: '35 m', tip: '60 - 25 = 35m' },
                { speed: '60 < Vận tốc ≤ 80 km/h', dist: '55 m', tip: '80 - 25 = 55m' },
                { speed: '80 < Vận tốc ≤ 100 km/h', dist: '70 m', tip: '100 - 30 = 70m' },
                { speed: '100 < Vận tốc ≤ 120 km/h', dist: '100 m', tip: '120 - 20 = 100m' },
              ].map((row) => (
                <div
                  key={row.speed}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/60"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {row.speed}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Công thức nhớ: {row.tip}
                    </div>
                  </div>
                  <span className="rounded-xl bg-[#D1FAE5] px-3.5 py-1.5 text-base font-extrabold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                    {row.dist}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Licenses 2025 */}
      {activeTab === 'licenses' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#1E293B]">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Phân Hạng Giấy Phép Lái Xe Mới (Áp dụng từ 2025)
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                  <th className="p-3 font-bold">Hạng GPLX</th>
                  <th className="p-3 font-bold">Tuổi tối thiểu</th>
                  <th className="p-3 font-bold">Loại phương tiện được phép điều khiển</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {LICENSE_TABLE.map((row) => (
                  <tr key={row.cls}>
                    <td className="p-3 font-extrabold text-[#2563EB] dark:text-blue-400">
                      {row.cls}
                    </td>
                    <td className="p-3 font-semibold">{row.age}</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Confusing Signs Side-by-Side */}
      {activeTab === 'signs' && (
        <div className="grid gap-5 md:grid-cols-2">
          {CONFUSING_SIGN_PAIRS.map((pair) => {
            const leftQ = questions.find((q) => q.id === pair.left.qId);
            const rightQ = questions.find((q) => q.id === pair.right.qId);
            return (
              <div
                key={pair.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#1E293B]"
              >
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {pair.title}
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    { side: pair.left, q: leftQ },
                    { side: pair.right, q: rightQ },
                  ].map(({ side, q }) => (
                    <div
                      key={side.label}
                      className="flex flex-col rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60"
                    >
                      {q?.image && (
                        <button
                          type="button"
                          onClick={() => setLightboxSrc(q.image)}
                          className="mb-2.5 flex h-28 items-center justify-center rounded-lg bg-white p-2"
                        >
                          <img
                            src={q.image}
                            alt={side.label}
                            className="max-h-full w-auto object-contain"
                          />
                        </button>
                      )}
                      <div className="text-xs font-bold text-[#2563EB] dark:text-blue-400">
                        {side.label}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                        {side.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 4: Quick Tips */}
      {activeTab === 'tips' && (
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: '1. Quy tắc giải sa hình 5 bước (Bất bại)',
              items: [
                'Bước 1 — Nhất chớm: Xe nào đã đi vào trong giao lộ trước được đi trước.',
                'Bước 2 — Nhì ưu: Xe ưu tiên theo thứ tự Hỏa (Cứu hỏa) → Sự (Quân sự) → An (Công an) → Thương (Cứu thương).',
                'Bước 3 — Tam đường: Xe nằm trên đường ưu tiên (theo biển báo) được đi trước.',
                'Bước 4 — Tứ hướng: Quyền tay phải không vướng (không có xe ở bên phải).',
                'Bước 5 — Ngũ hành: Thứ tự hướng đi: Rẽ phải → Đi thẳng → Rẽ trái.',
              ],
            },
            {
              title: '2. Từ khóa chọn nhanh đáp án đúng',
              items: [
                'Thấy "Bị nghiêm cấm" hoặc "Không được phép" → Chọn ngay (đúng ~98% câu điểm liệt).',
                'Thấy "Giảm tốc độ, đi sát về bên phải" → Chọn ngay khi gặp xe ưu tiên, đường hẹp, tầm nhìn hạn chế.',
                'Thấy "Cơ quan có thẩm quyền" (cho phép) → Chọn ngay với câu hỏi về cấp phép đặc biệt.',
                'Nồng độ cồn khi lái xe ô tô/xe máy: Tuyệt đối = 0 (Không được phép có nồng độ cồn).',
              ],
            },
            {
              title: '3. Mẹo câu hỏi Đèn Taplo (227–231, 286–290)',
              items: [
                'Biểu tượng (P) hoặc (!) màu đỏ: Đang kéo phanh tay hoặc thiếu dầu phanh.',
                'Biểu tượng nhiệt kế ngâm nước: Nhiệt độ nước làm mát động cơ quá cao.',
                'Biểu tượng bình ắc quy (+/-): Bộ nạp ắc quy gặp sự cố.',
                'Biểu tượng động cơ (Check Engine) / ABS / Chấm than trong lốp: Cần kiểm tra động cơ / lỗi ABS / áp suất lốp thấp.',
              ],
            },
            {
              title: '4. Quy tắc Vạch kẻ đường & Biển báo',
              items: [
                'Vạch màu VÀNG: Phân chia 2 chiều xe chạy ngược chiều nhau.',
                'Vạch màu TRẮNG: Phân chia các làn xe chạy CÙNG chiều.',
                'Vạch NÉT ĐỨT: Được phép đè vạch, chuyển làn, vượt xe.',
                'Vạch NÉT LIỀN: Không được lấn làn, không được đè lên vạch.',
              ],
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#1E293B]"
            >
              <h3 className="text-base font-bold text-[#2563EB] dark:text-blue-400">
                {card.title}
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {card.items.map((it) => (
                  <li key={it} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563EB]" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: Search all 600 questions */}
      {activeTab === 'search' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nhập số câu (vd: 301) hoặc từ khóa (vd: nồng độ cồn, đường sắt, biển cấm)..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pr-4 pl-11 text-sm font-medium text-slate-900 shadow-xs outline-none focus:border-[#2563EB] dark:border-slate-800 dark:bg-[#1E293B] dark:text-white"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {searchResults.map((q) => (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#1E293B]"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-[#2563EB] px-2.5 py-0.5 text-xs font-bold text-white">
                    Câu {q.id}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    Chương {q.chapter}
                  </span>
                </div>
                <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                  {q.question}
                </p>
                {q.image && (
                  <button
                    type="button"
                    onClick={() => setLightboxSrc(q.image)}
                    className="group relative mt-3 flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white p-2"
                  >
                    <img
                      src={q.image}
                      alt={`Câu ${q.id}`}
                      className="max-h-36 w-auto object-contain"
                    />
                    <ZoomIn className="absolute right-2 bottom-2 h-4 w-4 text-slate-500" />
                  </button>
                )}
                <div className="mt-3 rounded-xl bg-[#D1FAE5]/60 px-3 py-2 text-xs font-semibold text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-200">
                  Đáp án đúng: {q.correctAnswer + 1}. {q.options[q.correctAnswer]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <LightboxModal src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    </motion.div>
  );
};
