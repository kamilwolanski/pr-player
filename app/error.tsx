"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { ERROR_MESSAGES } from "@/constants/messages";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-page items-center px-4 py-6 sm:px-6 md:px-8">
      <section className="w-full rounded-panel border border-border-soft bg-panel p-6 text-center md:p-10">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full border border-primary/40 bg-primary-soft text-primary">
          <AlertTriangle className="size-7" aria-hidden="true" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {ERROR_MESSAGES.episodesLoad}
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted md:text-base">
          {ERROR_MESSAGES.episodesLoadDescription}
        </p>

        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-card bg-primary px-5 py-3 font-semibold text-white shadow-glow transition hover:bg-primary-hover active:bg-primary-active"
        >
          <RefreshCw className="size-5" aria-hidden="true" />
          Spróbuj ponownie
        </button>
      </section>
    </main>
  );
}