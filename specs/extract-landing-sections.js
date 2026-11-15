const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./specs/figma-landing.json', 'utf8'));
const root = data.nodes['1:2'].document;
const landingPage = root.children.find(c => c.name === 'LandingPage') || root;
const mainContent = landingPage.children.find(c => c.name === 'Main Content');

console.log('Main Content has children:', mainContent?.children?.map(c => `[${c.id}] ${c.name} (${c.type})`));

if (mainContent) {
  mainContent.children.forEach((sec, idx) => {
    console.log(`\n--- Section ${idx + 1}: [${sec.id}] ${sec.name} ---`);
    console.log('Size:', sec.absoluteBoundingBox);
    console.log('Fills:', sec.fills?.map(f => f.color ? `rgba(${Math.round(f.color.r*255)}, ${Math.round(f.color.g*255)}, ${Math.round(f.color.b*255)}, ${f.color.a ?? 1})` : f.type));
    
    // List key subframes
    function listSub(n, d = 1) {
      if (d > 3) return;
      const ind = '  '.repeat(d);
      const txt = n.characters ? ` -> "${n.characters.replace(/\n/g, ' ').slice(0, 50)}"` : '';
      console.log(`${ind}[${n.id}] ${n.name} (${n.type})${txt}`);
      if (n.children) n.children.forEach(c => listSub(c, d + 1));
    }
    listSub(sec);
  });
}

