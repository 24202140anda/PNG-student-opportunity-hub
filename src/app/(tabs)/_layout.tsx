import { Tabs } from "expo-router";
import Icon from "../../components/Icon";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../lib/constants";

export default function TabsLayout() {
  const { profile } = useAuth();
  const role = profile?.role;

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "700" },
        headerTitleAlign: "center",
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Icon name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, size }) => (
            <Icon name="bookmark" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="manage"
        options={{
          title: "My Listings",
          href: role === "organization" ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Icon name="briefcase" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: "Admin",
          href: role === "admin" ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Icon name="shield" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
