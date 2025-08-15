"use client";

import { useState, useCallback } from "react";
import {
  ScrollView,
  RefreshControl,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, Plus, Check, ArrowLeft } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import { Header } from "@/components/ui/Header";
import { ClubDetailModal } from "@/components/modals/club-detail-modal"; // Import the new modal
import type { Club as ClubType } from "@/types/club.types"; // Assuming you'll create this type

const { width } = Dimensions.get("window");
const CARD_MARGIN = 12; // Margin between cards
const NUM_COLUMNS = 2;
const PADDING_HORIZONTAL = 24; // Corresponds to theme.spacing.lg

// Calculate card width dynamically to ensure two columns fit
const CARD_WIDTH = (width - 2 * PADDING_HORIZONTAL - CARD_MARGIN) / NUM_COLUMNS;

// Mock Data for Clubs and Societies
const clubsAndSocieties: ClubType[] = [
  {
    id: 1,
    name: "Ashesi Robotics Club",
    members: 75,
    focus: "Innovation, AI, Engineering",
    logo: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400",
    description:
      "Explore the world of robotics, AI, and automation. Build, innovate, and compete!",
    isJoined: true,
    membersList: [
      {
        id: "user1",
        firstName: "Aisha",
        lastName: "Khan",
        profileImage:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        id: "user6",
        firstName: "Chidi",
        lastName: "Okoro",
        profileImage:
          "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        id: "user3",
        firstName: "Sarah",
        lastName: "Mensah",
        profileImage:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
    ],
  },
  {
    id: 2,
    name: "Debate Society",
    members: 40,
    focus: "Public Speaking, Critical Thinking",
    logo: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    description:
      "Sharpen your public speaking and critical thinking skills through engaging debates.",
    isJoined: false,
    membersList: [
      {
        id: "user2",
        firstName: "David",
        lastName: "Lee",
        profileImage:
          "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        id: "user4",
        firstName: "Kwame",
        lastName: "Asante",
        profileImage:
          "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
    ],
  },
  {
    id: 3,
    name: "Ashesi Green Club",
    members: 60,
    focus: "Sustainability, Environmental Action",
    logo: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400",
    description:
      "Promoting environmental awareness and sustainable practices on campus and beyond.",
    isJoined: true,
    membersList: [
      {
        id: "user1",
        firstName: "Aisha",
        lastName: "Khan",
        profileImage:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        id: "user5",
        firstName: "Fatima",
        lastName: "Al-Hassan",
        profileImage:
          "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
    ],
  },
  {
    id: 4,
    name: "Literary Society",
    members: 30,
    focus: "Reading, Writing, Creative Arts",
    logo: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400",
    description:
      "A community for book lovers, aspiring writers, and creative minds.",
    isJoined: false,
    membersList: [],
  },
  {
    id: 5,
    name: "Ashesi Entrepreneurship Club",
    members: 90,
    focus: "Business, Startups, Innovation",
    logo: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
    description:
      "Fostering entrepreneurial spirit and supporting student startups.",
    isJoined: false,
    membersList: [],
  },
  {
    id: 6,
    name: "Chess Club",
    members: 25,
    focus: "Strategy, Logic, Mind Games",
    logo: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Master the game of kings and challenge your peers.",
    isJoined: true,
    membersList: [],
  },
  {
    id: 7,
    name: "Photography Club",
    members: 50,
    focus: "Art, Visuals, Creativity",
    logo: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Capture campus life and hone your photography skills.",
    isJoined: false,
    membersList: [],
  },
];

export default function ClubsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"my" | "explore">("my"); // New state for tabs
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClub, setSelectedClub] = useState<ClubType | null>(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const handleCardPress = (club: ClubType) => {
    setSelectedClub(club);
    setModalVisible(true);
  };

  const filteredClubs = clubsAndSocieties.filter(
    (club) =>
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.focus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const myClubs = filteredClubs.filter((club) => club.isJoined);
  const exploreClubs = filteredClubs.filter((club) => !club.isJoined);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xl,
      paddingHorizontal: PADDING_HORIZONTAL, // Use defined padding
    },
    sectionTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "800",
      marginBottom: theme.spacing.lg,
      marginTop: theme.spacing.xl,
    },
    gridContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between", // Distribute items evenly
      marginHorizontal: 0, // No negative margin here
    },
    clubCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      marginBottom: CARD_MARGIN,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
      width: CARD_WIDTH, // Use calculated width
      marginHorizontal: 0, // No horizontal margin on card itself
      alignItems: "center",
    },
    clubLogo: {
      width: 60,
      height: 60,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.sm,
    },
    clubInfo: {
      flex: 1,
      alignItems: "center",
    },
    clubName: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      fontWeight: "800",
      marginBottom: theme.spacing.xs,
      textAlign: "center",
    },
    clubMeta: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      textAlign: "center",
    },
    joinButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "center",
      marginTop: theme.spacing.md,
    },
    joinButtonText: {
      ...theme.typography.captionSmall,
      color: "white",
      fontWeight: "700",
      marginLeft: theme.spacing.xs,
    },
    joinedButton: {
      backgroundColor: theme.colors.success, // Green for joined
    },
    joinedButtonText: {
      color: "white",
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      marginHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    searchInput: {
      flex: 1,
      ...theme.typography.body,
      color: theme.colors.text,
        marginLeft: theme.spacing.sm,
        fontWeight: "500",
    },
    noResultsText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: theme.spacing.xl,
        width: "100%", // Ensure it takes full width in grid
        fontWeight: "500",
    },
    tabContainer: {
      flexDirection: "row",
      marginHorizontal: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: "hidden",
      marginBottom: theme.spacing.lg,
    },
    tabButton: {
      flex: 1,
      paddingVertical: theme.spacing.sm, // Smaller padding
      alignItems: "center",
      justifyContent: "center",
    },
    tabButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    tabText: {
      ...theme.typography.caption, // Smaller font size
      fontWeight: "700",
    },
    tabTextActive: {
      color: "white",
    },
    tabTextInactive: {
      color: theme.colors.textSecondary,
    },
  });

  const renderClubCards = (clubs: typeof clubsAndSocieties) => (
    <View style={styles.gridContainer}>
      {clubs.length > 0 ? (
        clubs.map((club) => (
          <TouchableOpacity
            key={club.id}
            style={styles.clubCard}
            activeOpacity={0.8}
            onPress={() => handleCardPress(club)}
          >
            <Image
              source={{ uri: club.logo }}
              style={styles.clubLogo}
              resizeMode="cover"
            />
            <View style={styles.clubInfo}>
              <Text style={styles.clubName}>{club.name}</Text>
              <Text style={styles.clubMeta}>{club.members} members</Text>
              <Text style={styles.clubMeta}>{club.focus}</Text>
              <TouchableOpacity
                style={[
                  styles.joinButton,
                  club.isJoined && styles.joinedButton,
                ]}
                onPress={() =>
                  console.log(
                    club.isJoined ? "View Club" : "Join Club",
                    club.name
                  )
                }
              >
                {club.isJoined ? (
                  <Check color="white" size={16} />
                ) : (
                  <Plus color="white" size={16} />
                )}
                <Text
                  style={[
                    styles.joinButtonText,
                    club.isJoined && styles.joinedButtonText,
                  ]}
                >
                  {club.isJoined ? "Joined" : "Join Club"}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noResultsText}>
          {activeTab === "my" && searchTerm === ""
            ? "You haven't joined any clubs yet."
            : "No clubs found matching your search."}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Header
        title="Clubs & Societies"
        leftIcon={ArrowLeft}
        onLeftPress={() => router.back()}
        rightIcon={Search}
        onRightPress={() => console.log("Search Clubs")}
        style={{
          backgroundColor: theme.colors.background,
          borderBottomWidth: 0,
        }}
      />

      <View style={styles.searchContainer}>
        <Search color={theme.colors.textSecondary} size={20} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search clubs..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "my" && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab("my")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "my"
                ? styles.tabTextActive
                : styles.tabTextInactive,
            ]}
          >
            My Clubs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "explore" && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab("explore")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "explore"
                ? styles.tabTextActive
                : styles.tabTextInactive,
            ]}
          >
            Explore
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === "my" && renderClubCards(myClubs)}
        {activeTab === "explore" && renderClubCards(exploreClubs)}

        {/* Only show no results if search term is active and no clubs found in either tab */}
        {filteredClubs.length === 0 && searchTerm !== "" && (
          <Text style={styles.noResultsText}>
            No clubs found matching your search criteria.
          </Text>
        )}
      </ScrollView>

      {selectedClub && (
        <ClubDetailModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          club={selectedClub}
          onJoinClub={() => console.log("Join Club", selectedClub.name)}
          onLeaveClub={() => console.log("Leave Club", selectedClub.name)}
        />
      )}
    </SafeAreaView>
  );
}
