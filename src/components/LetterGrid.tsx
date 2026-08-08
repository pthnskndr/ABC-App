import React, { useState, useRef, useEffect } from 'react';
import { ALPHABET_DATA } from '../data/alphabetData';
import { AlphabetItem, AppSettings } from '../types';
import { LetterCard } from './LetterCard';
import { Search, PlayCircle, PauseCircle } from 'lucide-react';
import { speakText, stopSpeech, playPopSound } from '../utils/audioSynth';

interface LetterGridProps {
  settings: AppSettings;
  onSelectLetter: (item: AlphabetItem) => void;
}

export const LetterGrid: React.FC<LetterGridProps> = ({ settings, onSelectLetter }) => {
  const [filterType, setFilterType] = useState<'all' | 'vowels' | 'consonants'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlayingSeq, setIsPlayingSeq] = useState(false);
  const [activeSeqIndex, setActiveSeqIndex] = useState<number | null>(null);

  const isPlayingRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      stopSpeech();
    };
  }, []);

  const filteredItems = ALPHABET_DATA.filter((item) => {
    if (filterType === 'vowels' && !item.isVowel) return false;
    if (filterType === 'consonants' && item.isVowel) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.letter.toLowerCase().includes(q) ||
        item.word.toLowerCase().includes(q) ||
        item.sound.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stopSequence = () => {
    isPlayingRef.current = false;
    setIsPlayingSeq(false);
    setActiveSeqIndex(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    stopSpeech();
  };

  const playNextSequenceIndex = (index: number, itemsToPlay: AlphabetItem[]) => {
    if (!isPlayingRef.current) return;

    if (index >= itemsToPlay.length) {
      stopSequence();
      return;
    }

    setActiveSeqIndex(index);
    const item = itemsToPlay[index];
    const speechTextStr = `${item.letter}! ${item.letter} is for ${item.word}!`;

    speakText(speechTextStr, settings, () => {
      if (!isPlayingRef.current) return;
      timerRef.current = setTimeout(() => {
        if (isPlayingRef.current) {
          playNextSequenceIndex(index + 1, itemsToPlay);
        }
      }, 300);
    });
  };

  const handleTogglePlaySequence = () => {
    if (isPlayingSeq) {
      stopSequence();
    } else {
      stopSpeech();
      isPlayingRef.current = true;
      setIsPlayingSeq(true);
      playNextSequenceIndex(0, filteredItems);
    }
  };

  const handleSelectCard = (item: AlphabetItem) => {
    if (isPlayingSeq) {
      stopSequence();
    }
    onSelectLetter(item);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Top Banner & Filter Controls */}
      <div className="bg-white rounded-[32px] p-5 border-4 sm:border-8 border-[#FDE68A] shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Banner Text */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-[#FFD93D] shadow-[0_4px_0_#D97706] flex items-center justify-center text-3xl font-black text-[#B45309]">
            🔤
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#B45309] tracking-wider uppercase">
              A–Z Letter Sound Grid
            </h2>
            <p className="text-xs sm:text-sm text-[#D97706] font-bold">
              Tap any letter card to hear its letter & word!
            </p>
          </div>
        </div>

        {/* Filter Pills & Sequence Button */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <div className="flex items-center bg-[#FFFBEB] p-1.5 rounded-2xl border-2 border-[#FDE68A] text-xs font-black gap-1">
            <button
              onClick={() => {
                if (isPlayingSeq) stopSequence();
                setFilterType('all');
                playPopSound();
              }}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                filterType === 'all'
                  ? 'bg-[#FFD93D] text-[#B45309] shadow-[0_3px_0_#D97706] translate-y-[-1px]'
                  : 'text-slate-700 hover:text-[#B45309] hover:bg-white/60'
              }`}
            >
              All (26)
            </button>
            <button
              onClick={() => {
                if (isPlayingSeq) stopSequence();
                setFilterType('vowels');
                playPopSound();
              }}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                filterType === 'vowels'
                  ? 'bg-[#FF6B6B] text-white shadow-[0_3px_0_#C94A4A] translate-y-[-1px]'
                  : 'text-slate-700 hover:text-[#FF6B6B] hover:bg-white/60'
              }`}
            >
              Vowels (5)
            </button>
            <button
              onClick={() => {
                if (isPlayingSeq) stopSequence();
                setFilterType('consonants');
                playPopSound();
              }}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                filterType === 'consonants'
                  ? 'bg-[#4D96FF] text-white shadow-[0_3px_0_#3B7DDB] translate-y-[-1px]'
                  : 'text-slate-700 hover:text-[#4D96FF] hover:bg-white/60'
              }`}
            >
              Consonants
            </button>
          </div>

          <button
            onClick={handleTogglePlaySequence}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm text-white flex items-center gap-2 transition-all ${
              isPlayingSeq
                ? 'bg-[#FF6B6B] shadow-[0_4px_0_#C94A4A]'
                : 'bg-[#6BCB77] shadow-[0_4px_0_#4E9E56] hover:translate-y-[2px] active:translate-y-[4px]'
            }`}
          >
            {isPlayingSeq ? (
              <>
                <PauseCircle className="w-4 h-4" />
                <span>Stop Sequence</span>
              </>
            ) : (
              <>
                <PlayCircle className="w-4 h-4" />
                <span>Play All A–Z Letters</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D97706]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search letter or object (e.g. A, Apple)..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border-3 border-[#FDE68A] text-sm font-black text-[#B45309] placeholder:text-[#D97706]/60 focus:outline-none focus:ring-4 focus:ring-[#FFD93D] shadow-md"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-[#D97706] hover:text-[#B45309]"
          >
            Clear
          </button>
        )}
      </div>

      {/* Letter Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
        {filteredItems.map((item, idx) => {
          const isHighlighted = activeSeqIndex !== null && filteredItems[activeSeqIndex]?.letter === item.letter;
          return (
            <div
              key={item.letter}
              className={isHighlighted ? 'ring-4 ring-[#FFD93D] rounded-3xl scale-105 transition-all shadow-2xl' : ''}
            >
              <LetterCard
                item={item}
                settings={settings}
                onSelect={handleSelectCard}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
