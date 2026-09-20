import { useState } from "react";
import { 
  Play, 
  Video, 
  Sparkles, 
  CheckCircle2, 
  Eye, 
  Calendar, 
  Tag,
  ShieldCheck,
  Building2,
  GraduationCap,
  Users
} from "lucide-react";

export interface ShowcaseVideo {
  id: string;
  title: string;
  category: "CITIZEN_GRIEVANCE" | "UNIVERSITY_PROTOTYPE" | "CSR_IMPACT";
  district: string;
  submittedBy: string;
  date: string;
  duration: string;
  views: number;
  verified: boolean;
  thumbnailUrl: string;
  videoUrl: string;
  summary: string;
}

const SAMPLE_VIDEOS: ShowcaseVideo[] = [
  {
    id: "vid-1",
    title: "Solar IoT Micro-Grid Ground Deployment in Netarhat",
    category: "UNIVERSITY_PROTOTYPE",
    district: "Latehar",
    submittedBy: "BIT Mesra (Dept of EEE)",
    date: "12 Sep 2026",
    duration: "03:45",
    views: 1240,
    verified: true,
    thumbnailUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    summary: "Validation trial of battery storage telemetry deployed for 14 tribal households facing continuous low-voltage supply."
  },
  {
    id: "vid-2",
    title: "Groundwater Fluoride Contamination Field Report",
    category: "CITIZEN_GRIEVANCE",
    district: "Palamu",
    submittedBy: "Satbarwa Gram Panchayat",
    date: "04 Sep 2026",
    duration: "01:50",
    views: 890,
    verified: true,
    thumbnailUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    summary: "Direct voice-accompanied smartphone inspection showing borehole yield issues and chalky residue affecting local tube wells."
  },
  {
    id: "vid-3",
    title: "Tata Steel CSR Escrow: Automated Agro-Processing Unit",
    category: "CSR_IMPACT",
    district: "East Singhbhum",
    submittedBy: "Tata Steel Foundation",
    date: "28 Aug 2026",
    duration: "04:15",
    views: 2150,
    verified: true,
    thumbnailUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    summary: "End-to-end documentary on the dual-key release mechanism funding indigenous lac processing equipment."
  }
];

export function VideoShowcaseSection() {
  const [activeTab, setActiveTab] = useState<"ALL" | "CITIZEN_GRIEVANCE" | "UNIVERSITY_PROTOTYPE" | "CSR_IMPACT">("ALL");
  const [activeVideo, setActiveVideo] = useState<ShowcaseVideo | null>(SAMPLE_VIDEOS[0] ?? null);

  const filtered = activeTab === "ALL" 
    ? SAMPLE_VIDEOS 
    : SAMPLE_VIDEOS.filter((v) => v.category === activeTab);

  return (
    <section className="mt-12 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal">
            <Video className="size-4" /> Quad-Helix Visual Evidence Hub
          </div>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">
            Field Telemetry &amp; Prototype Video Demonstrations
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Audited video submissions connecting rural problems with live academic proof-of-concepts and corporate CSR audits.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-secondary/50 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "ALL" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Evidence
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("CITIZEN_GRIEVANCE")}
            className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "CITIZEN_GRIEVANCE" ? "bg-card text-teal shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="size-3.5" /> Citizen Field
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("UNIVERSITY_PROTOTYPE")}
            className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "UNIVERSITY_PROTOTYPE" ? "bg-card text-teal shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GraduationCap className="size-3.5" /> HEI Prototypes
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("CSR_IMPACT")}
            className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "CSR_IMPACT" ? "bg-card text-saffron shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Building2 className="size-3.5" /> CSR Audits
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Main Cinema Video Player */}
        <div className="lg:col-span-8">
          {activeVideo ? (
            <div className="overflow-hidden rounded-xl border border-border bg-black shadow-lg">
              <div className="relative aspect-video w-full bg-slate-950">
                <video
                  key={activeVideo.id}
                  controls
                  autoPlay={false}
                  poster={activeVideo.thumbnailUrl}
                  className="size-full object-cover"
                >
                  <source src={activeVideo.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Video Meta Info */}
              <div className="p-5 bg-card text-card-foreground">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-teal/10 px-2.5 py-0.5 text-xs font-bold text-teal border border-teal/25">
                      <Tag className="size-3" /> {activeVideo.district} District
                    </span>
                    {activeVideo.verified && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck className="size-4 text-emerald-500" /> Panchayat Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="size-3.5" /> {activeVideo.date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Eye className="size-3.5" /> {activeVideo.views.toLocaleString()} views
                    </span>
                  </div>
                </div>

                <h3 className="mt-2 text-xl font-bold text-foreground">
                  {activeVideo.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {activeVideo.summary}
                </p>

                <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                  <span>Logged Entity: <strong className="text-foreground">{activeVideo.submittedBy}</strong></span>
                  <span className="font-mono font-semibold text-saffron">NEP 2020 Audit Code: #DHTE-26043-{activeVideo.id}</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Video Playlist Selector */}
        <div className="flex flex-col gap-3 lg:col-span-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Available Records ({filtered.length})
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal">
              <Sparkles className="size-3" /> AI Keyframe Audited
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-135 pr-1">
            {filtered.map((item) => {
              const isCurrent = activeVideo?.id === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setActiveVideo(item)}
                  className={`w-full text-left rounded-xl border p-3 transition-all ${
                    isCurrent 
                      ? "border-teal bg-teal/5 shadow-xs" 
                      : "border-border bg-card hover:bg-secondary/40"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                      <img 
                        src={item.thumbnailUrl} 
                        alt={item.title} 
                        className="size-full object-cover" 
                      />
                      <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white">
                        {item.duration}
                      </span>
                      <div className="absolute inset-0 grid place-items-center bg-black/20 group-hover:bg-black/40">
                        <span className="grid size-6 place-items-center rounded-full bg-white/90 shadow">
                          <Play className="size-3 text-navy-deep fill-navy-deep ml-0.5" />
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between overflow-hidden">
                      <div>
                        <span className="inline-block text-[10px] font-bold uppercase text-teal">
                          {item.district}
                        </span>
                        <h4 className="line-clamp-2 text-xs font-bold leading-snug text-foreground">
                          {item.title}
                        </h4>
                      </div>
                      <span className="text-[10px] text-muted-foreground truncate">
                        {item.submittedBy}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}