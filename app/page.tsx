'use client';

import { useState, useEffect } from 'react';
import { Heart, Settings, Shield, ArrowRight, X } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import DisclaimerModal from '@/components/DisclaimerModal';
import SettingsPanel, { UserSettings } from '@/components/SettingsPanel';
import { ModeId, MODES } from '@/lib/modes';

const DEFAULT_SETTINGS: UserSettings = { personalContext: '', customInstructions: '' };

/* ── gradient configs per mode ─────────── */
const CARD_STYLES: Record<ModeId, { gradient: string; glow: string; emoji: string }> = {
  allgemein:   { gradient: 'from-blue-900/60 to-indigo-800/40',   glow: 'rgba(99,102,241,0.3)',  emoji: '💬' },
  formular:    { gradient: 'from-emerald-900/60 to-teal-800/40',  glow: 'rgba(16,185,129,0.3)',  emoji: '📋' },
  widerspruch: { gradient: 'from-orange-900/60 to-amber-800/40',  glow: 'rgba(245,158,11,0.3)',  emoji: '✍️' },
  pflegealltag:{ gradient: 'from-purple-900/60 to-pink-800/40',   glow: 'rgba(168,85,247,0.3)',  emoji: '🏠' },
  rechtlich:   { gradient: 'from-rose-900/60 to-red-800/40',      glow: 'rgba(244,63,94,0.3)',   emoji: '⚖️' },
};

