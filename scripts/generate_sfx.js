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

  // RIFF Chunk
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt Subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20);  // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data Subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Write 16-bit PCM samples
  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    const intVal = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
    buffer.writeInt16LE(Math.round(intVal), 44 + i * 2);
  }

  return buffer;
}

const SAMPLE_RATE = 44100;

// 1. Hook Laser Lock Sound (0.18s)
function generateHookSound() {
  const duration = 0.18;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = i / totalSamples;
    // Rapid ascending laser sweep from 400Hz to 1600Hz
    const freq = 400 + Math.pow(progress, 0.7) * 1400;
    const phase = 2 * Math.PI * freq * t;
    const wave = Math.sin(phase) * 0.7 + (Math.sin(phase * 2) * 0.3);
    const envelope = Math.sin(progress * Math.PI) * (1 - progress * 0.4);
    samples[i] = wave * envelope * 0.8;
  }
  return createWavBuffer(SAMPLE_RATE, samples);
}

// 2. Nitro Boost / Launch Whoosh Sound (0.45s)
function generateBoostSound() {
  const duration = 0.45;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = i / totalSamples;
    const freq = 650 * Math.exp(-progress * 3.5);
    const sine = Math.sin(2 * Math.PI * freq * t);
    const noise = (Math.random() * 2 - 1) * 0.45;
    const env = Math.pow(1 - progress, 1.8);
    samples[i] = (sine * 0.55 + noise * 0.45) * env * 0.9;
  }
  return createWavBuffer(SAMPLE_RATE, samples);
}

// 3. Crystal Shard Pickup Chime (0.35s)
function generatePickupSound() {
  const duration = 0.35;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = i / totalSamples;
    // Sparkling bell harmonics: C6 (1046Hz) + E6 (1318Hz) + C7 (2093Hz)
    const s1 = Math.sin(2 * Math.PI * 1046.5 * t);
    const s2 = Math.sin(2 * Math.PI * 1318.5 * t) * 0.7;
    const s3 = Math.sin(2 * Math.PI * 2093.0 * t) * 0.5;
    const env = Math.exp(-progress * 9);
    samples[i] = (s1 + s2 + s3) * env * 0.5;
  }
  return createWavBuffer(SAMPLE_RATE, samples);
}

// 4. Coin Pickup Sound (0.2s)
function generateCoinSound() {
  const duration = 0.2;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const freq = t < 0.08 ? 987.77 : 1318.51; // B5 -> E6
    const env = Math.exp(-(i / totalSamples) * 8);
    samples[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.6;
  }
  return createWavBuffer(SAMPLE_RATE, samples);
}

// 5. Crash Impact Explosion (0.6s)
function generateCrashSound() {
  const duration = 0.6;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = i / totalSamples;
    const lowBoom = Math.sin(2 * Math.PI * (120 * Math.exp(-progress * 4)) * t);
    const noise = (Math.random() * 2 - 1);
    const env = Math.exp(-progress * 5);
    samples[i] = (lowBoom * 0.6 + noise * 0.4) * env * 0.9;
  }
  return createWavBuffer(SAMPLE_RATE, samples);
}

// 6. Victory Fanfare (0.8s)
function generateVictorySound() {
  const duration = 0.8;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);

  const notes = [
    { freq: 523.25, start: 0.0, dur: 0.15 }, // C5
    { freq: 659.25, start: 0.15, dur: 0.15 }, // E5
    { freq: 783.99, start: 0.30, dur: 0.15 }, // G5
    { freq: 1046.5, start: 0.45, dur: 0.35 }, // C6
  ];

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    let sample = 0;
    for (const n of notes) {
      if (t >= n.start && t < n.start + n.dur) {
        const localT = t - n.start;
        const env = Math.sin((localT / n.dur) * Math.PI) * Math.exp(-localT * 3);
        sample += Math.sin(2 * Math.PI * n.freq * t) * env;
      }
    }
    samples[i] = sample * 0.6;
  }
  return createWavBuffer(SAMPLE_RATE, samples);
}

fs.writeFileSync(path.join(SOUNDS_DIR, 'hook.wav'), generateHookSound());
fs.writeFileSync(path.join(SOUNDS_DIR, 'boost.wav'), generateBoostSound());
fs.writeFileSync(path.join(SOUNDS_DIR, 'pickup.wav'), generatePickupSound());
fs.writeFileSync(path.join(SOUNDS_DIR, 'coin.wav'), generateCoinSound());
fs.writeFileSync(path.join(SOUNDS_DIR, 'crash.wav'), generateCrashSound());
fs.writeFileSync(path.join(SOUNDS_DIR, 'victory.wav'), generateVictorySound());

console.log('All SFX WAV audio assets generated successfully in assets/sounds/!');
