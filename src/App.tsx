/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VideoPlayer } from './components/VideoPlayer';
import { LetterGrid } from './components/LetterGrid';
import { PhonicsGames } from './components/PhonicsGames';
import { LetterDetailModal } from './components/LetterDetailModal';
import { ParentControlsModal } from './components/ParentControlsModal';
import { DownloadModal } from './components/DownloadModal';
import { AlphabetItem, AppSettings, ViewMode } from './types';
import { getLetterItem } from './data/alphabetData';
import { toggleBackgroundMusic, playPopSound } from './utils/audioSynth';
import { Sparkles, Heart, Baby, Music, Play, Download } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('video');
  const [selectedLetter, setSelectedLetter] = useState<AlphabetItem | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [bgMusicEnabled, setBgMusicEnabled] = useState(false);

  const [settings, setSettings] = useState<AppSettings>({
    speechRate: 0.85,
    speechPitch: 1.30,
    autoRepeatSound: true,
    backgroundMusic: false,
    bgMusicVolume: 0.05,
    selectedVoiceURI: null,
    highContrast: false
  });

  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleToggleBgMusic = () => {
    const nextState = !bgMusicEnabled;
    setBgMusicEnabled(nextState);
    toggleBackgroundMusic(nextState, settings.bgMusicVolume);
    playPopSound();
  };

  const handleSelectLetterForDetail = (letter: string) => {
    const item = getLetterItem(letter);
    setSelectedLetter(item);
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] text-slate-800 font-sans flex flex-col selection:bg-[#FFD93D]/40 select-none">
      {/* Top Navigation Header */}
      <Header
        currentView={currentView}
        onViewChange={(v) => {
          setCurrentView(v);
          playPopSound();
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDownload={() => {
          setIsDownloadOpen(true);
          playPopSound();
        }}
        bgMusicEnabled={bgMusicEnabled}
        onToggleBgMusic={handleToggleBgMusic}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {currentView === 'video' && (
          <VideoPlayer
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onSelectLetterForDetail={handleSelectLetterForDetail}
          />
        )}

        {currentView === 'grid' && (
          <LetterGrid
            settings={settings}
            onSelectLetter={(item) => setSelectedLetter(item)}
          />
        )}

        {currentView === 'games' && (
          <PhonicsGames settings={settings} />
        )}
      </main>

      {/* Letter Detail Modal */}
      <LetterDetailModal
        item={selectedLetter}
        settings={settings}
        onClose={() => setSelectedLetter(null)}
        onSelectLetter={(item) => setSelectedLetter(item)}
      />

      {/* Settings Modal */}
      <ParentControlsModal
        settings={settings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Download Modal */}
      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t-4 border-[#FDE68A] py-6 px-4 mt-8 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 bg-[#FFD93D] rounded-2xl shadow-[0_3px_0_#D97706]">🎵</span>
            <div>
              <p className="font-black text-base text-[#B45309]">
                ABC Letter Sounds for Babies & Toddlers
              </p>
              <p className="text-xs text-[#D97706] font-bold">
                A–Z Phonics Learning • Slow-Paced • Cheerful Speech Narration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-black">
            <button
              onClick={() => {
                setIsDownloadOpen(true);
                playPopSound();
              }}
              className="px-4 py-2 rounded-2xl bg-[#FFD93D] hover:bg-[#FFD93D]/90 text-[#B45309] border-2 border-[#D97706] shadow-[0_3px_0_#D97706] transition-transform active:translate-y-[1px] flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download App</span>
            </button>
            <span className="hidden sm:inline-block px-3.5 py-1.5 rounded-2xl bg-[#FFFBEB] text-[#B45309] border-2 border-[#FDE68A] shadow-xs">
              👶 Toddler Friendly
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
