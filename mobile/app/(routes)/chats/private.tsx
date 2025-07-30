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

// Mock private chats data
const mockPrivateChats = [
  {
    id: "private-1",
    name: "Sarah Johnson",
    lastMessage: "Thanks for the study notes!",
    timestamp: "2:30 PM",
    unreadCount: 0,
    avatar:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
    isOnline: true,
    type: "direct" as const,
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
    type: "direct" as const,
    isVerified: true,
  },
  {
    id: "private-3",
    name: "Emma Wilson",
    lastMessage: "Can you help me with the assignment?",
    timestamp: "11:45 AM",
    unreadCount: 1,
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    isOnline: true,
    type: "direct" as const,
    isVerified: false,
  },
];

export default function PrivateChatsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChats, setSelectedChats] = useState<string[]>([]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // TODO: Fetch latest private chats from backend
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

  const handleNewChatPress = () => {
    router.push("/(routes)/chats/select-contact?mode=chat");
  };

  const handleSelectAll = () => {
    const allChatIds = filteredChats.map((chat) => chat.id);
    setSelectedChats(allChatIds);
  };

  const handleUnselectAll = () => {
    setSelectedChats([]);
  };

  const handleMarkAsRead = () => {
    console.log("Marking chats as read:", selectedChats);
    setSelectedChats([]);
  };

  const handleDeleteChats = () => {
    console.log("Deleting chats:", selectedChats);
    setSelectedChats([]);
  };

  const filteredChats = mockPrivateChats.filter((chat) => {
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
            title="Private Chats"
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
                  ? `No private chats found for "${searchQuery}"`
                  : "No private chats yet"}
              </Text>
            </View>
          )}
        </ScrollView>

        {selectedChats.length === 0 && (
          <FloatingActionButton onPress={handleNewChatPress} />
        )}
      </View>
    </View>
  );
}
