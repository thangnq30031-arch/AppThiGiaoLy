export function generateHoneycombPieces(numQuestions) {
  if (!numQuestions || numQuestions <= 0) return [];
  const cols = Math.ceil(Math.sqrt(numQuestions)) || 2;
  const rows = Math.ceil(numQuestions / cols) || 2;
  const w = 100 / (cols + (rows > 1 ? 0.5 : 0));
  const h = 100 / (rows * 0.75 + 0.25);
  const pieces = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cellIdx = r * cols + c;
      const x_c = (c + (r % 2 === 1 ? 0.5 : 0)) * w + w / 2;
      const y_c = (r * 0.75) * h + h / 2;
      const clamp = (val) => Math.max(0, Math.min(100, val));
      const points = [
        { x: clamp(x_c), y: clamp(y_c - h / 2) },
        { x: clamp(x_c + w / 2), y: clamp(y_c - h / 4) },
        { x: clamp(x_c + w / 2), y: clamp(y_c + h / 4) },
        { x: clamp(x_c), y: clamp(y_c + h / 2) },
        { x: clamp(x_c - w / 2), y: clamp(y_c + h / 4) },
        { x: clamp(x_c - w / 2), y: clamp(y_c - h / 4) }
      ];
      const clipPathStr = `polygon(${points.map(pt => `${pt.x.toFixed(2)}% ${pt.y.toFixed(2)}%`).join(', ')})`;
      pieces.push({
        index: cellIdx,
        isLucky: cellIdx >= numQuestions,
        points,
        clipPath: clipPathStr,
        centerX: x_c,
        centerY: y_c
      });
    }
  }
  return pieces;
}
