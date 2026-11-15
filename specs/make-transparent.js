const sharp = require('sharp');

async function processLogo() {
  const image = sharp('public/images/unimeta-logo.jpg');
  const metadata = await image.metadata();
  console.log('Image dimensions:', metadata.width, metadata.height);

  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixelCount = info.width * info.height;
  
  // Inspect corners to see background color
  console.log('Top-left pixel RGBA:', data[0], data[1], data[2], data[3]);

  // Transform pixels:
  // Any dark pixel (black background) becomes transparent.
  // Smooth transition (alpha blending) near the edges so there are no jagged borders or black halos!
  for (let i = 0; i < pixelCount; i++) {
    const offset = i * 4;
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];
    
    // Perceived brightness / max channel
    const maxVal = Math.max(r, g, b);
    
    // If black / near black:
    if (maxVal < 15) {
      data[offset + 3] = 0; // completely transparent
    } else if (maxVal < 45) {
      // smooth antialiasing feather for edge pixels
      const alphaFactor = (maxVal - 15) / 30;
      data[offset + 3] = Math.round(alphaFactor * 255);
    }
  }

  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  })
  .png()
  .toFile('public/images/unimeta-logo.png');

  console.log('Saved public/images/unimeta-logo.png successfully!');

  // Also save a WebP version
  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  })
  .webp({ quality: 100 })
  .toFile('public/images/unimeta-logo.webp');

  console.log('Saved public/images/unimeta-logo.webp successfully!');

  // Also generate 64x64 and 32x32 transparent favicon
  await sharp('public/images/unimeta-logo.png')
    .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('public/favicon.png');

  await sharp('public/images/unimeta-logo.png')
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('app/icon.png');
}

processLogo().catch(console.error);


