import { AppSettings } from '../types';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Web Speech API Voice Selection & Speech Helper
export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  return window.speechSynthesis.getVoices();
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const speakText = (
  text: string,
  settings: AppSettings,
  onEnd?: () => void,
  onStart?: () => void,
  overridePitch?: number
): SpeechSynthesisUtterance | null => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) setTimeout(onEnd, 1000);
    return null;
  }

  stopSpeech();

  // Clean text of emojis for cleaner speech synthesis pronunciation
  const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

  const utterance = new SpeechSynthesisUtterance(cleanText.trim());
  utterance.rate = settings.speechRate || 0.85;

  // Pitch calculation for cheerful toddler/baby voice
  let pitchVal = overridePitch || settings.speechPitch || 1.30;

  // Extra high cute baby voice boost for word pronunciations & review lines like Apple, Ball, Cat, etc.
  const isBabyWordLine = /apple|ball|cat|dog|egg|fish|giraffe|house|ice cream|juice|kite|lion|monkey|nose|octopus|peacock|queen|rabbit|sun|tiger|umbrella|van|water|x-ray|yo-yo|zebra|great job|bye-bye|yay|yummy|wow/i.test(cleanText);

  if (isBabyWordLine) {
    pitchVal = Math.max(pitchVal, 1.40);
  }

  utterance.pitch = Math.min(2.0, pitchVal);

  const voices = getAvailableVoices();
  if (settings.selectedVoiceURI) {
    const matchedVoice = voices.find((v) => v.voiceURI === settings.selectedVoiceURI);
    if (matchedVoice) utterance.voice = matchedVoice;
  } else if (voices.length > 0) {
    // Prefer friendly English female / high-quality voices
    const preferredVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.name.includes('Victoria') ||
          v.name.includes('Zira') ||
          v.name.includes('Natural') ||
          v.name.includes('Karen'))
    ) || voices.find((v) => v.lang.startsWith('en'));
    
    if (preferredVoice) utterance.voice = preferredVoice;
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.warn('Speech synthesis utterance error:', e);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
  return utterance;
};

// Web Audio API Synthesizers for toddler sound FX

export const playPopSound = () => {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;

    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch (e) {
    console.warn('Pop sound synth error:', e);
  }
};

export const playChimeSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.value = freq;

      const startTime = now + idx * 0.08;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  } catch (e) {
    console.warn('Chime sound synth error:', e);
  }
};

export const playApplauseSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    // Play multiple soft cheerful pops simulating energetic clapping
    for (let i = 0; i < 12; i++) {
      const delay = Math.random() * 0.5;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = 400 + Math.random() * 400;

      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.15, now + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.12);
    }
  } catch (e) {
    console.warn('Applause sound error:', e);
  }
};

export const playSuccessFanfare = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const melody = [
      { freq: 523.25, duration: 0.15 }, // C5
      { freq: 659.25, duration: 0.15 }, // E5
      { freq: 783.99, duration: 0.15 }, // G5
      { freq: 1046.5, duration: 0.4 }   // C6
    ];

    let timeOffset = 0;
    melody.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = note.freq;

      const startTime = now + timeOffset;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + note.duration);

      timeOffset += note.duration;
    });
  } catch (e) {
    console.warn('Fanfare sound error:', e);
  }
};

// Background music generator loop
let bgOsc1: OscillatorNode | null = null;
let bgGain: GainNode | null = null;
let bgInterval: number | null = null;

export const toggleBackgroundMusic = (enable: boolean, volume = 0.05) => {
  if (!enable) {
    if (bgInterval) {
      clearInterval(bgInterval);
      bgInterval = null;
    }
    if (bgGain) {
      bgGain.gain.linearRampToValueAtTime(0, getAudioContext().currentTime + 0.5);
    }
    return;
  }

  try {
    const ctx = getAudioContext();
    if (bgInterval) clearInterval(bgInterval);

    const chords = [
      [261.63, 329.63, 392.0], // C major
      [349.23, 440.0, 523.25], // F major
      [392.0, 493.88, 587.33], // G major
      [261.63, 329.63, 392.0]  // C major
    ];

    let chordIndex = 0;

    const playChord = () => {
      if (!ctx || ctx.state !== 'running') return;
      const now = ctx.currentTime;
      const notes = chords[chordIndex];
      chordIndex = (chordIndex + 1) % chords.length;

      notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(volume * 0.2, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.9);
      });
    };

    playChord();
    bgInterval = window.setInterval(playChord, 2000);
  } catch (e) {
    console.warn('Background music error:', e);
  }
};
