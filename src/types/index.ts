export type Category = string;

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | string;

export interface Question {
  id: number;
  category?: Category;
  difficulty?: Difficulty;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  principle?: string;
  workplaceExample?: string;
}

export type AnswerKey = 'A' | 'B' | 'C' | 'D';

export interface UserAnswer {
  questionId: number;
  selectedAnswer: AnswerKey | null;
  isCorrect: boolean;
  timestamp: number;
}

export interface CategoryStats {
  category: Category;
  total: number;
  correct: number;
}

export type AppScreen =
  | 'welcome'
  | 'camera-setup'
  | 'quiz'
  | 'feedback'
  | 'results';

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  userAnswers: UserAnswer[];
  cameraEnabled: boolean;
  soundEnabled: boolean;
  screen: AppScreen;
  pendingAnswer: AnswerKey | null;
  confirmedAnswer: AnswerKey | null;
  isAnswerLocked: boolean;
  lastFeedbackCorrect: boolean | null;
}

export type GestureAnswer = AnswerKey | null;

export interface HandLandmarkPoint {
  x: number;
  y: number;
  z: number;
}

export interface HandGestureResult {
  fingerCount: number | null;
  answer: GestureAnswer;
  confidence: 'high' | 'low' | 'none';
  landmarks?: HandLandmarkPoint[];
  isFist?: boolean;
  isFiveFingers?: boolean;
}

export type PerformanceLevel =
  | 'AI Literacy Champion'
  | 'AI-Savvy Professional'
  | 'AI Learner'
  | 'AI Explorer';
