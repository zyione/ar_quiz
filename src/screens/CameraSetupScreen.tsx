import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useQuiz } from '../context/QuizContext';
import { initHandLandmarker, detectFingers } from '../lib/handGesture';
import { drawHandSkeleton } from '../lib/arDrawing';
import { getCameraStream, stopCameraStream } from '../lib/cameraStream';
import type { GestureAnswer } from '../types';

const FINGER_LABELS: Record<string, string> = {
  A: '☝️ 1 finger = A',
  B: '✌️ 2 fingers = B',
  C: '🤟 3 fingers = C',
  D: '🖐️ 4 fingers = D',
};

export default function CameraSetupScreen() {
  const { setScreen, dispatch } = useQuiz();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const [camStatus, setCamStatus] = useState<'idle' | 'requesting' | 'active' | 'denied' | 'error'>('idle');
  const [detectedAnswer, setDetectedAnswer] = useState<GestureAnswer>(null);
  const [fingerCount, setFingerCount] = useState<number | null>(null);
  const [handReady, setHandReady] = useState(false);
  const [testing, setTesting] = useState(false);

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    stopCameraStream();
    if (videoRef.current) videoRef.current.srcObject = null;
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setCamStatus('idle');
    setDetectedAnswer(null);
    setFingerCount(null);
    setHandReady(false);
    setTesting(false);
  }, []);

  const startCamera = useCallback(async () => {
    setCamStatus('requesting');
    try {
      const stream = await getCameraStream();

      if (videoRef.current) {
        if (videoRef.current.srcObject !== stream) {
          videoRef.current.srcObject = stream;
        }
        await videoRef.current.play().catch(() => {});
      }

      setCamStatus('active');

      // Auto-start hand tracking model on setup screen
      const ok = await initHandLandmarker();
      setHandReady(ok);
      setTesting(true);

      let lastAnswer: GestureAnswer = null;
      let stableCount = 0;

      function loop() {
        if (!videoRef.current || !ok) {
          rafRef.current = requestAnimationFrame(loop);
          return;
        }
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (canvas && video.videoWidth > 0 && video.videoHeight > 0) {
          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
          }
        }

        const result = detectFingers(video);

        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            if (result.landmarks && result.landmarks.length > 0) {
              drawHandSkeleton(ctx, result.landmarks, canvas.width, canvas.height, !!result.answer);
            } else {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
          }
        }

        if (result.answer === lastAnswer) {
          stableCount++;
        } else {
          lastAnswer = result.answer;
          stableCount = 0;
        }

        if (stableCount >= 4) {
          setDetectedAnswer(result.answer);
          setFingerCount(result.fingerCount);
        }

        rafRef.current = requestAnimationFrame(loop);
      }

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(loop);
    } catch (err: any) {
      console.error('Setup camera error:', err);
      if (err.name === 'NotAllowedError') setCamStatus('denied');
      else setCamStatus('error');
    }
  }, []);

  // Auto-start camera when setup screen mounts
  useEffect(() => {
    startCamera();
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [startCamera]);

  const handleContinue = () => {
    // Keep camera stream alive so QuizScreen starts seamlessly!
    cancelAnimationFrame(rafRef.current);
    setScreen('quiz');
  };

  const handleSkip = () => {
    stopCamera();
    dispatch({ type: 'SKIP_CAMERA_SETUP' });
  };

  return (
    <div className="camera-setup-screen">
      <div className="setup-header">
        <button className="btn btn-ghost back-btn" onClick={() => setScreen('welcome')}>
          ← Back
        </button>
        <h1 className="setup-title">📷 Camera Setup</h1>
        <p className="setup-subtitle">
          Position your webcam so your hand is visible. Hold up fingers to test gestures.
        </p>
      </div>

      <div className="setup-content">
        {/* Camera Preview Panel */}
        <div className="camera-panel">
          <div className={`camera-frame ${camStatus === 'active' ? 'active' : ''} ${detectedAnswer ? 'gesture-detected' : ''}`}>
            {/* Video element ALWAYS mounted to guarantee ref is never null */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="camera-video"
              style={{
                transform: 'scaleX(-1)',
                display: camStatus === 'active' ? 'block' : 'none',
              }}
            />
            <canvas
              ref={canvasRef}
              className="ar-canvas-overlay"
              style={{
                transform: 'scaleX(-1)',
                display: camStatus === 'active' ? 'block' : 'none',
              }}
            />

            {camStatus !== 'active' && (
              <div className="camera-placeholder">
                {camStatus === 'requesting' && <div className="camera-spinner">⏳ Requesting camera…</div>}
                {camStatus === 'denied' && (
                  <div className="camera-error">
                    <div className="error-icon">🚫</div>
                    <p>Camera permission denied.</p>
                    <p className="error-hint">Please allow camera access in your browser settings, then refresh.</p>
                  </div>
                )}
                {camStatus === 'error' && (
                  <div className="camera-error">
                    <div className="error-icon">⚠️</div>
                    <p>Camera unavailable.</p>
                    <p className="error-hint">Check that no other app is using your camera.</p>
                  </div>
                )}
                {camStatus === 'idle' && (
                  <div className="camera-idle">
                    <div className="camera-idle-icon">📷</div>
                    <p>Camera not started</p>
                  </div>
                )}
              </div>
            )}

            {/* Gesture overlay */}
            {camStatus === 'active' && (
              <div className="gesture-overlay">
                <div className={`gesture-badge ${detectedAnswer ? 'answer-' + detectedAnswer : ''}`}>
                  {detectedAnswer
                    ? `✅ ${FINGER_LABELS[detectedAnswer]}`
                    : fingerCount !== null && fingerCount > 0
                    ? `Fingers: ${fingerCount}`
                    : '👋 Show your hand'}
                </div>
              </div>
            )}
          </div>

          {/* Camera Controls */}
          <div className="camera-controls">
            {camStatus !== 'active' && (
              <button id="start-camera-btn" className="btn btn-primary" onClick={startCamera}>
                📷 Start Camera
              </button>
            )}
            {camStatus === 'active' && (
              <button className="btn btn-ghost" onClick={stopCamera}>
                🔴 Stop Camera
              </button>
            )}
          </div>
        </div>

        {/* Gesture Guide */}
        <div className="setup-guide">
          <h2 className="guide-title">Gesture Guide</h2>
          <div className="guide-list">
            {(['A', 'B', 'C', 'D'] as const).map((letter, i) => (
              <div
                key={letter}
                className={`guide-item ${detectedAnswer === letter ? 'highlighted' : ''}`}
              >
                <div className="guide-finger">{['☝️', '✌️', '🤟', '🖐️'][i]}</div>
                <div className="guide-info">
                  <span className="guide-count">{i + 1} Finger{i > 0 ? 's' : ''}</span>
                  <span className="guide-answer-label">= Answer <strong>{letter}</strong></span>
                </div>
                <div className={`guide-indicator ${detectedAnswer === letter ? 'active' : ''}`} />
              </div>
            ))}
          </div>

          {!handReady && testing && (
            <div className="model-loading">⏳ Loading hand tracking model…</div>
          )}

          <div className="guide-tips">
            <h3>Tips for Best Results</h3>
            <ul>
              <li>✅ Ensure good lighting on your hand</li>
              <li>✅ Keep your hand in the center of the frame</li>
              <li>✅ Hold fingers clearly spread apart</li>
              <li>✅ Keep your background relatively plain</li>
            </ul>
          </div>

          <div className="setup-actions">
            <button
              id="continue-with-camera-btn"
              className="btn btn-primary"
              onClick={handleContinue}
              disabled={camStatus !== 'active'}
            >
              ✅ Continue with Camera
            </button>
            <button id="skip-camera-btn" className="btn btn-secondary" onClick={handleSkip}>
              ⌨️ Skip — Answer Manually
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
