'use client';

import { MODES, Mode, ModeId } from '@/lib/modes';

interface ModeSelectorProps {
  activeMode: ModeId;
  onSelect: (modeId: ModeId) => void;
}

export default function ModeSelector({ activeMode, onSelect }: ModeSelectorProps) {
  return (
    <div className="flex gap-1 px-3 py-2 overflow-x-auto scrollbar-hide">
      {MODES.map((mode: Mode) => (
        <button
          key={mode.id}
          onClick={() => onSelect(mode.id)}
          className={`
            flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-all duration-150 flex-shrink-0
            ${
              activeMode === mode.id
                ? `${mode.bgColor} ${mode.color} ${mode.borderColor} border font-semibold shadow-sm`
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100 border border-transparent'
            }
          `}
        >
          <span className="text-base leading-none">{mode.icon}</span>
          <span className="text-xs">{mode.title}</span>
        </button>
      ))}
    </div>
  );
}
