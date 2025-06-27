import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map/index"
        options={{
          title: "Map",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="map" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="buddy/index"
        options={{
          title: "Buddies",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="person" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat/index"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="chat" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="profile" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
