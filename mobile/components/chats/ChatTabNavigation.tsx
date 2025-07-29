"use client";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { MessageCircle, Lock, Users, UserX } from "lucide-react-native";

interface ChatTabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function ChatTabNavigation({
  activeTab,
  onTabChange,
}: ChatTabNavigationProps) {
  const { theme } = useTheme();

  const tabs = [
    { id: "chats", label: "Chats", icon: MessageCircle, badge: 2 },
    { id: "private", label: "Private", icon: Lock, badge: 0 },
    { id: "communities", label: "Communities", icon: Users, badge: 0 },
    { id: "anonymous", label: "Anonymous", icon: UserX, badge: 1 },
  ];

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
    },
    tab: {
      flex: 1,
      alignItems: "center",
      paddingVertical: theme.spacing.sm,
      position: "relative",
    },
    activeTab: {
      backgroundColor: theme.colors.primary + "15",
      borderRadius: theme.borderRadius.lg,
    },
    tabLabel: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    activeTabLabel: {
      color: theme.colors.primary,
      fontWeight: "600",
    },
    badge: {
      position: "absolute",
      top: -2,
      right: "30%",
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.xxxl,
      minWidth: 18,
      height: 18,
      justifyContent: "center",
      alignItems: "center",
    },
    badgeText: {
      ...theme.typography.captionSmall,
      color: "white",
      fontSize: 10,
      fontWeight: "600",
    },
  });

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const IconComponent = tab.icon;

        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onTabChange(tab.id)}
          >
            <View>
              <IconComponent
                size={24}
                color={
                  isActive ? theme.colors.primary : theme.colors.textSecondary
                }
              />
              {tab.badge > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{tab.badge}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
