import React from 'react';
import { useQuiz } from '../context/QuizContext';
import QuestionEditorModal from '../components/QuestionEditorModal';

const GESTURE_MAP = [
  { fingers: '☝️', label: '1 Finger', answer: 'A', action: 'Answer A' },
  { fingers: '✌️', label: '2 Fingers', answer: 'B', action: 'Answer B' },
  { fingers: '🤟', label: '3 Fingers', answer: 'C', action: 'Answer C' },
  { fingers: '🖖', label: '4 Fingers', answer: 'D', action: 'Answer D' },
  { fingers: '🖐️', label: '5 Fingers / ✊', answer: 'Next ➜', action: 'Next Question' },
];

export default function WelcomeScreen() {
  const { state, setScreen, toggleEditor } = useQuiz();
  const { questions, activePackId } = state;

  const categories = Array.from(new Set(questions.map((q) => q.category).filter(Boolean)));

  return (
    <div className="welcome-screen">
      {/* Hero */}
      <div className="welcome-hero">
        <div className="hero-badge">✨ AR VISION QUIZ</div>
        <h1 className="hero-title">
          Interactive AR Quiz.<br />
          <span className="gradient-text">Real-Time Hand Tracking.</span><br />
          Fully Local & Offline.
        </h1>
        <p className="hero-subtitle">
          Point or show finger numbers to your camera to answer questions with instant AR feedback.<br />
          100% private, runs entirely on your device with no internet connection required.
        </p>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="stat-number">{questions.length}</span>
            <span className="stat-label">Questions</span>
          </div>
          <div className="stat-divider" />
          <div className="hero-stat">
            <span className="stat-number">{categories.length || 1}</span>
            <span className="stat-label">Categories</span>
          </div>
          <div className="stat-divider" />
          <div className="hero-stat">
            <span className="stat-number">{questions.length * 10}</span>
            <span className="stat-label">Max Score</span>
          </div>
        </div>
        <div className="hero-buttons">
          <button
            id="start-challenge-btn"
            className="btn btn-primary btn-lg"
            onClick={() => setScreen('camera-setup')}
          >
            🚀 Start AR Quiz
          </button>
          <button
            id="play-without-camera-btn"
            className="btn btn-secondary btn-lg"
            onClick={() => setScreen('quiz')}
          >
            ⌨️ Play Directly
          </button>
          <button
            id="welcome-manage-questions-btn"
            className="btn btn-outline btn-lg"
            onClick={() => toggleEditor(true)}
          >
            ⚙️ Manage Questions ({activePackId})
          </button>
        </div>
      </div>
      <QuestionEditorModal />

      {/* How to Play */}
      <section className="how-to-play">
        <h2 className="section-title">🎮 How to Play</h2>
        <p className="section-subtitle">
          Show your webcam the correct number of fingers to select your answer — or use the keyboard buttons as a fallback.
        </p>
        <div className="gesture-grid">
          {GESTURE_MAP.map((g) => (
            <div key={g.label} className={`gesture-card ${g.answer.includes('Next') ? 'gesture-card-fist' : ''}`}>
              <div className="gesture-emoji">{g.fingers}</div>
              <div className="gesture-label">{g.label}</div>
              <div className="gesture-answer">{g.action}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <h2 className="section-title">📚 Active Categories ({categories.length})</h2>
        <div className="categories-grid">
          {categories.map((catName) => (
            <div key={catName} className="category-pill">
              <span className="category-icon">📖</span>
              <span className="category-name">{catName}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Performance Levels */}
      <section className="levels-section">
        <h2 className="section-title">🏅 Performance Levels</h2>
        <div className="levels-grid">
          <div className="level-card gold">
            <div className="level-icon">👑</div>
            <div className="level-name">AI Literacy Champion</div>
            <div className="level-range">36–40 correct</div>
          </div>
          <div className="level-card silver">
            <div className="level-icon">🥇</div>
            <div className="level-name">AI-Savvy Professional</div>
            <div className="level-range">30–35 correct</div>
          </div>
          <div className="level-card bronze">
            <div className="level-icon">🥈</div>
            <div className="level-name">AI Learner</div>
            <div className="level-range">20–29 correct</div>
          </div>
          <div className="level-card base">
            <div className="level-icon">🌱</div>
            <div className="level-name">AI Explorer</div>
            <div className="level-range">0–19 correct</div>
          </div>
        </div>
      </section>

      {/* Privacy Notice */}
      <section className="privacy-notice">
        <div className="privacy-card">
          <div className="privacy-icon">🔒</div>
          <div className="privacy-content">
            <h3>Camera Privacy Notice</h3>
            <p>
              Your camera is used <strong>only</strong> for real-time hand gesture detection to select answers.
              No video is recorded, stored, or transmitted. All processing happens locally in your browser.
              You can disable the camera at any time and answer using on-screen buttons.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
