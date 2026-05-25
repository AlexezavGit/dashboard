const fs = require('fs');
const s = fs.readFileSync('components/screens/L1Strategic.tsx','utf8');
let re1 = /'((?:\\.|[^'\\])*)'/gs;
let m; let found = false;
while ((m = re1.exec(s)) !== null) {
  if (m[1].includes('\n')) {
    let idx = m.index; let linesBefore = s.slice(0, idx).split('\n').length;
    console.log('Multiline single-quoted string at index', idx, 'line', linesBefore);
    console.log('>>>', JSON.stringify(m[0].slice(0,200)));
    found = true;
  }
}
let re2 = /"((?:\\.|[^"\\])*)"/gs;
while ((m = re2.exec(s)) !== null) {
  if (m[1].includes('\n')) {
    let idx = m.index; let linesBefore = s.slice(0, idx).split('\n').length;
    console.log('Multiline double-quoted string at index', idx, 'line', linesBefore);
    console.log('>>>', JSON.stringify(m[0].slice(0,200)));
    found = true;
  }
}
if (!found) console.log('No multiline single/double-quoted strings found');
