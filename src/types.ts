export interface AlphabetItem {
  letter: string;
  sound: string;
  phonicsSpelling: string;
  word: string;
  emoji: string;
  isVowel: boolean;
  bgColor: string;
  borderColor: string;
  textColor: string;
  gradient: string;
  scriptLines: string[];
  quickScriptLine?: string;
  funFact?: string;
}

export interface ScriptLine {
  speaker: string;
  text: string;
  soundToPlay?: string;
  highlightText?: string;
  emoji?: string;
  durationMs?: number;
}

export interface VideoChapter {
  id: string;
  title: string;
  letter?: string;
  timestamp: string;
  startTimeSeconds: number;
  durationSeconds: number;
  visualType: 'intro' | 'detailed-letter' | 'quick-review' | 'final-review';
  emoji: string;
  scriptLines: ScriptLine[];
}

export interface AppSettings {
  speechRate: number;
  speechPitch: number;
  autoRepeatSound: boolean;
  backgroundMusic: boolean;
  bgMusicVolume: number;
  selectedVoiceURI: string | null;
  highContrast: boolean;
}

export type ViewMode = 'video' | 'grid' | 'games';
