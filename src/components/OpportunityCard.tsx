import { Pressable, StyleSheet, Text, View } from "react-native";
import { CATEGORY_COLORS, COLORS } from "../lib/constants";
import { daysLeft } from "../lib/dates";
import { Opportunity } from "../types";
import Icon from "./Icon";

type Props = {
  item: Opportunity;
  saved?: boolean;
  onPress: () => void;
  onToggleSave?: () => void;
};

export default function OpportunityCard({
  item,
  saved,
  onPress,
  onToggleSave,
}: Props) {
  const d = daysLeft(item.deadline);
  const cat = CATEGORY_COLORS[item.category] ?? {
    bg: COLORS.soft,
    fg: COLORS.primary,
  };

  let badge = { text: `${d} days left`, bg: COLORS.soft, fg: COLORS.primary };
  if (d < 0) badge = { text: "Closed", bg: "#F3F4F6", fg: COLORS.muted };
  else if (d <= 7)
    badge = {
      text: d === 0 ? "Closes today" : `${d} day${d === 1 ? "" : "s"} left`,
      bg: "#FEE2E2",
      fg: COLORS.danger,
    };
  else if (d <= 30)
    badge = { text: `${d} days left`, bg: "#FEF3C7", fg: COLORS.warn };

  return (
    <Pressable style={s.card} onPress={onPress}>
      <View style={s.top}>
        <View style={[s.pill, { backgroundColor: cat.bg }]}>
          <Text style={[s.pillText, { color: cat.fg }]}>{item.category}</Text>
        </View>
        {onToggleSave && (
          <Pressable onPress={onToggleSave} hitSlop={10}>
            <Icon
              name={saved ? "bookmark-filled" : "bookmark"}
              size={24}
              color={COLORS.primary}
            />
          </Pressable>
        )}
      </View>

      <Text style={s.title}>{item.title}</Text>
      <Text style={s.org}>{item.organization}</Text>

      <View style={s.meta}>
        <Icon name="pin" size={14} color={COLORS.muted} />
        <Text style={s.metaText}>{item.province}</Text>
        <View style={{ marginLeft: 10 }}>
          <Icon name="briefcase" size={14} color={COLORS.muted} />
        </View>
        <Text style={s.metaText}>{item.org_type}</Text>
      </View>

      <View style={s.bottom}>
        <View style={[s.badge, { backgroundColor: badge.bg }]}>
          <Text style={[s.badgeText, { color: badge.fg }]}>{badge.text}</Text>
        </View>
        <Text style={s.date}>Deadline {item.deadline}</Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  pillText: { fontSize: 12, fontWeight: "700" },
  title: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 2,
  },
  org: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
    marginBottom: 8,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 12,
  },
  metaText: { fontSize: 13, color: COLORS.muted },
  bottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  badgeText: { fontSize: 12, fontWeight: "700" },
  date: { fontSize: 12, color: COLORS.muted },
});
