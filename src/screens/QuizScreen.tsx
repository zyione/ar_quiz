import React, { useEffect, useCallback } from 'react';
import { useQuiz } from '../context/QuizContext';
import QuestionCard from '../components/QuestionCard';
import CameraPanel from '../components/CameraPanel';
import QuestionEditorModal from '../components/QuestionEditorModal';
import { playCorrectSound, playIncorrectSound, triggerConfetti } from '../lib/effects';
import type { AnswerKey } from '../types';

export default function QuizScreen() {
  const {
    state,
    setPendingAnswer,
    setDwell,
    confirmAnswer,
    nextQuestion,
    jumpRandomQuestion,
    toggleSound,
    toggleEditor,
  } = useQuiz();

  const {
    questions,
    currentQuestionIndex,
    score,
    pendingAnswer,
    confirmedAnswer,
    candidateAnswer,
    dwellProgress,
    isAnswerLocked,
    lastFeedbackCorrect,
    cameraEnabled,
    soundEnabled,
    screen,
  } = state;

  const currentQuestion = questions[currentQuestionIndex] || questions[0];
  const totalQuestions = questions.length;
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  useEffect(() => {
    const handleFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFs);
    return () => document.removeEventListener('fullscreenchange', handleFs);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Sound and confetti feedback trigger on lock
  useEffect(() => {
    if (isAnswerLocked && lastFeedbackCorrect !== null) {
      if (lastFeedbackCorrect) {
        if (soundEnabled) playCorrectSound();
        triggerConfetti();
      } else {
        if (soundEnabled) playIncorrectSound();
      }
    }
  }, [isAnswerLocked, lastFeedbackCorrect, soundEnabled]);

  // Keyboard shortcut handlers (1/2/3/4 or A/B/C/D, Enter to confirm, R for random, F for fullscreen)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (screen === 'feedback') {
        if (e.key === 'Enter' || e.key === ' ') {
          nextQuestion();
        }
        return;
      }

      if (e.key === 'r' || e.key === 'R') {
        jumpRandomQuestion();
        return;
      }

      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
        return;
      }

      if (isAnswerLocked) return;

      if (e.key === 'a' || e.key === 'A' || e.key === '1') setPendingAnswer('A');
      if (e.key === 'b' || e.key === 'B' || e.key === '2') setPendingAnswer('B');
      if (e.key === 'c' || e.key === 'C' || e.key === '3') setPendingAnswer('C');
      if (e.key === 'd' || e.key === 'D' || e.key === '4') setPendingAnswer('D');
      if (e.key === 'Enter' && (pendingAnswer || candidateAnswer)) {
        confirmAnswer();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswerLocked, screen, pendingAnswer, candidateAnswer, setPendingAnswer, confirmAnswer, nextQuestion, jumpRandomQuestion]);

  // Dwell auto-locking callback
  const handleDwellComplete = useCallback(
    (answer: AnswerKey) => {
      if (!isAnswerLocked) {
        setPendingAnswer(answer);
        confirmAnswer();
      }
    },
    [isAnswerLocked, setPendingAnswer, confirmAnswer]
  );

  const handleDwellProgress = useCallback(
    (candidate: AnswerKey | null, progress: number) => {
      setDwell(candidate, progress);
    },
    [setDwell]
  );

  return (
    <div className="ar-quiz-page">
      {/* Top HUD Bar (Matches screenshot: QUESTION: 4/10, SCORE: 10, TV controls) */}
      <header className="ar-top-hud">
        <div className="hud-left">
          <div className="hud-badge question-badge">
            QUESTION: {currentQuestionIndex + 1}/{totalQuestions}
          </div>
          <button
            className="hud-icon-btn random-q-btn"
            onClick={jumpRandomQuestion}
            title="Jump to a random question for testing (Hotkey: R)"
          >
            🔀 Random Question
          </button>
        </div>

        <div className="hud-center">
          <div className="hud-title-compact">AR Vision Quiz</div>
        </div>

        <div className="hud-right">
          <div className="hud-badge score-badge">SCORE: {score}</div>
          <button
            className="hud-icon-btn"
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            aria-label="Toggle sound"
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <button
            className="hud-icon-btn fullscreen-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter TV Fullscreen (Hotkey: F)'}
          >
            {isFullscreen ? '⤦ Normal' : '⛶ Fullscreen'}
          </button>
          <button
            className="hud-icon-btn editor-trigger-btn"
            onClick={() => toggleEditor(true)}
            title="Manage Questions & Packs"
            aria-label="Manage questions"
          >
            ⚙️ Questions
          </button>
        </div>
      </header>

      {/* Main Two-Column Viewport (Matches reference layout) */}
      <main className="ar-quiz-grid">
        {/* Left: Camera with AR Overlay Canvas */}
        <section className="ar-grid-left">
          <CameraPanel
            onDwellProgress={handleDwellProgress}
            onDwellComplete={handleDwellComplete}
            lockedAnswer={confirmedAnswer}
            cameraEnabled={cameraEnabled}
          />
        </section>

        {/* Right: Question prompt + Stacked Option Bars */}
        <section className="ar-grid-right">
          <QuestionCard
            question={currentQuestion}
            selectedAnswer={pendingAnswer}
            confirmedAnswer={confirmedAnswer}
            candidateAnswer={candidateAnswer}
            dwellProgress={dwellProgress}
            isLocked={isAnswerLocked}
            onSelect={(ans) => {
              setPendingAnswer(ans);
              confirmAnswer();
            }}
          />

          {/* Feedback Bar when answer is locked */}
          {isAnswerLocked && (
            <div className={`ar-answer-feedback-banner ${lastFeedbackCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
              <div className="feedback-banner-header">
                <span className="feedback-status-icon">
                  {lastFeedbackCorrect ? '🎉 Correct!' : '❌ Not quite!'}
                </span>
                <span className="feedback-points">
                  {lastFeedbackCorrect ? '+10 Points' : '+0 Points'}
                </span>
              </div>
              <p className="feedback-explanation">{currentQuestion.explanation}</p>
              <button
                className="btn btn-primary feedback-next-btn"
                onClick={nextQuestion}
                autoFocus
              >
                {currentQuestionIndex + 1 >= totalQuestions ? 'View Results 🏆' : 'Next Question ➜'}
              </button>
            </div>
          )}
        </section>
      </main>

      {/* In-App Question Editor & Pack Switcher Modal */}
      <QuestionEditorModal />
    </div>
  );
}
