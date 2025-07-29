"use client";
import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";

import { ChatHeader } from "@/components/chats/ChatHeader";
import { ChatFilterTabs } from "@/components/chats/ChatFilterTabs";
import { ChatListItem } from "@/components/chats/ChatListItem";
import { FloatingActionButton } from "@/components/chats/FloatingActionButton";
import { ChatTabNavigation } from "@/components/chats/ChatTabNavigation";
import { ChatSelectionHeader } from "@/components/chats/ChatSelectionHeader";

// All chats data - this will be filtered by tabs
const allChatsData = [
  // Direct/Private chats
  {
    id: "1",
    name: "Mi Leilou",
    lastMessage: "Great",
    timestamp: "7/27/25",
    unreadCount: 1,
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
    isOnline: true,
    type: "direct",
    isVerified: true,
  },
  {
    id: "2",
    name: "Jacqueline Lompo",
    lastMessage: "salut",
    timestamp: "7/22/25",
    unreadCount: 1,
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    isOnline: false,
    type: "direct",
    isVerified: false,
  },
  {
    id: "private-1",
    name: "Sarah Johnson",
    lastMessage: "Thanks for the study notes!",
    timestamp: "2:30 PM",
    unreadCount: 0,
    avatar:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
    isOnline: true,
    type: "direct",
    isVerified: false,
  },
  {
    id: "private-2",
    name: "Mike Chen",
    lastMessage: "See you at the library tomorrow",
    timestamp: "1:15 PM",
    unreadCount: 2,
    avatar:
      "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400",
    isOnline: false,
    type: "direct",
    isVerified: true,
  },

  // Group/Community chats
  {
    id: "group-1",
    name: "Emma group",
    lastMessage: "Hi what's up",
    timestamp: "7/10/25",
    unreadCount: 3,
    avatar: null,
    isOnline: false,
    type: "group",
    isVerified: false,
  },
  {
    id: "community-1",
    name: "Computer Science 2025",
    lastMessage: "📢 New assignment posted in Data Structures",
    timestamp: "3:45 PM",
    unreadCount: 5,
    avatar: null,
    isOnline: false,
    type: "group",
    isVerified: true,
  },
  {
    id: "community-2",
    name: "Study Group - Mathematics",
    lastMessage: "Anyone free for calculus review tonight?",
    timestamp: "1:30 PM",
    unreadCount: 3,
    avatar: null,
    isOnline: false,
    type: "group",
    isVerified: false,
  },

  // Announcement chats
  {
    id: "3",
    name: "Freshman Hub Updates",
    lastMessage: "📢 New: Get the group talking live with voice calls",
    timestamp: "7/11/25",
    unreadCount: 0,
    avatar: null,
    isOnline: false,
    type: "announcement",
    isVerified: true,
  },
  {
    id: "announcement-1",
    name: "Campus Events",
    lastMessage: "🎵 Music festival this weekend!",
    timestamp: "12:15 PM",
    unreadCount: 0,
    avatar: null,
    isOnline: false,
    type: "announcement",
    isVerified: true,
  },

  // Anonymous chats
  {
    id: "5",
    name: "Anonymous Chat #1234",
    lastMessage: "Thanks for the advice!",
    timestamp: "7/9/25",
    unreadCount: 0,
    avatar: null,
    isOnline: false,
    type: "anonymous",
    isVerified: false,
  },
  {
    id: "anon-1",
    name: "Anonymous Chat #5678",
    lastMessage: "Anyone else struggling with organic chemistry?",
    timestamp: "3:15 PM",
    unreadCount: 1,
    avatar: null,
    isOnline: false,
    type: "anonymous",
    isVerified: false,
  },
  {
    id: "anon-2",
    name: "Anonymous Group #9012",
    lastMessage: "Let's discuss mental health resources on campus",
    timestamp: "2:45 PM",
    unreadCount: 3,
    avatar: null,
    isOnline: false,
    type: "anonymous",
    isVerified: false,
  },
];

export default function ChatsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("chats");
  const [selectedChats, setSelectedChats] = useState<string[]>([]);

  const filters = ["All", "Unread", "Groups", "Friends", "Anonymous"];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // TODO: Fetch latest chats from backend
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

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
    const allChatIds = getFilteredChats().map((chat) => chat.id);
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
    let tabFilteredChats = allChatsData;

    // Filter by tab
    switch (activeTab) {
      case "private":
        tabFilteredChats = allChatsData.filter(
          (chat) => chat.type === "direct"
        );
        break;
      case "communities":
        tabFilteredChats = allChatsData.filter(
          (chat) => chat.type === "group" || chat.type === "announcement"
        );
        break;
      case "anonymous":
        tabFilteredChats = allChatsData.filter(
          (chat) => chat.type === "anonymous"
        );
        break;
      case "chats":
      default:
        // Show all chats
        tabFilteredChats = allChatsData;
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
      ...theme.typography.body,
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
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: theme.spacing.sm,
    },
    anonymousDescription: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: 18,
    },
  });

  return (
    <View style={styles.container}>
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
                Connect with other students anonymously. Share experiences, ask
                questions, and get support without revealing your identity.
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

      <ChatTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
}
