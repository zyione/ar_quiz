import React, { useEffect, useRef } from 'react';
import type { Question } from '../data/questions';
import type { AnswerKey } from '../types';
import { triggerConfetti, triggerSideConfetti, playCorrectSound, playIncorrectSound } from '../lib/effects';

interface Props {
  question: Question;
  userAnswer: AnswerKey | null;
  isCorrect: boolean;
  soundEnabled: boolean;
  onNext: () => void;
  questionIndex: number;
  totalQuestions: number;
}

export default function FeedbackPanel({
  question,
  userAnswer,
  isCorrect,
  soundEnabled,
  onNext,
  questionIndex,
  totalQuestions,
}: Props) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    if (isCorrect) {
      if (soundEnabled) playCorrectSound();
      triggerConfetti();
      setTimeout(triggerSideConfetti, 300);
    } else {
      if (soundEnabled) playIncorrectSound();
    }
  }, [isCorrect, soundEnabled]);

  const isLast = questionIndex + 1 >= totalQuestions;

  const SUCCESS_MESSAGES = [
    'Excellent! 🎉',
    'You got it! ✨',
    'Trivia Genius! 🌟',
    'Outstanding! 🏆',
    'Brilliant! 💡',
    'Spot on! 🎯',
  ];
  const successMsg = SUCCESS_MESSAGES[questionIndex % SUCCESS_MESSAGES.length];

  return (
    <div className={`feedback-panel ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}>
      {/* Status banner */}
      <div className={`feedback-banner ${isCorrect ? 'banner-correct' : 'banner-incorrect'}`}>
        {isCorrect ? (
          <div className="banner-content">
            <div className="crown-animation">👑</div>
            <div className="banner-text">
              <span className="banner-status">Correct!</span>
              <span className="banner-msg">{successMsg}</span>
            </div>
            <div className="score-pop">+10</div>
          </div>
        ) : (
          <div className="banner-content">
            <div className="incorrect-icon">❌</div>
            <div className="banner-text">
              <span className="banner-status">Not quite —</span>
              <span className="banner-msg">Here's why.</span>
            </div>
          </div>
        )}
      </div>

      {/* Answer reveal */}
      {!isCorrect && (
        <div className="answer-reveal">
          <div className="your-answer">
            <span className="reveal-label">Your answer:</span>
            <span className="reveal-value wrong">
              {userAnswer} — {userAnswer ? question.options[userAnswer] : '(no answer)'}
            </span>
          </div>
          <div className="correct-answer">
            <span className="reveal-label">Correct answer:</span>
            <span className="reveal-value right">
              {question.correctAnswer} — {question.options[question.correctAnswer]}
            </span>
          </div>
        </div>
      )}

      {/* Explanation */}
      <div className="feedback-explanation">
        <div className="exp-section">
          <div className="exp-icon">💡</div>
          <div className="exp-content">
            <h3 className="exp-title">Explanation</h3>
            <p>{question.explanation}</p>
          </div>
        </div>

        {question.principle && (
          <div className="exp-section">
            <div className="exp-icon">🎓</div>
            <div className="exp-content">
              <h3 className="exp-title">Key Principle</h3>
              <p>{question.principle}</p>
            </div>
          </div>
        )}

        {question.workplaceExample && (
          <div className="exp-section">
            <div className="exp-icon">🏢</div>
            <div className="exp-content">
              <h3 className="exp-title">Workplace Example</h3>
              <p className="workplace-example">{question.workplaceExample}</p>
            </div>
          </div>
        )}
      </div>

      {/* Next button */}
      <button
        id="next-question-btn"
        className="btn btn-primary btn-lg next-btn"
        onClick={onNext}
      >
        {isLast ? '🏁 See Results' : 'Next Question →'}
      </button>
    </div>
  );
}
