import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, RefreshCw, Trophy, Star, Heart, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ALPHABET_DATA } from '../data/alphabetData';
import { AlphabetItem, AppSettings } from '../types';
import { speakText, playPopSound, playChimeSound, playApplauseSound } from '../utils/audioSynth';

interface PhonicsGamesProps {
  settings: AppSettings;
}

export const PhonicsGames: React.FC<PhonicsGamesProps> = ({ settings }) => {
  const [activeTab, setActiveTab] = useState<'match' | 'bubbles'>('match');

  // Match Game State
  const [targetItem, setTargetItem] = useState<AlphabetItem>(ALPHABET_DATA[0]);
  const [options, setOptions] = useState<AlphabetItem[]>([]);
  const [stars, setStars] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Bubble Game State
  const [bubbles, setBubbles] = useState<{ id: number; item: AlphabetItem; x: number; speed: number }[]>([]);

  // Initialize Match Game Round
  const startNewMatchRound = () => {
    const randomTarget = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)];
    setTargetItem(randomTarget);
    setSelectedOption(null);
    setIsCorrect(null);

    // Pick 3 wrong options
    const others = ALPHABET_DATA.filter((a) => a.letter !== randomTarget.letter);
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
    const allOptions = [randomTarget, ...shuffledOthers].sort(() => 0.5 - Math.random());
    setOptions(allOptions);

    // Speak Prompt
    const promptText = `Can you find letter ${randomTarget.letter}? ${randomTarget.letter} is for ${randomTarget.word}!`;
    speakText(promptText, settings);
  };

  useEffect(() => {
    if (activeTab === 'match') {
      startNewMatchRound();
    } else if (activeTab === 'bubbles') {
      generateBubbles();
    }
  }, [activeTab]);

  const handleSelectMatchOption = (option: AlphabetItem) => {
    setSelectedOption(option.letter);
    if (option.letter === targetItem.letter) {
      setIsCorrect(true);
      playChimeSound();
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      setStars((prev) => prev + 1);

      speakText(`Yay! Great job! ${option.letter} is for ${option.word}!`, settings, () => {
        setTimeout(startNewMatchRound, 1500);
      });
    } else {
      setIsCorrect(false);
      playPopSound();
      speakText(`Try again! That is ${option.letter}. Find ${targetItem.letter}!`, settings);
    }
  };

  // Generate Bubbles
  const generateBubbles = () => {
    const newBubbles = [];
    for (let i = 0; i < 6; i++) {
      const item = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)];
      newBubbles.push({
        id: Date.now() + i,
        item,
        x: 10 + i * 15,
        speed: 4 + Math.random() * 3
      });
    }
    setBubbles(newBubbles);
  };

  const handlePopBubble = (id: number, item: AlphabetItem) => {
    playPopSound();
    speakText(`${item.letter}! ${item.letter} is for ${item.word}!`, settings);
    setBubbles((prev) => prev.filter((b) => b.id !== id));

    // Spawn a new bubble
    setTimeout(() => {
      const newItem = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)];
      setBubbles((prev) => [
        ...prev,
        {
          id: Date.now(),
          item: newItem,
          x: Math.floor(Math.random() * 80) + 10,
          speed: 4 + Math.random() * 3
        }
      ]);
    }, 800);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Game Mode Switcher */}
      <div className="flex items-center justify-center gap-2 bg-white p-2 rounded-[32px] border-4 border-[#FDE68A] shadow-lg max-w-md mx-auto">
        <button
          onClick={() => {
            setActiveTab('match');
            playPopSound();
          }}
          className={`flex-1 py-3 px-4 rounded-2xl font-black text-sm sm:text-base transition-all flex items-center justify-center gap-2 ${
            activeTab === 'match'
              ? 'bg-[#FF6B6B] text-white shadow-[0_4px_0_#C94A4A] translate-y-[-2px]'
              : 'text-slate-700 hover:bg-[#FFFBEB]'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Find the Letter</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('bubbles');
            playPopSound();
          }}
          className={`flex-1 py-3 px-4 rounded-2xl font-black text-sm sm:text-base transition-all flex items-center justify-center gap-2 ${
            activeTab === 'bubbles'
              ? 'bg-[#4D96FF] text-white shadow-[0_4px_0_#3B7DDB] translate-y-[-2px]'
              : 'text-slate-700 hover:bg-[#FFFBEB]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Pop the Bubbles</span>
        </button>
      </div>

      {/* GAME 1: MATCH LETTER GAME */}
      {activeTab === 'match' && (
        <div className="bg-white rounded-[32px] p-6 border-4 sm:border-8 border-[#FDE68A] shadow-xl space-y-6 text-center">
          {/* Header & Score */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 bg-[#FFD93D] px-4 py-2 rounded-2xl border-2 border-[#D97706] text-[#B45309] font-black text-sm shadow-[0_2px_0_#D97706]">
              <Star className="w-4 h-4 fill-[#B45309] text-[#B45309]" />
              <span>Stars Earned: {stars}</span>
            </div>

            <button
              onClick={startNewMatchRound}
              className="p-2.5 rounded-2xl bg-[#FFFBEB] hover:bg-[#FFD93D]/30 text-[#B45309] border-2 border-[#FDE68A] transition-colors flex items-center gap-1.5 text-xs font-black shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Next Letter</span>
            </button>
          </div>

          {/* Prompt Card */}
          <div className="bg-[#FFFBEB] p-6 rounded-[28px] border-4 border-[#FDE68A] space-y-3 shadow-inner">
            <span className="text-xs font-black uppercase text-[#B45309] bg-white px-3 py-1 rounded-full border-2 border-[#FDE68A]">
              Listen & Match
            </span>

            <h3 className="text-xl sm:text-3xl font-black text-[#B45309]">
              Which letter is for <span className="text-[#FF6B6B]">"{targetItem.word}"</span> ({targetItem.emoji})?
            </h3>

            <button
              onClick={() => {
                playPopSound();
                speakText(`Can you find letter ${targetItem.letter}? ${targetItem.letter} is for ${targetItem.word}!`, settings);
              }}
              className="px-5 py-2.5 rounded-2xl bg-[#FFD93D] hover:bg-[#FFD93D]/90 shadow-[0_3px_0_#D97706] border-2 border-[#D97706] font-black text-[#B45309] text-sm hover:translate-y-[1px] transition-all flex items-center gap-2 mx-auto"
            >
              <Volume2 className="w-4 h-4 text-[#B45309]" />
              <span>Listen Again</span>
            </button>
          </div>

          {/* 4 Large Choice Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {options.map((opt) => {
              const isSelected = selectedOption === opt.letter;
              const isTarget = opt.letter === targetItem.letter;

              let cardStyle = 'bg-white border-4 border-[#FDE68A] text-[#B45309] hover:border-[#FFD93D] shadow-md';
              if (isSelected) {
                if (isCorrect) {
                  cardStyle = 'bg-[#6BCB77]/20 border-4 border-[#6BCB77] text-[#4E9E56] shadow-[0_4px_0_#4E9E56] ring-4 ring-[#6BCB77]/40';
                } else {
                  cardStyle = 'bg-[#FF6B6B]/20 border-4 border-[#FF6B6B] text-[#C94A4A] shadow-[0_4px_0_#C94A4A] ring-4 ring-[#FF6B6B]/40';
                }
              }

              return (
                <motion.button
                  key={opt.letter}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectMatchOption(opt)}
                  className={`p-6 rounded-3xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${cardStyle}`}
                >
                  <span className="text-7xl font-black">{opt.letter}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* GAME 2: POP THE LETTER BUBBLES */}
      {activeTab === 'bubbles' && (
        <div className="relative w-full h-[450px] bg-gradient-to-b from-sky-400 via-indigo-400 to-purple-500 rounded-[32px] p-4 border-4 sm:border-8 border-[#FDE68A] shadow-2xl overflow-hidden select-none">
          <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border-2 border-[#FDE68A] text-[#B45309] font-black text-xs sm:text-sm shadow-sm">
            🎈 Tap any floating bubble to hear its letter & word!
          </div>

          {/* Floating Bubbles */}
          {bubbles.map((b) => (
            <motion.div
              key={b.id}
              initial={{ y: 420 }}
              animate={{ y: -80 }}
              transition={{
                duration: b.speed,
                repeat: Infinity,
                ease: 'linear'
              }}
              onClick={() => handlePopBubble(b.id, b.item)}
              style={{ left: `${b.x}%` }}
              className="absolute w-20 h-20 rounded-full bg-white/35 backdrop-blur-md border-3 border-white/90 shadow-2xl flex flex-col items-center justify-center cursor-pointer hover:scale-115 transition-transform"
            >
              <span className="text-3xl font-black text-white drop-shadow-md">{b.item.letter}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
