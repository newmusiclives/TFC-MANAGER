/**
 * SVG-based QR code visual placeholder generator.
 *
 * Generates a deterministic grid pattern from the input URL that resembles a QR
 * code, including the three standard finder patterns in the top-left, top-right,
 * and bottom-left corners.
 *
 * For production use, replace with a real QR encoding library (e.g. `qrcode`).
 */

function hashChar(str: string, index: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i) + index * 7) & 0xffffffff;
  }
  return hash;
}

function drawFinderPattern(cells: boolean[][], row: number, col: number) {
  // 7x7 finder pattern: outer border, gap, inner 3x3
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) {
      const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
      const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
      cells[row + r][col + c] = isOuter || isInner;
    }
  }
}

export function generateQRCodeSVG(url: string, size: number = 200): string {
  const modules = 25; // 25x25 grid
  const cellSize = size / modules;

  // Initialize grid
  const cells: boolean[][] = Array.from({ length: modules }, () =>
    Array(modules).fill(false)
  );

  // Place finder patterns
  drawFinderPattern(cells, 0, 0); // top-left
  drawFinderPattern(cells, 0, modules - 7); // top-right
  drawFinderPattern(cells, modules - 7, 0); // bottom-left

  // Fill remaining cells with a deterministic pseudo-random pattern from the URL
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      // Skip finder pattern regions (including 1-cell separator)
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= modules - 8;
      const inBottomLeft = r >= modules - 8 && c < 8;
      if (inTopLeft || inTopRight || inBottomLeft) continue;

      // Timing patterns
      if (r === 6) {
        cells[r][c] = c % 2 === 0;
        continue;
      }
      if (c === 6) {
        cells[r][c] = r % 2 === 0;
        continue;
      }

      const hash = hashChar(url, r * modules + c);
      cells[r][c] = hash % 3 !== 0; // ~66% fill for visual density
    }
  }

  // Build SVG
  let rects = "";
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if (cells[r][c]) {
        const x = c * cellSize;
        const y = r * cellSize;
        rects += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="#000"/>`;
      }
    }
  }

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">`,
    `<rect width="${size}" height="${size}" fill="#fff" rx="4"/>`,
    rects,
    `</svg>`,
  ].join("");
}
