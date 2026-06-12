import Link from 'next/link';
import { Heart } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata = {
  title: 'Preise – PflegeAssistent KI',
  description: 'Kostenlos starten, auf Premium upgraden. Founding Member erhalten dauerhaft kostenlosen Zugang.',
};

const PREMIUM_FEATURES = ['Dokumentenarchiv', 'Fristen-Assistent', 'Erinnerungen per E-Mail', 'Widerspruchshilfe', 'Fallhistorie'];

export default function PricingPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <style>{`
        .p-btn-outline:hover { border-color: var(--accent) !important; }
        .p-btn-solid:hover   { opacity: 0.85 !important; }
      `}</style>

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-dark-border)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(212,134,10,0.18)', border: '1px solid rgba(212,134,10,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={14} color="#f59e0b" fill="#f59e0b" />
            </div>
            <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--text)', fontSize: 15, fontWeight: 600 }}>
              PflegeAssistent <span style={{ color: 'var(--accent)' }}>KI</span>
            </span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ThemeToggle />
            <Link href="/" style={{ fontSize: 13, color: 'var(--text-sub)', textDecoration: 'none' }}>
              ← Zurück zur App
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(70px, 10vw, 110px) 24px clamp(100px, 13vw, 150px)' }}>

        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--accent)', marginBottom: 20, textAlign: 'center' }}>
          Preise
        </p>

        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 300, color: 'var(--text)', lineHeight: 1.15, marginBottom: 16, textAlign: 'center' }}>
          Dein digitales Pflegegedächtnis.
        </h1>

        <p style={{ fontSize: 17, color: 'var(--text-sub)', lineHeight: 1.8, textAlign: 'center', maxWidth: 520, margin: '0 auto 72px' }}>
          Starte kostenlos. Steig auf, wenn du mehr brauchst.
        </p>

        {/* Pricing cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20, alignItems: 'stretch',
        }}>

          {/* Kostenlos */}
          <div style={{
            padding: '40px 32px', background: 'var(--bg-card)',
            border: '1px solid var(--border)', borderRadius: 20,
            display: 'flex', flexDirection: 'column',
          }}>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-sub)', marginBottom: 16 }}>Kostenlos</p>
            <p style={{ fontSize: 48, fontWeight: 700, color: 'var(--text)', fontFamily: 'Fraunces, Georgia, serif', lineHeight: 1, marginBottom: 32 }}>0 €</p>
            <div style={{ flexGrow: 1, marginBottom: 32 }}>
              {['Pflegefragen stellen', 'Pflegewissen nutzen', 'Erste Orientierung'].map(f => (
                <div key={f} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                  <span style={{ color: 'var(--accent)', flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 14, color: 'var(--text-sub)', lineHeight: 1.5 }}>{f}</span>
                </div>
              ))}
            </div>
            <Link href="/" className="p-btn-outline" style={{
              background: 'transparent', color: 'var(--accent)',
              border: '1px solid rgba(212,134,10,0.45)',
              borderRadius: 9999, padding: '13px 24px',
              fontSize: 14, fontWeight: 600,
              textAlign: 'center', textDecoration: 'none', display: 'block',
              transition: 'border-color .15s',
            }}>
              Kostenlos starten →
            </Link>
          </div>

          {/* Founding Member */}
          <div style={{
            padding: '40px 32px', background: 'var(--bg-card)',
            border: '2px solid var(--accent)', borderRadius: 20,
            display: 'flex', flexDirection: 'column', position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
              background: 'var(--accent)', color: '#fff',
              fontSize: 10, fontWeight: 700, letterSpacing: '2px',
              padding: '4px 14px', borderRadius: 9999, whiteSpace: 'nowrap',
            }}>
              NUR 100 PLÄTZE
            </div>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--accent)', marginBottom: 16 }}>Founding Member</p>
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 48, fontWeight: 700, color: 'var(--text)', fontFamily: 'Fraunces, Georgia, serif', lineHeight: 1 }}>9,90 €</span>
              <span style={{ fontSize: 14, color: 'var(--text-sub)', marginLeft: 8 }}>/ Monat</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-sub)', marginBottom: 4 }}>Monatlich kündbar</p>
            <p style={{ fontSize: 12, color: 'var(--accent)', fontStyle: 'italic', marginBottom: 8 }}>Beta-Phase: Kostenlos testen</p>
            <p style={{ fontSize: 13, color: 'var(--text-sub)', fontStyle: 'italic', lineHeight: 1.65, marginBottom: 24 }}>
              Die ersten 100 Founding Member erhalten Premium dauerhaft kostenlos — als Dankeschön für frühes Feedback und die Unterstützung beim Aufbau.
            </p>
            <div style={{ flexGrow: 1, marginBottom: 32 }}>
              {PREMIUM_FEATURES.map(f => (
                <div key={f} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                  <span style={{ color: 'var(--accent)', flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 14, color: 'var(--text-sub)', lineHeight: 1.5 }}>{f}</span>
                </div>
              ))}
            </div>
            <a href="/waitlist" className="p-btn-solid" style={{
              background: 'var(--accent)', color: '#fff',
              borderRadius: 9999, padding: '13px 24px',
              fontSize: 14, fontWeight: 600,
              textAlign: 'center', textDecoration: 'none', display: 'block',
              transition: 'opacity .15s',
            }}>
              Founding Member werden →
            </a>
          </div>

          {/* Jahresabo */}
          <div style={{
            padding: '40px 32px', background: 'var(--bg-card)',
            border: '1px solid var(--border)', borderRadius: 20,
            display: 'flex', flexDirection: 'column', position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
              background: '#2a6b3f', color: '#e8f5ee',
              fontSize: 10, fontWeight: 700, letterSpacing: '2px',
              padding: '4px 14px', borderRadius: 9999, whiteSpace: 'nowrap',
            }}>
              25 % GÜNSTIGER
            </div>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-sub)', marginBottom: 16 }}>Jahresabo</p>
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 48, fontWeight: 700, color: 'var(--text)', fontFamily: 'Fraunces, Georgia, serif', lineHeight: 1 }}>7,50 €</span>
              <span style={{ fontSize: 14, color: 'var(--text-sub)', marginLeft: 8 }}>/ Monat</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-sub)', marginBottom: 32 }}>90 € pro Jahr</p>
            <div style={{ flexGrow: 1, marginBottom: 32 }}>
              {PREMIUM_FEATURES.map(f => (
                <div key={f} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                  <span style={{ color: 'var(--accent)', flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 14, color: 'var(--text-sub)', lineHeight: 1.5 }}>{f}</span>
                </div>
              ))}
            </div>
            <a href="/waitlist" className="p-btn-outline" style={{
              background: 'transparent', color: 'var(--accent)',
              border: '1px solid rgba(212,134,10,0.45)',
              borderRadius: 9999, padding: '13px 24px',
              fontSize: 14, fontWeight: 600,
              textAlign: 'center', textDecoration: 'none', display: 'block',
              transition: 'border-color .15s',
            }}>
              Jahresabo wählen →
            </a>
          </div>

        </div>

        <p style={{ marginTop: 56, fontSize: 13, color: 'var(--text-dimmer)', textAlign: 'center', lineHeight: 1.7 }}>
          Kein Abo-Zwang. Monatlich kündbar. Premium startet demnächst —{' '}
          <a href="/waitlist" style={{ color: 'var(--text-dim)', textDecoration: 'underline' }}>trag dich auf die Warteliste ein.</a>
        </p>

      </main>

      {/* Footer */}
      <footer style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)', padding: '32px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: 'var(--text-sub)' }}>
          <Link href="/impressum" style={{ color: 'var(--text-sub)', textDecoration: 'none' }}>Impressum</Link>
          <span style={{ margin: '0 10px', color: 'var(--border)' }}>·</span>
          <Link href="/datenschutz" style={{ color: 'var(--text-sub)', textDecoration: 'none' }}>Datenschutz</Link>
        </p>
      </footer>
    </div>
  );
}
