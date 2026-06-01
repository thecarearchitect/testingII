'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Trash2, Square, AlertCircle } from 'lucide-react';
import MessageBubble from './MessageBubble';
import StarterQuestions from './StarterQuestions';
import { MODES, ModeId } from '@/lib/modes';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  modeId: ModeId;
}

export default function ChatInterface({ modeId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const activeMode = MODES.find((m) => m.id === modeId) ?? MODES[0];

  useEffect(() => {
    setMessages([]);
    setInput('');
    setError(null);
  }, [modeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const adjustTextarea = () => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    }
  };

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      setError(null);
      const userMessage: Message = { role: 'user', content: trimmed };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput('');
      setIsLoading(true);

      if (textareaRef.current) textareaRef.current.style.height = 'auto';

      const placeholderMsg: Message = { role: 'assistant', content: '' };
      setMessages([...newMessages, placeholderMsg]);

      abortRef.current = new AbortController();

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: newMessages, modeId }),
          signal: abortRef.current.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error('API-Fehler');
        }

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
            if (last?.role === 'assistant' && last.content === '') {
              return prev.slice(0, -1);
            }
            return prev;
          });
          return;
        }
        setMessages((prev) => prev.slice(0, -1));
        setError('Keine Verbindung zum KI-Assistenten. Bitte überprüfe deine Internetverbindung und versuche es erneut.');
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [messages, modeId, isLoading]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setIsLoading(false);
  };

  const handleClear = () => {
    abortRef.current?.abort();
    setMessages([]);
    setIsLoading(false);
    setError(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {messages.length === 0 ? (
          <StarterQuestions
            questions={activeMode.starterQuestions}
            onSelect={sendMessage}
            modeTitle={activeMode.title}
            modeIcon={activeMode.icon}
            modeSubtitle={activeMode.subtitle}
            modeColor={activeMode.color}
            modeBgColor={activeMode.bgColor}
          />
        ) : (
          <>
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} message={msg} />
            ))}
            {isLoading && messages[messages.length - 1]?.content === '' && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">KI</span>
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-slate-100">
                  <div className="flex gap-1 items-center h-5">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full typing-dot" />
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full typing-dot" />
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full typing-dot" />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Disclaimer strip above input */}
      {messages.length > 0 && (
        <div className="px-4 pb-1">
          <p className="text-xs text-slate-400 text-center">
            ⚠️ Allgemeine Informationen – kein Ersatz für individuelle Fachberatung
          </p>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-slate-100 px-4 py-3">
        {messages.length > 0 && (
          <div className="flex justify-end mb-2">
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={12} />
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
            placeholder={`Deine Frage zu "${activeMode.title}"…`}
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent focus:bg-white transition-all"
            style={{ minHeight: '42px', maxHeight: '120px' }}
          />

          {isLoading ? (
            <button
              onClick={handleStop}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors border border-red-200"
              title="Stoppen"
            >
              <Square size={14} fill="currentColor" />
            </button>
          ) : (
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
