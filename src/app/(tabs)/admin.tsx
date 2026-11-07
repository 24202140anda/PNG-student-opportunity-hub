import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { confirmAction } from "../../lib/confirm";
import { COLORS } from "../../lib/constants";
import { supabase } from "../../lib/supabase";
import { ui } from "../../lib/ui";
import {
  deleteOpportunity,
  fetchAll,
  fetchPending,
  setStatus,
} from "../../services/opportunities";
import { Opportunity, Profile } from "../../types";

const statusColor = (s: string) =>
  s === "approved"
    ? COLORS.primary
    : s === "rejected"
      ? COLORS.danger
      : COLORS.warn;

export default function Admin() {
  const router = useRouter();
  const [pending, setPending] = useState<Opportunity[]>([]);
  const [all, setAll] = useState<Opportunity[]>([]);
  const [orgs, setOrgs] = useState<Profile[]>([]);

  const load = useCallback(async () => {
    setPending(await fetchPending().catch(() => []));
    setAll(await fetchAll().catch(() => []));
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "organization")
      .eq("verified", false);
    setOrgs((data ?? []) as Profile[]);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  async function verify(id: string) {
    await supabase.from("profiles").update({ verified: true }).eq("id", id);
    load();
  }

  async function review(id: string, status: "approved" | "rejected") {
    await setStatus(id, status);
    load();
  }

  return (
    <ScrollView style={ui.screen} contentContainerStyle={{ paddingBottom: 40 }}>
      <Pressable
        style={ui.btn}
        onPress={() => router.push("/opportunity/form" as any)}
      >
        <Text style={ui.btnText}>+ New opportunity</Text>
      </Pressable>

      <Text style={[ui.title, { marginTop: 16 }]}>Organizations to verify</Text>
      {orgs.length === 0 && <Text style={ui.muted}>None waiting.</Text>}
      {orgs.map((o) => (
        <View key={o.id} style={ui.box}>
          <Text style={ui.bold}>{o.organization_name}</Text>
          <Text style={ui.muted}>
            Contact: {o.full_name} | {o.province}
          </Text>
          <Pressable style={ui.btn} onPress={() => verify(o.id)}>
            <Text style={ui.btnText}>Verify</Text>
          </Pressable>
        </View>
      ))}

      <Text style={[ui.title, { marginTop: 16 }]}>Listings to review</Text>
      {pending.length === 0 && <Text style={ui.muted}>None waiting.</Text>}
      {pending.map((p) => (
        <View key={p.id} style={ui.box}>
          <Text style={ui.bold}>{p.title}</Text>
          <Text style={ui.muted}>
            {p.organization} | {p.category} | deadline {p.deadline}
          </Text>
          <Text style={ui.text}>{p.description}</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable
              style={[ui.btn, { flex: 1 }]}
              onPress={() => review(p.id, "approved")}
            >
              <Text style={ui.btnText}>Approve</Text>
            </Pressable>
            <Pressable
              style={[ui.btnGhost, { flex: 1, borderColor: COLORS.danger }]}
              onPress={() => review(p.id, "rejected")}
            >
              <Text style={[ui.ghostText, { color: COLORS.danger }]}>
                Reject
              </Text>
            </Pressable>
          </View>
        </View>
      ))}

      <Text style={[ui.title, { marginTop: 16 }]}>
        All listings ({all.length})
      </Text>
      {all.length === 0 && <Text style={ui.muted}>No listings yet.</Text>}
      {all.map((o) => (
        <View key={o.id} style={ui.box}>
          <Text style={ui.bold}>{o.title}</Text>
          <Text style={ui.muted}>
            {o.organization} | deadline {o.deadline}
          </Text>
          <Text
            style={{
              color: statusColor(o.status),
              fontWeight: "700",
              marginBottom: 6,
            }}
          >
            {o.status.toUpperCase()}
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable
              style={[ui.btnGhost, { flex: 1 }]}
              onPress={() =>
                router.push({
                  pathname: "/opportunity/form",
                  params: { id: o.id },
                } as any)
              }
            >
              <Text style={ui.ghostText}>Edit</Text>
            </Pressable>
            <Pressable
              style={[ui.btnGhost, { flex: 1, borderColor: COLORS.danger }]}
              onPress={() =>
                confirmAction("Delete this listing?", async () => {
                  await deleteOpportunity(o.id);
                  load();
                })
              }
            >
              <Text style={[ui.ghostText, { color: COLORS.danger }]}>
                Delete
              </Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
