import { supabase } from "../lib/supabase";
import { Opportunity } from "../types";
import { cancelReminder, scheduleDeadlineReminder } from "./notifications";

export async function fetchSavedIds(uid: string): Promise<Set<string>> {
  const { data } = await supabase
    .from("saved_opportunities")
    .select("opportunity_id")
    .eq("user_id", uid);
  const ids: string[] = (data ?? []).map((r: any) => String(r.opportunity_id));
  return new Set<string>(ids);
}

export async function fetchSaved(uid: string) {
  const { data, error } = await supabase
    .from("saved_opportunities")
    .select("opportunity:opportunities(*)")
    .eq("user_id", uid);
  if (error) throw error;
  return (data ?? [])
    .map((r: any) => r.opportunity)
    .filter(Boolean) as Opportunity[];
}

export async function toggleSaved(
  uid: string,
  opp: Opportunity,
  isSaved: boolean,
) {
  if (isSaved) {
    await supabase
      .from("saved_opportunities")
      .delete()
      .eq("user_id", uid)
      .eq("opportunity_id", opp.id);
    await cancelReminder(opp.id);
  } else {
    await supabase
      .from("saved_opportunities")
      .insert({ user_id: uid, opportunity_id: opp.id });
    await scheduleDeadlineReminder(opp);
  }
}
