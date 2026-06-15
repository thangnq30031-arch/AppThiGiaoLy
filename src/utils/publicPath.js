// Helper to resolve public asset URLs both in dev and packaged app
export function getPublicUrl(...segments) {
  // Packaged app: resources/public copied by extraResources
  if (typeof process !== 'undefined' && process.resourcesPath) {
    const base = String(process.resourcesPath).replace(/\\\\/g, '/');
    const tail = segments.map((s) => String(s).replace(/\\/g, '/')).join('/');
    return `file://${base}/public${tail ? '/' + tail : ''}`;
  }

  // Dev (Vite): public/ is served at root ('/'), so return '/<segments...>'
  const tail = segments.map((s) => String(s).replace(/\\/g, '/')).join('/');
  return '/' + (tail || '');
}

// Example usage:
// import { getPublicUrl } from './utils/publicPath';
// const src = getPublicUrl('images', 'logo.png');