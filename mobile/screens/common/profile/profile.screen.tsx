import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/contexts/ThemeContext";
import { AuthService } from "@/services/auth.service";
import { router } from "expo-router";
import {
  Award,
  Bell,
  Calendar,
  ChevronRight,
  Edit3,
  Globe,
  HelpCircle,
  Lock,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Moon,
  Phone,
  Settings,
  Share,
  Shield,
  Users,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock user data
const userData = {
  name: "Kwame Asante",
  email: "kwame.asante@ashesi.edu.gh",
  phone: "+233 24 123 4567",
  year: "Freshman",
  major: "Computer Science",
  location: "Berekuso, Ghana",
  joinDate: "September 2024",
  avatar:
    "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
  coverImage:
    "https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400",
  bio: "Passionate about technology and innovation. Love connecting with fellow students and exploring new ideas. Always ready to help and learn!",
  stats: {
    posts: 24,
    friends: 156,
    events: 12,
  },
  achievements: [
    {
      id: 1,
      name: "Early Bird",
      description: "Joined orientation early",
      icon: Award,
    },
    {
      id: 2,
      name: "Social Butterfly",
      description: "50+ connections made",
      icon: Users,
    },
    {
      id: 3,
      name: "Event Enthusiast",
      description: "Attended 10+ events",
      icon: Calendar,
    },
  ],
};

const settingsOptions = [
  {
    section: "Account",
    items: [
      {
        id: 1,
        title: "Edit Profile",
        icon: Edit3,
        action: "edit",
        value: undefined,
      },
      {
        id: 2,
        title: "Privacy Settings",
        icon: Lock,
        action: "privacy",
        value: undefined,
      },
      {
        id: 3,
        title: "Notification Settings",
        icon: Bell,
        action: "notifications",
        value: undefined,
      },
    ],
  },
  {
    section: "Preferences",
    items: [
      {
        id: 4,
        title: "Dark Mode",
        icon: Moon,
        action: "toggle",
        hasSwitch: true,
        value: undefined,
      },
      {
        id: 5,
        title: "Language",
        icon: Globe,
        action: "language",
        value: "English",
      },
      {
        id: 6,
        title: "Who can message me",
        icon: MessageCircle,
        action: "messaging",
        value: "Everyone",
      },
    ],
  },
  {
    section: "Support",
    items: [
      {
        id: 7,
        title: "Help Center",
        icon: HelpCircle,
        action: "help",
        value: undefined,
      },
      {
        id: 8,
        title: "Report a Problem",
        icon: Shield,
        action: "report",
        value: undefined,
      },
      {
        id: 9,
        title: "Share App",
        icon: Share,
        action: "share",
        value: undefined,
      },
    ],
  },
];

export default function ProfileScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { user, loading: userLoading } = useUser();
  const [, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

   const defaultAvatar =
     "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400";

  const userStats = {
    posts: 0, // TODO: Implement posts count from backend
    friends: 0, // TODO: Implement friends count from backend
    events: 0, // TODO: Implement events count from backend
  };

  // Mock achievements - you can later create an achievements service
  const userAchievements = [
    {
      id: 1,
      name: "New Member",
      description: "Welcome to FreshmanHub!",
      icon: Award,
    },
  ];

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          setIsLoading(true);
          try {
            const { error } = await AuthService.signOut();
            if (error) {
              Alert.alert("Error", "Failed to sign out. Please try again.");
            } else {
              // router.push("/(auth)/login");
              // The UserContext will handle navigation automatically
            }
          } catch (error: any) {
            Alert.alert("Error", "An unexpected error occurred.", error.message);
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  const handleSettingPress = (action: string) => {
    switch (action) {
      case "edit":
        setIsEditing(true);
        // TODO: Navigate to edit profile screen
        router.push("/(routes)/settings"); //edit-profile
        break;
      case "toggle":
        toggleTheme();
        break;
      case "privacy":
        // TODO: Navigate to privacy settings
        router.push("/(routes)/settings"); //privacy-settings
        break;
      case "notifications":
        // TODO: Navigate to notification settings
        router.push("/(routes)/settings"); //notification-settings
        break;
      case "help":
        // TODO: Navigate to help center
        router.push("/(routes)/help");
        break;
      case "settings":
        router.push("/(routes)/settings");
        break;
      default:
        console.log("Setting pressed:", action);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      position: "relative",
      height: 200,
    },
    coverImage: {
      width: "100%",
      height: "100%",
    },
    coverOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.3)",
    },
    headerActions: {
      position: "absolute",
      top: theme.spacing.xl,
      right: theme.spacing.lg,
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    headerButton: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.xxxl,
    },
    profileSection: {
      backgroundColor: theme.colors.surface,
      marginTop: -30,
      borderTopLeftRadius: theme.borderRadius.xxl,
      borderTopRightRadius: theme.borderRadius.xxl,
      paddingTop: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.md,
    },
    avatarContainer: {
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 60,
      borderWidth: 4,
      borderColor: "white",
      marginBottom: theme.spacing.sm,
    },
    editAvatarButton: {
      position: "absolute",
      bottom: theme.spacing.md,
      right: "35%",
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxxl,
      borderWidth: 2,
      borderColor: "white",
    },
    userName: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "700",
      textAlign: "center",
      marginBottom: 4,
    },
    userTitle: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: theme.spacing.sm,
      fontWeight: "700",
    },
    userBio: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.md,
      fontWeight: "500",
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    statItem: {
      alignItems: "center",
    },
    statNumber: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 4,
    },
    statLabel: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
    } as TextStyle,
    infoSection: {
      backgroundColor: theme.colors.surface,
      marginTop: theme.spacing.sm,
      borderRadius: theme.borderRadius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      marginHorizontal: theme.spacing.md,
    },
    sectionTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.md,
    },
    infoItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    infoIcon: {
      marginRight: theme.spacing.md,
      width: 24,
    },
    infoText: {
      ...theme.typography.body,
      color: theme.colors.text,
      flex: 1,
      fontWeight: "500",
    },
    achievementsSection: {
      backgroundColor: theme.colors.surface,
      marginTop: theme.spacing.md,
      borderRadius: theme.borderRadius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      marginHorizontal: theme.spacing.md,
    },
    achievementItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: theme.spacing.sm,
    },
    achievementIcon: {
      backgroundColor: theme.colors.primary + "20",
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      marginRight: theme.spacing.md,
    },
    achievementInfo: {
      flex: 1,
    },
    achievementName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: 4,
    },
    achievementDescription: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    } as TextStyle,
    settingsSection: {
      backgroundColor: theme.colors.surface,
      marginTop: theme.spacing.md,
      borderRadius: theme.borderRadius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginHorizontal: theme.spacing.md,
      overflow: "hidden",
    },
    settingsSectionHeader: {
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    settingsItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    settingsItemLast: {
      borderBottomWidth: 0,
    },
    settingsIcon: {
      marginRight: theme.spacing.md,
      width: 24,
    },
    settingsText: {
      ...theme.typography.body,
      color: theme.colors.text,
      flex: 1,
      fontWeight: "500",
    },
    settingsValue: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginRight: theme.spacing.sm,
      fontWeight: "500",
    },
    logoutSection: {
      marginTop: theme.spacing.lg,
      marginHorizontal: theme.spacing.xxl,
      marginBottom: theme.spacing.lg,
    },
    logoutButton: {
      backgroundColor: "#fee2e2",
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.xxxl,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.sm,
    },
    logoutText: {
      ...theme.typography.button,
      color: "#dc2626",
      fontWeight: "600",
    },
  });

  
  if (userLoading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ color: theme.colors.text, marginTop: 16 }}>
          Loading profile...
        </Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: theme.colors.text }}>No user data available</Text>
      </SafeAreaView>
    );
  }

  

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={{ uri: userData.coverImage }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          <View style={styles.coverOverlay} />
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Share color={theme.colors.text} size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => handleSettingPress("settings")}
            >
              <Settings color={theme.colors.text} size={20} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user.profileImage || defaultAvatar }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Edit3 color="white" size={16} />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>
            {`${user.firstName} ${user.lastName}`}
          </Text>
          <Text style={styles.userTitle}>
            {user.yearGroup ? `${user.yearGroup} • ` : ""}
            {user.major || user.role}
          </Text>
          {/* TODO: Add bio field to User interface and display here */}
          <Text style={styles.userBio}>
            Welcome to FreshmanHub! Connect with peers and coaches.
          </Text>

          <View style={styles.statsContainer}>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.posts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.friends}</Text>
              <Text style={styles.statLabel}>Friends</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.events}</Text>
              <Text style={styles.statLabel}>Events</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.infoItem}>
            <Mail
              color={theme.colors.textSecondary}
              size={20}
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>{user.email}</Text>
          </View>

          {user.phoneNumber && (
            <View style={styles.infoItem}>
              <Phone
                color={theme.colors.textSecondary}
                size={20}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>{user.phoneNumber}</Text>
            </View>
          )}

          <View style={styles.infoItem}>
            <MapPin
              color={theme.colors.textSecondary}
              size={20}
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>{user.country}</Text>
          </View>

          <View style={styles.infoItem}>
            <Calendar
              color={theme.colors.textSecondary}
              size={20}
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>
              Joined{" "}
              {user.createdAt
                ? new Date(user.createdAt.seconds * 1000).toLocaleDateString(
                    "en-US",
                    { month: "long", year: "numeric" }
                  )
                : "Recently"}
            </Text>
          </View>

          {user.studentId && (
            <View style={styles.infoItem}>
              <Users
                color={theme.colors.textSecondary}
                size={20}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>Student ID: {user.studentId}</Text>
            </View>
          )}

          {user.department && (
            <View style={styles.infoItem}>
              <Settings
                color={theme.colors.textSecondary}
                size={20}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>Department: {user.department}</Text>
            </View>
          )}
        </View>

        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Achievements</Text>

          {userAchievements.map((achievement) => {
            const IconComponent = achievement.icon;
            return (
              <View key={achievement.id} style={styles.achievementItem}>
                <View style={styles.achievementIcon}>
                  <IconComponent color={theme.colors.primary} size={24} />
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementName}>{achievement.name}</Text>
                  <Text style={styles.achievementDescription}>
                    {achievement.description}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {settingsOptions.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.settingsSection}>
            <View style={styles.settingsSectionHeader}>
              <Text style={styles.sectionTitle}>{section.section}</Text>
            </View>

            {section.items.map((item, itemIndex) => {
              const IconComponent = item.icon;
              const isLast = itemIndex === section.items.length - 1;

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.settingsItem,
                    isLast && styles.settingsItemLast,
                  ]}
                  onPress={() => handleSettingPress(item.action)}
                >
                  <IconComponent
                    color={theme.colors.textSecondary}
                    size={20}
                    style={styles.settingsIcon}
                  />
                  <Text style={styles.settingsText}>{item.title}</Text>

                  {"hasSwitch" in item && item.hasSwitch ? (
                    <Switch
                      value={isDark}
                      onValueChange={toggleTheme}
                      trackColor={{
                        false: theme.colors.border,
                        true: theme.colors.primary,
                      }}
                      thumbColor="white"
                    />
                  ) : (
                    <>
                      {item.value && (
                        <Text style={styles.settingsValue}>{item.value}</Text>
                      )}
                      <ChevronRight
                        color={theme.colors.textSecondary}
                        size={20}
                      />
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleSignOut}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#dc2626" size={20} />
            ) : (
              <LogOut color="#dc2626" size={20} />
            )}
            <Text style={styles.logoutText}>
              {isLoading ? "Signing Out..." : "Sign Out"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
