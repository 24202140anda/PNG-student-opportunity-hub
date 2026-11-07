import { Link } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import Logo from "../../components/logo";
import { supabase } from "../../lib/supabase";
import { ui } from "../../lib/ui";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onLogin() {
    setError("");
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (error) setError(error.message);
  }

  return (
    <View style={ui.center}>
      <View style={{ marginBottom: 24 }}>
        <Logo size={110} showText />
      </View>
      <TextInput
        style={ui.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={ui.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={ui.error}>{error}</Text> : null}
      <Pressable style={ui.btn} onPress={onLogin} disabled={busy}>
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={ui.btnText}>Log in</Text>
        )}
      </Pressable>
      <Link
        href={"/(auth)/register" as any}
        style={[ui.text, { textAlign: "center", marginTop: 12 }]}
      >
        No account? Register
      </Link>
    </View>
  );
}
