const fs = require('fs');
const p = 'components/screens/L1Strategic.tsx';
const bak = p + '.bak2';
try { fs.copyFileSync(p, bak); } catch (e) {}
let s = fs.readFileSync(p, 'utf8');
// Collapse newlines inside single-quoted strings
s = s.replace(/'((?:\\'|[^'])*?)'/gs, (m, g1) => {
  return `'${g1.replace(/\n+/g, ' ')}'`;
});
// Collapse newlines inside double-quoted strings
s = s.replace(/"((?:\\"|[^"])*?)"/gs, (m, g1) => {
  return `"${g1.replace(/\n+/g, ' ')}"`;
});
fs.writeFileSync(p, s, 'utf8');
console.log('collapsed quoted strings');
