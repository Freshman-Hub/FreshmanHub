import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Animated,
  Image,
  RefreshControl,
  TextStyle,
  ViewStyle,
  ImageStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Search,
  Filter,
  Users,
  MessageCircle,
  UserPlus,
  MapPin,
  GraduationCap,
  Globe,
  Heart,
  Star,
  Calendar,
  X,
  Coffee,
  BookOpen,
  Music,
  Camera,
  Gamepad2,
  UserCheck,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

// Mock buddies data
const buddyCategories = [
  { name: "All", icon: Users, color: "#64748b" },
  { name: "My Class", icon: GraduationCap, color: "#3b82f6" },
  { name: "My Major", icon: BookOpen, color: "#059669" },
  { name: "My Country", icon: Globe, color: "#dc2626" },
  { name: "Nearby", icon: MapPin, color: "#7c3aed" },
];

const myBuddy = {
  id: 0,
  name: "Ama Asante",
  year: "Sophomore",
  major: "Computer Science",
  country: "Ghana",
  location: "Berekuso Campus",
  avatar:
    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
  bio: "Your assigned buddy! Here to help you navigate campus life and answer any questions you might have.",
  interests: ["Technology", "Music", "Photography"],
  rating: 4.9,
  helpedStudents: 23,
  isOnline: true,
  isAssigned: true,
  matchPercentage: 100,
  connectionDate: "Assigned at orientation",
  mutualConnections: 0,
};

const myConnections = [
  {
    id: 101,
    name: "Sarah Mensah",
    year: "Freshman",
    major: "Business Administration",
    country: "Ghana",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    isOnline: true,
    connectionDate: "2 weeks ago",
    mutualConnections: 5,
    isAssigned: false,
  },
  {
    id: 102,
    name: "Kwame Nkrumah",
    year: "Junior",
    major: "Engineering",
    country: "Ghana",
    avatar:
      "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
    isOnline: false,
    connectionDate: "1 week ago",
    mutualConnections: 8,
    isAssigned: false,
  },
  {
    id: 103,
    name: "Fatima Al-Zahra",
    year: "Sophomore",
    major: "Computer Science",
    country: "Nigeria",
    avatar:
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
    isOnline: true,
    connectionDate: "3 days ago",
    mutualConnections: 12,
    isAssigned: false,
  },
];

const availableBuddies = [
  {
    id: 1,
    name: "Michael Osei",
    year: "Freshman",
    major: "Computer Science",
    country: "Ghana",
    location: "Berekuso Campus",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
    bio: "Love coding and helping fellow students. Always up for study sessions and tech discussions!",
    interests: ["Programming", "Gaming", "Basketball"],
    rating: 4.7,
    helpedStudents: 12,
    isOnline: true,
    isAssigned: false,
    matchPercentage: 95,
  },
  {
    id: 2,
    name: "Sarah Mensah",
    year: "Freshman",
    major: "Business Administration",
    country: "Ghana",
    location: "Berekuso Campus",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    bio: "Passionate about entrepreneurship and connecting with like-minded individuals.",
    interests: ["Business", "Reading", "Traveling"],
    rating: 4.8,
    helpedStudents: 18,
    isOnline: false,
    isAssigned: false,
    matchPercentage: 87,
  },
  {
    id: 3,
    name: "Kwame Nkrumah",
    year: "Junior",
    major: "Engineering",
    country: "Ghana",
    location: "Berekuso Campus",
    avatar:
      "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
    bio: "Engineering student who loves problem-solving and mentoring freshmen.",
    interests: ["Engineering", "Innovation", "Sports"],
    rating: 4.9,
    helpedStudents: 31,
    isOnline: true,
    isAssigned: false,
    matchPercentage: 82,
  },
  {
    id: 4,
    name: "Fatima Al-Zahra",
    year: "Sophomore",
    major: "Computer Science",
    country: "Nigeria",
    location: "Berekuso Campus",
    avatar:
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
    bio: "International student passionate about AI and machine learning. Love helping others!",
    interests: ["AI/ML", "Photography", "Cooking"],
    rating: 4.6,
    helpedStudents: 15,
    isOnline: true,
    isAssigned: false,
    matchPercentage: 90,
  },
];

const interestIcons: Record<string, any> = {
  Technology: BookOpen,
  Music: Music,
  Photography: Camera,
  Programming: BookOpen,
  Gaming: Gamepad2,
  Basketball: Heart,
  Business: Coffee,
  Reading: BookOpen,
  Traveling: Globe,
  Engineering: BookOpen,
  Innovation: Star,
  Sports: Heart,
  "AI/ML": BookOpen,
  Cooking: Coffee,
};

