'use client';

import { useState, useEffect } from 'react';
import { Heart, Settings, Shield } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import PaperCanvas from '@/components/PaperCanvas';
import DisclaimerModal from '@/components/DisclaimerModal';
import SettingsPanel, { UserSettings } from '@/components/SettingsPanel';
import { ModeId, MODES } from '@/lib/modes';

const DEFAULT_SETTINGS: UserSettings = { personalContext: '', customInstructions: '' };

const CARD_STYLES: Record<ModeId, { prominent?: boolean }> = {
  allgemein:    { prominent: true  },
  formular:     {},
  widerspruch:  { prominent: true  },
  pflegealltag: {},
  rechtlich:    {},
};

export default function Home() {
  const [view, setView]               = useState<'welcome' | 'chat'>('welcome');
  const [activeMode, setActiveMode]   = useState<ModeId>('allgemein');
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [accepted, setAccepted]       = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [chatKey, setChatKey]         = useState(0);

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
      { threshold: 0.15 }
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

  /* ──────────────────────────────────────────
     CHAT VIEW
  ────────────────────────────────────────── */
  if (view === 'chat') {
    const mode = MODES.find(m => m.id === activeMode)!;
    return (
      <div className="flex flex-col h-screen overflow-hidden relative">
        <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />

        {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} onSave={handleSaveSettings} initial={userSettings} />}

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
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>
      {showDisclaimer && <DisclaimerModal onAccept={handleAccept} />}
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} onSave={handleSaveSettings} initial={userSettings} />}

      {/* ── Sticky Nav ──────────────────────── */}
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
              PflegeAssistent <span style={{ color: '#d4860a' }}>KI</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => setShowSettings(true)}
              style={{
                color: '#a09a90', fontSize: 13, background: 'none',
                border: 'none', cursor: 'pointer', padding: '6px 0',
              }}
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

      {/* ── Hero ────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden', background: '#0a0a0f' }}>
        <PaperCanvas />

        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'radial-gradient(ellipse 70% 60% at 50% 90%, rgba(212,134,10,0.14) 0%, transparent 65%), rgba(10,10,15,0.62)',
        }} />

        <div style={{
          position: 'relative', zIndex: 2,
          maxWidth: 720, margin: '0 auto', textAlign: 'center',
          padding: 'clamp(100px, 15vw, 160px) 24px',
        }}>
          <p className="fade-up fade-up-1" style={{
            fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '3px', color: '#d4860a', marginBottom: 28,
          }}>
            KI-Assistent für pflegende Angehörige
          </p>

          <h1 className="font-fraunces fade-up fade-up-2" style={{
            fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 300,
            lineHeight: 1.15, color: '#f0ede8',
            letterSpacing: '-0.02em', marginBottom: 28,
          }}>
            Pflege verstehen.<br />
            <span style={{ color: '#d4860a' }}>Ansprüche durchsetzen.</span>
          </h1>

          <p className="fade-up fade-up-3" style={{
            fontSize: 18, color: '#a09a90', lineHeight: 1.7,
            maxWidth: 480, margin: '0 auto 48px',
          }}>
            Bürokratie, Formulare, Widersprüche — du musst das nicht alleine verstehen.
            Dein persönlicher Assistent für das deutsche Pflegesystem.
          </p>

          <div className="fade-up fade-up-4" style={{
            display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap',
          }}>
            <button
              onClick={() => openChat('allgemein')}
              style={{
                background: '#d4860a', color: '#fff', border: 'none',
                borderRadius: 9999, padding: '16px 36px',
                fontSize: 15, fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 8px 32px rgba(212,134,10,0.35)',
                transition: 'transform .15s, box-shadow .15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(212,134,10,0.45)';
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
                border: '1px solid rgba(240,237,232,0.25)',
                borderRadius: 9999, padding: '16px 36px',
                fontSize: 15, fontWeight: 500, cursor: 'pointer',
                transition: 'border-color .15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(240,237,232,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(240,237,232,0.25)')}
            >
              Pflegegrad prüfen lassen
            </button>
          </div>
        </div>
      </section>

      {/* ── Problem ─────────────────────────── */}
      <section style={{ background: '#111118', padding: 'clamp(80px, 10vw, 120px) 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <p className="reveal-scroll" style={{
            fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '3px', color: '#d4860a',
            textAlign: 'center', marginBottom: 20,
          }}>
            Kennst du das?
          </p>
          <h2 className="font-fraunces reveal-scroll" style={{
            fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 300,
            color: '#f0ede8', textAlign: 'center',
            marginBottom: 64, lineHeight: 1.25,
          }}>
            Das Pflegesystem ist komplex.<br />
            Die Bürokratie ist erschöpfend.
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 24,
          }}>
            {[
              { num: '01', text: 'Du erhältst einen Pflegegradsbescheid und weißt nicht, ob er korrekt ist.' },
              { num: '02', text: 'Formulare stapeln sich — Fristen verstreichen, ohne dass du weißt, was gilt.' },
              { num: '03', text: 'Du fragst beim MDK nach und verstehst die Antwort nicht.' },
              { num: '04', text: 'Widerspruch einlegen klingt nach Arbeit, die du gerade nicht leisten kannst.' },
            ].map(({ num, text }, i) => (
              <div key={num} className="reveal-scroll" style={{
                transitionDelay: `${i * 0.12}s`,
                padding: '32px 28px',
                background: '#16162a',
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#d4860a', letterSpacing: '2px', marginBottom: 16 }}>
                  {num}
                </div>
                <p style={{ fontSize: 15, color: '#a09a90', lineHeight: 1.7 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust ───────────────────────────── */}
      <section style={{ background: '#0a0a0f', padding: 'clamp(80px, 10vw, 120px) 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p className="reveal-scroll" style={{
            fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '3px', color: '#d4860a',
            textAlign: 'center', marginBottom: 60,
          }}>
            Warum dieser Assistent existiert
          </p>

          <div className="reveal-scroll" style={{ borderLeft: '3px solid #d4860a', paddingLeft: 36 }}>
            <p className="font-fraunces" style={{
              fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 300,
              color: '#f0ede8', lineHeight: 1.65, marginBottom: 24,
            }}>
              Als mein Vater pflegebedürftig wurde, stand ich vor einem Berg aus Formularen,
              Bescheiden und Fristen. Niemand erklärte mir, was ich wirklich tun konnte.
            </p>
            <p style={{ fontSize: 15, color: '#a09a90', lineHeight: 1.75, marginBottom: 20 }}>
              Der Pflegegrad war zu niedrig eingestuft. Der Widerspruch erfolgreich — aber nur,
              weil wir zufällig die richtigen Fragen gestellt haben. Nicht jeder hat dieses Glück.
            </p>
            <p style={{ fontSize: 15, color: '#a09a90', lineHeight: 1.75 }}>
              Dieser Assistent gibt jedem pflegenden Angehörigen das Wissen, das früher nur
              Sozialrechtlern vorbehalten war. Verständlich. Zugänglich. Kostenlos.
            </p>
            <p style={{ marginTop: 28, fontSize: 13, color: '#6b6575' }}>
              — Der Gründer, pflegender Angehöriger
            </p>
          </div>
        </div>
      </section>

      {/* ── Numbers ─────────────────────────── */}
      <section style={{ background: '#111118', padding: 'clamp(80px, 10vw, 120px) 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 40, textAlign: 'center',
          }}>
            {[
              { stat: '1 von 3', label: 'Pflegeeinstufungen sind zu niedrig' },
              { stat: '6 Wochen', label: 'Widerspruchsfrist nach Erhalt des Bescheids' },
              { stat: '0 €', label: 'kostet der erste Schritt mit diesem Assistenten' },
            ].map(({ stat, label }) => (
              <div key={stat} className="reveal-scroll">
                <div className="font-fraunces" style={{
                  fontSize: 'clamp(36px, 5vw, 48px)', fontWeight: 700,
                  color: '#d4860a', lineHeight: 1, marginBottom: 14,
                }}>
                  {stat}
                </div>
                <p style={{ fontSize: 14, color: '#a09a90', lineHeight: 1.6 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────── */}
      <section style={{ background: '#0a0a0f', padding: 'clamp(80px, 10vw, 120px) 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p className="reveal-scroll" style={{
            fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '3px', color: '#d4860a',
            textAlign: 'center', marginBottom: 20,
          }}>
            Was du hier tun kannst
          </p>
          <h2 className="font-fraunces reveal-scroll" style={{
            fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 300,
            color: '#f0ede8', textAlign: 'center',
            marginBottom: 56, lineHeight: 1.25,
          }}>
            Konkrete Hilfe, nicht abstrakte Ratschläge.
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20,
          }}>
            {[
              {
                id: 'widerspruch' as ModeId,
                title: 'Widerspruch schreiben',
                desc: 'Erhalte einen vollständigen Widerspruchstext — angepasst an deinen Bescheid, mit den richtigen gesetzlichen Grundlagen.',
                cta: 'Widerspruch starten →',
              },
              {
                id: 'allgemein' as ModeId,
                title: 'Pflegegrad verstehen',
                desc: 'Was bedeutet dein Gutachten? Welche Kriterien wurden wie bewertet? Wir erklären es dir auf Augenhöhe.',
                cta: 'Pflegegrad prüfen →',
              },
              {
                id: 'formular' as ModeId,
                title: 'Formular ausfüllen',
                desc: 'Kein Formular mehr, das du alleine durchkämpfst. Erhalte Schritt-für-Schritt-Hilfe für jeden Antrag.',
                cta: 'Formular öffnen →',
              },
              {
                id: 'pflegealltag' as ModeId,
                title: 'Pflegealltag meistern',
                desc: 'Von Hilfsmitteln bis zu Entlastungsleistungen — erfahre, was dir zusteht und wie du es bekommst.',
                cta: 'Alltag entlasten →',
              },
              {
                id: 'rechtlich' as ModeId,
                title: 'Rechtliche Fragen',
                desc: 'Vollmachten, Betreuungsrecht, § 15 SGB XI — klare Antworten auf Fragen, die du vielleicht noch nicht gestellt hast.',
                cta: 'Rechtsfrage klären →',
              },
            ].map(({ id, title, desc, cta }, i) => (
              <div key={id} className="reveal-scroll" style={{
                transitionDelay: `${i * 0.1}s`,
                padding: '32px 28px',
                background: '#16162a',
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', flexDirection: 'column',
              }}>
                <h3 className="font-fraunces" style={{
                  fontSize: 20, fontWeight: 600,
                  color: '#f0ede8', marginBottom: 12, lineHeight: 1.3,
                }}>
                  {title}
                </h3>
                <p style={{ fontSize: 14, color: '#a09a90', lineHeight: 1.7, flexGrow: 1 }}>{desc}</p>
                <button
                  onClick={() => openChat(id)}
                  style={{
                    marginTop: 24, background: 'none', border: 'none',
                    color: '#d4860a', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', textAlign: 'left', padding: 0,
                    transition: 'opacity .15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  {cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────── */}
      <section style={{ background: '#111118', padding: 'clamp(80px, 10vw, 120px) 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p className="reveal-scroll" style={{
            fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '3px', color: '#d4860a',
            textAlign: 'center', marginBottom: 56,
          }}>
            Was andere sagen
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}>
            {[
              {
                quote: 'Ich wusste nicht mal, dass ich Widerspruch einlegen kann. Jetzt haben wir Pflegegrad 3 — rückwirkend.',
                role: 'Pflegende Tochter, Berlin',
              },
              {
                quote: 'Endlich jemand, der mir erklärt, was in diesen Formularen steht. Ohne Fachchinesisch.',
                role: 'Ehemann einer Pflegebedürftigen, München',
              },
              {
                quote: 'Der Assistent hat mir in 10 Minuten mehr geholfen als die Pflegekasse in drei Monaten.',
                role: 'Pflegender Sohn, Hamburg',
              },
            ].map(({ quote, role }, i) => (
              <div key={role} className="reveal-scroll" style={{
                transitionDelay: `${i * 0.12}s`,
                padding: '32px 28px',
                background: '#16162a',
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <p className="font-fraunces" style={{
                  fontSize: 17, fontStyle: 'italic', fontWeight: 300,
                  color: '#f0ede8', lineHeight: 1.65, marginBottom: 20,
                }}>
                  &ldquo;{quote}&rdquo;
                </p>
                <p style={{ fontSize: 12, color: '#6b6575', fontWeight: 500 }}>— {role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────── */}
      <section style={{ background: '#d4860a', padding: 'clamp(80px, 10vw, 120px) 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h2 className="font-fraunces reveal-scroll" style={{
            fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 300,
            color: '#1a0e00', lineHeight: 1.2, marginBottom: 20,
          }}>
            Deine erste Frage wartet.
          </h2>
          <p className="reveal-scroll" style={{
            fontSize: 17, color: 'rgba(26,14,0,0.65)',
            lineHeight: 1.65, marginBottom: 44,
          }}>
            Kostenlos, anonym, ohne Registrierung.<br />
            Einfach fragen.
          </p>
          <button
            className="reveal-scroll"
            onClick={() => openChat('allgemein')}
            style={{
              background: '#1a0e00', color: '#f5c97a',
              border: 'none', borderRadius: 9999,
              padding: '18px 44px', fontSize: 16, fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
              transition: 'transform .15s, box-shadow .15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.35)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.25)';
            }}
          >
            Jetzt starten →
          </button>
        </div>
      </section>

      {/* ── Footer ──────────────────────────── */}
      <footer style={{
        background: '#080808',
        padding: '40px 24px',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: 12, color: '#555',
          lineHeight: 1.8, maxWidth: 600, margin: '0 auto',
        }}>
          Alle Informationen basieren auf öffentlichem Fachwissen aus deutschen Pflegekassen,
          Sozialverbänden und Behörden. Kein Ersatz für individuelle Rechts- oder Pflegeberatung.{' '}
          <button
            onClick={() => setShowDisclaimer(true)}
            style={{
              color: '#555', background: 'none', border: 'none',
              cursor: 'pointer', textDecoration: 'underline', fontSize: 12,
            }}
          >
            Hinweise lesen
          </button>
        </p>
      </footer>
    </div>
  );
}
