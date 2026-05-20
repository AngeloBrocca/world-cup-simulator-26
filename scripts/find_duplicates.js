const fs = require('fs');
const p = __dirname + '/..//src/domain/knockoutBracket.js';
const s = fs.readFileSync(p,'utf8');
const m = s.match(/ANNEX_C\s*=\s*{([\s\S]*?)\n};/);
const body = m ? m[1] : s;
const keys = [...body.matchAll(/['\"]([^'\"]+)['\"]\s*:/g)].map(a=>a[1]);
const counts = {};
keys.forEach(k=>counts[k]=(counts[k]||0)+1);
const duplicates = Object.entries(counts).filter(([k,v])=>v>1);
console.log('total keys', keys.length, 'unique', Object.keys(counts).length);
if (duplicates.length) {
  console.log('duplicates:');
  duplicates.forEach(d=>console.log(d[0], '×', d[1]));
} else console.log('no duplicates');
console.log('\n-- all duplicate occurrences (with line numbers) --');
const lines = s.split(/\r?\n/);
const dupKeys = new Set(duplicates.map(d=>d[0]));
for (let i=0;i<lines.length;i++){
  for (const k of dupKeys){
    if (lines[i].includes('"'+k+'"') || lines[i].includes("'"+k+"'")) console.log(i+1, lines[i].trim());
  }
}
