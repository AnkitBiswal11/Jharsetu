import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { claimBootstrapAdmin, getMyAccess, type AppRole } from "@/lib/staff.functions";
import type { SubmissionStatus } from "@/lib/submissions";

type StaffState = {
  session: Session | null;
  roles: AppRole[];
  fullName: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const StaffContext = createContext<StaffState>({
  session: null,
  roles: [],
  fullName: null,
  loading: true,
  refresh: async () => {},
});

/** Which role may move a report into a given status. */
export const STATUS_ROLE: Record<SubmissionStatus, AppRole | null> = {
  submitted: null,
  ai_structured: "admin",
  verified: "admin",
  adopted: "hei",
  in_progress: "hei",
  resolved: "admin",
};

export const ROLE_LABEL: Record<AppRole, string> = {
  admin: "State Admin",
  hei: "Institution (HEI) staff",
};

export function StaffProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [fullName, setFullName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAccess = useCallback(async (active: Session | null) => {
    if (!active) {
      setRoles([]);
      setFullName(null);
      setLoading(false);
      return;
    }
    try {
      await claimBootstrapAdmin();
      const access = await getMyAccess();
      setRoles(access.roles);
      setFullName(access.profile?.full_name ?? active.user.email ?? null);
    } catch {
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, next) => {
      setSession(next);
      void loadAccess(next);
    });
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      void loadAccess(data.session);
    });
    return () => sub.subscription.unsubscribe();
  }, [loadAccess]);

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    await loadAccess(data.session);
  }, [loadAccess]);

  return (
    <StaffContext.Provider value={{ session, roles, fullName, loading, refresh }}>
      {children}
    </StaffContext.Provider>
  );
}

export const useStaff = () => useContext(StaffContext);

export function canSetStatus(roles: AppRole[], status: SubmissionStatus) {
  const required = STATUS_ROLE[status];
  return !!required && roles.includes(required);
}
