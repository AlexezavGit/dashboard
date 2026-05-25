const fs = require('fs');
const p = 'components/screens/L1Strategic.tsx';
const backup = p + '.bak';
try { fs.copyFileSync(p, backup); } catch(e) { /* ignore */ }
let s = fs.readFileSync(p, 'utf8');
let lines = s.split('\n');
let out = [];
let cur = '';
function countUnescaped(str, q) {
  let c = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === q) {
      let j = i - 1;
      let esc = false;
      while (j >= 0 && str[j] === '\\') { esc = !esc; j--; }
      if (!esc) c++;
    }
  }
  return c;
}
for (let i = 0; i < lines.length; i++) {
  cur = cur === '' ? lines[i] : cur + '\n' + lines[i];
  const sng = countUnescaped(cur, "'");
  const dbl = countUnescaped(cur, '"');
  if (sng % 2 === 0 && dbl % 2 === 0) {
    const fixed = cur.replace(/\n/g, ' ');
    out.push(fixed);
    cur = '';
  }
}
if (cur !== '') out.push(cur.replace(/\n/g, ' '));
fs.writeFileSync(p, out.join('\n'), 'utf8');
console.log('repaired lines:', out.length);
