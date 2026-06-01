'use client';

import { useState } from 'react';
import { Shield, Check } from 'lucide-react';

export default function DisclaimerModal({ onAccept }: { onAccept: () => void }) {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const canProceed = checked1 && checked2;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
         style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl"
           style={{ background: 'rgba(20,14,6,0.92)', border: '1px solid rgba(255,190,80,0.15)' }}>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/25 flex items-center justify-center">
              <Shield size={20} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-white/90 font-bold text-base">Wichtige Hinweise</h2>
              <p className="text-white/35 text-xs">Bitte vor der Nutzung lesen</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-4">
          <div className="bg-amber-500/10 border border-amber-400/20 rounded-xl p-4">
            <p className="text-amber-300 text-xs font-semibold mb-1.5">⚠️ Kein Ersatz für Fachberatung</p>
            <p className="text-amber-200/60 text-xs leading-relaxed">
              Dieser KI-Assistent gibt <strong className="text-amber-200/80">allgemeine Informationen</strong> –
              keine individuelle Rechts-, Medizin- oder Pflegeberatung.
            </p>
          </div>

          <div className="space-y-3 text-xs text-white/50">
            <div className="flex gap-3">
              <span className="text-amber-500/70 mt-0.5 flex-shrink-0">📚</span>
              <p><strong className="text-white/70">Woher kommen die Informationen?</strong><br />
              Aus öffentlich zugänglichen Quellen: Pflegekassen, VdK, Caritas, AWO, Bundesministerien
              und Fachportalen. Allgemeiner Stand – individuelle Fälle können abweichen.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-amber-500/70 mt-0.5 flex-shrink-0">⚖️</span>
              <p><strong className="text-white/70">Keine Haftung</strong><br />
              Alle Angaben sind ohne Gewähr. Gesetze und Leistungen ändern sich. Bitte informiere
              dich vor wichtigen Entscheidungen bei deiner Pflegekasse oder einem Beratungsangebot.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-amber-500/70 mt-0.5 flex-shrink-0">🔒</span>
              <p><strong className="text-white/70">Datenschutz</strong><br />
              Teile keine persönlichen Daten wie vollständige Namen oder Versicherungsnummern.</p>
            </div>
          </div>

          <div className="bg-white/4 rounded-xl p-3.5">
            <p className="text-white/35 text-xs font-medium mb-2">Kostenlose Beratungsstellen:</p>
            <div className="grid grid-cols-2 gap-1 text-xs text-white/30">
              <span>• Pflegestützpunkte</span>
              <span>• VdK Deutschland</span>
              <span>• Caritas / AWO</span>
              <span>• Pflegekasse (0800)</span>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3 pt-1">
            {[
              { checked: checked1, set: setChecked1, label: 'Ich verstehe, dass dies keine professionelle Rechts- oder Pflegeberatung ist und hole bei wichtigen Entscheidungen Fachrat ein.' },
              { checked: checked2, set: setChecked2, label: 'Ich habe den Haftungsausschluss gelesen und akzeptiere, dass alle Informationen ohne Gewähr sind.' },
            ].map(({ checked, set, label }, i) => (
              <label key={i} className="flex items-start gap-3 cursor-pointer group">
                <div
                  onClick={() => set(!checked)}
                  className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 border flex items-center justify-center transition-all ${
                    checked
                      ? 'bg-amber-500 border-amber-500'
                      : 'border-white/20 group-hover:border-amber-400/40'
                  }`}
                >
                  {checked && <Check size={11} className="text-white" strokeWidth={3} />}
                </div>
                <p className="text-xs text-white/50 leading-snug group-hover:text-white/65 transition-colors">
                  {label}
                </p>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onAccept}
            disabled={!canProceed}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${
              canProceed
                ? 'bg-amber-500 text-white hover:bg-amber-400 shadow-lg shadow-amber-900/40'
                : 'bg-white/5 text-white/25 cursor-not-allowed border border-white/8'
            }`}
          >
            {canProceed ? '✓ Verstanden – Assistent starten' : 'Bitte beide Punkte bestätigen'}
          </button>
        </div>
      </div>
    </div>
  );
}
