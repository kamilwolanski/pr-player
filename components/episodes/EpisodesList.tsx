import { ChevronDown, Loader2 } from "lucide-react";
import EpisodeCard from "@/components/EpisodeCard";
import { EpisodeRm } from "@/types/episode";
import { STATUS_MESSAGES } from "@/constants/messages";

type EpisodesListProps = {
  episodes: EpisodeRm[];
  selectedEpisodeId: string;
  isMobileDetailMounted: boolean;
  hasMoreEpisodes: boolean;
  isLoadingMore: boolean;
  loadMoreError: string | null;
  onEpisodeSelect: (episode: EpisodeRm) => void;
  onLoadMore: () => void;
};

const EpisodesList = ({
  episodes,
  selectedEpisodeId,
  isMobileDetailMounted,
  hasMoreEpisodes,
  isLoadingMore,
  loadMoreError,
  onEpisodeSelect,
  onLoadMore,
}: EpisodesListProps) => {
  return (
    <section aria-label="Lista odcinków" className="lg:order-1">
      <h1 className="mb-3 text-xl font-semibold tracking-tight md:mb-4 md:text-3xl">
        Odcinki podcastów
      </h1>

      <div className="space-y-3 pr-1 lg:max-h-[calc(100vh-400px)] lg:overflow-y-auto">
        {episodes.map((episode) => {
          const isSelected = selectedEpisodeId === episode.id;

          return (
            <button
              key={episode.id}
              type="button"
              onClick={() => onEpisodeSelect(episode)}
              className="block w-full text-left"
            >
              <div className="hidden lg:block">
                <EpisodeCard episode={episode} active={isSelected} />
              </div>
              <div className="lg:hidden">
                <EpisodeCard
                  episode={episode}
                  active={isSelected && isMobileDetailMounted}
                />
              </div>
            </button>
          );
        })}

        {hasMoreEpisodes && (
          <div className="pt-1">
            <button
              type="button"
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border-soft bg-panel px-4 text-sm font-semibold text-foreground transition hover:border-primary/70 hover:bg-card-hover disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoadingMore ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <ChevronDown className="size-4" aria-hidden="true" />
              )}
              {isLoadingMore ? STATUS_MESSAGES.loading : "Pokaż więcej"}
            </button>
          </div>
        )}

        {loadMoreError && (
          <p className="px-1 text-sm text-primary" role="alert">
            {loadMoreError}
          </p>
        )}
      </div>
    </section>
  );
};

export default EpisodesList;
