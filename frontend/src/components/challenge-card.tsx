import { useState } from "react";
import { 
  CheckCircle2, 
  Target, 
  FlaskConical, 
  Building2, 
  Camera, 
  Maximize2,
  Scale
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AdoptionModal } from "@/components/adoption-modal";
import { PatentPrecheckModal } from "@/components/patent-precheck-modal";
import { DOMAIN_ACCENT, type Challenge } from "@/lib/jharsetu-data";

export function ChallengeCard({ challenge, index }: { challenge: Challenge; index: number }) {
  const [adopted, setAdopted] = useState(challenge.adopted);
  const [modalOpen, setModalOpen] = useState(false);
  const [patentModalOpen, setPatentModalOpen] = useState(false);
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

      <div className="flex items-start gap-4">
        <h3 className="flex-1 text-[17px] leading-snug font-bold">{challenge.title}</h3>
        {challenge.photo && (
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                aria-label="View field photo evidence"
                className="group relative size-20 shrink-0 overflow-hidden rounded-xl border border-border shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <img
                  src={challenge.photo}
                  alt={challenge.photoCaption ?? "Field photo evidence"}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-navy-deep/45 opacity-0 transition-opacity group-hover:opacity-100">
                  <Maximize2 className="size-4 text-white" />
                </span>
                <span className="absolute bottom-0 left-0 inline-flex items-center gap-1 rounded-tr-md bg-navy-deep/80 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                  <Camera className="size-2.5" /> Evidence
                </span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-sm">{challenge.title}</DialogTitle>
              </DialogHeader>
              <img
                src={challenge.photo}
                alt={challenge.photoCaption ?? "Field photo evidence"}
                className="w-full rounded-lg"
              />
              <p className="text-xs text-muted-foreground">{challenge.photoCaption}</p>
            </DialogContent>
          </Dialog>
        )}
      </div>

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

      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 font-medium">
            <FlaskConical className="size-3.5 text-teal" /> {challenge.deliverable}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 font-medium">
            <Building2 className="size-3.5 text-saffron" /> CSR: {challenge.csr}
          </span>
        </div>

        {/* Prior-Art & Novelty Screener Trigger */}
        <button
          type="button"
          onClick={() => setPatentModalOpen(true)}
          className="inline-flex items-center gap-1 rounded-md border border-teal/30 bg-teal/5 px-2.5 py-1 font-semibold text-teal hover:bg-teal hover:text-white transition-colors"
        >
          <Scale className="size-3 text-saffron" /> InPASS Novelty Check
        </button>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
        <span className="text-[11px] text-muted-foreground">
          Mentor pool: {challenge.institute}
        </span>
        <button
          type="button"
          disabled={adopted}
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-xs font-semibold text-navy-foreground transition-all hover:bg-teal hover:shadow-[0_10px_24px_-12px_rgba(13,148,136,0.9)] disabled:cursor-default disabled:bg-teal/12 disabled:text-teal disabled:shadow-none"
        >
          {adopted ? (
            <>
              <CheckCircle2 className="size-4" /> Adopted • NEP 2020
            </>
          ) : (
            "Adopt as Capstone Project"
          )}
        </button>
      </div>

      {/* Capstone Adoption Modal */}
      <AdoptionModal
        challenge={challenge}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={() => setAdopted(true)}
      />

      {/* Indian Patent Office (InPASS) Novelty Screener Modal */}
      <PatentPrecheckModal
        isOpen={patentModalOpen}
        onClose={() => setPatentModalOpen(false)}
        challengeTitle={challenge.title}
        domain={challenge.domain}
        problemId={challenge.id}
      />
    </article>
  );
}

export default ChallengeCard;