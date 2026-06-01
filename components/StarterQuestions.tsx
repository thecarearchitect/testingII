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
  modeColor,
  modeBgColor,
}: StarterQuestionsProps) {
  return (
    <div className="flex flex-col justify-center h-full px-4 py-6 gap-5 max-w-2xl mx-auto w-full">
      {/* Mode intro card */}
      <div className={`${modeBgColor} rounded-2xl p-5`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{modeIcon}</span>
          <div>
            <h2 className={`font-bold text-base ${modeColor}`}>{modeTitle}</h2>
            <p className="text-slate-500 text-xs mt-0.5">{modeSubtitle}</p>
          </div>
        </div>
        <p className="text-slate-600 text-xs leading-relaxed">
          Ich beantworte deine Fragen auf Basis öffentlich verfügbaren Fachwissens aus deutschen
          Pflegekassen, Sozialverbänden und Behörden.
        </p>
      </div>

      {/* Quick start questions */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 px-1">
          Häufige Fragen
        </p>
        <div className="space-y-2">
          {questions.map((question, i) => (
            <button
              key={i}
              onClick={() => onSelect(question)}
              className="w-full text-left px-4 py-3 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-sm text-slate-700 hover:text-blue-700 transition-all duration-150 shadow-sm group"
            >
              <div className="flex items-start gap-2">
                <span className="text-blue-300 group-hover:text-blue-500 transition-colors mt-0.5 flex-shrink-0">›</span>
                <span>{question}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center">
        Oder schreibe deine eigene Frage unten
      </p>
    </div>
  );
}
