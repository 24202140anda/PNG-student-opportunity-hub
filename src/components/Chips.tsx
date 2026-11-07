import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { COLORS } from "../lib/constants";

type Props = {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  clearable?: boolean;
};

export default function Chips({ options, value, onChange, clearable }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ flexGrow: 0 }}
      contentContainerStyle={{ gap: 8, paddingVertical: 6 }}
    >
      {options.map((o) => {
        const on = value === o;
        return (
          <Pressable
            key={o}
            onPress={() => onChange(on && clearable ? "" : o)}
            style={[s.chip, on && s.on]}
          >
            <Text style={[s.txt, on && { color: "#fff" }]}>{o}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },
  on: { backgroundColor: COLORS.primary },
  txt: { color: COLORS.text, fontSize: 13 },
});
