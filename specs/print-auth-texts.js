const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./specs/figma-student-home.json', 'utf8'));
const node = data.nodes['1:1007'].document;

function printTexts(n) {
  if (n.type === 'TEXT') {
    console.log(`[TEXT] (${n.style?.fontSize}px, weight: ${n.style?.fontWeight}): "${n.characters.replace(/\n/g, ' ')}"`);
  }
  if (n.children) n.children.forEach(printTexts);
}

printTexts(node);

