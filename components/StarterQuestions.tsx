'use client';

import ModeIcon from './ModeIcon';
import type { ModeId } from '@/lib/modes';

interface StarterQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
  modeId: ModeId;
  modeTitle: string;
  modeSubtitle: string;
}

export default function StarterQuestions({
  questions,
  onSelect,
  modeId,
  modeTitle,
  modeSubtitle,
}: StarterQuestionsProps) {
  return (
    <div className="flex flex-col justify-center h-full px-4 py-6 gap-6 max-w-2xl mx-auto w-full">
      {/* Intro */}
      <div style={{
        background: '#16162a',
        border: '1px solid #2a2a3f',
        borderRadius: 16,
        padding: '24px 20px',
        textAlign: 'center',
      }}>
        <div style={{ marginBottom: 12 }}>
          <ModeIcon modeId={modeId} size={28} />
        </div>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f0ede8', marginBottom: 4 }}>
          {modeTitle}
        </h2>
        <p style={{ fontSize: 12, color: '#a09a90', lineHeight: 1.5 }}>{modeSubtitle}</p>
      </div>

      {/* Starter questions */}
      <div>
        <p style={{
          fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
          letterSpacing: '2px', color: '#6b6575',
          marginBottom: 10, paddingLeft: 4,
        }}>
          Häufige Fragen
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {questions.map((question, i) => (
            <button
              key={i}
              onClick={() => onSelect(question)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '14px 16px',
                background: '#16162a',
                border: '1px solid #2a2a3f',
                borderRadius: 12,
                fontSize: 14,
                color: '#f0ede8',
                cursor: 'pointer',
                fontWeight: 400,
                lineHeight: 1.5,
                transition: 'border-color .15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#d4860a')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#2a2a3f')}
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      <p style={{ fontSize: 12, color: '#4a4455', textAlign: 'center' }}>
        Oder schreibe deine eigene Frage unten
      </p>
    </div>
  );
}
