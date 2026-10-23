import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type { QuizState, AppScreen, AnswerKey, UserAnswer, Question } from '../types';
import { loadInitialQuestions, saveCustomQuestions, GENERAL_TRIVIA_PACK } from '../lib/questionStore';

export interface ExtendedQuizState extends QuizState {
  questions: Question[];
  activePackId: string;
  candidateAnswer: AnswerKey | null;
  dwellProgress: number; // 0 to 1
  isQuestionEditorOpen: boolean;
}

const INITIAL_STATE: ExtendedQuizState = {
  questions: GENERAL_TRIVIA_PACK,
  activePackId: 'general-trivia',
  currentQuestionIndex: 0,
  score: 0,
  userAnswers: [],
  cameraEnabled: true,
  soundEnabled: true,
  screen: 'welcome',
  pendingAnswer: null,
  confirmedAnswer: null,
  isAnswerLocked: false,
  lastFeedbackCorrect: null,
  candidateAnswer: null,
  dwellProgress: 0,
  isQuestionEditorOpen: false,
};

type Action =
  | { type: 'SET_LOADED_QUESTIONS'; payload: { questions: Question[]; packId: string } }
  | { type: 'SET_QUESTIONS'; payload: { questions: Question[]; packId?: string } }
  | { type: 'SET_SCREEN'; payload: AppScreen }
  | { type: 'SET_DWELL'; payload: { candidate: AnswerKey | null; progress: number } }
  | { type: 'SET_PENDING_ANSWER'; payload: AnswerKey | null }
  | { type: 'CONFIRM_ANSWER' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'TOGGLE_CAMERA' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'TOGGLE_EDITOR'; payload?: boolean }
  | { type: 'JUMP_RANDOM_QUESTION' }
  | { type: 'RESTART' }
  | { type: 'SKIP_CAMERA_SETUP' };

function reducer(state: ExtendedQuizState, action: Action): ExtendedQuizState {
  switch (action.type) {
    case 'SET_LOADED_QUESTIONS':
      return {
        ...state,
        questions: action.payload.questions,
        activePackId: action.payload.packId,
      };

    case 'SET_QUESTIONS': {
      const packId = action.payload.packId || 'custom';
      saveCustomQuestions(action.payload.questions, packId);
      return {
        ...state,
        questions: action.payload.questions,
        activePackId: packId,
        currentQuestionIndex: 0,
        score: 0,
        userAnswers: [],
        pendingAnswer: null,
        confirmedAnswer: null,
        isAnswerLocked: false,
        lastFeedbackCorrect: null,
        candidateAnswer: null,
        dwellProgress: 0,
      };
    }

    case 'SET_SCREEN':
      return { ...state, screen: action.payload };

    case 'SET_DWELL':
      if (state.isAnswerLocked) return state;
      return {
        ...state,
        candidateAnswer: action.payload.candidate,
        dwellProgress: action.payload.progress,
      };

    case 'SET_PENDING_ANSWER':
      if (state.isAnswerLocked) return state;
      return { ...state, pendingAnswer: action.payload };

    case 'CONFIRM_ANSWER': {
      if (state.isAnswerLocked) return state;
      const effectiveAnswer = state.pendingAnswer || state.candidateAnswer;
      if (!effectiveAnswer) return state;

      const question = state.questions[state.currentQuestionIndex];
      if (!question) return state;

      const isCorrect = effectiveAnswer === question.correctAnswer;
      const ua: UserAnswer = {
        questionId: question.id,
        selectedAnswer: effectiveAnswer,
        isCorrect,
        timestamp: Date.now(),
      };

      return {
        ...state,
        isAnswerLocked: true,
        confirmedAnswer: effectiveAnswer,
        pendingAnswer: effectiveAnswer,
        score: isCorrect ? state.score + 10 : state.score,
        userAnswers: [...state.userAnswers, ua],
        lastFeedbackCorrect: isCorrect,
        screen: 'feedback',
        dwellProgress: 0,
        candidateAnswer: null,
      };
    }

    case 'NEXT_QUESTION': {
      const next = state.currentQuestionIndex + 1;
      if (next >= state.questions.length) {
        return {
          ...state,
          screen: 'results',
          pendingAnswer: null,
          confirmedAnswer: null,
          isAnswerLocked: false,
          lastFeedbackCorrect: null,
          candidateAnswer: null,
          dwellProgress: 0,
        };
      }
      return {
        ...state,
        currentQuestionIndex: next,
        pendingAnswer: null,
        confirmedAnswer: null,
        isAnswerLocked: false,
        lastFeedbackCorrect: null,
        candidateAnswer: null,
        dwellProgress: 0,
        screen: 'quiz',
      };
    }

    case 'TOGGLE_CAMERA':
      return { ...state, cameraEnabled: !state.cameraEnabled };

    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: !state.soundEnabled };

    case 'TOGGLE_EDITOR':
      return {
        ...state,
        isQuestionEditorOpen: action.payload !== undefined ? action.payload : !state.isQuestionEditorOpen,
      };

    case 'JUMP_RANDOM_QUESTION': {
      if (state.questions.length <= 1) return state;
      let nextIdx = Math.floor(Math.random() * state.questions.length);
      if (nextIdx === state.currentQuestionIndex && state.questions.length > 1) {
        nextIdx = (nextIdx + 1) % state.questions.length;
      }
      return {
        ...state,
        currentQuestionIndex: nextIdx,
        pendingAnswer: null,
        confirmedAnswer: null,
        isAnswerLocked: false,
        lastFeedbackCorrect: null,
        candidateAnswer: null,
        dwellProgress: 0,
        screen: 'quiz',
      };
    }

    case 'SKIP_CAMERA_SETUP':
      return { ...state, cameraEnabled: false, screen: 'quiz' };

    case 'RESTART':
      return {
        ...INITIAL_STATE,
        questions: state.questions,
        activePackId: state.activePackId,
        cameraEnabled: state.cameraEnabled,
        soundEnabled: state.soundEnabled,
      };

    default:
      return state;
  }
}

