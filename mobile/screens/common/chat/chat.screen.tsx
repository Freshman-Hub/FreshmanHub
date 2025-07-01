import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Animated,
  ViewStyle,
  TextStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Search,
  Plus,
  Users,
  MessageCircle,
  Shield,
  Send,
  MoveVertical as MoreVertical,
  Phone,
  Video,
  X,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

// Mock chat data
const chatRooms = [
  {
    id: 1,
    name: "Freshman 2024",
    type: "community",
    participants: 234,
    lastMessage: "Sarah: Anyone know where the library is?",
    lastTime: "2m ago",
    unread: 3,
    avatar:
      "https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400",
    isOnline: true,
  },
  {
    id: 2,
    name: "Study Group - CS101",
    type: "community",
    participants: 12,
    lastMessage: "Michael: Meeting at 3pm today",
    lastTime: "15m ago",
    unread: 0,
    avatar:
      "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400",
    isOnline: false,
  },
  {
    id: 3,
    name: "Anonymous Chat #1",
    type: "anonymous",
    participants: 45,
    lastMessage: "Anonymous: Need advice about...",
    lastTime: "1h ago",
    unread: 1,
    avatar: null,
    isOnline: true,
  },
  {
    id: 4,
    name: "Ama Asante",
    type: "private",
    participants: 2,
    lastMessage: "You: Thanks for the help!",
    lastTime: "3h ago",
    unread: 0,
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    isOnline: true,
  },
  {
    id: 5,
    name: "Campus Events",
    type: "community",
    participants: 567,
    lastMessage: "Admin: International Night this Friday!",
    lastTime: "5h ago",
    unread: 0,
    avatar:
      "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400",
    isOnline: false,
  },
];

const chatTypes = [
  { name: "All", icon: MessageCircle, color: "#64748b" },
  { name: "Community", icon: Users, color: "#3b82f6" },
  { name: "Private", icon: MessageCircle, color: "#059669" },
  { name: "Anonymous", icon: Shield, color: "#7c3aed" },
];

