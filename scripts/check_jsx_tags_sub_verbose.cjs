const fs = require('fs');
const fname = process.argv[2] || 'scripts/part_for_jsx_debug.tsx';
const s = fs.readFileSync(fname,'utf8');
const startIdx = s.indexOf('return (');
if (startIdx === -1) { console.error('No return ( found'); process.exit(1); }
const sub = s.slice(startIdx);
let stack = [];
let inSingle=false, inDouble=false, inBack=false, inLine=false, inBlock=false, braceDepth=0;
for (let i=0;i<sub.length;i++){
  const c=sub[i]; const next=sub[i+1];
  if (inLine){ if (c==='\n') inLine=false; continue; }
  if (inBlock){ if (c==='*' && sub[i+1]==='/'){ inBlock=false; i++; } continue; }
  if (!inSingle && !inDouble && !inBack){ if (c==='/' && next==='/'){ inLine=true; i++; continue; } if (c==='/' && next==='*'){ inBlock=true; i++; continue; } }
  if (!inLine && !inBlock){ if (!inDouble && !inBack && c==="'") { inSingle=!inSingle; continue; } if (!inSingle && !inBack && c=='"') { inDouble=!inDouble; continue; } if (!inSingle && !inDouble && c==='`') { inBack=!inBack; continue; } }
  if (inSingle || inDouble || inBack) continue;
  if (c==='{' ) { braceDepth++; continue; }
  if (c==='}' ) { if (braceDepth>0) braceDepth--; continue; }
  if (braceDepth>0) continue;
  if (c==='<'){
    if (sub[i+1]==='>'){ stack.push({name:'<>',pos:i}); i++; continue; }
    if (sub[i+1]==='/'){
      let j=i+2; while(j<sub.length && /\s/.test(sub[j])) j++; let name=''; while(j<sub.length && /[A-Za-z0-9_.$:]/.test(sub[j])) { name+=sub[j]; j++; }
      const last = stack.pop(); if (!last) { console.error('Closing tag without open',name,'at',i); }
      continue;
    } else {
      let j=i+1; while(j<sub.length && /\s/.test(sub[j])) j++; let name=''; while(j<sub.length && /[A-Za-z0-9_.$:]/.test(sub[j])) { name+=sub[j]; j++; } if (!name) name='(anon)';
      let attrSingle=false, attrDouble=false; let k=j; let selfClosing=false; while(k<sub.length){const ch=sub[k]; if (!attrSingle && !attrDouble && ch==="'") { attrSingle=true; k++; continue; } if (attrSingle && ch==="'" && sub[k-1] !=='\\') { attrSingle=false; k++; continue; } if (!attrDouble && !attrSingle && ch==='"') { attrDouble=true; k++; continue; } if (attrDouble && ch==='"' && sub[k-1] !=='\\') { attrDouble=false; k++; continue; } if (!attrSingle && !attrDouble && ch==='/' && sub[k+1]==='>') { selfClosing=true; k+=2; break; } if (!attrSingle && !attrDouble && ch==='>') { k++; break; } k++; }
      if (!selfClosing) stack.push({name,pos:i}); i=k-1; continue;
    }
  }
}
if (stack.length){
  console.error('Unclosed tags count',stack.length);
  const full = fs.readFileSync('components/screens/L1Strategic.tsx','utf8');
  for (let x=stack.length-1;x>=0;x--){ const it=stack[x]; const posInFile = startIdx + it.pos; const linesBefore = full.slice(0,posInFile).split('\n'); const lineNo = linesBefore.length; console.error('unclosed',it.name,'at index',posInFile,'line',lineNo); console.error('---- snippet ----'); console.error(full.split('\n').slice(Math.max(0,lineNo-5),lineNo+3).join('\n')) }
  process.exit(2);
}
console.log('No unclosed tags found');
