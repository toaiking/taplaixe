import { ExamConfig } from '../types/question';

export interface ChapterMeta {
  id: number;
  title: string;
  shortTitle: string;
  range: [number, number];
  description: string;
}

export const CHAPTERS: ChapterMeta[] = [
  {
    id: 1,
    title: 'Chương 1: Quy định chung & Quy tắc giao thông',
    shortTitle: 'Quy tắc giao thông',
    range: [1, 180],
    description: 'Khái niệm, quy tắc nhường đường, tốc độ, khoảng cách, hiệu lệnh CSGT.',
  },
  {
    id: 2,
    title: 'Chương 2: Văn hóa giao thông, PCCC & Cứu hộ',
    shortTitle: 'Văn hóa & PCCC',
    range: [181, 205],
    description: 'Đạo đức người lái xe, phòng chống tác hại rượu bia, kỹ năng PCCC & cứu nạn cứu hộ.',
  },
  {
    id: 3,
    title: 'Chương 3: Kỹ thuật lái xe',
    shortTitle: 'Kỹ thuật lái xe',
    range: [206, 263],
    description: 'Thao tác khởi hành, lên/xuống dốc, lái xe ban đêm, đèn cảnh báo taplo.',
  },
  {
    id: 4,
    title: 'Chương 4: Cấu tạo và sửa chữa',
    shortTitle: 'Cấu tạo & Sửa chữa',
    range: [264, 300],
    description: 'Hệ thống phanh, lái, động cơ, ắc quy, lốp, ô tô điện (áp dụng từ hạng B1, B trở lên).',
  },
  {
    id: 5,
    title: 'Chương 5: Báo hiệu đường bộ',
    shortTitle: 'Biển báo đường bộ',
    range: [301, 485],
    description: 'Biển báo cấm, nguy hiểm, hiệu lệnh, chỉ dẫn, biển phụ và vạch kẻ đường.',
  },
  {
    id: 6,
    title: 'Chương 6: Giải thế sa hình & Xử lý tình huống',
    shortTitle: 'Giải thế sa hình',
    range: [486, 600],
    description: 'Thứ tự ưu tiên qua ngã tư, vòng xuyến, đường sắt và tình huống thực tế.',
  },
];

// Cấu trúc đề sát hạch lý thuyết theo Phụ lục I, II, III Thông tư 108/2026/TT-BCA (áp dụng từ 01/03/2027)
export const EXAM_CONFIGS_108_2026: ExamConfig[] = [
  {
    id: 'A1_A_108',
    name: 'Hạng A1 / A',
    subtitle: 'Mô tô 2 bánh — Phụ lục I TT 108/2026 (40 câu / 27 phút • Đạt ≥ 36/40)',
    totalQuestions: 40,
    durationMinutes: 27,
    passScore: 36,
    criticalCount: 1,
    chapterWeights: { 1: 13, 2: 2, 3: 2, 4: 0, 5: 14, 6: 9 },
  },
  {
    id: 'B1_108',
    name: 'Hạng B1',
    subtitle: 'Mô tô 3 bánh — Phụ lục II TT 108/2026 (50 câu / 33 phút • Đạt ≥ 45/50)',
    totalQuestions: 50,
    durationMinutes: 33,
    passScore: 45,
    criticalCount: 1,
    chapterWeights: { 1: 14, 2: 2, 3: 4, 4: 3, 5: 15, 6: 12 },
  },
  {
    id: 'B',
    name: 'Hạng B',
    subtitle: 'Ô tô đến 8 chỗ, tải ≤ 3.5t, ô tô điện — Phụ lục III TT 108/2026 (50 câu / 33 phút • Đạt ≥ 45/50)',
    totalQuestions: 50,
    durationMinutes: 33,
    passScore: 45,
    criticalCount: 1,
    chapterWeights: { 1: 14, 2: 2, 3: 4, 4: 3, 5: 15, 6: 12 },
  },
  {
    id: 'C1',
    name: 'Hạng C1',
    subtitle: 'Ô tô tải > 3.5t đến 7.5t — Phụ lục III TT 108/2026 (60 câu / 40 phút • Đạt ≥ 54/60)',
    totalQuestions: 60,
    durationMinutes: 40,
    passScore: 54,
    criticalCount: 1,
    chapterWeights: { 1: 16, 2: 3, 3: 5, 4: 4, 5: 18, 6: 14 },
  },
  {
    id: 'C',
    name: 'Hạng C',
    subtitle: 'Ô tô tải trên 7.5 tấn — Phụ lục III TT 108/2026 (70 câu / 47 phút • Đạt ≥ 63/70)',
    totalQuestions: 70,
    durationMinutes: 47,
    passScore: 63,
    criticalCount: 1,
    chapterWeights: { 1: 19, 2: 3, 3: 6, 4: 5, 5: 21, 6: 16 },
  },
  {
    id: 'D1_D2_D',
    name: 'Hạng D1 / D2 / D',
    subtitle: 'Ô tô chở khách > 8 chỗ & Hạng kéo rơ-moóc — TT 108/2026 (80 câu / 53 phút • Đạt ≥ 72/80)',
    totalQuestions: 80,
    durationMinutes: 53,
    passScore: 72,
    criticalCount: 1,
    chapterWeights: { 1: 22, 2: 4, 3: 7, 4: 5, 5: 24, 6: 18 },
  },
];

