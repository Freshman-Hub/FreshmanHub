"use client";
import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  MapPin,
  Users,
  MessageCircle,
  BookOpen,
  Heart,
  Utensils,
  Wifi,
  GraduationCap,
  Target,
  HelpCircle,
  Library,
  Briefcase,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";

const quickActions = [
  {
    id: 1,
    title: "Campus Map",
    icon: MapPin,
    color: "#3b82f6",
    bgColor: "#eff6ff",
    route: "/(routes)/map",
  },
  {
    id: 2,
    title: "Find Buddies",
    icon: Users,
    color: "#059669",
    bgColor: "#ecfdf5",
    route: "/(routes)/buddy",
  },
  {
    id: 4,
    title: "Chat",
    icon: MessageCircle,
    color: "#7c3aed",
    bgColor: "#f3e8ff",
    route: "/(routes)/chat",
  },
  {
    id: 5,
    title: "Resources",
    icon: BookOpen,
    color: "#ea580c",
    bgColor: "#fff7ed",
    route: "/(tabs)/resources",
  },
  {
    id: 6,
    title: "Health Center",
    icon: Heart,
    color: "#e11d48",
    bgColor: "#fdf2f8",
    route: "/(routes)/health-center",
  },
  {
    id: 7,
    title: "Dining",
    icon: Utensils,
    color: "#0891b2",
    bgColor: "#ecfeff",
    route: "/(routes)/dining",
  },
  {
    id: 8,
    title: "Support Center",
    icon: Wifi,
    color: "#65a30d",
    bgColor: "#f7fee7",
    route: "/(routes)/IT",
  },
  {
    id: 9,
    title: "Advising",
    icon: GraduationCap,
    color: "#8b5cf6",
    bgColor: "#f5f3ff",
    route: "/(routes)/advising",
  },
  {
    id: 10,
    title: "Coaching",
    icon: Target,
    color: "#f59e0b",
    bgColor: "#fffbeb",
    route: "/(routes)/coaching",
  },
  {
    id: 11,
    title: "Career Services",
    icon: Briefcase,
    color: "#059669",
    bgColor: "#ecfdf5",
    route: "/(routes)/career-services",
  },
  {
    id: 12,
    title: "Help Desk",
    icon: HelpCircle,
    color: "#06b6d4",
    bgColor: "#f0fdff",
    route: "/(routes)/help",
  },
  {
    id: 13,
    title: "Library",
    icon: Library,
    color: "#84cc16",
    bgColor: "#f7fee7",
    route: "/(routes)/library",
  },
];

export function QuickActions() {
  const { theme } = useTheme();
  const router = useRouter();
  const [pressedItem, setPressedItem] = useState<number | null>(null);

  const handlePress = (action: (typeof quickActions)[0]) => {
    setPressedItem(action.id);

    // TODO: Add haptic feedback here

    // Navigate to respective screen
    router.push(action.route as any);

    setTimeout(() => setPressedItem(null), 150);
  };

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    title: {
      ...theme.typography.h4,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      fontWeight: theme.typography.h5.fontWeight as any,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    actionItem: {
      width: "31%",
      marginBottom: theme.spacing.md,
    },
    actionCard: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      alignItems: "center",
      borderRadius: theme.borderRadius.xl,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
      transform: [{ scale: 1 }],
      borderWidth: 0.25,
      borderColor: theme.colors.border,
    },
    actionCardPressed: {
      transform: [{ scale: 0.95 }],
      shadowOpacity: 0.1,
    },
    iconContainer: {
      width: 45,
      height: 45,
      borderRadius: theme.borderRadius.xl,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.sm,
    },
    actionText: {
      ...theme.typography.captionSmall,
      color: theme.colors.text,
      textAlign: "center",
      fontWeight: "normal" as const,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>

      <View style={styles.grid}>
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          const isPressed = pressedItem === action.id;

          return (
            <TouchableOpacity
              key={action.id}
              style={styles.actionItem}
              activeOpacity={0.7}
              onPress={() => handlePress(action)}
            >
              <View
                style={[
                  styles.actionCard,
                  isPressed && styles.actionCardPressed,
                ]}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: action.bgColor },
                  ]}
                >
                  <IconComponent color={action.color} size={24} />
                </View>
                <Text style={styles.actionText}>{action.title}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
