import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Trash2 } from "lucide-react";
import { getCalculator } from "@/lib/calc";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/jobs")({ component: JobsPage });

function JobsPage() {
  const jobs = useStore((s) => s.jobs);
  const hydrated = useStore((s) => s.hydrated);
  const deleteJob = useStore((s) => s.deleteJob);
  const setInputs = useStore((s) => s.setInputs);

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/"
        className="inline-flex h-11 w-fit items-center gap-2 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All calculators
      </Link>
      <div>
        <h1 className="font-display text-4xl font-semibold tracking-tight">Jobs</h1>
        <p className="mt-1 text-muted">Saved takeoffs stay on this device.</p>
      </div>

      {!hydrated ? (
        <p className="text-muted">Loading…</p>
      ) : jobs.length === 0 ? (
        <p className="rounded-xl bg-card px-4 py-8 text-center text-muted shadow-border">
          No saved jobs yet. Open a calculator and tap Save job.
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-xl bg-card shadow-border">
          {jobs.map((job) => {
            const calc = getCalculator(job.slug);
            return (
              <li key={job.id} className="flex items-center gap-3 px-4 py-3">
                <Link
                  to="/calc/$slug"
                  params={{ slug: job.slug }}
                  onClick={() => setInputs(job.slug, job.inputs)}
                  className="flex min-h-11 min-w-0 flex-1 flex-col"
                >
                  <span className="truncate font-medium">{job.name}</span>
                  <span className="truncate font-mono text-xs text-muted">
                    {calc?.name ?? job.slug} · {job.headline}
                  </span>
                </Link>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete ${job.name}`}
                  onClick={() => deleteJob(job.id)}
                >
                  <Trash2 />
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
