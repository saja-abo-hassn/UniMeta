const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./specs/figma-landing.json', 'utf8'));
const landingNode = data.nodes['1:2'].document;

function printTexts(node, path = '') {
  const currentPath = path ? `${path} > ${node.name}` : node.name;
  if (node.type === 'TEXT') {
    console.log(`[TEXT] (${node.style?.fontSize}px, weight: ${node.style?.fontWeight}): "${node.characters.replace(/\n/g, ' ')}"`);
  }
  if (node.children) {
    node.children.forEach(c => printTexts(c, currentPath));
  }
}

printTexts(landingNode);

