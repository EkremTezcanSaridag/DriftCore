const fs = require('fs');
const { PNG } = require('pngjs');
const { jimpAsync } = require('@expo/image-utils');

async function processImage(filePath, threshold = 65) {
  // Convert to raw PNG Buffer
  const pngBuffer = await jimpAsync({ input: filePath, format: 'image/png' });
  const png = PNG.sync.read(pngBuffer);
  const width = png.width;
  const height = png.height;
  const data = png.data;

  // BFS Flood Fill from edges/corners to remove only outer background
  const visited = new Uint8Array(width * height);
  const queue = [];

  function isDarkBackground(r, g, b) {
    return (
      (r < threshold && g < threshold + 20 && b < threshold + 30) ||
      (Math.max(r, g, b) < threshold) ||
      (r < 40 && g < 45 && b < 60)
    );
  }

  // Enqueue 4 borders
  for (let x = 0; x < width; x++) {
    queue.push(x, 0);
    queue.push(x, height - 1);
    visited[0 * width + x] = 1;
    visited[(height - 1) * width + x] = 1;
  }
  for (let y = 0; y < height; y++) {
    queue.push(0, y);
    queue.push(width - 1, y);
    visited[y * width + 0] = 1;
    visited[y * width + (width - 1)] = 1;
  }

  let head = 0;
  while (head < queue.length) {
    const cx = queue[head++];
    const cy = queue[head++];
    const idx = (cy * width + cx) * 4;

    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    if (isDarkBackground(r, g, b)) {
      data[idx + 3] = 0; // 100% Transparent!

      const neighbors = [
        [cx + 1, cy],
        [cx - 1, cy],
        [cx, cy + 1],
        [cx, cy - 1],
      ];

      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nIndex = ny * width + nx;
          if (!visited[nIndex]) {
            visited[nIndex] = 1;
            queue.push(nx, ny);
          }
        }
      }
    }
  }

  const outPng = PNG.sync.write(png);
  fs.writeFileSync(filePath, outPng);
  console.log(`Successfully converted to transparent PNG: ${filePath} (${width}x${height})`);
}

async function run() {
  await processImage('assets/images/drift_anchor.png', 55);
}

run().catch(console.error);
