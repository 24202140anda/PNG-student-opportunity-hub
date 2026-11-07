import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { daysLeft } from "../lib/dates";
import { Opportunity } from "../types";
import Icon from "./Icon";

export default function ReminderBanner({ items }: { items: Opportunity[] }) {
  const router = useRouter();
  const due = items
    .map((o) => ({ o, d: daysLeft(o.deadline) }))
    .filter((x) => x.d >= 0 && x.d <= 7)
    .sort((a, b) => a.d - b.d);

  if (due.length === 0) return null;

  return (
    <View style={s.wrap}>
      <View style={s.head}>
        <Icon name="bell" size={18} color="#92400E" />
        <Text style={s.headText}>Deadline reminders</Text>
      </View>
      {due.map(({ o, d }) => (
        <Pressable
          key={o.id}
          onPress={() =>
            router.push({
              pathname: "/opportunity/[id]",
              params: { id: o.id },
            } as any)
          }
        >
          <Text style={s.line}>
            {o.title} closes{" "}
            {d === 0 ? "today" : d === 1 ? "tomorrow" : `in ${d} days`}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    backgroundColor: "#FEF3C7",
    borderWidth: 1,
    borderColor: "#FCD34D",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  head: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  headText: { fontWeight: "800", color: "#92400E" },
  line: { color: "#78350F", fontSize: 14, marginTop: 4 },
});
