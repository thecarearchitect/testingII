'use client';

import { useState, useEffect } from 'react';
import { Heart, Shield, Info, X } from 'lucide-react';
import ModeSelector from '@/components/ModeSelector';
import ChatInterface from '@/components/ChatInterface';
import DisclaimerModal from '@/components/DisclaimerModal';
import { ModeId, DEFAULT_MODE_ID, MODES } from '@/lib/modes';

export default function Home() {
  const [activeMode, setActiveMode] = useState<ModeId>(DEFAULT_MODE_ID);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('disclaimer-accepted');
    if (stored === 'true') {
      setAccepted(true);
    } else {
      setShowDisclaimer(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('disclaimer-accepted', 'true');
    setAccepted(true);
    setShowDisclaimer(false);
  };

  const activeModeMeta = MODES.find((m) => m.id === activeMode) ?? MODES[0];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {showDisclaimer && <DisclaimerModal onAccept={handleAccept} />}

      {/* Header */}
      <header className="glass-dark flex-shrink-0">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
              <Heart size={15} className="text-amber-300" fill="currentColor" />
            </div>
            <div>
              <span className="font-semibold text-white/90 text-sm tracking-wide">PflegeAssistent</span>
              <span className="text-amber-400 font-semibold text-sm"> KI</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowDisclaimer(true)}
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-amber-300 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/5"
            >
              <Shield size={12} />
              <span className="hidden sm:inline">Hinweise</span>
            </button>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-amber-300 hover:bg-white/5 transition-colors"
            >
              <Info size={15} />
            </button>
          </div>
        </div>

        {showInfo && (
          <div className="border-t border-white/10 max-w-3xl mx-auto">
            <div className="px-4 py-3 relative">
              <button onClick={() => setShowInfo(false)} className="absolute top-2.5 right-3 text-white/30 hover:text-white/60">
                <X size={14} />
              </button>
              <p className="text-xs text-white/50 leading-relaxed pr-5">
                Informationen basieren auf Fachwissen aus deutschen Pflegekassen, Sozialverbänden und Behörden.
                Kein Ersatz für individuelle Beratung – wende dich bei konkreten Fällen an Pflegestützpunkte, VdK oder deine Pflegekasse.
              </p>
            </div>
          </div>
        )}
      </header>

      {/* Mode selector */}
      <div className="glass-dark border-t-0 flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          <ModeSelector activeMode={activeMode} onSelect={setActiveMode} />
        </div>
      </div>

      {/* Active mode label */}
      <div className="max-w-3xl mx-auto w-full px-4 pt-3 flex-shrink-0">
        <div className="flex items-center gap-2 text-xs text-white/40">
          <span>{activeModeMeta.icon}</span>
          <span>{activeModeMeta.subtitle}</span>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-hidden max-w-3xl w-full mx-auto">
        {accepted ? (
          <ChatInterface modeId={activeMode} />
        ) : (
          <div className="flex items-center justify-center h-full text-white/30 text-sm">
            Bitte zuerst die Hinweise bestätigen…
          </div>
        )}
      </div>
    </div>
  );
}
