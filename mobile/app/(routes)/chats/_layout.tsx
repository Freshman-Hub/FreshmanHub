"use client";
import { Stack } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { Chat } from "stream-chat-expo";
import { chatClient } from "@/config/stream.config";

export default function ChatsLayout() {
  const { theme } = useTheme();

  return (
    <Chat client={chatClient}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="select-contact" options={{ headerShown: false }} />
        <Stack.Screen name="[id]/index" options={{ headerShown: false }} />
      </Stack>
    </Chat>
  );
}
