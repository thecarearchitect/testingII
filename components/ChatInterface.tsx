'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Trash2, Square, AlertCircle, Paperclip, X, FileText } from 'lucide-react';
import MessageBubble from './MessageBubble';
import StarterQuestions from './StarterQuestions';
import { MODES, ModeId } from '@/lib/modes';
import { UserSettings } from './SettingsPanel';
import SparkleIcon from './SparkleIcon';

export interface Attachment {
  name: string;
  size: number;
  mediaType: 'application/pdf' | 'image/jpeg' | 'image/png';
  data: string; // base64, no prefix
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  attachment?: Attachment;
}

const ALLOWED_TYPES: Record<string, Attachment['mediaType']> = {
  'application/pdf': 'application/pdf',
  'image/jpeg':      'image/jpeg',
  'image/png':       'image/png',
};

const MAX_BYTES = 20 * 1024 * 1024; // 20 MB

const DOCUMENT_ANALYSIS_PROMPT =
`Bitte analysiere dieses Dokument strukturiert:

**1. Dokumentenart & Absender** — Was ist das für ein Dokument, und von wem kommt es?

**2. Inhalt & Entscheidung** — Was wurde entschieden, mitgeteilt oder gefordert?

**3. Fristen** — Gibt es genannte Fristen? Wenn ja, welche und ab wann laufen sie?

**4. Einschätzung** — Wirkt die Entscheidung vollständig und korrekt? Gibt es Auffälligkeiten oder mögliche Fehler?

**5. Empfohlene nächste Schritte** — Was sollte jetzt getan werden? Ist ein Widerspruch sinnvoll?

Antworte klar, strukturiert und ohne Fachjargon.`;

