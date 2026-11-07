import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Text, View } from "react-native";
import OpportunityCard from "../../components/OpportunityCard";
import ReminderBanner from "../../components/ReminderBanner";
import { useAuth } from "../../context/AuthContext";
import { ui } from "../../lib/ui";
import { fetchSaved, toggleSaved } from "../../services/saved";
import { Opportunity } from "../../types";

export default function Saved() {
  const { session } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Opportunity[]>([]);

  const load = useCallback(async () => {
    if (!session) return;
    try {
      setItems(await fetchSaved(session.user.id));
    } catch {
      setItems([]);
    }
  }, [session]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  async function remove(item: Opportunity) {
    if (!session) return;
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    await toggleSaved(session.user.id, item, true);
  }

  if (!session) return null;

  return (
    <View style={ui.screen}>
      <FlatList
        data={[...items].sort((a, b) => a.deadline.localeCompare(b.deadline))}
        keyExtractor={(i) => i.id}
        ListHeaderComponent={<ReminderBanner items={items} />}
        ListEmptyComponent={
          <Text style={ui.muted}>
            Nothing saved yet. Tap the bookmark on an opportunity.
          </Text>
        }
        renderItem={({ item }) => (
          <OpportunityCard
            item={item}
            saved
            onToggleSave={() => remove(item)}
            onPress={() =>
              router.push({
                pathname: "/opportunity/[id]",
                params: { id: item.id },
              } as any)
            }
          />
        )}
      />
    </View>
  );
}
