import Constants, { ExecutionEnvironment } from "expo-constants";
import { Platform } from "react-native";
import { Opportunity } from "../types";

export function remindersSupported() {
  if (Platform.OS === "web") return false;
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient)
    return false;
  return true;
}

let cached: any = null;

function getNotifications(): any {
  if (!remindersSupported()) return null;
  if (cached) return cached;
  try {
    const N = require("expo-notifications");
    N.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
    cached = N;
    return N;
  } catch {
    return null;
  }
}

async function ensurePermission(N: any) {
  try {
    if (Platform.OS === "android") {
      await N.setNotificationChannelAsync("deadlines", {
        name: "Deadline reminders",
        importance: N.AndroidImportance.HIGH,
      });
    }
    const current = await N.getPermissionsAsync();
    if (current.granted) return true;
    const asked = await N.requestPermissionsAsync();
    return !!asked.granted;
  } catch {
    return false;
  }
}

export async function scheduleDeadlineReminder(opp: Opportunity) {
  const N = getNotifications();
  if (!N) return false;
  if (!(await ensurePermission(N))) return false;
  const when = new Date(opp.deadline + "T08:00:00");
  when.setDate(when.getDate() - 3);
  if (when.getTime() <= Date.now()) return false;
  try {
    await N.scheduleNotificationAsync({
      identifier: `opp-${opp.id}`,
      content: {
        title: "Deadline in 3 days",
        body: `${opp.title} - ${opp.organization}`,
        data: { id: opp.id },
      },
      trigger: {
        type: N.SchedulableTriggerInputTypes.DATE,
        date: when,
        channelId: "deadlines",
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function cancelReminder(id: string) {
  const N = getNotifications();
  if (!N) return;
  try {
    await N.cancelScheduledNotificationAsync(`opp-${id}`);
  } catch {}
}

export async function sendTestNotification() {
  const N = getNotifications();
  if (!N) return false;
  if (!(await ensurePermission(N))) return false;
  try {
    await N.scheduleNotificationAsync({
      content: {
        title: "Test reminder",
        body: "Deadline reminders are working.",
      },
      trigger: {
        type: N.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 5,
        channelId: "deadlines",
      },
    });
    return true;
  } catch {
    return false;
  }
}
