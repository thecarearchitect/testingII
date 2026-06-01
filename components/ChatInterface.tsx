'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Trash2, Square, AlertCircle } from 'lucide-react';
import MessageBubble from './MessageBubble';
import StarterQuestions from './StarterQuestions';
import { MODES, ModeId } from '@/lib/modes';
import { UserSettings } from './SettingsPanel';
import SparkleIcon from './SparkleIcon';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  modeId: ModeId;
  userSettings: UserSettings;
}

export default function ChatInterface({ modeId, userSettings }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const activeMode = MODES.find((m) => m.id === modeId) ?? MODES[0];

  useEffect(() => {
    setMessages([]);
    setInput('');
    setError(null);
  }, [modeId]);

  const adjustTextarea = () => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    }
  };

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setError(null);
    const userMessage: Message = { role: 'user', content: trimmed };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
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
        try {
          const data = await response.json();
          if (data?.error) msg = data.error;
        } catch {}
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
      const msg = err instanceof Error ? err.message : 'Unbekannter Fehler.';
      setError(msg);
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [messages, modeId, isLoading, userSettings]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
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
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} message={msg} />
            ))}
            {isLoading && messages[messages.length - 1]?.content === '' && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center flex-shrink-0">
                  <SparkleIcon active />
                </div>
                <div className="glass-light rounded-2xl rounded-tl-sm px-4 py-3 shadow-lg shadow-black/20">
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
          ⚠️ Allgemeine Informationen – kein Ersatz für individuelle Fachberatung
        </p>
      )}

      {/* Input area – fixed dark background so text is always readable */}
      <div className="flex-shrink-0 px-4 py-3"
           style={{ background: 'rgba(10,8,5,0.75)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {messages.length > 0 && (
          <div className="flex justify-end mb-2">
            <button
              onClick={() => { abortRef.current?.abort(); setMessages([]); setIsLoading(false); setError(null); }}
              className="flex items-center gap-1.5 text-xs text-white/25 hover:text-red-400 transition-colors"
            >
              <Trash2 size={11} />
              Gespräch löschen
            </button>
          </div>
        )}

        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); adjustTextarea(); }}
            onKeyDown={handleKeyDown}
            placeholder={`Deine Frage zu „${activeMode.title}"…`}
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none rounded-xl px-4 py-2.5 text-sm leading-relaxed
                       focus:outline-none focus:ring-1 focus:ring-amber-400/40 transition-all"
            style={{
              minHeight: '42px',
              maxHeight: '120px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.9)',
            }}
          />

          {isLoading ? (
            <button
              onClick={() => { abortRef.current?.abort(); setIsLoading(false); }}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl
                         bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors border border-red-500/30"
            >
              <Square size={13} fill="currentColor" />
            </button>
          ) : (
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl
                         bg-amber-500/80 text-white hover:bg-amber-500 disabled:opacity-30
                         disabled:cursor-not-allowed transition-colors shadow-lg shadow-amber-900/30"
            >
              <Send size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
