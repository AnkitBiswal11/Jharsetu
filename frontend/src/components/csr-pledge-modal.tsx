import { useState } from "react";
import { toast } from "sonner";
import { Building2, IndianRupee, Loader2, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const CORPORATES = [
  "Tata Steel Foundation, Jamshedpur",
  "Central Coalfields Limited (CCL), Ranchi",
  "Bharat Coking Coal Limited (BCCL), Dhanbad",
  "Steel Authority of India (SAIL), Bokaro",
  "Adani Power Jharkhand Ltd.",
  "JSW Steel Jharkhand",
] as const;

interface CSRPledgeModalProps {
  project: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CSRPledgeModal({
  project,
  open,
  onOpenChange,
  onSuccess,
}: CSRPledgeModalProps) {
  const [busy, setBusy] = useState(false);
  const [organization, setOrganization] = useState(CORPORATES[0]);
  const [contactEmail, setContactEmail] = useState("");
  const [grantAmount, setGrantAmount] = useState("250000");

  if (!project) return null;

  const handlePledge = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);

    try {
      const res = await fetch("http://localhost:8000/api/sponsorships/pledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem_id: project.id,
          organization_name: organization,
          contact_email: contactEmail,
          grant_amount: parseFloat(grantAmount),
          sponsorship_type: "CSR",
        }),
      });

      if (!res.ok) throw new Error("Could not record grant pledge");

      toast.success("Industry CSR Grant Pledged", {
        description: `₹${Number(grantAmount).toLocaleString("en-IN")} allocated to ${project.tracking_id || project.id}.`,
      });

      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to pledge grant");
    } finally {
      setBusy(false);
    }
  };

  const field =
    "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/25";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 text-saffron">
            <Building2 className="size-5" />
            <span className="text-xs font-bold tracking-wide uppercase">
              Schedule VII CSR Grant Protocol
            </span>
          </div>
          <DialogTitle className="text-lg leading-snug">
            Pledge Industry CSR Grant
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Target Capstone: <span className="font-semibold text-foreground">{project.standardized_title || project.title}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handlePledge} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold">
              Corporate / PSU Organization
            </label>
            <select
              value={organization}
              onChange={(e) => setOrganization(e.target.value as any)}
              className={field}
            >
              {CORPORATES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold">
              CSR Lead / Officer Official Email
            </label>
            <input
              required
              type="email"
              placeholder="csr.lead@tatasteel.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className={field}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold">
              Grant Amount (INR)
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                ₹
              </span>
              <input
                required
                type="number"
                step="10000"
                value={grantAmount}
                onChange={(e) => setGrantAmount(e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-background pr-3 pl-8 text-sm font-semibold outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/25"
              />
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Standard seed grants: ₹2,50,000 (Field Pilot) to ₹10,00,000 (Full Deployment).
            </p>
          </div>

          <div className="rounded-lg border border-border bg-secondary/50 p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Escrow Disbursement Schedule:</p>
            <p className="mt-1">• 40% on Faculty Mentor approval & milestone initiation</p>
            <p>• 60% on field test report signed by District Collector / BDO</p>
          </div>

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
                  <Loader2 className="size-3.5 animate-spin" /> Committing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-3.5" /> Confirm CSR Allocation
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}