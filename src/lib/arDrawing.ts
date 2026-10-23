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
  isDetectingActive: boolean = false
) {
  if (!landmarks || landmarks.length < 21) return;

  const fingerStates = getFingerExtensionStates(landmarks);

  ctx.save();
  ctx.clearRect(0, 0, width, height);

  // 1. Draw glowing skeleton connection lines
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Outer glow pass
  ctx.shadowBlur = isDetectingActive ? 14 : 8;
  ctx.shadowColor = isDetectingActive ? '#38bdf8' : '#00e5ff';
  ctx.strokeStyle = isDetectingActive ? 'rgba(56, 189, 248, 0.75)' : 'rgba(0, 229, 255, 0.6)';
  ctx.lineWidth = 4;

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
  ctx.strokeStyle = '#ffffff';
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
      ctx.shadowColor = '#00f0ff';

      // Outer ring
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.fill();

      // Middle ring
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = '#00f0ff';
      ctx.fill();

      // Core white center
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    } else {
      // Normal joint
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#38bdf8';
      ctx.beginPath();
      ctx.arc(x, y, isTip ? 4 : 3, 0, 2 * Math.PI);
      ctx.fillStyle = isTip ? '#67e8f9' : 'rgba(255, 255, 255, 0.9)';
      ctx.fill();
    }
    ctx.restore();
  }

  ctx.restore();
}
