'use client';

import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface MessageBubbleProps {
  message: Message;
}

function formatContent(text: string): string {
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  const lines = html.split('\n');
  const result: string[] = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      if (!inList) {
        result.push('<ul>');
        inList = true;
      }
      result.push(`<li>${trimmed.slice(2)}</li>`);
    } else if (trimmed.match(/^\d+\.\s/)) {
      if (!inList) {
        result.push('<ul>');
        inList = true;
      }
      result.push(`<li>${trimmed.replace(/^\d+\.\s/, '')}</li>`);
    } else {
      if (inList) {
        result.push('</ul>');
        inList = false;
      }
      if (trimmed === '') {
        result.push('<br>');
      } else if (trimmed.startsWith('###')) {
        result.push(`<h3>${trimmed.replace(/^###\s*/, '')}</h3>`);
      } else if (trimmed.startsWith('##')) {
        result.push(`<h3>${trimmed.replace(/^##\s*/, '')}</h3>`);
      } else {
        result.push(`<p>${trimmed}</p>`);
      }
    }
  }

  if (inList) result.push('</ul>');

  return result.join('');
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === 'assistant';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isAssistant) {
    return (
      <div className="flex justify-end message-enter">
        <div className="max-w-[80%] bg-blue-600 text-white rounded-2xl rounded-br-sm px-4 py-3 shadow-sm">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 message-enter group">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
        <span className="text-white text-sm">🤝</span>
      </div>
      <div className="flex-1 max-w-[90%]">
        <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
          <div
            className="prose-care text-sm text-gray-800"
            dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
          />
        </div>
        <button
          onClick={handleCopy}
          className="mt-1.5 ml-2 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
        >
          {copied ? (
            <>
              <Check size={12} />
              <span>Kopiert</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Kopieren</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
