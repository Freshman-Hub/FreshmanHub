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

// Mock anonymous chats data
const mockAnonymousChats = [
  {
    id: "anon-1",
    name: "Anonymous Chat #1234",
    lastMessage: "Thanks for the advice about college applications!",
    timestamp: "4:20 PM",
    unreadCount: 1,
    avatar: null,
    isOnline: false,
    type: "anonymous" as const,
    isVerified: false,
  },
  {
    id: "anon-2",
    name: "Anonymous Chat #5678",
    lastMessage: "Anyone else struggling with organic chemistry?",
    timestamp: "3:15 PM",
    unreadCount: 0,
    avatar: null,
    isOnline: false,
    type: "anonymous" as const,
    isVerified: false,
  },
  {
    id: "anon-3",
    name: "Anonymous Group #9012",
    lastMessage: "Let's discuss mental health resources on campus",
    timestamp: "2:45 PM",
    unreadCount: 3,
    avatar: null,
    isOnline: false,
    type: "anonymous" as const,
    isVerified: false,
  },
  {
    id: "anon-4",
    name: "Anonymous Chat #3456",
    lastMessage: "How do you deal with homesickness?",
    timestamp: "1:30 PM",
    unreadCount: 0,
    avatar: null,
    isOnline: false,
    type: "anonymous" as const,
    isVerified: false,
  },
];

export default function AnonymousChatsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChats, setSelectedChats] = useState<string[]>([]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // TODO: Fetch latest anonymous chats from backend
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

  const handleNewAnonymousChatPress = () => {
    // TODO: Implement anonymous chat matching
    console.log("Starting anonymous chat matching...");
  };

  const handleSelectAll = () => {
    const allChatIds = filteredChats.map((chat) => chat.id);
    setSelectedChats(allChatIds);
  };

  const handleUnselectAll = () => {
    setSelectedChats([]);
  };

  const handleMarkAsRead = () => {
    console.log("Marking anonymous chats as read:", selectedChats);
    setSelectedChats([]);
  };

  const handleDeleteChats = () => {
    console.log("Deleting anonymous chats:", selectedChats);
    setSelectedChats([]);
  };

  const filteredChats = mockAnonymousChats.filter((chat) => {
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
            onPin={() => console.log("Pin anonymous chats")}
            onDelete={handleDeleteChats}
            onMute={() => console.log("Mute anonymous chats")}
            onArchive={() => console.log("Archive anonymous chats")}
            onMarkAsRead={handleMarkAsRead}
            onSelectAll={handleSelectAll}
            onUnselectAll={handleUnselectAll}
          />
        ) : (
          <ChatHeader
            title="Anonymous Chats"
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
          {filteredChats.length === 0 && !searchQuery && (
            <View style={styles.anonymousInfo}>
              <Text style={styles.anonymousTitle}>Anonymous Chats</Text>
              <Text style={styles.anonymousDescription}>
                Connect with other students anonymously. Share experiences, ask
                questions, and get support without revealing your identity.
              </Text>
            </View>
          )}

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
          ) : searchQuery ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No anonymous chats found for &quot;{searchQuery}&quot;
              </Text>
            </View>
          ) : null}
        </ScrollView>

        {selectedChats.length === 0 && (
          <FloatingActionButton onPress={handleNewAnonymousChatPress} />
        )}
      </View>
    </View>
  );
}
