/**
 * ============================================================================
 *  PflegeAssistent — Zentrale Datei für volatile Werte
 * ============================================================================
 *
 *  HIER und NUR HIER stehen alle Zahlen, die sich durch Gesetzesänderungen
 *  ändern können (Beträge, Budgets, Reformstatus).
 *
 *  WENN SICH ETWAS ÄNDERT:
 *    1. Den betroffenen Wert unten ändern.
 *    2. STAND aktualisieren (z. B. "Januar 2028").
 *    3. GUELTIG_BIS auf das nächste sinnvolle Prüfdatum setzen.
 *  Fertig. Nichts anderes im Code muss angefasst werden.
 *
 *  Quellen für Updates (NUR Primärquellen, KEINE Portale):
 *    - BMG, Leistungsbeträge der Pflegeversicherung (PDF)
 *    - gesetze-im-internet.de  → SGB XI
 *    - GKV-Spitzenverband
 *
 *  ⚠️  Werte mit dem Kommentar  // ⚠️ VERIFIZIEREN  sind noch nicht
 *      gegengeprüft. Vor dem Launch aus der BMG-PDF bestätigen.
 * ============================================================================
 */

// ----------------------------------------------------------------------------
//  STAND & GÜLTIGKEIT  (das Selbst-Warnsystem)
// ----------------------------------------------------------------------------

/** Auf welchen Rechtsstand sich alle Werte beziehen. Wird in Antworten angezeigt. */
export const STAND = "Juni 2026";

/**
 * Bis zu diesem Datum gelten die Werte als "frisch genug".
 * Danach meldet isVeraltet() true → App/KI soll einen Prüf-Hinweis zeigen.
 * Faustregel: auf das nächste erwartbare Reform-/Dynamisierungsdatum setzen.
 * Nächste planmäßige Dynamisierung der Beträge: 01.01.2028 (§ 30 SGB XI).
 */
export const GUELTIG_BIS = "2026-12-31";

/** true, sobald GUELTIG_BIS überschritten ist. */
export function isVeraltet(heute: Date = new Date()): boolean {
  return heute > new Date(GUELTIG_BIS);
}

/**
 * Fertiger Hinweistext für die UI / zum Anhängen an KI-Antworten.
 * Solange aktuell: nur das Stand-Datum. Nach Ablauf: Warnung.
 */
export function standHinweis(heute: Date = new Date()): string {
  return isVeraltet(heute)
    ? `⚠️ Diese Angaben haben den Stand ${STAND} und sollten geprüft werden ` +
      `(Gültigkeit bis ${GUELTIG_BIS} hinterlegt). Bitte bei der Pflegekasse ` +
      `oder einem Pflegestützpunkt bestätigen.`
    : `Stand: ${STAND}. Alle Angaben ohne Gewähr.`;
}

// ----------------------------------------------------------------------------
//  REFORMSTATUS  (geltendes Recht vs. geplanter Entwurf)
// ----------------------------------------------------------------------------

/**
 * Wichtig für die Unangreifbarkeit: Die KI muss zwischen GELTENDEM Recht und
 * geplanten Reformen unterscheiden. Verbindlich ist nur, was im
 * Bundesgesetzblatt steht.
 */
export const REFORM_STATUS = {
  // Stand Juni 2026: PNOG-Referentenentwurf liegt vor, ist NICHT verabschiedet.
  pnogVerabschiedet: false,
  hinweis:
    "Die geplante Pflegereform (PNOG) ist noch nicht verabschiedet. Bis zur " +
    "Veröffentlichung im Bundesgesetzblatt gelten die heutigen Regelungen. " +
    "Genannte Beträge sind geltendes Recht, keine Entwurfszahlen.",
};

// ----------------------------------------------------------------------------
//  PFLEGEGELD  (§ 37 SGB XI) — monatlich, häusliche Pflege durch Angehörige
//  ✅ verifiziert (Stand Juni 2026, gilt seit 01.01.2025, +4,5 % PUEG)
// ----------------------------------------------------------------------------

export const PFLEGEGELD = {
  pg1: 0, // Pflegegrad 1 erhält kein Pflegegeld (nur Entlastungsbetrag)
  pg2: 347,
  pg3: 599,
  pg4: 800,
  pg5: 990,
} as const;

