'use client';

import { useState, useEffect } from 'react';
import { Heart, Shield, Info, X, Settings } from 'lucide-react';
import ModeSelector from '@/components/ModeSelector';
import ChatInterface from '@/components/ChatInterface';
import DisclaimerModal from '@/components/DisclaimerModal';
import SettingsPanel, { UserSettings } from '@/components/SettingsPanel';
import { ModeId, DEFAULT_MODE_ID, MODES } from '@/lib/modes';

const DEFAULT_SETTINGS: UserSettings = { personalContext: '', customInstructions: '' };

export default function Home() {
  const [activeMode, setActiveMode] = useState<ModeId>(DEFAULT_MODE_ID);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [chatKey, setChatKey] = useState(0); // increment to reset chat

  useEffect(() => {
    const accepted = localStorage.getItem('disclaimer-accepted');
    if (accepted === 'true') setAccepted(true);
    else setShowDisclaimer(true);

    const saved = localStorage.getItem('user-settings');
    if (saved) {
      try { setUserSettings(JSON.parse(saved)); } catch {}
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('disclaimer-accepted', 'true');
    setAccepted(true);
    setShowDisclaimer(false);
  };

  const handleSaveSettings = (settings: UserSettings) => {
    localStorage.setItem('user-settings', JSON.stringify(settings));
    setUserSettings(settings);
  };

  const handleLogoClick = () => {
    setActiveMode(DEFAULT_MODE_ID);
    setChatKey((k) => k + 1); // resets chat
  };

  const activeModeMeta = MODES.find((m) => m.id === activeMode) ?? MODES[0];
  const hasSettings = userSettings.personalContext.trim() || userSettings.customInstructions.trim();

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {showDisclaimer && <DisclaimerModal onAccept={handleAccept} />}
      {showSettings && (
        <SettingsPanel
          onClose={() => setShowSettings(false)}
          onSave={handleSaveSettings}
          initial={userSettings}
        />
      )}

      {/* Header */}
      <header className="glass-dark flex-shrink-0">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">

          {/* Logo – click resets to home */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
              <Heart size={15} className="text-amber-300" fill="currentColor" />
            </div>
            <div className="text-left">
              <span className="font-semibold text-white/90 text-sm tracking-wide">PflegeAssistent</span>
              <span className="text-amber-400 font-semibold text-sm"> KI</span>
            </div>
          </button>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowSettings(true)}
              title="Persönliche Einstellungen"
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                hasSettings
                  ? 'text-amber-400 hover:bg-amber-500/10'
                  : 'text-white/40 hover:text-amber-300 hover:bg-white/5'
              }`}
            >
              <Settings size={14} />
              <span className="hidden sm:inline text-xs">
                {hasSettings ? 'Mein Profil ✓' : 'Einstellungen'}
              </span>
            </button>
            <button
              onClick={() => setShowDisclaimer(true)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-amber-300 hover:bg-white/5 transition-colors"
              title="Hinweise"
            >
              <Shield size={14} />
            </button>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-amber-300 hover:bg-white/5 transition-colors"
            >
              <Info size={14} />
            </button>
          </div>
        </div>

        {showInfo && (
          <div className="border-t border-white/8 max-w-3xl mx-auto">
            <div className="px-4 py-3 relative">
              <button onClick={() => setShowInfo(false)} className="absolute top-2.5 right-3 text-white/30 hover:text-white/60">
                <X size={14} />
              </button>
              <p className="text-xs text-white/45 leading-relaxed pr-5">
                Informationen basieren auf Fachwissen aus deutschen Pflegekassen, Sozialverbänden und Behörden.
                Kein Ersatz für individuelle Beratung – wende dich bei konkreten Fällen an Pflegestützpunkte, VdK oder deine Pflegekasse.
              </p>
            </div>
          </div>
        )}
      </header>

      {/* Mode selector */}
      <div className="glass-dark border-t border-white/5 flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          <ModeSelector activeMode={activeMode} onSelect={setActiveMode} />
        </div>
      </div>

      {/* Mode label */}
      <div className="max-w-3xl mx-auto w-full px-4 pt-3 flex-shrink-0">
        <div className="flex items-center gap-2 text-xs text-white/35">
          <span>{activeModeMeta.icon}</span>
          <span>{activeModeMeta.subtitle}</span>
          {hasSettings && (
            <span className="ml-auto text-amber-500/50 text-xs">● Persönlicher Kontext aktiv</span>
          )}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-hidden max-w-3xl w-full mx-auto">
        {accepted ? (
          <ChatInterface
            key={`${activeMode}-${chatKey}`}
            modeId={activeMode}
            userSettings={userSettings}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white/30 text-sm">
            Bitte zuerst die Hinweise bestätigen…
          </div>
        )}
      </div>
    </div>
  );
}
