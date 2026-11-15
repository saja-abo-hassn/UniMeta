const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./specs/figma-landing.json', 'utf8'));
const landingNode = data.nodes['1:2'].document;

console.log('--- LANDING PAGE SECTIONS ---');

function inspectSection(node, indent = '') {
  console.log(`${indent}[${node.id}] "${node.name}" (${node.type}) ${node.absoluteBoundingBox ? `${Math.round(node.absoluteBoundingBox.width)}x${Math.round(node.absoluteBoundingBox.height)}` : ''}`);
  
  if (node.children) {
    node.children.forEach(c => {
      if (c.name.includes('Section') || c.name.includes('Header') || c.name.includes('Footer') || c.name.includes('Container') || c.type === 'FRAME' && c.absoluteBoundingBox?.height > 100) {
        inspectSection(c, indent + '  ');
      } else if (c.type === 'TEXT') {
        console.log(`${indent}    TEXT (${c.style?.fontSize}px, w:${c.style?.fontWeight}): "${c.characters.replace(/\n/g, ' ')}"`);
      }
    });
  }
}

// Get LandingPage (1:5)
const landingPage = landingNode.children.find(c => c.name === 'LandingPage') || landingNode;
landingPage.children.forEach(child => {
  console.log(`\n========================================`);
  console.log(`SECTION: [${child.id}] "${child.name}" (${child.type})`);
  console.log(`Size: ${Math.round(child.absoluteBoundingBox?.width)}x${Math.round(child.absoluteBoundingBox?.height)}`);
  
  // Print all texts and notable frames inside this top-level child
  function dumpTexts(n, prefix = '') {
    if (n.type === 'TEXT') {
      console.log(`  ${prefix}TEXT [${n.style?.fontSize}px, w:${n.style?.fontWeight}]: "${n.characters.replace(/\n/g, ' ')}"`);
    }
    if (n.name.includes('Button') || n.name.includes('Card') || n.name.includes('Heading')) {
      console.log(`  ${prefix}FRAME "${n.name}" size=${Math.round(n.absoluteBoundingBox?.width)}x${Math.round(n.absoluteBoundingBox?.height)}`);
    }
    if (n.children) {
      n.children.forEach(sub => dumpTexts(sub, prefix + '  '));
    }
  }
  dumpTexts(child);
});

