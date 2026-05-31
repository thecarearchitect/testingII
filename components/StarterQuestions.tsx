'use client';

interface StarterQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
  modeTitle: string;
  modeIcon: string;
  modeSubtitle: string;
}

export default function StarterQuestions({
  questions,
  onSelect,
  modeTitle,
  modeIcon,
  modeSubtitle,
}: StarterQuestionsProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-8 gap-6">
      <div className="text-center">
        <div className="text-5xl mb-3">{modeIcon}</div>
        <h2 className="text-xl font-bold text-gray-800">{modeTitle}</h2>
        <p className="text-sm text-gray-500 mt-1">{modeSubtitle}</p>
      </div>

      <div className="w-full max-w-lg space-y-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide text-center mb-3">
          Häufige Fragen – einfach anklicken
        </p>
        {questions.map((question, i) => (
          <button
            key={i}
            onClick={() => onSelect(question)}
            className="w-full text-left px-4 py-3 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl text-sm text-gray-700 hover:text-blue-700 transition-all duration-150 shadow-sm hover:shadow-md"
          >
            <span className="text-blue-400 mr-2">›</span>
            {question}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center max-w-sm">
        Oder schreibe deine eigene Frage unten ins Textfeld
      </p>
    </div>
  );
}
