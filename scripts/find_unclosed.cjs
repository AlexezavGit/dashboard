const fs = require('fs');
const p = 'components/screens/L1Strategic.tsx';
const s = fs.readFileSync(p, 'utf8');
const lines = s.split('\n');
function findUnclosed(quote) {
  let open = false;
  let startLine = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let j = 0;
    while (j < line.length) {
      const idx = line.indexOf(quote, j);
      if (idx === -1) break;
      let backslashes = 0;
      let k = idx - 1;
      while (k >= 0 && line[k] === '\\') { backslashes++; k--; }
      if (backslashes % 2 === 0) {
        open = !open;
        if (open) startLine = i + 1; else startLine = null;
      }
      j = idx + 1;
    }
    if (open) {
      console.log('Unclosed', quote, 'starting at line', startLine, 'currently at line', i+1);
    }
  }
}
findUnclosed("'");
findUnclosed('"');
