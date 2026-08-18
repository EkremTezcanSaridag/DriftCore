const fs = require('fs');
const path = require('path');

const SOUNDS_DIR = path.join(__dirname, '..', 'assets', 'sounds');
if (!fs.existsSync(SOUNDS_DIR)) {
  fs.mkdirSync(SOUNDS_DIR, { recursive: true });
}

function createWavBuffer(sampleRate, samples) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < samples.length; i++) {
    let s = Math.tanh(samples[i]);
    const clamped = Math.max(-1, Math.min(1, s));
    const intVal = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
    buffer.writeInt16LE(Math.round(intVal), 44 + i * 2);
  }

  return buffer;
}

const SAMPLE_RATE = 44100;

// DSP Helper: Lowpass filter for warm, soothing acoustics
function applyLowpass(samples, cutoffFreq) {
  const dt = 1 / SAMPLE_RATE;
  const rc = 1 / (2 * Math.PI * cutoffFreq);
  const alpha = dt / (rc + dt);
  const out = new Float32Array(samples.length);
  let prev = 0;
  for (let i = 0; i < samples.length; i++) {
    prev = prev + alpha * (samples[i] - prev);
    out[i] = prev;
  }
  return out;
}

// 1. GLORIOUS HIGH-RPM SPORTS CAR DRIFT ROAR (Pleasant, Deep & Throaty GT3/Supercar Cornering Sound)
// ZERO ANNOYING HIGH-PITCHED SQUEALS — PURE BEAUTIFUL AUTOMOTIVE EXHAUST SOUND!
function generatePleasantSportsCarDriftRoar() {
  const duration = 1.0;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const raw = new Float32Array(totalSamples);
  const baseRpm = 135; // Rich, pleasant 135Hz sports car high-rev tone

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;

    // Harmonic acoustic overtone series of a tuned sports exhaust (Porsche GT3 / Nissan GT-R style)
    const fundamental = Math.sin(2 * Math.PI * baseRpm * t) * 0.50;
    const secondHarmonic = Math.sin(2 * Math.PI * (baseRpm * 2) * t) * 0.35;
    const thirdHarmonic = Math.sin(2 * Math.PI * (baseRpm * 3) * t) * 0.20;
    const fourthHarmonic = Math.sin(2 * Math.PI * (baseRpm * 4) * t) * 0.12;

    // Subtle gentle tarmac friction texture underneath (very soft, no piercing screech)
    const gentleTarmac = (Math.random() * 2 - 1) * 0.08;

    raw[i] = (fundamental + secondHarmonic + thirdHarmonic + fourthHarmonic + gentleTarmac) * 0.65;
  }

  // Smooth warm lowpass filter at 1200Hz to ensure zero ear fatigue
  const smoothed = applyLowpass(raw, 1200);
  return createWavBuffer(SAMPLE_RATE, smoothed);
}

// 2. Smooth Supercar Cruise Idle (Low background purr)
function generateRealEngineLoop() {
  const duration = 1.0;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const raw = new Float32Array(totalSamples);
  const baseRpm = 65; // Relaxed 65Hz cruising cadence

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const f1 = Math.sin(2 * Math.PI * baseRpm * t) * 0.45;
    const f2 = Math.sin(2 * Math.PI * (baseRpm * 2) * t) * 0.25;
    const gentleAir = (Math.random() * 2 - 1) * 0.05;
    raw[i] = (f1 + f2 + gentleAir) * 0.4;
  }

  const smoothed = applyLowpass(raw, 500);
  return createWavBuffer(SAMPLE_RATE, smoothed);
}

// 3. Crisp Turbo Whoosh & Exhaust Flutter on Release
function generateTurboBlowoff() {
  const duration = 0.4;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const raw = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = i / totalSamples;
    const whoosh = (Math.random() * 2 - 1) * Math.pow(1 - progress, 1.8) * 0.4;
    const flutter = Math.sin(2 * Math.PI * 14 * t) * 0.4 + 0.6;
    raw[i] = whoosh * flutter * 0.7;
  }
  const smoothed = applyLowpass(raw, 2500);
  return createWavBuffer(SAMPLE_RATE, smoothed);
}

// 4. Hook Laser Lock
function generateHookSound() {
  const duration = 0.14;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const raw = new Float32Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = i / totalSamples;
    const freq = 340 + Math.pow(progress, 0.6) * 700;
    const sine = Math.sin(2 * Math.PI * freq * t);
    const env = Math.sin(progress * Math.PI);
    raw[i] = sine * env * 0.6;
  }
  return createWavBuffer(SAMPLE_RATE, raw);
}

