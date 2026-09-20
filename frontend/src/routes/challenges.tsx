import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { 
  Filter, 
  RotateCcw, 
  Search, 
  SlidersHorizontal,
  MapPin,
  Sparkles
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { ChallengeCard } from "@/components/challenge-card";
import { CHALLENGES, DISTRICTS, DOMAINS } from "@/lib/jharsetu-data";

// Define search parameters schema
const searchSchema = z.object({
  district: z.string().optional(),
  domain: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/challenges")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Challenge Bank — JharSetu Innovation Portal" },
      {
        name: "description",
        content: "Verified societal engineering challenges across Jharkhand's 24 districts ready for NEP 2020 Capstone adoption.",
      },
    ],
  }),
  component: ChallengesPage,
});

function ChallengesPage() {
  const searchParams = Route.useSearch();
  const navigate = Route.useNavigate();

  const [selectedDistrict, setSelectedDistrict] = useState<string>(searchParams.district || "All");
  const [selectedDomain, setSelectedDomain] = useState<string>(searchParams.domain || "All");
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.q || "");

  // Filter challenges dynamically
  const filtered = useMemo(() => {
    return CHALLENGES.filter((c) => {
      const matchDistrict = selectedDistrict === "All" || c.district.toLowerCase() === selectedDistrict.toLowerCase();
      const matchDomain = selectedDomain === "All" || c.domain.toLowerCase() === selectedDomain.toLowerCase();
      const matchQuery =
        !searchTerm.trim() ||
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase());

      return matchDistrict && matchDomain && matchQuery;
    });
  }, [selectedDistrict, selectedDomain, searchTerm]);

  const handleResetFilters = () => {
    setSelectedDistrict("All");
    setSelectedDomain("All");
    setSearchTerm("");
    navigate({ search: {} });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-5 py-10">
        {/* Page Header Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold tracking-tight">
                Live Challenge Bank
              </h1>
              <span className="rounded-full bg-teal/10 px-3 py-1 font-mono text-xs font-bold text-teal">
                {filtered.length} Active Challenges
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Applied societal R&D challenges formulated from citizen field reports across Jharkhand.
            </p>
          </div>

          {(selectedDistrict !== "All" || selectedDomain !== "All" || searchTerm) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-semibold hover:bg-secondary/80 transition-colors"
            >
              <RotateCcw className="size-3.5 text-saffron" /> Clear Filter Defaults
            </button>
          )}
        </div>

        {/* Filters Bar */}
        <div className="mt-6 grid gap-3 sm:grid-cols-12">
          {/* Keyword Search */}
          <div className="relative sm:col-span-6">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, keyword, or village name..."
              className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-xs outline-none focus:border-teal"
            />
          </div>

          {/* District Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                navigate({
                  search: (prev) => ({ ...prev, district: e.target.value === "All" ? undefined : e.target.value }),
                });
              }}
              className="h-10 w-full rounded-lg border border-border bg-card px-3 text-xs outline-none focus:border-teal font-medium"
            >
              <option value="All">All 24 Districts</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Domain Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedDomain}
              onChange={(e) => {
                setSelectedDomain(e.target.value);
                navigate({
                  search: (prev) => ({ ...prev, domain: e.target.value === "All" ? undefined : e.target.value }),
                });
              }}
              className="h-10 w-full rounded-lg border border-border bg-card px-3 text-xs outline-none focus:border-teal font-medium"
            >
              <option value="All">All Domains</option>
              {DOMAINS.map((dom) => (
                <option key={dom} value={dom}>
                  {dom}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Banner Indicator */}
        {(selectedDistrict !== "All" || selectedDomain !== "All") && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-teal/30 bg-teal/5 px-3 py-2 text-xs text-teal">
            <MapPin className="size-3.5 text-saffron" />
            <span>
              Deep-linked filter active:{" "}
              <strong>{selectedDistrict !== "All" ? selectedDistrict : "All Districts"}</strong>
              {" • "}
              <strong>{selectedDomain !== "All" ? selectedDomain : "All Domains"}</strong>
            </span>
          </div>
        )}

        {/* Challenge Cards Grid */}
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {filtered.length > 0 ? (
            filtered.map((c, i) => (
              <ChallengeCard key={c.id} challenge={c} index={i} />
            ))
          ) : (
            <div className="col-span-2 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
              <SlidersHorizontal className="mx-auto size-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm font-semibold">No challenges match current filter criteria.</p>
              <p className="text-xs text-muted-foreground mt-1">Try resetting the district or domain selector above.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ChallengesPage;