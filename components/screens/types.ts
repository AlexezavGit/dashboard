export type ScreenId =
  | 'l1'               // Strategic entry — full viewport, no scroll
  | 'l2-cost'          // Drill-down: $6–8B GDP loss anatomy
  | 'l2-coverage'      // Drill-down: 0.28% → where does the gap come from
  | 'l2-backlog'       // Drill-down: 12.5yr backlog decomposition
  | 'l2-operational'   // Operational overview: 9 gaps
  | 'l2-analytical'    // Analytical overview: data visibility map
  | 'appendix';        // Full scrolling dashboard (all existing content)

export interface ScreenNav {
  current: ScreenId;
  history: ScreenId[];
  push: (id: ScreenId) => void;
  back: () => void;
  reset: () => void;
}
