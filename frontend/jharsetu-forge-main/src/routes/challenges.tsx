import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { ChallengeCard } from "@/components/challenge-card";
import { CHALLENGES, DISTRICTS, DOMAINS } from "@/lib/jharsetu-data";

export const Route = createFileRoute("/challenges")({
  head: () => ({
    meta: [
      { title: "Academic Challenge Bank — JharSetu Jharkhand" },
      {
        name: "description",
        content:
          "Explore AI-structured rural research challenges from 24 Jharkhand districts and adopt them as NEP 2020 capstone projects.",
      },
      { property: "og:title", content: "Academic Challenge Bank — JharSetu" },
      {
        property: "og:description",
        content:
          "District and domain filtered R&D challenge bank for Jharkhand higher education institutions.",
      },
    ],
  }),
  component: ChallengesPage,
});

function ChallengesPage() {
  const [district, setDistrict] = useState("All");
  const [domain, setDomain] = useState<string>("All");
  const [query, setQuery] = useState("");

  const results = useMemo(
    () =>
      CHALLENGES.filter(
        (c) =>
          (district === "All" || c.district === district) &&
          (domain === "All" || c.domain === domain) &&
          (query.trim() === "" ||
            (c.title + c.summary + c.id).toLowerCase().includes(query.toLowerCase())),
      ),
    [district, domain, query],
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-5 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">Academic Challenge Bank</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Field grievances, restructured into research-grade problem statements with
              feasibility scoring and suggested deliverables.
            </p>
          </div>
          <span className="rounded-full border border-teal/30 bg-teal/10 px-3 py-1.5 text-xs font-semibold text-teal">
            {results.length} of {CHALLENGES.length} challenges
          </span>
        </div>

        <div className="surface-card mt-6 flex flex-wrap items-center gap-3 p-4 hover:translate-y-0">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <SlidersHorizontal className="size-4" /> Filters
          </span>
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search challenges or ID…"
              className="h-10 w-full rounded-lg border border-input bg-background pr-3 pl-9 text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal/25"
            />
          </div>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal/25"
          >
            <option value="All">All districts</option>
            {DISTRICTS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal/25"
          >
            <option value="All">All domains</option>
            {DOMAINS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>

        {results.length === 0 ? (
          <p className="mt-16 text-center text-sm text-muted-foreground">
            No challenges match these filters yet.
          </p>
        ) : (
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {results.map((c, i) => (
              <ChallengeCard key={c.id} challenge={c} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
