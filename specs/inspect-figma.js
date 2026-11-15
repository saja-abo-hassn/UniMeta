const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./specs/figma-structure.json', 'utf8'));

console.log('File Name:', data.name);

const page = data.document.children[0];
const labels = page.children.filter(c => c.type === 'TEXT');
console.log('\n--- Section Labels ---');
labels.forEach(l => {
  console.log(`Label: "${l.characters || l.name}" at x=${l.absoluteBoundingBox?.x}, y=${l.absoluteBoundingBox?.y}`);
});

console.log('\n--- Frames Summary ---');
const frames = page.children.filter(c => c.type === 'FRAME');
frames.forEach(f => {
  const childNames = f.children ? f.children.map(c => c.name).slice(0, 5).join(', ') : 'no children';
  console.log(`Frame [${f.id}] at x=${Math.round(f.absoluteBoundingBox?.x || 0)}, y=${Math.round(f.absoluteBoundingBox?.y || 0)} size: ${Math.round(f.absoluteBoundingBox?.width || 0)}x${Math.round(f.absoluteBoundingBox?.height || 0)} | Children: ${childNames}`);
});
