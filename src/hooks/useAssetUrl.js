export function getAssetUrl(relativePath) {
  // Kiểm tra xem ứng dụng đang chạy ở môi trường Dev (Vite) hay Prod (Electron đã đóng gói)
  const isDev = !window.process || window.process.env.NODE_ENV === 'development' || !window.process.resourcesPath;

  if (isDev) {
    // Môi trường Dev: Vite tự hiểu thư mục public là gốc '/'
    // Ví dụ: relativePath = "videos/question1.mp4" -> "/videos/question1.mp4"
    return `/${relativePath}`;
  } else {
    // Môi trường Đóng gói: Trỏ thẳng vào thư mục extraResources (resources/public)
    // Cần thêm tiền tố file:// để Electron hiểu đây là file cục bộ trên ổ đĩa
    return `file://${window.process.resourcesPath}/public/${relativePath}`;
  }
}