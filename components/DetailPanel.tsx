import {
  AudioLines,
  CalendarDays,
  Clock,
  ExternalLink,
  Pause,
  Play,
  Radio,
  Video,
  VideoIcon,
} from "lucide-react";

import { EpisodeRm } from "@/types/episode";
import { formatPolishDate } from "@/utils/date";
import { formatDurationSeconds } from "@/utils/time";
import { useMediaPlayerContext } from "@/providers/MediaPlayer";

import { AudioWaveform } from "./WaveForm";
import { DetailCover } from "./DetailCover";
import { useEpisodePreview } from "@/hooks/useEpisodePreview";
import { useEffect, useState } from "react";
import { ERROR_MESSAGES, STATUS_MESSAGES } from "@/constants/messages";

type DetailPanelProps = {
  episode: EpisodeRm;
  className?: string;
};

const DetailPanel = ({ episode, className = "" }: DetailPanelProps) => {
  const {
    playingEpisode,
    handleTimeUpdate,
    handleLoadedMetadata,
    isPlaying,
    activeMediaType,
    changeMediaType,
    videoRef,
    togglePlay,
    togglePlayback,
    isMediaFetching,
    mediaError,
    playbackError,
    handleNativePause,
    handleNativePlay,
    loadMediaUrl,
    promotePreviewToPlayer,
    handleMediaEnded,
    handleMediaError,
    clearPlaybackError,
  } = useMediaPlayerContext();

  const hasAudio = Boolean(episode.externalAudioId);
  const hasVideo = Boolean(episode.externalVideoId);
  const hasAnyMedia = hasAudio || hasVideo;
  const [tab, setTab] = useState<"audio" | "video">(
    hasAudio ? "audio" : "video",
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTab(hasAudio ? "audio" : "video");
  }, [episode.id, hasAudio]);

  const isCurrentEpisode = playingEpisode?.id === episode.id;

  const {
    previewVideoRef,
    previewVideoUrl,
    isPreviewLoading,
    ensurePreviewLoaded,
  } = useEpisodePreview({
    episode,
    isCurrentEpisode,
    loadMediaUrl,
  });

  const isSelectedEpisodePlaying = isPlaying && isCurrentEpisode;
  const isSelectedVideoPlaying =
    isSelectedEpisodePlaying && activeMediaType === "video";
  const canToggle = hasAudio && hasVideo;

  const isAudioTab = tab === "audio";
  const isVideoTab = tab === "video";

  const displayVideoUrl = isCurrentEpisode
    ? playingEpisode?.videoUrl
    : previewVideoUrl;

  const duration =
    episode.audioDuration !== null
      ? formatDurationSeconds(episode.audioDuration)
      : null;

  const statusMessage = playbackError ?? mediaError;
  const isCurrentMediaLoading = isAudioTab
    ? isMediaFetching
    : isCurrentEpisode
      ? isMediaFetching
      : isPreviewLoading;
  const isPrimaryButtonDisabled =
    !hasAnyMedia ||
    (isAudioTab && !hasAudio) ||
    (isVideoTab && !hasVideo) ||
    isCurrentMediaLoading;

  const primaryButtonLabel = (() => {
    if (!hasAnyMedia) return STATUS_MESSAGES.noMediaShort;
    if (isCurrentMediaLoading) return STATUS_MESSAGES.loading;
    if (isAudioTab && !hasAudio) return STATUS_MESSAGES.noAudioShort;
    if (isVideoTab && !hasVideo) return STATUS_MESSAGES.noVideoShort;
    if (isAudioTab) return isSelectedEpisodePlaying ? "Pauza" : "Posłuchaj";

    return isSelectedVideoPlaying ? "Pauza" : "Obejrzyj";
  })();

  const handleAudioTabClick = () => {
    clearPlaybackError();
    setTab("audio");

    if (isCurrentEpisode) {
      changeMediaType("audio", episode);
    }
  };

  const handleVideoTabClick = async () => {
    clearPlaybackError();
    setTab("video");

    if (isCurrentEpisode) {
      changeMediaType("video", episode);
      return;
    }

    await ensurePreviewLoaded();
  };

  const handlePreviewPlay = () => {
    if (!previewVideoUrl) return;

    promotePreviewToPlayer(
      episode,
      previewVideoUrl,
      previewVideoRef.current?.currentTime ?? 0,
    );
  };

  const handlePrimaryAction = async () => {
    if (isPrimaryButtonDisabled) return;

    if (isAudioTab) {
      togglePlay();
      return;
    }

    if (isCurrentEpisode && activeMediaType === "video") {
      togglePlayback();
      return;
    }

    const videoUrl = previewVideoUrl ?? (await ensurePreviewLoaded());
    if (!videoUrl) return;

    promotePreviewToPlayer(
      episode,
      videoUrl,
      previewVideoRef.current?.currentTime ?? 0,
    );
  };

  const renderVideoState = () => {
    if (!hasVideo) return ERROR_MESSAGES.videoUnavailable;
    if (isCurrentMediaLoading) return STATUS_MESSAGES.videoLoading;
    if (statusMessage) return statusMessage;

    return STATUS_MESSAGES.videoLoadPrompt;
  };

  return (
    <div
      className={`relative overflow-hidden rounded-panel bg-panel p-4 sm:p-5 md:p-8 ${className}`}
      aria-busy={isCurrentMediaLoading}
    >
      {canToggle && (
        <div
          className="mb-5 flex w-fit rounded-pill bg-elevated p-1 md:absolute md:right-5 md:top-5 md:mb-0"
          role="tablist"
          aria-label="Wybór typu mediów"
        >
          <button
            type="button"
            role="tab"
            aria-selected={isAudioTab}
            aria-controls="episode-audio-panel"
            className={`flex items-center gap-2 rounded-pill px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:px-5 md:py-2.5 ${
              isAudioTab
                ? "bg-primary text-white shadow-glow hover:bg-primary-hover"
                : "text-muted hover:text-foreground"
            }`}
            onClick={handleAudioTabClick}
          >
            <AudioLines className="h-4 w-4" aria-hidden="true" />
            Audio
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={isVideoTab}
            aria-controls="episode-video-panel"
            className={`flex items-center gap-2 rounded-pill px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:px-5 md:py-2.5 ${
              isVideoTab
                ? "bg-primary text-white shadow-glow hover:bg-primary-hover"
                : "text-muted hover:text-foreground"
            }`}
            onClick={handleVideoTabClick}
          >
            <VideoIcon className="h-4 w-4" aria-hidden="true" />
            Video
          </button>
        </div>
      )}

      {statusMessage && (
        <p
          className="mb-5 rounded-card border border-primary/40 bg-primary-soft px-4 py-3 text-sm font-medium text-foreground"
          role="alert"
        >
          {statusMessage}
        </p>
      )}

      {!hasAnyMedia && (
        <p className="mb-5 rounded-card border border-border-soft bg-card px-4 py-3 text-sm font-medium text-muted">
          {ERROR_MESSAGES.noMedia}
        </p>
      )}

      {isAudioTab ? (
        <div
          id="episode-audio-panel"
          role="tabpanel"
          className="flex flex-col items-center gap-5 md:mt-4 md:flex-row md:gap-8 lg:mt-10"
        >
          <DetailCover image={episode.mainImage} title={episode.title} />

          <div className="hidden h-40 w-full md:flex-1 lg:block" aria-hidden="true">
            <AudioWaveform isPlaying={isSelectedEpisodePlaying} />
          </div>
        </div>
      ) : (
        <div
          id="episode-video-panel"
          role="tabpanel"
          className="mt-4 overflow-hidden rounded-panel border border-border-soft bg-black lg:mt-10"
        >
          {displayVideoUrl ? (
            isCurrentEpisode ? (
              <video
                key={displayVideoUrl}
                ref={videoRef}
                src={displayVideoUrl}
                className="aspect-video w-full bg-black"
                aria-label={`Odtwarzacz wideo: ${episode.title}`}
                playsInline
                controls
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onPlay={handleNativePlay}
                onPause={handleNativePause}
                onEnded={handleMediaEnded}
                onError={handleMediaError}
              />
            ) : (
              <video
                key={displayVideoUrl}
                ref={previewVideoRef}
                src={displayVideoUrl}
                className="aspect-video w-full bg-black"
                aria-label={`Podgląd wideo: ${episode.title}`}
                playsInline
                controls
                onPlay={handlePreviewPlay}
                onError={handleMediaError}
              />
            )
          ) : (
            <div className="flex aspect-video w-full items-center justify-center px-4 text-center text-sm font-medium text-muted">
              {renderVideoState()}
            </div>
          )}
        </div>
      )}

      <div className="mt-6 flex min-w-0 flex-col justify-center md:mt-8 lg:mt-14">
        <p className="mb-2 text-sm font-semibold text-primary lg:mb-3">
          {episode.podcastTitle}
        </p>

        <h1 className="text-2xl font-bold leading-tight tracking-tight lg:text-4xl">
          {episode.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted lg:mt-5 lg:gap-x-4">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="size-4" aria-hidden="true" />
            {formatPolishDate(episode.publishDate)}
          </span>

          {duration && (
            <>
              <span aria-hidden="true">•</span>
              <span className="inline-flex items-center gap-2">
                <Clock className="size-4" aria-hidden="true" />
                {duration}
              </span>
            </>
          )}

          {hasAudio && (
            <>
              <span aria-hidden="true">•</span>
              <span className="inline-flex items-center gap-2">
                <Radio className="size-4" aria-hidden="true" />
                Dostępne w audio
              </span>
            </>
          )}

          {hasVideo && (
            <>
              <span aria-hidden="true">•</span>
              <span className="inline-flex items-center gap-2">
                <Video className="size-4" aria-hidden="true" />
                Dostępne w wideo
              </span>
            </>
          )}
        </div>

        <p className="mt-5 text-sm leading-6 text-muted lg:mt-6 lg:max-w-2xl lg:text-base lg:leading-7">
          {episode.description}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-8">
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-3 rounded-card bg-primary px-5 py-3 font-semibold text-white shadow-glow transition hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-primary-active disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit lg:px-6"
            onClick={handlePrimaryAction}
            disabled={isPrimaryButtonDisabled}
            aria-label={`${primaryButtonLabel}: ${episode.title}`}
          >
            {isSelectedEpisodePlaying ? (
              <Pause className="size-5 fill-current" aria-hidden="true" />
            ) : (
              <Play className="size-5 fill-current" aria-hidden="true" />
            )}
            {primaryButtonLabel}
          </button>

          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-3 rounded-card border border-border bg-card px-5 py-3 font-semibold text-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-fit lg:px-6"
            aria-label={`Otwórz odcinek ${episode.title} na polskieradio.pl`}
          >
            <ExternalLink className="size-5" aria-hidden="true" />
            Otwórz na polskieradio.pl
          </a>
        </div>
      </div>
    </div>
  );
};

export default DetailPanel;