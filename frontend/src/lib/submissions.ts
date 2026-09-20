import { supabase } from "@/integrations/supabase/client";

export const STATUSES = [
  "submitted",
  "ai_structured",
  "verified",
  "adopted",
  "in_progress",
  "resolved",
] as const;

export type SubmissionStatus = (typeof STATUSES)[number];

export type Submission = {
  id: string;
  tracking_id: string;
  citizen_name: string;
  district: string;
  block: string | null;
  title: string;
  description: string;
  domains: string[];
  photo_path: string | null;
  status: SubmissionStatus;
  institute: string | null;
  csr_sponsor: string | null;
  feasibility: number | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
};

export type SubmissionEvent = {
  id: string;
  submission_id: string;
  status: SubmissionStatus;
  actor: string;
  note: string | null;
  created_at: string;
};

export const STATUS_META: Record<
  SubmissionStatus,
  { label: string; owner: string; tone: string; dot: string }
> = {
  submitted: {
    label: "Submitted",
    owner: "Citizen",
    tone: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
  },
  ai_structured: {
    label: "AI structured",
    owner: "Triage engine",
    tone: "bg-saffron/15 text-saffron",
    dot: "bg-saffron",
  },
  verified: {
    label: "Verified in bank",
    owner: "State admin",
    tone: "bg-cyan/15 text-cyan",
    dot: "bg-cyan",
  },
  adopted: {
    label: "Adopted by HEI",
    owner: "Institution",
    tone: "bg-teal/15 text-teal",
    dot: "bg-teal",
  },
  in_progress: {
    label: "Prototype in progress",
    owner: "Capstone team",
    tone: "bg-navy/10 text-navy",
    dot: "bg-navy",
  },
  resolved: {
    label: "Resolved & closed",
    owner: "State admin",
    tone: "bg-teal text-white",
    dot: "bg-teal",
  },
};

export const nextStatus = (s: SubmissionStatus): SubmissionStatus | null => {
  const i = STATUSES.indexOf(s);
  return i < 0 || i === STATUSES.length - 1 ? null : (STATUSES[i + 1] as SubmissionStatus);
};

export const formatWhen = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export async function listSubmissions(): Promise<Submission[]> {
  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Submission[];
}

export async function listEvents(submissionId: string): Promise<SubmissionEvent[]> {
  const { data, error } = await supabase
    .from("submission_events")
    .select("*")
    .eq("submission_id", submissionId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as SubmissionEvent[];
}

export async function uploadEvidence(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("evidence").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;
  return path;
}

// Evidence files are private: signed URLs are issued server-side, staff only.
// See getEvidenceUrl in src/lib/staff.functions.ts.

export async function createSubmission(input: {
  citizen_name: string;
  district: string;
  block?: string | null;
  title: string;
  description: string;
  domains: string[];
  photo_path?: string | null;
}): Promise<Submission> {
  const { data, error } = await supabase
    .from("submissions")
    .insert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data as Submission;
}

export async function advanceSubmission(
  submission: Submission,
  status: SubmissionStatus,
  actor: string,
  note: string,
): Promise<void> {
  const { error } = await supabase
    .from("submissions")
    .update({ status })
    .eq("id", submission.id);
  if (error) throw error;
  const { error: evErr } = await supabase
    .from("submission_events")
    .insert({ submission_id: submission.id, status, actor, note });
  if (evErr) throw evErr;
}
