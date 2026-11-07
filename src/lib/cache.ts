import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveCache(key: string, value: unknown) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export async function loadCache<T>(key: string): Promise<T | null> {
  try {
    const v = await AsyncStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}
