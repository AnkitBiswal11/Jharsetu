import { Link } from "@tanstack/react-router";
import { Landmark, Zap, GraduationCap } from "lucide-react";

const NAV = [
  { to: "/", label: "Citizen Intake" },
  { to: "/challenges", label: "University R&D Bank" },
  { to: "/csr", label: "Industry CSR Desk" },
  { to: "/admin", label: "State Admin" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-navy-deep/95 text-navy-foreground backdrop-blur-md">
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-5 py-1.5 text-[11px] tracking-wide text-white/60">
          <span>
            Government of Jharkhand • Department of Higher &amp; Technical Education
          </span>
          <span className="font-mono">SIH 2026 • PS ID: 26043</span>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-saffron/15 ring-1 ring-saffron/40">
            <Landmark className="size-5 text-saffron" />
          </span>
          <span>
            <span className="block text-lg leading-tight font-extrabold tracking-tight">
              JharSetu <span className="text-saffron">झार-सेतु</span>
            </span>
            <span className="block text-[11px] text-white/55">
              Grassroots challenges → Academic capstones → Industry CSR
            </span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1.5 text-[11px] font-medium text-cyan">
            <span className="pulse-dot" />
            AI Triage Active · ~380 ms
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] text-white/75">
            <GraduationCap className="size-3.5" /> NEP 2020 Credit Gateway
          </span>
        </div>
      </div>

      <nav className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap text-white/65 transition-colors hover:bg-white/10 hover:text-white"
              activeProps={{
                className: "bg-teal text-white hover:bg-teal shadow-[0_6px_18px_-8px_rgba(13,148,136,0.9)]",
              }}
            >
              {item.label}
            </Link>
          ))}
          <span className="ml-auto hidden items-center gap-1.5 self-center pr-2 text-[11px] text-white/45 sm:flex">
            <Zap className="size-3.5 text-saffron" /> 24 districts connected
          </span>
        </div>
      </nav>
    </header>
  );
}
