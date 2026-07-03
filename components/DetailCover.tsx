import Image from "next/image";

interface EpisodeImage {
  uri: string;
  title: string;
}

interface DetailCoverProps {
  image: EpisodeImage | null;
  title: string;
}

const PLACEHOLDER_IMAGE = "/images/episode-placeholder.png";

export function DetailCover({ image, title }: DetailCoverProps) {
  const imageSrc = image?.uri || PLACEHOLDER_IMAGE;
  const imageAlt = image?.title || title;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[320px] shrink-0 overflow-hidden rounded-panel border border-border bg-card shadow-card lg:mx-0 lg:size-80 lg:max-w-none">
      <Image
        fill
        priority
        src={imageSrc}
        alt={imageAlt}
        sizes="(max-width: 1024px) 320px, 320px"
        className="object-cover"
      />
    </div>
  );
}

