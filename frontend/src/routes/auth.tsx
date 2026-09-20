import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Landmark, Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { SiteHeader } from "@/components/site-header";
import { ROLE_LABEL, useStaff } from "@/lib/use-staff";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Staff Sign-in — JharSetu Jharkhand" },
      {
        name: "description",
        content:
          "Secure sign-in for State Admin and institution (HEI) staff who manage JharSetu grievance-to-capstone workflow actions.",
      },
      { property: "og:title", content: "Staff Sign-in — JharSetu" },
      {
        property: "og:description",
        content: "Authorized State Admin and HEI staff sign in to update report statuses.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session, roles, loading } = useStaff();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [institute, setInstitute] = useState("");
  const [busy, setBusy] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  useEffect(() => {
    if (session && !loading) void navigate({ to: "/admin", replace: true });
  }, [session, loading, navigate]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/auth" },
        });
        if (error) throw error;
        if (data.session) {
          await supabase.from("profiles").upsert({
            id: data.session.user.id,
            full_name: fullName || email,
            institute: institute || null,
          });
          toast.success("Account created");
        } else {
          setCheckEmail(true);
        }
      }
    } catch (err) {
      toast.error(mode === "signin" ? "Sign-in failed" : "Sign-up failed", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    try {
      await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    } catch (err) {
      toast.error("Google sign-in failed", {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex max-w-lg flex-col px-5 py-14">
        <div className="surface-card rise-in p-7 hover:translate-y-0">
          <span className="grid size-11 place-items-center rounded-xl bg-navy/10">
            <Landmark className="size-5 text-navy" />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold">Staff sign-in</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Only authorized State Admin and institution staff can update report statuses. Citizens
            can file reports without an account.
          </p>

          {checkEmail ? (
            <p className="mt-6 rounded-xl bg-teal/10 p-4 text-sm text-teal">
              Check your inbox and click the confirmation link to activate this staff account.
            </p>
          ) : (
            <>
              <form onSubmit={submit} className="mt-6 space-y-4">
                {mode === "signup" && (
                  <>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold">Full name</span>
                      <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-teal"
                        placeholder="Dr. A. Mahto"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold">
                        Institution / department (optional)
                      </span>
                      <input
                        value={institute}
                        onChange={(e) => setInstitute(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-teal"
                        placeholder="BIT Mesra"
                      />
                    </label>
                  </>
                )}
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold">Official email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-teal"
                    placeholder="you@dhte.jharkhand.gov.in"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold">Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-teal"
                    placeholder="At least 8 characters"
                  />
                </label>
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-4 py-3 text-sm font-bold text-navy-foreground transition-colors hover:bg-teal disabled:opacity-60"
                >
                  {busy && <Loader2 className="size-4 animate-spin" />}
                  {mode === "signin" ? "Sign in" : "Create staff account"}
                </button>
              </form>

              <button
                type="button"
                onClick={() => void google()}
                className="mt-3 w-full rounded-lg border border-border px-4 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
              >
                Continue with Google
              </button>

              <button
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-teal"
              >
                {mode === "signin"
                  ? "New staff member? Create an account"
                  : "Already registered? Sign in"}
              </button>
            </>
          )}

          <p className="mt-6 flex items-start gap-2 border-t border-border pt-4 text-[11px] text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-teal" />
            New accounts start with no workflow permissions. A State Admin grants{" "}
            {ROLE_LABEL.admin} or {ROLE_LABEL.hei} access from the admin console. The very first
            account created on this portal becomes the State Admin.
          </p>
          {session && roles.length === 0 && !loading && (
            <p className="mt-3 text-[11px] text-saffron">
              You are signed in but have no workflow role yet — ask a State Admin to grant access.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
