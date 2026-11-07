import { supabase } from "../lib/supabase";
import { Application, AppStatus, Profile } from "../types";

export type MyApplication = Application & {
  opportunities: {
    title: string;
    organization: string;
    deadline: string;
  } | null;
};

export type Applicant = Application & {
  profiles: Pick<
    Profile,
    | "full_name"
    | "institution"
    | "field_of_study"
    | "year_of_study"
    | "province"
  > | null;
};

export type ReportRow = {
  id: string;
  opportunity_id: string;
  reason: string;
  created_at: string;
  opportunities: { title: string; organization: string } | null;
};

export const STATUS_LABEL: Record<AppStatus, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  accepted: "Accepted",
  not_selected: "Not selected",
};

export async function applyToOpportunity(
  opportunityId: string,
  studentId: string,
  note: string,
  contact: string,
) {
  const { error } = await supabase.from("applications").insert({
    opportunity_id: opportunityId,
    student_id: studentId,
    note: note.trim() || null,
    contact: contact.trim() || null,
  });
  if (error) {
    if (error.code === "23505")
      throw new Error("You have already applied to this opportunity.");
    throw error;
  }
}

export async function fetchMyApplicationFor(
  uid: string,
  opportunityId: string,
) {
  const { data } = await supabase
    .from("applications")
    .select("*")
    .eq("student_id", uid)
    .eq("opportunity_id", opportunityId)
    .maybeSingle();
  return (data as Application | null) ?? null;
}

export async function fetchMyApplications(uid: string) {
  const { data, error } = await supabase
    .from("applications")
    .select("*, opportunities(title, organization, deadline)")
    .eq("student_id", uid)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as MyApplication[];
}

export async function withdrawApplication(id: string) {
  const { error } = await supabase.from("applications").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchApplicants(opportunityId: string) {
  const { data, error } = await supabase
    .from("applications")
    .select(
      "*, profiles(full_name, institution, field_of_study, year_of_study, province)",
    )
    .eq("opportunity_id", opportunityId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Applicant[];
}

export async function setApplicationStatus(id: string, status: AppStatus) {
  const { error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

export async function reportListing(opportunityId: string, reason: string) {
  const { error } = await supabase
    .from("reports")
    .insert({ opportunity_id: opportunityId, reason: reason.trim() });
  if (error) {
    if (error.code === "23505")
      throw new Error("You already reported this listing.");
    throw error;
  }
}

export async function fetchReports() {
  const { data, error } = await supabase
    .from("reports")
    .select("*, opportunities(title, organization)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as ReportRow[];
}

export async function dismissReport(id: string) {
  const { error } = await supabase.from("reports").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteMyAccount() {
  const { error } = await supabase.rpc("delete_my_account");
  if (error) throw error;
}
