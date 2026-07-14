const fs = require('fs');
const s = fs.readFileSync('components/screens/L1Strategic.tsx','utf8');
const lines = s.split('\n');
let stack = [];
let inSingle=false, inDouble=false, inBacktick=false, inLineComment=false, inBlockComment=false, braceDepth=0;
function isNameChar(c) { return /[A-Za-z0-9_.$]/.test(c); }
for (let i=0; i<s.length; i++){
  const c = s[i];
  const next = s[i+1];
  // handle comments and strings
  if (inLineComment) { if (c==='\n') inLineComment=false; continue; }
  if (inBlockComment) { if (c==='*' && s[i+1]==='/') { inBlockComment=false; i++; } continue; }
  if (!inSingle && !inDouble && !inBacktick) {
    if (c==='/' && next==='/') { inLineComment=true; i++; continue; }
    if (c==='/' && next==='*') { inBlockComment=true; i++; continue; }
  }
  if (!inLineComment && !inBlockComment) {
    if (!inDouble && !inBacktick && c=="'") { inSingle=!inSingle; continue; }
    if (!inSingle && !inBacktick && c=='"') { inDouble=!inDouble; continue; }
    if (!inSingle && !inDouble && c==='`') { inBacktick=!inBacktick; continue; }
  }
  if (inSingle || inDouble || inBacktick) continue;
  // Track braces depth for JS expressions
  if (c==='{' ) { braceDepth++; continue; }
  if (c==='}' ) { if (braceDepth>0) braceDepth--; continue; }
  // If not inside JS expression, detect JSX tags
  if (braceDepth===0 && c==='<'){
    // skip if it's a comparison operator (preceded by a letter/number) - naive
    const prev = s[i-1];
    if (prev && /[0-9A-Za-z_\)\]]/.test(prev)) {
      // likely comparison; skip
      continue;
    }
    const isClosing = s[i+1]==='/';
    let j = i+ (isClosing?2:1);
    // skip whitespace
    while (s[j] && /\s/.test(s[j])) j++;
    // parse tag name
    if (s[j]==='>'){
      // fragment like <> opening
      if (!isClosing) {
        stack.push({name:'<>', pos:i});
        i=j; continue;
      } else {
        // closing </>
        const last = stack.pop();
        if (!last || last.name!=='<>') {
          console.error('Mismatched fragment close at',i); process.exit(1);
        }
        i=j; continue;
      }
    }
    let name='';
    while (s[j] && /[A-Za-z0-9_.$:\-]/.test(s[j])) { name+=s[j]; j++; }
    // Now scan until '>' but skip quotes and nested brackets
    let attrInSingle=false, attrInDouble=false, k=j; let selfClosing=false;
    while (k<s.length){ const ch=s[k]; if (!attrInSingle && !attrInDouble && ch==="'") { attrInSingle=true; k++; continue; } if (attrInSingle && ch==="'" && s[k-1] !== '\\') { attrInSingle=false; k++; continue; } if (!attrInDouble && !attrInSingle && ch==='"') { attrInDouble=true; k++; continue; } if (attrInDouble && ch==='"' && s[k-1] !== '\\') { attrInDouble=false; k++; continue; } if (!attrInSingle && !attrInDouble && ch==='/' && s[k+1]==='>') { selfClosing=true; k+=2; break; } if (!attrInSingle && !attrInDouble && ch==='>') { k++; break; } k++; }
    if (!name) name='(anon)';
    if (!isClosing && !selfClosing) {
      stack.push({name, pos:i});
    } else if (isClosing) {
      const last = stack.pop();
      if (!last) { console.error('Closing tag without open',name,'at pos',i); process.exit(1); }
      // For fragments, name might be '<>' or React.Fragment
      if (last.name!==name && !(last.name==='<>' && name==='')) {
        // allow React.Fragment to close with Fragment
        if (last.name==='React.Fragment' && name==='Fragment') {
          // ok
        } else if (last.name==='<' && name==='') {
          // ???
        } else {
          if (last.name!=='(anon)' && name!=='(anon)') {
            // name mismatch
            // try to be tolerant
          }
        }
      }
    }
    i=k-1; continue;
  }
}
if (stack.length) {
  console.error('Unclosed JSX tags:', stack.map(s=>({name:s.name,pos:s.pos})).slice(0,10));
  process.exit(2);
}
console.log('No unclosed JSX tags found');
