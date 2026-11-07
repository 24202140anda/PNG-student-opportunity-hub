import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

export const supabase = createClient(
  "https://ixrqsfnddeboiclmtlgl.supabase.co",
  "sb_publishable_2tZhyKHchxBt78EZhHUgeg_lgjNuBn2",
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
