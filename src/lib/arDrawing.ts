import type { HandLandmarkPoint } from '../types';
import { getFingerExtensionStates } from './handGesture';

// Standard 21 Hand Landmark Connections in MediaPipe
const HAND_CONNECTIONS: [number, number][] = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle
  [0, 9], [9, 10], [10, 11], [11, 12],
  // Ring
  [0, 13], [13, 14], [14, 15], [15, 16],
  // Pinky
  [0, 17], [17, 18], [18, 19], [19, 20],
  // Palm Base
  [5, 9], [9, 13], [13, 17],
];

const FINGERTIP_INDICES = [4, 8, 12, 16, 20];

export function drawHandSkeleton(
  ctx: CanvasRenderingContext2D,
  landmarks: HandLandmarkPoint[],
  width: number,
  height: number,
  isDetectingActive: boolean = false,
  isFist: boolean = false
) {
  if (!landmarks || landmarks.length < 21) return;

  const fingerStates = getFingerExtensionStates(landmarks);

  ctx.save();
  ctx.clearRect(0, 0, width, height);

  // 1. Draw glowing skeleton connection lines
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Outer glow pass
  const glowColor = isFist ? '#b5cda0' : isDetectingActive ? '#d2b579' : '#c5a46a';
  const strokeGlow = isFist ? 'rgba(181, 205, 160, 0.85)' : isDetectingActive ? 'rgba(210, 181, 121, 0.75)' : 'rgba(197, 164, 106, 0.6)';

  ctx.shadowBlur = isFist ? 18 : isDetectingActive ? 14 : 8;
  ctx.shadowColor = glowColor;
  ctx.strokeStyle = strokeGlow;
  ctx.lineWidth = isFist ? 5 : 4;

  ctx.beginPath();
  for (const [startIdx, endIdx] of HAND_CONNECTIONS) {
    const start = landmarks[startIdx];
    const end = landmarks[endIdx];
    ctx.moveTo(start.x * width, start.y * height);
    ctx.lineTo(end.x * width, end.y * height);
  }
  ctx.stroke();

  // Core bright neon line pass
  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#fff4d8';
  ctx.lineWidth = 2;

  ctx.beginPath();
  for (const [startIdx, endIdx] of HAND_CONNECTIONS) {
    const start = landmarks[startIdx];
    const end = landmarks[endIdx];
    ctx.moveTo(start.x * width, start.y * height);
    ctx.lineTo(end.x * width, end.y * height);
  }
  ctx.stroke();

  // 2. Draw Hand Joint Nodes
  for (let i = 0; i < landmarks.length; i++) {
    const pt = landmarks[i];
    const x = pt.x * width;
    const y = pt.y * height;
    const isTip = FINGERTIP_INDICES.includes(i);
    const tipIndex = FINGERTIP_INDICES.indexOf(i);
    const isExtendedTip = isTip && tipIndex >= 0 && fingerStates[tipIndex];

    ctx.save();
    if (isExtendedTip) {
      // Extended fingertip with pulsating neon halo
      ctx.shadowBlur = 16;
      ctx.shadowColor = '#ddc48d';

      // Outer ring
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(221, 196, 141, 0.35)';
      ctx.fill();

      // Middle ring
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = '#ddc48d';
      ctx.fill();

      // Core white center
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = '#fff4d8';
      ctx.fill();
    } else {
      // Normal joint
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#d2b579';
      ctx.beginPath();
      ctx.arc(x, y, isTip ? 4 : 3, 0, 2 * Math.PI);
      ctx.fillStyle = isTip ? '#e9d7af' : 'rgba(255, 255, 255, 0.9)';
      ctx.fill();
    }
    ctx.restore();
  }

  ctx.restore();
}
