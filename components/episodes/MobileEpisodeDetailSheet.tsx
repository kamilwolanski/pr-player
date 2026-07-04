import { ChevronDown } from "lucide-react";
import DetailPanel from "@/components/DetailPanel";
import { EpisodeRm } from "@/types/episode";

type MobileEpisodeDetailSheetProps = {
  episode: EpisodeRm;
  isOpen: boolean;
  playerOffsetClassName: string;
  sheetMaxHeightClassName: string;
  onClose: () => void;
  onExited: () => void;
};

const MobileEpisodeDetailSheet = ({
  episode,
  isOpen,
  playerOffsetClassName,
  sheetMaxHeightClassName,
  onClose,
  onExited,
}: MobileEpisodeDetailSheetProps) => {
  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Zamknij szczegóły odcinka"
        onClick={onClose}
        className={`fixed inset-x-0 top-0 z-30 cursor-default bg-background/75 backdrop-blur-sm transition-opacity duration-200 ${playerOffsetClassName} ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <section
        aria-label="Szczegóły wybranego odcinka"
        onTransitionEnd={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.propertyName !== "translate") return;

          if (!isOpen) {
            onExited();
          }
        }}
        className={`fixed inset-x-0 z-40 overflow-y-auto rounded-t-sheet border border-border bg-panel shadow-player transition-all duration-300 ease-out md:mx-auto md:max-w-3xl ${playerOffsetClassName} ${sheetMaxHeightClassName} ${
          isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-center bg-panel/95 px-4 py-3 backdrop-blur">
          <div className="h-1.5 w-24 rounded-pill bg-muted/70" />

          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full text-foreground transition hover:bg-elevated"
            aria-label="Zamknij szczegóły odcinka"
          >
            <ChevronDown className="size-6" />
          </button>
        </div>

        <DetailPanel
          episode={episode}
          className="rounded-none bg-transparent pt-2 shadow-none sm:p-6 md:p-8"
          isPlaying={false}
        />
      </section>
    </div>
  );
};

export default MobileEpisodeDetailSheet;