export default function ChatScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [selectedChat, setSelectedChat] = useState<
    (typeof chatRooms)[0] | null
  >(null);
  const [newMessage, setNewMessage] = useState("");

  const searchWidth = useRef(new Animated.Value(44)).current;
  const searchOpacity = useRef(new Animated.Value(0)).current;

  const expandSearch = () => {
    setIsSearchExpanded(true);
    Animated.parallel([
      Animated.timing(searchWidth, {
        toValue: 250,
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

  const filteredChats = chatRooms.filter((chat) => {
    const matchesType =
      selectedType === "All" ||
      (selectedType === "Community" && chat.type === "community") ||
      (selectedType === "Private" && chat.type === "private") ||
      (selectedType === "Anonymous" && chat.type === "anonymous");

    const matchesSearch =
      searchQuery === "" ||
      chat.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesSearch;
  });

  const handleChatPress = (chat: (typeof chatRooms)[0]) => {
    setSelectedChat(chat);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // TODO: Send message logic
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      padding: theme.spacing.sm,
      marginRight: theme.spacing.lg,
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
      height: 44,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    searchInput: {
      flex: 1,
      color: theme.colors.text,
      fontSize: 16,
      paddingHorizontal: theme.spacing.sm,
      fontWeight: "500",
    },
    searchButton: {
      padding: theme.spacing.sm,
    },
    newChatButton: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxxl,
    },
    typesContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    typesScroll: {
      flexDirection: "row",
      gap: theme.spacing.xs,
    },
    typeChip: {
      paddingHorizontal: theme.spacing.sm +1,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.xxxl,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    typeChipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    typeChipText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
      fontSize:12
    },
    typeChipTextActive: {
      color: "white",
      fontWeight: "700",
    },
    chatsList: {
      flex: 1,
    } as ViewStyle,
    chatItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    chatAvatar: {
      width: 45,
      height: 45,
      borderRadius: 28,
      marginRight: theme.spacing.md,
      backgroundColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    anonymousAvatar: {
      backgroundColor: "#7c3aed20",
    },
    onlineIndicator: {
      position: "absolute",
      bottom: 2,
      right: 2,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: "#22c55e",
      borderWidth: 2,
      borderColor: "white",
    },
    chatInfo: {
      flex: 1,
    },
    chatHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    chatName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      flex: 1,
    },
    chatTime: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
    } as TextStyle,
    chatLastMessage: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    } as TextStyle,
    chatMeta: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 4,
    },
    participantsCount: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
    } as TextStyle,
    unreadBadge: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.lg,
      minWidth: 20,
      alignItems: "center",
    },
    unreadText: {
      ...theme.typography.captionSmall,
      color: "white",
      fontWeight: "700",
      fontSize: 10,
    },
    // Chat Detail View
    chatDetail: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.background,
      zIndex: 1000,
    },
    chatDetailHeader: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    chatDetailInfo: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    chatDetailName: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
    },
    chatDetailStatus: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginTop: 2,
    } as TextStyle,
    chatDetailActions: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    chatDetailButton: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.xxxl,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    messagesContainer: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    messageInputContainer: {
      flexDirection: "row",
      alignItems: "flex-end",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      gap: theme.spacing.md,
    },
    messageInput: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.typography.body,
      color: theme.colors.text,
      maxHeight: 100,
      fontWeight: theme.typography.body.fontWeight as any,
    },
    sendButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.xxxl,
      padding: theme.spacing.md,
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.spacing.xl,
    },
    emptyStateText: {
      ...theme.typography.h6,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: theme.spacing.lg,
      fontWeight: "600" as const,
    },
    emptyStateSubtext: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: theme.spacing.sm,
      lineHeight: 24,
    } as TextStyle,
  });

  if (selectedChat) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.chatDetail}>
          <View style={styles.chatDetailHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedChat(null)}
            >
              <ArrowLeft color={theme.colors.text} size={24} />
            </TouchableOpacity>

            {selectedChat.avatar ? (
              <Image
                source={{ uri: selectedChat.avatar }}
                style={[
                  styles.chatAvatar,
                  { width: 40, height: 40, borderRadius: 20 },
                ]}
              />
            ) : (
              <View
                style={[
                  styles.chatAvatar,
                  styles.anonymousAvatar,
                  { width: 40, height: 40, borderRadius: 20 },
                ]}
              >
                <Shield color="#7c3aed" size={20} />
              </View>
            )}

            <View style={styles.chatDetailInfo}>
              <Text style={styles.chatDetailName}>{selectedChat.name}</Text>
              <Text style={styles.chatDetailStatus}>
                {selectedChat.type === "private"
                  ? selectedChat.isOnline
                    ? "Online"
                    : "Last seen recently"
                  : `${selectedChat.participants} participants`}
              </Text>
            </View>

            <View style={styles.chatDetailActions}>
              {selectedChat.type === "private" && (
                <>
                  <TouchableOpacity style={styles.chatDetailButton}>
                    <Phone color={theme.colors.textSecondary} size={20} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.chatDetailButton}>
                    <Video color={theme.colors.textSecondary} size={20} />
                  </TouchableOpacity>
                </>
              )}
              <TouchableOpacity style={styles.chatDetailButton}>
                <MoreVertical color={theme.colors.textSecondary} size={20} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.messagesContainer}>
            <View style={styles.emptyState}>
              <MessageCircle color={theme.colors.textSecondary} size={64} />
              <Text style={styles.emptyStateText}>Start the conversation</Text>
              <Text style={styles.emptyStateSubtext}>
                Send a message to begin chatting with {selectedChat.name}
              </Text>
            </View>
          </View>

          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Type a message..."
              placeholderTextColor={theme.colors.textSecondary}
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
            >
              <Send color="white" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color={theme.colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat</Text>
        <View style={styles.headerActions}>
          <Animated.View
            style={[styles.searchContainer, { width: searchWidth }]}
          >
            {!isSearchExpanded ? (
              <TouchableOpacity
                style={styles.searchButton}
                onPress={expandSearch}
              >
                <Search color={theme.colors.textSecondary} size={22} />
              </TouchableOpacity>
            ) : (
              <>
                <Animated.View style={{ opacity: searchOpacity, flex: 1 }}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search chats..."
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
                  <X color={theme.colors.textSecondary} size={20} />
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
          <TouchableOpacity style={styles.newChatButton}>
            <Plus color="white" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.typesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.typesScroll}
        >
          {chatTypes.map((type) => {
            const IconComponent = type.icon;
            const isActive = selectedType === type.name;
            return (
              <TouchableOpacity
                key={type.name}
                style={[styles.typeChip, isActive && styles.typeChipActive]}
                onPress={() => setSelectedType(type.name)}
              >
                <IconComponent
                  color={isActive ? "white" : type.color}
                  size={16}
                />
                <Text
                  style={[
                    styles.typeChipText,
                    isActive && styles.typeChipTextActive,
                  ]}
                >
                  {type.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={styles.chatsList} showsVerticalScrollIndicator={false}>
        {filteredChats.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            style={styles.chatItem}
            onPress={() => handleChatPress(chat)}
          >
            {chat.avatar ? (
              <Image source={{ uri: chat.avatar }} style={styles.chatAvatar} />
            ) : (
              <View style={[styles.chatAvatar, styles.anonymousAvatar]}>
                <Shield color="#7c3aed" size={24} />
              </View>
            )}
            {chat.isOnline && <View style={styles.onlineIndicator} />}

            <View style={styles.chatInfo}>
              <View style={styles.chatHeader}>
                <Text style={styles.chatName} numberOfLines={1}>
                  {chat.name}
                </Text>
                <Text style={styles.chatTime}>{chat.lastTime}</Text>
              </View>

              <Text style={styles.chatLastMessage} numberOfLines={1}>
                {chat.lastMessage}
              </Text>

              <View style={styles.chatMeta}>
                <Text style={styles.participantsCount}>
                  {chat.type === "private"
                    ? "Private chat"
                    : `${chat.participants} participants`}
                </Text>
                {chat.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{chat.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
