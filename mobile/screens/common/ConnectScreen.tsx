"use client";

import { useState, useCallback, useEffect } from "react";
import {
  ScrollView,
  RefreshControl,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Animated,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Search,
  Plus,
  Check,
  ArrowLeft,
  Users,
  MapPin,
  GraduationCap,
  Calendar,
  Handshake,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Header } from "@/components/ui/Header";
import { Avatar } from "@/components/ui/Avatar";
import { UserDetailModal } from "@/components/modals/user-detail-modal";
import type { User as UserType } from "@/types/user.types";
import { UserService } from "@/services/user.service";
import { RelationService } from "@/services/relation.service";
import { useUser } from "@/contexts/UserContext";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 12;
const NUM_COLUMNS = 2;
const PADDING_HORIZONTAL = 24;
const CARD_WIDTH = (width - 2 * PADDING_HORIZONTAL - CARD_MARGIN) / NUM_COLUMNS;

type FriendStatus = "accepted" | "pending" | "sent" | "received" | "none";

interface ConnectUser extends UserType {
  mutuals: number;
  isFriend: boolean;
  friendStatus: FriendStatus;
  relationshipId?: string;
}

export default function ConnectScreen() {
  const { theme } = useTheme();
  const user = useUser();
  const router = useRouter();
  const params = useLocalSearchParams();
  const connectType = params.type as
    | "freshman"
    | "continuous_student"
    | undefined;

  const [refreshing, setRefreshing] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ConnectUser | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"my" | "explore">("my");
  const [allConnectUsers, setAllConnectUsers] = useState<ConnectUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();
    return () => {
      pulseAnimation.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch users and relationships from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const loggedInUserId = user.user?.id ?? "";
      setCurrentUserId(loggedInUserId);

      // Get all users
      const { users, error: userError } = await UserService.getAllUsers();
      if (userError) {
        setLoading(false);
        return;
      }

      // Get all relationships for logged in user (as sender)
      const { relationships: sentRelations } =
        await RelationService.getRelationshipsForUser(loggedInUserId, "friend");
      // Get all relationships where logged in user is the target (received requests)
      const { relationships: receivedRelations } =
        await RelationService.getRelationshipsForUser(
          loggedInUserId,
          "friend",
          undefined
        );

      // Build status maps
      const sentMap: Record<string, { status: FriendStatus; id: string }> = {};
      sentRelations.forEach((r) => {
        if (r.status === "accepted")
          sentMap[r.targetId] = { status: "accepted", id: r.id };
        else if (r.status === "pending")
          sentMap[r.targetId] = { status: "sent", id: r.id };
      });
      const receivedMap: Record<string, { status: FriendStatus; id: string }> =
        {};
      receivedRelations.forEach((r) => {
        if (r.status === "accepted")
          receivedMap[r.userId] = { status: "accepted", id: r.id };
        else if (r.status === "pending")
          receivedMap[r.userId] = { status: "received", id: r.id };
      });

      // For each user, get mutual friends count and status
      const connectUsers: ConnectUser[] = await Promise.all(
        users
          .filter((u) => u.id !== loggedInUserId)
          .map(async (user) => {
            const { mutualFriendIds } = await RelationService.getMutualFriends(
              loggedInUserId,
              user.id
            );
            let friendStatus: FriendStatus = "none";
            let relationshipId: string | undefined;
            if (sentMap[user.id]) {
              friendStatus = sentMap[user.id].status;
              relationshipId = sentMap[user.id].id;
            } else if (receivedMap[user.id]) {
              friendStatus = receivedMap[user.id].status;
              relationshipId = receivedMap[user.id].id;
            }
            if (
              sentMap[user.id]?.status === "accepted" ||
              receivedMap[user.id]?.status === "accepted"
            ) {
              friendStatus = "accepted";
            }
            return {
              ...user,
              mutuals: mutualFriendIds.length,
              isFriend: friendStatus === "accepted",
              friendStatus,
              relationshipId,
            };
          })
      );

      setAllConnectUsers(connectUsers);
      setLoading(false);
    };
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const handleCardPress = (user: ConnectUser) => {
    setSelectedContact(user);
    setModalVisible(true);
  };

  const handleConnect = async (user: ConnectUser) => {
    setLoading(true);
    await RelationService.addRelationship(
      currentUserId,
      user.id,
      "friend",
      "pending"
    );
    setAllConnectUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, friendStatus: "sent" } : u))
    );
    setModalVisible(false);
    setLoading(false);
  };

  const handleAccept = async (user: ConnectUser) => {
    setLoading(true);
    if (user.relationshipId) {
      await RelationService.updateRelationship(user.relationshipId, {
        status: "accepted",
      });
      setAllConnectUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? { ...u, friendStatus: "accepted", isFriend: true }
            : u
        )
      );
    }
    setModalVisible(false);
    setLoading(false);
  };

  const handleUnconnect = async (user: ConnectUser) => {
    setLoading(true);
    if (user.relationshipId) {
      await RelationService.removeRelationship(user.relationshipId);
      setAllConnectUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? {
                ...u,
                friendStatus: "none",
                isFriend: false,
                relationshipId: undefined,
              }
            : u
        )
      );
    }
    setModalVisible(false);
    setLoading(false);
  };

  const filteredUsers = allConnectUsers.filter((user) => {
    const matchesType =
      !connectType ||
      (connectType === "freshman" && user.role === "freshman") ||
      (connectType === "continuous_student" && user.role === "continuous");
    const matchesSearch =
      searchTerm.toLowerCase() === "" ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.major?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.yearGroup?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const myConnections = filteredUsers.filter((user) => user.isFriend);
  const exploreConnections = filteredUsers.filter((user) => !user.isFriend);

  const screenTitle =
    connectType === "freshman"
      ? "Meet Your Cohort"
      : connectType === "continuous_student"
        ? "Personalized Connections"
        : "Connect with Peers";

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xl,
      paddingHorizontal: PADDING_HORIZONTAL,
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
      justifyContent: "space-between",
      marginHorizontal: 0,
    },
    personCard: {
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
      width: CARD_WIDTH,
      marginHorizontal: 0,
      alignItems: "center",
    },
    avatarContainer: {
      position: "relative",
      marginBottom: theme.spacing.md,
    },
    onlineIndicator: {
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: "#22c55e",
      position: "absolute",
      top: -2,
      right: -2,
      borderWidth: 2,
      borderColor: "white",
    },
    personName: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      fontWeight: "800",
      marginBottom: theme.spacing.xs,
      textAlign: "center",
    },
    personMetaContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    personMetaItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    personMetaText: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
      marginLeft: theme.spacing.xs,
    },
    connectButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      flexDirection: "row",
      alignItems: "center",
    },
    connectText: {
      ...theme.typography.captionSmall,
      color: "white",
      fontWeight: "700",
      marginLeft: theme.spacing.xs,
    },
    connectedButton: {
      backgroundColor: theme.colors.success,
    },
    connectedButtonText: {
      color: "white",
    },
    pendingButton: {
      backgroundColor: theme.colors.warning,
    },
    acceptButton: {
      backgroundColor: theme.colors.info,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: theme.spacing.md,
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
      width: "100%",
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
      paddingVertical: theme.spacing.sm,
      alignItems: "center",
      justifyContent: "center",
    },
    tabButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    tabText: {
      ...theme.typography.caption,
      fontWeight: "700",
    },
    tabTextActive: {
      color: "white",
    },
    tabTextInactive: {
      color: theme.colors.textSecondary,
    },
  });

  const renderPersonCards = (users: ConnectUser[]) => (
    <View style={styles.gridContainer}>
      {users.length > 0 ? (
        users.map((person) => (
          <TouchableOpacity
            key={person.id}
            style={styles.personCard}
            activeOpacity={0.9}
            onPress={() => handleCardPress(person)}
          >
            <View style={styles.avatarContainer}>
              <Avatar
                imageUrl={person.profileImage}
                initials={`${person.firstName.charAt(0)}${person.lastName.charAt(0)}`}
                size={60}
              />
              {person.online && (
                <Animated.View
                  style={[
                    styles.onlineIndicator,
                    { transform: [{ scale: pulseAnim }] },
                  ]}
                />
              )}
            </View>
            <Text style={styles.personName}>
              {person.firstName} {person.lastName}
            </Text>

            <View style={styles.personMetaContainer}>
              <View style={styles.personMetaItem}>
                <MapPin color={theme.colors.textSecondary} size={14} />
                <Text style={styles.personMetaText}>{person.country}</Text>
              </View>
              <View style={styles.personMetaItem}>
                <GraduationCap color={theme.colors.textSecondary} size={14} />
                <Text style={styles.personMetaText}>{person.major}</Text>
              </View>
              <View style={styles.personMetaItem}>
                <Calendar color={theme.colors.textSecondary} size={14} />
                <Text style={styles.personMetaText}>{person.yearGroup}</Text>
              </View>
              <View style={styles.personMetaItem}>
                <Users color={theme.colors.textSecondary} size={14} />
                <Text style={styles.personMetaText}>
                  {person.mutuals} mutuals
                </Text>
              </View>
            </View>

            {/* Button logic for different friendStatus */}
            {person.isFriend ? (
              <TouchableOpacity
                style={[styles.connectButton, styles.connectedButton]}
                onPress={() => handleUnconnect(person)}
              >
                <Check color="white" size={16} />
                <Text style={[styles.connectText, styles.connectedButtonText]}>
                  Connected
                </Text>
              </TouchableOpacity>
            ) : person.friendStatus === "sent" ? (
              <TouchableOpacity
                style={[styles.connectButton, styles.pendingButton]}
                disabled
              >
                <Text style={[styles.connectText, { color: "white" }]}>
                  Request Sent
                </Text>
              </TouchableOpacity>
            ) : person.friendStatus === "received" ? (
              <TouchableOpacity
                style={[styles.connectButton, styles.acceptButton]}
                onPress={() => handleAccept(person)}
              >
                <Handshake color="white" size={16} />
                <Text style={[styles.connectText, { color: "white" }]}>
                  Accept
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.connectButton}
                onPress={() => handleConnect(person)}
              >
                <Plus color="white" size={16} />
                <Text style={styles.connectText}>Connect</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noResultsText}>
          {activeTab === "my" && searchTerm === ""
            ? "You have no connections yet."
            : "No peers found matching your search criteria."}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={screenTitle}
        leftIcon={ArrowLeft}
        onLeftPress={() => router.back()}
        rightIcon={Search}
        onRightPress={() => console.log("Search Peers")}
        style={{
          backgroundColor: theme.colors.background,
          borderBottomWidth: 0,
        }}
      />

      <View style={styles.searchContainer}>
        <Search color={theme.colors.textSecondary} size={20} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, country, major, class..."
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
            My Connections
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

      {loading ? (
        <ActivityIndicator
          style={{ marginTop: theme.spacing.xl }}
          size="large"
          color={theme.colors.primary}
        />
      ) : (
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.scrollContent}
        >
          {activeTab === "my" && renderPersonCards(myConnections)}
          {activeTab === "explore" && renderPersonCards(exploreConnections)}
          {filteredUsers.length === 0 && searchTerm !== "" && (
            <Text style={styles.noResultsText}>
              No peers found matching your search criteria.
            </Text>
          )}
        </ScrollView>
      )}

      {selectedContact && (
        <UserDetailModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          user={selectedContact}
          onStartChat={() =>
            console.log("Start chat with", selectedContact.firstName)
          }
          onCall={() => console.log("Call", selectedContact.firstName)}
          onConnect={() => handleConnect(selectedContact)}
          onUnconnect={() => handleUnconnect(selectedContact)}
          onBlock={() => console.log("Block", selectedContact.firstName)}
          onUnblock={() => console.log("Unblock", selectedContact.firstName)}
          onReport={() => console.log("Report", selectedContact.firstName)}
          isFriend={selectedContact.isFriend}
          isBlocked={false}
          currentUserId={currentUserId}
        />
      )}
    </SafeAreaView>
  );
}
