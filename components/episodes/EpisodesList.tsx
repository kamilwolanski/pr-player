import EpisodeCard from "@/components/EpisodeCard";
import { EpisodeRm } from "@/types/episode";

type EpisodesListProps = {
  episodes: EpisodeRm[];
  selectedEpisodeId: string;
  isMobileDetailMounted: boolean;
  onEpisodeSelect: (episode: EpisodeRm) => void;
};

const EpisodesList = ({
  episodes,
  selectedEpisodeId,
  isMobileDetailMounted,
  onEpisodeSelect,
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
      </div>
    </section>
  );
};

export default EpisodesList;
