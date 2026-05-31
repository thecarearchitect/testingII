'use client';

import { MODES, Mode, ModeId } from '@/lib/modes';

interface ModeSelectorProps {
  activeMode: ModeId;
  onSelect: (modeId: ModeId) => void;
}

export default function ModeSelector({ activeMode, onSelect }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-3 bg-white border-b border-gray-100">
      {MODES.map((mode: Mode) => (
        <button
          key={mode.id}
          onClick={() => onSelect(mode.id)}
          className={`
            flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all duration-200
            ${
              activeMode === mode.id
                ? `${mode.bgColor} ${mode.borderColor} ${mode.color} shadow-sm`
                : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100 hover:border-gray-200'
            }
          `}
        >
          <span className="text-xl">{mode.icon}</span>
          <span className="text-xs font-semibold leading-tight text-center">{mode.title}</span>
        </button>
      ))}
    </div>
  );
}
