import Link from 'next/link';
import { Heart } from 'lucide-react';

export const metadata = {
  title: 'Impressum – PflegeAssistent KI',
};

export default function ImpressumPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

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
          <Link href="/" style={{ fontSize: 13, color: 'var(--text-sub)', textDecoration: 'none' }}>
            ← Zurück zur App
          </Link>
        </div>
      </nav>

      <main style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(60px, 8vw, 100px) 24px' }}>

        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--accent)', marginBottom: 20 }}>
          Rechtliches
        </p>

        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 300, color: 'var(--text)', marginBottom: 60, lineHeight: 1.15 }}>
          Impressum
        </h1>

        <Section title="Angaben gemäß § 5 TMG">
          <Field label="Betreiber" value="Markus Friese" />
          <Field label="Straße und Hausnummer" value="Jürgen-Toepfer-Straße 51" />
          <Field label="PLZ und Ort" value="22763 Hamburg" />
          <Field label="Land" value="Deutschland" />
        </Section>

        <Section title="Kontakt">
          <Field label="E-Mail" value="pflegeassistentai@gmail.com" />
          <p style={hint}>
            Hinweis: Eine Telefonnummer ist nach § 5 TMG empfohlen. Bei reinen Online-Diensten bestehen unter bestimmten Umständen Ausnahmen — bitte rechtlich prüfen lassen.
          </p>
        </Section>

        <Section title="Verantwortlich für den Inhalt (§ 55 Abs. 2 RStV)">
          <Field label="Name" value="Markus Friese" />
          <Field label="Anschrift" value="Jürgen-Toepfer-Straße 51, 22763 Hamburg" />
        </Section>

        <Section title="Haftung für Inhalte">
          <p style={body}>
            Die Inhalte dieser App wurden mit größtmöglicher Sorgfalt erstellt. Als Diensteanbieter bin ich gemäß § 7 Abs. 1 TMG für eigene Inhalte nach den allgemeinen Gesetzen verantwortlich. Die App bietet allgemeine Informationen zu Pflegethemen und stellt keine Rechts-, Medizin- oder Finanzberatung dar.
          </p>
        </Section>

        <Section title="Haftung für Links">
          <p style={body}>
            Dieses Angebot enthält möglicherweise Links zu externen Webseiten Dritter. Auf deren Inhalte habe ich keinen Einfluss und übernehme dafür keine Gewähr.
          </p>
        </Section>

        <Section title="Urheberrecht">
          <p style={body}>
            Die durch den Betreiber erstellten Inhalte und Werke unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des Autors.
          </p>
        </Section>

        <div style={{ marginTop: 60, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 12, color: 'var(--text-dimmer)' }}>
            Letzte Aktualisierung: {new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
          </p>
        </div>

      </main>

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', marginBottom: 16, letterSpacing: '0.5px' }}>
        {title}
      </h2>
      <div style={{ borderLeft: '2px solid var(--border)', paddingLeft: 20 }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <span style={{ fontSize: 12, color: 'var(--text-dim)', marginRight: 8 }}>{label}:</span>
      <span style={{ fontSize: 14, color: 'var(--text)' }}>{value}</span>
    </div>
  );
}

const body: React.CSSProperties = { fontSize: 14, color: 'var(--text-sub)', lineHeight: 1.8 };
const hint: React.CSSProperties = { fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.7, marginTop: 8, fontStyle: 'italic' };
