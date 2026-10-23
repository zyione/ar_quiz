import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import type { HandGestureResult, GestureAnswer, HandLandmarkPoint } from '../types';

let handLandmarker: HandLandmarker | null = null;
let isInitializing = false;

export async function initHandLandmarker(): Promise<boolean> {
  if (handLandmarker) return true;
  if (isInitializing) return false;
  isInitializing = true;

  // Try local offline assets first, fallback to CDN if local fetch fails
  try {
    const vision = await FilesetResolver.forVisionTasks('/wasm');
    handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: '/models/hand_landmarker.task',
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numHands: 1,
    });
    isInitializing = false;
    return true;
  } catch (localErr) {
    console.warn('Local hand landmarker loading failed, trying fallback CDN...', localErr);
    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
      );
      handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 1,
      });
      isInitializing = false;
      return true;
    } catch (cdnErr) {
      console.error('All HandLandmarker init attempts failed:', cdnErr);
      isInitializing = false;
      return false;
    }
  }
}

export function detectFingers(videoEl: HTMLVideoElement): HandGestureResult {
  if (!handLandmarker || videoEl.readyState < 2) {
    return { fingerCount: null, answer: null, confidence: 'none' };
  }

  let results;
  try {
    results = handLandmarker.detectForVideo(videoEl, performance.now());
  } catch {
    return { fingerCount: null, answer: null, confidence: 'none' };
  }

  if (!results.landmarks || results.landmarks.length === 0) {
    return { fingerCount: null, answer: null, confidence: 'none' };
  }

  const rawLandmarks = results.landmarks[0];
  const landmarks: HandLandmarkPoint[] = rawLandmarks.map((pt) => ({
    x: pt.x,
    y: pt.y,
    z: pt.z,
  }));

  const count = countExtendedFingers(landmarks);
  const answer = fingerCountToAnswer(count);

  return {
    fingerCount: count,
    answer,
    confidence: count !== null && count >= 1 && count <= 4 ? 'high' : 'low',
    landmarks,
  };
}

function dist3D(p1: HandLandmarkPoint, p2: HandLandmarkPoint): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y, p1.z - p2.z);
}

export function getFingerExtensionStates(landmarks: HandLandmarkPoint[]): boolean[] {
  if (!landmarks || landmarks.length < 21) return [false, false, false, false, false];

  const wrist = landmarks[0];
  const states = [false, false, false, false, false];

  // 1. Thumb (Tip: 4, IP: 3, MCP: 2, CMC: 1)
  // Check distance from thumb tip to pinky MCP (17) vs IP joint to pinky MCP
  const thumbTip = landmarks[4];
  const thumbIP = landmarks[3];
  const pinkyMCP = landmarks[17];
  const thumbDistTip = dist3D(thumbTip, pinkyMCP);
  const thumbDistIP = dist3D(thumbIP, pinkyMCP);
  states[0] = thumbDistTip > thumbDistIP * 1.15;

  // 2. Index (Tip: 8, PIP: 6, MCP: 5)
  // 3. Middle (Tip: 12, PIP: 10, MCP: 9)
  // 4. Ring (Tip: 16, PIP: 14, MCP: 13)
  // 5. Pinky (Tip: 20, PIP: 18, MCP: 17)
  const tipIndices = [8, 12, 16, 20];
  const pipIndices = [6, 10, 14, 18];
  const mcpIndices = [5, 9, 13, 17];

  for (let i = 0; i < 4; i++) {
    const tip = landmarks[tipIndices[i]];
    const pip = landmarks[pipIndices[i]];
    const mcp = landmarks[mcpIndices[i]];

    // Distance from wrist to tip vs wrist to PIP
    const distTip = dist3D(wrist, tip);
    const distPip = dist3D(wrist, pip);
    const distMcp = dist3D(wrist, mcp);

    // Also consider height difference if hand is roughly vertical
    const yExtended = tip.y < pip.y;
    const distExtended = distTip > distPip * 1.12 && distTip > distMcp * 1.3;

    states[i + 1] = distExtended || (yExtended && distTip > distMcp);
  }

  return states;
}

function countExtendedFingers(landmarks: HandLandmarkPoint[]): number {
  const states = getFingerExtensionStates(landmarks);
  const [thumb, index, middle, ring, pinky] = states;

  // 1. High-confidence common gesture shapes:
  // 4 fingers: all four non-thumb fingers up (Index + Middle + Ring + Pinky)
  if (index && middle && ring && pinky) {
    return 4;
  }

  // 3 fingers: Index + Middle + Ring (reference photo) OR Thumb + Index + Middle
  if ((index && middle && ring && !pinky) || (thumb && index && middle && !ring && !pinky)) {
    return 3;
  }

  // 2 fingers: Index + Middle (Peace sign) OR Thumb + Index
  if ((index && middle && !ring && !pinky) || (thumb && index && !middle && !ring && !pinky)) {
    return 2;
  }

  // 1 finger: Index alone OR Thumb alone
  if ((index && !middle && !ring && !pinky) || (thumb && !index && !middle && !ring && !pinky)) {
    return 1;
  }

  // 2. Fallback to count of any extended fingers:
  const extendedCount = states.filter(Boolean).length;
  if (extendedCount >= 1 && extendedCount <= 4) {
    return extendedCount;
  }
  if (extendedCount >= 5) {
    return 4; // Open palm defaults to option D
  }
  return 0;
}

function fingerCountToAnswer(count: number): GestureAnswer {
  if (count === 1) return 'A';
  if (count === 2) return 'B';
  if (count === 3) return 'C';
  if (count === 4) return 'D';
  return null;
}

export function destroyHandLandmarker() {
  if (handLandmarker) {
    handLandmarker.close();
    handLandmarker = null;
  }
}
