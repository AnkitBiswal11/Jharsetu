import { useEffect, useState } from "react";
import { toast } from "sonner";
import { KeyRound, Loader2 } from "lucide-react";
import { listStaff, setStaffRole, type AppRole } from "@/lib/staff.functions";
import { ROLE_LABEL } from "@/lib/use-staff";

type StaffRow = {
  id: string;
  email: string;
  full_name: string | null;
  institute: string | null;
  roles: AppRole[];
};

const ROLES: AppRole[] = ["admin", "hei"];

export function StaffAccessPanel() {
  const [rows, setRows] = useState<StaffRow[] | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  const load = () =>
    listStaff()
      .then((r) => setRows(r as StaffRow[]))
      .catch((e: unknown) => {
        setRows([]);
        toast.error("Could not load staff accounts", {
          description: e instanceof Error ? e.message : undefined,
        });
      });

  useEffect(() => {
    void load();
  }, []);

  const toggle = async (row: StaffRow, role: AppRole) => {
    const grant = !row.roles.includes(role);
    setPending(row.id + role);
    try {
      await setStaffRole({ data: { userId: row.id, role, grant } });
      await load();
      toast.success(`${grant ? "Granted" : "Removed"} ${ROLE_LABEL[role]} for ${row.email}`);
    } catch (e) {
      toast.error("Permission change failed", {
        description: e instanceof Error ? e.message : undefined,
      });
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="surface-card rise-in mt-5 p-6 hover:translate-y-0">
      <h2 className="flex items-center gap-2 text-sm font-bold">
        <KeyRound className="size-4 text-saffron" /> Staff access &amp; roles
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        State Admins mark reports AI structured, Verified and Resolved. Institution (HEI) staff mark
        them Adopted and Prototype in progress.
      </p>

      {rows === null ? (
        <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading accounts…
        </p>
      ) : rows.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No staff accounts yet.</p>
      ) : (
        <div className="mt-4 divide-y divide-border">
          {rows.map((row) => (
            <div key={row.id} className="flex flex-wrap items-center gap-3 py-3.5">
              <span className="min-w-[220px] flex-1">
                <span className="block text-sm font-semibold">{row.full_name ?? row.email}</span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {row.email}
                  {row.institute ? ` · ${row.institute}` : ""}
                </span>
              </span>
              {ROLES.map((role) => {
                const on = row.roles.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    disabled={pending === row.id + role}
                    onClick={() => void toggle(row, role)}
                    className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors disabled:opacity-50 ${
                      on
                        ? "bg-teal text-white hover:bg-destructive"
                        : "border border-border text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {on ? `✓ ${ROLE_LABEL[role]}` : `Grant ${ROLE_LABEL[role]}`}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
