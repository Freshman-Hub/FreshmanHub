"use client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import { ChatService } from "@/services/chat.service";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ChatFilterTabs } from "@/components/chats/ChatFilterTabs";
import { ChatHeader } from "@/components/chats/ChatHeader";
import { ChatListItem } from "@/components/chats/ChatListItem";
import { ChatSelectionHeader } from "@/components/chats/ChatSelectionHeader";
import { ChatTabNavigation } from "@/components/chats/ChatTabNavigation";
import { FloatingActionButton } from "@/components/chats/FloatingActionButton";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("chats");
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const { user } = useUser();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filters = ["All", "Unread", "Groups", "Friends", "Anonymous"];

  // Transform chat data to match UI expectations
  const transformChatData = async (chat: any) => {
    // For direct chats, resolve the other user's name
    let displayName = chat.name || "Unknown";
    if (chat.type === "direct" && chat.participants && user?.id) {
      const otherUserId = chat.participants.find(
        (id: string) => id !== user.id
      );
      if (otherUserId) {
        try {
          const users = await ChatService.getLocalUsers();
          const otherUser = users.find((u) => u.id === otherUserId);
          if (otherUser) {
            displayName = `${otherUser.firstName} ${otherUser.lastName}`;
          }
        } catch (error) {
          console.error("Error resolving chat name:", error);
        }
      }
    }

    return {
      id: chat.id,
      name: displayName,
      lastMessage: chat.lastMessage || "",
      timestamp: chat.timestamp
        ? new Date(chat.timestamp.toDate()).toLocaleDateString()
        : "",
      unreadCount: chat.unreadCount || 0,
      avatar: chat.avatar || null,
      isOnline: chat.isOnline || false,
      type: chat.type || "direct",
      isVerified: chat.isVerified || false,
    };
  };

  useEffect(() => {
    if (!user?.id) return;

    setLoading(true);

    // Set up real-time listener for chats
    const unsubscribe = ChatService.listenChatsFirestore(
      async (updatedChats) => {
        const transformedChats = await Promise.all(
          updatedChats.map(transformChatData)
        );
        setChats(transformedChats);
        setLoading(false);
      },
      user.id
    );

    return () => {
      unsubscribe();
    };
  }, [user?.id]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const fetchedChats = await ChatService.getLocalChats(50, 0, user?.id);
      const transformedChats = await Promise.all(
        fetchedChats.map(transformChatData)
      );
      setChats(transformedChats);
    } catch (err) {
      setError("Failed to refresh chats");
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  }, [user?.id]);

  const handleChatPress = (chatId: string) => {
    if (selectedChats.length > 0) {
      // Toggle selection if in selection mode
      setSelectedChats((prev) =>
        prev.includes(chatId)
          ? prev.filter((id) => id !== chatId)
          : [...prev, chatId]
      );
    } else {
      // Navigate to chat
      router.push(`/(routes)/chats/${chatId}`);
    }
  };

  const handleChatLongPress = (chatId: string) => {
    setSelectedChats([chatId]);
  };

  const handleSelectionBack = () => {
    setSelectedChats([]);
  };

  const handleSearchPress = () => {
    // TODO: Implement search functionality
    console.log("Search pressed");
  };

  const handleNewChatPress = () => {
    router.push("/(routes)/chats/select-contact");
  };

  const handleSelectAll = () => {
    const allChatIds = chats.map((chat) => chat.id);
    setSelectedChats(allChatIds);
  };

  const handleUnselectAll = () => {
    setSelectedChats([]);
  };

  const handleMarkAsRead = () => {
    // TODO: Mark selected chats as read in backend
    console.log("Marking chats as read:", selectedChats);
    setSelectedChats([]);
  };

  const handleDeleteChats = () => {
    // TODO: Delete selected chats
    console.log("Deleting chats:", selectedChats);
    setSelectedChats([]);
  };

  // Filter chats based on active tab
  const getFilteredChats = () => {
    let tabFilteredChats = chats;

    // Filter by tab
    switch (activeTab) {
      case "private":
        tabFilteredChats = chats.filter((chat) => chat.type === "direct");
        break;
      case "communities":
        tabFilteredChats = chats.filter(
          (chat) => chat.type === "group" || chat.type === "announcement"
        );
        break;
      case "anonymous":
        tabFilteredChats = chats.filter((chat) => chat.type === "anonymous");
        break;
      case "chats":
      default:
        // Show all chats
        tabFilteredChats = chats;
        break;
    }

    // Apply additional filters for the "chats" tab
    if (activeTab === "chats") {
      tabFilteredChats = tabFilteredChats.filter((chat) => {
        const matchesFilter =
          selectedFilter === "All" ||
          (selectedFilter === "Unread" && chat.unreadCount > 0) ||
          (selectedFilter === "Groups" &&
            (chat.type === "group" || chat.type === "announcement")) ||
          (selectedFilter === "Friends" && chat.type === "direct") ||
          (selectedFilter === "Anonymous" && chat.type === "anonymous");

        return matchesFilter;
      });
    }

    // Apply search filter
    return tabFilteredChats.filter((chat) => {
      const matchesSearch =
        searchQuery === "" ||
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  };

  const filteredChats = getFilteredChats();

  // Calculate unread counts for each tab
  const getUnreadCounts = () => {
    const counts = {
      chats: 0,
      private: 0,
      communities: 0,
      anonymous: 0,
    };

    chats.forEach((chat) => {
      const unreadCount = chat.unreadCount || 0;

      if (chat.type === "direct") {
        counts.private += unreadCount;
      } else if (chat.type === "group" || chat.type === "announcement") {
        counts.communities += unreadCount;
      } else if (chat.type === "anonymous") {
        counts.anonymous += unreadCount;
      }

      // Add to total chats count
      counts.chats += unreadCount;
    });

    return counts;
  };

  const unreadCounts = getUnreadCounts();

  const getTabTitle = () => {
    switch (activeTab) {
      case "private":
        return "Private Chats";
      case "communities":
        return "Communities";
      case "anonymous":
        return "Anonymous Chats";
      case "chats":
      default:
        return "Messages";
    }
  };

  const getEmptyMessage = () => {
    if (searchQuery) {
      return `No chats found for "${searchQuery}"`;
    }

    switch (activeTab) {
      case "private":
        return "No private chats yet";
      case "communities":
        return "No communities joined yet";
      case "anonymous":
        return "No anonymous chats yet";
      case "chats":
      default:
        return `No ${selectedFilter.toLowerCase()} chats found`;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xl,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xxl,
    },
    emptyText: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: theme.spacing.md,
    },
    anonymousInfo: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      margin: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      alignItems: "center",
    },
    anonymousTitle: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: theme.spacing.sm,
    },
    anonymousDescription: {
      fontSize: theme.typography.bodySmall.fontSize,
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: 18,
    },
  });

  if (loading && chats.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {selectedChats.length > 0 ? (
            <ChatSelectionHeader
              selectedCount={selectedChats.length}
              totalCount={filteredChats.length}
              onBack={handleSelectionBack}
              onPin={() => console.log("Pin chats")}
              onDelete={handleDeleteChats}
              onMute={() => console.log("Mute chats")}
              onArchive={() => console.log("Archive chats")}
              onMarkAsRead={handleMarkAsRead}
              onSelectAll={handleSelectAll}
              onUnselectAll={handleUnselectAll}
            />
          ) : (
            <ChatHeader
              title={getTabTitle()}
              onSearchPress={handleSearchPress}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}

          {/* Show filter tabs only for main chats tab */}
          {activeTab === "chats" && (
            <ChatFilterTabs
              filters={filters}
              selectedFilter={selectedFilter}
              onFilterSelect={setSelectedFilter}
            />
          )}

          {/* Anonymous info for anonymous tab */}
          {activeTab === "anonymous" &&
            filteredChats.length === 0 &&
            !searchQuery && (
              <View style={styles.anonymousInfo}>
                <Text style={styles.anonymousTitle}>Anonymous Chats</Text>
                <Text style={styles.anonymousDescription}>
                  Connect with other students anonymously. Share experiences,
                  ask questions, and get support without revealing your
                  identity.
                </Text>
              </View>
            )}

          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.scrollContent}
          >
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  isSelected={selectedChats.includes(chat.id)}
                  onPress={() => handleChatPress(chat.id)}
                  onLongPress={() => handleChatLongPress(chat.id)}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{getEmptyMessage()}</Text>
              </View>
            )}
          </ScrollView>

          {selectedChats.length === 0 && (
            <FloatingActionButton onPress={handleNewChatPress} />
          )}
        </View>

        <ChatTabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          unreadCounts={unreadCounts}
        />
    </SafeAreaView>
  );
}
