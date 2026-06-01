'use client';

import { useState, useEffect } from 'react';
import { Heart, Settings, Shield, ArrowRight, X } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import DisclaimerModal from '@/components/DisclaimerModal';
import SettingsPanel, { UserSettings } from '@/components/SettingsPanel';
import { ModeId, MODES } from '@/lib/modes';

const DEFAULT_SETTINGS: UserSettings = { personalContext: '', customInstructions: '' };

/* ── gradient configs per mode ─────────── */
const CARD_STYLES: Record<ModeId, { abbr: string }> = {
  allgemein:    { abbr: 'AH' },
  formular:     { abbr: 'FM' },
  widerspruch:  { abbr: 'WS' },
  pflegealltag: { abbr: 'PA' },
  rechtlich:    { abbr: 'RQ' },
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
      <section
        className="relative z-10 text-center px-6 max-w-3xl mx-auto fade-up fade-up-1"
        style={{ paddingTop: 'clamp(64px, 12vw, 120px)', paddingBottom: 'clamp(56px, 10vw, 120px)' }}
      >
        <h1
          className="font-fraunces font-light leading-tight mb-6"
          style={{ fontSize: 'clamp(36px, 5.5vw, 56px)', color: '#f0ede8', letterSpacing: '-0.02em' }}
        >
          Der Pflegegrad, der dir zusteht.
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #fde68a 0%, #d4860a 50%, #fb923c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontStyle: 'italic',
          }}>
            Nicht der, den sie dir gegeben haben.
          </span>
        </h1>

        <p
          className="leading-relaxed max-w-lg mx-auto mb-10"
          style={{ fontSize: '18px', color: '#a09a90' }}
        >
          Jede dritte Einstufung ist zu niedrig.{' '}
          <br className="hidden sm:block" />
          Deine KI kennt die Regeln – und hilft dir, sie zu nutzen.
        </p>

        <button
          onClick={() => openChat('allgemein')}
          className="inline-flex items-center gap-2 font-semibold transition-all duration-200
                     hover:-translate-y-0.5 hover:brightness-110"
          style={{
            background: '#d4860a',
            color: '#fff',
            borderRadius: '9999px',
            padding: '16px 32px',
            fontSize: '15px',
            boxShadow: '0 8px 32px rgba(212,134,10,0.35)',
          }}
        >
          Meine Einstufung prüfen →
        </button>
      </section>

      {/* Mode cards grid */}
      <section
        className="relative z-10 max-w-5xl mx-auto px-6 pb-20"
        style={{ background: '#0a0a0f' }}
      >
        <p
          className="text-center mb-8"
          style={{
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: '#a09a90',
          }}
        >
          Womit kann ich dir helfen?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MODES.map((mode, i) => {
            const { abbr } = CARD_STYLES[mode.id];
            const isHovered = hoveredMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => openChat(mode.id)}
                onMouseEnter={() => setHoveredMode(mode.id)}
                onMouseLeave={() => setHoveredMode(null)}
                className="mode-card text-left p-6 rounded-2xl fade-up"
                style={{
                  animationDelay: `${0.08 * (i + 1)}s`,
                  background: isHovered ? '#1e1e30' : '#16162a',
                  border: `1px solid ${isHovered ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`,
                  boxShadow: isHovered ? '0 16px 48px rgba(0,0,0,0.5)' : '0 2px 16px rgba(0,0,0,0.4)',
                  transition: 'background .2s, border-color .2s, box-shadow .2s, transform .2s',
                }}
              >
                <div
                  className="font-fraunces mb-4 font-semibold"
                  style={{ fontSize: '11px', letterSpacing: '2px', color: '#d4860a' }}
                >
                  {abbr}
                </div>
                <h3
                  className="font-fraunces font-semibold mb-2"
                  style={{ fontSize: '17px', color: '#f0ede8', lineHeight: 1.3 }}
                >
                  {mode.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#6b6575', lineHeight: 1.6 }}>
                  {mode.subtitle}
                </p>
                <div
                  className="mt-5 text-xs font-medium"
                  style={{ color: isHovered ? '#d4860a' : '#4a4455' }}
                >
                  Jetzt fragen →
                </div>
              </button>
            );
          })}

          {/* Personal context card */}
          <button
            onClick={() => setShowSettings(true)}
            onMouseEnter={() => setHoveredMode('allgemein' as ModeId)}
            onMouseLeave={() => setHoveredMode(null)}
            className="mode-card text-left p-6 rounded-2xl fade-up"
            style={{
              animationDelay: '0.56s',
              background: 'transparent',
              border: '1px dashed rgba(212,134,10,0.25)',
              boxShadow: 'none',
              transition: 'border-color .2s',
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(212,134,10,0.5)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(212,134,10,0.25)'}
          >
            <div
              className="font-fraunces mb-4 font-semibold"
              style={{ fontSize: '11px', letterSpacing: '2px', color: '#d4860a' }}
            >
              PK
            </div>
            <h3
              className="font-fraunces font-semibold mb-2"
              style={{ fontSize: '17px', color: '#d4860a', lineHeight: 1.3, opacity: 0.8 }}
            >
              Persönlicher Kontext
            </h3>
            <p style={{ fontSize: '13px', color: '#6b6575', lineHeight: 1.6 }}>
              {hasSettings
                ? 'Dein Profil ist aktiv – die KI kennt deine Situation.'
                : 'Einmalig deine Situation schildern – alle Antworten werden persönlicher.'}
            </p>
            <div className="mt-5 text-xs font-medium" style={{ color: '#d4860a', opacity: 0.5 }}>
              {hasSettings ? 'Profil bearbeiten →' : 'Profil anlegen →'}
            </div>
          </button>
        </div>

        {/* Bottom disclaimer */}
        <p className="text-center mt-12 max-w-lg mx-auto leading-relaxed"
           style={{ fontSize: '12px', color: '#3d3848' }}>
          Alle Informationen basieren auf öffentlichem Fachwissen aus deutschen Pflegekassen,
          Sozialverbänden und Behörden. Kein Ersatz für individuelle Beratung.{' '}
          <button
            onClick={() => setShowDisclaimer(true)}
            className="underline transition-colors"
            style={{ color: '#3d3848' }}
          >
            Hinweise lesen
          </button>
        </p>
      </section>
    </div>
  );
}
