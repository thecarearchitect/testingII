'use client';

import { useState, useEffect } from 'react';
import { Heart, Settings, Shield } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import PaperCanvas from '@/components/PaperCanvas';
import DisclaimerModal from '@/components/DisclaimerModal';
import SettingsPanel, { UserSettings } from '@/components/SettingsPanel';
import { ModeId, MODES } from '@/lib/modes';
import SparkleIcon from '@/components/SparkleIcon';
import ModeIcon from '@/components/ModeIcon';

const DEFAULT_SETTINGS: UserSettings = { personalContext: '', customInstructions: '' };

const CARD_STYLES: Record<ModeId, { prominent?: boolean }> = {
  allgemein:    { prominent: true  },
  formular:     {},
  widerspruch:  { prominent: true  },
  pflegealltag: {},
  rechtlich:    {},
};

export default function Home() {
  const [view, setView]                     = useState<'welcome' | 'chat'>('welcome');
  const [activeMode, setActiveMode]         = useState<ModeId>('allgemein');
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [accepted, setAccepted]             = useState(false);
  const [showSettings, setShowSettings]     = useState(false);
  const [userSettings, setUserSettings]     = useState<UserSettings>(DEFAULT_SETTINGS);
  const [chatKey, setChatKey]               = useState(0);
  const [recentsKey, setRecentsKey]         = useState(0);
  const [demoInput, setDemoInput]           = useState('');
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem('disclaimer-accepted') === 'true') setAccepted(true);
    else setShowDisclaimer(true);
    const saved = localStorage.getItem('user-settings');
    if (saved) { try { setUserSettings(JSON.parse(saved)); } catch {} }
  }, []);

  useEffect(() => {
    if (view !== 'welcome') return;
    const els = document.querySelectorAll('.reveal-scroll');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      }),
      { threshold: 0.12 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [view]);

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
    setPendingMessage(null);
    setActiveMode(modeId);
    setChatKey((k) => k + 1);
    setView('chat');
  };

  const openChatWithMessage = (message: string) => {
    if (!accepted) { setShowDisclaimer(true); return; }
    setPendingMessage(message);
    setActiveMode('allgemein');
    setChatKey((k) => k + 1);
    setView('chat');
  };

  const goHome = () => {
    setView('welcome');
    setChatKey((k) => k + 1);
  };

  const hasSettings = !!(userSettings.personalContext.trim() || userSettings.customInstructions.trim());

  /* ──────────────────────────────────────────────
     CHAT VIEW
  ────────────────────────────────────────────── */
  if (view === 'chat') {
    const mode = MODES.find(m => m.id === activeMode)!;
    return (
      <div className="flex flex-col h-screen overflow-hidden relative"
           style={{ background: 'radial-gradient(ellipse at 50% 0%, #150f1f 0%, #0a0a0f 50%)' }}>

        {showSettings && (
          <SettingsPanel
            onClose={() => setShowSettings(false)}
            onSave={handleSaveSettings}
            onChatsCleared={() => setRecentsKey(k => k + 1)}
            initial={userSettings}
          />
        )}

        <header className="glass-dark flex-shrink-0 relative z-10">
          <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
            <button onClick={goHome} className="flex items-center gap-2.5 hover:opacity-75 transition-opacity group">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
                <Heart size={14} className="text-amber-300" fill="currentColor" />
              </div>
              <span className="font-fraunces text-white/80 text-sm group-hover:text-white transition-colors">
                PflegeAssistent <SparkleIcon />
              </span>
            </button>

            <div className="flex items-center gap-1">
              <div className="hidden sm:flex gap-1 mr-2">
                {MODES.map(m => (
                  <button key={m.id}
                    onClick={() => { setActiveMode(m.id); setChatKey(k => k + 1); }}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                      m.id === activeMode
                        ? 'bg-amber-500/25 text-amber-300 border border-amber-400/40'
                        : 'text-white/30 hover:text-white/60 hover:bg-white/5'
                    }`}
                  ><ModeIcon modeId={m.id} size={13} color={m.id === activeMode ? '#fbbf24' : 'currentColor'} /></button>
                ))}
              </div>
              <button onClick={() => setShowSettings(true)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                  hasSettings ? 'text-amber-400 hover:bg-amber-500/10' : 'text-white/30 hover:text-white/10'
                }`}>
                <Settings size={14} />
              </button>
              <button onClick={() => setShowDisclaimer(true)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white/60 transition-colors">
                <Shield size={14} />
              </button>
            </div>
          </div>
        </header>

        <div className="relative z-10 max-w-3xl mx-auto w-full px-4 pt-3 flex-shrink-0 flex items-center gap-2">
          <ModeIcon modeId={activeMode} size={14} color="#d4860a" />
          <span className="text-xs text-white/35 font-medium">{mode.title}</span>
          {hasSettings && <span className="ml-auto text-xs text-amber-500/50">● Persönlicher Kontext aktiv</span>}
        </div>

        <div className="flex-1 overflow-hidden relative z-10 max-w-3xl w-full mx-auto">
          <ChatInterface
            key={`${activeMode}-${chatKey}-${recentsKey}`}
            modeId={activeMode}
            userSettings={userSettings}
            onOpenMode={openChat}
            onChatSaved={() => setRecentsKey(k => k + 1)}
            initialMessage={pendingMessage ?? undefined}
            onInitialMessageConsumed={() => setPendingMessage(null)}
          />
        </div>

        {showDisclaimer && <DisclaimerModal onAccept={handleAccept} />}
      </div>
    );
  }

  /* ──────────────────────────────────────────────
     WELCOME VIEW
  ────────────────────────────────────────────── */
  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>
      {showDisclaimer && <DisclaimerModal onAccept={handleAccept} />}
      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} onSave={handleSaveSettings} initial={userSettings} />
      )}

      {/* ── Sticky Nav ──────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(10,10,15,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          padding: '0 24px', height: 60,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(212,134,10,0.18)',
              border: '1px solid rgba(212,134,10,0.30)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Heart size={14} color="#f59e0b" fill="#f59e0b" />
            </div>
            <span className="font-fraunces" style={{ color: '#f0ede8', fontSize: 15, fontWeight: 600 }}>
              PflegeAssistent <SparkleIcon />
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => setShowSettings(true)}
              style={{ color: '#a09a90', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Einstellungen
            </button>
            <button
              onClick={() => openChat('allgemein')}
              style={{
                background: '#d4860a', color: '#fff', border: 'none',
                borderRadius: 9999, padding: '10px 22px',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Starten →
            </button>
          </div>
        </div>
      </nav>

      {/* ── SEKTION 1: HERO ─────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden', background: '#0a0a0f' }}>
        <PaperCanvas />

        {/* Amber radial overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: [
            'radial-gradient(ellipse 80% 50% at 20% 100%, rgba(212,134,10,0.10) 0%, transparent 60%)',
            'radial-gradient(ellipse 60% 40% at 80% 100%, rgba(212,134,10,0.07) 0%, transparent 55%)',
            'rgba(10,10,15,0.60)',
          ].join(', '),
        }} />

        <div style={{
          position: 'relative', zIndex: 2,
          maxWidth: 720, margin: '0 auto', textAlign: 'center',
          padding: 'clamp(110px, 16vw, 170px) 24px clamp(100px, 14vw, 150px)',
        }}>
          <h1 className="font-fraunces fade-up fade-up-1" style={{
            fontSize: 'clamp(42px, 6.5vw, 68px)',
            fontWeight: 300, lineHeight: 1.12,
            color: '#f0ede8', letterSpacing: '-0.025em',
            marginBottom: 32,
          }}>
            Pflege verstehen.<br />
            <span style={{ color: '#d4860a' }}>Ansprüche durchsetzen.</span>
          </h1>

          <p className="fade-up fade-up-2" style={{
            fontSize: 'clamp(16px, 2vw, 19px)',
            color: '#a09a90', lineHeight: 1.75,
            maxWidth: 520, margin: '0 auto 52px',
          }}>
            Pflegegrad zu niedrig. Formular unverständlich. Widerspruch nötig.
            <br />
            Dein KI-Assistent kennt das System — und erklärt es dir.
          </p>

          <div className="fade-up fade-up-3" style={{
            display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap',
          }}>
            <button
              onClick={() => openChat('allgemein')}
              style={{
                background: '#d4860a', color: '#fff', border: 'none',
                borderRadius: 9999, padding: '16px 38px',
                fontSize: 15, fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 8px 32px rgba(212,134,10,0.35)',
                transition: 'transform .15s, box-shadow .15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(212,134,10,0.50)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(212,134,10,0.35)';
              }}
            >
              Erste Frage stellen →
            </button>
            <button
              onClick={() => openChat('widerspruch')}
              style={{
                background: 'transparent', color: '#f0ede8',
                border: '1px solid rgba(240,237,232,0.22)',
                borderRadius: 9999, padding: '16px 38px',
                fontSize: 15, fontWeight: 400, cursor: 'pointer',
                transition: 'border-color .15s, color .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(240,237,232,0.50)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(240,237,232,0.22)'; }}
            >
              Pflegegrad prüfen lassen
            </button>
          </div>
        </div>
      </section>

      {/* ── LIVE DEMO BLOCK ─────────────────────── */}
      <section style={{ background: '#0a0a0f', padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 22, fontWeight: 400, color: '#f0ede8', marginBottom: 20, letterSpacing: '-0.01em' }}>
            Stell eine echte Frage.
          </h2>

          {/* Beispiel-Chip */}
          <button
            onClick={() => setDemoInput('Meine Mutter hat Pflegegrad 2. Kann ich Widerspruch einlegen?')}
            style={{
              background: '#16162a', border: '1px solid #d4860a',
              borderRadius: 9999, padding: '8px 18px',
              fontSize: 13, color: '#d4860a', cursor: 'pointer',
              marginBottom: 20, display: 'inline-block',
              transition: 'background .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,134,10,0.10)')}
            onMouseLeave={e => (e.currentTarget.style.background = '#16162a')}
          >
            „Meine Mutter hat Pflegegrad 2. Kann ich Widerspruch einlegen?"
          </button>

          {/* Eingabefeld */}
          <input
            type="text"
            value={demoInput}
            onChange={e => setDemoInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && demoInput.trim()) openChatWithMessage(demoInput.trim()); }}
            placeholder="Frage eingeben..."
            style={{
              width: '100%', padding: '16px 20px',
              background: '#16162a', border: '1px solid #2a2a3f',
              borderRadius: 12, fontSize: 15, color: '#f0ede8',
              outline: 'none', marginBottom: 12,
              boxSizing: 'border-box',
              transition: 'border-color .15s',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = '#d4860a')}
            onBlur={e => (e.currentTarget.style.borderColor = '#2a2a3f')}
          />

          {/* Absenden */}
          <button
            onClick={() => { if (demoInput.trim()) openChatWithMessage(demoInput.trim()); }}
            style={{
              background: '#d4860a', color: '#fff', border: 'none',
              borderRadius: 9999, padding: '14px 36px',
              fontSize: 15, fontWeight: 600,
              cursor: demoInput.trim() ? 'pointer' : 'default',
              opacity: demoInput.trim() ? 1 : 0.45,
              marginBottom: 20,
              transition: 'opacity .15s',
              boxShadow: demoInput.trim() ? '0 6px 24px rgba(212,134,10,0.30)' : 'none',
            }}
            onMouseEnter={e => { if (demoInput.trim()) e.currentTarget.style.opacity = '0.85'; }}
            onMouseLeave={e => (e.currentTarget.style.opacity = demoInput.trim() ? '1' : '0.45')}
          >
            Beispiel ausprobieren →
          </button>

          {/* Bullet points */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap' }}>
            {['Kostenlos', 'Kein Konto nötig', 'Sofortige Antwort'].map(txt => (
              <span key={txt} style={{ fontSize: 12, color: '#4a4455' }}>{txt}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEKTION 1b: FÜR WEN ─────────────────── */}
      <section style={{ background: 'linear-gradient(to bottom, #0a0a0f, #0d0d14 18%, #0d0d14 82%, #0a0a0f)', padding: 'clamp(80px, 10vw, 120px) 24px 60px' }}>
        <div className="reveal-scroll" style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 18, color: '#f0ede8', lineHeight: 1.9, marginBottom: 28 }}>
            Für alle, die mit dem Pflegesystem konfrontiert sind.
            Als Angehöriger, als Elternteil, als Fachkraft oder
            einfach weil das Leben es so will.
          </p>
          <p style={{ fontSize: 16, color: '#a09a90', lineHeight: 1.9 }}>
            Bescheide verstehen. Anträge stellen. Fristen erkennen. Ansprüche durchsetzen.<br />
            Ohne Sozialrecht studiert zu haben.
          </p>
        </div>
      </section>

      {/* ── SEKTION 2: PROBLEM ──────────────────── */}
      <section style={{ background: '#0a0a0f', padding: 'clamp(100px, 13vw, 150px) 24px 120px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <p className="reveal-scroll" style={{
            fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '3.5px', color: '#a09a90',
            textAlign: 'center', marginBottom: 72,
          }}>
            Kennst du das?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            {[
              ['Pflegegrad beantragt.', 'Zu niedrig eingestuft.'],
              ['Hilfsmittel abgelehnt.', 'Ohne Erklärung.'],
              ['Formular vor dir.', 'Kein Plan wo anfangen.'],
              ['Widerspruch möglich.', 'Frist läuft.'],
            ].map(([line1, line2], i) => (
              <div key={i} className="reveal-scroll" style={{ transitionDelay: `${i * 0.15}s` }}>
                <p style={{
                  fontSize: 'clamp(22px, 4vw, 30px)',
                  color: '#f0ede8', lineHeight: 1.4,
                  fontWeight: 300, letterSpacing: '-0.01em',
                }}>
                  {line1}<br />
                  <span style={{ color: '#a09a90' }}>{line2}</span>
                </p>
              </div>
            ))}
          </div>

          <p className="reveal-scroll" style={{
            marginTop: 72,
            fontSize: 15, fontStyle: 'italic',
            color: '#d4860a', lineHeight: 1.65,
            textAlign: 'center',
            transitionDelay: '0.6s',
          }}>
            Das ist nicht dein Versagen. Das ist das System.
          </p>
        </div>
      </section>

      {/* ── SEKTION 2b: WARUM NICHT CHATGPT ────── */}
      <section style={{ background: 'linear-gradient(to bottom, #0a0a0f, #0d0d14 12%, #0d0d14 88%, #0a0a0f)', padding: '120px 24px clamp(100px, 13vw, 150px)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>

          <p className="reveal-scroll" style={{
            fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '3.5px', color: '#a09a90',
            textAlign: 'center', marginBottom: 24,
          }}>
            Warum nicht einfach ChatGPT?
          </p>

          <h2 className="font-fraunces reveal-scroll" style={{
            fontSize: 'clamp(28px, 4.5vw, 44px)',
            fontWeight: 300, color: '#f0ede8',
            textAlign: 'center', lineHeight: 1.2,
            marginBottom: 72, letterSpacing: '-0.02em',
          }}>
            Die meisten brauchen keine<br />
            bessere Antwort.<br />
            <span style={{ color: '#a09a90' }}>Sie brauchen die richtige Frage.</span>
          </h2>

          {/* Zwei Spalten */}
          <div className="reveal-scroll" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20, marginBottom: 40,
          }}>
            {/* Links: Allgemeine KI */}
            <div style={{
              padding: '32px 28px', background: '#16162a',
              borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)',
            }}>
              <p style={{
                fontSize: 13, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '2px', color: '#a09a90', marginBottom: 24,
              }}>
                Allgemeine KI
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  'Wartet auf deine Frage',
                  'Kennt deinen Fall nicht',
                  'Kennt keine Fristen',
                  'Kein Gedächtnis für Pflegefälle',
                  'Keine Spezialisierung auf Pflege',
                ].map((item) => (
                  <li key={item} style={{
                    fontSize: 14, color: '#6b6575', lineHeight: 1.7,
                    paddingBottom: 10, display: 'flex', gap: 10, alignItems: 'flex-start',
                  }}>
                    <span style={{ color: '#3a3a5a', marginTop: 3, flexShrink: 0 }}>–</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Rechts: PflegeAssistent */}
            <div style={{
              padding: '32px 28px', background: 'rgba(212,134,10,0.06)',
              borderRadius: 16, border: '1px solid rgba(212,134,10,0.25)',
            }}>
              <p style={{
                fontSize: 13, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '2px', color: '#d4860a', marginBottom: 24,
              }}>
                PflegeAssistent
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  'Fragt nach relevanten Details',
                  'Erkennt typische Pflegefälle',
                  'Weist auf Fristen hin',
                  'Baut auf vorherigen Angaben auf',
                  'Speziell für das deutsche Pflegesystem entwickelt',
                ].map((item) => (
                  <li key={item} style={{
                    fontSize: 14, color: '#c8c0a0', lineHeight: 1.7,
                    paddingBottom: 10, display: 'flex', gap: 10, alignItems: 'flex-start',
                  }}>
                    <span style={{ color: '#d4860a', marginTop: 3, flexShrink: 0 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Story-Block */}
          <div className="reveal-scroll" style={{
            background: '#16162a',
            borderLeft: '4px solid #d4860a',
            borderRadius: 12, padding: '24px 28px',
            marginBottom: 52,
          }}>
            <p style={{
              fontSize: 15, fontStyle: 'italic',
              color: '#f0ede8', lineHeight: 1.8, marginBottom: 20,
            }}>
              „Meine Tochter hat das Down-Syndrom. Pflegegrad 3. Die Krankenkasse lehnt den Integrationshelfer für die Schule ab."
            </p>
            <p style={{ fontSize: 14, color: '#a09a90', lineHeight: 1.7, marginBottom: 6 }}>
              Eine allgemeine KI liefert Informationen.
            </p>
            <p style={{ fontSize: 14, color: '#a09a90', lineHeight: 1.7, marginBottom: 16 }}>
              PflegeAssistent erkennt:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                'mögliche Ablehnungsgründe',
                'relevante Fristen',
                'benötigte Unterlagen',
                'Ansprechpartner',
                'einen passenden Musterwiderspruch',
              ].map((item) => (
                <li key={item} style={{
                  fontSize: 14, color: '#c8c0a0', lineHeight: 1.7,
                  paddingBottom: 8, display: 'flex', gap: 10,
                }}>
                  <span style={{ color: '#d4860a', flexShrink: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Abschluss + CTA */}
          <div className="reveal-scroll" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 15, color: '#a09a90', lineHeight: 1.85, marginBottom: 24 }}>
              PflegeAssistent kennt nicht alles.<br />
              Aber er kennt die Fragen, die pflegende Angehörige,<br />
              Eltern und Fachkräfte jeden Tag beantworten müssen.
            </p>
            <button
              onClick={() => openChat('allgemein')}
              style={{
                background: '#d4860a', color: '#fff',
                border: 'none', borderRadius: 9999,
                padding: '14px 34px',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                transition: 'opacity .15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Beispiel ausprobieren →
            </button>
          </div>

        </div>
      </section>

      {/* ── SEKTION: FRISTEN-ASSISTENT ──────────── */}
      <section style={{ background: '#111118', padding: 'clamp(100px, 13vw, 150px) 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>

          <p className="reveal-scroll" style={{
            fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '3.5px', color: '#a09a90',
            textAlign: 'center', marginBottom: 24,
          }}>
            Fristen-Assistent
          </p>

          <h2 className="font-fraunces reveal-scroll" style={{
            fontSize: 'clamp(28px, 4.5vw, 44px)',
            fontWeight: 300, color: '#f0ede8',
            textAlign: 'center', lineHeight: 1.2,
            marginBottom: 20, letterSpacing: '-0.02em',
          }}>
            Nie wieder eine wichtige Frist verpassen.
          </h2>

          <p className="reveal-scroll" style={{
            fontSize: 18, color: '#a09a90', lineHeight: 1.75,
            textAlign: 'center', maxWidth: 580, margin: '0 auto 72px',
          }}>
            Pflegebescheide, Verordnungen und Ausweise enthalten Fristen.
            PflegeAssistent erkennt sie automatisch und erinnert dich rechtzeitig.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 20,
          }}>
            {/* Karte 1 */}
            <div className="reveal-scroll" style={{
              padding: '32px 28px', background: '#16162a',
              borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)',
            }}>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#d4860a', marginBottom: 16, fontFamily: 'Fraunces, Georgia, serif' }}>01</p>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#f0ede8', marginBottom: 20 }}>Dokument hochladen</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Pflegegradbescheid', 'Hilfsmittelablehnung', 'Behindertenparkausweis', 'Schwerbehindertenausweis', 'Verordnung'].map(item => (
                  <li key={item} style={{ fontSize: 14, color: '#a09a90', lineHeight: 1.7, paddingBottom: 6 }}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Karte 2 */}
            <div className="reveal-scroll" style={{
              transitionDelay: '0.1s',
              padding: '32px 28px', background: '#16162a',
              borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)',
            }}>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#d4860a', marginBottom: 16, fontFamily: 'Fraunces, Georgia, serif' }}>02</p>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#f0ede8', marginBottom: 16 }}>Frist erkennen</h3>
              <p style={{ fontSize: 13, color: '#6b6575', lineHeight: 1.7, marginBottom: 14 }}>PflegeAssistent erkennt automatisch:</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Widerspruchsfristen', 'Ablaufdaten', 'Verlängerungen', 'Wiedervorlagen'].map(item => (
                  <li key={item} style={{ fontSize: 14, color: '#a09a90', lineHeight: 1.7, paddingBottom: 6, display: 'flex', gap: 8 }}>
                    <span style={{ color: '#d4860a', flexShrink: 0 }}>✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Karte 3 */}
            <div className="reveal-scroll" style={{
              transitionDelay: '0.2s',
              padding: '32px 28px', background: '#16162a',
              borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)',
            }}>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#d4860a', marginBottom: 16, fontFamily: 'Fraunces, Georgia, serif' }}>03</p>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#f0ede8', marginBottom: 20 }}>Erinnert werden</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Dein Parkausweis läuft in 30 Tagen ab.',
                  'Die Widerspruchsfrist endet in 12 Tagen.',
                  'Neue Verordnung erforderlich.',
                ].map(msg => (
                  <p key={msg} style={{
                    fontSize: 13, fontStyle: 'italic', color: '#f0ede8', lineHeight: 1.65,
                    padding: '12px 14px',
                    background: 'rgba(212,134,10,0.06)', border: '1px solid rgba(212,134,10,0.15)',
                    borderRadius: 8,
                  }}>
                    „{msg}"
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEKTION: PREMIUM & PRICING ──────────── */}
      <section style={{ background: '#0a0a0f', padding: 'clamp(100px, 13vw, 150px) 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>

          <p className="reveal-scroll" style={{
            fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '3.5px', color: '#d4860a',
            textAlign: 'center', marginBottom: 24,
          }}>
            Premium
          </p>

          <h2 className="font-fraunces reveal-scroll" style={{
            fontSize: 'clamp(28px, 4.5vw, 44px)',
            fontWeight: 300, color: '#f0ede8',
            textAlign: 'center', lineHeight: 1.2,
            marginBottom: 20, letterSpacing: '-0.02em',
          }}>
            Dein digitales Pflegegedächtnis.
          </h2>

          <p className="reveal-scroll" style={{
            fontSize: 17, color: '#a09a90', lineHeight: 1.8,
            textAlign: 'center', maxWidth: 520, margin: '0 auto 52px',
          }}>
            Dokumente verschwinden. Fristen werden vergessen.
            PflegeAssistent speichert wichtige Termine, Fristen und
            Dokumente an einem Ort.
          </p>

          {/* Premium-Features 2-col */}
          <div className="reveal-scroll" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 10,
            maxWidth: 620, margin: '0 auto 72px',
          }}>
            {[
              'Dokumentenarchiv', 'Automatische Fristenerkennung',
              'Erinnerungen per E-Mail', 'Fallhistorie',
              'Alle Bescheide an einem Ort', 'Mehrere Angehörige verwalten',
            ].map(f => (
              <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: '#d4860a', flexShrink: 0, marginTop: 2 }}>✓</span>
                <span style={{ fontSize: 14, color: '#c8c0a0', lineHeight: 1.65 }}>{f}</span>
              </div>
            ))}
          </div>

          <div className="reveal-scroll" style={{ textAlign: 'center', marginTop: 8 }}>
            <a
              href="/pricing"
              style={{ fontSize: 14, color: '#a09a90', textDecoration: 'none', transition: 'color .15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f0ede8')}
              onMouseLeave={e => (e.currentTarget.style.color = '#a09a90')}
            >
              Alle Pläne ansehen →
            </a>
          </div>
        </div>
      </section>

      {/* ── SEKTION 3: VERTRAUEN ────────────────── */}
      <section style={{ background: '#111118', padding: 'clamp(100px, 13vw, 150px) 24px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <p className="reveal-scroll" style={{
            fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '3.5px', color: '#a09a90',
            textAlign: 'center', marginBottom: 64,
          }}>
            Warum dieser Assistent existiert
          </p>

          <div className="reveal-scroll" style={{
            borderLeft: '4px solid #d4860a',
            paddingLeft: 40,
          }}>
            <p className="font-fraunces" style={{
              fontSize: 'clamp(17px, 2.5vw, 21px)',
              fontWeight: 300, fontStyle: 'italic',
              color: '#f0ede8', lineHeight: 1.8,
              marginBottom: 0,
            }}>
              Dieser Assistent existiert, weil ich keine andere Wahl hatte,
              als das System zu verstehen.
              <br /><br />
              Ich bin Vater einer schwerstbehinderten Tochter. Kein Experte
              von oben herab — sondern jemand, der dieselben Formulare
              vor sich hatte, dieselben Ablehnungsbescheide gelesen hat,
              und dieselbe Frage kannte: Wo fange ich überhaupt an?
              <br /><br />
              Jahre mit Pflegekassen, MDK, Hilfsmitteln, Widersprüchen,
              Behörden. Nicht als Berater. Als Vater.
              <br /><br />
              Aus diesem Wissen ist dieser Assistent entstanden. Nicht um
              klug zu klingen. Sondern damit du nicht alleine durch das musst.
            </p>
            <p style={{ marginTop: 36, fontSize: 13, color: '#6b6575', fontStyle: 'normal' }}>
              — Der Gründer
            </p>
          </div>
        </div>
      </section>

      {/* ── SEKTION 4: ZAHLEN ───────────────────── */}
      <section style={{ background: '#0a0a0f', padding: 'clamp(100px, 13vw, 150px) 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'clamp(40px, 6vw, 80px)',
            textAlign: 'center',
          }}>
            {[
              { stat: '1 von 3', label: 'Pflegeeinstufungen sind zu niedrig' },
              { stat: '6 Wochen', label: 'Widerspruchsfrist — oft unbekannt' },
              { stat: '0 €', label: 'Kostet deine erste Frage' },
            ].map(({ stat, label }) => (
              <div key={stat} className="reveal-scroll">
                <div className="font-fraunces" style={{
                  fontSize: 'clamp(38px, 5.5vw, 52px)',
                  fontWeight: 700, color: '#d4860a',
                  lineHeight: 1, marginBottom: 16,
                }}>
                  {stat}
                </div>
                <p style={{ fontSize: 14, color: '#a09a90', lineHeight: 1.6 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEKTION 5: FEATURES ─────────────────── */}
      <section style={{ background: '#111118', padding: 'clamp(100px, 13vw, 150px) 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p className="reveal-scroll" style={{
            fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '3.5px', color: '#a09a90',
            textAlign: 'center', marginBottom: 64,
          }}>
            Womit kann ich dir helfen?
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: 20,
          }}>
            {[
              {
                id: 'widerspruch' as ModeId,
                title: 'Widerspruch schreiben',
                text: 'Bescheid erhalten? Wir formulieren.',
                cta: 'Widerspruch vorbereiten →',
              },
              {
                id: 'allgemein' as ModeId,
                title: 'Pflegegrad & Leistungen',
                text: 'Was steht dir zu? Wir prüfen es.',
                cta: 'Pflegegrad prüfen →',
              },
              {
                id: 'formular' as ModeId,
                title: 'Formulare verstehen',
                text: 'Kein Juradeutsch mehr.',
                cta: 'Formular hochladen →',
              },
              {
                id: 'rechtlich' as ModeId,
                title: 'Rechtliche Fragen',
                text: 'Deine Rechte, klar erklärt.',
                cta: 'Frage stellen →',
              },
              {
                id: 'pflegealltag' as ModeId,
                title: 'Pflegealltag',
                text: 'Praktische Hilfe für jeden Tag.',
                cta: 'Jetzt fragen →',
              },
            ].map(({ id, title, text, cta }, i) => (
              <div key={id} className="reveal-scroll" style={{
                transitionDelay: `${i * 0.10}s`,
                padding: '36px 32px',
                background: '#16162a',
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', flexDirection: 'column',
              }}>
                <h3 className="font-fraunces" style={{
                  fontSize: 20, fontWeight: 600,
                  color: '#f0ede8', lineHeight: 1.3, marginBottom: 10,
                }}>
                  {title}
                </h3>
                <p style={{
                  fontSize: 14, color: '#a09a90',
                  lineHeight: 1.7, flexGrow: 1,
                }}>
                  {text}
                </p>
                <button
                  onClick={() => openChat(id)}
                  style={{
                    marginTop: 28, background: 'none', border: 'none',
                    color: '#d4860a', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', textAlign: 'left', padding: 0,
                    transition: 'opacity .15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.65')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  {cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEKTION 6: TESTIMONIALS ─────────────── */}
      <section style={{ background: '#0a0a0f', padding: 'clamp(100px, 13vw, 150px) 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p className="reveal-scroll" style={{
            fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '3.5px', color: '#a09a90',
            textAlign: 'center', marginBottom: 64,
          }}>
            Was andere sagen
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: 24,
          }}>
            {[
              {
                quote: 'Ich wusste nicht, dass ich Widerspruch einlegen kann. Jetzt haben wir Pflegegrad 3 bekommen.',
                role: 'Pflegende Mutter eines Kindes mit Behinderung',
              },
              {
                quote: 'Endlich versteht jemand, was in diesen Formularen steht.',
                role: 'Pflegender Ehemann, Demenzerkrankung der Partnerin',
              },
              {
                quote: 'Der MDK-Termin war das erste Mal, dass ich vorbereitet war.',
                role: 'Angehörige einer Pflegebedürftigen, Pflegegrad 2',
              },
            ].map(({ quote, role }, i) => (
              <div key={role} className="reveal-scroll" style={{
                transitionDelay: `${i * 0.12}s`,
                padding: '36px 32px',
                background: '#16162a',
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <p className="font-fraunces" style={{
                  fontSize: 16, fontStyle: 'italic',
                  fontWeight: 300, color: '#f0ede8',
                  lineHeight: 1.75, marginBottom: 24,
                }}>
                  &ldquo;{quote}&rdquo;
                </p>
                <p style={{ fontSize: 13, color: '#a09a90', fontWeight: 400 }}>
                  — {role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEKTION 7: ABSCHLUSS CTA ────────────── */}
      <section style={{ background: '#d4860a', padding: 'clamp(100px, 13vw, 150px) 24px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <h2 className="font-fraunces reveal-scroll" style={{
            fontSize: 'clamp(32px, 5.5vw, 56px)',
            fontWeight: 300, color: '#0a0a0f',
            lineHeight: 1.15, marginBottom: 24,
            letterSpacing: '-0.02em',
          }}>
            Du musst das nicht alleine<br />durchkämpfen.
          </h2>
          <p className="reveal-scroll" style={{
            fontSize: 17, color: '#1a1a0a',
            lineHeight: 1.7, marginBottom: 52,
          }}>
            Stell deine erste Frage.<br />
            Kostenlos. Jetzt.
          </p>
          <button
            className="reveal-scroll"
            onClick={() => openChat('allgemein')}
            style={{
              background: '#0a0a0f', color: '#f0ede8',
              border: 'none', borderRadius: 9999,
              padding: '18px 48px', fontSize: 16, fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 8px 40px rgba(0,0,0,0.30)',
              transition: 'transform .15s, box-shadow .15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 14px 48px rgba(0,0,0,0.40)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,0,0,0.30)';
            }}
          >
            Jetzt starten →
          </button>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────── */}
      <footer style={{ background: '#080808', padding: '48px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: '#555', lineHeight: 1.9 }}>
            Alle Informationen basieren auf öffentlichem Fachwissen. Kein Ersatz
            für individuelle Beratung.{' '}
            <button
              onClick={() => setShowDisclaimer(true)}
              style={{
                color: '#555', background: 'none', border: 'none',
                cursor: 'pointer', textDecoration: 'underline', fontSize: 12,
              }}
            >
              Hinweise
            </button>
          </p>
          <p style={{ marginTop: 16, fontSize: 12, color: '#444' }}>
            <a href="/impressum" style={{ color: '#444', fontSize: 12, textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#888')}
              onMouseLeave={e => (e.currentTarget.style.color = '#444')}>
              Impressum
            </a>
            <span style={{ margin: '0 10px', color: '#333' }}>·</span>
            <a href="/datenschutz" style={{ color: '#444', fontSize: 12, textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#888')}
              onMouseLeave={e => (e.currentTarget.style.color = '#444')}>
              Datenschutz
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
