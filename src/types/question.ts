export type SRSBox = 'unlearned' | 'wrong' | 'learning' | 'mastered';

export interface Question {
  id: number;
  chapter: number;
  isCritical: boolean;
  question: string;
  image: string | null;
  options: string[];
  correctAnswer: number;
  explanation: string;
  keywords: string[];
}

export interface QuestionProgress {
  box: SRSBox;
  correctCount: number;
  wrongCount: number;
  lastReviewed: number;
}

export type ScreenId = 'dashboard' | 'practice' | 'exam' | 'handbook';

export type PracticeSourceMode =
  | 'all'
  | 'critical'
  | 'srs'
  | 'wrong'
  | 'bookmarked'
  | 'pinned'
  | 'speed_distance'
  | 'taplo'
  | 'csgt_markings';

export interface StudySchedule {
  enabled: boolean;
  time: string; // "HH:MM"
  days: number[]; // 0 = CN, 1 = T2 ... 6 = T7
  dailyGoal: number;
  focusMode: PracticeSourceMode;
  lastNotifiedDate: string | null;
}

export interface PracticePreset {
  chapter: number | 'all';
  sourceMode: PracticeSourceMode;
  onlyWithImage?: boolean;
  onlyUnmastered?: boolean;
}

export interface ExamConfig {
  id: string;
  name: string;
  subtitle: string;
  totalQuestions: number;
  durationMinutes: number;
  passScore: number;
  criticalCount: number;
  /** Phân bổ câu hỏi theo chương [chap1..chap6] (không tính câu điểm liệt đã chọn riêng hoặc gộp chung) */
  chapterWeights: Record<number, number>;
}

export interface ExamResult {
  id: string;
  examKey?: string;
  examName: string;
  date: number;
  totalQuestions: number;
  correctCount: number;
  passScore: number;
  passed: boolean;
  failedByCritical: boolean;
  durationSeconds: number;
  questionIds: number[];
  answers: Record<number, number>;
}
