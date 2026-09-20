import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type AppRole = "admin" | "hei";

async function rolesOf(supabase: any, userId: string): Promise<AppRole[]> {
  const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r: { role: AppRole }) => r.role);
}

/** Roles + profile of the signed-in staff member. */
export const getMyAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const roles = await rolesOf(context.supabase, context.userId);
    const { data: profile } = await context.supabase
      .from("profiles")
      .select("full_name, institute")
      .eq("id", context.userId)
      .maybeSingle();
    return { userId: context.userId, roles, profile: profile ?? null };
  });

/** First ever account bootstraps itself as State Admin; afterwards this is a no-op. */
export const claimBootstrapAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count, error } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true });
    if (error) throw new Error(error.message);
    if ((count ?? 0) > 0) return { granted: false as const };
    const { error: insErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (insErr) throw new Error(insErr.message);
    return { granted: true as const };
  });

/** Short-lived signed URL for a citizen evidence photo. Staff only. */
export const getEvidenceUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ path: z.string().min(1).max(300) }).parse(d))
  .handler(async ({ context, data }) => {
    const roles = await rolesOf(context.supabase, context.userId);
    if (roles.length === 0) throw new Error("Forbidden: staff access required");
    const { data: signed, error } = await context.supabase.storage
      .from("evidence")
      .createSignedUrl(data.path, 300);
    if (error) throw new Error(error.message);
    return { url: signed?.signedUrl ?? null, expiresInSeconds: 300 };
  });

/** Admin-only: list staff accounts and their roles. */
export const listStaff = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const roles = await rolesOf(context.supabase, context.userId);
    if (!roles.includes("admin")) throw new Error("Forbidden: admin only");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
    if (error) throw new Error(error.message);
    const { data: roleRows } = await supabaseAdmin.from("user_roles").select("user_id, role");
    const { data: profiles } = await supabaseAdmin.from("profiles").select("id, full_name, institute");
    return users.users.map((u) => ({
      id: u.id,
      email: u.email ?? "",
      full_name: profiles?.find((p) => p.id === u.id)?.full_name ?? null,
      institute: profiles?.find((p) => p.id === u.id)?.institute ?? null,
      roles: (roleRows ?? []).filter((r) => r.user_id === u.id).map((r) => r.role as AppRole),
    }));
  });

/** Admin-only: grant or revoke a workflow role. */
export const setStaffRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        userId: z.string().uuid(),
        role: z.enum(["admin", "hei"]),
        grant: z.boolean(),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const roles = await rolesOf(context.supabase, context.userId);
    if (!roles.includes("admin")) throw new Error("Forbidden: admin only");
    if (data.userId === context.userId && data.role === "admin" && !data.grant) {
      throw new Error("You cannot remove your own admin role");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.grant) {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: data.userId, role: data.role }, { onConflict: "user_id,role" });
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", data.userId)
        .eq("role", data.role);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });
