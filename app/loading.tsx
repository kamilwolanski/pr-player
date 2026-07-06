export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-page px-4 py-6 sm:px-6 md:px-8">
      <div className="mb-4 h-9 w-64 animate-pulse rounded-card bg-card" />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        <section className="space-y-3" aria-label="Ładowanie listy odcinków">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-[110px] animate-pulse rounded-2xl border border-border-soft bg-card"
            />
          ))}
        </section>

        <section className="hidden min-h-[520px] animate-pulse rounded-panel bg-panel lg:block" />
      </div>
    </main>
  );
}