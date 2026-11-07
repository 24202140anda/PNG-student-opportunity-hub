import { today } from "../lib/dates";
import { supabase } from "../lib/supabase";
import { Opportunity } from "../types";

export type Filters = { search?: string; category?: string; province?: string };
export type OppInput = Omit<
  Opportunity,
  "id" | "created_at" | "status" | "owner_id"
>;

export async function fetchOpportunities(f: Filters) {
  let q = supabase
    .from("opportunities")
    .select("*")
    .eq("status", "approved")
    .gte("deadline", today())
    .order("deadline", { ascending: true });

  if (f.category) q = q.eq("category", f.category);

  const p = (f.province ?? "").replace(/[%,()]/g, " ").trim();
  if (p) {
    q = q.or(
      `province.ilike.%${p}%,province.eq.Nationwide,province.eq.International`,
    );
  }

  if (f.search) {
    const t = f.search.replace(/[%,()]/g, " ").trim();
    if (t) q = q.or(`title.ilike.%${t}%,organization.ilike.%${t}%`);
  }

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Opportunity[];
}

export async function fetchOne(id: string) {
  const { data, error } = await supabase
    .from("opportunities")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Opportunity;
}

export async function fetchMine(uid: string) {
  const { data, error } = await supabase
    .from("opportunities")
    .select("*, saved_opportunities(count)")
    .eq("owner_id", uid)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as any[];
}

export async function fetchPending() {
  const { data, error } = await supabase
    .from("opportunities")
    .select("*")
    .eq("status", "pending")
    .order("created_at");
  if (error) throw error;
  return (data ?? []) as Opportunity[];
}

export async function fetchAll() {
  const { data, error } = await supabase
    .from("opportunities")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Opportunity[];
}

export async function createOpportunity(
  p: OppInput & {
    owner_id: string;
    status?: "pending" | "approved" | "rejected";
  },
) {
  const { error } = await supabase.from("opportunities").insert(p);
  if (error) throw error;
}

export async function updateOpportunity(id: string, p: OppInput) {
  const { error } = await supabase.from("opportunities").update(p).eq("id", id);
  if (error) throw error;
}

export async function deleteOpportunity(id: string) {
  const { error } = await supabase.from("opportunities").delete().eq("id", id);
  if (error) throw error;
}

export async function setStatus(id: string, status: "approved" | "rejected") {
  const { error } = await supabase
    .from("opportunities")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}