// ----------------------------------------------------------------------------
//  ENTLASTUNGSBETRAG  (§ 45b SGB XI) — monatlich, ab Pflegegrad 1
//  ✅ verifiziert
// ----------------------------------------------------------------------------

export const ENTLASTUNGSBETRAG = 131;

// ----------------------------------------------------------------------------
//  PFLEGESACHLEISTUNGEN  (§ 36 SGB XI) — monatlich, ambulanter Pflegedienst
//  ⚠️ VERIFIZIEREN — Beträge aus BMG-PDF bestätigen, dann 0 ersetzen
// ----------------------------------------------------------------------------

export const PFLEGESACHLEISTUNG = {
  pg1: 0, // PG 1: kein Anspruch auf Sachleistung
  pg2: 0, // ⚠️ VERIFIZIEREN
  pg3: 0, // ⚠️ VERIFIZIEREN
  pg4: 0, // ⚠️ VERIFIZIEREN
  pg5: 0, // ⚠️ VERIFIZIEREN
} as const;

// ----------------------------------------------------------------------------
//  VERHINDERUNGS- & KURZZEITPFLEGE  (§§ 39, 42 SGB XI)
//  Seit 01.07.2025: gemeinsames Jahresbudget (Gesamtleistungsbetrag),
//  ab Pflegegrad 2.
//  ⚠️ VERIFIZIEREN — genaue Budgethöhe aus BMG-PDF bestätigen
// ----------------------------------------------------------------------------

export const ENTLASTUNG_PFLEGE = {
  gemeinsamesBudgetAb: "2025-07-01",
  gemeinsamesJahresbudget: 0, // ⚠️ VERIFIZIEREN (ab PG 2)
  hinweis:
    "Verhinderungspflege und Kurzzeitpflege werden seit 01.07.2025 aus einem " +
    "gemeinsamen Jahresbudget finanziert (ab Pflegegrad 2).",
} as const;

// ----------------------------------------------------------------------------
//  PFLEGEHILFSMITTEL ZUM VERBRAUCH  (§ 40 SGB XI) — monatlich
//  ⚠️ VERIFIZIEREN
// ----------------------------------------------------------------------------

export const PFLEGEHILFSMITTEL_VERBRAUCH = 0; // ⚠️ VERIFIZIEREN (monatlich)

// ----------------------------------------------------------------------------
//  HELFER: Beträge als Text für den System-Prompt
// ----------------------------------------------------------------------------

/** Formatiert einen Euro-Betrag deutsch, z. B. 599 → "599 €". */
export function euro(n: number): string {
  return `${n.toLocaleString("de-DE")} €`;
}

/**
 * Baut einen kompakten Faktenblock, der in den System-Prompt eingespeist wird.
 * So "weiß" die KI die aktuellen Zahlen aus EINER Quelle — dieser Datei.
 *
 *   import { betraegeFuerPrompt } from "@/lib/pflegeBetraege";
 *   const systemPrompt = `${basisWissen}\n\n${betraegeFuerPrompt()}`;
 */
export function betraegeFuerPrompt(): string {
  return [
    `AKTUELLE PFLEGE-BETRÄGE (${standHinweis()}):`,
    REFORM_STATUS.hinweis,
    ``,
    `Pflegegeld monatlich (§ 37 SGB XI):`,
    `  Pflegegrad 1: kein Pflegegeld`,
    `  Pflegegrad 2: ${euro(PFLEGEGELD.pg2)}`,
    `  Pflegegrad 3: ${euro(PFLEGEGELD.pg3)}`,
    `  Pflegegrad 4: ${euro(PFLEGEGELD.pg4)}`,
    `  Pflegegrad 5: ${euro(PFLEGEGELD.pg5)}`,
    ``,
    `Entlastungsbetrag (§ 45b SGB XI): ${euro(ENTLASTUNGSBETRAG)} / Monat, ab Pflegegrad 1.`,
    ``,
    ENTLASTUNG_PFLEGE.hinweis,
    ``,
    `WICHTIG: Nenne bei Beträgen immer das Stand-Datum. Wenn nach Werten `,
    `gefragt wird, die hier nicht aufgeführt sind, sage das offen und `,
    `verweise auf die Pflegekasse — erfinde keine Zahlen.`,
  ].join("\n");
}
