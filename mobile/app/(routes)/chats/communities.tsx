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
import { ChatListItem } from "@/components/chats/ChatListItem";
import { FloatingActionButton } from "@/components/chats/FloatingActionButton";
import { ChatSelectionHeader } from "@/components/chats/ChatSelectionHeader";
import { ChatHeader } from "@/components/chats/ChatHeader";

// Mock communities data
const mockCommunities = [
  {
    id: "community-1",
    name: "Computer Science 2025",
    lastMessage: "📢 New assignment posted in Data Structures",
    timestamp: "3:45 PM",
    unreadCount: 5,
    avatar: null,
    isOnline: false,
    type: "group" as const,
    isVerified: true,
  },
  {
    id: "community-2",
    name: "Freshman Hub Official",
    lastMessage: "Welcome to all new members! 🎉",
    timestamp: "2:20 PM",
    unreadCount: 12,
    avatar: null,
    isOnline: false,
    type: "announcement" as const,
    isVerified: true,
  },
  {
    id: "community-3",
    name: "Study Group - Mathematics",
    lastMessage: "Anyone free for calculus review tonight?",
    timestamp: "1:30 PM",
    unreadCount: 3,
    avatar: null,
    isOnline: false,
    type: "group" as const,
    isVerified: false,
  },
  {
    id: "community-4",
    name: "Campus Events",
    lastMessage: "🎵 Music festival this weekend!",
    timestamp: "12:15 PM",
    unreadCount: 0,
    avatar: null,
    isOnline: false,
    type: "announcement" as const,
    isVerified: true,
  },
];

export default function CommunitiesScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChats, setSelectedChats] = useState<string[]>([]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // TODO: Fetch latest communities from backend
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleChatPress = (chatId: string) => {
    if (selectedChats.length > 0) {
      setSelectedChats((prev) =>
        prev.includes(chatId)
          ? prev.filter((id) => id !== chatId)
          : [...prev, chatId]
      );
    } else {
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
    console.log("Search pressed");
  };

  const handleNewCommunityPress = () => {
    router.push("/(routes)/chats/select-contact?mode=community");
  };

  const handleSelectAll = () => {
    const allChatIds = filteredChats.map((chat) => chat.id);
    setSelectedChats(allChatIds);
  };

  const handleUnselectAll = () => {
    setSelectedChats([]);
  };

  const handleMarkAsRead = () => {
    console.log("Marking communities as read:", selectedChats);
    setSelectedChats([]);
  };

  const handleDeleteChats = () => {
    console.log("Leaving communities:", selectedChats);
    setSelectedChats([]);
  };

  const filteredChats = mockCommunities.filter((chat) => {
    const matchesSearch =
      searchQuery === "" ||
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

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
      fontWeight: "500",
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
            onPin={() => console.log("Pin communities")}
            onDelete={handleDeleteChats}
            onMute={() => console.log("Mute communities")}
            onArchive={() => console.log("Archive communities")}
            onMarkAsRead={handleMarkAsRead}
            onSelectAll={handleSelectAll}
            onUnselectAll={handleUnselectAll}
          />
        ) : (
          <ChatHeader
            title="Communities"
            onSearchPress={handleSearchPress}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
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
              <Text style={styles.emptyText}>
                {searchQuery
                  ? `No communities found for "${searchQuery}"`
                  : "No communities joined yet"}
              </Text>
            </View>
          )}
        </ScrollView>

        {selectedChats.length === 0 && (
          <FloatingActionButton onPress={handleNewCommunityPress} />
        )}
      </View>
    </View>
  );
}
