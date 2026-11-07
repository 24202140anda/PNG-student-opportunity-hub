import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput } from "react-native";
import Chips from "../../components/Chips";
import { supabase } from "../../lib/supabase";
import { ui } from "../../lib/ui";

export default function Register() {
  const [role, setRole] = useState("Student");
  const [fullName, setFullName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [province, setProvince] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const isOrg = role !== "Student";

  async function onRegister() {
    setMsg("");
    if (!fullName.trim() || !email.trim() || password.length < 6) {
      setMsg("Enter your name, email and a password of 6 or more characters.");
      return;
    }
    if (isOrg && !orgName.trim()) {
      setMsg("Enter your " + role.toLowerCase() + " name.");
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          role: isOrg ? "organization" : "student",
          province: province.trim(),
          organization_name: isOrg ? orgName.trim() : null,
        },
      },
    });
    setBusy(false);
    if (error) setMsg(error.message);
    else if (!data.session)
      setMsg("Account created. Check your email to confirm, then log in.");
  }

  return (
    <ScrollView style={ui.screen} contentContainerStyle={{ paddingTop: 40 }}>
      <Text style={ui.title}>Create account</Text>
      <Text style={ui.label}>I am a</Text>
      <Chips
        options={["Student", "Company", "Organization"]}
        value={role}
        onChange={setRole}
      />

      <Text style={[ui.label, { marginTop: 10 }]}>Your full name</Text>
      <TextInput style={ui.input} value={fullName} onChangeText={setFullName} />

      {isOrg && (
        <>
          <Text style={ui.label}>{role} name</Text>
          <TextInput
            style={ui.input}
            value={orgName}
            onChangeText={setOrgName}
            placeholder="e.g. Bank South Pacific"
          />
        </>
      )}

      <Text style={ui.label}>Province</Text>
      <TextInput
        style={ui.input}
        value={province}
        onChangeText={setProvince}
        placeholder="Type your province, e.g. Morobe"
      />

      <Text style={ui.label}>Email</Text>
      <TextInput
        style={ui.input}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <Text style={ui.label}>Password</Text>
      <TextInput
        style={ui.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {msg ? <Text style={ui.error}>{msg}</Text> : null}
      <Pressable style={ui.btn} onPress={onRegister} disabled={busy}>
        <Text style={ui.btnText}>{busy ? "Please wait..." : "Register"}</Text>
      </Pressable>
      <Link
        href={"/(auth)/login" as any}
        style={[ui.text, { textAlign: "center", marginTop: 12 }]}
      >
        Back to login
      </Link>
    </ScrollView>
  );
}