// Cấu trúc chuyển tiếp theo khoản 6 Điều 41 Thông tư 108/2026/TT-BCA (áp dụng đến hết 28/02/2027 theo TT 12/2025/TT-BCA)
export const EXAM_CONFIGS_TRANSITIONAL: ExamConfig[] = [
  {
    id: 'A1',
    name: 'Hạng A1',
    subtitle: 'Xe mô tô ≤ 125 cm³ (25 câu / 19 phút • Đạt ≥ 21/25)',
    totalQuestions: 25,
    durationMinutes: 19,
    passScore: 21,
    criticalCount: 1,
    chapterWeights: { 1: 8, 2: 1, 3: 1, 4: 0, 5: 9, 6: 6 },
  },
  {
    id: 'A',
    name: 'Hạng A',
    subtitle: 'Xe mô tô > 125 cm³ (25 câu / 19 phút • Đạt ≥ 23/25)',
    totalQuestions: 25,
    durationMinutes: 19,
    passScore: 23,
    criticalCount: 1,
    chapterWeights: { 1: 8, 2: 1, 3: 1, 4: 0, 5: 9, 6: 6 },
  },
  {
    id: 'B1',
    name: 'Hạng B1',
    subtitle: 'Mô tô 3 bánh (25 câu / 19 phút • Đạt ≥ 23/25)',
    totalQuestions: 25,
    durationMinutes: 19,
    passScore: 23,
    criticalCount: 1,
    chapterWeights: { 1: 8, 2: 1, 3: 1, 4: 0, 5: 9, 6: 6 },
  },
  {
    id: 'B_25',
    name: 'Hạng B',
    subtitle: 'Ô tô đến 8 chỗ, tải ≤ 3.5 tấn (30 câu / 20 phút • Đạt ≥ 27/30)',
    totalQuestions: 30,
    durationMinutes: 20,
    passScore: 27,
    criticalCount: 1,
    chapterWeights: { 1: 8, 2: 1, 3: 2, 4: 1, 5: 10, 6: 8 },
  },
  {
    id: 'C1_25',
    name: 'Hạng C1',
    subtitle: 'Ô tô tải từ 3.5 đến 7.5 tấn (35 câu / 22 phút • Đạt ≥ 32/35)',
    totalQuestions: 35,
    durationMinutes: 22,
    passScore: 32,
    criticalCount: 1,
    chapterWeights: { 1: 9, 2: 1, 3: 2, 4: 2, 5: 12, 6: 9 },
  },
  {
    id: 'C_25',
    name: 'Hạng C',
    subtitle: 'Ô tô tải trên 7.5 tấn (40 câu / 24 phút • Đạt ≥ 36/40)',
    totalQuestions: 40,
    durationMinutes: 24,
    passScore: 36,
    criticalCount: 1,
    chapterWeights: { 1: 10, 2: 1, 3: 3, 4: 2, 5: 14, 6: 10 },
  },
  {
    id: 'D1_D2_D_25',
    name: 'Hạng D1 / D2 / D',
    subtitle: 'Ô tô chở khách trên 8 chỗ (45 câu / 26 phút • Đạt ≥ 41/45)',
    totalQuestions: 45,
    durationMinutes: 26,
    passScore: 41,
    criticalCount: 1,
    chapterWeights: { 1: 11, 2: 2, 3: 3, 4: 2, 5: 16, 6: 11 },
  },
];

export const EXAM_CONFIGS: ExamConfig[] = EXAM_CONFIGS_108_2026;
