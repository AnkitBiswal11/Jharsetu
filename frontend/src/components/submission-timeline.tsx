import { useEffect, useState } from "react";
import { Camera, Loader2, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  formatWhen,
  listEvents,
  STATUS_META,
  type Submission,
  type SubmissionEvent,
} from "@/lib/submissions";
import { getEvidenceUrl } from "@/lib/staff.functions";
import { useStaff } from "@/lib/use-staff";

export function SubmissionTimeline({
  submission,
  onClose,
}: {
  submission: Submission | null;
  onClose: () => void;
}) {
  const { roles } = useStaff();
  const isStaff = roles.length > 0;
  const [events, setEvents] = useState<SubmissionEvent[] | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState(false);

  useEffect(() => {
    if (!submission) return;
    setEvents(null);
    setPhoto(null);
    setPhotoError(false);
    void listEvents(submission.id).then(setEvents).catch(() => setEvents([]));
    if (submission.photo_path && isStaff) {
      void getEvidenceUrl({ data: { path: submission.photo_path } })
        .then((r) => setPhoto(r.url))
        .catch(() => setPhotoError(true));
    }
  }, [submission, isStaff]);

  return (
    <Dialog open={!!submission} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        {submission && (
          <>
            <DialogHeader>
              <DialogTitle className="text-base leading-snug">{submission.title}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="font-mono text-muted-foreground">{submission.tracking_id}</span>
              <span className="rounded-full bg-secondary px-2 py-0.5">{submission.district}</span>
              {submission.domains.map((d) => (
                <span key={d} className="rounded-full bg-secondary px-2 py-0.5">
                  {d}
                </span>
              ))}
              <span
                className={`rounded-full px-2 py-0.5 font-semibold ${STATUS_META[submission.status].tone}`}
              >
                {STATUS_META[submission.status].label}
              </span>
            </div>

            <p className="text-sm text-muted-foreground">{submission.description}</p>

            {submission.photo_path && (
              <div className="overflow-hidden rounded-xl border border-border">
                {!isStaff ? (
                  <div className="flex h-24 items-center justify-center gap-2 px-4 text-center text-xs text-muted-foreground">
                    <Lock className="size-3.5" /> Photo evidence is restricted to authorized staff.
                  </div>
                ) : photoError ? (
                  <div className="flex h-24 items-center justify-center px-4 text-center text-xs text-muted-foreground">
                    Evidence link could not be issued.
                  </div>
                ) : photo ? (
                  <img src={photo} alt="Field evidence" className="w-full object-cover" />
                ) : (
                  <div className="flex h-32 items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" /> Loading stored evidence…
                  </div>
                )}
                <p className="flex items-center gap-1.5 border-t border-border bg-secondary/60 px-3 py-2 text-[11px] text-muted-foreground">
                  <Camera className="size-3" /> Citizen-submitted photo evidence
                  {isStaff && photo && " · secure link expires in 5 minutes"}
                </p>
              </div>
            )}

            <div>
              <p className="mb-3 text-xs font-bold">Workflow history</p>
              {!events ? (
                <p className="text-xs text-muted-foreground">Loading…</p>
              ) : (
                <ol className="relative space-y-4 border-l border-border pl-5">
                  {events.map((ev) => (
                    <li key={ev.id} className="relative">
                      <span
                        className={`absolute top-1 -left-[25px] size-2.5 rounded-full ring-2 ring-background ${STATUS_META[ev.status].dot}`}
                      />
                      <p className="text-xs font-semibold">{STATUS_META[ev.status].label}</p>
                      <p className="font-mono text-[11px] text-muted-foreground">
                        {formatWhen(ev.created_at)} · {ev.actor}
                      </p>
                      {ev.note && <p className="mt-1 text-xs text-muted-foreground">{ev.note}</p>}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