function formatBytes(n: number) {
  return n < 1024 * 1024 ? `${Math.round(n / 1024)} KB` : `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

interface ChatInterfaceProps {
  modeId: ModeId;
  userSettings: UserSettings;
}

export default function ChatInterface({ modeId, userSettings }: ChatInterfaceProps) {
  const [messages, setMessages]               = useState<Message[]>([]);
  const [input, setInput]                     = useState('');
  const [isLoading, setIsLoading]             = useState(false);
  const [error, setError]                     = useState<string | null>(null);
  const [pendingAttachment, setPendingAttachment] = useState<Attachment | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef    = useRef<AbortController | null>(null);

  const activeMode = MODES.find((m) => m.id === modeId) ?? MODES[0];

  useEffect(() => {
    setMessages([]);
    setInput('');
    setError(null);
    setPendingAttachment(null);
  }, [modeId]);

  const adjustTextarea = () => {
    const ta = textareaRef.current;
    if (ta) { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'; }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const mediaType = ALLOWED_TYPES[file.type];
    if (!mediaType) { setError('Nur PDF, JPG und PNG werden unterstützt.'); return; }
    if (file.size > MAX_BYTES) { setError('Datei zu groß — max. 20 MB.'); return; }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const raw = ev.target?.result as string;
      const base64 = raw.split(',')[1];
      setPendingAttachment({ name: file.name, size: file.size, mediaType, data: base64 });
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const canSend = !isLoading && (input.trim().length > 0 || pendingAttachment !== null);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if ((!trimmed && !pendingAttachment) || isLoading) return;

    setError(null);
    const attachment = pendingAttachment;
    const content = trimmed || DOCUMENT_ANALYSIS_PROMPT;

    const userMessage: Message = { role: 'user', content, ...(attachment ? { attachment } : {}) };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setPendingAttachment(null);
    setIsLoading(true);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    setMessages([...newMessages, { role: 'assistant', content: '' }]);
    abortRef.current = new AbortController();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, modeId, userSettings }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        let msg = 'KI-Assistent nicht erreichbar (HTTP ' + response.status + ').';
        try { const d = await response.json(); if (d?.error) msg = d.error; } catch {}
        throw new Error(msg);
      }
      if (!response.body) throw new Error('Keine Antwort vom Server erhalten.');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages([...newMessages, { role: 'assistant', content: accumulated }]);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          return last?.role === 'assistant' && last.content === '' ? prev.slice(0, -1) : prev;
        });
        return;
      }
      setMessages((prev) => prev.slice(0, -1));
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler.');
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [messages, modeId, isLoading, userSettings, pendingAttachment]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const clearChat = () => {
    abortRef.current?.abort();
    setMessages([]);
    setIsLoading(false);
    setError(null);
    setPendingAttachment(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
        {messages.length === 0 ? (
          <StarterQuestions
            questions={activeMode.starterQuestions}
            onSelect={sendMessage}
            modeId={modeId}
            modeTitle={activeMode.title}
            modeSubtitle={activeMode.subtitle}
          />
        ) : (
          <>
            {messages.map((msg, idx) => <MessageBubble key={idx} message={msg} />)}
            {isLoading && messages[messages.length - 1]?.content === '' && (
              <div className="flex gap-3">
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(212,134,10,0.15)', border: '1px solid rgba(212,134,10,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <SparkleIcon active />
                </div>
                <div style={{
                  background: '#16162a', border: '1px solid #2a2a3f',
                  borderRadius: '12px 12px 12px 4px', padding: '12px 16px',
                }}>
                  <div className="flex gap-1.5 items-center h-5">
                    <div className="w-1.5 h-1.5 bg-amber-600 rounded-full typing-dot" />
                    <div className="w-1.5 h-1.5 bg-amber-600 rounded-full typing-dot" />
                    <div className="w-1.5 h-1.5 bg-amber-600 rounded-full typing-dot" />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {error && (
          <div className="flex items-start gap-2 bg-red-900/30 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-300">
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {messages.length > 0 && (
        <p className="text-center text-xs text-white/20 px-4 pb-1">
          Allgemeine Informationen – kein Ersatz für individuelle Fachberatung
        </p>
      )}

      {/* Input area */}
      <div className="flex-shrink-0 px-4 py-3"
           style={{ background: 'rgba(10,8,5,0.75)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>

        {messages.length > 0 && (
          <div className="flex justify-end mb-2">
            <button onClick={clearChat}
              className="flex items-center gap-1.5 text-xs text-white/25 hover:text-red-400 transition-colors">
              <Trash2 size={11} /> Gespräch löschen
            </button>
          </div>
        )}

        {/* Attachment preview */}
        {pendingAttachment && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#16162a', border: '1px solid #2a2a3f',
            borderRadius: 10, padding: '8px 12px', marginBottom: 8,
          }}>
            <FileText size={14} color="#d4860a" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: '#f0ede8', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {pendingAttachment.name}
            </span>
            <span style={{ fontSize: 11, color: '#6b6575', flexShrink: 0 }}>
              {formatBytes(pendingAttachment.size)}
            </span>
            <button onClick={() => setPendingAttachment(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b6575', display: 'flex', padding: 2 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f0ede8')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6b6575')}>
              <X size={14} />
            </button>
          </div>
        )}

        <div className="flex gap-2 items-end">
          {/* Hidden file input */}
          <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange} style={{ display: 'none' }} />

          {/* Paperclip button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            style={{
              flexShrink: 0, width: 40, height: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 12,
              border: `1px solid ${pendingAttachment ? '#d4860a' : 'rgba(255,255,255,0.10)'}`,
              background: pendingAttachment ? 'rgba(212,134,10,0.15)' : 'rgba(255,255,255,0.05)',
              color: pendingAttachment ? '#d4860a' : 'rgba(255,255,255,0.35)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background .15s, color .15s, border-color .15s',
            }}
            onMouseEnter={e => { if (!isLoading && !pendingAttachment) { e.currentTarget.style.borderColor = '#d4860a'; e.currentTarget.style.color = '#d4860a'; } }}
            onMouseLeave={e => { if (!pendingAttachment) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; } }}
          >
            <Paperclip size={15} />
          </button>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); adjustTextarea(); }}
            onKeyDown={handleKeyDown}
            placeholder={pendingAttachment
              ? 'Frage zur Datei… (oder leer lassen für automatische Analyse)'
              : `Deine Frage zu „${activeMode.title}"…`}
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none rounded-xl px-4 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-amber-400/40 transition-all"
            style={{
              minHeight: '42px', maxHeight: '120px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.9)',
            }}
          />

          {isLoading ? (
            <button
              onClick={() => { abortRef.current?.abort(); setIsLoading(false); }}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors border border-red-500/30"
            >
              <Square size={13} fill="currentColor" />
            </button>
          ) : (
            <button
              onClick={() => sendMessage(input)}
              disabled={!canSend}
              style={{
                flexShrink: 0, width: 40, height: 40,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 12, border: 'none',
                cursor: canSend ? 'pointer' : 'not-allowed',
                background: '#d4860a', color: '#fff',
                opacity: canSend ? 1 : 0.3,
                transition: 'background .15s ease, opacity .15s ease',
                boxShadow: canSend ? '0 4px 16px rgba(212,134,10,0.30)' : 'none',
              }}
              onMouseEnter={e => { if (canSend) e.currentTarget.style.background = '#e8950a'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#d4860a'; }}
              onMouseDown={e => { if (canSend) e.currentTarget.style.background = '#c07808'; }}
              onMouseUp={e => { if (canSend) e.currentTarget.style.background = '#e8950a'; }}
            >
              <Send size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
