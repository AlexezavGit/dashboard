#!/usr/bin/env node
// Перевірка §17 протоколу: «Заборона числа не є його прибиранням».
// Шукає в усьому коді дашборду (включно з коментарями) літерали, заборонені реєстром FEEL Again.
// Будь-який збіг зупиняє збірку. Режим --report друкує збіги, але не зупиняє.
//
// Шаблони прив'язані до кодів реєстру і до контексту, щоб не ловити випадкові збіги.
// Додавати шаблон — лише разом із рядком forbidden у FEEL/00_WIP/_REGISTRY.csv.
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const REPORT = process.argv.includes('--report');
const SKIP_DIR = new Set(['node_modules', '.git', 'dist', 'build', 'test-results', '.wrangler', '.mimosa']);
const SKIP_FILE = [/^scripts\/registry\//, /^data\/registry\.generated\.ts$/];
const EXT = /\.(ts|tsx|js|jsx|mjs|cjs|html|json)$/;
const S = '[\\s\\u00a0\\u202f]?';        // необов'язковий пробіл, у т.ч. нерозривний
const G = '[\\s\\u00a0\\u202f,]?';       // роздільник тисяч

const RULES = [
  ['R-101', `\\$${S}380${S}(M\\b|млн)|380${S}млн${S}(USD|\\$|дол)|380${G}000${G}000`],
  ['R-102', `\\$${S}900${S}(M\\b|млн)|~?\\$?900M|900${S}млн`],
  ['R-103', `\\b12${G}216\\b`],
  ['R-104', `\\b1${G}486\\b`],
  ['R-105', `13[.,]1${S}[×x]`],
  ['R-107', `ROI[^\\n]{0,20}\\b12${S}:${S}1\\b|\\b12${S}:${S}1${S}ROI`],
  ['R-108', `\\b4[.,]5${S}:${S}1\\b`],
  ['R-109', `\\b4[.,]3${S}(:${S}1\\b|[×x]\\b)`],
  ['R-112', `[×x]${S}16${S}(сес|сесій|session)|16${S}(сесій|sessions?)${S}(—|-|–)${S}(норма|standard)`],
  ['R-113', `62[.,]4${S}(M\\b|млн)|62${G}400${G}000`],
  ['R-116', `MHEI[^\\n]{0,30}\\b4[.,]12\\b`],
  ['R-117', `MHEI[^\\n]{0,30}\\b8[.,]16\\b|\\b8[.,]16\\b[^\\n]{0,30}MHEI|current${S}:${S}8[.,]16\\b`],
  ['R-123', `penaltyPct${S}:${S}65\\b|\\b65(?:[.,]5)?${S}%[^\\n]{0,60}(штраф|penalt|формаліз|formali|дох|income)|(штраф|penalt|формаліз|formali)[^\\n]{0,60}\\b65(?:[.,]5)?${S}%`],
  ['R-126', `21[.,]5${S}(р\\.|рок|рік|yr|year)|aftershockBacklogYears${S}:${S}21[.,]5`],
  ['R-127', `12[.,]4${S}(р\\.|рок|рік|yr|year|-year)|years${S}:${S}12[.,]4\\b|>12[.,]4<|62[.,]2${S}(M\\b|млн)`],
  ['R-128', `€${S}5[.,]4${S}(B\\b|млрд|bn)|5[.,]376${S}B`],
  ['R-129', `\\b19${S}K\\b|\\b19${G}000${S}(спец|практик|фахів|specialist|practitioner|\\((макс|max))`],
  ['R-130', `\\b4${G}000${S}(спец|МЗ|фахів|НСЗУ|ЕСОЗ|ЄСОЗ|ESOZ|specialist|MH|NHSU|officially|офіційно|\\((зареєстр|registered))|\\b4K${S}(спец|spec|НСЗУ|NHSU)|4000${S}×${S}1${G}250|4${G}000${S}×${S}1${G}250`],
  ['R-131', `\\b110${S}(×|x\\b|разів|times)|privateToHumanitarian${S}:${S}110\\b`],
  ['R-132', `2${G}000\\+${S}(закладів|facilities)`],
  ['R-133', `\\b0[.,]28${S}%|coveragePct${S}:${S}0[.,]28\\b`],
].map(([code, re]) => [code, new RegExp(re, 'giu')]);

function* walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!SKIP_DIR.has(e.name)) yield* walk(join(dir, e.name)); continue; }
    const rel = relative(ROOT, join(dir, e.name)).split('\\').join('/');
    if (EXT.test(e.name) && !SKIP_FILE.some(r => r.test(rel)) && rel !== 'package-lock.json') yield rel;
  }
}

const hits = [];
for (const rel of walk(ROOT)) {
  const lines = readFileSync(join(ROOT, rel), 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const [code, re] of RULES) {
      re.lastIndex = 0; let m;
      while ((m = re.exec(line))) hits.push({ code, file: rel, line: i + 1, match: m[0], ctx: line.trim().slice(Math.max(0, m.index - 50), m.index + m[0].length + 50) });
    }
  });
}

const by = hits.reduce((a, h) => ((a[h.code] ??= []).push(h), a), {});
for (const [code, hs] of Object.entries(by).sort()) {
  console.log(`${code}: ${hs.length}`);
  for (const h of hs) console.log(`   ${h.file}:${h.line}  «${h.match}»  … ${h.ctx}`);
}
console.log(`Заборонених входжень: ${hits.length}`);
if (hits.length && !REPORT) {
  console.error('Збірку зупинено: у коді є числа, заборонені реєстром FEEL Again (§17). Замініть їх кодом реєстру.');
  process.exit(1);
}
