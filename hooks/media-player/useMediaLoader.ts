import { useState } from "react";
import { getAudio, getVideo } from "@/services/api";
import { EpisodeRm } from "@/types/episode";
import { rewriteCmsMediaUrlToCdn } from "@/utils/rewriteCmsMediaUrlToCdn";
import { MediaType } from "./mediaPlayer.types";

export const useMediaLoader = () => {
  const [isMediaFetching, setIsMediaFetching] = useState(false);

  const loadMediaUrl = async (episode: EpisodeRm, mediaType: MediaType) => {
    setIsMediaFetching(true);

    try {
      if (mediaType === "audio") {
        if (!episode.externalAudioId) return null;

        const audio = await getAudio(episode.externalAudioId);

        return rewriteCmsMediaUrlToCdn(audio.data.uri);
      }

      if (mediaType === "video") {
        if (!episode.externalVideoId) return null;

        const video = await getVideo(episode.externalVideoId);

        return rewriteCmsMediaUrlToCdn(video.data.uri);
      }

      return null;
    } finally {
      setIsMediaFetching(false);
    }
  };

  return {
    isMediaFetching,
    loadMediaUrl,
  };
};
