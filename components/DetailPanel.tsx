import { EpisodeRm } from "@/types/episode";
import {
  AudioLines,
  CalendarDays,
  Clock,
  ExternalLink,
  Headphones,
  Pause,
  Radio,
  Video,
  VideoIcon,
} from "lucide-react";
import { AudioWaveform } from "./WaveForm";
import { DetailCover } from "./DetailCover";
import { formatPolishDate } from "@/utils/date";
import { formatDurationSeconds } from "@/utils/time";

type DetailPanelProps = {
  episode: EpisodeRm;
  isPlaying: boolean;
  onPlayToggle: () => void;
  className?: string;
};

const DetailPanel = ({
  episode,
  isPlaying,
  onPlayToggle,
  className = "",
}: DetailPanelProps) => {
  const canToggle = Boolean(episode.externalAudioId && episode.externalVideoId);
  const hasAudio = Boolean(episode.externalAudioId);
  const hasVideo = Boolean(episode.externalVideoId);
  const duration =
    episode.audioDuration !== null
      ? formatDurationSeconds(episode.audioDuration)
      : null;

  return (
    <div
      className={`relative overflow-hidden rounded-panel bg-panel p-4 sm:p-5 md:p-8 ${className}`}
    >
      {canToggle && (
        <div className="mb-5 flex w-fit rounded-pill bg-elevated p-1 md:absolute md:right-5 md:top-5 md:mb-0">
          <button
            type="button"
            className="flex items-center gap-2 rounded-pill bg-primary px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:bg-primary-hover md:px-5 md:py-2.5"
          >
            <AudioLines className="h-4 w-4" /> Audio
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-pill px-4 py-2 text-sm font-semibold text-muted transition hover:text-foreground md:px-5 md:py-2.5"
          >
            <VideoIcon className="h-4 w-4" /> Video
          </button>
        </div>
      )}

      <div className="flex flex-col items-center gap-5 md:mt-4 md:flex-row md:gap-8 lg:mt-10">
        <DetailCover
          image={episode.mainImage}
          title={episode.title}
        />

        <div className="hidden h-40 w-full md:flex-1 lg:block">
          <AudioWaveform isPlaying={isPlaying} />
        </div>
      </div>

      <div className="mt-6 flex min-w-0 flex-col justify-center md:mt-8 lg:mt-14">
        <p className="mb-2 text-sm font-semibold text-primary lg:mb-3">
          {episode.podcastTitle}
        </p>

        <h1 className="text-2xl font-bold leading-tight tracking-tight lg:text-4xl">
          {episode.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted lg:mt-5 lg:gap-x-4">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="size-4" />
            {formatPolishDate(episode.publishDate)}
          </span>

          {duration && (
            <>
              <span aria-hidden="true">•</span>
              <span className="inline-flex items-center gap-2">
                <Clock className="size-4" />
                {duration}
              </span>
            </>
          )}

          {hasAudio && (
            <>
              <span aria-hidden="true">•</span>
              <span className="inline-flex items-center gap-2">
                <Radio className="size-4" />
                Dostępne w audio
              </span>
            </>
          )}

          {hasVideo && (
            <>
              <span aria-hidden="true">•</span>
              <span className="inline-flex items-center gap-2">
                <Video className="size-4" />
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
            onClick={onPlayToggle}
            className="inline-flex w-full items-center justify-center gap-3 rounded-card bg-primary px-5 py-3 font-semibold text-white shadow-glow transition hover:bg-primary-hover active:bg-primary-active sm:w-fit lg:px-6"
          >
            {isPlaying ? (
              <>
                <Pause className="size-5 fill-current" />
                Pauza
              </>
            ) : (
              <>
                <Headphones className="size-5" />
                Posłuchaj
              </>
            )}
          </button>

          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-3 rounded-card border border-border bg-card px-5 py-3 font-semibold text-foreground transition hover:border-primary hover:text-primary sm:w-fit lg:px-6"
          >
            <ExternalLink className="size-5" />
            Otwórz na polskieradio.pl
          </a>
        </div>
      </div>
    </div>
  );
};

export default DetailPanel;