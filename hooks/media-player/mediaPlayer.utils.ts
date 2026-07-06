import { EpisodeRm } from "@/types/episode";
import { MediaType } from "./mediaPlayer.types";

export const getMediaDuration = (
  episode: EpisodeRm | null,
  mediaType: MediaType,
) => {
  if (!episode) return 0;

  if (mediaType === "video") {
    return episode.videoDuration ?? episode.audioDuration ?? 0;
  }

  return episode.audioDuration ?? episode.videoDuration ?? 0;
};

export const clampTime = (time: number, duration: number) => {
  if (time < 0) return 0;
  if (duration > 0 && time > duration) return duration;

  return time;
};

export const clampVolume = (volume: number) => {
  if (volume < 0) return 0;
  if (volume > 1) return 1;

  return volume;
};
