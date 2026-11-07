import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { confirmAction } from "../../lib/confirm";
import { COLORS } from "../../lib/constants";
import { ui } from "../../lib/ui";
import { deleteOpportunity, fetchMine } from "../../services/opportunities";

export default function Manage() {
  const { session, profile } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!session) return;
    try {
      setItems(await fetchMine(session.user.id));
    } catch (e: any) {
      setError(e.message);
    }
  }, [session]);
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const verified = !!profile?.verified;
  const color = (s: string) =>
    s === "approved"
      ? COLORS.primary
      : s === "rejected"
        ? COLORS.danger
        : COLORS.warn;

  return (
    <View style={ui.screen}>
      {!verified && (
        <Text style={ui.error}>
          Your organization is waiting for admin verification. You can post
          listings once verified.
        </Text>
      )}
      <Pressable
        style={[ui.btn, !verified && { opacity: 0.4 }]}
        disabled={!verified}
        onPress={() => router.push("/opportunity/form" as any)}
      >
        <Text style={ui.btnText}>+ New opportunity</Text>
      </Pressable>
      {error ? <Text style={ui.error}>{error}</Text> : null}
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={
          <Text style={ui.muted}>You have not posted anything yet.</Text>
        }
        renderItem={({ item }) => (
          <View style={ui.box}>
            <Text style={ui.bold}>{item.title}</Text>
            <Text style={{ color: color(item.status), fontWeight: "700" }}>
              {item.status.toUpperCase()}
            </Text>
            <Text style={ui.muted}>
              Deadline {item.deadline} | Saved by{" "}
              {item.saved_opportunities?.[0]?.count ?? 0} students
            </Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                style={[ui.btnGhost, { flex: 1 }]}
                onPress={() =>
                  router.push({
                    pathname: "/opportunity/form",
                    params: { id: item.id },
                  } as any)
                }
              >
                <Text style={ui.ghostText}>Edit</Text>
              </Pressable>
              <Pressable
                style={[ui.btnGhost, { flex: 1, borderColor: COLORS.danger }]}
                onPress={() =>
                  confirmAction("Delete this listing?", async () => {
                    await deleteOpportunity(item.id);
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
        )}
      />
    </View>
  );
}
