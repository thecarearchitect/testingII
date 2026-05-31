'use client';

import { useState } from 'react';
import { Heart, Info, X } from 'lucide-react';
import ModeSelector from '@/components/ModeSelector';
import ChatInterface from '@/components/ChatInterface';
import { ModeId, DEFAULT_MODE_ID } from '@/lib/modes';

export default function Home() {
  const [activeMode, setActiveMode] = useState<ModeId>(DEFAULT_MODE_ID);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
              <Heart size={18} className="text-white" fill="white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 leading-tight text-sm sm:text-base">
                PflegeAssistent KI
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Hilfe für pflegende Angehörige
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowInfo(!showInfo)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Info"
          >
            <Info size={18} />
          </button>
        </div>

        {/* Info banner */}
        {showInfo && (
          <div className="bg-blue-50 border-t border-blue-100 px-4 py-3 max-w-4xl mx-auto relative">
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-2 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
            <p className="text-xs text-blue-800 leading-relaxed pr-6">
              <strong>PflegeAssistent KI</strong> unterstützt pflegende Angehörige bei
              Alltagsfragen, Formularen, Widersprüchen und rechtlichen Themen. Die KI ersetzt
              keine professionelle Rechts-, Medizin- oder Pflegeberatung. Für individuelle
              Fachberatung wende dich an deine Pflegekasse, den VdK, die Caritas oder einen
              Pflegestützpunkt.
            </p>
          </div>
        )}
      </header>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden max-w-4xl w-full mx-auto">
        {/* Mode selector */}
        <ModeSelector activeMode={activeMode} onSelect={setActiveMode} />

        {/* Chat */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface modeId={activeMode} />
        </div>
      </div>
    </div>
  );
}
