'use client';

import { useState, useEffect } from 'react';
import { X, Save, User, FileText, ChevronDown, ChevronUp } from 'lucide-react';

export interface UserSettings {
  personalContext: string;
  customInstructions: string;
}

interface SettingsPanelProps {
  onClose: () => void;
  onSave: (settings: UserSettings) => void;
  initial: UserSettings;
}

export default function SettingsPanel({ onClose, onSave, initial }: SettingsPanelProps) {
  const [personalContext, setPersonalContext] = useState(initial.personalContext);
  const [customInstructions, setCustomInstructions] = useState(initial.customInstructions);
  const [showExamples, setShowExamples] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave({ personalContext, customInstructions });
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 800);
  };

  const hasContent = personalContext.trim() || customInstructions.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
         style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl"
           style={{ background: 'rgba(20,14,6,0.95)', border: '1px solid rgba(255,190,80,0.15)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/8">
          <div>
            <h2 className="text-white/90 font-bold text-base">Persönliche Einstellungen</h2>
            <p className="text-white/35 text-xs mt-0.5">Die KI nutzt diese Angaben in jedem Gespräch</p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Personal context */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User size={14} className="text-amber-400" />
              <label className="text-sm font-semibold text-white/80">Meine Pflegesituation</label>
              <span className="text-xs text-white/25 ml-1">optional</span>
            </div>
            <p className="text-xs text-white/35 mb-2.5 leading-relaxed">
              Beschreibe deine Situation – die KI antwortet dann gezielter und persönlicher.
            </p>
            <textarea
              value={personalContext}
              onChange={(e) => setPersonalContext(e.target.value)}
              placeholder="z. B.: Ich pflege meine Mutter (78 Jahre, Pflegegrad 2, Alzheimer im Frühstadium) zuhause. Wir wohnen in Bayern. Mein Vater lebt noch und hilft teilweise mit…"
              rows={5}
              className="w-full resize-none rounded-xl px-4 py-3 text-sm
                         bg-white/6 border border-white/10 text-white/80 placeholder-white/20
                         focus:outline-none focus:ring-1 focus:ring-amber-400/40 focus:border-amber-400/30
                         focus:bg-white/10 transition-all leading-relaxed"
            />
            <p className="text-xs text-white/20 mt-1">{personalContext.length} Zeichen</p>
          </div>

          {/* Custom instructions */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText size={14} className="text-amber-400" />
              <label className="text-sm font-semibold text-white/80">Eigene Anweisungen</label>
              <span className="text-xs text-white/25 ml-1">optional</span>
            </div>
            <p className="text-xs text-white/35 mb-2.5 leading-relaxed">
              Wie soll die KI antworten? Stil, Länge, Schwerpunkte.
            </p>
            <textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="z. B.: Antworte immer kurz und verständlich. Verwende keine Fachbegriffe ohne Erklärung. Gib wenn möglich konkrete nächste Schritte an."
              rows={4}
              className="w-full resize-none rounded-xl px-4 py-3 text-sm
                         bg-white/6 border border-white/10 text-white/80 placeholder-white/20
                         focus:outline-none focus:ring-1 focus:ring-amber-400/40 focus:border-amber-400/30
                         focus:bg-white/10 transition-all leading-relaxed"
            />
          </div>

          {/* Examples toggle */}
          <div>
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="flex items-center gap-1.5 text-xs text-amber-400/60 hover:text-amber-400 transition-colors"
            >
              {showExamples ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              Beispiele anzeigen
            </button>
            {showExamples && (
              <div className="mt-3 space-y-2">
                {[
                  { label: 'Pflegesituation', text: 'Ich pflege meinen Vater (82, Pflegegrad 3, Herzinsuffizienz) seit 2 Jahren zuhause in Hamburg. Er ist noch mobil mit Rollator.' },
                  { label: 'Anweisung: Kurz', text: 'Antworte immer in maximal 5 Sätzen. Dann liste konkrete nächste Schritte auf.' },
                  { label: 'Anweisung: Dokumente', text: 'Wenn du Musterbriefe erstellst, füge immer Datum, Absender und vollständige Anschrift ein.' },
                ].map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (i === 0) setPersonalContext(ex.text);
                      else setCustomInstructions(ex.text);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl bg-white/4 hover:bg-white/8
                               border border-white/8 transition-all"
                  >
                    <p className="text-xs text-amber-400/60 font-medium mb-0.5">{ex.label}</p>
                    <p className="text-xs text-white/40 leading-snug">{ex.text}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info box */}
          <div className="bg-amber-500/8 border border-amber-400/15 rounded-xl p-3.5">
            <p className="text-xs text-amber-200/50 leading-relaxed">
              💾 Deine Angaben werden nur lokal in deinem Browser gespeichert (localStorage) –
              sie werden nicht übertragen oder gespeichert, außer wenn du die KI aktiv nutzt.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          {hasContent && (
            <button
              onClick={() => { setPersonalContext(''); setCustomInstructions(''); }}
              className="px-4 py-3 rounded-xl text-sm text-white/30 hover:text-white/50
                         border border-white/8 hover:bg-white/5 transition-all"
            >
              Leeren
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all
                       bg-amber-500 text-white hover:bg-amber-400 shadow-lg shadow-amber-900/30"
          >
            {saved ? '✓ Gespeichert!' : 'Einstellungen speichern'}
          </button>
        </div>
      </div>
    </div>
  );
}
