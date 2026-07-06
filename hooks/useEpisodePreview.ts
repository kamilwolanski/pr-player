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

  // reset przy zmianie odcinka
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreviewVideoUrl(undefined);
    setIsPreviewLoading(false);
  }, [episode.id]);

  const ensurePreviewLoaded = async () => {
    if (isCurrentEpisode || previewVideoUrl || isPreviewLoading) return;

    setIsPreviewLoading(true);
    try {
      const url = await loadMediaUrl(episode, "video");
      if (url) setPreviewVideoUrl(url);
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
