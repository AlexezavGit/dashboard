const fs=require('fs');
const s=fs.readFileSync('scripts/part_for_jsx_debug.tsx','utf8');
let inS=false,inD=false,inB=false;let brace=0;
for(let i=0;i<s.length;i++){const c=s[i];const prev=s[i-1];
  if(!inD&&!inB&&!inS){ if(c==="'") inS=true; else if(c==='"') inD=true; else if(c==='`') inB=true; }
  else if(inS && c==="'" && prev !=='\\') inS=false;
  else if(inD && c==='"' && prev !=='\\') inD=false;
  else if(inB && c==='`' && prev !=='\\') inB=false;
  if(!inS && !inD && !inB){ if(c==='{') brace++; if(c==='}') brace--; }
}
console.log('brace net',brace);
// print last 200 chars for context
console.log('tail:',s.slice(-200));
