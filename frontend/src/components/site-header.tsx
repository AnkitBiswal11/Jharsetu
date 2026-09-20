import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Landmark, Zap, GraduationCap, LogIn, LogOut, ShieldCheck, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ROLE_LABEL, useStaff } from "@/lib/use-staff";
import { useI18n } from "@/lib/i18n";
import { NepCreditModal } from "@/components/nep-credit-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type I18nLang = ReturnType<typeof useI18n>["lang"];

const LANGUAGES: { code: I18nLang; label: string; script: string }[] = [
  { code: "en" as I18nLang, label: "English", script: "EN" },
  { code: "hi" as I18nLang, label: "हिन्दी", script: "HI" },
  { code: "bn" as I18nLang, label: "বাংলা", script: "BN" },
  { code: "or" as I18nLang, label: "ଓଡ଼ିଆ", script: "OR" },
];

export function SiteHeader() {
  const { session, roles, fullName } = useStaff();
  const { lang, setLang, t } = useI18n();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isNepModalOpen, setIsNepModalOpen] = useState(false);

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  };

  const currentLang = LANGUAGES.find((l) => l.code === lang) ?? {
    code: "en" as I18nLang,
    label: "English",
    script: "EN",
  };

  const navItems = [
    { to: "/", label: t("nav.intake") },
    { to: "/challenges", label: t("nav.challenges") },
    { to: "/csr", label: t("nav.csr") },
    { to: "/map", label: "GIS Heatmap" },
    { to: "/admin", label: t("nav.admin") },
  ];

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

          {/* Interactive NEP 2020 Credit Gateway Trigger */}
          <button
            type="button"
            onClick={() => setIsNepModalOpen(true)}
            className="hidden cursor-pointer items-center gap-1.5 rounded-full border border-teal/40 bg-teal/10 px-3 py-1.5 text-[11px] font-semibold text-teal transition-all hover:bg-teal hover:text-white md:inline-flex"
          >
            <GraduationCap className="size-3.5" /> NEP 2020 Credit Gateway
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-white/85 transition-colors hover:bg-white/10"
              >
                <Globe className="size-3.5 text-teal" />
                <span>{currentLang.label}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              {LANGUAGES.map((l) => (
                <DropdownMenuItem
                  key={String(l.code)}
                  onClick={() => setLang(l.code)}
                  className={`flex items-center justify-between text-xs cursor-pointer ${
                    lang === l.code ? "font-bold text-teal" : ""
                  }`}
                >
                  <span>{l.label}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {l.script}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {session ? (
            <div className="flex items-center gap-2">
              <span className="hidden max-w-55 flex-col rounded-full border border-teal/40 bg-teal/10 px-3 py-1.5 text-[11px] leading-tight text-white/85 sm:flex">
                <span className="truncate font-semibold">{fullName ?? session.user.email}</span>
                <span className="inline-flex items-center gap-1 text-white/60">
                  <ShieldCheck className="size-3 text-teal" />
                  {roles.length ? roles.map((r) => ROLE_LABEL[r]).join(" · ") : "No workflow role yet"}
                </span>
              </span>
              <button
                type="button"
                onClick={() => void signOut()}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-white/80 transition-colors hover:bg-white/15"
              >
                <LogOut className="size-3.5" /> Sign out
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="inline-flex items-center gap-1.5 rounded-full bg-saffron px-3.5 py-1.5 text-[11px] font-bold text-navy-deep transition-transform hover:-translate-y-0.5"
            >
              <LogIn className="size-3.5" /> Staff sign-in
            </Link>
          )}
        </div>
      </div>

      <nav className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to as any}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap text-white/65 transition-colors hover:bg-white/10 hover:text-white"
              activeProps={{
                className: "bg-teal text-white hover:bg-teal shadow-[0_6px_18px_-8px_rgba(13,148,136,0.9)] font-semibold",
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

      {/* NEP 2020 DigiLocker / ABC Verification Modal */}
      <NepCreditModal
        isOpen={isNepModalOpen}
        onClose={() => setIsNepModalOpen(false)}
      />
    </header>
  );
}

export default SiteHeader;