import { useCallback, useRef } from "react";
import { MediaType } from "./mediaPlayer.types";

export const useMediaElementControls = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const getMediaElement = useCallback((mediaType: MediaType) => {
    return mediaType === "audio" ? audioRef.current : videoRef.current;
  }, []);

  const playMedia = useCallback(
    async (mediaType: MediaType) => {
      const media = getMediaElement(mediaType);
      if (!media) return false;

      try {
        await media.play();
        return true;
      } catch {
        return false;
      }
    },
    [getMediaElement],
  );

  const pauseMedia = useCallback(
    (mediaType: MediaType) => {
      const media = getMediaElement(mediaType);
      media?.pause();
    },
    [getMediaElement],
  );

  const pauseAllMedia = useCallback(() => {
    audioRef.current?.pause();
    videoRef.current?.pause();
  }, []);

  const seekMedia = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }

    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  }, []);

  const resetMediaTime = useCallback(() => {
    seekMedia(0);
  }, [seekMedia]);

  const applyVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = volume === 0;
    }

    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = volume === 0;
    }
  }, []);

  return {
    audioRef,
    videoRef,
    getMediaElement,
    playMedia,
    pauseMedia,
    pauseAllMedia,
    seekMedia,
    resetMediaTime,
    applyVolume,
  };
};