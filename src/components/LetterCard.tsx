import React from 'react';
import { motion } from 'motion/react';
import { Volume2, Sparkles } from 'lucide-react';
import { AlphabetItem, AppSettings } from '../types';
import { speakText, playPopSound } from '../utils/audioSynth';

interface LetterCardProps {
  item: AlphabetItem;
  settings: AppSettings;
  onSelect: (item: AlphabetItem) => void;
}

export const LetterCard: React.FC<LetterCardProps> = ({ item, settings, onSelect }) => {
  const handlePlaySound = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPopSound();
    
    // Speak letter and word clearly for toddlers
    const textToSpeak = `${item.letter}! ${item.letter} is for ${item.word}!`;
    speakText(textToSpeak, settings);
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        handlePlaySound({ stopPropagation: () => {} } as React.MouseEvent);
        onSelect(item);
      }}
      className={`relative rounded-3xl p-4 border-4 ${item.borderColor} bg-white shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between overflow-hidden group select-none min-h-[165px]`}
    >
      {/* Background Decorative Emoji */}
      <span className="absolute -right-2 -bottom-2 text-6xl opacity-15 pointer-events-none group-hover:opacity-25 group-hover:scale-125 transition-all">
        {item.emoji}
      </span>

      {/* Top Badge: Vowel tag */}
      <div className="flex items-center justify-end gap-1 z-10 min-h-[24px]">
        {item.isVowel && (
          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#FF6B6B] text-white shadow-[0_2px_0_#C94A4A]">
            Vowel
          </span>
        )}
      </div>

      {/* Center Display: Giant Letter */}
      <div className="flex items-center justify-center my-1 z-10">
        <span className={`text-5xl sm:text-6xl font-black ${item.textColor} drop-shadow-xs group-hover:scale-110 transition-transform`}>
          {item.letter}
        </span>
      </div>

      {/* Bottom Row: Emoji + Word + Speaker */}
      <div className="flex items-center justify-between pt-2 border-t-2 border-[#FDE68A]/60 z-10">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className="text-xl">{item.emoji}</span>
          <span className="text-xs font-black text-[#B45309] truncate">{item.word}</span>
        </div>

        <button
          onClick={handlePlaySound}
          className={`p-1.5 rounded-xl bg-[#FFD93D] text-[#B45309] shadow-[0_2px_0_#D97706] hover:translate-y-[1px] transition-all`}
          title={`Listen to ${item.letter}`}
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
