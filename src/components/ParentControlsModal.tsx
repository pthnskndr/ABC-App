import React, { useEffect, useState } from 'react';
import { X, Settings, Volume2, Sliders, Check, RotateCcw } from 'lucide-react';
import { AppSettings } from '../types';
import { getAvailableVoices, speakText, playPopSound } from '../utils/audioSynth';

interface ParentControlsModalProps {
  settings: AppSettings;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const ParentControlsModal: React.FC<ParentControlsModalProps> = ({
  settings,
  isOpen,
  onClose,
  onUpdateSettings
}) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const updateVoices = () => {
      setVoices(getAvailableVoices());
    };
    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  if (!isOpen) return null;

  const handleTestVoice = () => {
    playPopSound();
    speakText('Hello little learner! A... aaa, B... buh!', settings);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-[32px] sm:rounded-[40px] bg-white p-6 sm:p-7 shadow-2xl border-4 sm:border-8 border-[#FDE68A] space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#FDE68A]">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#B45309]" />
            <h3 className="text-lg font-black text-[#B45309]">Parent & Educator Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#FFFBEB] hover:bg-[#FFD93D]/30 text-[#B45309] border-2 border-[#FDE68A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Speech Rate Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-black text-[#B45309]">
            <span>Speech Pace (Slow for Babies):</span>
            <span className="text-[#D97706] bg-[#FFFBEB] px-2 py-0.5 rounded-lg border border-[#FDE68A]">{settings.speechRate.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.1"
            step="0.05"
            value={settings.speechRate}
            onChange={(e) => onUpdateSettings({ speechRate: parseFloat(e.target.value) })}
            className="w-full accent-[#FFD93D] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#D97706] font-bold">
            <span>🐢 Very Slow (Baby)</span>
            <span>Normal</span>
          </div>
        </div>

        {/* Speech Pitch Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-black text-[#B45309]">
            <span>Voice Pitch (Cheerfulness):</span>
            <span className="text-[#D97706] bg-[#FFFBEB] px-2 py-0.5 rounded-lg border border-[#FDE68A]">{settings.speechPitch.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.8"
            max="1.4"
            step="0.05"
            value={settings.speechPitch}
            onChange={(e) => onUpdateSettings({ speechPitch: parseFloat(e.target.value) })}
            className="w-full accent-[#FFD93D] cursor-pointer"
          />
        </div>

        {/* Voice Selector */}
        {voices.length > 0 && (
          <div className="space-y-1.5">
            <label className="text-xs font-black text-[#B45309]">Narrator Voice:</label>
            <select
              value={settings.selectedVoiceURI || ''}
              onChange={(e) => onUpdateSettings({ selectedVoiceURI: e.target.value || null })}
              className="w-full p-2.5 rounded-xl bg-[#FFFBEB] border-2 border-[#FDE68A] text-xs font-bold text-[#B45309] focus:ring-2 focus:ring-[#FFD93D] focus:outline-none"
            >
              <option value="">Default Friendly Voice</option>
              {voices
                .filter((v) => v.lang.startsWith('en'))
                .map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Auto Repeat Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFFBEB] border-2 border-[#FDE68A]">
          <div>
            <div className="text-xs font-black text-[#B45309]">Auto-Repeat Letter Sounds</div>
            <div className="text-[10px] text-[#D97706] font-bold">Repeats sound twice for better memory retention</div>
          </div>
          <input
            type="checkbox"
            checked={settings.autoRepeatSound}
            onChange={(e) => onUpdateSettings({ autoRepeatSound: e.target.checked })}
            className="w-5 h-5 accent-[#FFD93D] rounded cursor-pointer"
          />
        </div>

        {/* Test Voice & Close */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleTestVoice}
            className="flex-1 py-3 rounded-2xl bg-[#FFD93D] hover:bg-[#FFD93D]/90 text-[#B45309] font-black text-xs shadow-[0_3px_0_#D97706] flex items-center justify-center gap-1.5 transition-transform active:translate-y-[1px]"
          >
            <Volume2 className="w-4 h-4" />
            <span>Test Narrator Voice</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white font-black text-xs shadow-[0_3px_0_#C94A4A] transition-transform active:translate-y-[1px]"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
