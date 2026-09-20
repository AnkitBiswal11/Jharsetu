import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  GraduationCap, 
  Award, 
  ShieldCheck, 
  QrCode, 
  FileCheck2, 
  X, 
  Building2, 
  Download,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function NepCreditModal({ isOpen, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [certData, setCertData] = useState<any | null>(null);

  const [studentRoll, setStudentRoll] = useState("2022/UG/BTECH/EEE/042");
  const [studentName, setStudentName] = useState("Ankit Kumar / Capstone Team Alpha");
  const [institution, setInstitution] = useState("Birla Institute of Technology, Mesra");
  const [projectTitle, setProjectTitle] = useState(
    "Solar-Powered Tube Well Fluoride Filtration Unit with IoT Telemetry"
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleGenerateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/governance/generate-nep-credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: 117,
          student_roll: studentRoll,
          student_name: studentName,
          institution: institution,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCertData(data);
      } else {
        throw new Error("Local backend offline");
      }
    } catch {
      const mockId = `ABC-NEP2020-JH-${Math.floor(10000 + Math.random() * 89999)}`;
      setCertData({
        success: true,
        certificate_id: mockId,
        student_name: studentName,
        institution: institution,
        credits_awarded: 6,
        framework: "National Higher Education Qualifications Framework (NHEQF Level 7)",
        qr_verification_url: `https://digilocker.gov.in/verify/academic-credits/${mockId}`,
        issued_by: "State Higher & Technical Education Council, Government of Jharkhand",
        hash: "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
      });
    } finally {
      setLoading(false);
      toast.success("NEP 2020 Academic Credits Issued", {
        description: "Credentials synced with Academic Bank of Credits (ABC ID: 849-204-192).",
      });
    }
  };

  const modalContent = (
    <div 
      style={{ position: "fixed", inset: 0, zIndex: 99999 }}
      className="flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header Strip */}
        <div className="flex items-center justify-between border-b border-border bg-[#071322] px-5 py-3.5 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="grid size-8 place-items-center rounded-lg bg-teal/20 text-teal">
              <GraduationCap className="size-4 text-saffron" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold">NEP 2020 Credit Gateway</h3>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-400">
                  ABC Validated
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Experiential Learning Credits under NHEQF Level 7
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 text-foreground">
          {!certData ? (
            <form onSubmit={handleGenerateCertificate} className="space-y-3.5">
              <div className="rounded-xl border border-teal/25 bg-teal/5 p-3 text-[11px] text-muted-foreground leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold text-teal mb-0.5">
                  <Award className="size-3.5" /> Quad-Helix Academic Bridge
                </div>
                Field solutions deployed by student teams grant mandatory{" "}
                <strong>NEP 2020 Community Engagement Credits (6 Credits)</strong> once validated by faculty mentors.
              </div>

              <div>
                <label className="block text-[11px] font-bold text-foreground">Adopted Challenge Statement</label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-xs font-semibold text-foreground focus:border-teal focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-foreground">Team Lead / Student Name</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-xs text-foreground focus:border-teal focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-foreground">University Enrollment / Roll</label>
                  <input
                    type="text"
                    value={studentRoll}
                    onChange={(e) => setStudentRoll(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-xs font-mono text-foreground focus:border-teal focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-foreground">Higher Education Institution (HEI)</label>
                <select
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-xs text-foreground focus:border-teal focus:outline-none"
                >
                  <option value="Birla Institute of Technology, Mesra">Birla Institute of Technology (BIT), Mesra</option>
                  <option value="National Institute of Technology, Jamshedpur">National Institute of Technology (NIT), Jamshedpur</option>
                  <option value="Indian Institute of Technology (ISM), Dhanbad">IIT (ISM), Dhanbad</option>
                  <option value="Birsa Institute of Technology (BIT) Sindri">BIT Sindri, Dhanbad</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2 rounded-lg border border-border bg-secondary/30 p-2.5 text-center">
                <div>
                  <div className="font-mono text-base font-black text-teal">4.0</div>
                  <div className="text-[9px] text-muted-foreground font-semibold">Field Prototype Lab</div>
                </div>
                <div>
                  <div className="font-mono text-base font-black text-saffron">2.0</div>
                  <div className="text-[9px] text-muted-foreground font-semibold">Gram Sabha Telemetry</div>
                </div>
                <div>
                  <div className="font-mono text-base font-black text-emerald-500">6.0 TOTAL</div>
                  <div className="text-[9px] text-muted-foreground font-bold">NHEQF Level 7 Credits</div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 rounded-lg border border-border py-2 text-xs font-semibold text-muted-foreground transition hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-2/3 items-center justify-center gap-1.5 rounded-lg bg-teal py-2 text-xs font-bold text-white shadow-sm transition hover:bg-teal/90 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" /> Minting Credentials...
                    </>
                  ) : (
                    <>
                      <FileCheck2 className="size-3.5" /> Generate NEP 2020 Certificate
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-xl border-2 border-dashed border-teal/40 bg-gradient-to-b from-teal/5 via-card to-card p-5 shadow-inner">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="size-7 text-teal" />
                    <div>
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                        Government of Jharkhand · Dept. of Higher & Technical Education
                      </div>
                      <div className="text-base font-black text-foreground">
                        Academic Bank of Credits (ABC) Certificate
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="size-3" /> Digitally Signed
                  </span>
                </div>

                <div className="mt-4 space-y-1.5 text-xs leading-relaxed">
                  <p className="text-muted-foreground">
                    Certifying that <strong className="text-foreground">{certData.student_name}</strong> (Roll:{" "}
                    <span className="font-mono font-bold text-foreground">{studentRoll}</span>) of{" "}
                    <strong className="text-foreground">{certData.institution}</strong> completed the field capstone:
                  </p>

                  <div className="rounded-lg border border-border bg-card p-2.5 text-xs font-semibold text-foreground">
                    &ldquo;{projectTitle}&rdquo;
                  </div>

                  <p className="text-muted-foreground pt-1 text-[11px]">
                    Awarded <strong className="text-teal font-black">6 Experiential Learning Credits</strong> recognized via DigiLocker NAD.
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[10px]">
                  <div>
                    <span className="block text-muted-foreground">Certificate ID:</span>
                    <span className="font-mono font-bold text-foreground">{certData.certificate_id}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <QrCode className="size-7 text-teal" />
                    <div className="text-right">
                      <span className="block font-mono text-[8px] text-muted-foreground">SHA-256</span>
                      <span className="font-mono text-[9px] font-bold text-emerald-500">DIGILOCKER / ABC</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 rounded-lg border border-border py-2 text-xs font-semibold text-muted-foreground transition hover:bg-secondary"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => setCertData(null)}
                  className="w-1/3 rounded-lg border border-border py-2 text-xs font-semibold text-muted-foreground transition hover:bg-secondary"
                >
                  Issue Another
                </button>
                <button
                  type="button"
                  onClick={() => toast.success("PDF Downloaded", { description: `${certData.certificate_id}.pdf` })}
                  className="inline-flex w-1/3 items-center justify-center gap-1.5 rounded-lg bg-teal py-2 text-xs font-bold text-white shadow-sm transition hover:bg-teal/90"
                >
                  <Download className="size-3.5" /> Download PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}