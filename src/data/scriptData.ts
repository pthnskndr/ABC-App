import { VideoChapter } from '../types';
import { ALPHABET_DATA } from './alphabetData';

export const VIDEO_CHAPTERS: VideoChapter[] = [
  {
    id: 'intro',
    title: 'Intro & Welcome',
    timestamp: '0:00',
    startTimeSeconds: 0,
    durationSeconds: 20,
    visualType: 'intro',
    emoji: '🌈',
    scriptLines: [
      { speaker: 'Narrator', text: 'Hello, little learners! 👋', highlightText: 'Hello', emoji: '👋' },
      { speaker: 'Narrator', text: 'Are you ready to learn your ABCs?', highlightText: 'ABCs', emoji: '🔤' },
      { speaker: 'Narrator', text: 'Today, we are going to learn letter sounds! 🔤', highlightText: 'letter sounds', emoji: '🎵' },
      { speaker: 'Narrator', text: 'Let’s make some sounds together!', highlightText: 'sounds together', emoji: '✨' },
      { speaker: 'Narrator', text: 'Are you ready?', highlightText: 'ready', emoji: '😃' },
      { speaker: 'Narrator', text: 'Let’s go! 🎉', highlightText: 'Let’s go!', emoji: '🎉' }
    ]
  },
  // Detailed letters A to P (16 letters x ~10s = 160s, 0:20 - 3:00)
  ...ALPHABET_DATA.slice(0, 16).map((item, index) => {
    const startSec = 20 + index * 10;
    const min = Math.floor(startSec / 60);
    const sec = (startSec % 60).toString().padStart(2, '0');
    return {
      id: `letter-${item.letter.toLowerCase()}`,
      title: `Letter ${item.letter} — ${item.word}`,
      letter: item.letter,
      timestamp: `${min}:${sec}`,
      startTimeSeconds: startSec,
      durationSeconds: 10,
      visualType: 'detailed-letter' as const,
      emoji: item.emoji,
      scriptLines: item.scriptLines.map((line) => ({
        speaker: 'Narrator',
        text: line,
        soundToPlay: line.toLowerCase().includes(item.word.toLowerCase()) ? item.sound : undefined,
        emoji: line.includes(item.emoji) ? item.emoji : undefined
      }))
    };
  }),
  {
    id: 'quick-review',
    title: 'Q–Z Quick Review',
    timestamp: '3:00',
    startTimeSeconds: 180,
    durationSeconds: 30,
    visualType: 'quick-review',
    emoji: '🚀',
    scriptLines: ALPHABET_DATA.slice(16).map((item) => ({
      speaker: 'Narrator',
      text: item.quickScriptLine || `${item.letter} is for ${item.word}! ${item.emoji}`,
      soundToPlay: item.sound,
      emoji: item.emoji
    }))
  },
  {
    id: 'final-review',
    title: 'Final Review & Celebration',
    timestamp: '3:30',
    startTimeSeconds: 210,
    durationSeconds: 20,
    visualType: 'final-review',
    emoji: '🌟',
    scriptLines: [
      { speaker: 'Narrator', text: 'Wow! Look at all those letters! 🌈', emoji: '🌈' },
      { speaker: 'Narrator', text: 'A For Apple! 🍎', emoji: '🍎' },
      { speaker: 'Narrator', text: 'B For Ball! ⚽', emoji: '⚽' },
      { speaker: 'Narrator', text: 'C For Cat! 🐱', emoji: '🐱' },
      { speaker: 'Narrator', text: 'We learned lots of letter sounds today!', emoji: '🌟' },
      { speaker: 'Narrator', text: 'You did a great job! 👏👏', emoji: '👏👏' },
      { speaker: 'Narrator', text: 'Let’s clap for our little learner!', emoji: '👏' },
      { speaker: 'Narrator', text: 'ABC… you and me! 🎵', emoji: '🎵' },
      { speaker: 'Narrator', text: 'See you next time!', emoji: '✨' },
      { speaker: 'Narrator', text: 'Bye-bye! 👋💖', emoji: '👋💖' }
    ]
  }
];

export const TOTAL_VIDEO_DURATION = 230; // 3 min 50 sec
