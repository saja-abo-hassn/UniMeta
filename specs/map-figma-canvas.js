const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./specs/figma-structure.json', 'utf8'));
const page = data.document.children[0];

const labels = page.children.filter(c => c.type === 'TEXT');
const frames = page.children.filter(c => c.type === 'FRAME');

console.log('--- LABELS ---');
labels.forEach(l => console.log(`[${l.id}] ${l.name}: "${l.characters}" at y=${Math.round(l.absoluteBoundingBox?.y)}`));

console.log('\n--- FRAMES ---');
frames.forEach(f => {
  const y = Math.round(f.absoluteBoundingBox?.y || 0);
  const x = Math.round(f.absoluteBoundingBox?.x || 0);
  console.log(`[${f.id}] (x=${x}, y=${y}, size=${Math.round(f.absoluteBoundingBox?.width)}x${Math.round(f.absoluteBoundingBox?.height)}): ${f.name}`);
});

