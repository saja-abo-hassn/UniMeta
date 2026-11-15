const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./specs/figma-landing.json', 'utf8'));
const root = data.nodes['1:2'].document;

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

// 1. Hero details
const hero = getNodeById(root, '1:38');
console.log('=== HERO ===');
function printDeep(n, depth = 0) {
  const ind = '  '.repeat(depth);
  if (n.type === 'TEXT') {
    console.log(`${ind}TEXT: "${n.characters}" (${n.style?.fontSize}px, w:${n.style?.fontWeight})`);
  } else if (n.name.includes('Button') || n.name.includes('Heading') || n.name.includes('Icon')) {
    console.log(`${ind}[${n.id}] ${n.name}`);
  }
  if (n.children) n.children.forEach(c => printDeep(c, depth + 1));
}
printDeep(hero);

// 2. Interests
const quiz = getNodeById(root, '1:100');
console.log('\n=== QUIZ ===');
printDeep(quiz);

// 3. Why unimeta
const why = getNodeById(root, '1:127');
console.log('\n=== WHY unimeta ===');
printDeep(why);

// 4. Features
const feat = getNodeById(root, '1:279');
console.log('\n=== FEATURES ===');
printDeep(feat);

// 5. About
const about = getNodeById(root, '1:416');
console.log('\n=== ABOUT ===');
printDeep(about);

// 6. CTA
const cta = getNodeById(root, '1:497');
console.log('\n=== CTA ===');
printDeep(cta);


