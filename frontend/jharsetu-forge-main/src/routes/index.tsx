import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowRight, Sparkles, Send, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { MetricStrip } from "@/components/metric-strip";
import { ChallengeCard } from "@/components/challenge-card";
import { CHALLENGES, DISTRICTS, DOMAINS } from "@/lib/jharsetu-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JharSetu — Jharkhand Grassroots to Capstone Innovation Portal" },
      {
        name: "description",
        content:
          "JharSetu connects citizen challenges from 24 Jharkhand districts with university capstone teams and industry CSR funding, for the Dept. of Higher & Technical Education.",
      },
      { property: "og:title", content: "JharSetu — Jharkhand Innovation Portal" },
      {
        property: "og:description",
        content:
          "Report a community challenge, watch it become a funded NEP 2020 capstone project at a Jharkhand institution.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [domains, setDomains] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggle = (d: string) =>
    setDomains((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = { ...Object.fromEntries(new FormData(e.currentTarget)), domains };
    // API call point: POST /api/submissions with `payload`
    void payload;
    setSubmitted(true);
    toast.success("Challenge received", {
      description: "AI structuring in progress — you will get an SMS with your tracking ID.",
    });
  };

  const field =
    "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/25";

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="grid-canvas relative overflow-hidden bg-navy-deep text-navy-foreground">
        <div className="absolute -top-32 -right-24 size-[420px] rounded-full bg-teal/25 blur-[120px]" />
        <div className="absolute -bottom-40 -left-20 size-[380px] rounded-full bg-saffron/15 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-5 py-20">
          <span className="rise-in inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/75">
            <Sparkles className="size-3.5 text-saffron" /> Quad-Helix: Citizens · Academia ·
            Industry · Government
          </span>
          <h1 className="rise-in mt-6 max-w-3xl text-4xl leading-[1.08] font-extrabold sm:text-6xl">
            A village problem in Khunti becomes{" "}
            <span className="text-saffron">a funded research project</span> in Mesra.
          </h1>
          <p className="rise-in mt-5 max-w-2xl text-base text-white/70">
            JharSetu structures grassroots grievances from all 24 districts into research-grade
            challenge statements, routes them to student capstone teams for NEP 2020 credit, and
            matches them with verified industry CSR grants.
          </p>
          <div className="rise-in mt-8 flex flex-wrap gap-3">
            <a
              href="#report"
              className="inline-flex items-center gap-2 rounded-lg bg-saffron px-5 py-3 text-sm font-semibold text-navy-deep transition-transform hover:-translate-y-0.5"
            >
              Report a community challenge <ArrowRight className="size-4" />
            </a>
            <Link
              to="/challenges"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Browse the challenge bank
            </Link>
          </div>
        </div>
      </section>

      <div className="-mt-10">
        <MetricStrip />
      </div>

      <main className="mx-auto max-w-7xl px-5 py-14">
        <div className="grid gap-6 lg:grid-cols-12">
          <section id="report" className="surface-card scroll-mt-32 p-7 hover:translate-y-0 lg:col-span-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-extrabold">Report Community Challenge</h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-2.5 py-1 text-[11px] font-semibold text-teal">
                <span className="pulse-dot" /> Instant AI formulation
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Any citizen, panchayat member or field worker can file. No login required.
            </p>

            {submitted ? (
              <div className="mt-8 rounded-xl border border-teal/30 bg-teal/8 p-6 text-center">
                <CheckCircle2 className="mx-auto size-9 text-teal" />
                <p className="mt-3 font-bold">Submission logged</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  Tracking ID: JS-26043-{Math.floor(1000 + Math.random() * 8999)}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Our triage engine is drafting the academic problem statement. You will be
                  notified by SMS when an institution adopts it.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setDomains([]);
                  }}
                  className="mt-5 rounded-lg border border-border px-4 py-2 text-xs font-semibold transition-colors hover:bg-secondary"
                >
                  File another challenge
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-xs font-semibold">
                    Citizen name
                  </label>
                  <input id="name" name="name" required placeholder="e.g. Sunita Devi" className={field} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="district" className="mb-1.5 block text-xs font-semibold">
                      District
                    </label>
                    <select id="district" name="district" required defaultValue="" className={field}>
                      <option value="" disabled>
                        Select district
                      </option>
                      {DISTRICTS.map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="block" className="mb-1.5 block text-xs font-semibold">
                      Block / village
                    </label>
                    <input id="block" name="block" placeholder="e.g. Torpa" className={field} />
                  </div>
                </div>

                <div>
                  <label htmlFor="title" className="mb-1.5 block text-xs font-semibold">
                    Issue title
                  </label>
                  <input
                    id="title"
                    name="title"
                    required
                    placeholder="e.g. Hand pumps run dry by February"
                    className={field}
                  />
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold">Problem domain</p>
                  <div className="flex flex-wrap gap-2">
                    {DOMAINS.map((d) => {
                      const on = domains.includes(d);
                      return (
                        <button
                          type="button"
                          key={d}
                          onClick={() => toggle(d)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                            on
                              ? "border-teal bg-teal text-white shadow-[0_8px_20px_-12px_rgba(13,148,136,0.9)]"
                              : "border-border text-muted-foreground hover:border-teal/50 hover:text-foreground"
                          }`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="mb-1.5 block text-xs font-semibold">
                    Detailed field description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={5}
                    placeholder="Describe what happens, since when, how many households are affected…"
                    className="w-full rounded-lg border border-input bg-background p-3 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/25"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy py-3 text-sm font-semibold text-navy-foreground transition-all hover:bg-teal hover:shadow-[0_14px_30px_-16px_rgba(13,148,136,1)]"
                >
                  <Send className="size-4" /> Submit for AI structuring
                </button>
              </form>
            )}
          </section>

          <section className="lg:col-span-7">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-extrabold">Live Challenge Bank</h2>
              <Link
                to="/challenges"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal hover:underline"
              >
                View all with filters <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <div className="mt-4 grid gap-5">
              {CHALLENGES.slice(0, 3).map((c, i) => (
                <ChallengeCard key={c.id} challenge={c} index={i} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-navy-deep py-10 text-navy-foreground">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 text-xs text-white/55">
          <span>JharSetu · Department of Higher &amp; Technical Education, Government of Jharkhand</span>
          <span className="font-mono">Smart India Hackathon 2026 · PS ID 26043</span>
        </div>
      </footer>
    </div>
  );
}
