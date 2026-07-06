"use client";

import Image from "next/image";
import {
  X,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { formatDurationSeconds } from "@/utils/time";
import { Undo10Icon } from "./icons/Undo10Icon";
import { Forward10Icon } from "./icons/Forward10Icon";
import { PlayableEpisode } from "@/hooks/media-player/mediaPlayer.types";

type BottomPlayerProps = {
  episode: PlayableEpisode;
  onClose: () => void;
  volume: number;
  isPlaying?: boolean;
  currentTime?: number;
  playbackError?: string | null;
  togglePlay: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
};

const iconButtonClassName =
  "flex size-11 items-center justify-center rounded-full text-foreground transition hover:bg-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40";

const BottomPlayer = ({
  episode,
  onClose,
  isPlaying = true,
  currentTime = 0,
  volume,
  playbackError,
  togglePlay,
  onSeek,
  onVolumeChange,
  onToggleMute,
}: BottomPlayerProps) => {
  const duration = episode.audioDuration ?? episode.videoDuration ?? 0;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const formattedCurrentTime = formatDurationSeconds(currentTime);
  const formattedDuration = formatDurationSeconds(duration);
  const volumePercent = Math.round(volume * 100);

  return (
    <aside
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border-soft bg-header/95 shadow-player backdrop-blur-xl"
      aria-label="Odtwarzacz"
    >
      {playbackError && (
        <div
          className="border-b border-primary/30 bg-primary-soft px-4 py-2 text-center text-sm font-medium text-foreground"
          role="alert"
        >
          {playbackError}
        </div>
      )}

      <div className="group relative h-3 w-full">
        <div className="absolute left-0 top-0 h-0.5 w-full bg-progress-track transition-all group-focus-within:h-1 group-hover:h-1">
          <div
            className="h-full bg-progress transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 size-3 -translate-x-1/2 -translate-y-[5px] rounded-full border-2 border-header bg-progress shadow-glow transition-transform group-focus-within:scale-110 group-hover:scale-110"
          style={{ left: `${progress}%` }}
        />

        <input
          type="range"
          min={0}
          max={duration}
          step={1}
          value={currentTime}
          onChange={(event) => onSeek(Number(event.target.value))}
          aria-label="Postęp odtwarzania"
          aria-valuetext={`${formattedCurrentTime} z ${formattedDuration}`}
          className="absolute inset-0 h-3 w-full cursor-pointer appearance-none bg-transparent opacity-0 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        />
      </div>

      <div className="mx-auto flex h-20 w-full max-w-page items-center gap-3 px-4 md:h-24 md:justify-between md:gap-6 md:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3 md:flex-none md:gap-4">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-thumbnail border border-border-soft bg-card md:size-16">
            {episode.mainImage ? (
              <Image
                src={episode.mainImage.uri}
                alt={episode.mainImage.title || episode.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 48px, 64px"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-elevated text-xs text-muted">
                PR
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 leading-tight md:max-w-[16vw]">
            <h3 className="truncate text-sm font-semibold text-foreground md:hidden">
              {episode.title}
            </h3>

            <div className="hidden overflow-hidden md:block">
              <h3 className="onnc-title-slide whitespace-nowrap text-lg font-semibold text-foreground">
                {episode.title}
              </h3>
            </div>

            <p className="mt-1 truncate text-xs font-medium text-muted md:text-sm md:text-primary">
              {episode.podcastTitle}
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <button
            type="button"
            className="group flex size-11 items-center justify-center rounded-full text-muted transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Cofnij o 10 sekund"
            onClick={() => onSeek(currentTime - 10)}
          >
            <Undo10Icon className="size-8" />
          </button>

          <button
            type="button"
            className={iconButtonClassName}
            aria-label="Poprzedni odcinek"
            disabled
          >
            <SkipBack className="size-7 fill-current" aria-hidden="true" />
          </button>

          <button
            type="button"
            className="flex size-16 items-center justify-center rounded-full bg-primary text-white shadow-glow transition hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-primary-active"
            aria-label={isPlaying ? "Pauza" : "Odtwórz"}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="size-8 fill-current" aria-hidden="true" />
            ) : (
              <Play className="ml-1 size-8 fill-current" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            className={iconButtonClassName}
            aria-label="Następny odcinek"
            disabled
          >
            <SkipForward className="size-7 fill-current" aria-hidden="true" />
          </button>

          <button
            type="button"
            className="group flex size-11 items-center justify-center rounded-full text-muted transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Przewiń o 10 sekund"
            onClick={() => onSeek(currentTime + 10)}
          >
            <Forward10Icon className="size-8" />
          </button>

          <span className="min-w-24 text-sm tabular-nums text-muted" aria-live="polite">
            {formattedCurrentTime} / {formattedDuration}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:gap-6">
          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full text-foreground transition hover:bg-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label={volume === 0 ? "Przywróć głośność" : "Wycisz"}
              onClick={onToggleMute}
            >
              {volume === 0 ? (
                <VolumeX className="size-6" aria-hidden="true" />
              ) : (
                <Volume2 className="size-6" aria-hidden="true" />
              )}
            </button>

            <input
              type="range"
              min={0}
              max={100}
              value={volumePercent}
              onChange={(event) => {
                onVolumeChange(Number(event.target.value) / 100);
              }}
              aria-label="Poziom głośności"
              aria-valuetext={`${volumePercent}%`}
              className="h-1 w-24 cursor-pointer appearance-none rounded-pill bg-progress-track accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            />
          </div>

          <div className="hidden h-14 w-px bg-border-soft lg:block" />

          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full text-foreground transition hover:bg-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:size-11"
            aria-label="Zamknij player"
            onClick={onClose}
          >
            <X className="size-5 md:size-6" aria-hidden="true" />
          </button>

          <button
            type="button"
            className="flex size-12 items-center justify-center rounded-full bg-primary text-white shadow-glow transition hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-primary-active md:hidden"
            aria-label={isPlaying ? "Pauza" : "Odtwórz"}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="size-6 fill-current" aria-hidden="true" />
            ) : (
              <Play className="ml-0.5 size-6 fill-current" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default BottomPlayer;