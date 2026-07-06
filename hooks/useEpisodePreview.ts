import { useEffect, useRef, useState } from "react";
import { EpisodeRm } from "@/types/episode";

type UseEpisodePreviewArgs = {
  episode: EpisodeRm;
  isCurrentEpisode: boolean;
  loadMediaUrl: (episode: EpisodeRm, type: "video") => Promise<string | null>;
};

export const useEpisodePreview = ({
  episode,
  isCurrentEpisode,
  loadMediaUrl,
}: UseEpisodePreviewArgs) => {
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string>();
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const previewVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreviewVideoUrl(undefined);
    setIsPreviewLoading(false);
  }, [episode.id]);

  const ensurePreviewLoaded = async () => {
    if (isCurrentEpisode) return null;
    if (previewVideoUrl) return previewVideoUrl;
    if (isPreviewLoading) return null;

    setIsPreviewLoading(true);
    try {
      const url = await loadMediaUrl(episode, "video");
      if (url) setPreviewVideoUrl(url);

      return url;
    } finally {
      setIsPreviewLoading(false);
    }
  };

  return {
    previewVideoRef,
    previewVideoUrl,
    isPreviewLoading,
    ensurePreviewLoaded,
  };
};