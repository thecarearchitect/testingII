'use client';

interface StarterQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
  modeTitle: string;
  modeIcon: string;
  modeSubtitle: string;
  modeColor: string;
  modeBgColor: string;
}

export default function StarterQuestions({
  questions,
  onSelect,
  modeTitle,
  modeIcon,
  modeSubtitle,
}: StarterQuestionsProps) {
  return (
    <div className="flex flex-col justify-center h-full px-4 py-6 gap-5 max-w-2xl mx-auto w-full">
      {/* Intro */}
      <div className="glass rounded-2xl p-5 text-center">
        <div className="text-4xl mb-3">{modeIcon}</div>
        <h2 className="font-bold text-white/90 text-base">{modeTitle}</h2>
        <p className="text-white/40 text-xs mt-1">{modeSubtitle}</p>
        <p className="text-white/30 text-xs mt-3 leading-relaxed">
          Fachwissen aus deutschen Pflegekassen, Sozialverbänden & Behörden – komprimiert für dich
        </p>
      </div>

      {/* Starter questions */}
      <div>
        <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-2.5 px-1">
          Häufige Fragen
        </p>
        <div className="space-y-2">
          {questions.map((question, i) => (
            <button
              key={i}
              onClick={() => onSelect(question)}
              className="w-full text-left px-4 py-3 glass rounded-xl text-sm text-white/70
                         hover:bg-amber-500/15 hover:text-white hover:border-amber-400/30
                         transition-all duration-150 group"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-amber-500/50 group-hover:text-amber-400 transition-colors mt-0.5 flex-shrink-0">›</span>
                <span>{question}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-white/25 text-center">
        Oder schreibe deine eigene Frage unten
      </p>
    </div>
  );
}
