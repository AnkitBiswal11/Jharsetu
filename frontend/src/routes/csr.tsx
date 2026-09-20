import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import {
  Building2,
  ShieldCheck,
  IndianRupee,
  RefreshCw,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Lock,
  Coins,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { CsrEscrowModal } from "@/components/csr-escrow-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/csr")({
  head: () => ({
    meta: [
      { title: "Industry CSR Desk — JharSetu" },
      {
        name: "description",
        content:
          "Statutory Schedule VII CSR Matching Desk connecting industrial enterprises with verified university capstone prototypes.",
      },
    ],
  }),
  component: CSRDeskPage,
});

// Resilient benchmark dataset for offline presentation & instant fallback
const FALLBACK_VELOCITY = [
  { quarter: "Q1 2026", pledged: 1.2, disbursed: 0.8 },
  { quarter: "Q2 2026", pledged: 2.4, disbursed: 1.7 },
  { quarter: "Q3 2026", pledged: 3.8, disbursed: 2.9 },
  { quarter: "Q4 2026", pledged: 4.85, disbursed: 3.6 },
];

const FALLBACK_PROJECTS = [
  {
    id: 1,
    tracking_id: "JS-26043-0117",
    standardized_title: "Low-Cost Continuous Biochar Adsorption Column for Fluoride Remediation",
    district: "Palamu",
    domain: "Water Resources",
    student_team_lead: "Aakash Verma",
    institution: "BIT Mesra",
    grant_amount: 250000,
    funding_status: "PLEDGED",
  },
  {
    id: 2,
    tracking_id: "JS-26043-0142",
    standardized_title: "Microclimate IoT Sensor and AI Pest Trapping Grid for Lac Host Trees",
    district: "Khunti",
    domain: "Tribal Livelihood",
    student_team_lead: "Pooja Soren",
    institution: "NIT Jamshedpur",
    grant_amount: 180000,
    funding_status: "FUNDED",
  },
  {
    id: 3,
    tracking_id: "JS-26043-0188",
    standardized_title: "InSAR Satellite and Drone LiDAR Seam Void Subsidence Early Warning System",
    district: "Dhanbad",
    domain: "Infrastructure",
    student_team_lead: "Rahul Karmakar",
    institution: "IIT (ISM) Dhanbad",
    grant_amount: 320000,
    funding_status: "UNFUNDED",
  },
];

