const fs = require('fs');
const p = 'components/screens/L1Strategic.tsx';
const s = fs.readFileSync(p,'utf8');
const patterns = ['\\ont', "Journey\\s", "\\n", "\\\\"];
patterns.forEach(pat => {
  let idx = s.indexOf(pat);
  if (idx === -1) {
    console.log('not found:', pat);
  } else {
    console.log('found', pat, 'at', idx);
    console.log(JSON.stringify(s.slice(Math.max(0, idx-30), idx+30)));
    console.log([...s.slice(Math.max(0, idx-30), idx+30)].map(c=>c.charCodeAt(0)));
  }
});
// show snippet around the earlier parser index
const parserIndex = 33202;
console.log('\nContext around parser index:', parserIndex);
console.log(JSON.stringify(s.slice(parserIndex-60, parserIndex+60)));
console.log([...s.slice(parserIndex-60, parserIndex+60)].map(c=>c.charCodeAt(0)).join(' '));
