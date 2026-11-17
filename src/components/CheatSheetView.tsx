import React, { useMemo, useState } from 'react';
import { Compass, Search, ZoomIn } from 'lucide-react';
import { Question } from '../types/question';
import { SegmentedControl } from './SegmentedControl';

interface CheatSheetViewProps {
  questions: Question[];
  onZoomImage: (src: string) => void;
}

type SheetTab = 'signs' | 'speed' | 'taplo_csgt' | 'licenses' | 'search';

const SIGN_COMPARISONS = [
  {
    title: 'Cấm rẽ trái vs Cấm quay đầu',
    left: { name: 'Cấm rẽ trái (P.123a)', img: '/images/signs/q313_b1.webp' },
    right: { name: 'Cấm quay đầu (P.124a)', img: '/images/signs/q313_b2.webp' },
    same: 'Đều là biển tròn viền đỏ, nền trắng, mũi tên đen gạch chéo đỏ.',
    diff: 'Cấm rẽ trái VẪN ĐƯỢC quay đầu xe; Cấm quay đầu VẪN ĐƯỢC rẽ trái.',
  },
  {
    title: 'Đường cấm vs Cấm đi ngược chiều',
    left: { name: 'Đường cấm (P.101)', img: '/images/signs/q325_b1.webp' },
    right: { name: 'Cấm đi ngược chiều (P.102)', img: '/images/signs/q325_b2.webp' },
    same: 'Đều là biển cấm hình tròn, không vẽ hình phương tiện bên trong.',
    diff: 'Đường cấm: nền trắng, cấm cả 2 chiều; Cấm ngược chiều: nền đỏ gạch trắng ngang, chỉ cấm đi vào từ chiều đặt biển.',
  },
  {
    title: 'Giao đường không ưu tiên vs Đường ưu tiên',
    left: { name: 'Giao với đường không ưu tiên (W.207)', img: '/images/signs/q382_b1.webp' },
    right: { name: 'Giao với đường ưu tiên (W.208)', img: '/images/signs/q383_b2.webp' },
    same: 'Đều là biển báo nguy hiểm hình tam giác viền đỏ, nền vàng.',
    diff: 'Tam giác xuôi nét dọc dày = mình trên đường ưu tiên; Tam giác lộn ngược = phải nhường đường.',
  },
  {
    title: 'Đường đôi vs Đường hai chiều',
    left: { name: 'Bắt đầu đường đôi (W.235)', img: '/images/signs/q392_b2.webp' },
    right: { name: 'Đường hai chiều (W.204)', img: '/images/signs/q389_b1.webp' },
    same: 'Đều cảnh báo đoạn đường có xe chạy 2 chiều ngược nhau.',
    diff: 'Đường đôi có dải phân cách cứng ở giữa; Đường hai chiều 2 mũi tên song song không có dải phân cách.',
  },
  {
    title: 'Nhường đường vs Ưu tiên qua đường hẹp',
    left: { name: 'Nhường đường qua đường hẹp (P.132)', img: '/images/signs/q389_b2.webp' },
    right: { name: 'Ưu tiên qua đường hẹp (I.406)', img: '/images/signs/q389_b3.webp' },
    same: 'Đều đặt tại đoạn đường hẹp có 2 mũi tên ngược chiều.',
    diff: 'Biển tròn đỏ (mũi tên đỏ đi lên) = PHẢI NHƯỜNG; Biển vuông xanh (mũi tên trắng đi lên) = ĐƯỢC ƯU TIÊN.',
  },
  {
    title: 'Tải trọng trục vs Tải trọng toàn bộ',
    left: { name: 'Hạn chế tải trọng trục (P.116)', img: '/images/signs/q337_b2.webp' },
    right: { name: 'Hạn chế tải trọng toàn bộ (P.115)', img: '/images/signs/q337_b3.webp' },
    same: 'Đều là biển tròn viền đỏ ghi số tấn (t) bên trong.',
    diff: 'Có hình trục bánh xe bên dưới = giới hạn tải trên 1 trục; Chỉ ghi số tấn = tổng trọng lượng cả xe và hàng.',
  },
  {
    title: 'Đường sắt có rào chắn vs Không rào chắn',
    left: { name: 'Đường sắt có rào chắn (W.210)', img: '/images/signs/q371_b1.webp' },
    right: { name: 'Đường sắt không rào chắn (W.211a)', img: '/images/signs/q374_b2.webp' },
    same: 'Đều cảnh báo giao cắt với đường sắt phía trước.',
    diff: 'Có hàng rào chắn = Có rào chắn; Hình đầu tàu hỏa = Không có rào chắn.',
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

const TAPLO_ITEMS = [
  { img: '/images/cau_227.webp', title: 'Đang sử dụng phanh đỗ (Phanh tay)', level: 'Đỏ — Kiểm tra trước khi chạy' },
  { img: '/images/cau_228.webp', title: 'Áp suất dầu bôi trơn ở mức thấp', level: 'Đỏ — Dừng xe kiểm tra ngay' },
  { img: '/images/cau_229.webp', title: 'Cửa xe đóng chưa chặt / chưa đóng', level: 'Đỏ — Đóng chặt cửa' },
  { img: '/images/cau_286.webp', title: 'Nhiệt độ nước làm mát quá cao', level: 'Đỏ — Dừng xe hạ nhiệt' },
  { img: '/images/cau_287.webp', title: 'Cần kiểm tra động cơ (Check Engine)', level: 'Vàng — Đưa xe đi kiểm tra' },
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
  { cls: 'BE / CE / DE', age: '21–27', desc: 'Xe hạng B, C, D kéo rơ-moóc có khối lượng toàn bộ > 750 kg.' },
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
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Sổ Tay Kiến Thức &amp; Tra Cứu 2025
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Ảnh biển báo thật chuẩn Cục CSGT 2025, taplo, hiệu lệnh CSGT, tốc độ &amp; mẹo giải nhanh.
          </p>
        </div>

        <SegmentedControl
          value={tab}
          onChange={setTab}
          options={[
            { id: 'signs', label: 'Biển báo dễ lừa' },
            { id: 'speed', label: 'Tốc độ & Khoảng cách' },
            { id: 'taplo_csgt', label: 'Taplo & CSGT' },
            { id: 'licenses', label: 'GPLX & Mẹo 2025' },
            { id: 'search', label: 'Tra cứu 600 câu' },
          ]}
        />
      </div>

      {/* TAB 1: Biển báo dễ lừa (Real cropped official signs) */}
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
                  <button
                    key={sign.name}
                    type="button"
                    onClick={() => onZoomImage(sign.img)}
                    className="group flex flex-col items-center rounded-xl border border-slate-100 bg-white p-3.5 text-center transition-colors hover:border-slate-300"
                  >
                    <img
                      src={sign.img}
                      alt={sign.name}
                      className="h-24 w-auto object-contain"
                    />
                    <span className="mt-2.5 text-xs font-semibold text-slate-800">
                      {sign.name}
                    </span>
                  </button>
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

      {/* TAB 2: Tốc độ, Khoảng cách & Niên hạn */}
      {tab === 'speed' && (
        <div className="space-y-6">
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

            <p className="rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-600 dark:bg-slate-950 dark:text-slate-300">
              <strong>Lưu ý bổ sung:</strong> Xe gắn máy tốc độ tối đa <strong>40 km/h</strong>; xe máy chuyên dùng tối đa <strong>40 km/h</strong>. Trên đường cao tốc: tối đa <strong>120 km/h</strong>, tối thiểu thường <strong>60 km/h</strong>.
            </p>

            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                <Compass className="h-4 w-4 text-emerald-600" />
                Khoảng cách an toàn tối thiểu (Mặt đường khô ráo)
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { v: 'V = 60 km/h', d: '35 m' },
                  { v: '60 < V ≤ 80 km/h', d: '55 m' },
                  { v: '80 < V ≤ 100 km/h', d: '70 m' },
                  { v: '100 < V ≤ 120 km/h', d: '100 m' },
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

          {/* Niên hạn & Nồng độ cồn */}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Niên hạn sử dụng ô tô
              </h3>
              <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <div className="flex justify-between rounded-lg bg-slate-50 px-3.5 py-2.5 dark:bg-slate-950">
                  <span>Ô tô tải (kể cả chuyên dùng)</span>
                  <strong className="font-mono">Tối đa 25 năm</strong>
                </div>
                <div className="flex justify-between rounded-lg bg-slate-50 px-3.5 py-2.5 dark:bg-slate-950">
                  <span>Ô tô chở người trên 9 chỗ</span>
                  <strong className="font-mono">Tối đa 20 năm</strong>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Quy định Nồng độ cồn &amp; Điểm GPLX 2025
              </h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
                <li>• Nồng độ cồn trong máu/hơi thở khi lái xe: <strong>Tuyệt đối = 0</strong> (Bị nghiêm cấm).</li>
                <li>• Mỗi GPLX có <strong>12 điểm/năm</strong>; nếu bị trừ hết điểm phải thi kiểm tra kiến thức pháp luật để phục hồi.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Taplo, CSGT & Vạch kẻ đường */}
      {tab === 'taplo_csgt' && (
        <div className="space-y-6">
          {/* Đèn Taplo */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Ký hiệu Đèn cảnh báo Taplo thường gặp
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {TAPLO_ITEMS.map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => onZoomImage(item.img)}
                  className="flex flex-col items-center rounded-xl border border-slate-100 bg-white p-4 text-center transition-colors hover:border-slate-300"
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-20 w-auto object-contain"
                  />
                  <div className="mt-3 text-xs font-bold text-slate-900">{item.title}</div>
                  <div className="mt-1 text-[11px] text-slate-500">{item.level}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Hiệu lệnh CSGT & Vạch kẻ đường */}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Hiệu lệnh Cảnh sát giao thông (Câu 36 &amp; 37)
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => onZoomImage('/images/cau_36.webp')}
                  className="flex flex-col items-center rounded-xl border border-slate-100 bg-white p-3 text-center"
                >
                  <img
                    src="/images/cau_36.webp"
                    alt="CSGT dang ngang 2 tay"
                    className="h-32 w-auto object-contain"
                  />
                  <span className="mt-2 text-xs font-bold text-slate-900">
                    Dang ngang 2 tay
                  </span>
                  <span className="mt-0.5 text-[11px] text-slate-600">
                    Trước &amp; Sau dừng • Phải &amp; Trái đi
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onZoomImage('/images/cau_37.webp')}
                  className="flex flex-col items-center rounded-xl border border-slate-100 bg-white p-3 text-center"
                >
                  <img
                    src="/images/cau_37.webp"
                    alt="CSGT giơ tay thẳng đứng"
                    className="h-32 w-auto object-contain"
                  />
                  <span className="mt-2 text-xs font-bold text-slate-900">
                    Giơ tay thẳng đứng
                  </span>
                  <span className="mt-0.5 text-[11px] text-slate-600">
                    Tất cả các hướng dừng lại
                  </span>
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Quy tắc Vạch kẻ đường chuẩn
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                <li>• <strong>Vạch màu VÀNG:</strong> Phân chia 2 chiều xe chạy ngược chiều nhau.</li>
                <li>• <strong>Vạch màu TRẮNG:</strong> Phân chia các làn xe chạy cùng chiều.</li>
                <li>• <strong>Vạch NÉT ĐỨT:</strong> Được phép đè vạch, chuyển làn, vượt xe.</li>
                <li>• <strong>Vạch NÉT LIỀN:</strong> Tuyệt đối không được lấn làn, đè vạch.</li>
                <li>• <strong>Vạch đôi (1 đứt + 1 liền):</strong> Xe bên phía nét đứt được cắt qua; bên nét liền không được cắt.</li>
                <li>• <strong>Vạch mắt võng (vàng):</strong> Báo không được dừng phương tiện trong phạm vi nút giao.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Hạng GPLX 2025 & Mẹo giải nhanh */}
      {tab === 'licenses' && (
        <div className="space-y-6">
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
                title: 'Mẹo dừng/đỗ, vượt xe & từ khóa 3 giây',
                lines: [
                  'Thấy "Bị nghiêm cấm" / "Không được phép" → Chọn ngay.',
                  'Thấy "Giảm tốc độ, đi sát về bên phải" → Chọn ngay.',
                  'Vượt xe bên trái (trừ khi xe trước rẽ trái/đang dừng hoặc xe chuyên dùng làm việc).',
                  'Cấm dừng/đỗ trên cầu, hầm, giao lộ, đường sắt, phần người đi bộ.',
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