function CSRDeskPage() {
  const [loading, setLoading] = useState(true);
  const [velocityData, setVelocityData] = useState<any[]>(FALLBACK_VELOCITY);
  const [sponsorships, setSponsorships] = useState<any[]>(FALLBACK_PROJECTS);
  const [totalPledged, setTotalPledged] = useState<number>(4850000);
  const [refreshKey, setRefreshKey] = useState(0);

  // Pledge modal state
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [orgName, setOrgName] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  const [grantAmount, setGrantAmount] = useState("250000");
  const [pledging, setPledging] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Escrow dual-key modal state
  const [isEscrowModalOpen, setIsEscrowModalOpen] = useState(false);
  const [escrowProjectTitle, setEscrowProjectTitle] = useState(
    "Low-Cost Continuous Biochar Adsorption Column for Fluoride Remediation"
  );
  const [escrowGrantCr, setEscrowGrantCr] = useState(0.25);

  const fetchCSRData = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/csr/analytics");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.velocity_trend) && data.velocity_trend.length > 0) {
          setVelocityData(data.velocity_trend);
        }
        if (Array.isArray(data.sponsorship_feed) && data.sponsorship_feed.length > 0) {
          setSponsorships(data.sponsorship_feed);
        }
        if (typeof data.total_pledged === "number" && data.total_pledged > 0) {
          setTotalPledged(data.total_pledged);
        }
      }
    } catch (err) {
      console.warn("FastAPI offline or unreachable, utilizing benchmark telemetry", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCSRData();
  }, [refreshKey]);

  const handlePledgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || pledging) return;
    setPledging(true);

    try {
      const payload = {
        problem_id: selectedProject.id,
        organization_name: orgName,
        contact_email: orgEmail,
        grant_amount: parseFloat(grantAmount) || 250000,
        sponsorship_type: "CSR",
      };

      const res = await fetch("http://localhost:8000/api/sponsorships/pledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Server rejected CSR pledge");

      toast.success("Statutory CSR Grant Pledged!", {
        description: `₹${Number(grantAmount).toLocaleString("en-IN")} committed to ${selectedProject.tracking_id} under Schedule VII Escrow.`,
      });

      setDialogOpen(false);
      setRefreshKey((k) => k + 1);
    } catch {
      toast.success("Grant Pledged (Demo Mock)", {
        description: `Pledged ₹${Number(grantAmount).toLocaleString("en-IN")} to ${selectedProject.tracking_id}.`,
      });
      setDialogOpen(false);
    } finally {
      setPledging(false);
    }
  };

  const openEscrowModal = (proj: any) => {
    setEscrowProjectTitle(proj.standardized_title || "Applied Jharkhand Capstone Project");
    setEscrowGrantCr((proj.grant_amount || 250000) / 10000000);
    setIsEscrowModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-5 py-10">
        {/* Title & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              CSR Capstone Matching Desk
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Direct Schedule VII statutory CSR grants to audited student capstones resolving grassroots problems.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEscrowProjectTitle("Statewide Clean Water & Energy Capstone Escrow Vault");
                setEscrowGrantCr(0.48);
                setIsEscrowModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-saffron/40 bg-saffron/10 px-4 py-2 text-xs font-bold text-saffron hover:bg-saffron hover:text-slate-950 transition-colors shadow-sm"
            >
              <Coins className="size-3.5" /> Escrow Milestone Tracker
            </button>

            <button
              type="button"
              onClick={() => setRefreshKey((k) => k + 1)}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold hover:bg-secondary disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin text-teal" : ""}`} />
              Refresh Desk
            </button>
          </div>
        </div>

        {/* Metric Strips */}
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          <div className="surface-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Total CSR Funds Pledged</span>
              <IndianRupee className="size-4 text-saffron" />
            </div>
            <div className="mt-3 text-2xl font-extrabold">
              ₹ {(totalPledged / 100000).toFixed(2)} Lakhs
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Directly into University Escrow Accounts
            </p>
          </div>

          <div className="surface-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Participating Corporates</span>
              <Building2 className="size-4 text-teal" />
            </div>
            <div className="mt-3 text-2xl font-extrabold">6 Enterprise Partners</div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Tata Steel · CCL · BCCL · SAIL · Adani · JSW
            </p>
          </div>

          <div className="surface-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Statutory Compliance</span>
              <TrendingUp className="size-4 text-green-500" />
            </div>
            <div className="mt-3 text-2xl font-extrabold text-green-600">100% Tax Deductible</div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Section 135 &amp; Schedule VII Approved Track
            </p>
          </div>
        </div>

        {/* Recharts Graphical Chart */}
        <div className="surface-card mt-8 p-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="text-base font-bold">Grant Commitment vs. Milestone Disbursement</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Escrow funds released upon verified working prototype delivery (Values in ₹ Crores).
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-2.5 py-1 text-[11px] font-semibold text-teal">
              <Sparkles className="size-3 text-saffron" /> Audited Milestones
            </span>
          </div>

          <div className="mt-6 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={velocityData}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis
                  dataKey="quarter"
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickFormatter={(val) => `₹${val} Cr`}
                />
                <Tooltip
                  formatter={(value: any) => [`₹${value} Crores`, ""]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Bar
                  name="Funds Pledged (Escrow)"
                  dataKey="pledged"
                  fill="#0d9488"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  name="Disbursed (Field Validated)"
                  dataKey="disbursed"
                  fill="#ea580c"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Projects Table */}
        <div className="surface-card mt-8 overflow-hidden p-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="text-base font-bold">Projects Ready for CSR Sponsorship</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Fund applied solutions and meet state-directed regional development goals.
              </p>
            </div>
            <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold">
              {sponsorships.length} Projects Available
            </span>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-3 font-semibold">Project ID</th>
                  <th className="pb-3 font-semibold">Research Initiative</th>
                  <th className="pb-3 font-semibold">Academic Lead</th>
                  <th className="pb-3 font-semibold">District</th>
                  <th className="pb-3 font-semibold">Escrow Status</th>
                  <th className="pb-3 text-right font-semibold">Corporate Governance Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sponsorships.map((proj) => (
                  <tr key={proj.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-teal">
                      {proj.tracking_id || `JS-${proj.id}`}
                    </td>
                    <td className="py-3.5 max-w-sm pr-4 font-medium">
                      {proj.standardized_title}
                    </td>
                    <td className="py-3.5 text-muted-foreground">
                      {proj.student_team_lead
                        ? `${proj.student_team_lead} (${proj.institution})`
                        : "Consortium Review (BIT Mesra)"}
                    </td>
                    <td className="py-3.5">{proj.district}</td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          proj.funding_status === "FUNDED"
                            ? "bg-green-500/10 text-green-600"
                            : proj.funding_status === "PLEDGED"
                            ? "bg-blue-500/10 text-blue-600"
                            : "bg-amber-500/10 text-amber-600"
                        }`}
                      >
                        {proj.funding_status === "FUNDED" ? (
                          <CheckCircle2 className="size-3" />
                        ) : (
                          <Lock className="size-3" />
                        )}
                        {proj.funding_status || "UNFUNDED"}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        {/* Dual-Key Escrow Release Trigger */}
                        <button
                          type="button"
                          onClick={() => openEscrowModal(proj)}
                          className="inline-flex items-center gap-1 rounded-lg border border-saffron/40 bg-saffron/10 px-2.5 py-1 text-xs font-bold text-saffron hover:bg-saffron hover:text-slate-950 transition-colors"
                        >
                          <Coins className="size-3" /> Escrow Milestone
                        </button>

                        {/* Pledge Grant Trigger */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProject(proj);
                            setDialogOpen(true);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg bg-teal px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-teal/90 transition-colors"
                        >
                          <IndianRupee className="size-3" /> Pledge Grant
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Corporate Pledge Dialog Modal */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-2 text-teal">
                <ShieldCheck className="size-4" />
                <span className="text-[11px] font-bold uppercase tracking-wide">
                  Schedule VII Escrow Deposit
                </span>
              </div>
              <DialogTitle className="text-base font-bold">
                Pledge Corporate CSR Grant
              </DialogTitle>
              <DialogDescription className="text-xs">
                Funds are held in a monitored Jharkhand State Higher Education escrow account and released in verified milestones.
              </DialogDescription>
            </DialogHeader>

            {selectedProject && (
              <form onSubmit={handlePledgeSubmit} className="mt-3 space-y-3.5 text-xs">
                <div className="rounded-lg bg-secondary/50 p-3">
                  <div className="font-mono text-[10px] text-teal font-bold">
                    {selectedProject.tracking_id}
                  </div>
                  <div className="mt-1 font-semibold text-foreground">
                    {selectedProject.standardized_title}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block font-semibold">Corporate / Foundation Name</label>
                  <input
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Tata Steel Foundation / CCL CSR Cell"
                    className="h-9 w-full rounded-md border border-input bg-background px-3 outline-none focus:border-teal"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-semibold">Authorized CSR Representative Email</label>
                  <input
                    type="email"
                    required
                    value={orgEmail}
                    onChange={(e) => setOrgEmail(e.target.value)}
                    placeholder="csr.lead@enterprise.com"
                    className="h-9 w-full rounded-md border border-input bg-background px-3 outline-none focus:border-teal"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-semibold">Grant Commitment (₹ INR)</label>
                  <select
                    value={grantAmount}
                    onChange={(e) => setGrantAmount(e.target.value)}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 outline-none focus:border-teal"
                  >
                    <option value="150000">₹ 1,50,000 (Component &amp; Sensor Seed Grant)</option>
                    <option value="250000">₹ 2,50,000 (Complete Field Testing &amp; Pilot)</option>
                    <option value="500000">₹ 5,00,000 (Statewide Panchayat Deployment)</option>
                  </select>
                </div>

                <div className="rounded-md border border-teal/20 bg-teal/5 p-2.5 text-[11px] text-muted-foreground">
                  <strong>Milestone Release Policy:</strong> 40% initial tranche for component procurement, 60% upon final Block Development Officer (BDO) field validation.
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setDialogOpen(false)}
                    className="rounded-md border border-border px-3 py-1.5 font-semibold hover:bg-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={pledging}
                    className="inline-flex items-center gap-1.5 rounded-md bg-teal px-4 py-1.5 font-semibold text-white hover:bg-teal/90 disabled:opacity-50"
                  >
                    {pledging ? "Committing Escrow..." : "Authorize CSR Pledge"}
                  </button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Schedule VII Dual-Key Escrow Verification Modal */}
        <CsrEscrowModal
          isOpen={isEscrowModalOpen}
          onClose={() => setIsEscrowModalOpen(false)}
          projectTitle={escrowProjectTitle}
          grantAmountCr={escrowGrantCr}
        />
      </main>
    </div>
  );
}

export default CSRDeskPage;