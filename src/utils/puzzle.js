export function generatePuzzlePieces(cols, rows) {
  if (!cols || !rows || cols <= 0 || rows <= 0) return [];

  const numPieces = cols * rows;

  // Khởi tạo ma trận đỉnh
  const V = [];
  for (let r = 0; r <= rows; r++) {
    V[r] = [];
    for (let c = 0; c <= cols; c++) {
      let x = (c / cols) * 100;
      let y = (r / rows) * 100;

      // Chỉ áp dụng dịch chuyển (jitter) đối với các đỉnh nằm bên trong lõi tranh
      // Đỉnh ngoài rìa giữ nguyên để đảm bảo giữ nguyên dạng khung hình chữ nhật
      if (r > 0 && r < rows && c > 0 && c < cols) {
        x += (Math.random() - 0.5) * (100 / cols) * 0.45;
        y += (Math.random() - 0.5) * (100 / rows) * 0.45;
      }
      V[r][c] = { x, y };
    }
  }

  // Xây dựng đa giác tinh thể dựa trên các đỉnh đã biến đổi
  const pieces = [];
  for (let p = 0; p < numPieces; p++) {
    const r = Math.floor(p / cols);
    const c = p % cols;

    let points = [];
    if (p < numPieces - 1) {
      points = [V[r][c], V[r][c + 1], V[r + 1][c + 1], V[r + 1][c]];
    } else {
      // Mảnh cuối cùng hấp thụ toàn bộ các ô thừa còn sót lại ở góc cuối
      points = [V[r][c], V[r][cols], V[rows][cols], V[rows][c]];
    }

    // Tính toán tương đối trọng tâm mảnh ghép để hiển thị số thứ tự nổi ở giữa
    const centerX = points.reduce((sum, pt) => sum + pt.x, 0) / points.length;
    const centerY = points.reduce((sum, pt) => sum + pt.y, 0) / points.length;

    // Tạo chuỗi clip-path
    const clipPathStr = `polygon(${points.map(pt => `${pt.x.toFixed(2)}% ${pt.y.toFixed(2)}%`).join(', ')})`;

    pieces.push({
      index: p,
      points,
      clipPath: clipPathStr,
      centerX,
      centerY
    });
  }
  return pieces;
}
