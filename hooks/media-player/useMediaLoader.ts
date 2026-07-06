import { useState } from "react";
import { getAudio, getVideo } from "@/services/api";
import { EpisodeRm } from "@/types/episode";
import { rewriteCmsMediaUrlToCdn } from "@/utils/rewriteCmsMediaUrlToCdn";
import { MediaType } from "./mediaPlayer.types";
import { ERROR_MESSAGES } from "@/constants/messages";

export const useMediaLoader = () => {
  const [isMediaFetching, setIsMediaFetching] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);

  const clearMediaError = () => {
    setMediaError(null);
  };

  const loadMediaUrl = async (episode: EpisodeRm, mediaType: MediaType) => {
    setIsMediaFetching(true);
    setMediaError(null);

    try {
      if (mediaType === "audio") {
        if (!episode.externalAudioId) {
          setMediaError(ERROR_MESSAGES.noAudio);
          return null;
        }

        const audio = await getAudio(episode.externalAudioId);

        return rewriteCmsMediaUrlToCdn(audio.data.uri);
      }

      if (mediaType === "video") {
        if (!episode.externalVideoId) {
          setMediaError(ERROR_MESSAGES.noVideo);
          return null;
        }

        const video = await getVideo(episode.externalVideoId);

        return rewriteCmsMediaUrlToCdn(video.data.uri);
      }

      return null;
    } catch {
      setMediaError(ERROR_MESSAGES.mediaUrlLoad(mediaType));
      return null;
    } finally {
      setIsMediaFetching(false);
    }
  };

  return {
    isMediaFetching,
    mediaError,
    clearMediaError,
    loadMediaUrl,
  };
};