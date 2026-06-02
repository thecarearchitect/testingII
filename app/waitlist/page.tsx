'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, CheckCircle } from 'lucide-react';

export default function WaitlistPage() {
  const [email, setEmail]       = useState('');
  const [status, setStatus]     = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Fehler beim Speichern');
      }
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Unbekannter Fehler');
    }
  };

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
      <main style={{ maxWidth: 560, margin: '0 auto', padding: 'clamp(80px, 12vw, 130px) 24px', textAlign: 'center' }}>

        {/* Amber dot */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(212,134,10,0.12)',
          border: '1px solid rgba(212,134,10,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 40px',
        }}>
          <span style={{ fontSize: 22, color: '#d4860a' }}>✦</span>
        </div>

        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px', color: '#d4860a', marginBottom: 20 }}>
          Premium
        </p>

        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 300, color: '#f0ede8', lineHeight: 1.15, marginBottom: 20 }}>
          Premium kommt bald.
        </h1>

        <p style={{ fontSize: 17, color: '#a09a90', lineHeight: 1.8, marginBottom: 52 }}>
          Trag dich ein und wir informieren dich als Erstes.
        </p>

        {status === 'success' ? (
          <div style={{
            padding: '32px 28px',
            background: '#16162a',
            border: '1px solid rgba(212,134,10,0.25)',
            borderRadius: 16,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
          }}>
            <CheckCircle size={32} color="#d4860a" />
            <p style={{ fontSize: 16, color: '#f0ede8', lineHeight: 1.7 }}>
              Danke! Wir melden uns, sobald Premium startet.
            </p>
            <Link href="/" style={{
              marginTop: 8, fontSize: 13, color: '#a09a90', textDecoration: 'none',
            }}>
              ← Zurück zur App
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="deine@email.de"
              required
              disabled={status === 'loading'}
              style={{
                width: '100%', padding: '16px 20px',
                background: '#16162a',
                border: '1px solid #2a2a3f',
                borderRadius: 12, fontSize: 15,
                color: '#f0ede8', outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color .15s',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(212,134,10,0.50)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#2a2a3f'; }}
            />
            <button
              type="submit"
              disabled={status === 'loading' || !email.trim()}
              style={{
                background: status === 'loading' ? 'rgba(212,134,10,0.5)' : '#d4860a',
                color: '#fff', border: 'none',
                borderRadius: 9999, padding: '16px 32px',
                fontSize: 15, fontWeight: 600, cursor: status === 'loading' ? 'default' : 'pointer',
                transition: 'opacity .15s',
              }}
              onMouseEnter={e => { if (status !== 'loading') e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              {status === 'loading' ? 'Wird gespeichert…' : 'Benachrichtigen →'}
            </button>

            {status === 'error' && (
              <p style={{ fontSize: 13, color: '#e87070', textAlign: 'center' }}>{errorMsg}</p>
            )}
          </form>
        )}

        <p style={{ marginTop: 24, fontSize: 13, color: '#4a4455', lineHeight: 1.7 }}>
          Keine Werbung. Nur eine Nachricht wenn Premium startet.
        </p>

        {/* Coming soon features */}
        <div style={{ marginTop: 64, textAlign: 'left' }}>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#4a4455', marginBottom: 20, textAlign: 'center' }}>
            Was dich erwartet
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              'Dokumentenarchiv — alle Bescheide an einem Ort',
              'Automatische Fristenerkennung aus Dokumenten',
              'Erinnerungen per E-Mail vor Fristablauf',
              'Fallhistorie für mehrere Angehörige',
            ].map(f => (
              <div key={f} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ color: '#d4860a', flexShrink: 0, marginTop: 1 }}>✓</span>
                <span style={{ fontSize: 14, color: '#6b6575', lineHeight: 1.6 }}>{f}</span>
              </div>
            ))}
          </div>
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
