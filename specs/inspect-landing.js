const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./specs/figma-landing.json', 'utf8'));
const landingNode = data.nodes['1:2'].document;

function describeNode(node, depth = 0, maxDepth = 4) {
  const indent = '  '.repeat(depth);
  const textInfo = node.characters ? ` | Text: "${node.characters.replace(/\n/g, ' ').slice(0, 50)}"` : '';
  const fillInfo = node.fills && node.fills.length > 0 && node.fills[0].color ? ` | Fill: rgba(${Math.round(node.fills[0].color.r*255)}, ${Math.round(node.fills[0].color.g*255)}, ${Math.round(node.fills[0].color.b*255)}, ${node.fills[0].color.a ?? 1})` : '';
  console.log(`${indent}- [${node.id}] "${node.name}" (${node.type})${textInfo}${fillInfo}`);
  if (node.children && depth < maxDepth) {
    node.children.forEach(c => describeNode(c, depth + 1, maxDepth));
  }
}

describeNode(landingNode, 0, 4);