export default function BuddiesScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("discover"); // 'discover' or 'connections'
  const [showFilterModal, setShowFilterModal] = useState(false);

  const searchWidth = useRef(new Animated.Value(44)).current;
  const searchOpacity = useRef(new Animated.Value(0)).current;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const expandSearch = () => {
    setIsSearchExpanded(true);
    Animated.parallel([
      Animated.timing(searchWidth, {
        toValue: 200,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(searchOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const collapseSearch = () => {
    Animated.parallel([
      Animated.timing(searchWidth, {
        toValue: 44,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(searchOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setIsSearchExpanded(false);
      setSearchQuery("");
    });
  };

  const filteredBuddies = availableBuddies.filter((buddy) => {
    const matchesCategory =
      selectedCategory === "All" ||
      (selectedCategory === "My Class" && buddy.year === "Freshman") ||
      (selectedCategory === "My Major" && buddy.major === "Computer Science") ||
      (selectedCategory === "My Country" && buddy.country === "Ghana") ||
      (selectedCategory === "Nearby" && buddy.location.includes("Berekuso"));

    const matchesSearch =
      searchQuery === "" ||
      buddy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buddy.major.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buddy.country.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleConnect = (buddyId: number) => {
    console.log("Connecting with buddy:", buddyId);
  };

  const handleMessage = (buddyId: number) => {
    console.log("Messaging buddy:", buddyId);
  };

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  const applyFilter = (category: string) => {
    setSelectedCategory(category);
    setShowFilterModal(false);
  };

  // Combine assigned buddy with other connections, with assigned buddy at top
  const allConnections = [myBuddy, ...myConnections];

  const styles = StyleSheet.create<{
    container: ViewStyle;
    header: ViewStyle;
    backButton: ViewStyle;
    headerTitle: TextStyle;
    headerActions: ViewStyle;
    searchContainer: ViewStyle;
    searchInput: TextStyle;
    searchButton: ViewStyle;
    tabsContainer: ViewStyle;
    tabButton: ViewStyle;
    tabButtonActive: ViewStyle;
    tabText: TextStyle;
    tabTextActive: TextStyle;
    scrollContent: ViewStyle;
    myBuddyContainer: ViewStyle;
    sectionTitle: TextStyle;
    myBuddyCard: ViewStyle;
    buddyCard: ViewStyle;
    connectionCard: ViewStyle;
    assignedConnectionCard: ViewStyle;
    buddyHeader: ViewStyle;
    buddyAvatar: ImageStyle;
    onlineIndicator: ViewStyle;
    buddyInfo: ViewStyle;
    buddyName: TextStyle;
    buddyDetails: TextStyle;
    buddyLocation: TextStyle;
    assignedBadge: ViewStyle;
    assignedBadgeText: TextStyle;
    matchBadge: ViewStyle;
    matchBadgeText: TextStyle;
    buddyBio: TextStyle;
    buddyStats: ViewStyle;
    statItem: ViewStyle;
    statText: TextStyle;
    interestsContainer: ViewStyle;
    interestsTitle: TextStyle;
    interestsList: ViewStyle;
    interestTag: ViewStyle;
    interestText: TextStyle;
    buddyActions: ViewStyle;
    actionButton: ViewStyle;
    filterButtonHeader: ViewStyle;
    actionButtonSecondary: ViewStyle;
    actionButtonText: TextStyle;
    actionButtonTextSecondary: TextStyle;
    buddiesContainer: ViewStyle;
    connectionsContainer: ViewStyle;
    connectionMeta: TextStyle;
    noResultsContainer: ViewStyle;
    noResultsText: TextStyle;
    filterModal: ViewStyle;
    filterContent: ViewStyle;
    filterTitle: TextStyle;
    filterOption: ViewStyle;
    filterOptionActive: ViewStyle;
    filterOptionText: TextStyle;
    filterOptionTextActive: TextStyle;
    filterActions: ViewStyle;
    filterButton: ViewStyle;
    filterButtonPrimary: ViewStyle;
    filterButtonSecondary: ViewStyle;
    filterButtonText: TextStyle;
    filterButtonTextPrimary: TextStyle;
    filterButtonTextSecondary: TextStyle;
  }>({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
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
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      flex: 1,
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    searchContainer: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.xxxl,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.sm,
      height: 40,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    searchInput: {
      flex: 1,
      color: theme.colors.text,
      fontSize: 14,
      paddingHorizontal: theme.spacing.sm,
      fontWeight: "500",
    },
    searchButton: {
      padding: theme.spacing.sm,
    },
    filterButtonHeader: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxxl,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    tabsContainer: {
      flexDirection: "row",
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    tabButton: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      alignItems: "center",
      borderRadius: theme.borderRadius.lg,
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
    myBuddyContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },
    sectionTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.md,
    },
    myBuddyCard: {
      backgroundColor: theme.colors.primary + "10",
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      borderWidth: 2,
      borderColor: theme.colors.primary + "30",
      shadowColor: theme.colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 0,
      marginBottom: theme.spacing.sm,
    },
    // LinkedIn-style compact cards
    buddyCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    connectionCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.sm,
      marginBottom: theme.spacing.md,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 0,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    assignedConnectionCard: {
      backgroundColor: theme.colors.primary + "10",
      borderWidth: 2,
      borderColor: theme.colors.primary + "30",
    },
    buddyHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    buddyAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: theme.spacing.md,
      borderWidth: 2,
      borderColor: theme.colors.primary + "40",
      position: "relative",
    },
    onlineIndicator: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: "#22c55e",
      borderWidth: 2,
      borderColor: "white",
    },
    buddyInfo: {
      flex: 1,
    },
    buddyName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: 2,
    },
    buddyDetails: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginBottom: 2,
      fontWeight: "500" as TextStyle["fontWeight"],
    },
    buddyLocation: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
    } as TextStyle,
    assignedBadge: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
      alignSelf: "flex-start",
      marginTop: theme.spacing.xs,
    },
    assignedBadgeText: {
      ...theme.typography.captionSmall,
      color: "white",
      fontWeight: "700",
    },
    matchBadge: {
      backgroundColor: theme.colors.accent + "20",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
      alignSelf: "flex-start",
      marginTop: theme.spacing.xs,
    },
    matchBadgeText: {
      ...theme.typography.captionSmall,
      color: theme.colors.accent,
      fontWeight: "700",
    },
    buddyBio: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      lineHeight: 18,
      marginBottom: theme.spacing.md,
      fontWeight: "400" as TextStyle["fontWeight"],
    },
    buddyStats: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    statItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    statText: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    interestsContainer: {
      marginBottom: theme.spacing.md,
    },
    interestsTitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: theme.spacing.xs,
    },
    interestsList: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.xs,
    },
    interestTag: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    interestText: {
      ...theme.typography.captionSmall,
      color: theme.colors.text,
      fontWeight: "600",
    },
    buddyActions: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    actionButton: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.xs,
    },
    actionButtonSecondary: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    actionButtonText: {
      ...theme.typography.bodySmall,
      color: "white",
      fontWeight: "600",
    },
    actionButtonTextSecondary: {
      color: theme.colors.text,
    },
    buddiesContainer: {
      paddingHorizontal: theme.spacing.lg,
    },
    connectionsContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
    },
    connectionMeta: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
      fontWeight: "500" as TextStyle["fontWeight"],
    },
    noResultsContainer: {
      alignItems: "center",
      paddingVertical: theme.spacing.xxl,
    },
    noResultsText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
    } as TextStyle,
    // Filter Modal
    filterModal: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    filterContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.xl,
      margin: theme.spacing.xl,
      maxWidth: 300,
      width: "100%",
    },
    filterTitle: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.lg,
      textAlign: "center",
    },
    filterOption: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.sm,
    },
    filterOptionActive: {
      backgroundColor: theme.colors.primary + "20",
    },
    filterOptionText: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginLeft: theme.spacing.md,
      fontWeight: "500",
    },
    filterOptionTextActive: {
      color: theme.colors.primary,
      fontWeight: "600",
    },
    filterActions: {
      flexDirection: "row",
      gap: theme.spacing.md,
      marginTop: theme.spacing.lg,
    },
    filterButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      alignItems: "center",
    },
    filterButtonPrimary: {
      backgroundColor: theme.colors.primary,
    },
    filterButtonSecondary: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    filterButtonText: {
      ...theme.typography.button,
      fontWeight: "600",
    },
    filterButtonTextPrimary: {
      color: "white",
    },
    filterButtonTextSecondary: {
      color: theme.colors.text,
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
        <Text style={styles.headerTitle}>Find Buddies</Text>
        <View style={styles.headerActions}>
          <Animated.View
            style={[styles.searchContainer, { width: searchWidth }]}
          >
            {!isSearchExpanded ? (
              <TouchableOpacity
                style={styles.searchButton}
                onPress={expandSearch}
              >
                <Search color={theme.colors.textSecondary} size={20} />
              </TouchableOpacity>
            ) : (
              <>
                <Animated.View style={{ opacity: searchOpacity, flex: 1 }}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search buddies..."
                    placeholderTextColor={theme.colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoFocus
                  />
                </Animated.View>
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={collapseSearch}
                >
                  <X color={theme.colors.textSecondary} size={18} />
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
          <TouchableOpacity
            style={styles.filterButtonHeader}
            onPress={handleFilterPress}
          >
            <Filter color={theme.colors.textSecondary} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "discover" && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab("discover")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "discover" && styles.tabTextActive,
            ]}
          >
            Discover
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "connections" && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab("connections")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "connections" && styles.tabTextActive,
            ]}
          >
            My Connections
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
        {activeTab === "discover" ? (
          <>
            <View style={styles.myBuddyContainer}>
              <Text style={styles.sectionTitle}>Your Assigned Buddy</Text>
              <View style={styles.myBuddyCard}>
                <View style={styles.buddyHeader}>
                  <View style={{ position: "relative" }}>
                    <Image
                      source={{ uri: myBuddy.avatar }}
                      style={styles.buddyAvatar}
                    />
                    {myBuddy.isOnline && (
                      <View style={styles.onlineIndicator} />
                    )}
                  </View>
                  <View style={styles.buddyInfo}>
                    <Text style={styles.buddyName}>{myBuddy.name}</Text>
                    <Text style={styles.buddyDetails}>
                      {myBuddy.year} • {myBuddy.major}
                    </Text>
                    <Text style={styles.buddyLocation}>
                      {myBuddy.country} • {myBuddy.location}
                    </Text>
                    <View style={styles.assignedBadge}>
                      <Text style={styles.assignedBadgeText}>
                        Assigned Buddy
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.buddyBio}>{myBuddy.bio}</Text>

                <View style={styles.buddyStats}>
                  <View style={styles.statItem}>
                    <Star color="#f59e0b" size={14} fill="#f59e0b" />
                    <Text style={styles.statText}>{myBuddy.rating}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Users color={theme.colors.textSecondary} size={14} />
                    <Text style={styles.statText}>
                      {myBuddy.helpedStudents} helped
                    </Text>
                  </View>
                </View>

                <View style={styles.interestsContainer}>
                  <Text style={styles.interestsTitle}>Interests</Text>
                  <View style={styles.interestsList}>
                    {myBuddy.interests.map((interest, index) => {
                      const IconComponent = interestIcons[interest] || BookOpen;
                      return (
                        <View key={index} style={styles.interestTag}>
                          <IconComponent
                            color={theme.colors.primary}
                            size={12}
                          />
                          <Text style={styles.interestText}>{interest}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.buddyActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleMessage(myBuddy.id)}
                  >
                    <MessageCircle color="white" size={16} />
                    <Text style={styles.actionButtonText}>Message</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.actionButtonSecondary]}
                  >
                    <Calendar color={theme.colors.text} size={16} />
                    <Text
                      style={[
                        styles.actionButtonText,
                        styles.actionButtonTextSecondary,
                      ]}
                    >
                      Schedule
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.buddiesContainer}>
              <Text style={styles.sectionTitle}>
                Connect with Other Students
              </Text>
              {filteredBuddies.length > 0 ? (
                filteredBuddies.map((buddy) => (
                  <View key={buddy.id} style={styles.buddyCard}>
                    <View style={styles.buddyHeader}>
                      <View style={{ position: "relative" }}>
                        <Image
                          source={{ uri: buddy.avatar }}
                          style={styles.buddyAvatar}
                        />
                        {buddy.isOnline && (
                          <View style={styles.onlineIndicator} />
                        )}
                      </View>
                      <View style={styles.buddyInfo}>
                        <Text style={styles.buddyName}>{buddy.name}</Text>
                        <Text style={styles.buddyDetails}>
                          {buddy.year} • {buddy.major}
                        </Text>
                        <Text style={styles.buddyLocation}>
                          {buddy.country} • {buddy.location}
                        </Text>
                        <View style={styles.matchBadge}>
                          <Text style={styles.matchBadgeText}>
                            {buddy.matchPercentage}% match
                          </Text>
                        </View>
                      </View>
                    </View>

                    <Text style={styles.buddyBio}>{buddy.bio}</Text>

                    <View style={styles.buddyStats}>
                      <View style={styles.statItem}>
                        <Star color="#f59e0b" size={14} fill="#f59e0b" />
                        <Text style={styles.statText}>{buddy.rating}</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Users color={theme.colors.textSecondary} size={14} />
                        <Text style={styles.statText}>
                          {buddy.helpedStudents} helped
                        </Text>
                      </View>
                    </View>

                    <View style={styles.interestsContainer}>
                      <Text style={styles.interestsTitle}>Interests</Text>
                      <View style={styles.interestsList}>
                        {buddy.interests.map((interest, index) => {
                          const IconComponent =
                            interestIcons[interest] || BookOpen;
                          return (
                            <View key={index} style={styles.interestTag}>
                              <IconComponent
                                color={theme.colors.primary}
                                size={12}
                              />
                              <Text style={styles.interestText}>
                                {interest}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    </View>

                    <View style={styles.buddyActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleConnect(buddy.id)}
                      >
                        <UserPlus color="white" size={16} />
                        <Text style={styles.actionButtonText}>Connect</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          styles.actionButtonSecondary,
                        ]}
                        onPress={() => handleMessage(buddy.id)}
                      >
                        <MessageCircle color={theme.colors.text} size={16} />
                        <Text
                          style={[
                            styles.actionButtonText,
                            styles.actionButtonTextSecondary,
                          ]}
                        >
                          Message
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>
                    {searchQuery
                      ? `No buddies found for "${searchQuery}"`
                      : `No buddies found in ${selectedCategory} category`}
                  </Text>
                </View>
              )}
            </View>
          </>
        ) : (
          <View style={styles.connectionsContainer}>
            <Text style={styles.sectionTitle}>
              My Connections ({allConnections.length})
            </Text>
            {allConnections.map((connection) => (
              <View
                key={connection.id}
                style={[
                  styles.connectionCard,
                  connection.isAssigned && styles.assignedConnectionCard,
                ]}
              >
                <View style={styles.buddyHeader}>
                  <View style={{ position: "relative" }}>
                    <Image
                      source={{ uri: connection.avatar }}
                      style={styles.buddyAvatar}
                    />
                    {connection.isOnline && (
                      <View style={styles.onlineIndicator} />
                    )}
                  </View>
                  <View style={styles.buddyInfo}>
                    <Text style={styles.buddyName}>{connection.name}</Text>
                    <Text style={styles.buddyDetails}>
                      {connection.year} • {connection.major}
                    </Text>
                    <Text style={styles.buddyLocation}>
                      {connection.country}
                    </Text>
                    {connection.isAssigned ? (
                      <View style={styles.assignedBadge}>
                        <Text style={styles.assignedBadgeText}>
                          Assigned Buddy
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.connectionMeta}>
                        Connected {connection.connectionDate} •{" "}
                        {connection.mutualConnections} mutual connections
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.buddyActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleMessage(connection.id)}
                  >
                    <MessageCircle color="white" size={16} />
                    <Text style={styles.actionButtonText}>Message</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.actionButtonSecondary]}
                  >
                    <UserCheck color={theme.colors.text} size={16} />
                    <Text
                      style={[
                        styles.actionButtonText,
                        styles.actionButtonTextSecondary,
                      ]}
                    >
                      Connected
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Filter Modal */}
      {showFilterModal && (
        <View style={styles.filterModal}>
          <View style={styles.filterContent}>
            <Text style={styles.filterTitle}>Filter Buddies</Text>

            {buddyCategories.map((category) => {
              const IconComponent = category.icon;
              const isActive = selectedCategory === category.name;
              return (
                <TouchableOpacity
                  key={category.name}
                  style={[
                    styles.filterOption,
                    isActive && styles.filterOptionActive,
                  ]}
                  onPress={() => applyFilter(category.name)}
                >
                  <IconComponent
                    color={
                      isActive ? category.color : theme.colors.textSecondary
                    }
                    size={20}
                  />
                  <Text
                    style={[
                      styles.filterOptionText,
                      isActive && styles.filterOptionTextActive,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <View style={styles.filterActions}>
              <TouchableOpacity
                style={[styles.filterButton, styles.filterButtonSecondary]}
                onPress={() => setShowFilterModal(false)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    styles.filterButtonTextSecondary,
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
