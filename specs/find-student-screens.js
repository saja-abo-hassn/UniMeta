const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./specs/figma-structure.json', 'utf8'));
const page = data.document.children[0];

function extractTexts(node, texts = []) {
  if (node.characters) {
    texts.push(node.characters.trim().replace(/\n+/g, ' '));
  }
  if (node.children) {
    node.children.forEach(c => extractTexts(c, texts));
  }
  return texts;
}

const frames = page.children.filter(c => c.type === 'FRAME');
frames.forEach(f => {
  // Only look at student screens (y between 3000 and 23000)
  const y = f.absoluteBoundingBox?.y || 0;
  if (y > 3000 && y < 23000) {
    const allTexts = extractTexts(f);
    const sample = allTexts.slice(0, 10).join(' | ');
    console.log(`[${f.id}] (x=${Math.round(f.absoluteBoundingBox?.x)}, y=${Math.round(y)}): ${f.name} -> ${sample.substring(0, 120)}`);
  }
});

