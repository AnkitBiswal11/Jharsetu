import { useEffect, useRef, useState } from "react";
import { Users, Sparkles, GraduationCap, IndianRupee } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Metric = {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  sub: string;
  icon: LucideIcon;
  tone: string;
};

const METRICS: Metric[] = [
  {
    label: "Grassroots Issues Reported",
    value: 1284,
    sub: "Across 24 districts",
    icon: Users,
    tone: "text-cyan",
  },
  {
    label: "AI-Structured R&D Challenges",
    value: 842,
    sub: "Verified & de-duplicated",
    icon: Sparkles,
    tone: "text-teal",
  },
  {
    label: "Active Student Capstones",
    value: 315,
    sub: "BIT Mesra · NIT JSR · IIT ISM",
    icon: GraduationCap,
    tone: "text-domain-edu",
  },
  {
    label: "Committed Industry CSR",
    value: 4.85,
    decimals: 2,
    prefix: "₹ ",
    suffix: " Cr",
    sub: "Tata Steel · SAIL · Coal India",
    icon: IndianRupee,
    tone: "text-saffron",
  },
];

function useCountUp(target: number, decimals = 0) {
  const [value, setValue] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const duration = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function MetricCard({ metric, index }: { metric: Metric; index: number }) {
  const display = useCountUp(metric.value, metric.decimals ?? 0);
  const Icon = metric.icon;
  return (
    <div
      className="surface-card rise-in group p-5"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
        <Icon className={`size-4 shrink-0 ${metric.tone}`} />
      </div>
      <p className="mt-3 text-3xl font-extrabold tracking-tight tabular-nums">
        {metric.prefix}
        {display}
        {metric.suffix}
      </p>
      <p className="mt-1 text-[11px] text-muted-foreground">{metric.sub}</p>
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full w-2/3 rounded-full bg-teal transition-[width] duration-700 group-hover:w-full" />
      </div>
    </div>
  );
}

export function MetricStrip() {
  return (
    <section className="mx-auto grid max-w-7xl gap-4 px-5 sm:grid-cols-2 lg:grid-cols-4">
      {METRICS.map((m, i) => (
        <MetricCard key={m.label} metric={m} index={i} />
      ))}
    </section>
  );
}
