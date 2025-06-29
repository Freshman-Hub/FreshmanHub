import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  Database,
  Download,
  Eye,
  Globe,
  HelpCircle,
  Info,
  Lock,
  LogOut,
  MessageCircle,
  Moon,
  Palette,
  RefreshCw,
  Shield,
  Smartphone,
  Trash2,
  User,
  Volume2,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Settings data structure
const settingsData = [
  {
    section: "Account",
    items: [
      {
        id: "profile",
        title: "Edit Profile",
        description: "Update your personal information",
        icon: User,
        type: "navigation",
        route: "/(routes)/edit-profile",
      },
      {
        id: "privacy",
        title: "Privacy Settings",
        description: "Control who can see your information",
        icon: Lock,
        type: "navigation",
        route: "/(routes)/privacy-settings",
      },
      {
        id: "security",
        title: "Security",
        description: "Password and account security",
        icon: Shield,
        type: "navigation",
        route: "/(routes)/security-settings",
      },
    ],
  },
  {
    section: "Notifications",
    items: [
      {
        id: "notifications",
        title: "Notification Settings",
        description: "Manage your notification preferences",
        icon: Bell,
        type: "navigation",
        route: "/(routes)/notifications",
      },
      {
        id: "push_notifications",
        title: "Push Notifications",
        description: "Receive notifications on your device",
        icon: Smartphone,
        type: "toggle",
        value: true,
      },
      {
        id: "email_notifications",
        title: "Email Notifications",
        description: "Receive notifications via email",
        icon: MessageCircle,
        type: "toggle",
        value: true,
      },
    ],
  },
  {
    section: "Appearance",
    items: [
      {
        id: "dark_mode",
        title: "Dark Mode",
        description: "Switch between light and dark themes",
        icon: Moon,
        type: "toggle",
        value: false,
      },
      {
        id: "language",
        title: "Language",
        description: "Change app language",
        icon: Globe,
        type: "selection",
        value: "English",
        options: ["English", "French", "Spanish", "Twi", "Ga"],
      },
      {
        id: "theme_color",
        title: "Theme Color",
        description: "Customize app accent color",
        icon: Palette,
        type: "selection",
        value: "Blue",
        options: ["Blue", "Green", "Purple", "Orange", "Red"],
      },
    ],
  },
  {
    section: "Privacy",
    items: [
      {
        id: "profile_visibility",
        title: "Profile Visibility",
        description: "Who can see your profile",
        icon: Eye,
        type: "selection",
        value: "Everyone",
        options: ["Everyone", "Students Only", "Friends Only", "Private"],
      },
      {
        id: "messaging",
        title: "Who can message me",
        description: "Control who can send you messages",
        icon: MessageCircle,
        type: "selection",
        value: "Everyone",
        options: ["Everyone", "Students Only", "Friends Only", "No One"],
      },
      {
        id: "activity_status",
        title: "Show Activity Status",
        description: "Let others see when you're online",
        icon: Volume2,
        type: "toggle",
        value: true,
      },
    ],
  },
  {
    section: "Data & Storage",
    items: [
      {
        id: "data_usage",
        title: "Data Usage",
        description: "View and manage data consumption",
        icon: Database,
        type: "navigation",
        route: "/(routes)/data-usage",
      },
      {
        id: "download_quality",
        title: "Download Quality",
        description: "Choose quality for offline content",
        icon: Download,
        type: "selection",
        value: "High",
        options: ["Low", "Medium", "High", "Auto"],
      },
      {
        id: "auto_download",
        title: "Auto-download",
        description: "Automatically download content",
        icon: RefreshCw,
        type: "toggle",
        value: false,
      },
    ],
  },
  {
    section: "Support",
    items: [
      {
        id: "help",
        title: "Help Center",
        description: "Get help and support",
        icon: HelpCircle,
        type: "navigation",
        route: "/(routes)/help-desk",
      },
      {
        id: "about",
        title: "About",
        description: "App version and information",
        icon: Info,
        type: "navigation",
        route: "/(routes)/about",
      },
      {
        id: "clear_cache",
        title: "Clear Cache",
        description: "Free up storage space",
        icon: Trash2,
        type: "action",
        action: "clear_cache",
      },
    ],
  },
];

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const router = useRouter();
  const [settings, setSettings] = useState(() => {
    // Initialize settings with dark mode from theme
    const initialSettings: Record<string, any> = {};
    settingsData.forEach((section) => {
      section.items.forEach((item) => {
        if (item.type === "toggle") {
          initialSettings[item.id] =
            item.id === "dark_mode"
              ? isDark
              : "value" in item
                ? item.value
                : false;
        } else if (item.type === "selection") {
          initialSettings[item.id] = "value" in item ? item.value : "";
        }
      });
    });
    return initialSettings;
  });

  const handleToggle = (itemId: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [itemId]: value }));

    if (itemId === "dark_mode") {
      toggleTheme();
    }
  };

  // const handleSelection = (itemId: string, value: string) => {
  //   setSettings((prev) => ({ ...prev, [itemId]: value }));
  // };

  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  const handleAction = (action: string) => {
    switch (action) {
      case "clear_cache":
        Alert.alert(
          "Clear Cache",
          "Are you sure you want to clear the app cache? This will free up storage space but may slow down the app temporarily.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Clear",
              style: "destructive",
              onPress: () => console.log("Cache cleared"),
            },
          ]
        );
        break;
      default:
        console.log("Unknown action:", action);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out of your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: () => console.log("User logged out"),
        },
      ]
    );
  };

  const renderSettingItem = (item: any) => {
    const IconComponent = item.icon;

    switch (item.type) {
      case "toggle":
        return (
          <View key={item.id} style={styles.settingItem}>
            <View style={styles.settingContent}>
              <IconComponent
                color={theme.colors.textSecondary}
                size={24}
                style={styles.settingIcon}
              />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                <Text style={styles.settingDescription}>
                  {item.description}
                </Text>
              </View>
            </View>
            <Switch
              value={settings[item.id]}
              onValueChange={(value) => handleToggle(item.id, value)}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
              thumbColor="white"
            />
          </View>
        );

      case "selection":
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.settingItem}
            onPress={() => {
              // TODO: Show selection modal
              console.log("Show selection for:", item.id);
            }}
          >
            <View style={styles.settingContent}>
              <IconComponent
                color={theme.colors.textSecondary}
                size={24}
                style={styles.settingIcon}
              />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                <Text style={styles.settingDescription}>
                  {item.description}
                </Text>
              </View>
            </View>
            <View style={styles.settingValue}>
              <Text style={styles.settingValueText}>{settings[item.id]}</Text>
              <ChevronRight color={theme.colors.textSecondary} size={20} />
            </View>
          </TouchableOpacity>
        );

      case "navigation":
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.settingItem}
            onPress={() => handleNavigation(item.route)}
          >
            <View style={styles.settingContent}>
              <IconComponent
                color={theme.colors.textSecondary}
                size={24}
                style={styles.settingIcon}
              />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                <Text style={styles.settingDescription}>
                  {item.description}
                </Text>
              </View>
            </View>
            <ChevronRight color={theme.colors.textSecondary} size={20} />
          </TouchableOpacity>
        );

      case "action":
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.settingItem}
            onPress={() => handleAction(item.action)}
          >
            <View style={styles.settingContent}>
              <IconComponent
                color={theme.colors.textSecondary}
                size={24}
                style={styles.settingIcon}
              />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                <Text style={styles.settingDescription}>
                  {item.description}
                </Text>
              </View>
            </View>
            <ChevronRight color={theme.colors.textSecondary} size={20} />
          </TouchableOpacity>
        );

      default:
        return null;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      padding: theme.spacing.sm,
      marginRight: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background,
    },
    headerTitle: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "700",
      flex: 1,
    },
    scrollContent: {
      paddingBottom: theme.spacing.md,
    },
    sectionContainer: {
      backgroundColor: theme.colors.surface,
      marginTop: theme.spacing.md,
      marginHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.xl,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 6,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    sectionHeader: {
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
    sectionTitle: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "700",
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    settingItemLast: {
      borderBottomWidth: 0,
    },
    settingContent: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    settingIcon: {
      marginRight: theme.spacing.md,
      width: 24,
    },
    settingText: {
      flex: 1,
    },
    settingTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: 2,
    },
    settingDescription: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      lineHeight: 18,
    } as TextStyle,
    settingValue: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    settingValueText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    logoutSection: {
      marginTop: theme.spacing.md,
      marginHorizontal: theme.spacing.xxl,
      marginBottom: theme.spacing.md,
    },
    logoutButton: {
      backgroundColor: "#fee2e2",
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.xxxl,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.sm,
      borderWidth: 1,
      borderColor: "#fecaca",
    },
    logoutText: {
      ...theme.typography.button,
      color: "#dc2626",
      fontWeight: "600",
    },
    appInfo: {
      alignItems: "center",
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
    },
    appVersion: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
      fontWeight: undefined,
    },
    appName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color={theme.colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {settingsData.map((section, sectionIndex) => (
          <View key={section.section} style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.section}</Text>
            </View>

            {section.items.map((item, itemIndex) => {
              const isLast = itemIndex === section.items.length - 1;
              return (
                <View
                  key={item.id}
                  style={[styles.settingItem, isLast && styles.settingItemLast]}
                >
                  {renderSettingItem(item)}
                </View>
              );
            })}
          </View>
        ))}

        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut color="#dc2626" size={20} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appName}>Ashesi Student App</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
