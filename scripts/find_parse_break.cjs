const fs = require('fs');
const parser = require('@babel/parser');
const p = 'components/screens/L1Strategic.tsx';
const s = fs.readFileSync(p, 'utf8');
const lines = s.split('\n');
for (let i = 1; i <= lines.length; i++) {
  const prefix = lines.slice(0, i).join('\n');
  try {
    parser.parse(prefix, { sourceType: 'module', plugins: ['typescript', 'jsx'] });
  } catch (e) {
    console.error('PARSE FAIL AT LINE', i);
    console.error(e.message);
    if (e.loc) console.error('LOC:', JSON.stringify(e.loc));
    // print context
    const start = Math.max(1, i - 6);
    const end = Math.min(lines.length, i + 6);
    console.error('--- Context lines ' + start + '-' + end + ' ---');
    for (let j = start; j <= end; j++) {
      console.error(j + ': ' + lines[j-1]);
    }
    process.exit(0);
  }
}
console.log('No parse failure detected in line-wise scan');
