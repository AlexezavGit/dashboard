export type ScreenId =
  | 'l1'                // Strategic entry — full viewport, no scroll, MHEI + 6 layer KPIs
  // — 6 program layer L2 screens —
  | 'l2-fintech'        // FinTech: verified outcome-linked payment rate
  | 'l2-clinical'       // Clinical: rehabilitation completion rate
  | 'l2-data'           // Data & Coordination: interoperability rate
  | 'l2-sustain'        // Sustainable Development: training conversion (imitation index)
  | 'l2-digital'        // Digitalization: admin overhead → resource erosion
  | 'l2-regulatory'     // Regulatory: humanitarian localization
  // — legacy/supporting drill-downs —
  | 'l2-finance'        // (alias of l2-fintech for back-compat — financial chain visualization)
  | 'l2-coverage'       // Coverage decomposition (legacy)
  | 'l2-backlog'        // Backlog calculation (legacy)
  | 'l2-operational'    // 9 systemic gaps — flip cards
  | 'l2-analytical'     // Data visibility map
  | 'appendix';         // Full scrolling brief (operational/architectural content)

export interface ScreenNav {
  current: ScreenId;
  history: ScreenId[];
  push: (id: ScreenId) => void;
  back: () => void;
  reset: () => void;
}
