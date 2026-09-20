import { useState } from "react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ShieldCheck, Award, Lock, CheckCircle2, QrCode, Sparkles, Building2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: {
    id: number;
    tracking_id: string;
    title: string;
    student_lead: string;
    institution: string;
  };
}

export function FieldVerificationModal({ open, onOpenChange, project }: Props) {
  const [bdoKey, setBdoKey] = useState("BDO-JH-PALAMU-8821");
  const [mentorApproval, setMentorApproval] = useState(true);
  const [releasing, setReleasing] = useState(false);
  const [txDetails, setTxDetails] = useState<any | null>(null);
  const [certDetails, setCertDetails] = useState<any | null>(null);

  const handleDualSignoff = async () => {
    setReleasing(true);
    try {
      // 1. Trigger Dual-Key Blockchain Milestone Escrow Release
      const escrowRes = await fetch("http://localhost:8000/api/escrow/release-milestone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: project.id,
          bdo_signoff_key: bdoKey,
          faculty_mentor_approval: mentorApproval,
          milestone_stage: 2,
        }),
      });
      const escrowData = await escrowRes.json();
      setTxDetails(escrowData);

      // 2. Generate NEP 2020 Academic Bank of Credits (ABC) Certificate
      const certRes = await fetch("http://localhost:8000/api/governance/generate-nep-credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: project.id,
          student_roll: "2026-UG-CS-041",
          student_name: project.student_lead || "Aakash Verma",
          institution: project.institution || "BIT Mesra",
        }),
      });
      const certData = await certRes.json();
      setCertDetails(certData);

      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      toast.success("Milestone Verified & CSR Escrow Released", {
        description: `Tx Hash: ${escrowData.escrow_tx_hash.slice(0, 16)}... | 6 Credits Dispatched to DigiLocker`,
      });
    } catch (e: any) {
      toast.error("Dual Sign-off Failed", { description: e.message });
    } finally {
      setReleasing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-teal">
            <ShieldCheck className="size-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Panchayat Sign-Off &amp; Dual Escrow Protocol
            </span>
          </div>
          <DialogTitle className="text-lg font-bold">
            Field Verification &amp; DigiLocker Credit Release
          </DialogTitle>
          <DialogDescription className="text-xs">
            Releases final 60% Schedule VII CSR funds and awards 6 NEP 2020 academic credits to the student team.
          </DialogDescription>
        </DialogHeader>

        {!txDetails ? (
          <div className="mt-3 space-y-4 text-xs">
            <div className="rounded-xl border border-border bg-secondary/50 p-3.5">
              <div className="font-mono text-[10px] font-bold text-teal">{project.tracking_id}</div>
              <div className="mt-1 font-semibold text-foreground">{project.title}</div>
              <div className="mt-1 text-muted-foreground">
                Team Lead: <span className="font-medium text-foreground">{project.student_lead}</span> ({project.institution})
              </div>
            </div>

            <div>
              <label className="mb-1 block font-semibold">Block Development Officer (BDO) Digital Key</label>
              <input
                value={bdoKey}
                onChange={(e) => setBdoKey(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 font-mono text-xs outline-none focus:border-teal"
              />
            </div>

            <div className="flex items-center gap-2.5 rounded-lg border border-border bg-card p-3">
              <input
                type="checkbox"
                id="mentor"
                checked={mentorApproval}
                onChange={(e) => setMentorApproval(e.target.checked)}
                className="size-4 accent-teal"
              />
              <label htmlFor="mentor" className="text-xs font-semibold cursor-pointer">
                University Academic Mentor Sign-off on Working Prototype
              </label>
            </div>

            <div className="rounded-md border border-teal/20 bg-teal/5 p-3 text-[11px] text-muted-foreground">
              <strong>Escrow Condition:</strong> Requires dual authorization before the smart contract disburses the remaining 60% grant tranche into the university incubation account.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-md border border-border px-3 py-1.5 font-semibold hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={releasing || !mentorApproval}
                onClick={handleDualSignoff}
                className="inline-flex items-center gap-1.5 rounded-md bg-teal px-4 py-1.5 font-semibold text-white hover:bg-teal/90 disabled:opacity-50"
              >
                {releasing ? "Verifying Keys..." : "Authorize Field Release"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3 space-y-4 text-xs">
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-center">
              <CheckCircle2 className="mx-auto size-9 text-green-600" />
              <h4 className="mt-2 text-sm font-bold text-foreground">Field Prototype Successfully Verified</h4>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                Escrow Tx: {txDetails.escrow_tx_hash}
              </p>
            </div>

            {certDetails && (
              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="flex items-center gap-1.5 font-bold text-teal">
                    <Award className="size-4 text-saffron" /> DigiLocker ABC Credential Issued
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">{certDetails.certificate_id}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-muted-foreground">Student:</span> <span className="font-semibold">{certDetails.student_name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Credits:</span> <span className="font-bold text-green-600">6 NHEQF Credits</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border text-[11px]">
                  <span className="text-muted-foreground">Verified by: State Higher Ed Council</span>
                  <span className="inline-flex items-center gap-1 text-teal font-semibold">
                    <QrCode className="size-3.5" /> DigiLocker Verifiable
                  </span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="w-full rounded-md bg-navy py-2 text-xs font-semibold text-white hover:bg-navy-deep"
            >
              Close Verification Terminal
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}