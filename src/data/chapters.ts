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
    shortTitle: 'Văn hóa & Đạo đức',
    range: [181, 205],
    description: 'Đạo đức người lái xe, trách nhiệm khi xảy ra tai nạn, kỹ năng PCCC.',
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
    description: 'Hệ thống phanh, lái, động cơ, ắc quy, lốp và các ký hiệu taplo.',
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

export const EXAM_CONFIGS: ExamConfig[] = [
  {
    id: 'A1_A',
    name: 'Hạng A1 / A',
    subtitle: 'Xe mô tô hai bánh (25 câu / 19 phút)',
    totalQuestions: 25,
    durationMinutes: 19,
    passScore: 21,
    criticalCount: 1,
    chapterWeights: { 1: 8, 2: 1, 3: 1, 4: 0, 5: 9, 6: 6 },
  },
  {
    id: 'B',
    name: 'Hạng B',
    subtitle: 'Ô tô đến 8 chỗ, tải ≤ 3.5 tấn (30 câu / 20 phút)',
    totalQuestions: 30,
    durationMinutes: 20,
    passScore: 27,
    criticalCount: 1,
    chapterWeights: { 1: 8, 2: 1, 3: 2, 4: 1, 5: 10, 6: 8 },
  },
  {
    id: 'C1',
    name: 'Hạng C1',
    subtitle: 'Ô tô tải từ 3.5 đến 7.5 tấn (35 câu / 22 phút)',
    totalQuestions: 35,
    durationMinutes: 22,
    passScore: 32,
    criticalCount: 1,
    chapterWeights: { 1: 9, 2: 1, 3: 2, 4: 2, 5: 12, 6: 9 },
  },
  {
    id: 'C',
    name: 'Hạng C',
    subtitle: 'Ô tô tải trên 7.5 tấn (40 câu / 24 phút)',
    totalQuestions: 40,
    durationMinutes: 24,
    passScore: 36,
    criticalCount: 1,
    chapterWeights: { 1: 10, 2: 1, 3: 3, 4: 2, 5: 14, 6: 10 },
  },
  {
    id: 'D1_D2_D',
    name: 'Hạng D1 / D2 / D',
    subtitle: 'Ô tô chở khách trên 8 chỗ (45 câu / 26 phút)',
    totalQuestions: 45,
    durationMinutes: 26,
    passScore: 41,
    criticalCount: 1,
    chapterWeights: { 1: 11, 2: 2, 3: 3, 4: 2, 5: 16, 6: 11 },
  },
];
