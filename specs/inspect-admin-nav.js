const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./specs/figma-admin.json', 'utf8'));

function getNodeById(node, id) {
  if (node.id === id) return node;
  if (node.children) {
    for (const child of node.children) {
      const found = getNodeById(child, id);
      if (found) return found;
    }
  }
  return null;
}

const root = data.nodes['1:18865'].document;
const nav = getNodeById(root, '1:18882');

function printItems(n) {
  if (n.type === 'TEXT') {
    console.log(`- Text: "${n.characters}"`);
  }
  if (n.children) n.children.forEach(printItems);
}

if (nav) printItems(nav);

