import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Bell,
  BookOpen,
  Calendar,
  GraduationCap,
  Heart,
  Mail,
  MessageCircle,
  MoveHorizontal as MoreHorizontal,
  Settings,
  Smartphone,
  Users,
  Utensils,
  Volume2,
  VolumeX,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Notification categories with settings
const notificationCategories = [
  {
    id: "messages",
    title: "Messages & Chat",
    description: "Direct messages, group chats, and buddy communications",
    icon: MessageCircle,
    color: "#3b82f6",
    enabled: true,
    pushEnabled: true,
    emailEnabled: false,
    soundEnabled: true,
  },
  {
    id: "events",
    title: "Events & Activities",
    description: "Event reminders, new events, and activity updates",
    icon: Calendar,
    color: "#059669",
    enabled: true,
    pushEnabled: true,
    emailEnabled: true,
    soundEnabled: true,
  },
  {
    id: "academic",
    title: "Academic Updates",
    description: "Course announcements, grades, and academic deadlines",
    icon: GraduationCap,
    color: "#7c3aed",
    enabled: true,
    pushEnabled: true,
    emailEnabled: true,
    soundEnabled: false,
  },
  {
    id: "social",
    title: "Social & Community",
    description: "Friend requests, community posts, and social interactions",
    icon: Users,
    color: "#f59e0b",
    enabled: true,
    pushEnabled: false,
    emailEnabled: false,
    soundEnabled: false,
  },
  {
    id: "health",
    title: "Health & Wellness",
    description:
      "Health center updates, appointment reminders, and wellness tips",
    icon: Heart,
    color: "#ef4444",
    enabled: true,
    pushEnabled: true,
    emailEnabled: false,
    soundEnabled: true,
  },
  {
    id: "dining",
    title: "Dining & Services",
    description: "Meal plan updates, dining hours, and service announcements",
    icon: Utensils,
    color: "#0891b2",
    enabled: false,
    pushEnabled: false,
    emailEnabled: false,
    soundEnabled: false,
  },
  {
    id: "resources",
    title: "Resources & Library",
    description: "New resources, library notifications, and study materials",
    icon: BookOpen,
    color: "#dc2626",
    enabled: true,
    pushEnabled: false,
    emailEnabled: true,
    soundEnabled: false,
  },
];

// Recent notifications
const recentNotifications = [
  {
    id: 1,
    title: "New message from Ama Asante",
    description: "Hey! Are you free for a study session this afternoon?",
    category: "messages",
    time: "5 minutes ago",
    read: false,
    icon: MessageCircle,
    color: "#3b82f6",
  },
  {
    id: 2,
    title: "International Night - Tomorrow",
    description:
      "Don't forget about the International Night event tomorrow at 7:00 PM",
    category: "events",
    time: "2 hours ago",
    read: false,
    icon: Calendar,
    color: "#059669",
  },
  {
    id: 3,
    title: "Assignment Due Reminder",
    description: "Your Computer Science assignment is due in 2 days",
    category: "academic",
    time: "1 day ago",
    read: true,
    icon: GraduationCap,
    color: "#7c3aed",
  },
  {
    id: 4,
    title: "Health Center Appointment",
    description:
      "Your appointment with Dr. Mensah is confirmed for tomorrow at 10:00 AM",
    category: "health",
    time: "1 day ago",
    read: true,
    icon: Heart,
    color: "#ef4444",
  },
  {
    id: 5,
    title: "New Study Resource Available",
    description: "Calculus study guide has been added to the library resources",
    category: "resources",
    time: "2 days ago",
    read: true,
    icon: BookOpen,
    color: "#dc2626",
  },
  {
    id: 6,
    title: "Friend Request from Michael Osei",
    description: "Michael Osei wants to connect with you",
    category: "social",
    time: "3 days ago",
    read: true,
    icon: Users,
    color: "#f59e0b",
  },
];

