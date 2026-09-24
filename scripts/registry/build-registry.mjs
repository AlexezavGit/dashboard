#!/usr/bin/env node
// Збірка data/registry.generated.ts з канонічного реєстру фактів FEEL Again.
//
// Джерело: FEEL/00_WIP/_REGISTRY.csv (єдине первинне місце запису чисел, _0_ВХІД.md §0).
// Запуск:  node scripts/registry/build-registry.mjs <шлях/до/_REGISTRY.csv>
//
// Правила:
//  • у модуль потрапляють лише рядки зі статусом verified · assumption · disputed;
//  • заборонені рядки (forbidden) потрапляють тільки кодом — без значення і без назви,
//    бо назва забороненого рядка часто містить сам літерал; імпортувати заборонене
//    значення з модуля фізично неможливо;
//  • значення зберігається рядком точно як у CSV — без округлення і скорочення;
//  • у заголовок пишеться SHA-256 файла-джерела, щоб будь-хто міг перевірити,
//    з якої версії реєстру зібрано модуль.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const src = process.argv[2];
if (!src) { console.error('Вкажіть шлях до _REGISTRY.csv'); process.exit(2); }
const raw = readFileSync(src);
const sha = createHash('sha256').update(raw).digest('hex');
const text = raw.toString('utf8').replace(/^﻿/, '');

// RFC 4180: лапки, коми і переноси рядків усередині полів.
function parseCsv(s) {
  const rows = []; let row = []; let f = ''; let q = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) {
      if (c === '"') { if (s[i + 1] === '"') { f += '"'; i++; } else q = false; }
      else f += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && s[i + 1] === '\n') i++;
      row.push(f); f = ''; if (row.some(x => x !== '')) rows.push(row); row = [];
    } else f += c;
  }
  if (f !== '' || row.length) { row.push(f); if (row.some(x => x !== '')) rows.push(row); }
  return rows;
}

const [head, ...body] = parseCsv(text);
const need = ['code', 'name', 'value', 'unit', 'period', 'formula', 'origin', 'tier', 'status', 'conflict', 'replaced_by'];
for (const k of need) if (!head.includes(k)) { console.error(`У реєстрі немає поля «${k}»`); process.exit(1); }
const idx = Object.fromEntries(head.map((h, i) => [h, i]));
const rec = body.map(r => Object.fromEntries(head.map(h => [h, (r[idx[h]] ?? '').trim()])));

const ALLOWED = new Set(['verified', 'assumption', 'disputed']);
const allowed = [], forbidden = [], bad = [];
const seen = new Set();
for (const r of rec) {
  if (!/^R-\d{3}$/.test(r.code)) { bad.push(`код «${r.code}»`); continue; }
  if (seen.has(r.code)) { bad.push(`дубль ${r.code}`); continue; }
  seen.add(r.code);
  if (r.status === 'forbidden') forbidden.push(r);
  else if (ALLOWED.has(r.status)) {
    if (r.value === '' || !Number.isFinite(Number(r.value))) bad.push(`${r.code}: значення «${r.value}» не число`);
    else allowed.push(r);
  } else bad.push(`${r.code}: невідомий статус «${r.status}»`);
}
if (bad.length) { console.error('Реєстр не пройшов перевірку:\n  ' + bad.join('\n  ')); process.exit(1); }

const J = v => JSON.stringify(v);
const lines = [];
lines.push('// АВТОЗГЕНЕРОВАНО скриптом scripts/registry/build-registry.mjs — НЕ РЕДАГУВАТИ ВРУЧНУ.');
lines.push('// Джерело: FEEL/00_WIP/_REGISTRY.csv');
lines.push(`// SHA-256 джерела: ${sha}`);
lines.push(`// Рядків: ${rec.length} · дозволених: ${allowed.length} · заборонених (лише коди): ${forbidden.length}`);
lines.push('');
lines.push("export type RegStatus = 'verified' | 'assumption' | 'disputed';");
lines.push('export interface RegEntry {');
lines.push('  code: string; name: string;');
lines.push('  /** Значення точно як у реєстрі, без округлення. */');
lines.push('  value: string;');
lines.push('  unit: string; period: string; formula: string; origin: string;');
lines.push('  tier: number; status: RegStatus; conflict: string;');
lines.push('}');
lines.push(`export const REGISTRY_SOURCE_SHA256 = ${J(sha)};`);
lines.push('export const REGISTRY = {');
for (const r of allowed) {
  lines.push(`  ${J(r.code)}: { code: ${J(r.code)}, name: ${J(r.name)}, value: ${J(r.value)}, unit: ${J(r.unit)}, ` +
    `period: ${J(r.period)}, formula: ${J(r.formula)}, origin: ${J(r.origin)}, tier: ${Number(r.tier) || 0}, ` +
    `status: ${J(r.status)}, conflict: ${J(r.conflict)} },`);
}
lines.push('} as const satisfies Record<string, RegEntry>;');
lines.push('export type RegCode = keyof typeof REGISTRY;');
lines.push('/** Заборонені коди — лише ідентифікатори. Значень і назв тут немає свідомо. */');
lines.push(`export const FORBIDDEN_CODES: readonly string[] = ${J(forbidden.map(r => r.code))};`);
lines.push('');

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, '../../data/registry.generated.ts');
writeFileSync(out, lines.join('\n'));
console.log(`registry.generated.ts: ${allowed.length} дозволених · ${forbidden.length} заборонених кодів · sha256 ${sha.slice(0, 16)}…`);
