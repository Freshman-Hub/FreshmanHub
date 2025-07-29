"use client";
import { Stack } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

export default function CreateGroupLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="details/index" options={{ headerShown: false }} />
    </Stack>
  );
}