// Global notification settings
const globalSettings = [
  {
    id: "push_notifications",
    title: "Push Notifications",
    description: "Receive notifications on your device",
    icon: Smartphone,
    enabled: true,
  },
  {
    id: "email_notifications",
    title: "Email Notifications",
    description: "Receive notifications via email",
    icon: Mail,
    enabled: true,
  },
  {
    id: "notification_sound",
    title: "Notification Sounds",
    description: "Play sound for notifications",
    icon: Volume2,
    enabled: true,
  },
  {
    id: "quiet_hours",
    title: "Quiet Hours (10 PM - 7 AM)",
    description: "Silence notifications during quiet hours",
    icon: VolumeX,
    enabled: true,
  },
];

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"notifications" | "settings">(
    "notifications"
  );
  const [categories, setCategories] = useState(notificationCategories);
  const [globalPrefs, setGlobalPrefs] = useState(globalSettings);
  const [notifications, setNotifications] = useState(recentNotifications);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleCategoryToggle = (
    categoryId: string,
    setting: string,
    value: boolean
  ) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, [setting]: value } : cat
      )
    );
  };

  const handleGlobalToggle = (settingId: string, value: boolean) => {
    setGlobalPrefs((prev) =>
      prev.map((setting) =>
        setting.id === settingId ? { ...setting, enabled: value } : setting
      )
    );
  };

  const handleNotificationPress = (notificationId: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

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
    headerActions: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    headerButton: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    tabsContainer: {
      flexDirection: "row",
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    tabButton: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      alignItems: "center",
      borderRadius: theme.borderRadius.xxxl,
      marginHorizontal: theme.spacing.xs,
    },
    tabButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    tabText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    tabTextActive: {
      color: "white",
      fontWeight: "700",
    },
    scrollContent: {
      paddingBottom: theme.spacing.md,
    },
    notificationHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },
    notificationTitle: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
    },
    unreadBadge: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.lg,
      marginLeft: theme.spacing.sm,
    },
    unreadText: {
      ...theme.typography.captionSmall,
      color: "white",
      fontWeight: "700",
    },
    headerActions2: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    actionButton: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    actionButtonText: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      fontWeight: "600",
    },
    notificationsList: {
      paddingHorizontal: theme.spacing.sm,
    },
    notificationCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.xs,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    unreadNotification: {
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
    },
    notificationHeader2: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: theme.spacing.sm,
    },
    notificationIcon: {
      marginRight: theme.spacing.md,
      marginTop: 2,
    },
    notificationContent: {
      flex: 1,
    },
    notificationTitleText: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: 4,
    },
    notificationDescription: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
      fontWeight: undefined,
    },
    notificationTime: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
    } as TextStyle,
    notificationActions: {
      marginTop: theme.spacing.sm,
    },
    moreButton: {
      padding: theme.spacing.xs,
    },
    settingsContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md,
    },
    sectionTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.md,
    },
    settingsSection: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      marginBottom: theme.spacing.md,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
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
    categoryCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
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
    categoryHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    categoryInfo: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    categoryTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 4,
    },
    categoryDescription: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      lineHeight: 18,
    } as TextStyle,
    categorySettings: {
      gap: theme.spacing.md,
    },
    categorySettingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    categorySettingLabel: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      fontWeight: "600",
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: theme.spacing.xxl,
    },
    emptyStateText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: theme.spacing.md,
      fontWeight: "500",
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
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Settings color={theme.colors.textSecondary} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "notifications" && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab("notifications")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "notifications" && styles.tabTextActive,
            ]}
          >
            Notifications
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "settings" && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab("settings")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "settings" && styles.tabTextActive,
            ]}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === "notifications" ? (
          <>
            <View style={styles.notificationHeader}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.notificationTitle}>
                  Recent Notifications
                </Text>
                {unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{unreadCount}</Text>
                  </View>
                )}
              </View>
              <View style={styles.headerActions2}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleMarkAllRead}
                >
                  <Text style={styles.actionButtonText}>Mark All Read</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleClearAll}
                >
                  <Text style={styles.actionButtonText}>Clear All</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.notificationsList}>
              {notifications.length > 0 ? (
                notifications.map((notification) => {
                  const IconComponent = notification.icon;
                  return (
                    <TouchableOpacity
                      key={notification.id}
                      style={[
                        styles.notificationCard,
                        !notification.read && styles.unreadNotification,
                      ]}
                      onPress={() => handleNotificationPress(notification.id)}
                    >
                      <View style={styles.notificationHeader2}>
                        <IconComponent
                          color={notification.color}
                          size={24}
                          style={styles.notificationIcon}
                        />
                        <View style={styles.notificationContent}>
                          <Text style={styles.notificationTitleText}>
                            {notification.title}
                          </Text>
                          <Text style={styles.notificationDescription}>
                            {notification.description}
                          </Text>
                          <Text style={styles.notificationTime}>
                            {notification.time}
                          </Text>
                        </View>
                        <TouchableOpacity style={styles.moreButton}>
                          <MoreHorizontal
                            color={theme.colors.textSecondary}
                            size={20}
                          />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View style={styles.emptyState}>
                  <Bell color={theme.colors.textSecondary} size={64} />
                  <Text style={styles.emptyStateText}>
                    No notifications yet{"\n"}You&apos;ll see your notifications
                    here
                  </Text>
                </View>
              )}
            </View>
          </>
        ) : (
          <View style={styles.settingsContainer}>
            <Text style={styles.sectionTitle}>Global Settings</Text>
            <View style={styles.settingsSection}>
              {globalPrefs.map((setting, index) => {
                const IconComponent = setting.icon;
                const isLast = index === globalPrefs.length - 1;
                return (
                  <View
                    key={setting.id}
                    style={[
                      styles.settingItem,
                      isLast && styles.settingItemLast,
                    ]}
                  >
                    <View style={styles.settingContent}>
                      <IconComponent
                        color={theme.colors.textSecondary}
                        size={24}
                        style={styles.settingIcon}
                      />
                      <View style={styles.settingText}>
                        <Text style={styles.settingTitle}>{setting.title}</Text>
                        <Text style={styles.settingDescription}>
                          {setting.description}
                        </Text>
                      </View>
                    </View>
                    <Switch
                      value={setting.enabled}
                      onValueChange={(value) =>
                        handleGlobalToggle(setting.id, value)
                      }
                      trackColor={{
                        false: theme.colors.border,
                        true: theme.colors.primary,
                      }}
                      thumbColor="white"
                    />
                  </View>
                );
              })}
            </View>

            <Text style={styles.sectionTitle}>Notification Categories</Text>
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <View key={category.id} style={styles.categoryCard}>
                  <View style={styles.categoryHeader}>
                    <IconComponent color={category.color} size={28} />
                    <View style={styles.categoryInfo}>
                      <Text style={styles.categoryTitle}>{category.title}</Text>
                      <Text style={styles.categoryDescription}>
                        {category.description}
                      </Text>
                    </View>
                    <Switch
                      value={category.enabled}
                      onValueChange={(value) =>
                        handleCategoryToggle(category.id, "enabled", value)
                      }
                      trackColor={{
                        false: theme.colors.border,
                        true: theme.colors.primary,
                      }}
                      thumbColor="white"
                    />
                  </View>

                  {category.enabled && (
                    <View style={styles.categorySettings}>
                      <View style={styles.categorySettingRow}>
                        <Text style={styles.categorySettingLabel}>
                          Push Notifications
                        </Text>
                        <Switch
                          value={category.pushEnabled}
                          onValueChange={(value) =>
                            handleCategoryToggle(
                              category.id,
                              "pushEnabled",
                              value
                            )
                          }
                          trackColor={{
                            false: theme.colors.border,
                            true: theme.colors.primary,
                          }}
                          thumbColor="white"
                        />
                      </View>
                      <View style={styles.categorySettingRow}>
                        <Text style={styles.categorySettingLabel}>
                          Email Notifications
                        </Text>
                        <Switch
                          value={category.emailEnabled}
                          onValueChange={(value) =>
                            handleCategoryToggle(
                              category.id,
                              "emailEnabled",
                              value
                            )
                          }
                          trackColor={{
                            false: theme.colors.border,
                            true: theme.colors.primary,
                          }}
                          thumbColor="white"
                        />
                      </View>
                      <View style={styles.categorySettingRow}>
                        <Text style={styles.categorySettingLabel}>Sound</Text>
                        <Switch
                          value={category.soundEnabled}
                          onValueChange={(value) =>
                            handleCategoryToggle(
                              category.id,
                              "soundEnabled",
                              value
                            )
                          }
                          trackColor={{
                            false: theme.colors.border,
                            true: theme.colors.primary,
                          }}
                          thumbColor="white"
                        />
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
