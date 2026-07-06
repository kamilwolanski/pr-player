import EpisodesView from "@/components/EpisodesView";
import { getEpisodes } from "@/services/api";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const episodes = await getEpisodes();

  return (
    <div className="min-h-screen overflow-hidden text-foreground">
      <header className="sticky top-0 z-40 w-full border-b border-border-soft bg-header">
        <div className="mx-auto flex h-20 w-full max-w-page items-center justify-between px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={120}
              height={40}
              priority
            />
          </Link>
        </div>
      </header>

      <EpisodesView initialEpisodesResponse={episodes} />
    </div>
  );
}
