import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { CHALLENGES } from "@/lib/jharsetu-data";
import { Activity, MapPin, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "State Admin Console — JharSetu Jharkhand" },
      {
        name: "description",
        content:
          "District-wise intake load, capstone pipeline status and citizen notification log for the Department of Higher & Technical Education.",
      },
      { property: "og:title", content: "State Admin Console — JharSetu" },
      {
        property: "og:description",
        content: "District intake load, capstone pipeline and citizen notification log.",
      },
    ],
  }),
  component: AdminPage,
});

const LOAD = [
  { district: "Ranchi", reports: 214 },
  { district: "Dhanbad", reports: 176 },
  { district: "East Singhbhum", reports: 148 },
  { district: "Palamu", reports: 121 },
  { district: "Gumla", reports: 98 },
  { district: "Khunti", reports: 84 },
];

const PIPELINE = [
  { stage: "Awaiting AI structuring", count: 46, tone: "bg-saffron" },
  { stage: "Verified in challenge bank", count: 842, tone: "bg-cyan" },
  { stage: "Adopted by HEI teams", count: 315, tone: "bg-teal" },
  { stage: "Prototype delivered & closed", count: 128, tone: "bg-navy" },
];

const LOG = [
  { to: "+91 •••• ••4471", district: "Palamu", text: "Your issue JS-26043-0117 is now an active research project at BIT Mesra." },
  { to: "+91 •••• ••8820", district: "Khunti", text: "Field visit scheduled 14 Oct by NIT Jamshedpur capstone team." },
  { to: "+91 •••• ••1093", district: "Gumla", text: "Prototype triage assistant deployed at your sub-centre." },
];

function AdminPage() {
  const max = Math.max(...LOAD.map((l) => l.reports));
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 py-10">
        <h1 className="text-3xl font-extrabold">State Admin Console</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Live oversight of intake load, capstone pipeline health and citizen feedback loops.
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <div className="surface-card rise-in p-6 lg:col-span-2">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <MapPin className="size-4 text-teal" /> District intake load
            </h2>
            <div className="mt-5 space-y-3.5">
              {LOAD.map((l) => (
                <div key={l.district} className="flex items-center gap-3">
                  <span className="w-36 shrink-0 text-xs font-medium">{l.district}</span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-navy to-cyan transition-all duration-1000"
                      style={{ width: `${(l.reports / max) * 100}%` }}
                    />
                  </div>
                  <span className="w-10 text-right font-mono text-xs text-muted-foreground">
                    {l.reports}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card rise-in p-6">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <Activity className="size-4 text-saffron" /> Pipeline status
            </h2>
            <ul className="mt-5 space-y-4">
              {PIPELINE.map((p) => (
                <li key={p.stage} className="flex items-center gap-3">
                  <span className={`size-2.5 rounded-full ${p.tone}`} />
                  <span className="flex-1 text-xs">{p.stage}</span>
                  <span className="font-mono text-sm font-bold">{p.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="surface-card rise-in mt-5 p-6 hover:translate-y-0">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <MessageSquare className="size-4 text-cyan" /> Citizen notification log (SMS / IVR mock)
          </h2>
          <div className="mt-4 divide-y divide-border">
            {LOG.map((l) => (
              <div key={l.to} className="flex flex-wrap items-center gap-3 py-3 text-sm">
                <span className="font-mono text-xs text-muted-foreground">{l.to}</span>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px]">{l.district}</span>
                <span className="flex-1 text-muted-foreground">{l.text}</span>
                <span className="rounded-full bg-teal/10 px-2 py-0.5 text-[11px] font-semibold text-teal">
                  Delivered
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 font-mono text-[11px] text-muted-foreground">
          {CHALLENGES.length} structured challenges loaded in this demo dataset.
        </p>
      </main>
    </div>
  );
}
