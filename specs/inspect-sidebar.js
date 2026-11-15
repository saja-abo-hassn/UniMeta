const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./specs/figma-node-1167.json', 'utf8'));

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

const root = data.nodes['1:1167'].document;
const sidebar = getNodeById(root, '1:1454');
const topbar = getNodeById(root, '1:1172');

console.log('--- Sidebar Specs ---');
if (sidebar) {
  console.log('Size:', sidebar.absoluteBoundingBox);
  console.log('Fills:', JSON.stringify(sidebar.fills));
  console.log('Strokes:', JSON.stringify(sidebar.strokes));
}

console.log('\n--- Topbar Specs ---');
if (topbar) {
  console.log('Size:', topbar.absoluteBoundingBox);
  console.log('Fills:', JSON.stringify(topbar.fills));
  console.log('Strokes:', JSON.stringify(topbar.strokes));
}

// Let's inspect all sidebar navigation items
const nav = getNodeById(root, '1:1498');
if (nav) {
  console.log('\n--- Navigation Items ---');
  function extractButtons(n) {
    if (n.name.includes('Button') || n.type === 'FRAME') {
      const texts = [];
      function getT(x) { if (x.type === 'TEXT') texts.push(x.characters); if (x.children) x.children.forEach(getT); }
      getT(n);
      if (texts.length > 0) {
        console.log(`- ${texts.join(' | ')} (Fills: ${JSON.stringify(n.fills?.map(f => f.color))})`);
      }
    }
    if (n.children) n.children.forEach(extractButtons);
  }
  extractButtons(nav);
}

