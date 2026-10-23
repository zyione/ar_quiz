import React, { useState } from 'react';
import type { Question, AnswerKey } from '../types';

interface Props {
  question: Question;
  selectedAnswer: AnswerKey | null;
  confirmedAnswer: AnswerKey | null;
  candidateAnswer: AnswerKey | null;
  dwellProgress: number; // 0 to 1
  isLocked: boolean;
  onSelect: (answer: AnswerKey) => void;
  onDirectConfirm?: (answer: AnswerKey) => void;
}

const OPTION_KEYS: AnswerKey[] = ['A', 'B', 'C', 'D'];
const OPTION_GESTURES: Record<AnswerKey, string> = {
  A: '☝️ 1',
  B: '✌️ 2',
  C: '🤟 3',
  D: '🖖 4',
};

export default function QuestionCard({
  question,
  selectedAnswer,
  confirmedAnswer,
  candidateAnswer,
  dwellProgress,
  isLocked,
  onSelect,
}: Props) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakQuestion = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Replace underscores with a pause or blank
    const textToRead = question.question.replace(/_{2,}/g, 'blank');
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="ar-quiz-question-container">
      {/* Question Prompt Card */}
      <div className="ar-question-banner">
        <div className="ar-question-text">{question.question}</div>
        <button
          className={`ar-audio-btn ${isSpeaking ? 'speaking' : ''}`}
          onClick={speakQuestion}
          title="Read question aloud (Offline TTS)"
          aria-label="Read question aloud"
        >
          <svg
            className="speaker-icon"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        </button>
      </div>

      {/* 4 Stacked Option Cards */}
      <div className="ar-options-stack">
        {OPTION_KEYS.map((key) => {
          const optionText = question.options[key];
          const isCandidate = candidateAnswer === key && !isLocked;
          const isSelected = selectedAnswer === key;
          const isCorrect = key === question.correctAnswer;
          const isUserConfirmed = confirmedAnswer === key;

          let cardClass = 'ar-option-card';
          if (isLocked) {
            if (isUserConfirmed && isCorrect) {
              cardClass += ' state-correct';
            } else if (isUserConfirmed && !isCorrect) {
              cardClass += ' state-wrong';
            } else if (isCorrect) {
              cardClass += ' state-reveal-correct';
            } else {
              cardClass += ' state-dimmed';
            }
          } else {
            if (isCandidate || isSelected) {
              cardClass += ' state-active-dwell';
            }
          }

          const fillWidth = isCandidate ? Math.min(100, Math.round(dwellProgress * 100)) : 0;

          return (
            <button
              key={key}
              id={`option-card-${key}`}
              className={cardClass}
              onClick={() => !isLocked && onSelect(key)}
              disabled={isLocked}
              aria-label={`Option ${key}: ${optionText}`}
            >
              {/* Dwell Progress Fill Bar (Matching reference image) */}
              {!isLocked && fillWidth > 0 && (
                <div
                  className="ar-dwell-fill-bar"
                  style={{ width: `${fillWidth}%` }}
                />
              )}

              {/* Left letter badge */}
              <div className="ar-option-badge">
                <span className="badge-letter">{key}</span>
              </div>

              {/* Option text */}
              <div className="ar-option-content">
                <span className="option-title">{optionText}</span>
              </div>

              {/* Subtle non-obtrusive control tag */}
              {!isLocked && (
                <div className="ar-option-control-tag" title={`Show ${OPTION_GESTURES[key]} or press key '${key}'`}>
                  <span className="tag-gesture">{OPTION_GESTURES[key]}</span>
                  <span className="tag-key"><kbd>{key}</kbd></span>
                </div>
              )}

              {/* Lock status or indicators */}
              {isLocked && isCorrect && (
                <div className="ar-option-result-icon correct">✓</div>
              )}
              {isLocked && isUserConfirmed && !isCorrect && (
                <div className="ar-option-result-icon wrong">✗</div>
              )}
              {!isLocked && isCandidate && fillWidth > 0 && (
                <div className="ar-option-dwell-hint">
                  {fillWidth < 100 ? `${fillWidth}%` : 'Locked!'}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
