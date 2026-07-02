import Image from "next/image";
import { AudioLines, Mic2, Video as VideoIcon } from "lucide-react";
import { EpisodeRm } from "@/types/episode";
import { formatPolishDate } from "@/utils/date";
import { formatDurationSeconds } from "@/utils/time";

const EpisodeCard = ({ episode }: { episode: EpisodeRm }) => {
  const imageSrc = episode.mainImage?.uri;

  const imageAlt = episode.mainImage?.title || episode.podcastTitle;

  const duration =
    episode.audioDuration !== null
      ? formatDurationSeconds(episode.audioDuration)
      : null;
  const active = false;
  return (
    <article
      className={`group flex w-full items-center gap-4 rounded-2xl p-3 text-left transition ${
        active
          ? "bg-card border border-primary hover:bg-card-hover"
          : "bg-card border border-border-soft hover:bg-card-hover"
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
          className="rounded-thumbnail object-cover"
        />
      ) : (
        <div
          className="
        relative flex size-21.25 shrink-0 items-center justify-center overflow-hidden rounded-thumbnail
        border border-border-soft bg-card
      "
          aria-label="Brak miniatury odcinka"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(231,45,74,0.22),transparent_55%),radial-gradient(circle_at_20%_20%,rgba(231,45,74,0.16),transparent_45%)]" />

          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_45%)]" />

          <div className="relative flex size-11 items-center justify-center rounded-pill border border-primary/40 bg-primary/10 text-primary shadow-glow">
            <Mic2 className="size-6" strokeWidth={2.4} />
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="truncate text-[15px] font-semibold text-foreground hover:text-brand md:text-base">
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
          <span className="text-xs text-muted-foreground">
            {formatPolishDate(episode.publishDate)}
          </span>
          <div className="flex items-center gap-1.5">
            {episode.externalAudioId && (
              <span
                title="Dostępne w audio"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-brand/60 text-brand"
              >
                <AudioLines className="h-3.5 w-3.5" />
              </span>
            )}
            {episode.externalVideoId && (
              <span
                title="Dostępne w wideo"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-panel-border text-muted-foreground"
              >
                <VideoIcon className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default EpisodeCard;
