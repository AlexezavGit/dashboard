# Copilot instructions for this repository

This file helps future Copilot sessions interact with the project quickly.

## Build, test, and lint commands
- Install dependencies: `npm ci` (CI) or `npm install` (dev)
- Run dev server: `npm run dev` (starts Vite)
- Build (production): `npm run build` (vite build)
- Preview (local build + Cloudflare wrangler): `npm run preview`
- Deploy: `npm run deploy` (build then `wrangler deploy`)
- Lint / typecheck: `npm run lint` (runs `tsc --noEmit`)
- Tests: no test runner configured. To type-check a single file: `npx tsc path/to/file.tsx --noEmit`.

## High-level architecture
- Frontend single-page app built with Vite + React + TypeScript.
- Tailwind is used for styling (see `tailwindcss` + `@tailwindcss/vite`).
- App entry points: `index.tsx`, `App.tsx`, and `index.html`.
- Logical folders:
  - `components/` — React UI components
  - `services/` — API integration and data-fetching helpers
  - `worker/` — Cloudflare Worker related code
  - `functions/`, `scripts/` — assorted helpers and build scripts
- Deployment: Cloudflare Workers via Wrangler. The GitHub Actions workflow `.github/workflows/deploy.yml` runs `npm ci`, `npm run build`, then `npx wrangler deploy` on `main`.
- Runtime config: environment secrets (e.g., `GEMINI_API_KEY`) are expected in local env files; see `.env.example`.

## Key repository conventions
- Type checking is used as the primary "lint" step (`tsc --noEmit`) — fix type errors rather than bypassing the check.
- `wrangler` is used for preview and deployment; `npm run preview` runs `vite build` then `wrangler dev`.
- `vite` config is in `vite.config.ts` with Cloudflare plugin present (`@cloudflare/vite-plugin`).
- `constants.ts` and `types.ts` centralize app-wide constants and TypeScript types.
- Keep Cloudflare account IDs / tokens out of source — CI uses repository secrets (`CLOUDFLARE_API_TOKEN`).

## AI/assistant integration files
- No existing Copilot/assistant instruction file detected prior to creating this file.
- No CLAUDE.md, .cursorrules, AGENTS.md, or AIDER_CONVENTIONS.md were found.

---

MCP servers
- Cloudflare Workers runner configured at `.github/mcp-servers.yml`. Uses GitHub Actions repository secrets: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
- Deploy command: `npx wrangler deploy` (uses secrets above).
- Preview command: `npm run preview` (runs `vite build` then `wrangler dev`).

If changes are needed to the MCP config or to support other runners (Playwright), update `.github/mcp-servers.yml` or ask to add additional configs.
