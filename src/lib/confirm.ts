import { Alert, Platform } from "react-native";

export function confirmAction(message: string, onYes: () => void) {
  if (Platform.OS === "web") {
    if (window.confirm(message)) onYes();
  } else {
    Alert.alert("Please confirm", message, [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", style: "destructive", onPress: onYes },
    ]);
  }
}
