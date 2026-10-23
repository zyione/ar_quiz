import confetti from 'canvas-confetti';

export function triggerConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.6 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55, colors: ['#FFD700', '#FFA500', '#FF6347'] });
  fire(0.2, { spread: 60, colors: ['#6C63FF', '#3D8EF0', '#00D4AA'] });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#FFD700', '#ffffff', '#6C63FF'] });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45, colors: ['#FFD700', '#6C63FF'] });
}

export function triggerSideConfetti() {
  confetti({
    particleCount: 80,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors: ['#FFD700', '#6C63FF', '#00D4AA', '#FF6347'],
    zIndex: 9999,
  });
  confetti({
    particleCount: 80,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    colors: ['#FFD700', '#6C63FF', '#00D4AA', '#FF6347'],
    zIndex: 9999,
  });
}

function createTone(ctx: AudioContext, freq: number, type: OscillatorType, duration: number, gain: number) {
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gainNode.gain.setValueAtTime(gain, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

export function playCorrectSound() {
  try {
    const ctx = new AudioContext();
    createTone(ctx, 523.25, 'sine', 0.15, 0.3); // C5
    setTimeout(() => createTone(ctx, 659.25, 'sine', 0.15, 0.3), 120); // E5
    setTimeout(() => createTone(ctx, 783.99, 'sine', 0.25, 0.3), 240); // G5
  } catch {}
}

export function playIncorrectSound() {
  try {
    const ctx = new AudioContext();
    createTone(ctx, 220, 'sawtooth', 0.3, 0.2);
    setTimeout(() => createTone(ctx, 196, 'sawtooth', 0.3, 0.2), 150);
  } catch {}
}
