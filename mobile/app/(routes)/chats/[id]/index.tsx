"use client";
import { useTheme } from "@/contexts/ThemeContext";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ChatConversationHeader } from "@/components/chats/ChatConversationHeader";
import { ChatSearchHeader } from "@/components/chats/ChatSearchHeader";
import { DateSeparator } from "@/components/chats/DateSeparator";
import { DeleteMessageModal } from "@/components/chats/DeleteMessageModal";
import { DeletedMessageBubble } from "@/components/chats/DeletedMessageBubble";
import { GroupWelcomeMessage } from "@/components/chats/GroupWelcomeMessage";
import { MessageBubble } from "@/components/chats/MessageBubble";
import { MessageInfoModal } from "@/components/chats/MessageInfoModal";
import { MessageInput } from "@/components/chats/MessageInput";
import { MessageSelectionHeader } from "@/components/chats/MessageSelectionHeader";
import { SearchDateModal } from "@/components/chats/SearchDateModal";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useUser } from "@/contexts/UserContext";
import { db as firestore } from "@/firebase/config/firebaseConfig";
import { ChatService } from "@/services/chat.service";
import { doc, getDoc } from "firebase/firestore";

const ChatConversationScreen: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);
  const { user } = useUser();

  const chatId = params.id as string;

  // Backend state
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [chatInfo, setChatInfo] = useState<any>(null);
  const [inputText, setInputText] = useState("");

  // Search functionality state
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const [showDateModal, setShowDateModal] = useState(false);
  const [searchDateFilter, setSearchDateFilter] = useState<Date | null>(null);

  // Selection and other features state
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [showMessageInfo, setShowMessageInfo] = useState(false);
  const [selectedMessageInfo, setSelectedMessageInfo] = useState<any>(null);
  const [replyToMessage, setReplyToMessage] = useState<any>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [isDeletedMessageModal, setIsDeletedMessageModal] = useState(false);

  // Determine if this is a group chat
  const isGroupChat = chatInfo?.type === "group";

  // Debug: Log when isGroupChat changes
  useEffect(() => {
    console.log("isGroupChat changed:", isGroupChat, "chatInfo:", chatInfo);
  }, [isGroupChat, chatInfo]);

  // Helper function to resolve sender information for messages
  const resolveSenderInfo = async (messages: any[], participants: string[]) => {
    try {
      console.log("Resolving sender info for", messages.length, "messages");
      const users = await ChatService.getLocalUsers();
      const userMap = new Map(users.map((u) => [u.id, u]));

      const resolvedMessages = messages.map((msg) => {
        if (msg.senderId === "system") {
          return {
            ...msg,
            sender: "System",
            senderAvatar: null,
          };
        }

        const senderUser = userMap.get(msg.senderId);
        if (senderUser) {
          console.log(
            "Found sender user:",
            senderUser.firstName,
            senderUser.lastName
          );
          return {
            ...msg,
            sender: `${senderUser.firstName} ${senderUser.lastName}`,
            senderAvatar: senderUser.profileImage || null,
          };
        }

        console.log("Unknown sender ID:", msg.senderId);
        return {
          ...msg,
          sender: "Unknown User",
          senderAvatar: null,
        };
      });

      console.log(
        "Resolved messages:",
        resolvedMessages.map((m) => ({
          id: m.id,
          sender: m.sender,
          senderId: m.senderId,
        }))
      );
      return resolvedMessages;
    } catch (error) {
      console.error("Error resolving sender info:", error);
      return messages;
    }
  };

  // Load chat data from backend
  useEffect(() => {
    const loadChatData = async () => {
      if (!chatId || chatId === "self") return;

      setLoading(true);
      console.log("Loading chat:", chatId);

      try {
        // Get chat info and messages
        const [chatData, messagesData] = await Promise.all([
          ChatService.getLocalChats(20, 0, user?.id).then((chats) =>
            chats.find((chat) => chat.id === chatId)
          ),
          ChatService.getLocalMessages(chatId),
        ]);

        console.log("Chat data:", chatData);
        console.log("Messages data:", messagesData);
        console.log("Messages count:", messagesData.length);

        // If chat doesn't exist in user's chat list, try to get it directly
        let finalChatData = chatData;
        if (!chatData && user?.id && chatId.includes("_")) {
          console.log(
            "Chat not found in user's chat list, trying to get it directly..."
          );
          try {
            // Try to get the chat document directly
            const chatDoc = await getDoc(doc(firestore, "chats", chatId));
            if (chatDoc.exists()) {
              finalChatData = { id: chatDoc.id, ...chatDoc.data() };
              console.log("✅ Found chat directly:", finalChatData);
            }
          } catch (error) {
            console.error("Error getting chat directly:", error);
          }
        }

        // If chat still doesn't exist, create it (for direct conversations)
        if (!finalChatData && user?.id && chatId.includes("_")) {
          console.log("Chat doesn't exist, creating new chat...");
          const participants = chatId.split("_");

          // Find the other user's info
          const otherUserId = participants.find((id) => id !== user.id);
          if (otherUserId) {
            const otherUser = await ChatService.getLocalUsers().then((users) =>
              users.find((u) => u.id === otherUserId)
            );

            if (otherUser) {
              await ChatService.upsertChat({
                id: chatId,
                name: "Direct Chat", // Use generic name, will be resolved per user
                type: "direct",
                participants: participants,
                isVerified: false,
                isAnonymous: false,
                lastMessage: "",
                timestamp: Date.now(),
                unreadCount: 0,
              });

              console.log("✅ Created new chat:", chatId);
            }
          }
        }

        // Transform messages to match UI format
        const transformedMessages = messagesData.map((msg: any) => ({
          id: msg.id,
          text: msg.text || "",
          timestamp: msg.timestamp
            ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
          isOwn: msg.senderId === user?.id,
          date: msg.timestamp
            ? new Date(msg.timestamp.toDate()).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          status: msg.status || "sent",
          isDeleted: msg.isDeletedForEveryone || false,
          sender: msg.senderName,
          senderAvatar: msg.senderAvatar,
          isSystem: msg.isSystem || false,
          senderId: msg.senderId,
        }));

        // Resolve sender information for group chats
        const messagesWithSenderInfo =
          finalChatData?.type === "group"
            ? await resolveSenderInfo(
                transformedMessages,
                finalChatData.participants || []
              )
            : transformedMessages;

        // Set chat info
        if (finalChatData) {
          console.log("Setting chat info:", finalChatData);
          // For direct chats, show the other user's name
          let displayName = finalChatData.name || "Unknown";
          if (finalChatData.type === "direct" && finalChatData.participants) {
            const otherUserId = finalChatData.participants.find(
              (id: string) => id !== user?.id
            );
            if (otherUserId) {
              // Get the other user's info to show their name
              const otherUser = await ChatService.getLocalUsers().then(
                (users) => users.find((u) => u.id === otherUserId)
              );
              if (otherUser) {
                displayName = `${otherUser.firstName} ${otherUser.lastName}`;
              }
            }
          }

          setChatInfo({
            id: finalChatData.id,
            name: displayName,
            avatar: finalChatData.avatar || null,
            isOnline: finalChatData.isOnline || false,
            type: finalChatData.type || "direct",
            isAnonymous: finalChatData.isAnonymous || false,
            memberCount: finalChatData.participants?.length || 0,
          });

          console.log(
            "Chat info set, isGroupChat will be:",
            finalChatData.type === "group"
          );
        } else {
          // Create default chat info for direct chats
          setChatInfo({
            id: chatId,
            name: "Unknown User",
            avatar: null,
            isOnline: false,
            type: "direct",
            isAnonymous: false,
          });
        }

        setMessages(messagesWithSenderInfo);
      } catch (error) {
        console.error("Error loading chat data:", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    loadChatData();
  }, [chatId, user?.id]);

  // Listen for real-time message updates
  useEffect(() => {
    if (!chatId || chatId === "self" || !user?.id) return;

    console.log("Setting up real-time listener for chat:", chatId);

    const unsubscribe = ChatService.listenMessagesFirestore(
      chatId,
      Date.now() - 24 * 60 * 60 * 1000, // Last 24 hours
      async (newMessages) => {
        console.log("Received new messages:", newMessages);
        console.log("New messages count:", newMessages.length);

        const transformedMessages = newMessages.map((msg: any) => ({
          id: msg.id,
          text: msg.text || "",
          timestamp: msg.timestamp
            ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
          isOwn: msg.senderId === user?.id,
          date: msg.timestamp
            ? new Date(msg.timestamp.toDate()).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          status: msg.status || "sent",
          isDeleted: msg.isDeletedForEveryone || false,
          sender: msg.senderName,
          senderAvatar: msg.senderAvatar,
          isSystem: msg.isSystem || false,
          senderId: msg.senderId,
        }));

        // Resolve sender information for group chats
        if (chatInfo?.type === "group") {
          try {
            const messagesWithSenderInfo = await resolveSenderInfo(
              transformedMessages,
              chatInfo.participants || []
            );
            setMessages(messagesWithSenderInfo);
          } catch (error) {
            console.error(
              "Error resolving sender info in real-time listener:",
              error
            );
            setMessages(transformedMessages);
          }
        } else {
          setMessages(transformedMessages);
        }
      }
    );

    return () => {
      console.log("Cleaning up real-time listener for chat:", chatId);
      unsubscribe();
    };
  }, [chatId, user?.id, chatInfo?.type, chatInfo?.participants]);

  // Mark messages as read when chat loads
  useEffect(() => {
    if (!loading && messages.length > 0 && chatId && user?.id) {
      const markAsRead = async () => {
        try {
          await ChatService.markMessagesAsRead(chatId, user.id);
          console.log("✅ Messages marked as read");
        } catch (error) {
          console.error("Error marking messages as read:", error);
        }
      };

      markAsRead();
    }
  }, [loading, messages.length, chatId, user?.id]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const results = messages
        .filter((message) => {
          const matchesText = message.text
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
          const matchesDate = searchDateFilter
            ? new Date(message.date).toDateString() ===
              searchDateFilter.toDateString()
            : true;
          return (
            matchesText &&
            matchesDate &&
            !("isSystem" in message && message.isSystem)
          );
        })
        .map((message) => message.id);

      setSearchResults(results);
      setCurrentSearchIndex(results.length > 0 ? 0 : -1);

      if (results.length > 0) {
        scrollToMessage(results[0]);
      }
    } else {
      setSearchResults([]);
      setCurrentSearchIndex(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, messages, searchDateFilter]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const scrollToMessage = (messageId: string) => {
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex >= 0 && scrollViewRef.current) {
      const totalMessages = messages.length;
      const scrollRatio = messageIndex / Math.max(1, totalMessages - 1);
      const { height } = Dimensions.get("window");
      const estimatedContentHeight = totalMessages * 80;
      const scrollY =
        scrollRatio * Math.max(0, estimatedContentHeight - height * 0.6);

      scrollViewRef.current.scrollTo({
        y: scrollY,
        animated: true,
      });
    }
  };

  const handleSearchPrevious = () => {
    if (searchResults.length > 0 && currentSearchIndex > 0) {
      const newIndex = currentSearchIndex - 1;
      setCurrentSearchIndex(newIndex);
      setTimeout(() => {
        scrollToMessage(searchResults[newIndex]);
      }, 50);
    }
  };

  const handleSearchNext = () => {
    if (
      searchResults.length > 0 &&
      currentSearchIndex < searchResults.length - 1
    ) {
      const newIndex = currentSearchIndex + 1;
      setCurrentSearchIndex(newIndex);
      setTimeout(() => {
        scrollToMessage(searchResults[newIndex]);
      }, 50);
    }
  };

  const handleSearchCalendar = () => {
    setShowDateModal(true);
  };

  const handleDateSelect = (date: Date) => {
    setSearchDateFilter(date);
    setShowDateModal(false);
  };

  const handleClearDateFilter = () => {
    setSearchDateFilter(null);
    setShowDateModal(false);
  };

  const handleMessageLongPress = (messageId: string) => {
    setSelectedMessages([messageId]);
  };

  const handleMessagePress = (messageId: string) => {
    if (selectedMessages.length > 0) {
      setSelectedMessages((prev) =>
        prev.includes(messageId)
          ? prev.filter((id) => id !== messageId)
          : [...prev, messageId]
      );
    }
  };

  const handleSearchMode = () => {
    setIsSearchMode(true);
  };

  const handleSearchBack = () => {
    setIsSearchMode(false);
    setSearchQuery("");
    setSearchResults([]);
    setCurrentSearchIndex(-1);
    setSearchDateFilter(null);
  };

  const handleSelectionBack = () => {
    setSelectedMessages([]);
  };

  const handleReply = () => {
    if (selectedMessages.length === 1) {
      const messageToReply = messages.find((m) => m.id === selectedMessages[0]);
      setReplyToMessage(messageToReply);
      setSelectedMessages([]);
    }
  };

  const handleMessageInfo = () => {
    if (selectedMessages.length === 1) {
      const message = messages.find((m) => m.id === selectedMessages[0]);
      setSelectedMessageInfo({
        ...message,
        deliveredAt: "July 2, 22:07",
        status: "read",
      });
      setShowMessageInfo(true);
      setSelectedMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (inputText.trim() && user?.id) {
      const messageId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      // Prepare message data
      const messageData: any = {
        id: messageId,
        chatId: chatId,
        senderId: user.id,
        text: inputText.trim(),
        timestamp: Date.now(),
        isOwn: true,
        status: "sent" as const,
      };

      // Only add replyTo if it has a valid value
      if (replyToMessage) {
        messageData.replyTo = {
          id: replyToMessage.id,
          text: replyToMessage.text,
          sender: chatInfo?.name || "Unknown",
        };
      }

      try {
        // Send message to backend
        await ChatService.sendMessage(messageData);

        // Clear input and reply state
        setInputText("");
        setReplyToMessage(null);

        console.log("Message sent successfully:", messageData);
        scrollToBottom();
      } catch (error) {
        console.error("Error sending message:", error);
        // You could show an error toast here
      }
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleChatOptions = () => {
    console.log("Chat options");
  };

  const handleInputFocus = () => {
    scrollToBottom();
  };

  const handleCopy = async () => {
    try {
      if (selectedMessages.length === 1) {
        const message = messages.find((m) => m.id === selectedMessages[0]);
        if (message && !("isDeleted" in message && message.isDeleted)) {
          await Clipboard.setStringAsync(message.text);
          console.log("Message copied to clipboard");
        }
      } else if (selectedMessages.length > 1) {
        const selectedMessagesData = messages
          .filter(
            (m) =>
              selectedMessages.includes(m.id) &&
              !("isDeleted" in m && m.isDeleted)
          )
          .map((m) => `${m.isOwn ? "You" : chatInfo.name}: ${m.text}`)
          .join("\n");
        await Clipboard.setStringAsync(selectedMessagesData);
        console.log("Messages copied to clipboard");
      }
    } catch (error) {
      console.error("Failed to copy:", error);
    }
    setSelectedMessages([]);
  };

  const handleForward = () => {
    if (selectedMessages.length === 1) {
      const message = messages.find((m) => m.id === selectedMessages[0]);
      if (message && !("isDeleted" in message && message.isDeleted)) {
        router.push({
          pathname: "/(routes)/chats/share-message",
          params: { messageData: JSON.stringify(message) },
        });
      }
    }
    setSelectedMessages([]);
  };

  const handleDelete = () => {
    if (selectedMessages.length > 0) {
      setShowDeleteModal(true);
    }
  };

  const handleDeleteForEveryone = async () => {
    try {
      // Delete from backend
      for (const messageId of selectedMessages) {
        await ChatService.deleteMessageForEveryone(chatId, messageId);
      }

      // Update local state
      setMessages((prev) =>
        prev.map((msg) =>
          selectedMessages.includes(msg.id)
            ? ({ ...msg, isDeleted: true, text: "" } as typeof msg)
            : msg
        )
      );
      setShowDeleteModal(false);
      setSelectedMessages([]);
    } catch (error) {
      console.error("Error deleting messages for everyone:", error);
    }
  };

  const handleDeleteForMe = async () => {
    try {
      // Delete from backend
      for (const messageId of selectedMessages) {
        await ChatService.deleteMessageForMe(chatId, messageId, user?.id || "");
      }

      // Update local state
      setMessages((prev) =>
        prev.filter((msg) => !selectedMessages.includes(msg.id))
      );
      setShowDeleteModal(false);
      setSelectedMessages([]);
    } catch (error) {
      console.error("Error deleting messages for me:", error);
    }
  };

  const handleDeletedMessageLongPress = (messageId: string) => {
    setMessageToDelete(messageId);
    setIsDeletedMessageModal(true);
    setShowDeleteModal(true);
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups: any, message) => {
    const date = message.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
    },
    messagesContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.sm,
    },
    messagesContent: {
      paddingVertical: theme.spacing.md,
      paddingBottom: theme.spacing.lg,
    },
    systemMessage: {
      alignItems: "center",
      marginVertical: theme.spacing.sm,
    },
    systemMessageText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontSize: 12,
      fontWeight: "500",
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {isSearchMode ? (
            <ChatSearchHeader
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onBack={handleSearchBack}
              onCalendar={handleSearchCalendar}
              onPrevious={handleSearchPrevious}
              onNext={handleSearchNext}
              currentResult={
                currentSearchIndex >= 0 ? currentSearchIndex + 1 : 0
              }
              totalResults={searchResults.length}
            />
          ) : selectedMessages.length > 0 ? (
            <MessageSelectionHeader
              selectedCount={selectedMessages.length}
              onBack={handleSelectionBack}
              onReply={handleReply}
              onStar={() => console.log("Star")}
              onDelete={handleDelete}
              onCopy={handleCopy}
              onForward={handleForward}
              onInfo={handleMessageInfo}
              canEdit={selectedMessages.length === 1}
              onEdit={() => console.log("Edit")}
            />
          ) : (
            <ChatConversationHeader
              chat={chatInfo}
              onBack={handleBack}
              onOptions={handleChatOptions}
              onSearch={handleSearchMode}
            />
          )}

          <View style={styles.content}>
            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {Object.entries(groupedMessages).map(
                ([date, dateMessages]: [string, any]) => (
                  <View key={date}>
                    <DateSeparator date={date} />
                    {isGroupChat &&
                      dateMessages.length > 0 &&
                      dateMessages[0].isSystem && (
                        <GroupWelcomeMessage
                          groupName={chatInfo?.name || "Group"}
                          memberCount={chatInfo?.memberCount || 0}
                          createdBy="You"
                        />
                      )}
                    {dateMessages.map((message: any) => {
                      if (message.isSystem) {
                        return (
                          <View key={message.id} style={styles.systemMessage}>
                            <Text style={styles.systemMessageText}>
                              {message.text}
                            </Text>
                          </View>
                        );
                      }

                      if (message.isDeleted) {
                        return (
                          <DeletedMessageBubble
                            key={message.id}
                            timestamp={message.timestamp}
                            isOwn={message.isOwn}
                            onLongPress={() =>
                              handleDeletedMessageLongPress(message.id)
                            }
                          />
                        );
                      }

                      console.log("Rendering message:", {
                        id: message.id,
                        sender: message.sender,
                        senderId: message.senderId,
                        isOwn: message.isOwn,
                        isGroupChat,
                        showSender: isGroupChat && !message.isOwn,
                      });

                      return (
                        <MessageBubble
                          key={message.id}
                          message={message}
                          isSelected={selectedMessages.includes(message.id)}
                          isHighlighted={searchResults.includes(message.id)}
                          isCurrentSearchResult={
                            currentSearchIndex >= 0 &&
                            searchResults[currentSearchIndex] === message.id
                          }
                          searchQuery={
                            searchQuery.length >= 2 ? searchQuery : ""
                          }
                          onLongPress={() => handleMessageLongPress(message.id)}
                          onPress={() => handleMessagePress(message.id)}
                          showSender={isGroupChat && !message.isOwn}
                        />
                      );
                    })}
                  </View>
                )
              )}
            </ScrollView>

            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
              enabled={true}
            >
              <MessageInput
                value={inputText}
                onChangeText={setInputText}
                onSend={handleSendMessage}
                placeholder="Message"
                onFocus={handleInputFocus}
                replyToMessage={replyToMessage}
                onCancelReply={() => setReplyToMessage(null)}
              />
            </KeyboardAvoidingView>
          </View>

          <MessageInfoModal
            visible={showMessageInfo}
            onClose={() => setShowMessageInfo(false)}
            message={selectedMessageInfo}
          />

          <SearchDateModal
            visible={showDateModal}
            onClose={() => setShowDateModal(false)}
            onDateSelect={handleDateSelect}
            onClearFilter={handleClearDateFilter}
            currentFilter={searchDateFilter}
          />

          <DeleteMessageModal
            visible={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setIsDeletedMessageModal(false);
            }}
            onDeleteForEveryone={
              isDeletedMessageModal ? undefined : handleDeleteForEveryone
            }
            onDeleteForMe={handleDeleteForMe}
            canDeleteForEveryone={selectedMessages.length > 0}
            isDeletedMessage={isDeletedMessageModal}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default ChatConversationScreen;
