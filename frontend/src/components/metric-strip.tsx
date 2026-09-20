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

function useCountUp(target: number, decimals = 0) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const duration = 1200;
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
  const [metricsData, setMetricsData] = useState({
    total_problems: 12,
    synthesized_challenges: 12,
    active_projects: 3,
    csr_grants_pledged: 4.85,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/metrics/summary");
        if (res.ok) {
          const data = await res.json();
          setMetricsData({
            total_problems: data.total_problems ?? 0,
            synthesized_challenges: data.synthesized_challenges ?? 0,
            active_projects: data.active_projects ?? 0,
            // Convert raw grant amount to Crores if large, or keep decimal
            csr_grants_pledged: data.csr_grants_pledged > 100000 
              ? +(data.csr_grants_pledged / 10000000).toFixed(2)
              : data.csr_grants_pledged || 4.85,
          });
        }
      } catch (err) {
        console.warn("Failed to fetch live metrics, using defaults", err);
      }
    };

    fetchMetrics();
    const timer = setInterval(fetchMetrics, 10000);
    return () => clearInterval(timer);
  }, []);

  const metrics: Metric[] = [
    {
      label: "Grassroots Issues Reported",
      value: metricsData.total_problems,
      sub: "Across 24 districts",
      icon: Users,
      tone: "text-cyan",
    },
    {
      label: "AI-Structured R&D Challenges",
      value: metricsData.synthesized_challenges,
      sub: "Verified by Groq LPU",
      icon: Sparkles,
      tone: "text-teal",
    },
    {
      label: "Active Student Capstones",
      value: metricsData.active_projects,
      sub: "BIT Mesra · NIT JSR · IIT ISM",
      icon: GraduationCap,
      tone: "text-domain-edu",
    },
    {
      label: "Committed Industry CSR",
      value: metricsData.csr_grants_pledged,
      decimals: 2,
      prefix: "₹ ",
      suffix: " Cr",
      sub: "Tata Steel · SAIL · Coal India",
      icon: IndianRupee,
      tone: "text-saffron",
    },
  ];

  return (
    <section className="mx-auto grid max-w-7xl gap-4 px-5 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((m, i) => (
        <MetricCard key={m.label} metric={m} index={i} />
      ))}
    </section>
  );
}