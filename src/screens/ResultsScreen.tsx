import React, { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import {
  computeCategoryStats,
  getPerformanceLevel,
  getStrengths,
  getImprovementAreas,
  getAccuracy,
  ACHIEVEMENT_MILESTONES,
} from '../lib/scoring';
import type { AnswerKey } from '../types';

const LEVEL_ICONS: Record<string, string> = {
  'AI Literacy Champion': '👑',
  'AI-Savvy Professional': '🥇',
  'AI Learner': '🥈',
  'AI Explorer': '🌱',
};

const LEVEL_COLORS: Record<string, string> = {
  'AI Literacy Champion': '#FFD700',
  'AI-Savvy Professional': '#C0C0C0',
  'AI Learner': '#CD7F32',
  'AI Explorer': '#6C63FF',
};

export default function ResultsScreen() {
  const { state, restart, setScreen } = useQuiz();
  const { userAnswers, score, questions } = state;

  const [showReview, setShowReview] = useState(false);

  const correct = userAnswers.filter((a) => a.isCorrect).length;
  const incorrect = userAnswers.filter((a) => !a.isCorrect).length;
  const total = questions.length;
  const accuracy = getAccuracy(correct, total);
  const level = getPerformanceLevel(correct);
  const stats = computeCategoryStats(userAnswers, questions);
  const strengths = getStrengths(stats);
  const improvements = getImprovementAreas(stats);

  const earnedMilestones = ACHIEVEMENT_MILESTONES.filter((m) => correct >= m.threshold);

  return (
    <div className="results-screen">
      <div className="results-hero">
        <div className="results-icon" style={{ color: LEVEL_COLORS[level] }}>
          {LEVEL_ICONS[level]}
        </div>
        <h1 className="results-title">Quiz Complete!</h1>
        <div className="results-level" style={{ color: LEVEL_COLORS[level] }}>
          {level}
        </div>

        {/* Score ring */}
        <div className="results-score-ring">
          <svg viewBox="0 0 120 120" className="ring-svg">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke={LEVEL_COLORS[level]}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 52}`}
              strokeDashoffset={`${2 * Math.PI * 52 * (1 - accuracy / 100)}`}
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 1.5s ease' }}
            />
          </svg>
          <div className="ring-inner">
            <div className="ring-score">{score.toLocaleString()}</div>
            <div className="ring-max">/ 4,000</div>
            <div className="ring-pct">{accuracy}%</div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="results-stats">
          <div className="result-stat correct-stat">
            <div className="rstat-value">{correct}</div>
            <div className="rstat-label">Correct</div>
          </div>
          <div className="result-stat incorrect-stat">
            <div className="rstat-value">{incorrect}</div>
            <div className="rstat-label">Incorrect</div>
          </div>
          <div className="result-stat accuracy-stat">
            <div className="rstat-value">{accuracy}%</div>
            <div className="rstat-label">Accuracy</div>
          </div>
        </div>

        {/* Achievements */}
        {earnedMilestones.length > 0 && (
          <div className="achievements-row">
            {earnedMilestones.map((m) => (
              <div key={m.threshold} className="achievement-badge">
                <span className="achievement-icon">{m.label.split(' ')[0]}</span>
                <span className="achievement-label">{m.label.slice(m.label.indexOf(' ') + 1)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      <section className="results-section">
        <h2 className="results-section-title">📊 Category Breakdown</h2>
        <div className="category-breakdown">
          {stats.map((s) => {
            const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
            const color = pct >= 80 ? '#00c896' : pct >= 60 ? '#f59e0b' : '#ef4444';
            return (
              <div key={s.category} className="breakdown-row">
                <div className="breakdown-name">{s.category}</div>
                <div className="breakdown-bar-wrap">
                  <div
                    className="breakdown-bar"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
                <div className="breakdown-score" style={{ color }}>
                  {s.correct}/{s.total}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Strengths & Improvements */}
      <div className="results-insights">
        <section className="results-section insight-section">
          <h2 className="results-section-title">💪 Your Strengths</h2>
          <ul className="insight-list">
            {strengths.map((s) => (
              <li key={s} className="insight-item strength">✅ {s}</li>
            ))}
            {strengths.length === 0 && <li className="insight-item">Keep going — you're learning!</li>}
          </ul>
        </section>

        <section className="results-section insight-section">
          <h2 className="results-section-title">📈 Areas to Improve</h2>
          <ul className="insight-list">
            {improvements.map((s) => (
              <li key={s} className="insight-item improvement">🔸 {s}</li>
            ))}
            {improvements.length === 0 && <li className="insight-item strength">✅ Excellent across all categories!</li>}
          </ul>
        </section>
      </div>

      {/* Actions */}
      <div className="results-actions">
        <button id="review-btn" className="btn btn-secondary" onClick={() => setShowReview(!showReview)}>
          {showReview ? '✖ Close Review' : '📋 Review All Questions'}
        </button>
        <button id="play-again-btn" className="btn btn-primary" onClick={restart}>
          🔄 Play Again
        </button>
        <button id="home-btn" className="btn btn-ghost" onClick={() => setScreen('welcome')}>
          🏠 Home
        </button>
      </div>

      {/* Review mode */}
      {showReview && (
        <section className="review-section">
          <h2 className="results-section-title">📋 Question Review</h2>
          <div className="review-list">
            {questions.map((q, idx) => {
              const ua = userAnswers.find((a) => a.questionId === q.id);
              const chosen = ua?.selectedAnswer as AnswerKey | undefined;
              const isCorrect = ua?.isCorrect ?? false;
              return (
                <div key={q.id} className={`review-item ${isCorrect ? 'rev-correct' : 'rev-incorrect'}`}>
                  <div className="review-header">
                    <span className="review-num">Q{q.id}</span>
                    <span className="review-cat">{q.category}</span>
                    <span className={`review-status ${isCorrect ? 'status-c' : 'status-x'}`}>
                      {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>
                  <div className="review-question">{q.question}</div>
                  <div className="review-answers">
                    {(['A', 'B', 'C', 'D'] as AnswerKey[]).map((a) => (
                      <div
                        key={a}
                        className={`review-option
                          ${a === q.correctAnswer ? 'rev-opt-correct' : ''}
                          ${chosen === a && a !== q.correctAnswer ? 'rev-opt-wrong' : ''}
                        `}
                      >
                        <strong>{a}.</strong> {q.options[a]}
                        {a === q.correctAnswer && <span className="rev-tag correct-tag"> ✓ Correct</span>}
                        {chosen === a && a !== q.correctAnswer && <span className="rev-tag wrong-tag"> ✗ Your answer</span>}
                      </div>
                    ))}
                  </div>
                  <div className="review-exp">
                    <strong>💡 Explanation:</strong> {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
