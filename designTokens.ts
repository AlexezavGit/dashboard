/**
 * FEEL Again — canonical design tokens
 * Source of truth: "FEEL Again - Design System Canvas.dc.html" (Bunker palette)
 * + ring-nav.js v6 (metal ring physics) + "FEEL Ring v7" (horizon typography concept)
 * Alex 2026-08-01: thin yellow-metal scale, sharp edges, horizon glow labels,
 * NO metal plate — 2 bands: global ring + data strip. Local nav → left edge drawer.
 */

export const DS = {
  // ── Palette (Design System A1 · H) ───────────────────────────────
  royal:    '#0E4D63',   // КОРОЛІВСЬКИЙ (royal teal)
  teal:     '#1C5A52',   // ТІАЛ
  tealDeep: '#123C3A',   // petrol-teal
  orange:   '#D35F1E',   // ОРАНЖ
  orangeHi: '#E8741E',
  goldA:    '#C9B36A',   // ЗОЛОТО-A (dark gold)
  goldB:    '#FAB007',   // ЗОЛОТО-B (bright gold)
  goldText: '#E3A22E',   // engraved gold text
  goldHi:   '#F2C84A',   // active gold
  cream:    '#E9DEC9',   // КРЕМ (light surface)
  creamHi:  '#F2EADB',   // warm cream text
  analytic: '#2E6B5C',   // analytical green
  steel:    '#6E8C9C',   // steel blue-grey
  red:      '#C0391A',   // RED / signal

  // ── Dark surfaces ────────────────────────────────────────────────
  bgDeep:   '#050C16',   // background base
  bgNavy:   '#08111E',   // ring canvas
  panel:    '#0C2233',   // card surface
  panel2:   '#0A172A',

  // ── Metal gold gradient (thin scale, sharp edges) ────────────────
  metalGold: 'linear-gradient(180deg, #6C4A18 0%, #B08A38 18%, #F2C84A 42%, #E3A22E 58%, #8A6320 82%, #3E2C10 100%)',
  metalNotch: '#D4A030',
  metalNotchHi: '#F2DFA0',

  // ── Typography (Design System A2) ─────────────────────────────────
  fontDisplay: "'Archivo', 'Space Grotesk', system-ui, sans-serif",
  fontBody: "'Source Sans 3', 'DM Sans', system-ui, sans-serif",
  fontMono: "'Spline Sans Mono', 'JetBrains Mono', monospace",

  // ── Ring geometry (from ring-nav.js v6, compacted to thin band) ──
  ringH: 44,          // thin scale — NOT a metal plate
  ringTickMajor: 10,
  ringTickMinor: 4,
} as const;

/** Micro-indicator: 5 bars + blinking arrow (speed = data change rate) */
export const BADGE_STATES = ['VERIFIED', 'STATIC', 'PENDING', 'PROJECTION'] as const;
export type BadgeState = (typeof BADGE_STATES)[number];

export const BADGE_COLOR: Record<BadgeState, string> = {
  VERIFIED:   '#00D4AA',
  STATIC:     '#F2C84A',
  PENDING:    '#F08A2E',
  PROJECTION: '#8A5CF6',   // purple → distinct from teal/gold/orange (color-blind safe)
};
