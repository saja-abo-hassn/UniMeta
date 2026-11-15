const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./specs/figma-landing.json', 'utf8'));
const landingNode = data.nodes['1:2'].document;

const colors = new Set();
const fonts = new Set();
const fontSizes = new Set();
const radii = new Set();

function walk(node) {
  if (node.fills) {
    node.fills.forEach(f => {
      if (f.type === 'SOLID' && f.color) {
        const hex = rgbToHex(f.color.r, f.color.g, f.color.b);
        colors.add(`${hex} (a: ${f.opacity ?? f.color.a ?? 1})`);
      }
    });
  }
  if (node.cornerRadius) radii.add(node.cornerRadius);
  if (node.style) {
    if (node.style.fontFamily) fonts.add(node.style.fontFamily);
    if (node.style.fontSize) fontSizes.add(node.style.fontSize);
  }
  if (node.children) node.children.forEach(walk);
}

function rgbToHex(r, g, b) {
  const toH = (c) => Math.round(c * 255).toString(16).padStart(2, '0');
  return `#${toH(r)}${toH(g)}${toH(b)}`.toUpperCase();
}

walk(landingNode);

console.log('--- Colors ---');
console.log([...colors]);

console.log('--- Fonts ---');
console.log([...fonts]);

console.log('--- Font Sizes ---');
console.log([...fontSizes].sort((a,b) => a - b));

console.log('--- Border Radii ---');
console.log([...radii].sort((a,b) => a - b));

