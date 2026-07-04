"use client";

import { useState } from "react";
import BottomPlayer from "@/components/BottomPlayer";
import DetailPanel from "@/components/DetailPanel";
import { EpisodeRm } from "@/types/episode";
import MobileEpisodeDetailSheet from "./episodes/MobileEpisodeDetailSheet";
import EpisodesList from "./episodes/EpisodesList";

type EpisodesViewProps = {
  episodes: EpisodeRm[];
};

const EpisodesView = ({ episodes }: EpisodesViewProps) => {
  const [selectedEpisode, setSelectedEpisode] = useState<EpisodeRm | null>(
    episodes[0] ?? null,
  );
  const [isMobileDetailMounted, setIsMobileDetailMounted] = useState(false);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

  if (!selectedEpisode) {
    return (
      <main className="mx-auto w-full max-w-page px-4 py-6 sm:px-6 md:px-8">
        <p>Brak odcinków do wyświetlenia</p>
      </main>
    );
  }

  const isPlayerVisible = true;

  const mobilePlayerOffset = isPlayerVisible
    ? "bottom-20 md:bottom-24"
    : "bottom-0";
  const mobileSheetMaxHeight = isPlayerVisible
    ? "max-h-[calc(100dvh-5rem)]"
    : "max-h-[calc(100dvh-1rem)]";

  const selectEpisode = async (episode: EpisodeRm) => {
    setSelectedEpisode(episode);
    setIsMobileDetailMounted(true);

    requestAnimationFrame(() => {
      setIsMobileDetailOpen(true);
    });
  };

  const closeMobileDetail = () => {
    setIsMobileDetailOpen(false);
  };

  const unmountMobileDetail = () => {
    setIsMobileDetailMounted(false);
  };

  return (
    <>
      <main
        className={`mx-auto grid w-full max-w-page gap-6 px-4 py-4 sm:px-6 md:px-8 md:py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] ${
          isPlayerVisible ? "pb-32 md:pb-36" : "pb-6 md:pb-8"
        }`}
      >
        <EpisodesList
          episodes={episodes}
          selectedEpisodeId={selectedEpisode.id}
          isMobileDetailMounted={isMobileDetailMounted}
          onEpisodeSelect={selectEpisode}
        />

        <section
          aria-label="Szczegóły odcinka"
          className="hidden lg:order-2 lg:block"
        >
          <DetailPanel episode={selectedEpisode} isPlaying={false} />
        </section>
      </main>

      {isMobileDetailMounted && (
        <MobileEpisodeDetailSheet
          episode={selectedEpisode}
          isOpen={isMobileDetailOpen}
          playerOffsetClassName={mobilePlayerOffset}
          sheetMaxHeightClassName={mobileSheetMaxHeight}
          onClose={closeMobileDetail}
          onExited={unmountMobileDetail}
        />
      )}

      <BottomPlayer
        episode={selectedEpisode}
        onClose={function (): void {
          throw new Error("Function not implemented.");
        }}
        volume={0}
      />
    </>
  );
};

export default EpisodesView;
