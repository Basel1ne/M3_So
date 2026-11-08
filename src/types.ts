export interface Question {
  id: string;
  unitId: string;
  unitName: string;
  category: '경제' | '지리';
  qNum: number;
  question: string;
  choices: string[];
  answer: number; // 1, 2, 3, 4, 5
  answerChar: string; // ①, ②, ③, ④, ⑤
  explanation: string;
  pdfFileName: string;
}

export interface UnitMeta {
  id: string;
  title: string;
  fullTitle: string;
  category: '경제' | '지리';
  count: number;
  pdfFile: string;
  description: string;
  keyConcepts: string[];
}

export interface UserAnswerRecord {
  questionId: string;
  selectedChoice: number;
  isCorrect: boolean;
  timestamp: number;
}

export interface StudyStats {
  solvedCount: number;
  correctCount: number;
  wrongIds: string[];
  bookmarkedIds: string[];
  unitProgress: Record<string, { solved: number; correct: number }>;
  lastStudiedUnit?: string;
  recentTestScores: { date: string; score: number; total: number; unitName: string }[];
}

export type ViewMode = 'home' | 'units' | 'quiz' | 'mock-exam' | 'wrong-notes' | 'bookmarks' | 'pdf-viewer';

export interface QuizSessionConfig {
  unitId?: string; // specific unit or undefined for mixed
  category?: '경제' | '지리' | '전체';
  mode: 'practice' | 'test' | 'wrong_review' | 'bookmark_review';
  questionCount?: number; // default all or custom (e.g. 10, 20)
  randomize?: boolean;
}
