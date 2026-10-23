import React, { useRef, useEffect, useState, useCallback } from 'react';
import { initHandLandmarker, detectFingers } from '../lib/handGesture';
import { drawHandSkeleton } from '../lib/arDrawing';
import { getCameraStream, stopCameraStream } from '../lib/cameraStream';
import type { GestureAnswer, AnswerKey } from '../types';

const DWELL_DURATION_MS = 1500; // 1.5 seconds dwell hold
const ADVANCE_DWELL_DURATION_MS = 850; // 0.85s hold for 5 fingers or closed fist to advance
const ADVANCE_LOCK_COOLDOWN_MS = 400; // 0.4s cooldown after answer confirmation
const GRACE_PERIOD_MS = 250; // Grace period for laptop webcam drops
const ANSWER_ICONS: Record<AnswerKey, string> = { A: '☝️ 1', B: '✌️ 2', C: '🤟 3', D: '🖐️ 4' };

interface Props {
  onDwellProgress: (candidate: AnswerKey | null, progress: number) => void;
  onDwellComplete: (answer: AnswerKey) => void;
  onFistAdvance?: () => void;
  lockedAnswer: AnswerKey | null;
  cameraEnabled: boolean;
}

export default function CameraPanel({
  onDwellProgress,
  onDwellComplete,
  onFistAdvance,
  lockedAnswer,
  cameraEnabled,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  // Stable callback refs so re-renders NEVER recreate loop or re-trigger camera setup
  const onDwellProgressRef = useRef(onDwellProgress);
  onDwellProgressRef.current = onDwellProgress;

  const onDwellCompleteRef = useRef(onDwellComplete);
  onDwellCompleteRef.current = onDwellComplete;

  const onAdvanceRef = useRef(onFistAdvance);
  onAdvanceRef.current = onFistAdvance;

  // Dwell state tracking
  const candidateRef = useRef<AnswerKey | null>(null);
  const dwellStartRef = useRef<number | null>(null);
  const lockedRef = useRef<boolean>(false);
  const lastSeenTimeRef = useRef<number>(0);

  // Advance gesture (5 fingers or fist) dwell tracking
  const advanceStartRef = useRef<number | null>(null);
  const lockTimeRef = useRef<number>(0);
  const advanceTriggeredRef = useRef<boolean>(false);

  const [camStatus, setCamStatus] = useState<'idle' | 'active' | 'denied' | 'error' | 'off'>('idle');
  const [detectedAnswer, setDetectedAnswer] = useState<GestureAnswer>(null);
  const [detectedFingers, setDetectedFingers] = useState<number | null>(null);
  const [dwellPercent, setDwellPercent] = useState<number>(0);
  const [advancePercent, setAdvancePercent] = useState<number>(0);
  const [advanceType, setAdvanceType] = useState<'five' | 'fist' | null>(null);
  const [handReady, setHandReady] = useState(false);
  const [camEnabled, setCamEnabled] = useState(cameraEnabled);

  // Handle question change / lock change without touching the camera stream
  useEffect(() => {
    lockedRef.current = !!lockedAnswer;
    if (lockedAnswer) {
      candidateRef.current = null;
      dwellStartRef.current = null;
      setDwellPercent(0);
      onDwellProgressRef.current(null, 0);
      lockTimeRef.current = performance.now();
      advanceStartRef.current = null;
      advanceTriggeredRef.current = false;
      setAdvancePercent(0);
      setAdvanceType(null);
    } else {
      // Unlocked for the next question: reset candidate and dwell
      candidateRef.current = null;
      dwellStartRef.current = null;
      setDwellPercent(0);
      setDetectedAnswer(null);
      onDwellProgressRef.current(null, 0);
      advanceStartRef.current = null;
      advanceTriggeredRef.current = false;
      setAdvancePercent(0);
      setAdvanceType(null);
    }
  }, [lockedAnswer]);

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    stopCameraStream();
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setCamStatus('off');
    setDetectedAnswer(null);
    setDetectedFingers(null);
    setDwellPercent(0);
    onDwellProgressRef.current(null, 0);
  }, []);

  const startCamera = useCallback(async () => {
    if (!camEnabled) return;
    setCamStatus('idle');

    try {
      const stream = await getCameraStream();

      if (videoRef.current) {
        if (videoRef.current.srcObject !== stream) {
          videoRef.current.srcObject = stream;
        }
        await videoRef.current.play().catch(() => {});
      }

      setCamStatus('active');

      // Initialize local offline Hand Landmarker (cached after first run)
      const ok = await initHandLandmarker();
      setHandReady(ok);

      // Animation detection loop (runs continuously across questions)
      function loop() {
        if (!videoRef.current || videoRef.current.readyState < 2) {
          rafRef.current = requestAnimationFrame(loop);
          return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Sync canvas resolution with video dimensions
        if (canvas && video.videoWidth > 0 && video.videoHeight > 0) {
          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
          }
        }

        // Run hand detection
        const result = detectFingers(video);
        setDetectedFingers(result.fingerCount);
        const isFive = !!result.isFiveFingers || result.fingerCount === 5;
        const isFist = !!result.isFist;
        const isAdvanceGesture = isFive || isFist;

        // Draw AR Skeleton directly on overlay canvas
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            if (result.landmarks && result.landmarks.length > 0) {
              const isHoldingAdvance = !!(lockedRef.current && isAdvanceGesture);
              drawHandSkeleton(ctx, result.landmarks, canvas.width, canvas.height, !!result.answer, isHoldingAdvance);
            } else {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
          }
        }

        const now = performance.now();

        // Process Dwell Auto-Lock Logic (with anti-jitter grace period for laptop webcams)
        if (!lockedRef.current) {
          const currentAns = result.answer;

          if (currentAns) {
            lastSeenTimeRef.current = now;
            setDetectedAnswer(currentAns);

            if (candidateRef.current === currentAns && dwellStartRef.current !== null) {
              const elapsed = now - dwellStartRef.current;
              const progress = Math.min(1, elapsed / DWELL_DURATION_MS);
              setDwellPercent(progress);
              onDwellProgressRef.current(currentAns, progress);

              if (progress >= 1 && !lockedRef.current) {
                lockedRef.current = true;
                onDwellCompleteRef.current(currentAns);
                dwellStartRef.current = null;
                candidateRef.current = null;
                setDwellPercent(0);
              }
            } else {
              // Started a new gesture
              candidateRef.current = currentAns;
              dwellStartRef.current = now;
              setDwellPercent(0.05);
              onDwellProgressRef.current(currentAns, 0.05);
            }
          } else {
            // Hand momentarily lost or blurred - apply grace period
            if (now - lastSeenTimeRef.current > GRACE_PERIOD_MS) {
              setDetectedAnswer(null);
              if (candidateRef.current !== null) {
                candidateRef.current = null;
                dwellStartRef.current = null;
                setDwellPercent(0);
                onDwellProgressRef.current(null, 0);
              }
            }
          }
        } else {
          // Question is locked & feedback showing: Process 5 fingers or closed fist to Advance!
          const canCheckAdvance = now - lockTimeRef.current > ADVANCE_LOCK_COOLDOWN_MS;
          if (canCheckAdvance && isAdvanceGesture && onAdvanceRef.current && !advanceTriggeredRef.current) {
            lastSeenTimeRef.current = now;
            const currentType = isFive ? 'five' : 'fist';
            setAdvanceType(currentType);

            if (advanceStartRef.current !== null) {
              const elapsed = now - advanceStartRef.current;
              const progress = Math.min(1, elapsed / ADVANCE_DWELL_DURATION_MS);
              setAdvancePercent(progress);

              if (progress >= 1 && !advanceTriggeredRef.current) {
                advanceTriggeredRef.current = true;
                advanceStartRef.current = null;
                setAdvancePercent(0);
                setAdvanceType(null);
                onAdvanceRef.current();
              }
            } else {
              // First frame of holding 5 fingers or fist
              advanceStartRef.current = now;
              setAdvancePercent(0.08);
            }
          } else {
            // Gesture released or within safety cooldown
            if (now - lastSeenTimeRef.current > GRACE_PERIOD_MS) {
              if (advanceStartRef.current !== null) {
                advanceStartRef.current = null;
                setAdvancePercent(0);
                setAdvanceType(null);
              }
            }
          }
        }

        rafRef.current = requestAnimationFrame(loop);
      }

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(loop);
    } catch (err: any) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError') setCamStatus('denied');
      else setCamStatus('error');
    }
  }, [camEnabled]);

  useEffect(() => {
    if (camEnabled) {
      startCamera();
    }
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [camEnabled, startCamera]);

  const toggleCam = () => {
    if (camEnabled) {
      stopCamera();
      setCamEnabled(false);
    } else {
      setCamEnabled(true);
    }
  };

  return (
    <div className={`ar-camera-container ${lockedAnswer ? 'locked' : ''}`}>
      <div className="camera-view-wrapper">
        {/* Video element ALWAYS mounted to guarantee ref is never null */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="ar-video-feed"
          style={{
            transform: 'scaleX(-1)',
            display: camEnabled && camStatus === 'active' ? 'block' : 'none',
          }}
        />

        {/* Mirrored AR Canvas overlay drawing joints & skeleton */}
        <canvas
          ref={canvasRef}
          className="ar-canvas-overlay"
          style={{
            transform: 'scaleX(-1)',
            display: camEnabled && camStatus === 'active' ? 'block' : 'none',
          }}
        />

        {/* Camera HUD Overlays */}
        {camEnabled && camStatus === 'active' && (
          <>
            <div className="camera-ar-hud">
              {lockedAnswer ? (
                <div className={`ar-dwell-pill fist-pill ${advancePercent > 0 ? 'fist-active' : 'fist-idle'}`}>
                  <span className="ar-pill-icon">{advanceType === 'fist' ? '✊' : '🖐️'}</span>
                  <span className="ar-pill-text">
                    {advancePercent > 0
                      ? `${advanceType === 'fist' ? 'Fist' : '5 Fingers'} Advancing... ${Math.round(advancePercent * 100)}%`
                      : 'Show 5 Fingers 🖐️ to Advance'}
                  </span>
                  {advancePercent > 0 && (
                    <div
                      className="ar-pill-radial-bar fist-radial-bar"
                      style={{ width: `${Math.round(advancePercent * 100)}%` }}
                    />
                  )}
                </div>
              ) : detectedAnswer ? (
                <div className="ar-dwell-pill active">
                  <span className="ar-pill-icon">⏱</span>
                  <span className="ar-pill-text">
                    Option {detectedAnswer} ({Math.round(dwellPercent * 100)}%)
                  </span>
                  <div
                    className="ar-pill-radial-bar"
                    style={{ width: `${Math.round(dwellPercent * 100)}%` }}
                  />
                </div>
              ) : (
                <div className="ar-dwell-pill idle">
                  <span className="ar-pill-icon">👋</span>
                  <span className="ar-pill-text">
                    {detectedFingers !== null && detectedFingers > 0
                      ? `${detectedFingers} Finger${detectedFingers > 1 ? 's' : ''}`
                      : 'Show Hand 1-4'}
                  </span>
                </div>
              )}
            </div>

            {!handReady && (
              <div className="ar-model-loader-badge">
                <span className="spinner-dot" /> Loading Hand Model...
              </div>
            )}
          </>
        )}

        {/* Offline / Placeholder state when camera is not active */}
        {(!camEnabled || camStatus !== 'active') && (
          <div className="camera-offline-placeholder">
            <div className="offline-icon">📷</div>
            <p className="offline-title">
              {camStatus === 'denied'
                ? 'Camera Access Denied'
                : camStatus === 'error'
                ? 'Camera Error'
                : !camEnabled
                ? 'Camera Turned Off'
                : 'Starting Camera...'}
            </p>
            <p className="offline-subtext">You can still answer by clicking the option cards</p>
            <button className="btn btn-sm btn-outline" onClick={toggleCam}>
              {camEnabled ? 'Disable Camera' : 'Enable Camera'}
            </button>
          </div>
        )}
      </div>

      {/* Mini gesture bar below camera */}
      <div className="ar-finger-legend">
        {lockedAnswer ? (
          <div className={`legend-fist-banner ${advancePercent > 0 ? 'fist-holding' : ''}`}>
            <span className="legend-fist-emoji">🖐️</span>
            <span className="legend-fist-label">
              <strong>Open Hand (5 Fingers 🖐️)</strong> or <strong>Closed Fist (✊)</strong> to advance
            </span>
          </div>
        ) : (
          (['A', 'B', 'C', 'D'] as AnswerKey[]).map((k) => {
            const isCurrent = detectedAnswer === k && !lockedAnswer;
            return (
              <div
                key={k}
                className={`legend-item ${isCurrent ? 'legend-item-active' : ''}`}
              >
                <span className="legend-emoji">{ANSWER_ICONS[k]}</span>
                <span className="legend-label">Option {k}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
