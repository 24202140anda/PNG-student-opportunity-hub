export type CountryInfo = {
  name: { common: string };
  capital?: string[];
  region: string;
  flags: { png: string };
};

export async function getCountryInfo(
  country: string,
): Promise<CountryInfo | null> {
  const res = await fetch(
    `https://restcountries.com/v3.1/name/${encodeURIComponent(country)}?fields=name,capital,region,flags`,
  );
  if (!res.ok) return null;
  const list = await res.json();
  return list[0] ?? null;
}

export async function getPgkRate(): Promise<number | null> {
  const res = await fetch("https://open.er-api.com/v6/latest/USD");
  if (!res.ok) return null;
  const json = await res.json();
  return json.rates?.PGK ?? null;
}
