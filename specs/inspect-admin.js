const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./specs/figma-admin.json', 'utf8'));
const node = data.nodes['1:18865'].document;

console.log('Admin Node 1:18865:', node.name, `${node.absoluteBoundingBox.width}x${node.absoluteBoundingBox.height}`);

function describe(n, depth = 0) {
  const indent = '  '.repeat(depth);
  const textInfo = n.characters ? ` | Text: "${n.characters.replace(/\n/g, ' ').slice(0, 40)}"` : '';
  const fillInfo = n.fills && n.fills[0]?.color ? ` | Fill: rgba(${Math.round(n.fills[0].color.r*255)}, ${Math.round(n.fills[0].color.g*255)}, ${Math.round(n.fills[0].color.b*255)})` : '';
  console.log(`${indent}- [${n.id}] "${n.name}" (${n.type})${textInfo}${fillInfo}`);
  if (n.children && depth < 3) {
    n.children.forEach(c => describe(c, depth + 1));
  }
}

describe(node);

