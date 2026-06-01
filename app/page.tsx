'use client';

import { useState, useEffect } from 'react';
import { Heart, Settings, Shield } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import PaperCanvas from '@/components/PaperCanvas';
import DisclaimerModal from '@/components/DisclaimerModal';
import SettingsPanel, { UserSettings } from '@/components/SettingsPanel';
import { ModeId, MODES } from '@/lib/modes';
import SparkleIcon from '@/components/SparkleIcon';

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
    setActiveMode(modeId);
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
      <div className="flex flex-col h-screen overflow-hidden relative">
        <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />

        {showSettings && (
          <SettingsPanel onClose={() => setShowSettings(false)} onSave={handleSaveSettings} initial={userSettings} />
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
                  >{m.icon}</button>
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

      {/* ── SEKTION 2: PROBLEM ──────────────────── */}
      <section style={{ background: '#0a0a0f', padding: 'clamp(100px, 13vw, 150px) 24px' }}>
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
            <button
              onClick={() => {}}
              style={{ color: '#444', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }}
            >
              Impressum
            </button>
            <span style={{ margin: '0 10px', color: '#333' }}>·</span>
            <button
              onClick={() => {}}
              style={{ color: '#444', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }}
            >
              Datenschutz
            </button>
          </p>
        </div>
      </footer>
    </div>
  );
}
