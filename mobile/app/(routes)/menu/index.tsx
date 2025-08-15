"use client";

import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
  Search,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";

// Import reusable components
import { Header } from "@/components/ui/Header";
import { MenuCard } from "@/components/ui/MenuCard";

const { width } = Dimensions.get("window");

// Universal quick actions accessible by all users
const universalActions = [
  {
    id: 1,
    title: "Campus Map",
    description: "Navigate around campus with interactive map",
    icon: MapPin,
    color: "#3b82f6",
    route: "/(routes)/map",
    category: "Navigation",
  },
  {
    id: 2,
    title: "Find Buddies",
    description: "Connect with peers and make friends",
    icon: Users,
    color: "#059669",
    route: "/(routes)/buddy",
    category: "Social",
  },
  {
    id: 3,
    title: "Chat",
    description: "Message friends and groups",
    icon: MessageCircle,
    color: "#7c3aed",
    route: "/(routes)/chat",
    category: "Communication",
  },
  {
    id: 4,
    title: "Resources",
    description: "Access learning materials and guides",
    icon: BookOpen,
    color: "#ea580c",
    route: "/(tabs)/resources",
    category: "Academic",
  },
  {
    id: 5,
    title: "Health Center",
    description: "Medical services and wellness",
    icon: Heart,
    color: "#e11d48",
    route: "/(routes)/health-center",
    category: "Health",
  },
  {
    id: 6,
    title: "Dining",
    description: "Meal plans and restaurant locations",
    icon: Utensils,
    color: "#0891b2",
    route: "/(routes)/dining",
    category: "Services",
  },
  {
    id: 7,
    title: "IT Support",
    description: "Technical help and wifi support",
    icon: Wifi,
    color: "#65a30d",
    route: "/(routes)/IT",
    category: "Support",
  },
  {
    id: 8,
    title: "Advising",
    description: "Academic guidance and course planning",
    icon: GraduationCap,
    color: "#8b5cf6",
    route: "/(routes)/advising",
    category: "Academic",
  },
  {
    id: 9,
    title: "Coaching",
    description: "Personal development and mentoring",
    icon: Target,
    color: "#f59e0b",
    route: "/(routes)/coaching",
    category: "Development",
  },
  {
    id: 10,
    title: "Career Services",
    description: "Job search and career development",
    icon: Briefcase,
    color: "#059669",
    route: "/(routes)/career-services",
    category: "Career",
  },
  {
    id: 11,
    title: "Help Desk",
    description: "General assistance and support",
    icon: HelpCircle,
    color: "#06b6d4",
    route: "/(routes)/help",
    category: "Support",
  },
  {
    id: 12,
    title: "Library",
    description: "Study spaces and book resources",
    icon: Library,
    color: "#84cc16",
    route: "/(routes)/library",
    category: "Academic",
  },
  {
    id: 13,
    title: "Sessions",
    description: "Study spaces and book resources",
    icon: Library,
    color: "#84cc16",
    route: "/(routes)/sessions",
    category: "Academic",
  },
];

export default function MenuScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredActions = universalActions.filter((action) => {
    if (searchQuery === "") return true;
    const query = searchQuery.toLowerCase();
    return (
      action.title.toLowerCase().includes(query) ||
      action.description.toLowerCase().includes(query) ||
      action.category.toLowerCase().includes(query)
    );
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xl,
    },
    section: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
    },
    searchContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    searchInput: {
      flex: 1,
      color: theme.colors.text,
      fontSize: 16,
      paddingVertical: theme.spacing.lg,
      fontWeight: "500",
      marginLeft: theme.spacing.md,
    },
    actionsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.md,
      justifyContent: "space-between",
    },
    menuCardWrapper: {
      width: (width - theme.spacing.lg * 2 - theme.spacing.md) / 2,
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: theme.spacing.xxl,
      flex: 1,
      justifyContent: "center",
    },
    emptyStateIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.border + "30",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.lg,
    },
    emptyStateText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      fontWeight: "500",
      maxWidth: 250,
    },
    sectionHeader: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.xs,
    },
    sectionSubtitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
  });

  const handleActionPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Menu" showBack={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          {/* Header Info */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Campus Services</Text>
            <Text style={styles.sectionSubtitle}>
              Access all university services and resources
            </Text>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Search color={theme.colors.textSecondary} size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search services..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Actions Grid */}
          {filteredActions.length > 0 ? (
            <View style={styles.actionsGrid}>
              {filteredActions.map((action) => (
                <View key={action.id} style={styles.menuCardWrapper}>
                  <MenuCard
                    title={action.title}
                    description={action.description}
                    icon={action.icon}
                    color={action.color}
                    onPress={() => handleActionPress(action.route)}
                    size="medium"
                    showDescription={false} // Only show icon and title
                  />
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <Search color={theme.colors.textSecondary} size={32} />
              </View>
              <Text style={styles.emptyStateText}>
                No services found matching &quot;{searchQuery}&quot;
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
