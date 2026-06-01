'use client';

import { MODES, Mode, ModeId } from '@/lib/modes';

interface ModeSelectorProps {
  activeMode: ModeId;
  onSelect: (modeId: ModeId) => void;
}

export default function ModeSelector({ activeMode, onSelect }: ModeSelectorProps) {
  return (
    <div className="flex gap-1 px-3 py-2.5 overflow-x-auto scrollbar-hide">
      {MODES.map((mode: Mode) => (
        <button
          key={mode.id}
          onClick={() => onSelect(mode.id)}
          className={`
            flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap
            transition-all duration-200 flex-shrink-0 text-xs font-medium
            ${
              activeMode === mode.id
                ? 'bg-amber-500/25 text-amber-300 border border-amber-400/40 shadow-sm shadow-amber-900/20'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent'
            }
          `}
        >
          <span className="text-sm leading-none">{mode.icon}</span>
          <span>{mode.title}</span>
        </button>
      ))}
    </div>
  );
}
