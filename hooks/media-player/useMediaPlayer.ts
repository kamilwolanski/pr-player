import { useEffect, useRef, useState } from "react";
import { EpisodeRm } from "@/types/episode";
import { useMediaLoader } from "./useMediaLoader";
import { useMediaElementControls } from "./useMediaElementControls";
import { clampTime, clampVolume, getMediaDuration } from "./mediaPlayer.utils";
import { MediaType, PlayableEpisode } from "./mediaPlayer.types";
import { ERROR_MESSAGES } from "@/constants/messages";


const useMediaPlayer = (selectedEpisode: EpisodeRm | null) => {
  const [playingEpisode, setPlayingEpisode] = useState<PlayableEpisode | null>(
    null,
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeMediaType, setActiveMediaType] = useState<MediaType>("audio");
  const { isMediaFetching, mediaError, clearMediaError, loadMediaUrl } =
    useMediaLoader();
  const [volume, setVolume] = useState(0.5);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const lastNonZeroVolumeRef = useRef(0.5);
  const {
    audioRef,
    videoRef,
    getMediaElement,
    playMedia,
    pauseMedia,
    pauseAllMedia,
    seekMedia,
    resetMediaTime,
    applyVolume,
  } = useMediaElementControls();

  const clearPlaybackError = () => {
    setPlaybackError(null);
    clearMediaError();
  };

  const handlePlayFailure = () => {
    setIsPlaying(false);
    setPlaybackError(ERROR_MESSAGES.playbackStart);
  };

  const togglePlayback = async () => {
    const activeMedia = getMediaElement(activeMediaType);
    if (!activeMedia) {
      setPlaybackError(ERROR_MESSAGES.activePlayerMissing);
      return;
    }

    clearPlaybackError();

    if (isPlaying) {
      pauseMedia(activeMediaType);
      setIsPlaying(false);
      return;
    }

    const didPlay = await playMedia(activeMediaType);

    if (!didPlay) {
      handlePlayFailure();
      return;
    }

    setIsPlaying(true);
  };

  const startPlay = async (episode: EpisodeRm) => {
    clearPlaybackError();

    if (!episode.externalAudioId) {
      setPlaybackError(ERROR_MESSAGES.noAudio);
      return;
    }

    pauseAllMedia();
    resetMediaTime();

    const audioUrl = await loadMediaUrl(episode, "audio");
    if (!audioUrl) return;

    setPlayingEpisode({
      ...episode,
      audioUrl,
    });

    setActiveMediaType("audio");
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!selectedEpisode) return;

    const isDifferentEpisode = playingEpisode?.id !== selectedEpisode.id;

    if (isDifferentEpisode) {
      startPlay(selectedEpisode);
      return;
    }

    togglePlayback();
  };

  const resolveMediaUrl = async (
    mediaType: MediaType,
    episode: EpisodeRm,
    isDifferentEpisode: boolean,
  ): Promise<string | null> => {
    const existingUrl =
      !isDifferentEpisode && playingEpisode?.id === episode.id
        ? mediaType === "audio"
          ? playingEpisode?.audioUrl
          : playingEpisode?.videoUrl
        : undefined;

    if (existingUrl) return existingUrl;

    return loadMediaUrl(episode, mediaType);
  };

  const changeMediaType = async (
    nextMediaType: MediaType,
    episodeToPlay?: EpisodeRm,
  ) => {
    const episode = episodeToPlay ?? playingEpisode ?? selectedEpisode;

    if (!episode) return;

    clearPlaybackError();

    if (nextMediaType === "audio" && !episode.externalAudioId) {
      setPlaybackError(ERROR_MESSAGES.noAudio);
      return;
    }

    if (nextMediaType === "video" && !episode.externalVideoId) {
      setPlaybackError(ERROR_MESSAGES.noVideo);
      return;
    }

    const isDifferentEpisode = playingEpisode?.id !== episode.id;
    const nextTime = isDifferentEpisode ? 0 : currentTime;

    if (nextMediaType === activeMediaType && !isDifferentEpisode) {
      return;
    }

    if (isDifferentEpisode) {
      resetMediaTime();
      setCurrentTime(0);
      setIsPlaying(false);
    }

    const hadUrlAlready = Boolean(
      !isDifferentEpisode &&
        (nextMediaType === "audio"
          ? playingEpisode?.audioUrl
          : playingEpisode?.videoUrl),
    );

    const url = await resolveMediaUrl(
      nextMediaType,
      episode,
      isDifferentEpisode,
    );

    if (!url) return;

    if (!hadUrlAlready) {
      setPlayingEpisode((prev) => ({
        ...episode,
        audioUrl:
          nextMediaType === "audio"
            ? url
            : !isDifferentEpisode && prev?.id === episode.id
              ? prev.audioUrl
              : undefined,
        videoUrl:
          nextMediaType === "video"
            ? url
            : !isDifferentEpisode && prev?.id === episode.id
              ? prev.videoUrl
              : undefined,
      }));
    }

    setActiveMediaType(nextMediaType);

    if (!isDifferentEpisode) {
      seekMedia(nextTime);
    }
  };

  const switchActiveMedia = ({
    nextType,
    episode,
    url,
    startTime,
    shouldContinuePlaying,
  }: {
    nextType: MediaType;
    episode: EpisodeRm;
    url: string;
    startTime: number;
    shouldContinuePlaying: boolean;
  }) => {
    clearPlaybackError();
    pauseAllMedia();

    setPlayingEpisode((prev) => {
      const isSameEpisode = prev?.id === episode.id;

      return {
        ...episode,
        audioUrl:
          nextType === "audio"
            ? url
            : isSameEpisode
              ? prev?.audioUrl
              : undefined,
        videoUrl:
          nextType === "video"
            ? url
            : isSameEpisode
              ? prev?.videoUrl
              : undefined,
      };
    });

    setActiveMediaType(nextType);
    setCurrentTime(startTime);
    setIsPlaying(shouldContinuePlaying);

    const media = getMediaElement(nextType);
    if (!media) return;

    media.currentTime = startTime;

    if (shouldContinuePlaying) {
      media.play().catch(handlePlayFailure);
    }
  };

  const switchPlayingVideoToAudio = async () => {
    if (!playingEpisode) return;
    if (activeMediaType !== "video") return;
    if (!playingEpisode.externalAudioId) {
      setPlaybackError(ERROR_MESSAGES.noAudio);
      return;
    }

    const videoTime = videoRef.current?.currentTime ?? currentTime;
    const shouldContinuePlaying = isPlaying;

    const audioUrl =
      playingEpisode.audioUrl ?? (await loadMediaUrl(playingEpisode, "audio"));

    if (!audioUrl) return;

    switchActiveMedia({
      nextType: "audio",
      episode: playingEpisode,
      url: audioUrl,
      startTime: videoTime,
      shouldContinuePlaying,
    });
  };

  const promotePreviewToPlayer = (
    episode: EpisodeRm,
    videoUrl: string,
    startTime: number,
  ) => {
    switchActiveMedia({
      nextType: "video",
      episode,
      url: videoUrl,
      startTime,
      shouldContinuePlaying: true,
    });
  };

  const handleLoadedMetadata = () => {
    const activeMedia = getMediaElement(activeMediaType);
    if (!activeMedia) return;

    activeMedia.currentTime = currentTime;

    if (isPlaying) {
      activeMedia.play().catch(handlePlayFailure);
    }
  };

  const handleTimeUpdate = () => {
    const activeMedia = getMediaElement(activeMediaType);
    if (!activeMedia) return;

    setCurrentTime(activeMedia.currentTime);
  };

  const seekTo = (time: number) => {
    const duration = getMediaDuration(playingEpisode, activeMediaType);
    const nextTime = clampTime(time, duration);

    seekMedia(nextTime);
    setCurrentTime(nextTime);
  };

  const handleNativePlay = () => {
    clearPlaybackError();
    setIsPlaying(true);
  };

  const handleNativePause = () => {
    setIsPlaying(false);
  };

  const handleNativeVolumeChange = (mediaType: MediaType) => {
    const media = getMediaElement(mediaType);
    if (!media) return;

    changeVolume(media.volume);
  };

  const handleMediaError = () => {
    setIsPlaying(false);
    setPlaybackError(ERROR_MESSAGES.mediaElementPlayback);
  };

  const closePlayer = () => {
    pauseAllMedia();

    setPlayingEpisode(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setActiveMediaType("audio");
    clearPlaybackError();

    seekMedia(0);
  };

  const changeVolume = (nextVolume: number) => {
    const clampedVolume = clampVolume(nextVolume);

    if (clampedVolume > 0) {
      lastNonZeroVolumeRef.current = clampedVolume;
    }

    setVolume(clampedVolume);
    applyVolume(clampedVolume);
  };

  const toggleMute = () => {
    const nextVolume = volume === 0 ? lastNonZeroVolumeRef.current : 0;

    changeVolume(nextVolume);
  };

  const handleMediaEnded = () => {
    resetMediaTime();
    setCurrentTime(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    const activeMedia = getMediaElement(activeMediaType);
    if (!activeMedia) return;

    if (activeMediaType === "audio") {
      videoRef.current?.pause();
    }

    if (activeMediaType === "video") {
      audioRef.current?.pause();
    }

    activeMedia.currentTime = currentTime;

    if (isPlaying) {
      activeMedia.play().catch(handlePlayFailure);
    }
  }, [activeMediaType]);

  useEffect(() => {
    applyVolume(volume);
  }, [volume, activeMediaType, playingEpisode?.id]);

  return {
    audioRef,
    videoRef,

    playingEpisode,
    isPlaying,
    currentTime,
    activeMediaType,
    isMediaFetching,
    mediaError,
    playbackError,
    volume,
    loadMediaUrl,

    togglePlay,
    togglePlayback,
    startPlay,
    changeMediaType,
    seekTo,
    closePlayer,
    promotePreviewToPlayer,
    switchPlayingVideoToAudio,
    clearPlaybackError,

    handleLoadedMetadata,
    handleTimeUpdate,
    handleNativePlay,
    handleNativePause,
    handleNativeVolumeChange,
    handleMediaEnded,
    handleMediaError,
    changeVolume,
    toggleMute,
  };
};

export default useMediaPlayer;