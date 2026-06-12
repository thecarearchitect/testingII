'use client';

import { useState } from 'react';
import { Copy, Check, FileText, Image } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SparkleIcon from './SparkleIcon';

interface Attachment {
  name: string;
  size: number;
  mediaType: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  attachment?: Attachment;
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
    const isAutoAnalysis = !!message.attachment && message.content.startsWith('Bitte analysiere dieses Dokument');
    const isPdf = message.attachment?.mediaType === 'application/pdf';
    const AttachIcon = isPdf ? FileText : Image;

    return (
      <div className="flex justify-end message-enter">
        <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          {message.attachment && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(212,134,10,0.12)',
              border: '1px solid rgba(212,134,10,0.30)',
              borderRadius: 8, padding: '5px 10px',
            }}>
              <AttachIcon size={12} color="var(--accent)" />
              <span style={{ fontSize: 12, color: 'var(--accent)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {message.attachment.name}
              </span>
            </div>
          )}
          {!isAutoAnalysis && (
            <div style={{
              background: 'rgba(212,134,10,0.75)',
              border: '1px solid rgba(212,134,10,0.35)',
              borderRadius: '16px 16px 4px 16px',
              padding: '12px 16px',
            }}>
              <p style={{ fontSize: 14, color: '#fff', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {message.content}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 message-enter group">
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: 'rgba(212,134,10,0.15)',
        border: '1px solid rgba(212,134,10,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: 4,
      }}>
        <SparkleIcon size={12} />
      </div>

      <div style={{ flex: 1, maxWidth: '88%' }}>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '16px 20px',
        }}>
          <div className="chat-prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="mt-1.5 ml-2 flex items-center gap-1 text-xs transition-colors opacity-0 group-hover:opacity-100"
          style={{ color: 'var(--copy-btn)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--copy-btn-h)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--copy-btn)')}
        >
          {copied
            ? <><Check size={11} /><span>Kopiert</span></>
            : <><Copy size={11} /><span>Kopieren</span></>}
        </button>
      </div>
    </div>
  );
}
