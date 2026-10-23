import React, { useRef, useEffect, useState, useCallback } from 'react';
import { initHandLandmarker, detectFingers } from '../lib/handGesture';
import { drawHandSkeleton } from '../lib/arDrawing';
import type { GestureAnswer, AnswerKey } from '../types';

const DWELL_DURATION_MS = 1500; // 1.5 seconds dwell hold
const GRACE_PERIOD_MS = 250; // Grace period for laptop webcam drops
const ANSWER_ICONS: Record<AnswerKey, string> = { A: '☝️ 1', B: '✌️ 2', C: '🤟 3', D: '🖐️ 4' };

interface Props {
  onDwellProgress: (candidate: AnswerKey | null, progress: number) => void;
  onDwellComplete: (answer: AnswerKey) => void;
  lockedAnswer: AnswerKey | null;
  cameraEnabled: boolean;
}

export default function CameraPanel({
  onDwellProgress,
  onDwellComplete,
  lockedAnswer,
  cameraEnabled,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);

  // Dwell state tracking
  const candidateRef = useRef<AnswerKey | null>(null);
  const dwellStartRef = useRef<number | null>(null);
  const lockedRef = useRef<boolean>(false);
  const lastSeenTimeRef = useRef<number>(0);

  const [camStatus, setCamStatus] = useState<'idle' | 'active' | 'denied' | 'error' | 'off'>('idle');
  const [detectedAnswer, setDetectedAnswer] = useState<GestureAnswer>(null);
  const [detectedFingers, setDetectedFingers] = useState<number | null>(null);
  const [dwellPercent, setDwellPercent] = useState<number>(0);
  const [handReady, setHandReady] = useState(false);
  const [camEnabled, setCamEnabled] = useState(cameraEnabled);

  useEffect(() => {
    lockedRef.current = !!lockedAnswer;
    if (lockedAnswer) {
      candidateRef.current = null;
      dwellStartRef.current = null;
      setDwellPercent(0);
      onDwellProgress(null, 0);
    }
  }, [lockedAnswer, onDwellProgress]);

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setCamStatus('off');
    setDetectedAnswer(null);
    setDetectedFingers(null);
    setDwellPercent(0);
    onDwellProgress(null, 0);
  }, [onDwellProgress]);

  const startCamera = useCallback(async () => {
    if (!camEnabled) return;
    setCamStatus('idle');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCamStatus('active');

      // Initialize local offline Hand Landmarker
      const ok = await initHandLandmarker();
      setHandReady(ok);

      // Animation detection loop
      function loop() {
        if (!videoRef.current || videoRef.current.readyState < 2) {
          rafRef.current = requestAnimationFrame(loop);
          return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Sync canvas resolution with video
        if (canvas && (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight)) {
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
        }

        // Run hand detection
        const result = detectFingers(video);
        setDetectedFingers(result.fingerCount);

        // Draw AR Skeleton directly on overlay canvas
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

        // Process Dwell Auto-Lock Logic (with anti-jitter grace period for laptop webcams)
        if (!lockedRef.current) {
          const currentAns = result.answer;
          const now = performance.now();

          if (currentAns) {
            lastSeenTimeRef.current = now;
            setDetectedAnswer(currentAns);

            if (candidateRef.current === currentAns && dwellStartRef.current !== null) {
              const elapsed = now - dwellStartRef.current;
              const progress = Math.min(1, elapsed / DWELL_DURATION_MS);
              setDwellPercent(progress);
              onDwellProgress(currentAns, progress);

              if (progress >= 1 && !lockedRef.current) {
                lockedRef.current = true;
                onDwellComplete(currentAns);
                dwellStartRef.current = null;
                candidateRef.current = null;
                setDwellPercent(0);
              }
            } else {
              // Started a new gesture
              candidateRef.current = currentAns;
              dwellStartRef.current = now;
              setDwellPercent(0.05);
              onDwellProgress(currentAns, 0.05);
            }
          } else {
            // Hand momentarily lost or blurred - apply grace period
            if (now - lastSeenTimeRef.current > GRACE_PERIOD_MS) {
              setDetectedAnswer(null);
              if (candidateRef.current !== null) {
                candidateRef.current = null;
                dwellStartRef.current = null;
                setDwellPercent(0);
                onDwellProgress(null, 0);
              }
            }
          }
        }

        rafRef.current = requestAnimationFrame(loop);
      }

      rafRef.current = requestAnimationFrame(loop);
    } catch (err: any) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError') setCamStatus('denied');
      else setCamStatus('error');
    }
  }, [camEnabled, onDwellProgress, onDwellComplete]);

  useEffect(() => {
    if (camEnabled) startCamera();
    return () => {
      stopCamera();
    };
  }, [camEnabled, startCamera, stopCamera]);

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
        {camEnabled && camStatus === 'active' ? (
          <>
            {/* Mirrored video feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="ar-video-feed"
              style={{ transform: 'scaleX(-1)' }}
            />
            {/* Mirrored AR Canvas overlay drawing joints & skeleton */}
            <canvas
              ref={canvasRef}
              className="ar-canvas-overlay"
              style={{ transform: 'scaleX(-1)' }}
            />

            {/* In-camera floating AR badge (matches screenshot top-left '⏱ 3s' pill) */}
            <div className="camera-ar-hud">
              {detectedAnswer && !lockedAnswer ? (
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

            {/* Model loading overlay indicator */}
            {!handReady && (
              <div className="ar-model-loader-badge">
                <span className="spinner-dot" /> Loading Hand Model...
              </div>
            )}
          </>
        ) : (
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
        {(['A', 'B', 'C', 'D'] as AnswerKey[]).map((k) => {
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
        })}
      </div>
    </div>
  );
}
