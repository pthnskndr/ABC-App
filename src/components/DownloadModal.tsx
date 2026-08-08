import React, { useState } from 'react';
import { X, Download, FileText, Printer, Code, Sparkles, Check, Smartphone, ShieldCheck } from 'lucide-react';
import { ALPHABET_DATA } from '../data/alphabetData';
import { playPopSound } from '../utils/audioSynth';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  const [downloadedApp, setDownloadedApp] = useState(false);
  const [downloadedCards, setDownloadedCards] = useState(false);

  if (!isOpen) return null;

  // Generate self-contained Offline Single-File HTML App
  const handleDownloadOfflineHtml = () => {
    playPopSound();

    const offlineHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ABC Letter Sounds - Offline Baby & Toddler Phonics</title>
  <style>
    :root {
      --bg: #FFFBEB;
      --card-bg: #FFFFFF;
      --border: #FDE68A;
      --primary: #B45309;
      --accent: #FFD93D;
      --accent-dark: #D97706;
      --vowel-bg: #FFE4E6;
      --vowel-color: #E11D48;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
    body { background: var(--bg); color: #1E293B; padding: 16px; text-align: center; }
    header { background: #FFF; border: 4px solid var(--border); padding: 16px; border-radius: 24px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    h1 { color: var(--primary); font-size: 24px; font-weight: 900; margin-bottom: 4px; text-transform: uppercase; }
    p { color: var(--accent-dark); font-size: 14px; font-weight: 700; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 12px; max-width: 900px; margin: 0 auto; }
    .card { background: var(--card-bg); border: 3px solid var(--border); border-radius: 20px; padding: 16px; cursor: pointer; transition: transform 0.15s ease, box-shadow 0.15s ease; box-shadow: 0 4px 0 var(--border); display: flex; flex-col; align-items: center; justify-content: space-between; min-height: 140px; }
    .card:hover { transform: translateY(-3px); border-color: var(--accent-dark); }
    .card:active { transform: translateY(0); }
    .letter { font-size: 48px; font-weight: 900; color: var(--primary); line-height: 1; }
    .emoji { font-size: 32px; margin: 6px 0; }
    .word { font-size: 13px; font-weight: 800; color: var(--accent-dark); }
    .sound { font-size: 11px; font-weight: 800; background: #FFFBEB; padding: 2px 8px; border-radius: 12px; border: 1px solid var(--border); color: var(--primary); margin-top: 4px; }
    .footer { margin-top: 30px; font-size: 12px; color: var(--accent-dark); font-weight: 700; }
    .vowel { border-color: #FDA4AF; background: #FFF5F5; }
    .speaker-btn { margin-top: 8px; background: var(--accent); border: none; padding: 6px 12px; border-radius: 12px; font-weight: 900; color: var(--primary); box-shadow: 0 2px 0 var(--accent-dark); cursor: pointer; }
  </style>
</head>
<body>
  <header>
    <h1>🔤 ABC Letter Sounds</h1>
    <p>Offline Baby & Toddler Phonics Sound Cards</p>
  </header>

  <div className="grid" id="grid"></div>

  <div class="footer">
    👶 Works 100% Offline without internet! Tap any card to hear its sound.
  </div>

  <script>
    const items = ${JSON.stringify(ALPHABET_DATA)};
    const grid = document.getElementById('grid');

    function speak(text) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 0.85;
        u.pitch = 1.15;
        window.speechSynthesis.speak(u);
      }
    }

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card ' + (item.isVowel ? 'vowel' : '');
      card.innerHTML = \`
        <div class="letter">\${item.letter}\${item.letter.toLowerCase()}</div>
        <div class="emoji">\${item.emoji}</div>
        <div class="word">\${item.word}</div>
        <button class="speaker-btn">🔊 Hear</button>
      \`;
      card.onclick = () => {
        speak(\`\${item.letter} is for \${item.word}.\`);
      };
      grid.appendChild(card);
    });
  </script>
</body>
</html>`;

    const blob = new Blob([offlineHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ABC_Letter_Sounds_Offline_App.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadedApp(true);
  };

  // Generate Printable Flashcards PDF/HTML sheet
  const handleDownloadPrintableCards = () => {
    playPopSound();

    const printableHtml = `<!DOCTYPE html>
<html>
<head>
  <title>ABC Phonics Printable Flashcards</title>
  <style>
    @media print {
      body { -webkit-print-color-adjust: exact; padding: 0; }
      .no-print { display: none; }
    }
    body { font-family: system-ui, sans-serif; padding: 20px; background: #fff; color: #1e293b; text-align: center; }
    h1 { color: #b45309; font-size: 28px; margin-bottom: 5px; }
    p { color: #d97706; font-size: 14px; font-weight: bold; margin-bottom: 20px; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; page-break-inside: avoid; }
    .card { border: 3px solid #fde68a; border-radius: 16px; padding: 15px; background: #fffbeb; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .letter { font-size: 42px; font-weight: 900; color: #b45309; margin-bottom: 4px; }
    .emoji { font-size: 36px; margin: 4px 0; }
    .word { font-size: 14px; font-weight: 800; color: #1e293b; }
    .sound { font-size: 11px; font-weight: 800; color: #d97706; margin-top: 2px; }
    .btn { background: #ffd93d; color: #b45309; border: 2px solid #d97706; padding: 10px 20px; font-weight: 900; border-radius: 12px; cursor: pointer; margin-bottom: 20px; font-size: 16px; }
  </style>
</head>
<body>
  <div class="no-print">
    <button class="btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>
  <h1>🔤 A–Z Phonics Flashcards for Babies & Toddlers</h1>
  <p>Cut out or print for home learning!</p>
  <div class="grid">
    ${ALPHABET_DATA.map(
      (item) => `
      <div class="card">
        <div class="letter">${item.letter}${item.letter.toLowerCase()}</div>
        <div class="emoji">${item.emoji}</div>
        <div class="word">${item.word}</div>
      </div>
    `
    ).join('')}
  </div>
</body>
</html>`;

    const blob = new Blob([printableHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.focus();
    }
    setDownloadedCards(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-[32px] sm:rounded-[40px] bg-white p-6 sm:p-8 shadow-2xl border-4 sm:border-8 border-[#FDE68A] space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#FDE68A]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-[#FFD93D] text-[#B45309] shadow-xs">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-[#B45309]">Download App & Materials</h3>
              <p className="text-xs text-[#D97706] font-bold">Offline access for phones, tablets & classroom</p>
            </div>
          </div>
          <button
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className="p-2 rounded-2xl bg-[#FFFBEB] hover:bg-[#FFD93D]/30 text-[#B45309] border-2 border-[#FDE68A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Download Options */}
        <div className="space-y-4">
          {/* Option 1: Standalone Offline Web App File */}
          <div className="p-4 rounded-3xl bg-[#FFFBEB] border-3 border-[#FDE68A] space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 bg-white rounded-2xl border-2 border-[#FDE68A] shadow-xs">📱</span>
                <div>
                  <h4 className="font-black text-[#B45309] text-base">Offline Web Application (.html)</h4>
                  <p className="text-xs text-[#D97706] font-bold">
                    Single file app. Open on phone, iPad, or laptop without internet!
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleDownloadOfflineHtml}
              className={`w-full py-3 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
                downloadedApp
                  ? 'bg-[#6BCB77] text-white shadow-[0_3px_0_#4E9E56]'
                  : 'bg-[#FFD93D] hover:bg-[#FFD93D]/90 text-[#B45309] shadow-[0_3px_0_#D97706] active:translate-y-[1px]'
              }`}
            >
              {downloadedApp ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              <span>{downloadedApp ? 'Offline Web App Downloaded!' : 'Download Offline App File (.html)'}</span>
            </button>
          </div>

          {/* Option 2: Printable A-Z Flashcards */}
          <div className="p-4 rounded-3xl bg-[#FFFBEB] border-3 border-[#FDE68A] space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 bg-white rounded-2xl border-2 border-[#FDE68A] shadow-xs">🖨️</span>
                <div>
                  <h4 className="font-black text-[#B45309] text-base">Printable A–Z Flashcards</h4>
                  <p className="text-xs text-[#D97706] font-bold">
                    Clean color grid sheet to print or save as PDF for toddlers.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleDownloadPrintableCards}
              className={`w-full py-3 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
                downloadedCards
                  ? 'bg-[#6BCB77] text-white shadow-[0_3px_0_#4E9E56]'
                  : 'bg-[#4D96FF] hover:bg-[#4D96FF]/90 text-white shadow-[0_3px_0_#3B7DDB] active:translate-y-[1px]'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Open Printable Flashcards PDF Sheet</span>
            </button>
          </div>

          {/* Option 3: Export Source Code instructions */}
          <div className="p-4 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-slate-800 font-black text-sm">
              <Code className="w-4 h-4 text-[#B45309]" />
              <span>Download Full Source Code (Developer ZIP)</span>
            </div>
            <p className="text-xs text-slate-600 font-bold leading-relaxed">
              To download the complete React source code repository, click the <strong className="text-[#B45309]">Settings / Export</strong> menu in the top bar of AI Studio and select <strong className="text-[#B45309]">Export Project as ZIP</strong> or <strong className="text-[#B45309]">Push to GitHub</strong>.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center pt-2">
          <button
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className="w-full py-3 rounded-2xl bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white font-black text-sm shadow-[0_3px_0_#C94A4A] transition-transform active:translate-y-[1px]"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
