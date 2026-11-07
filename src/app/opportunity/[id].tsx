import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Linking,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { daysLeft } from "../../lib/dates";
import { ui } from "../../lib/ui";
import {
    CountryInfo,
    getCountryInfo,
    getPgkRate,
} from "../../services/external";
import { fetchOne } from "../../services/opportunities";
import { fetchSavedIds, toggleSaved } from "../../services/saved";
import { Opportunity } from "../../types";

export default function Details() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const [opp, setOpp] = useState<Opportunity | null>(null);
  const [saved, setSaved] = useState(false);
  const [country, setCountry] = useState<CountryInfo | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const o = await fetchOne(id);
        setOpp(o);
        const ids = await fetchSavedIds(session!.user.id);
        setSaved(ids.has(id));
        if (o.country)
          setCountry(await getCountryInfo(o.country).catch(() => null));
        if (o.amount_usd) setRate(await getPgkRate().catch(() => null));
      } catch (e: any) {
        setError(e.message ?? "Could not load this opportunity.");
      }
    })();
  }, [id]);

  async function onToggle() {
    if (!opp) return;
    await toggleSaved(session!.user.id, opp, saved);
    setSaved(!saved);
  }

  if (error) return <Text style={[ui.error, { padding: 20 }]}>{error}</Text>;
  if (!opp) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <ScrollView style={ui.screen}>
      <Stack.Screen options={{ headerShown: true, title: "Details" }} />
      <Text style={ui.muted}>
        {opp.category} | {opp.org_type} | {opp.province}
      </Text>
      <Text style={ui.title}>{opp.title}</Text>
      <Text style={ui.bold}>{opp.organization}</Text>
      <Text style={ui.text}>
        Deadline: {opp.deadline} ({daysLeft(opp.deadline)} days left)
      </Text>
      {opp.amount_usd ? (
        <Text style={ui.text}>
          Value: USD {Number(opp.amount_usd).toLocaleString()}
          {rate
            ? ` (about K${Math.round(Number(opp.amount_usd) * rate).toLocaleString()})`
            : ""}
        </Text>
      ) : null}
      <Text style={[ui.text, { marginTop: 12 }]}>{opp.description}</Text>
      {country && (
        <View
          style={[
            ui.box,
            { flexDirection: "row", alignItems: "center", gap: 12 },
          ]}
        >
          <Image
            source={{ uri: country.flags.png }}
            style={{ width: 60, height: 40 }}
          />
          <View>
            <Text style={ui.bold}>{country.name.common}</Text>
            <Text style={ui.muted}>
              Capital: {country.capital?.[0] ?? "n/a"} | {country.region}
            </Text>
          </View>
        </View>
      )}
      <Pressable style={ui.btn} onPress={() => Linking.openURL(opp.apply_url)}>
        <Text style={ui.btnText}>Apply on the official page</Text>
      </Pressable>
      <Pressable style={ui.btnGhost} onPress={onToggle}>
        <Text style={ui.ghostText}>
          {saved ? "Remove from saved" : "Save for later"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
