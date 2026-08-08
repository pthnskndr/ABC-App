import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, SkipForward, SkipBack, Volume2, VolumeX, Sparkles, Heart, Maximize, Repeat, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VIDEO_CHAPTERS, TOTAL_VIDEO_DURATION } from '../data/scriptData';
import { ALPHABET_DATA, getLetterItem } from '../data/alphabetData';
import { AppSettings, VideoChapter, ScriptLine } from '../types';
import { speakText, stopSpeech, playPopSound, playChimeSound, playApplauseSound } from '../utils/audioSynth';

interface VideoPlayerProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onSelectLetterForDetail?: (letter: string) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ settings, onUpdateSettings, onSelectLetterForDetail }) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0); // 0.75x, 1x, 1.25x
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [speechActive, setSpeechActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const lineTimerRef = useRef<NodeJS.Timeout | null>(null);

  const chapter = VIDEO_CHAPTERS[currentChapterIndex] || VIDEO_CHAPTERS[0];
  const currentLine: ScriptLine | undefined = chapter.scriptLines[currentLineIndex];
  const activeLetterItem = chapter.letter ? getLetterItem(chapter.letter) : null;

  // Handle Speech and Auto Progress
  useEffect(() => {
    if (!isPlaying) {
      stopSpeech();
      if (lineTimerRef.current) clearTimeout(lineTimerRef.current);
      return;
    }

    if (!currentLine) return;

    // Trigger sound FX for special lines
    if (currentLine.text.includes('Great job') || currentLine.text.includes('Amazing') || currentLine.text.includes('Fantastic')) {
      playChimeSound();
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
    } else if (currentLine.text.includes('Clap') || currentLine.text.includes('👏👏')) {
      playApplauseSound();
      confetti({ particleCount: 50, spread: 90, origin: { y: 0.5 } });
    } else {
      playPopSound();
    }

    // Calculate duration based on line length & speed
    const textLength = currentLine.text.length;
    const lineDurationMs = Math.max(2500, (textLength * 120) / playbackSpeed);

    if (!isMuted) {
      speakText(
        currentLine.text,
        {
          ...settings,
          speechRate: (settings.speechRate || 0.85) * playbackSpeed
        },
        () => {
          setSpeechActive(false);
          scheduleNextLine(lineDurationMs * 0.3);
        },
        () => {
          setSpeechActive(true);
        }
      );
    } else {
      scheduleNextLine(lineDurationMs);
    }

    function scheduleNextLine(delayMs: number) {
      if (lineTimerRef.current) clearTimeout(lineTimerRef.current);
      lineTimerRef.current = setTimeout(() => {
        advanceLine();
      }, delayMs);
    }

    return () => {
      if (lineTimerRef.current) clearTimeout(lineTimerRef.current);
    };
  }, [currentChapterIndex, currentLineIndex, isPlaying, isMuted, playbackSpeed]);

  const advanceLine = () => {
    if (currentLineIndex < chapter.scriptLines.length - 1) {
      setCurrentLineIndex((prev) => prev + 1);
    } else {
      // Advance to next chapter
      if (currentChapterIndex < VIDEO_CHAPTERS.length - 1) {
        setCurrentChapterIndex((prev) => prev + 1);
        setCurrentLineIndex(0);
      } else {
        // End of video - celebrate!
        setIsPlaying(false);
        playApplauseSound();
        confetti({ particleCount: 100, spread: 100, origin: { y: 0.4 } });
      }
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopSpeech();
    } else {
      setIsPlaying(true);
      playPopSound();
    }
  };

  const handleRestart = () => {
    stopSpeech();
    setCurrentChapterIndex(0);
    setCurrentLineIndex(0);
    setIsPlaying(true);
    playPopSound();
  };

  const handleNextChapter = () => {
    stopSpeech();
    if (currentChapterIndex < VIDEO_CHAPTERS.length - 1) {
      setCurrentChapterIndex((prev) => prev + 1);
      setCurrentLineIndex(0);
      playPopSound();
    }
  };

  const handlePrevChapter = () => {
    stopSpeech();
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex((prev) => prev - 1);
      setCurrentLineIndex(0);
      playPopSound();
    }
  };

  const handleSelectChapterDirectly = (idx: number) => {
    stopSpeech();
    setCurrentChapterIndex(idx);
    setCurrentLineIndex(0);
    setIsPlaying(true);
    playPopSound();
  };

  const handleRepeatCurrentSpeech = () => {
    if (!currentLine) return;
    playPopSound();
    speakText(currentLine.text, {
      ...settings,
      speechRate: settings.speechRate || 0.85
    });
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.warn(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.warn(err));
      setIsFullscreen(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5">
      {/* Main Video Display Canvas */}
      <div
        ref={containerRef}
        className={`relative w-full aspect-[16/10] sm:aspect-[16/9] bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-2xl border-4 sm:border-8 border-[#FDE68A] flex flex-col justify-between select-none ${
          isFullscreen ? 'rounded-none border-0' : ''
        }`}
      >
        {/* Floating Ambient Sparkles / Stars in Background */}
        <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-yellow-200 text-xl"
              style={{
                top: `${(i * 17) % 90}%`,
                left: `${(i * 23) % 90}%`
              }}
              animate={{
                scale: [0.8, 1.3, 0.8],
                opacity: [0.3, 0.9, 0.3],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>

        {/* Top Video Header Bar */}
        <div className="relative z-10 px-4 py-3 bg-slate-950/60 backdrop-blur-md flex items-center justify-between text-white border-b-2 border-[#FDE68A]/30">
          <div className="flex items-center gap-2">
            <span className="text-xl">{chapter.emoji}</span>
            <h2 className="font-black text-sm sm:text-base tracking-wide text-[#FFD93D]">
              {chapter.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-black">
            <span className="px-3 py-1 rounded-full bg-white/15 text-white border border-white/20">
              Chapter {currentChapterIndex + 1} / {VIDEO_CHAPTERS.length}
            </span>
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Toggle Fullscreen"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Stage Scene View */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 text-center overflow-hidden">
          <AnimatePresence mode="wait">
            {/* INTRO SCENE */}
            {chapter.visualType === 'intro' && (
              <motion.div
                key="intro-scene"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex flex-col items-center justify-center gap-4"
              >
                <motion.div
                  animate={{ y: [-8, 8, -8], rotate: [-2, 2, -2] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-[#FFD93D] flex items-center justify-center text-5xl sm:text-7xl shadow-[0_6px_0_#D97706] border-4 border-white/90"
                >
                  👶
                </motion.div>

                {/* Floating Letters Carousel */}
                <div className="flex gap-2 sm:gap-3 flex-wrap justify-center max-w-md">
                  {['A', 'B', 'C', 'D', 'E', 'F'].map((l, idx) => (
                    <motion.div
                      key={l}
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, delay: idx * 0.2, repeat: Infinity }}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-md border-2 border-white/40 font-black text-[#FFD93D] text-xl sm:text-2xl flex items-center justify-center shadow-lg"
                    >
                      {l}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* DETAILED LETTER SCENE (A to P) */}
            {chapter.visualType === 'detailed-letter' && activeLetterItem && (
              <motion.div
                key={`letter-scene-${activeLetterItem.letter}`}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ type: 'spring', damping: 20 }}
                className="flex flex-col items-center justify-center gap-3 w-full max-w-xl"
              >
                <div className="flex items-center justify-center gap-6 sm:gap-10">
                  {/* Giant Letter Card */}
                  <motion.div
                    onClick={handleRepeatCurrentSpeech}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-32 h-36 sm:w-44 sm:h-48 rounded-3xl bg-gradient-to-br ${activeLetterItem.gradient} p-1 shadow-2xl flex flex-col items-center justify-center border-4 border-white/90 cursor-pointer group`}
                  >
                    <span className="text-6xl sm:text-8xl font-black text-white drop-shadow-md">
                      {activeLetterItem.letter}
                    </span>
                  </motion.div>

                  {/* Equal Sign or Sparkle */}
                  <div className="text-3xl sm:text-5xl font-black text-[#FFD93D] animate-pulse">
                    ✨
                  </div>

                  {/* Bouncy Emoji Illustration Card */}
                  <motion.div
                    onClick={handleRepeatCurrentSpeech}
                    animate={{ scale: [1, 1.06, 1], rotate: [-2, 2, -2] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-32 h-36 sm:w-44 sm:h-48 rounded-3xl bg-white/20 backdrop-blur-md border-4 border-white/80 p-2 flex flex-col items-center justify-center shadow-2xl cursor-pointer"
                  >
                    <span className="text-6xl sm:text-8xl drop-shadow-lg transform group-hover:scale-110 transition-transform">
                      {activeLetterItem.emoji}
                    </span>
                    <span className="text-sm sm:text-lg font-black text-[#FFD93D] mt-1">
                      {activeLetterItem.word}
                    </span>
                  </motion.div>
                </div>

              </motion.div>
            )}

            {/* QUICK REVIEW Q-Z SCENE */}
            {chapter.visualType === 'quick-review' && (
              <motion.div
                key="quick-review-scene"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center gap-4 w-full"
              >
                <div className="text-2xl sm:text-3xl font-black text-[#FFD93D] tracking-wide">
                  🚀 Quick Phonics Review (Q–Z) 🚀
                </div>

                <div className="grid grid-cols-5 gap-2 sm:gap-3 max-w-lg">
                  {ALPHABET_DATA.slice(16).map((item) => (
                    <motion.div
                      key={item.letter}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => {
                        playPopSound();
                        if (onSelectLetterForDetail) onSelectLetterForDetail(item.letter);
                      }}
                      className="p-2 sm:p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center shadow-lg cursor-pointer hover:bg-[#FFD93D]/30 transition-colors"
                    >
                      <span className="text-2xl sm:text-3xl font-black text-white">{item.letter}</span>
                      <span className="text-lg">{item.emoji}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* FINAL REVIEW CELEBRATION SCENE */}
            {chapter.visualType === 'final-review' && (
              <motion.div
                key="final-review-scene"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center gap-3 max-w-2xl"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl sm:text-8xl"
                >
                  🎉
                </motion.div>

                <h3 className="text-2xl sm:text-4xl font-black text-[#FFD93D] drop-shadow-md">
                  You Did a Great Job! 👏👏
                </h3>

                <p className="text-sm sm:text-lg text-amber-100 max-w-md font-bold">
                  We learned all 26 letter sounds together! ABC… you and me! 🎵
                </p>

                <div className="flex gap-2 flex-wrap justify-center mt-2 max-w-md">
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'].map((l) => (
                    <span key={l} className="w-8 h-8 rounded-xl bg-[#FFD93D]/30 text-[#FFD93D] font-black text-sm flex items-center justify-center border border-[#FFD93D]/40">
                      {l}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Animated Subtitle / Captions Bar */}
        <div className="relative z-10 px-4 py-3 bg-black/75 backdrop-blur-lg border-t-2 border-[#FDE68A]/30 text-center min-h-[72px] flex items-center justify-center">
          {currentLine ? (
            <motion.div
              key={`${currentChapterIndex}-${currentLineIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 flex-wrap text-white text-base sm:text-xl font-black tracking-wide"
            >
              {currentLine.emoji && <span className="text-2xl">{currentLine.emoji}</span>}
              <span className="text-[#FFD93D] drop-shadow-sm">
                🎙️ {currentLine.text}
              </span>
            </motion.div>
          ) : (
            <span className="text-slate-300 text-sm font-bold">Press Play to begin letter sounds video!</span>
          )}
        </div>

        {/* Video Scrubber & Controls Panel */}
        <div className="relative z-10 p-3 bg-slate-950 border-t border-slate-800 flex flex-col gap-2">
          {/* Timeline Chapter Scrubber */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            {VIDEO_CHAPTERS.map((ch, idx) => {
              const isActive = idx === currentChapterIndex;
              return (
                <button
                  key={ch.id}
                  onClick={() => handleSelectChapterDirectly(idx)}
                  className={`flex-1 min-w-[36px] sm:min-w-[48px] h-3 rounded-full transition-all relative group ${
                    isActive
                      ? 'bg-[#FFD93D] ring-2 ring-[#FFD93D] scale-105'
                      : idx < currentChapterIndex
                      ? 'bg-[#FF6B6B]'
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                  title={`${ch.title} (${ch.timestamp})`}
                />
              );
            })}
          </div>

          {/* Main Controls Row */}
          <div className="flex items-center justify-between gap-2 pt-1">
            {/* Left Playback Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevChapter}
                disabled={currentChapterIndex === 0}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white transition-all font-black"
                title="Previous Letter"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={handleTogglePlay}
                className={`p-3.5 rounded-2xl font-black text-white transition-all flex items-center justify-center transform active:translate-y-[2px] ${
                  isPlaying
                    ? 'bg-[#FFD93D] text-[#B45309] shadow-[0_4px_0_#D97706]'
                    : 'bg-[#FF6B6B] text-white shadow-[0_4px_0_#C94A4A]'
                }`}
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
              </button>

              <button
                onClick={handleNextChapter}
                disabled={currentChapterIndex === VIDEO_CHAPTERS.length - 1}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white transition-all font-black"
                title="Next Letter"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              <button
                onClick={handleRestart}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all"
                title="Restart Video"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Speed & Audio Toggles */}
            <div className="flex items-center gap-2">
              {/* Pace Selector */}
              <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800">
                {[0.75, 1.0, 1.25].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => {
                      setPlaybackSpeed(speed);
                      playPopSound();
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                      playbackSpeed === speed
                        ? 'bg-[#FFD93D] text-[#B45309] shadow-sm'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {speed === 0.75 ? '🐢 0.75x' : speed === 1.0 ? '1x' : '🚀 1.25x'}
                  </button>
                ))}
              </div>

              {/* Mute Toggle */}
              <button
                onClick={() => {
                  setIsMuted(!isMuted);
                  if (!isMuted) stopSpeech();
                }}
                className={`p-2.5 rounded-xl border transition-all ${
                  isMuted
                    ? 'bg-[#FF6B6B]/20 text-[#FF6B6B] border-[#FF6B6B]/40'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
                title={isMuted ? 'Unmute Speech' : 'Mute Speech'}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Selection Drawer / Quick Navigator */}
      <div className="bg-white rounded-[32px] p-5 shadow-xl border-4 sm:border-8 border-[#FDE68A]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-black text-[#B45309] text-base sm:text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D97706]" />
            <span>Interactive Video Chapters (A–Z)</span>
          </h3>
          <span className="text-xs text-[#D97706] font-bold">Click any chapter to jump directly!</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
          {VIDEO_CHAPTERS.map((ch, idx) => {
            const isSelected = idx === currentChapterIndex;
            return (
              <button
                key={ch.id}
                onClick={() => handleSelectChapterDirectly(idx)}
                className={`p-3 rounded-2xl text-left transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#D97706] border-2 border-[#B45309] text-white shadow-[0_3px_0_#92400E] font-black'
                    : 'bg-[#FFFBEB] border-2 border-[#FDE68A] text-slate-800 hover:bg-[#FFD93D]/30 font-extrabold'
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <span className="text-xl sm:text-2xl shrink-0">{ch.emoji}</span>
                  <div className="truncate">
                    <div className="text-xs sm:text-sm font-black truncate">{ch.title}</div>
                    <div className={`text-[10px] font-bold ${isSelected ? 'text-amber-100' : 'text-[#D97706]'}`}>
                      {ch.timestamp}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
