export function friendlyError(e: any): string {
  const m = String(e?.message ?? e ?? "");
  if (/failed to fetch|network request failed|network error|timeout/i.test(m)) {
    return "No connection. Check your internet and try again.";
  }
  return m || "Something went wrong. Please try again.";
}