export default function Home() {
  const [view, setView]               = useState<'welcome' | 'chat'>('welcome');
  const [activeMode, setActiveMode]   = useState<ModeId>('allgemein');
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [accepted, setAccepted]       = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [chatKey, setChatKey]         = useState(0);
  const [hoveredMode, setHoveredMode] = useState<ModeId | null>(null);

  useEffect(() => {
    if (localStorage.getItem('disclaimer-accepted') === 'true') setAccepted(true);
    else setShowDisclaimer(true);
    const saved = localStorage.getItem('user-settings');
    if (saved) { try { setUserSettings(JSON.parse(saved)); } catch {} }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('disclaimer-accepted', 'true');
    setAccepted(true);
    setShowDisclaimer(false);
  };

  const handleSaveSettings = (s: UserSettings) => {
    localStorage.setItem('user-settings', JSON.stringify(s));
    setUserSettings(s);
  };

  const openChat = (modeId: ModeId) => {
    if (!accepted) { setShowDisclaimer(true); return; }
    setActiveMode(modeId);
    setChatKey((k) => k + 1);
    setView('chat');
  };

  const goHome = () => {
    setView('welcome');
    setChatKey((k) => k + 1);
  };

  const hasSettings = !!(userSettings.personalContext.trim() || userSettings.customInstructions.trim());

  /* ──────────────────────────────────────────
     CHAT VIEW
  ────────────────────────────────────────── */
  if (view === 'chat') {
    const mode = MODES.find(m => m.id === activeMode)!;
    return (
      <div className="flex flex-col h-screen overflow-hidden relative">
        <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />

        {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} onSave={handleSaveSettings} initial={userSettings} />}

        {/* Header */}
        <header className="glass-dark flex-shrink-0 relative z-10">
          <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
            <button onClick={goHome} className="flex items-center gap-2.5 hover:opacity-75 transition-opacity group">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
                <Heart size={14} className="text-amber-300" fill="currentColor" />
              </div>
              <span className="font-fraunces text-white/80 text-sm group-hover:text-white transition-colors">
                PflegeAssistent <span className="text-amber-400">KI</span>
              </span>
            </button>

            <div className="flex items-center gap-1">
              {/* Mode switcher pills */}
              <div className="hidden sm:flex gap-1 mr-2">
                {MODES.map(m => (
                  <button key={m.id}
                    onClick={() => { setActiveMode(m.id); setChatKey(k => k+1); }}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                      m.id === activeMode
                        ? 'bg-amber-500/25 text-amber-300 border border-amber-400/40'
                        : 'text-white/30 hover:text-white/60 hover:bg-white/5'
                    }`}
                  >{m.icon}</button>
                ))}
              </div>
              <button onClick={() => setShowSettings(true)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${hasSettings ? 'text-amber-400 hover:bg-amber-500/10' : 'text-white/30 hover:text-white/10'}`}>
                <Settings size={14} />
              </button>
              <button onClick={() => setShowDisclaimer(true)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white/60 transition-colors">
                <Shield size={14} />
              </button>
            </div>
          </div>
        </header>

        {/* Mode label */}
        <div className="relative z-10 max-w-3xl mx-auto w-full px-4 pt-3 flex-shrink-0 flex items-center gap-2">
          <span className="text-base">{mode.icon}</span>
          <span className="text-xs text-white/35 font-medium">{mode.title}</span>
          {hasSettings && <span className="ml-auto text-xs text-amber-500/50">● Persönlicher Kontext aktiv</span>}
        </div>

        <div className="flex-1 overflow-hidden relative z-10 max-w-3xl w-full mx-auto">
          <ChatInterface key={`${activeMode}-${chatKey}`} modeId={activeMode} userSettings={userSettings} />
        </div>

        {showDisclaimer && <DisclaimerModal onAccept={handleAccept} />}
      </div>
    );
  }

  /* ──────────────────────────────────────────
     WELCOME VIEW
  ────────────────────────────────────────── */
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />

      {showDisclaimer && <DisclaimerModal onAccept={handleAccept} />}
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} onSave={handleSaveSettings} initial={userSettings} />}

      {/* Header */}
      <header className="glass-dark relative z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
              <Heart size={14} className="text-amber-300" fill="currentColor" />
            </div>
            <span className="font-fraunces font-semibold text-white/90 text-sm">
              PflegeAssistent <span className="text-amber-400">KI</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowSettings(true)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all ${
                hasSettings
                  ? 'text-amber-300 border-amber-400/40 bg-amber-500/10 hover:bg-amber-500/20'
                  : 'text-white/40 border-white/10 hover:border-white/20 hover:text-white/60'
              }`}>
              <Settings size={12} />
              <span className="hidden sm:inline">{hasSettings ? 'Mein Profil ✓' : 'Einstellungen'}</span>
            </button>
            <button onClick={() => setShowDisclaimer(true)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-white/30 hover:text-white/60 transition-colors">
              <Shield size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 text-center pt-16 pb-10 px-6 max-w-3xl mx-auto">
        <div className="hero-float inline-block mb-6 fade-up fade-up-1">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20
                          border border-amber-400/30 flex items-center justify-center shadow-2xl shadow-amber-900/30">
            <span className="text-4xl">🤝</span>
          </div>
        </div>

        <h1 className="font-fraunces text-4xl sm:text-5xl lg:text-6xl font-light leading-tight mb-4 fade-up fade-up-2">
          <span className="text-white/90">Du bist</span>
          <br />
          <span className="gradient-text font-normal italic">nicht allein.</span>
        </h1>

        <p className="text-white/45 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-8 fade-up fade-up-3">
          Pflege ist eine der schwersten Aufgaben, die es gibt. Ich helfe dir mit Formularen,
          Widersprüchen, rechtlichen Fragen – und bin einfach da, wenn du eine Antwort brauchst.
        </p>

        <button
          onClick={() => openChat('allgemein')}
          className="fade-up fade-up-4 inline-flex items-center gap-2 px-6 py-3.5 rounded-full
                     bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm
                     hover:from-amber-400 hover:to-orange-400 transition-all duration-200
                     shadow-xl shadow-amber-900/40 hover:shadow-amber-800/50 hover:-translate-y-0.5"
        >
          Gespräch starten
          <ArrowRight size={16} />
        </button>
      </section>

      {/* Mode cards grid */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-16">
        <p className="text-xs font-semibold text-white/25 uppercase tracking-widest text-center mb-6">
          Womit kann ich dir helfen?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODES.map((mode, i) => {
            const style = CARD_STYLES[mode.id];
            return (
              <button
                key={mode.id}
                onClick={() => openChat(mode.id)}
                onMouseEnter={() => setHoveredMode(mode.id)}
                onMouseLeave={() => setHoveredMode(null)}
                className={`mode-card text-left p-5 rounded-2xl bg-gradient-to-br ${style.gradient}
                            backdrop-blur-xl border border-white/10 hover:border-white/20
                            fade-up`}
                style={{
                  animationDelay: `${0.1 * (i + 1)}s`,
                  boxShadow: hoveredMode === mode.id
                    ? `0 20px 60px ${style.glow}, 0 0 0 1px rgba(255,255,255,0.12)`
                    : '0 4px 24px rgba(0,0,0,0.3)',
                }}
              >
                <div className="text-3xl mb-3">{style.emoji}</div>
                <h3 className="font-fraunces text-white/90 font-semibold text-base mb-1.5">
                  {mode.title}
                </h3>
                <p className="text-white/40 text-xs leading-relaxed">
                  {mode.subtitle}
                </p>
                <div className="mt-4 flex items-center gap-1 text-white/30 text-xs font-medium group-hover:text-white/50">
                  <span>Jetzt fragen</span>
                  <ArrowRight size={11} />
                </div>
              </button>
            );
          })}

          {/* Personal context CTA card */}
          <button
            onClick={() => setShowSettings(true)}
            className="mode-card text-left p-5 rounded-2xl backdrop-blur-xl
                       border border-dashed border-amber-400/25 hover:border-amber-400/50
                       bg-amber-500/5 hover:bg-amber-500/10 transition-colors"
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
          >
            <div className="text-3xl mb-3">✨</div>
            <h3 className="font-fraunces text-amber-300/80 font-semibold text-base mb-1.5">
              Persönlicher Kontext
            </h3>
            <p className="text-white/30 text-xs leading-relaxed">
              {hasSettings
                ? 'Dein Profil ist aktiv – die KI kennt deine Situation.'
                : 'Erzähl mir einmalig von deiner Situation – dann werden alle Antworten persönlicher.'}
            </p>
            <div className="mt-4 text-xs text-amber-400/50 font-medium">
              {hasSettings ? 'Profil bearbeiten →' : 'Profil anlegen →'}
            </div>
          </button>
        </div>

        {/* Bottom disclaimer */}
        <p className="text-center text-xs text-white/20 mt-10 max-w-lg mx-auto leading-relaxed">
          Alle Informationen basieren auf öffentlichem Fachwissen aus deutschen Pflegekassen,
          Sozialverbänden und Behörden. Kein Ersatz für individuelle Beratung.{' '}
          <button onClick={() => setShowDisclaimer(true)} className="underline hover:text-white/40 transition-colors">
            Hinweise lesen
          </button>
        </p>
      </section>
    </div>
  );
}
