import { getPublicUrl } from './publicPath';

export const isRemoteUrl = (value) => {
  return /^https?:\/\//i.test(value);
};

export const isVideoFile = (value) => {
  return /\.(mp4|webm)(\?|#|$)/i.test(value);
};

export const isYouTubeUrl = (value) => {
  if (!value) return false;
  return /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)/i.test(value);
};

export const resolveImageUrl = (value) => {
  if (!value) return "";
  if (isRemoteUrl(value) || value.startsWith("/")) return value;
  return getPublicUrl('images', value);
};

export const resolveVideoUrl = (value) => {
  if (!value) return "";
  if (isRemoteUrl(value) || value.startsWith("/")) return value;
  return getPublicUrl('videos', value);
};

export const getYouTubeEmbedUrl = (value) => {
  if (!value) return "";

  const youtubeMatch = value.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/i,
  );
  if (youtubeMatch && youtubeMatch[1]) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  if (/youtube\.com\/embed\//i.test(value)) {
    return value;
  }

  return value;
};
