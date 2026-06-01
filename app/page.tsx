'use client';

import { useState, useEffect } from 'react';
import { Heart, Info, X, Shield } from 'lucide-react';
import ModeSelector from '@/components/ModeSelector';
import ChatInterface from '@/components/ChatInterface';
import DisclaimerModal from '@/components/DisclaimerModal';
import { ModeId, DEFAULT_MODE_ID, MODES } from '@/lib/modes';

export default function Home() {
  const [activeMode, setActiveMode] = useState<ModeId>(DEFAULT_MODE_ID);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [showInfoBanner, setShowInfoBanner] = useState(false);

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
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Disclaimer Modal */}
      {showDisclaimer && <DisclaimerModal onAccept={handleAccept} />}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 flex-shrink-0">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Heart size={16} className="text-white" fill="white" />
            </div>
            <div>
              <span className="font-bold text-slate-800 text-sm">PflegeAssistent</span>
              <span className="text-blue-600 font-bold text-sm"> KI</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDisclaimer(true)}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-colors px-2 py-1 rounded-lg hover:bg-blue-50"
            >
              <Shield size={13} />
              <span className="hidden sm:inline">Hinweise</span>
            </button>
            <button
              onClick={() => setShowInfoBanner(!showInfoBanner)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Info size={15} />
            </button>
          </div>
        </div>

        {/* Info banner */}
        {showInfoBanner && (
          <div className="bg-blue-50 border-t border-blue-100 max-w-3xl mx-auto">
            <div className="px-4 py-3 relative">
              <button
                onClick={() => setShowInfoBanner(false)}
                className="absolute top-2.5 right-3 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
              <p className="text-xs text-blue-700 leading-relaxed pr-5">
                Informationen basieren auf öffentlich zugänglichem Fachwissen aus deutschen
                Pflegekassen, Sozialverbänden und Behörden. Kein Ersatz für individuelle Beratung –
                wende dich bei konkreten Fällen an Pflegestützpunkte, VdK oder deine Pflegekasse.
              </p>
            </div>
          </div>
        )}
      </header>

      {/* Mode selector */}
      <div className="bg-white border-b border-slate-100 flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          <ModeSelector activeMode={activeMode} onSelect={setActiveMode} />
        </div>
      </div>

      {/* Current mode label */}
      <div className="max-w-3xl mx-auto w-full px-4 pt-3 flex-shrink-0">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full w-fit text-xs font-medium ${activeModeMeta.bgColor} ${activeModeMeta.color}`}>
          <span>{activeModeMeta.icon}</span>
          <span>{activeModeMeta.subtitle}</span>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-hidden max-w-3xl w-full mx-auto">
        {accepted ? (
          <ChatInterface modeId={activeMode} />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm">
            Bitte zuerst die Hinweise bestätigen…
          </div>
        )}
      </div>
    </div>
  );
}
