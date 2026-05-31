'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Trash2, RotateCcw } from 'lucide-react';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const activeMode = MODES.find((m) => m.id === modeId) ?? MODES[0];

  useEffect(() => {
    setMessages([]);
    setInput('');
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

      const userMessage: Message = { role: 'user', content: trimmed };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput('');
      setIsLoading(true);

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

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
          throw new Error('Fehler beim Laden der Antwort');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          const current = accumulated;
          setMessages([...newMessages, { role: 'assistant', content: current }]);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content:
              'Es ist ein Fehler aufgetreten. Bitte versuche es erneut. Falls das Problem weiterhin besteht, überprüfe deine Internetverbindung.',
          },
        ]);
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
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <StarterQuestions
            questions={activeMode.starterQuestions}
            onSelect={sendMessage}
            modeTitle={activeMode.title}
            modeIcon={activeMode.icon}
            modeSubtitle={activeMode.subtitle}
          />
        ) : (
          <>
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} message={msg} />
            ))}
            {isLoading && messages[messages.length - 1]?.content === '' && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-white text-sm">🤝</span>
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex gap-1 items-center h-5">
                    <div className="w-2 h-2 bg-blue-400 rounded-full typing-dot" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full typing-dot" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full typing-dot" />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-100 bg-white px-4 py-3">
        {messages.length > 0 && (
          <div className="flex gap-2 mb-2">
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={13} />
              Gespräch löschen
            </button>
          </div>
        )}

        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                adjustTextarea();
              }}
              onKeyDown={handleKeyDown}
              placeholder={`Schreibe deine Frage zu "${activeMode.title}"…`}
              rows={1}
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
              disabled={isLoading}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>

          {isLoading ? (
            <button
              onClick={handleStop}
              className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              title="Stoppen"
            >
              <RotateCcw size={18} />
            </button>
          ) : (
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
              title="Senden (Enter)"
            >
              <Send size={18} />
            </button>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-2 text-center">
          KI-Assistent für pflegende Angehörige · Kein Ersatz für professionelle Beratung
        </p>
      </div>
    </div>
  );
}
