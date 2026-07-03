interface AudioWaveformProps {
  isPlaying: boolean;
}

const bars = [
  14, 22, 30, 38, 28, 46, 34, 26, 20, 18, 28, 36, 48, 34, 26, 20, 18, 22,
  30, 42, 56, 66, 76, 62, 48, 34, 28, 22,
];

export function AudioWaveform({ isPlaying }: AudioWaveformProps) {
  return (
    <div
      className="
        pointer-events-none hidden flex-1 items-center justify-center
        bg-transparent lg:flex
      "
      aria-hidden="true"
    >
      <div
        className="
          flex h-40 w-full max-w-[560px] items-center justify-center gap-2
          bg-transparent
          [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]
        "
      >
        {bars.map((height, index) => (
          <span
            key={index}
            className="
              w-1 rounded-pill bg-primary
              shadow-[0_0_14px_rgba(231,45,74,0.65)]
            "
            style={{
              height,
              animationName: isPlaying ? "waveform-bar" : "none",
              animationDuration: `${850 + (index % 6) * 120}ms`,
              animationDelay: `${index * 45}ms`,
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
              transformOrigin: "center",
            }}
          />
        ))}
      </div>
    </div>
  );
}