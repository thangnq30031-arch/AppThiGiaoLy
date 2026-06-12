import React from "react";
import {
  resolveImageUrl,
  resolveVideoUrl,
  isYouTubeUrl,
  getYouTubeEmbedUrl,
} from "../../utils/media";

export default function MediaViewer({
  mediaType,
  mediaUrl,
  className,
  videoClassName,
}) {
  if (!mediaType || !mediaUrl) return null;

  const imageSrc = mediaType === "image" ? resolveImageUrl(mediaUrl) : null;
  const videoSrc = mediaType === "video" ? resolveVideoUrl(mediaUrl) : null;
  const isYoutube = mediaType === "video" && isYouTubeUrl(mediaUrl);
  const embedUrl = isYoutube ? getYouTubeEmbedUrl(mediaUrl) : null;

  if (mediaType === "image") {
    return <img src={imageSrc} className={className} alt="" />;
  }

  if (mediaType === "video") {
    if (isYoutube) {
      return (
        <iframe
          title="YouTube video"
          src={embedUrl}
          className={className}
          allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture"
        />
      );
    }

    return (
      <video controls src={videoSrc} className={videoClassName || className} />
    );
  }

  return null;
}
