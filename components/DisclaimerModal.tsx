'use client';

import { useState, useEffect } from 'react';
import { Shield, ExternalLink, Check } from 'lucide-react';

interface DisclaimerModalProps {
  onAccept: () => void;
}

export default function DisclaimerModal({ onAccept }: DisclaimerModalProps) {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);

  const canProceed = checked1 && checked2;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Shield size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Wichtige Hinweise</h2>
              <p className="text-blue-100 text-sm">Bitte vor der Nutzung lesen</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-amber-800 text-sm font-semibold mb-1">⚠️ Kein Ersatz für Fachberatung</p>
            <p className="text-amber-700 text-sm leading-relaxed">
              Dieser KI-Assistent gibt <strong>allgemeine Informationen</strong> – keine individuelle
              Rechts-, Medizin- oder Pflegeberatung. Für persönliche Entscheidungen wende dich immer
              an qualifizierte Fachleute.
            </p>
          </div>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex gap-3">
              <span className="text-blue-500 mt-0.5">📚</span>
              <p>
                <strong>Woher kommen die Informationen?</strong><br />
                Die KI wurde mit Inhalten aus öffentlichen Quellen trainiert: Pflegekassen,
                Sozialverbänden (VdK, Caritas, AWO), Landesverbänden, Bundesministerien und
                Fachportalen. Die Informationen spiegeln den allgemeinen Stand wider – individuelle
                Fälle können abweichen.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-500 mt-0.5">⚖️</span>
              <p>
                <strong>Keine Haftung</strong><br />
                Alle Angaben sind ohne Gewähr. Gesetze, Leistungen und Regelungen ändern sich.
                Bitte informiere dich vor wichtigen Entscheidungen immer bei deiner Pflegekasse
                oder einem anerkannten Beratungsangebot.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-500 mt-0.5">🔒</span>
              <p>
                <strong>Datenschutz</strong><br />
                Teile keine persönlichen Daten wie vollständige Namen, Versicherungsnummern oder
                Adressen im Chat.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-blue-800 text-xs font-medium mb-2">Empfohlene Beratungsstellen:</p>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-blue-700">
              <span>• Pflegestützpunkte</span>
              <span>• VdK Deutschland</span>
              <span>• Caritas / AWO</span>
              <span>• Pflegekasse (0800er)</span>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div
                onClick={() => setChecked1(!checked1)}
                className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                  checked1 ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'
                }`}
              >
                {checked1 && <Check size={12} className="text-white" strokeWidth={3} />}
              </div>
              <p className="text-sm text-gray-700 leading-snug">
                Ich verstehe, dass dies <strong>keine professionelle Rechts- oder
                Pflegeberatung</strong> ist und hole bei wichtigen Entscheidungen
                zusätzlich Fachrat ein.
              </p>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <div
                onClick={() => setChecked2(!checked2)}
                className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                  checked2 ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'
                }`}
              >
                {checked2 && <Check size={12} className="text-white" strokeWidth={3} />}
              </div>
              <p className="text-sm text-gray-700 leading-snug">
                Ich habe die Hinweise zu <strong>Haftungsausschluss und Datenschutz</strong> gelesen
                und akzeptiere, dass alle Informationen ohne Gewähr sind.
              </p>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onAccept}
            disabled={!canProceed}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${
              canProceed
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {canProceed ? '✓ Verstanden – Assistent starten' : 'Bitte beide Punkte bestätigen'}
          </button>
        </div>
      </div>
    </div>
  );
}
