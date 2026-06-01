import Link from 'next/link';
import { Heart } from 'lucide-react';

export const metadata = {
  title: 'Datenschutz – PflegeAssistent KI',
};

export default function DatenschutzPage() {
  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(10,10,15,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(212,134,10,0.18)', border: '1px solid rgba(212,134,10,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={14} color="#f59e0b" fill="#f59e0b" />
            </div>
            <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#f0ede8', fontSize: 15, fontWeight: 600 }}>
              PflegeAssistent <span style={{ color: '#d4860a' }}>KI</span>
            </span>
          </Link>
          <Link href="/" style={{ fontSize: 13, color: '#a09a90', textDecoration: 'none' }}>
            ← Zurück zur App
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(60px, 8vw, 100px) 24px' }}>

        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px', color: '#d4860a', marginBottom: 20 }}>
          Rechtliches
        </p>

        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 300, color: '#f0ede8', marginBottom: 16, lineHeight: 1.15 }}>
          Datenschutzerklärung
        </h1>
        <p style={{ fontSize: 14, color: '#6b6575', marginBottom: 60 }}>
          Gemäß DSGVO (EU 2016/679) und BDSG
        </p>

        <Section title="1. Verantwortlicher">
          <Field label="Name" value="Markus Friese" />
          <Field label="Anschrift" value="Jürgen-Toepfer-Straße 51, 22763 Hamburg" />
          <Field label="E-Mail" value="friese.markus2@googlemail.com" />
          <p style={note}>
            Bei Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte wenden Sie sich bitte an die oben genannte E-Mail-Adresse.
          </p>
        </Section>

        <Section title="2. Allgemeines zur Datenverarbeitung">
          <p style={body}>
            Ich nehme den Schutz Ihrer persönlichen Daten ernst. Diese Datenschutzerklärung informiert Sie darüber, welche Daten bei der Nutzung dieser App verarbeitet werden.
          </p>
          <p style={body}>
            <strong style={{ color: '#f0ede8' }}>Keine Pflichtangaben:</strong> Die Nutzung der App erfordert keine Registrierung, keinen Login und keine Angabe personenbezogener Daten.
          </p>
        </Section>

        <Section title="3. Hosting — Vercel">
          <p style={body}>
            Diese App wird gehostet bei <strong style={{ color: '#f0ede8' }}>Vercel Inc.</strong>, 340 Pine Street, Suite 700, San Francisco, CA 94104, USA.
          </p>
          <p style={body}>
            Beim Aufruf der App werden automatisch Verbindungsdaten (IP-Adresse, Browsertyp, Betriebssystem, Datum und Uhrzeit) in Server-Logs gespeichert. Diese Verarbeitung erfolgt auf Basis von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am sicheren Betrieb).
          </p>
          <p style={body}>
            Da Vercel ein US-amerikanisches Unternehmen ist, kann es zu einer Datenübertragung in die USA kommen. Vercel ist unter dem EU-U.S. Data Privacy Framework zertifiziert. Weitere Informationen: <span style={{ color: '#d4860a' }}>vercel.com/legal/privacy-policy</span>
          </p>
        </Section>

        <Section title="4. KI-Dienst — Anthropic">
          <p style={body}>
            Die Chatfunktion nutzt die API von <strong style={{ color: '#f0ede8' }}>Anthropic, PBC</strong>, 548 Market St PMB 90375, San Francisco, CA 94104, USA.
          </p>
          <p style={body}>
            Wenn Sie eine Frage stellen oder ein Dokument hochladen, wird Ihre Eingabe zur Verarbeitung an die Anthropic-API übertragen. Die Rechtsgrundlage hierfür ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Bereitstellung des Kerndienstes).
          </p>
          <p style={body}>
            <strong style={{ color: '#f0ede8' }}>Empfehlung:</strong> Bitte geben Sie keine Angaben ein, die über den Zweck Ihrer Pflegefrage hinausgehen (z. B. vollständige Klarnamen, Sozialversicherungsnummern, Bankdaten).
          </p>
          <p style={body}>
            Anthropic ist unter dem EU-U.S. Data Privacy Framework zertifiziert. Weitere Informationen: <span style={{ color: '#d4860a' }}>anthropic.com/privacy</span>
          </p>
          <div style={{
            marginTop: 12, padding: '10px 14px',
            background: 'rgba(212,134,10,0.07)', border: '1px solid rgba(212,134,10,0.20)',
            borderRadius: 8,
          }}>
            <p style={{ ...note, marginTop: 0, color: '#a09a90', fontStyle: 'normal' }}>
              <strong style={{ color: '#d4860a' }}>Hinweis AVV:</strong> Ob für den produktiven Betrieb ein Auftragsverarbeitungsvertrag (AVV) mit Anthropic erforderlich ist, ist noch zu prüfen und wird nachgereicht. Bitte kontaktieren Sie uns unter{' '}
              <span style={{ color: '#d4860a' }}>friese.markus2@googlemail.com</span> bei Fragen dazu.
            </p>
          </div>
        </Section>

        <Section title="5. Chat-Eingaben und hochgeladene Dokumente">
          <p style={body}>
            Texteingaben und hochgeladene Dokumente (PDF, Bilder) werden ausschließlich zur Beantwortung Ihrer Anfrage an die Anthropic-API übermittelt.
          </p>
          <p style={body}>
            <strong style={{ color: '#f0ede8' }}>Keine serverseitige Speicherung:</strong> Chat-Verläufe und hochgeladene Dokumente werden nicht dauerhaft gespeichert. Inhalte existieren nur für die Dauer Ihrer Browser-Sitzung im Arbeitsspeicher Ihres Geräts.
          </p>
          <p style={body}>
            Der Chat-Verlauf wird nach dem Schließen des Browsers oder durch die Funktion „Gespräch löschen" entfernt.
          </p>
        </Section>

        <Section title="6. Lokaler Speicher (localStorage)">
          <p style={body}>
            Die App nutzt den <strong style={{ color: '#f0ede8' }}>lokalen Browserspeicher (localStorage)</strong> ausschließlich für:
          </p>
          <ul style={{ ...body, paddingLeft: 20, marginTop: 8 }}>
            <li style={{ marginBottom: 6 }}>Bestätigung des Haftungshinweises</li>
            <li style={{ marginBottom: 6 }}>Optionaler persönlicher Kontext und eigene Anweisungen (nur wenn vom Nutzer eingetragen)</li>
          </ul>
          <p style={body}>
            Diese Daten verlassen Ihren Browser nicht. Sie können sie jederzeit im Browser unter Einstellungen → Websitedaten löschen.
          </p>
        </Section>

        <Section title="7. Keine Tracking-Cookies">
          <p style={body}>
            Diese App setzt keine Tracking-Cookies, keine Analyse-Tools (z. B. Google Analytics) und keine Werbecookies ein.
          </p>
        </Section>

        <Section title="8. Keine Rechtsberatung">
          <p style={body}>
            Die Inhalte dieser App dienen ausschließlich zur allgemeinen Information. Sie stellen keine Rechts-, Steuer-, Medizin- oder Finanzberatung dar und ersetzen diese nicht. Für individuelle Beratung wenden Sie sich an qualifizierte Fachleute.
          </p>
        </Section>

        <Section title="9. Ihre Rechte (Art. 15–22 DSGVO)">
          <p style={body}>Sie haben das Recht auf:</p>
          <ul style={{ ...body, paddingLeft: 20, marginTop: 8 }}>
            <li style={{ marginBottom: 6 }}><strong style={{ color: '#f0ede8' }}>Auskunft</strong> (Art. 15) über Ihre verarbeiteten Daten</li>
            <li style={{ marginBottom: 6 }}><strong style={{ color: '#f0ede8' }}>Berichtigung</strong> (Art. 16) unrichtiger Daten</li>
            <li style={{ marginBottom: 6 }}><strong style={{ color: '#f0ede8' }}>Löschung</strong> (Art. 17) Ihrer Daten</li>
            <li style={{ marginBottom: 6 }}><strong style={{ color: '#f0ede8' }}>Einschränkung</strong> (Art. 18) der Verarbeitung</li>
            <li style={{ marginBottom: 6 }}><strong style={{ color: '#f0ede8' }}>Widerspruch</strong> (Art. 21) gegen die Verarbeitung</li>
            <li style={{ marginBottom: 6 }}><strong style={{ color: '#f0ede8' }}>Datenübertragbarkeit</strong> (Art. 20)</li>
            <li style={{ marginBottom: 6 }}><strong style={{ color: '#f0ede8' }}>Beschwerde</strong> bei einer Aufsichtsbehörde (Art. 77)</li>
          </ul>
          <p style={{ ...body, marginTop: 12 }}>
            Zur Ausübung Ihrer Rechte:{' '}
            <span style={{ color: '#d4860a' }}>friese.markus2@googlemail.com</span>
          </p>
        </Section>

        <Section title="10. Zuständige Aufsichtsbehörde">
          <Field label="Behörde" value="Hamburgischer Beauftragter für Datenschutz und Informationsfreiheit (HmbBfDI)" />
          <Field label="Anschrift" value="Ludwig-Erhard-Str. 22, 7. OG, 20459 Hamburg" />
          <Field label="Web" value="datenschutz.hamburg.de" />
        </Section>

        <div style={{ marginTop: 60, paddingTop: 32, borderTop: '1px solid #2a2a3f' }}>
          <p style={{ fontSize: 12, color: '#4a4455' }}>
            Letzte Aktualisierung: {new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
          </p>
        </div>

      </main>

      {/* Footer */}
      <footer style={{ background: '#080808', padding: '32px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#444' }}>
          <Link href="/impressum" style={{ color: '#555', textDecoration: 'none' }}>Impressum</Link>
          <span style={{ margin: '0 10px', color: '#333' }}>·</span>
          <Link href="/datenschutz" style={{ color: '#555', textDecoration: 'none' }}>Datenschutz</Link>
        </p>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 52 }}>
      <h2 style={{ fontSize: 13, fontWeight: 600, color: '#d4860a', marginBottom: 16, letterSpacing: '0.5px' }}>
        {title}
      </h2>
      <div style={{ borderLeft: '2px solid #2a2a3f', paddingLeft: 20 }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <span style={{ fontSize: 12, color: '#6b6575', marginRight: 8 }}>{label}:</span>
      <span style={{ fontSize: 14, color: '#f0ede8' }}>{value}</span>
    </div>
  );
}

const body: React.CSSProperties = { fontSize: 14, color: '#a09a90', lineHeight: 1.8, marginBottom: 12 };
const note: React.CSSProperties = { fontSize: 12, color: '#6b6575', lineHeight: 1.7, marginTop: 8, fontStyle: 'italic' };
