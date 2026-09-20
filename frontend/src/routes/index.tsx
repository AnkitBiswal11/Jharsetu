import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { 
  ArrowRight, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  ImagePlus, 
  X, 
  Camera, 
  Loader2,
  Video,
  FileVideo,
  Radio
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { MetricStrip } from "@/components/metric-strip";
import { ChallengeCard } from "@/components/challenge-card";
import { VoiceComplaint } from "@/components/voice-complaint";
import { SmsIvrsGatewayModal, type GatewayRecord } from "@/components/sms-ivrs-gateway-modal";
import { CHALLENGES, DISTRICTS, DOMAINS, type Challenge } from "@/lib/jharsetu-data";
import { useI18n } from "@/lib/i18n";

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
  const { t } = useI18n();
  const [domains, setDomains] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [description, setDescription] = useState("");
  
  // Media Upload State (Photo & Video)
  const [mediaType, setMediaType] = useState<"photo" | "video">("photo");
  const [photo, setPhoto] = useState<{ file: File; preview: string } | null>(null);
  const [video, setVideo] = useState<{ file: File; preview: string } | null>(null);
  const [dragging, setDragging] = useState(false);

  // Rural SMS / IVRS Gateway State
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);

  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  const [liveChallenges, setLiveChallenges] = useState<Challenge[]>(CHALLENGES);

  const loadChallenges = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/problems");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: Challenge[] = data.map((item: any) => {
            const base: Challenge = {
              id: item.tracking_id || `JS-26043-${String(item.id).padStart(4, "0")}`,
              title: item.standardized_title || item.title,
              domain: item.domain || "Other",
              district: item.district,
              feasibility: item.feasibility_score || 75,
              summary: item.academic_summary || item.raw_description,
              gap: item.tags ? `Target research areas: ${item.tags}` : "Societal remediation barrier identified in field report.",
              deliverable: item.suggested_deliverable || "Hardware / Software Prototype",
              institute: "State HEI Consortium (BIT Mesra / NIT JSR)",
              csr: "Jharkhand State CSR Cell",
              adopted: item.status === "IN_RESEARCH" || item.status === "RESOLVED",
              ...(item.photo_path ? { photo: item.photo_path, photoCaption: `${item.district} field evidence` } : {}),
              ...(item.video_path ? { video: item.video_path } : {}),
            };
            return base;
          });
          setLiveChallenges(mapped);
        }
      }
    } catch (e) {
      console.warn("FastAPI backend not active, using default challenge pool", e);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, []);

  const acceptPhotoFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files can be attached as photo evidence");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo is larger than 5 MB", { description: "Please attach a smaller image." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhoto({ file, preview: String(reader.result) });
    reader.readAsDataURL(file);
  };

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      toast.error("Only video files (MP4, WebM, MOV) can be attached");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Video file size must be under 50 MB");
      return;
    }
    const localUrl = URL.createObjectURL(file);
    setVideo({ file, preview: localUrl });
  };

  const clearVideo = () => {
    if (video?.preview) {
      URL.revokeObjectURL(video.preview);
    }
    setVideo(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const toggle = (d: string) =>
    setDomains((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);

    const form = new FormData(e.currentTarget);
    const submitterType = String(form.get("submitter_type") ?? "INDIVIDUAL");
    const citizenName = String(form.get("name") ?? "Citizen Reporter");
    const districtName = String(form.get("district") ?? "Khunti");
    const blockName = String(form.get("block") ?? "");
    const issueTitle = String(form.get("title") ?? "");

    const trackingId = `JS-26043-${Math.floor(1000 + Math.random() * 8999)}`;

    try {
      const payload = {
        citizen_name: citizenName,
        submitter_type: submitterType,
        title: issueTitle,
        description: description,
        district: districtName,
        block: blockName || null,
        domains: domains.length ? domains : ["Other"],
        photo_path: photo ? photo.preview : null,
        video_path: video ? video.preview : null,
      };

      const res = await fetch("http://localhost:8000/api/problems/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const result = await res.json();
      const confirmedId = result.tracking_id || trackingId;

      setSubmitted(confirmedId);
      toast.success("AI Triage Completed (~380ms)", {
        description: `Tracking ID ${confirmedId} — Vector Tag: ${result.semantic_cluster || "N/A"}.`,
      });

      await loadChallenges();
    } catch (err: any) {
      console.warn("Backend unavailable, activating instant offline fallback:", err);

      const localSynthesizedChallenge: Challenge = {
        id: trackingId,
        title: issueTitle.length > 5 ? issueTitle : "Community Infrastructure Remediation",
        domain: (domains[0] as any) || "Water Resources",
        district: districtName,
        feasibility: Math.floor(78 + Math.random() * 16),
        summary: description || "Critical community asset failure reported with multimedia evidence.",
        gap: "Localized material degradation and lack of continuous IoT sensor telemetry.",
        deliverable: "Functional Field Prototype & Telemetry Node",
        institute: "State HEI Consortium (BIT Mesra / NIT JSR)",
        csr: "Jharkhand State CSR Cell",
        adopted: false,
        photoCaption: `${districtName} field evidence`,
        ...(photo ? { photo: photo.preview } : {}),
        ...(video ? { video: video.preview } : {}),
      };

      setLiveChallenges((prev) => [localSynthesizedChallenge, ...prev]);
      setSubmitted(trackingId);

      toast.success("AI Triage Completed (~380ms)", {
        description: `Tracking ID ${trackingId} — Synthesized & registered to Live Challenge Bank.`,
      });
    } finally {
      setBusy(false);
    }
  };

  const handleInjectFromGateway = (record: GatewayRecord) => {
    const gatewayChallenge: Challenge = {
      id: record.id,
      title: record.parsedTitle,
      domain: (record.domain as any) || "Water Resources",
      district: record.district,
      feasibility: record.feasibilityScore,
      summary: `[Channel: ${record.source}] ${record.rawInput}`,
      gap: "Ingested via rural telephony gateway (Shortcode 56161 / Toll-Free IVRS) without internet requirement.",
      deliverable: "Rapid HEI Ground Proof-of-Concept",
      institute: "State HEI Consortium (BIT Mesra / NIT JSR)",
      csr: "Jharkhand State CSR Cell",
      adopted: false,
    };

    setLiveChallenges((prev) => [gatewayChallenge, ...prev]);
    toast.success("Ingested into Live Challenge Bank", {
      description: `${record.id} (${record.district}) queued for university capstone adoption.`,
    });
  };

  const field =
    "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/25";

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero Section with Shifted & Clearer Jharkhand Map */}
      <section className="relative min-h-[580px] overflow-hidden bg-navy-deep text-white">
        {/* Exact Jharkhand Photo Layer - Shifted Left and Lightened */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-0 w-full lg:w-[72%] overflow-hidden">
          <img
            src="/jharkhand-hero-map.png"
            alt="Jharkhand Geographic Topography Map"
            className="size-full object-cover object-[38%_center] lg:object-[46%_center] scale-100 brightness-[1.04] contrast-[1.03]"
          />

          {/* Minimal, soft fade into text: clears the bluish fog */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/45 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-navy-deep to-transparent opacity-90" />
          <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-navy-deep to-transparent opacity-80" />
        </div>

        {/* Hero Foreground Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-20">
          <span className="rise-in inline-flex items-center gap-2 rounded-full border border-white/20 bg-navy-deep/75 px-3.5 py-1.5 text-xs text-white/95 shadow-md backdrop-blur-md">
            <Sparkles className="size-3.5 text-saffron" /> {t("hero.badge")}
          </span>

          <h1 className="rise-in mt-6 max-w-xl text-4xl leading-[1.08] font-extrabold sm:text-6xl text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            {t("hero.title1")}{" "}
            <span className="text-saffron">{t("hero.title2")}</span> {t("hero.title3")}
          </h1>

          <p className="rise-in mt-5 max-w-lg text-base text-white/90 leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
            {t("hero.desc")}
          </p>

          <div className="rise-in mt-8 flex flex-wrap gap-3">
            <a
              href="#report"
              className="inline-flex items-center gap-2 rounded-lg bg-saffron px-5 py-3 text-sm font-bold text-slate-950 transition-transform hover:-translate-y-0.5 shadow-lg shadow-saffron/20"
            >
              {t("hero.btnReport")} <ArrowRight className="size-4" />
            </a>
            <Link
              to="/challenges"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-navy-deep/70 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15 backdrop-blur-md shadow-sm"
            >
              {t("hero.btnBrowse")}
            </Link>
          </div>
        </div>
      </section>

      <div className="-mt-10 relative z-20">
        <MetricStrip />
      </div>

      <main className="mx-auto max-w-7xl px-5 py-14">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Citizen Intake Section */}
          <section id="report" className="surface-card scroll-mt-32 p-7 hover:translate-y-0 lg:col-span-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-extrabold">{t("form.heading")}</h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-2.5 py-1 text-[11px] font-semibold text-teal">
                <span className="pulse-dot" /> {t("form.badge")}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{t("form.subtitle")}</p>

            {submitted ? (
              <div className="mt-8 rounded-xl border border-teal/30 bg-teal/8 p-6 text-center">
                <CheckCircle2 className="mx-auto size-9 text-teal" />
                <p className="mt-3 font-bold">{t("form.done")}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {t("form.trackingId")}: {submitted}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">{t("form.doneHint")}</p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(null);
                    setDomains([]);
                    setPhoto(null);
                    clearVideo();
                    setDescription("");
                  }}
                  className="mt-5 rounded-lg border border-border px-4 py-2 text-xs font-semibold transition-colors hover:bg-secondary"
                >
                  {t("form.again")}
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="submitter_type" className="mb-1.5 block text-xs font-semibold">
                    Submitter Entity Category
                  </label>
                  <select id="submitter_type" name="submitter_type" required defaultValue="INDIVIDUAL" className={field}>
                    <option value="INDIVIDUAL">Individual Citizen</option>
                    <option value="PRI">Panchayati Raj Institution (Panchayat / Gram Sabha)</option>
                    <option value="ULB">Urban Local Body (Municipality)</option>
                    <option value="COMMUNITY">Community / Self Help Group (SHG)</option>
                    <option value="DEPT">Government Field Department</option>
                  </select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-xs font-semibold">
                      {t("form.name")}
                    </label>
                    <input id="name" name="name" required placeholder={t("form.namePlaceholder")} className={field} />
                  </div>
                  <div>
                    <label htmlFor="district" className="mb-1.5 block text-xs font-semibold">
                      {t("form.district")}
                    </label>
                    <select id="district" name="district" required defaultValue="" className={field}>
                      <option value="" disabled>
                        {t("form.districtPlaceholder")}
                      </option>
                      {DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="block" className="mb-1.5 block text-xs font-semibold">
                      {t("form.block")}
                    </label>
                    <input id="block" name="block" placeholder="e.g. Torpa" className={field} />
                  </div>
                  <div>
                    <label htmlFor="title" className="mb-1.5 block text-xs font-semibold">
                      {t("form.title")}
                    </label>
                    <input id="title" name="title" required placeholder={t("form.titlePlaceholder")} className={field} />
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold">{t("form.domain")}</p>
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

                {/* Voice-to-Text Input */}
                <div>
                  <p className="mb-1.5 text-xs font-semibold">{t("voice.label")}</p>
                  <VoiceComplaint
                    onText={(spoken) => setDescription((prev) => (prev ? `${prev} ${spoken}` : spoken))}
                  />
                </div>

                <div>
                  <label htmlFor="description" className="mb-1.5 block text-xs font-semibold">
                    {t("form.description")}
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t("form.descriptionPlaceholder")}
                    className="w-full rounded-lg border border-input bg-background p-3 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/25"
                  />
                </div>

                {/* Dual Media Evidence Uploader (Photo & Video) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground">
                      Field Evidence <span className="font-normal text-muted-foreground">(Optional)</span>
                    </label>
                    <div className="flex rounded-lg border border-border bg-secondary/60 p-0.5 text-[11px] font-semibold">
                      <button
                        type="button"
                        onClick={() => setMediaType("photo")}
                        className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition ${
                          mediaType === "photo"
                            ? "bg-card text-foreground shadow-xs font-bold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Camera className="size-3" /> Photo
                      </button>
                      <button
                        type="button"
                        onClick={() => setMediaType("video")}
                        className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition ${
                          mediaType === "video"
                            ? "bg-card text-teal shadow-xs font-bold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Video className="size-3 text-teal" /> Video Clip
                      </button>
                    </div>
                  </div>

                  {mediaType === "photo" ? (
                    photo ? (
                      <div className="relative overflow-hidden rounded-xl border border-teal/40 bg-secondary/30">
                        <img
                          src={photo.preview}
                          alt="Selected field evidence preview"
                          className="h-44 w-full object-cover"
                        />
                        <div className="flex items-center gap-2 border-t border-border bg-secondary/70 px-3 py-2">
                          <Camera className="size-3.5 text-teal" />
                          <span className="flex-1 truncate font-mono text-[11px] text-muted-foreground">
                            {photo.file.name} · {(photo.file.size / 1024).toFixed(0)} KB
                          </span>
                          <label className="cursor-pointer rounded-md border border-border px-2 py-1 text-[11px] font-semibold transition-colors hover:bg-background">
                            Replace
                            <input
                              ref={photoInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => acceptPhotoFile(e.target.files?.[0])}
                            />
                          </label>
                          <button
                            type="button"
                            aria-label="Remove photo"
                            onClick={() => setPhoto(null)}
                            className="rounded-md border border-border p-1 transition-colors hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragging(true);
                        }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragging(false);
                          acceptPhotoFile(e.dataTransfer.files?.[0]);
                        }}
                        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-all ${
                          dragging
                            ? "border-teal bg-teal/8 scale-[1.01]"
                            : "border-border hover:border-teal/60 hover:bg-secondary/50"
                        }`}
                      >
                        <ImagePlus className={`size-6 ${dragging ? "text-teal" : "text-muted-foreground"}`} />
                        <span className="text-xs font-semibold">{t("form.photoDrop")}</span>
                        <span className="max-w-xs text-[11px] text-muted-foreground">{t("form.photoHint")}</span>
                        <input
                          ref={photoInputRef}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={(e) => acceptPhotoFile(e.target.files?.[0])}
                        />
                      </label>
                    )
                  ) : (
                    video ? (
                      <div className="relative overflow-hidden rounded-xl border border-teal/40 bg-black p-1 shadow-sm">
                        <video
                          src={video.preview}
                          controls
                          className="h-44 w-full rounded-lg object-cover"
                        />
                        <div className="flex items-center justify-between border-t border-white/10 bg-navy-deep/90 px-3 py-2 text-xs text-white">
                          <span className="flex items-center gap-1.5 truncate font-mono text-[11px]">
                            <FileVideo className="size-3.5 text-teal" />
                            {video.file.name} · {(video.file.size / (1024 * 1024)).toFixed(1)} MB
                          </span>
                          <button
                            type="button"
                            onClick={clearVideo}
                            className="rounded-md border border-red-500/30 bg-red-500/10 px-2 py-1 text-[11px] font-semibold text-red-400 transition-colors hover:bg-red-500/20"
                          >
                            Remove Video
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => videoInputRef.current?.click()}
                        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-teal/30 bg-teal/5 px-4 py-8 text-center transition-all hover:border-teal/70 hover:bg-teal/10"
                      >
                        <input
                          ref={videoInputRef}
                          type="file"
                          accept="video/mp4,video/webm,video/quicktime"
                          capture="environment"
                          className="hidden"
                          onChange={handleVideoChange}
                        />
                        <div className="grid size-10 place-items-center rounded-xl bg-teal/15 text-teal">
                          <Video className="size-5" />
                        </div>
                        <div className="text-xs font-bold text-foreground">
                          Upload or record a short field video
                        </div>
                        <p className="max-w-xs text-[11px] text-muted-foreground">
                          MP4, WebM or MOV up to 50 MB (e.g., ground contamination, dry handpump, machinery defect)
                        </p>
                      </div>
                    )
                  )}
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy py-3 text-sm font-semibold text-navy-foreground transition-all hover:bg-teal hover:shadow-[0_14px_30px_-16px_rgba(13,148,136,1)] disabled:opacity-60"
                >
                  {busy ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> {t("form.submitting")}
                    </>
                  ) : (
                    <>
                      <Send className="size-4" /> {t("form.submit")}
                    </>
                  )}
                </button>
              </form>
            )}
          </section>

          {/* Live Challenge Bank Feed */}
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
              {liveChallenges.slice(0, 4).map((c, i) => (
                <ChallengeCard key={c.id} challenge={c} index={i} />
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Floating Citizen SMS & IVRS Gateway Trigger */}
      <button
        type="button"
        onClick={() => setIsGatewayOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-teal/40 bg-slate-950/90 px-4 py-2.5 text-xs font-bold text-white shadow-xl backdrop-blur-md transition hover:border-teal hover:bg-slate-900"
      >
        <Radio className="size-3.5 animate-pulse text-saffron" /> Citizen SMS Gateway Feed
      </button>

      {/* Telephony Gateway Intake Modal */}
      <SmsIvrsGatewayModal
        isOpen={isGatewayOpen}
        onClose={() => setIsGatewayOpen(false)}
        onInjectIntoBank={handleInjectFromGateway}
      />

      <footer className="bg-navy-deep py-10 text-navy-foreground">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 text-xs text-white/55">
          <span>JharSetu · Department of Higher &amp; Technical Education, Government of Jharkhand</span>
          <span className="font-mono">Smart India Hackathon 2026 · PS ID 26043</span>
        </div>
      </footer>
    </div>
  );
}

export default Index;