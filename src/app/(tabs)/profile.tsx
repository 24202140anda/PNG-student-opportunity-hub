import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import Icon from "../../components/Icon";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { ui } from "../../lib/ui";
import {
  remindersSupported,
  sendTestNotification,
} from "../../services/notifications";

export default function ProfileScreen() {
  const { session, profile, refreshProfile, signOut } = useAuth();
  const [name, setName] = useState(profile?.full_name ?? "");
  const [province, setProvince] = useState(profile?.province ?? "");
  const [msg, setMsg] = useState("");
  const [demo, setDemo] = useState(false);

  async function save() {
    if (!session) return;
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name.trim(), province: province.trim() })
      .eq("id", session.user.id);
    setMsg(error ? error.message : "Profile saved.");
    await refreshProfile();
  }

  async function testNotify() {
    if (!remindersSupported()) {
      setDemo(true);
      setMsg(
        "Preview of an in-app reminder. Phone notifications also work in the installed APK.",
      );
      return;
    }
    const ok = await sendTestNotification();
    setMsg(
      ok
        ? "A test reminder will appear in 5 seconds."
        : "Please allow notifications for this app.",
    );
  }

  if (!session) return null;

  return (
    <ScrollView style={ui.screen}>
      <Text style={ui.muted}>
        {session.user.email} | {profile?.role}
        {profile?.role === "organization"
          ? profile.verified
            ? " | verified"
            : " | not verified yet"
          : ""}
      </Text>
      <Text style={[ui.label, { marginTop: 12 }]}>Full name</Text>
      <TextInput style={ui.input} value={name} onChangeText={setName} />
      <Text style={ui.label}>Province</Text>
      <TextInput
        style={ui.input}
        value={province}
        onChangeText={setProvince}
        placeholder="e.g. Morobe"
      />

      {demo && (
        <View
          style={{
            backgroundColor: "#FEF3C7",
            borderWidth: 1,
            borderColor: "#FCD34D",
            borderRadius: 12,
            padding: 12,
            marginBottom: 10,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Icon name="bell" size={18} color="#92400E" />
            <Text style={{ fontWeight: "800", color: "#92400E" }}>
              Deadline in 3 days
            </Text>
          </View>
          <Text style={{ color: "#78350F", marginTop: 4 }}>
            Bachelor of Economics (Honours) 2027 - UPNG School of Business and
            Public Policy
          </Text>
        </View>
      )}

      {msg ? <Text style={[ui.text, { marginTop: 4 }]}>{msg}</Text> : null}
      <Pressable style={ui.btn} onPress={save}>
        <Text style={ui.btnText}>Save profile</Text>
      </Pressable>
      <Pressable style={ui.btnGhost} onPress={testNotify}>
        <Text style={ui.ghostText}>Send test reminder</Text>
      </Pressable>
      <Pressable style={ui.btnGhost} onPress={signOut}>
        <Text style={ui.ghostText}>Log out</Text>
      </Pressable>
    </ScrollView>
  );
}
