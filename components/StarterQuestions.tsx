'use client';

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
  modeTitle,
  modeSubtitle,
}: StarterQuestionsProps) {
  return (
    <div className="flex flex-col justify-center h-full px-4 py-6 gap-6 max-w-2xl mx-auto w-full">
      {/* Intro card — icon removed, left-aligned */}
      <div style={{
        background: '#16162a',
        border: '1px solid #2a2a3f',
        borderRadius: 16,
        padding: '20px 20px',
      }}>
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
                transition: 'border-color .2s ease, box-shadow .2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#d4860a';
                e.currentTarget.style.boxShadow = '0 0 0 1px rgba(212,134,10,0.13)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#2a2a3f';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
