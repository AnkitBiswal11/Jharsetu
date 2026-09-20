import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { IndianRupee, HandCoins, ShieldCheck, TrendingUp } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/csr")({
  head: () => ({
    meta: [
      { title: "Industry CSR Desk — JharSetu Jharkhand" },
      {
        name: "description",
        content:
          "Track industry CSR pledges, grant disbursal and sponsored capstone outcomes across Jharkhand districts.",
      },
      { property: "og:title", content: "Industry CSR Desk — JharSetu" },
      {
        property: "og:description",
        content: "CSR pledges, disbursal tracking and sponsored capstone outcomes in Jharkhand.",
      },
    ],
  }),
  component: CsrPage,
});

const SPONSORS = [
  { name: "Tata Steel Foundation", pledged: 185, released: 122, projects: 74, focus: "Water & Livelihood" },
  { name: "Coal India Ltd. (CCL)", pledged: 142, released: 88, projects: 61, focus: "Clean Energy" },
  { name: "SAIL Community Trust", pledged: 96, released: 51, projects: 39, focus: "Rural Healthcare" },
  { name: "BCCL Dhanbad", pledged: 62, released: 30, projects: 24, focus: "Infrastructure Safety" },
];

function CsrPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 py-10">
        <h1 className="text-3xl font-extrabold">Industry CSR Desk</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
          Sponsor a verified district challenge, track grant release against milestones, and
          receive audited impact reports from the mentoring institution.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total pledged", value: "₹ 4.85 Cr", icon: IndianRupee },
            { label: "Released against milestones", value: "₹ 2.91 Cr", icon: HandCoins },
            { label: "Audited & closed projects", value: "128", icon: ShieldCheck },
          ].map((s, i) => (
            <div key={s.label} className="surface-card rise-in p-5" style={{ animationDelay: `${i * 80}ms` }}>
              <s.icon className="size-5 text-saffron" />
              <p className="mt-3 text-2xl font-extrabold tracking-tight">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {SPONSORS.map((s, i) => {
            const pct = Math.round((s.released / s.pledged) * 100);
            return (
              <div key={s.name} className="surface-card rise-in p-6" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold">{s.name}</h2>
                    <p className="text-xs text-muted-foreground">Focus: {s.focus}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-teal/10 px-2.5 py-1 text-[11px] font-semibold text-teal">
                    <TrendingUp className="size-3.5" /> {s.projects} projects
                  </span>
                </div>

                <div className="mt-5 flex items-end justify-between text-sm">
                  <span className="font-mono text-xs text-muted-foreground">
                    ₹ {s.released} L released of ₹ {s.pledged} L
                  </span>
                  <span className="font-bold text-navy">{pct}%</span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-saffron to-teal transition-all duration-1000"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    toast.success("Pledge intent recorded", {
                      description: `${s.name} — state CSR cell will share the sponsorship dossier.`,
                    })
                  }
                  className="mt-5 w-full rounded-lg border border-navy/15 bg-navy px-4 py-2.5 text-xs font-semibold text-navy-foreground transition-all hover:bg-teal"
                >
                  Pledge to a district challenge
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
