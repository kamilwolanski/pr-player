import Image from "next/image";
import { AudioLines, Mic2, Video as VideoIcon } from "lucide-react";
import { EpisodeRm } from "@/types/episode";
import { formatPolishDate } from "@/utils/date";
import { formatDurationSeconds } from "@/utils/time";

type EpisodeCardProps = {
  episode: EpisodeRm;
  active: boolean;
};

const EpisodeCard = ({ episode, active }: EpisodeCardProps) => {
  const imageSrc = episode.mainImage?.uri;
  const imageAlt = episode.mainImage?.title || episode.podcastTitle;
  const duration =
    episode.audioDuration !== null
      ? formatDurationSeconds(episode.audioDuration)
      : null;

  return (
    <article
      className={`group flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition sm:gap-4 ${
        active
          ? "border-primary bg-card hover:bg-card-hover "
          : "border-border-soft bg-card hover:bg-card-hover"
      }`}
    >
      {imageSrc ? (
        <Image
          width={85}
          height={85}
          loading="lazy"
          decoding="async"
          src={imageSrc}
          alt={imageAlt}
          className="size-16 shrink-0 rounded-thumbnail object-cover sm:size-[85px]"
        />
      ) : (
        <div
          className="
            relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-thumbnail
            border border-border-soft bg-card sm:size-[85px]
          "
          aria-label="Brak miniatury odcinka"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(231,45,74,0.22),transparent_55%),radial-gradient(circle_at_20%_20%,rgba(231,45,74,0.16),transparent_45%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_45%)]" />

          <div className="relative flex size-10 items-center justify-center rounded-pill border border-primary/40 bg-primary/10 text-primary shadow-glow sm:size-11">
            <Mic2 className="size-5 sm:size-6" strokeWidth={2.4} />
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary sm:truncate sm:text-base">
            {episode.title}
          </p>

          {duration && (
            <span className="shrink-0 text-xs tabular-nums text-muted md:text-sm">
              {duration}
            </span>
          )}
        </div>

        <div className="mt-1 truncate text-sm text-primary">
          {episode.podcastTitle}
        </div>

        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="truncate text-xs text-muted">
            {formatPolishDate(episode.publishDate)}
          </span>

          <div className="flex shrink-0 items-center gap-1.5">
            {episode.externalAudioId && (
              <span
                title="Dostępne w audio"
                className="flex size-7 items-center justify-center rounded-full border border-primary/60 text-primary"
              >
                <AudioLines className="size-3.5" />
              </span>
            )}

            {episode.externalVideoId && (
              <span
                title="Dostępne w wideo"
                className="flex size-7 items-center justify-center rounded-full border border-border text-muted"
              >
                <VideoIcon className="size-3.5" />
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default EpisodeCard;
