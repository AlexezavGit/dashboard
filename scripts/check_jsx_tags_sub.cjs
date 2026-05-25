const fs = require('fs');
const fname = process.argv[2] || 'scripts/part_for_jsx_debug.tsx';
const s = fs.readFileSync(fname,'utf8');
const startIdx = s.indexOf('return (');
if (startIdx === -1) { console.error('No return ( found'); process.exit(1); }
const sub = s.slice(startIdx);
let stack = [];
let inSingle=false, inDouble=false, inBacktick=false, inLine=false, inBlock=false, braceDepth=0;
for (let i=0;i<sub.length;i++){
  const c=sub[i]; const next=sub[i+1];
  if (inLine) { if (c==='\n') inLine=false; continue; }
  if (inBlock) { if (c==='*' && sub[i+1]==='/') { inBlock=false; i++; } continue; }
  if (!inSingle && !inDouble && !inBacktick) {
    if (c==='/' && next==='/') { inLine=true; i++; continue; }
    if (c==='/' && next==='*') { inBlock=true; i++; continue; }
  }
  if (!inLine && !inBlock) {
    if (!inDouble && !inBacktick && c=="'") { inSingle=!inSingle; continue; }
    if (!inSingle && !inBacktick && c=='"') { inDouble=!inDouble; continue; }
    if (!inSingle && !inDouble && c==='`') { inBacktick=!inBacktick; continue; }
  }
  if (inSingle || inDouble || inBacktick) continue;
  if (c==='{' ) { braceDepth++; continue; }
  if (c==='}' ) { if (braceDepth>0) braceDepth--; continue; }
  if (braceDepth>0) continue; // ignore < inside JS expressions
  if (c==='<'){
    // check for fragment
    if (sub[i+1]==='>') { stack.push({name:'<>',pos:i}); i++; continue; }
    if (sub[i+1]==='/') {
      // closing tag
      // parse name after '</'
      let j=i+2; while(j<sub.length && /\s/.test(sub[j])) j++;
      let name=''; while(j<sub.length && /[A-Za-z0-9_.$:]/.test(sub[j])) { name+=sub[j]; j++; }
      // pop stack
      const last = stack.pop();
      if (!last) { console.error('Closing tag without open',name,'at',i); process.exit(1); }
      if (last.name==='<>') {
        if (name) { /* allow */ }
      } else {
        // no strict name matching
      }
      continue;
    } else {
      // opening tag: parse name
      let j=i+1; while(j<sub.length && /\s/.test(sub[j])) j++;
      let name=''; while(j<sub.length && /[A-Za-z0-9_.$:]/.test(sub[j])) { name+=sub[j]; j++; }
      if (!name) name='(anon)';
      // find end of tag '>' skipping quoted attrs
      let attrSingle=false, attrDouble=false; let k=j; let selfClosing=false; while(k<sub.length){const ch=sub[k]; if (!attrSingle && !attrDouble && ch==="'") { attrSingle=true; k++; continue; } if (attrSingle && ch==="'" && sub[k-1]!=='\\') { attrSingle=false; k++; continue; } if (!attrDouble && !attrSingle && ch==='"') { attrDouble=true; k++; continue; } if (attrDouble && ch==='"' && sub[k-1]!=='\\') { attrDouble=false; k++; continue; } if (!attrSingle && !attrDouble && ch==='/' && sub[k+1]==='>') { selfClosing=true; k+=2; break; } if (!attrSingle && !attrDouble && ch==='>') { k++; break; } k++; }
      if (!selfClosing) stack.push({name,pos:i});
      i=k-1; continue;
    }
  }
}
if (stack.length) {
  console.error('Unclosed tags count',stack.length,'top 5:',stack.slice(-5));
  // print last 5 entries with line numbers
  const stext=sub;
  for (let x=stack.length-1; x>=Math.max(0,stack.length-5); x--){ const it=stack[x]; const upto=stext.slice(0,it.pos).split('\n'); console.error('unclosed',it.name,'at index',it.pos,'line',upto.length); console.error('context:\n'+stext.slice(Math.max(0,it.pos-40),Math.min(stext.length,it.pos+80))); }
  process.exit(2);
}
console.log('No unclosed tags found in component return');
