import React from 'react';
import { ViewMode } from '../types';
import { Play, Grid, Gamepad2, Settings, Music } from 'lucide-react';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onOpenSettings: () => void;
  onOpenDownload?: () => void;
  bgMusicEnabled: boolean;
  onToggleBgMusic: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onOpenSettings,
  bgMusicEnabled,
  onToggleBgMusic
}) => {
  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b-4 border-[#FDE68A] shadow-sm px-4 py-3">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
        {/* Brand / Title */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onViewChange('video')}>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#EA580C] to-[#F59E0B] flex items-center justify-center text-white font-black text-xl shadow-[0_4px_0_#D97706] transform group-hover:scale-105 transition-all">
            abc
          </div>
          <div className="text-left">
            <h1 className="text-xl sm:text-2xl font-black text-[#B45309] tracking-wider uppercase drop-shadow-xs">
              ABC Letter Sounds
            </h1>
            <p className="text-xs text-[#D97706] font-bold">
              Cheerful, slow-paced A–Z learning for babies & toddlers
            </p>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center bg-[#FFFBEB] p-1.5 rounded-full border-2 border-[#FDE68A] shadow-inner max-w-full overflow-x-auto gap-1">
          <button
            onClick={() => onViewChange('video')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full font-black text-sm sm:text-base transition-all whitespace-nowrap ${
              currentView === 'video'
                ? 'bg-[#E11D48] text-white shadow-[0_3px_0_#9F1239] translate-y-[-1px]'
                : 'text-slate-700 hover:text-[#E11D48] hover:bg-white/80'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Watch Video Show</span>
          </button>

          <button
            onClick={() => onViewChange('grid')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-black text-sm sm:text-base transition-all whitespace-nowrap ${
              currentView === 'grid'
                ? 'bg-[#4D96FF] text-white shadow-[0_3px_0_#3B7DDB] translate-y-[-1px]'
                : 'text-slate-700 hover:text-[#4D96FF] hover:bg-white/80'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>A–Z Sound Grid</span>
          </button>

          <button
            onClick={() => onViewChange('games')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-black text-sm sm:text-base transition-all whitespace-nowrap ${
              currentView === 'games'
                ? 'bg-[#6BCB77] text-white shadow-[0_3px_0_#4E9E56] translate-y-[-1px]'
                : 'text-slate-700 hover:text-[#6BCB77] hover:bg-white/80'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Toddler Games</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD93D] border border-[#D97706] animate-pulse" />
          </button>
        </div>

        {/* Tools Buttons below Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleBgMusic}
            title={bgMusicEnabled ? 'Mute Background Melody' : 'Play Background Melody'}
            className={`p-2.5 rounded-2xl transition-all flex items-center justify-center border-2 ${
              bgMusicEnabled
                ? 'bg-[#FFD93D] text-[#B45309] border-[#D97706] shadow-[0_3px_0_#D97706]'
                : 'bg-white text-[#B45309] border-[#FDE68A] hover:bg-[#FFFBEB] shadow-xs'
            }`}
          >
            <Music className={`w-5 h-5 ${bgMusicEnabled ? 'animate-bounce' : ''}`} />
          </button>

          <button
            onClick={onOpenSettings}
            title="Settings"
            className="p-2.5 rounded-2xl bg-white text-[#B45309] border-2 border-[#FDE68A] hover:bg-[#FFFBEB] transition-all shadow-xs"
          >
            <Settings className="w-5 h-5 text-[#B45309]" />
          </button>
        </div>
      </div>
    </header>
  );
};
