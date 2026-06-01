'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import SparkleIcon from './SparkleIcon';

interface Message {
  role: 'user' | 'assistant';
  content: string;
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
      if (!inList) { result.push('<ul>'); inList = true; }
      result.push(`<li>${trimmed.slice(2)}</li>`);
    } else if (trimmed.match(/^\d+\.\s/)) {
      if (!inList) { result.push('<ul>'); inList = true; }
      result.push(`<li>${trimmed.replace(/^\d+\.\s/, '')}</li>`);
    } else {
      if (inList) { result.push('</ul>'); inList = false; }
      if (trimmed === '') {
        result.push('<br>');
      } else if (trimmed.startsWith('###') || trimmed.startsWith('##')) {
        result.push(`<h3>${trimmed.replace(/^#{2,3}\s*/, '')}</h3>`);
      } else {
        result.push(`<p>${trimmed}</p>`);
      }
    }
  }
  if (inList) result.push('</ul>');
  return result.join('');
}

export default function MessageBubble({ message }: { message: Message }) {
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
        <div className="max-w-[78%] bg-amber-600/80 backdrop-blur-sm border border-amber-500/30
                        text-white rounded-2xl rounded-br-sm px-4 py-3 shadow-lg shadow-amber-900/20">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 message-enter group">
      <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400/30
                      flex items-center justify-center flex-shrink-0 mt-1">
        <SparkleIcon />
      </div>
      <div className="flex-1 max-w-[88%]">
        <div className="glass-light rounded-2xl rounded-tl-sm px-4 py-3 shadow-lg shadow-black/20">
          <div
            className="prose-care text-sm text-stone-800"
            dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
          />
        </div>
        <button
          onClick={handleCopy}
          className="mt-1.5 ml-2 flex items-center gap-1 text-xs text-white/25
                     hover:text-white/50 transition-colors opacity-0 group-hover:opacity-100"
        >
          {copied ? <><Check size={11} /><span>Kopiert</span></> : <><Copy size={11} /><span>Kopieren</span></>}
        </button>
      </div>
    </div>
  );
}
