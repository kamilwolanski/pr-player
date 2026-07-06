"use client";

import { useState } from "react";
import { EpisodeRm } from "@/types/episode";

import EpisodesViewContent from "./EpisodesViewContent";
import { MediaPlayerProvider } from "@/providers/MediaPlayer";

type EpisodesViewProps = {
  episodes: EpisodeRm[];
};

const EpisodesView = ({ episodes }: EpisodesViewProps) => {
  const [selectedEpisode, setSelectedEpisode] = useState<EpisodeRm | null>(
    episodes[0] ?? null,
  );

  if (!selectedEpisode) {
    return (
      <main className="mx-auto w-full max-w-page px-4 py-6 sm:px-6 md:px-8">
        <p>Brak odcinków do wyświetlenia</p>
      </main>
    );
  }

  return (
    <MediaPlayerProvider selectedEpisode={selectedEpisode}>
      <EpisodesViewContent
        episodes={episodes}
        selectedEpisode={selectedEpisode}
        setSelectedEpisode={setSelectedEpisode}
      />
    </MediaPlayerProvider>
  );
};

export default EpisodesView;