interface QuizContextValue {
  state: ExtendedQuizState;
  dispatch: React.Dispatch<Action>;
  setQuestions: (questions: Question[], packId?: string) => void;
  setPendingAnswer: (a: AnswerKey | null) => void;
  setDwell: (candidate: AnswerKey | null, progress: number) => void;
  confirmAnswer: () => void;
  nextQuestion: () => void;
  jumpRandomQuestion: () => void;
  setScreen: (s: AppScreen) => void;
  toggleCamera: () => void;
  toggleSound: () => void;
  toggleEditor: (open?: boolean) => void;
  restart: () => void;
}

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  // Load questions on mount
  useEffect(() => {
    loadInitialQuestions().then(({ packId, questions }) => {
      dispatch({ type: 'SET_LOADED_QUESTIONS', payload: { packId, questions } });
    });
  }, []);

  const setQuestions = useCallback((questions: Question[], packId?: string) => {
    dispatch({ type: 'SET_QUESTIONS', payload: { questions, packId } });
  }, []);

  const setPendingAnswer = useCallback((a: AnswerKey | null) => {
    dispatch({ type: 'SET_PENDING_ANSWER', payload: a });
  }, []);

  const setDwell = useCallback((candidate: AnswerKey | null, progress: number) => {
    dispatch({ type: 'SET_DWELL', payload: { candidate, progress } });
  }, []);

  const confirmAnswer = useCallback(() => {
    dispatch({ type: 'CONFIRM_ANSWER' });
  }, []);

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' });
  }, []);

  const jumpRandomQuestion = useCallback(() => {
    dispatch({ type: 'JUMP_RANDOM_QUESTION' });
  }, []);

  const setScreen = useCallback((s: AppScreen) => {
    dispatch({ type: 'SET_SCREEN', payload: s });
  }, []);

  const toggleCamera = useCallback(() => dispatch({ type: 'TOGGLE_CAMERA' }), []);
  const toggleSound = useCallback(() => dispatch({ type: 'TOGGLE_SOUND' }), []);
  const toggleEditor = useCallback((open?: boolean) => dispatch({ type: 'TOGGLE_EDITOR', payload: open }), []);
  const restart = useCallback(() => dispatch({ type: 'RESTART' }), []);

  return (
    <QuizContext.Provider
      value={{
        state,
        dispatch,
        setQuestions,
        setPendingAnswer,
        setDwell,
        confirmAnswer,
        nextQuestion,
        jumpRandomQuestion,
        setScreen,
        toggleCamera,
        toggleSound,
        toggleEditor,
        restart,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error('useQuiz must be used within QuizProvider');
  return ctx;
}
