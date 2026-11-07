import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Chips from "../../components/Chips";
import Icon from "../../components/Icon";
import OpportunityCard from "../../components/OpportunityCard";
import ReminderBanner from "../../components/ReminderBanner";
import { useAuth } from "../../context/AuthContext";
import { CATEGORIES, COLORS } from "../../lib/constants";
import { ui } from "../../lib/ui";
import { fetchOpportunities } from "../../services/opportunities";
import { fetchSavedIds, toggleSaved } from "../../services/saved";
import { Opportunity } from "../../types";

export default function Explore() {
  const { session } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Opportunity[]>([]);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [province, setProvince] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!session) return;
    try {
      setError("");
      const [list, ids] = await Promise.all([
        fetchOpportunities({ search, category, province }),
        fetchSavedIds(session.user.id),
      ]);
      setItems(list);
      setSaved(new Set<string>(ids));
    } catch (e: any) {
      setError(e.message ?? "Could not load opportunities.");
    } finally {
      setLoading(false);
    }
  }, [search, category, province, session]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  async function toggle(item: Opportunity) {
    if (!session) return;
    const isSaved = saved.has(item.id);
    const next = new Set(saved);
    if (isSaved) next.delete(item.id);
    else next.add(item.id);
    setSaved(next);
    await toggleSaved(session.user.id, item, isSaved);
  }

  if (!session) return null;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={s.hero}>
        <Text style={s.heroTitle}>Find your next opportunity</Text>
        <Text style={s.heroSub}>
          Scholarships, internships and jobs across Papua New Guinea
        </Text>

        <View style={s.box}>
          <Icon name="search" size={18} color={COLORS.muted} />
          <TextInput
            style={s.input}
            placeholder="Search title or organization"
            placeholderTextColor={COLORS.muted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <View style={s.box}>
          <Icon name="pin" size={18} color={COLORS.muted} />
          <TextInput
            style={s.input}
            placeholder="Province (e.g. Morobe)"
            placeholderTextColor={COLORS.muted}
            value={province}
            onChangeText={setProvince}
          />
        </View>
      </View>

      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <Chips
          options={CATEGORIES}
          value={category}
          onChange={setCategory}
          clearable
        />
        {error ? <Text style={ui.error}>{error}</Text> : null}
        {!loading && !error ? (
          <Text style={[ui.muted, { marginTop: 6 }]}>
            {items.length} open{" "}
            {items.length === 1 ? "opportunity" : "opportunities"}
          </Text>
        ) : null}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
          ListHeaderComponent={
            <ReminderBanner items={items.filter((i) => saved.has(i.id))} />
          }
          ListEmptyComponent={
            <Text style={ui.muted}>
              No open opportunities match your search.
            </Text>
          }
          renderItem={({ item }) => (
            <OpportunityCard
              item={item}
              saved={saved.has(item.id)}
              onToggleSave={() => toggle(item)}
              onPress={() =>
                router.push({
                  pathname: "/opportunity/[id]",
                  params: { id: item.id },
                } as any)
              }
            />
          )}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  hero: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroTitle: { color: "#fff", fontSize: 22, fontWeight: "800" },
  heroSub: { color: "#D1FAE5", fontSize: 13, marginTop: 2, marginBottom: 14 },
  box: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    gap: 8,
  },
  input: { flex: 1, paddingVertical: 12, fontSize: 15, color: COLORS.text },
});
