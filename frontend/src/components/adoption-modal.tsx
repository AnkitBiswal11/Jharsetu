import { useState } from "react";
import { toast } from "sonner";
import { GraduationCap, Loader2, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Challenge } from "@/lib/jharsetu-data";

const INSTITUTES = [
  "BIT Mesra, Ranchi",
  "NIT Jamshedpur",
  "IIT (ISM) Dhanbad",
  "Ranchi University",
  "Birsa Agricultural University",
  "Kolhan University, Chaibasa",
  "Vinoba Bhave University, Hazaribagh",
  "SUIIT, Chaibasa",
  "Government Engineering College, Ramgarh",
] as const;

interface AdoptionModalProps {
  challenge: Challenge | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (challengeId: string) => void;
}

export function AdoptionModal({
  challenge,
  open,
  onOpenChange,
  onSuccess,
}: AdoptionModalProps) {
  const [busy, setBusy] = useState(false);
  const [nepCertify, setNepCertify] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    studentRoll: "",
    institution: challenge?.institute || INSTITUTES[0],
    facultyEmail: "",
    timelineMonths: 6,
  });

  if (!challenge) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nepCertify) {
      toast.error("Please certify the NEP 2020 experiential learning requirement.");
      return;
    }

    setBusy(true);
    try {
      // Safely extract the trailing digits while respecting noUncheckedIndexedAccess
      const parts = challenge.id.split("-");
      const lastPart = parts[parts.length - 1] ?? "";
      const numericId = parseInt(lastPart, 10) || 1;

      const res = await fetch("http://localhost:8000/api/projects/adopt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem_id: numericId,
          student_name: formData.studentName,
          student_roll: formData.studentRoll,
          institution: formData.institution,
          faculty_mentor_email: formData.facultyEmail,
          proposed_timeline_months: Number(formData.timelineMonths),
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      toast.success("Capstone Project Adopted (NEP 2020)", {
        description: `${challenge.id} registered under ${formData.institution}. Faculty mentor notified.`,
      });

      onSuccess(challenge.id);
      onOpenChange(false);
    } catch (err: any) {
      toast.error("Adoption registration failed", {
        description: err instanceof Error ? err.message : "Ensure backend is running.",
      });
    } finally {
      setBusy(false);
    }
  };

  const field =
    "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/25";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-teal">
            <GraduationCap className="size-5" />
            <span className="text-xs font-bold tracking-wide uppercase">
              NEP 2020 Experiential Learning Gateway
            </span>
          </div>
          <DialogTitle className="text-lg leading-snug">
            Adopt Challenge as Capstone Project
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Linking: <span className="font-semibold text-foreground">{challenge.title}</span> ({challenge.id})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold">
                Student Lead Name
              </label>
              <input
                required
                placeholder="e.g. Ramesh Soren"
                className={field}
                value={formData.studentName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, studentName: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">
                University Roll / Registration No.
              </label>
              <input
                required
                placeholder="e.g. BTECH/2026/CS/042"
                className={field}
                value={formData.studentRoll}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, studentRoll: e.target.value }))
                }
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold">
              Higher Education Institution (HEI)
            </label>
            <select
              className={field}
              value={formData.institution}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, institution: e.target.value }))
              }
            >
              {INSTITUTES.map((inst) => (
                <option key={inst} value={inst}>
                  {inst}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold">
                Faculty Mentor Official Email
              </label>
              <input
                required
                type="email"
                placeholder="mentor@institute.ac.in"
                className={field}
                value={formData.facultyEmail}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, facultyEmail: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">
                Project Duration (Months)
              </label>
              <select
                className={field}
                value={formData.timelineMonths}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    timelineMonths: Number(e.target.value),
                  }))
                }
              >
                <option value={3}>3 Months (Mini Project)</option>
                <option value={6}>6 Months (Final Semester Capstone)</option>
                <option value={12}>12 Months (Year-Long R&D Track)</option>
              </select>
            </div>
          </div>

          <label className="flex items-start gap-2.5 rounded-lg border border-border bg-secondary/40 p-3 text-xs text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              required
              checked={nepCertify}
              onChange={(e) => setNepCertify(e.target.checked)}
              className="mt-0.5 size-4 rounded border-border text-teal focus:ring-teal"
            />
            <span>
              I certify this capstone satisfies NEP 2020 experiential learning mandates. 
              Project milestones and working prototypes will be uploaded for CSR grant audit.
            </span>
          </label>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg border border-border px-4 py-2 text-xs font-semibold transition-colors hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2 text-xs font-semibold text-navy-foreground transition-all hover:bg-teal disabled:opacity-60"
            >
              {busy ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" /> Enrolling...
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-3.5" /> Confirm Academic Adoption
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}