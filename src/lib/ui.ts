import { StyleSheet } from "react-native";
import { COLORS } from "./constants";

export const ui = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg, padding: 16 },
  center: {
    flex: 1,
    backgroundColor: COLORS.bg,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 12,
  },
  text: { fontSize: 15, color: COLORS.text, marginBottom: 4 },
  bold: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  muted: { fontSize: 13, color: COLORS.muted, marginBottom: 4 },
  label: { fontWeight: "600", marginBottom: 4, color: COLORS.text },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
  },
  btn: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 6,
  },
  btnText: { color: "#fff", fontWeight: "700" },
  btnGhost: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 6,
  },
  ghostText: { color: COLORS.primary, fontWeight: "700" },
  error: { color: COLORS.danger, marginBottom: 8 },
  box: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
  },
});
