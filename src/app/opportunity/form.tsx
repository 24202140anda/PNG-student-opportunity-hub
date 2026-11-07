import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput } from "react-native";
import Chips from "../../components/Chips";
import { useAuth } from "../../context/AuthContext";
import { CATEGORIES, ORG_TYPES } from "../../lib/constants";
import { isValidDate } from "../../lib/dates";
import { ui } from "../../lib/ui";
import {
  createOpportunity,
  fetchOne,
  updateOpportunity,
} from "../../services/opportunities";

export default function OpportunityForm() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { session, profile } = useAuth();
  const router = useRouter();
  const isAdmin = profile?.role === "admin";
  const [error, setError] = useState("");
  const [f, setF] = useState({
    title: "",
    organization: profile?.organization_name ?? "",
    org_type: "Private Company",
    category: "Internship",
    province: "",
    description: "",
    deadline: "",
    apply_url: "https://",
    country: "",
    amount_usd: "",
  });
  const set = (k: string) => (v: string) => setF((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    if (!id) return;
    fetchOne(id)
      .then((o) =>
        setF({
          title: o.title,
          organization: o.organization,
          org_type: o.org_type,
          category: o.category,
          province: o.province,
          description: o.description,
          deadline: o.deadline,
          apply_url: o.apply_url,
          country: o.country ?? "",
          amount_usd: o.amount_usd ? String(o.amount_usd) : "",
        }),
      )
      .catch((e) => setError(e.message));
  }, [id]);

  async function onSave() {
    if (!session) return;
    setError("");
    if (!f.title.trim() || !f.organization.trim() || !f.description.trim()) {
      return setError("Title, organization and description are required.");
    }
    if (!isValidDate(f.deadline))
      return setError("Deadline must look like 2027-03-31.");
    if (!f.apply_url.startsWith("http"))
      return setError("Apply link must start with http.");
    const payload = {
      title: f.title.trim(),
      organization: f.organization.trim(),
      org_type: f.org_type,
      category: f.category,
      province: f.province.trim() || "Nationwide",
      description: f.description.trim(),
      deadline: f.deadline,
      apply_url: f.apply_url.trim(),
      country: f.country.trim() || null,
      amount_usd: f.amount_usd ? Number(f.amount_usd) : null,
    };
    try {
      if (id) {
        await updateOpportunity(id, payload);
      } else {
        await createOpportunity({
          ...payload,
          owner_id: session.user.id,
          status: isAdmin ? "approved" : "pending",
        });
      }
      router.back();
    } catch (e: any) {
      setError(e.message);
    }
  }

  const input = (label: string, key: keyof typeof f, extra: object = {}) => (
    <>
      <Text style={ui.label}>{label}</Text>
      <TextInput
        style={ui.input}
        value={f[key]}
        onChangeText={set(key)}
        {...extra}
      />
    </>
  );

  return (
    <ScrollView style={ui.screen}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: id ? "Edit opportunity" : "New opportunity",
        }}
      />
      {input("Title", "title")}
      {input("Organization", "organization", {
        placeholder: "e.g. University of Papua New Guinea",
      })}
      <Text style={ui.label}>Organization type</Text>
      <Chips
        options={ORG_TYPES}
        value={f.org_type}
        onChange={set("org_type")}
      />
      <Text style={[ui.label, { marginTop: 10 }]}>Category</Text>
      <Chips
        options={CATEGORIES}
        value={f.category}
        onChange={set("category")}
      />
      <Text style={[ui.label, { marginTop: 10 }]}>Province</Text>
      <TextInput
        style={ui.input}
        value={f.province}
        onChangeText={set("province")}
        placeholder="e.g. Morobe (or Nationwide / International)"
      />
      <Text style={ui.label}>Description</Text>
      <TextInput
        style={[ui.input, { height: 110 }]}
        multiline
        value={f.description}
        onChangeText={set("description")}
      />
      {input("Deadline (YYYY-MM-DD)", "deadline", {
        placeholder: "2027-03-31",
      })}
      {input("Official application link", "apply_url", {
        autoCapitalize: "none",
      })}
      {input("Country (overseas scholarships only)", "country")}
      {input("Value in USD (optional)", "amount_usd", {
        keyboardType: "numeric",
      })}
      {error ? <Text style={ui.error}>{error}</Text> : null}
      <Pressable style={ui.btn} onPress={onSave}>
        <Text style={ui.btnText}>
          {id
            ? "Save changes"
            : isAdmin
              ? "Publish"
              : "Save (admin will review)"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
