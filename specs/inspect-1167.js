const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./specs/figma-node-1167.json', 'utf8'));
const node = data.nodes['1:1167'].document;

console.log('Node 1:1167:', node.name, `${node.absoluteBoundingBox.width}x${node.absoluteBoundingBox.height}`);

function describe(n, depth = 0) {
  const indent = '  '.repeat(depth);
  const textInfo = n.characters ? ` | Text: "${n.characters.replace(/\n/g, ' ').slice(0, 40)}"` : '';
  console.log(`${indent}- [${n.id}] "${n.name}" (${n.type})${textInfo}`);
  if (n.children && depth < 3) {
    n.children.forEach(c => describe(c, depth + 1));
  }
}

describe(node);