// 5. Crystal Pickup
function generatePickupSound() {
  const duration = 0.35;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const raw = new Float32Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = i / totalSamples;
    const c6 = Math.sin(2 * Math.PI * 1046.5 * t) * 0.4;
    const e6 = Math.sin(2 * Math.PI * 1318.5 * t) * 0.35;
    const env = Math.exp(-progress * 8.0);
    raw[i] = (c6 + e6) * env * 0.6;
  }
  return createWavBuffer(SAMPLE_RATE, raw);
}

// 6. Coin Pickup
function generateCoinSound() {
  const duration = 0.16;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const raw = new Float32Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const freq = t < 0.06 ? 1174.66 : 1760.0;
    const env = Math.exp(-(i / totalSamples) * 10);
    raw[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.5;
  }
  return createWavBuffer(SAMPLE_RATE, raw);
}

// 7. Crash Impact
function generateCrashSound() {
  const duration = 0.55;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const raw = new Float32Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = i / totalSamples;
    const sub = Math.sin(2 * Math.PI * (90 * Math.exp(-progress * 4.0)) * t) * 0.6;
    const noise = (Math.random() * 2 - 1) * 0.35;
    const env = Math.exp(-progress * 4.0);
    raw[i] = (sub + noise) * env * 0.85;
  }
  const filtered = applyLowpass(raw, 600);
  return createWavBuffer(SAMPLE_RATE, filtered);
}

// 8. Victory Fanfare
function generateVictorySound() {
  const duration = 0.8;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const raw = new Float32Array(totalSamples);
  const notes = [
    { freq: 523.25, start: 0.0, dur: 0.15 },
    { freq: 659.25, start: 0.15, dur: 0.15 },
    { freq: 783.99, start: 0.30, dur: 0.15 },
    { freq: 1046.5, start: 0.45, dur: 0.35 },
  ];
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    let s = 0;
    for (const n of notes) {
      if (t >= n.start && t < n.start + n.dur) {
        const localT = t - n.start;
        const env = Math.sin((localT / n.dur) * Math.PI) * Math.exp(-localT * 2.5);
        s += Math.sin(2 * Math.PI * n.freq * t) * env;
      }
    }
    raw[i] = s * 0.5;
  }
  return createWavBuffer(SAMPLE_RATE, raw);
}

// 9. UI Click
function generateUiClickSound() {
  const duration = 0.05;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const raw = new Float32Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const freq = 500 * Math.exp(-t * 50);
    const env = Math.exp(-(i / totalSamples) * 20);
    raw[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.4;
  }
  return createWavBuffer(SAMPLE_RATE, raw);
}

// 10. UI Start
function generateUiStartSound() {
  const duration = 0.6;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const raw = new Float32Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = i / totalSamples;
    const engineStart = Math.sin(2 * Math.PI * (80 + Math.pow(progress, 1.8) * 260) * t) * 0.55;
    const env = Math.sin(progress * Math.PI);
    raw[i] = engineStart * env * 0.75;
  }
  return createWavBuffer(SAMPLE_RATE, raw);
}

fs.writeFileSync(path.join(SOUNDS_DIR, 'drift_loop.wav'), generatePleasantSportsCarDriftRoar());
fs.writeFileSync(path.join(SOUNDS_DIR, 'engine_loop.wav'), generateRealEngineLoop());
fs.writeFileSync(path.join(SOUNDS_DIR, 'turbo_blowoff.wav'), generateTurboBlowoff());
fs.writeFileSync(path.join(SOUNDS_DIR, 'hook.wav'), generateHookSound());
fs.writeFileSync(path.join(SOUNDS_DIR, 'pickup.wav'), generatePickupSound());
fs.writeFileSync(path.join(SOUNDS_DIR, 'coin.wav'), generateCoinSound());
fs.writeFileSync(path.join(SOUNDS_DIR, 'crash.wav'), generateCrashSound());
fs.writeFileSync(path.join(SOUNDS_DIR, 'victory.wav'), generateVictorySound());
fs.writeFileSync(path.join(SOUNDS_DIR, 'ui_click.wav'), generateUiClickSound());
fs.writeFileSync(path.join(SOUNDS_DIR, 'ui_start.wav'), generateUiStartSound());

console.log('Zero-irritation, pleasant high-rev sports car drift roar generated successfully!');
