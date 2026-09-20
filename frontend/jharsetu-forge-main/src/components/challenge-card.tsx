import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Target, FlaskConical, Building2 } from "lucide-react";
import { DOMAIN_ACCENT, type Challenge } from "@/lib/jharsetu-data";

export function ChallengeCard({ challenge, index }: { challenge: Challenge; index: number }) {
  const [adopted, setAdopted] = useState(challenge.adopted);
  const accent = DOMAIN_ACCENT[challenge.domain];

  return (
    <article
      className="surface-card rise-in flex flex-col gap-4 p-6"
      style={{ animationDelay: `${Math.min(index, 6) * 70}ms` }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
          style={{
            color: `var(--${accent})`,
            backgroundColor: `color-mix(in oklab, var(--${accent}) 12%, transparent)`,
          }}
        >
          <span
            className="size-1.5 rounded-full"
            style={{ backgroundColor: `var(--${accent})` }}
          />
          {challenge.domain}
        </span>
        <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
          {challenge.district}
        </span>
        <span className="ml-auto font-mono text-[11px] text-muted-foreground">
          {challenge.id}
        </span>
      </div>

      <h3 className="text-[17px] leading-snug font-bold">{challenge.title}</h3>

      <div>
        <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
          <span>Feasibility score</span>
          <span className="font-mono text-sm font-bold text-teal">
            {challenge.feasibility}%
          </span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal to-cyan transition-all duration-1000"
            style={{ width: `${challenge.feasibility}%` }}
          />
        </div>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{challenge.summary}</p>

      <div className="rounded-lg border border-border bg-secondary/60 p-3">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-navy uppercase">
          <Target className="size-3.5 text-saffron" /> Research gap
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{challenge.gap}</p>
      </div>

      <div className="flex flex-wrap gap-2 text-[11px]">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 font-medium">
          <FlaskConical className="size-3.5 text-teal" /> {challenge.deliverable}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 font-medium">
          <Building2 className="size-3.5 text-saffron" /> CSR: {challenge.csr}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
        <span className="text-[11px] text-muted-foreground">
          Mentor pool: {challenge.institute}
        </span>
        <button
          type="button"
          disabled={adopted}
          onClick={() => {
            setAdopted(true);
            toast.success("Capstone adoption request sent", {
              description: `${challenge.id} routed to faculty coordinator, ${challenge.institute}.`,
            });
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-xs font-semibold text-navy-foreground transition-all hover:bg-teal hover:shadow-[0_10px_24px_-12px_rgba(13,148,136,0.9)] disabled:cursor-default disabled:bg-teal/12 disabled:text-teal disabled:shadow-none"
        >
          {adopted ? (
            <>
              <CheckCircle2 className="size-4" /> Adopted · NEP 2020
            </>
          ) : (
            "Adopt as Capstone Project"
          )}
        </button>
      </div>
    </article>
  );
}
