import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, Sparkles, ChevronLeft, ChevronRight, Mic, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AlphabetItem, AppSettings } from '../types';
import { ALPHABET_DATA } from '../data/alphabetData';
import { speakText, playPopSound, playChimeSound } from '../utils/audioSynth';

interface LetterDetailModalProps {
  item: AlphabetItem | null;
  settings: AppSettings;
  onClose: () => void;
  onSelectLetter: (item: AlphabetItem) => void;
}

export const LetterDetailModal: React.FC<LetterDetailModalProps> = ({
  item,
  settings,
  onClose,
  onSelectLetter
}) => {
  if (!item) return null;

  const currentIndex = ALPHABET_DATA.findIndex((a) => a.letter === item.letter);
  const prevItem = ALPHABET_DATA[(currentIndex - 1 + ALPHABET_DATA.length) % ALPHABET_DATA.length];
  const nextItem = ALPHABET_DATA[(currentIndex + 1) % ALPHABET_DATA.length];

  const handlePlaySound = () => {
    playPopSound();
    const textToSpeak = `This is ${item.letter}! ${item.letter} is for ${item.word}! ${item.emoji}`;
    speakText(textToSpeak, settings);
  };

  const handlePracticeRepetition = () => {
    playChimeSound();
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    const textToSpeak = `Let's say it together! ${item.letter} for ${item.word}! Great job! 👏👏`;
    speakText(textToSpeak, settings);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          className="relative w-full max-w-lg rounded-[32px] sm:rounded-[40px] bg-[#FFFBEB] border-4 sm:border-8 border-[#FDE68A] p-6 sm:p-8 shadow-2xl overflow-hidden select-none"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-2xl bg-white hover:bg-[#FFD93D] text-[#B45309] border-2 border-[#FDE68A] shadow-[0_2px_0_#D97706] transition-transform hover:scale-110 z-20"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Arrows */}
          <button
            onClick={() => {
              playPopSound();
              onSelectLetter(prevItem);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white hover:bg-[#FFD93D] text-[#B45309] border-2 border-[#FDE68A] shadow-[0_3px_0_#D97706] transition-transform hover:scale-110 z-20"
            title="Previous Letter"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => {
              playPopSound();
              onSelectLetter(nextItem);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white hover:bg-[#FFD93D] text-[#B45309] border-2 border-[#FDE68A] shadow-[0_3px_0_#D97706] transition-transform hover:scale-110 z-20"
            title="Next Letter"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Modal Header */}
          <div className="text-center space-y-1.5 mb-4">
            <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-white text-[#B45309] border-2 border-[#FDE68A]">
              Letter Sound Card
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#B45309]">
              {item.letter} is for {item.word}
            </h2>
          </div>

          {/* Main Display Box */}
          <div className="flex items-center justify-around gap-4 bg-white p-6 rounded-3xl border-4 border-[#FDE68A] shadow-inner my-2">
            {/* Giant Letter */}
            <motion.div
              animate={{ scale: [1, 1.05, 1], rotate: [-2, 2, -2] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-8xl sm:text-9xl font-black text-[#B45309] drop-shadow-md"
            >
              {item.letter}
            </motion.div>

            {/* Giant Emoji */}
            <div className="text-7xl sm:text-8xl filter drop-shadow-md animate-bounce">
              {item.emoji}
            </div>
          </div>

          {/* Fun Fact & Audio Control */}
          <div className="space-y-3 text-center my-4">
            {item.funFact && (
              <p className="text-xs sm:text-sm text-[#B45309] font-bold bg-white/80 p-3 rounded-2xl border-2 border-[#FDE68A] max-w-sm mx-auto">
                💡 {item.funFact}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handlePlaySound}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white font-black text-base shadow-[0_4px_0_#C94A4A] flex items-center justify-center gap-2 transition-transform active:translate-y-[2px]"
            >
              <Volume2 className="w-5 h-5 fill-current" />
              <span>Hear Letter & Word</span>
            </button>

            <button
              onClick={handlePracticeRepetition}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-[#4D96FF] hover:bg-[#4D96FF]/90 text-white font-black text-base shadow-[0_4px_0_#3B7DDB] flex items-center justify-center gap-2 transition-transform active:translate-y-[2px]"
            >
              <Mic className="w-5 h-5" />
              <span>Say It Together!</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
