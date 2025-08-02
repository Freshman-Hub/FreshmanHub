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
import { useStreamChat } from "@/contexts/StreamChatContext";
import { StreamChatService } from "@/services/stream-chat.service";

const ChatConversationScreen: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);
  const { user } = useUser();
  const { client, isConnected } = useStreamChat();

  const chatId = params.id as string;

  // Stream Chat state
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [chatInfo, setChatInfo] = useState<any>(null);
  const [inputText, setInputText] = useState("");
  const [streamChannel, setStreamChannel] = useState<any>(null);

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

  // FIXED: Better ID detection logic for Firebase vs Stream Chat
  const isFirebaseChatId = (id: string) => {
    const parts = id.split("_");
    return (
      parts.length === 2 &&
      parts[0].length > 20 &&
      parts[1].length > 20 &&
      !id.startsWith("!") &&
      /^[a-zA-Z0-9_-]+$/.test(parts[0]) &&
      /^[a-zA-Z0-9_-]+$/.test(parts[1])
    );
  };

  // const isStreamChannelId = (id: string) => {
  //   return id.startsWith("!") || !isFirebaseChatId(id);
  // };

  // Determine if this is a group chat
  const isGroupChat = chatInfo?.type === "group";

  // Load Stream Chat data
  useEffect(() => {
    const loadChatData = async () => {
      if (!chatId || chatId === "self") return;

      setLoading(true);
      console.log("Loading Stream chat:", chatId);

      try {
        if (!client || !isConnected) {
          console.log("⚠️ Stream Chat not connected yet");
          return;
        }

        let channel;

        if (isFirebaseChatId(chatId)) {
          // Handle Firebase chat ID - convert to Stream channel
          console.log("🔄 Converting Firebase ID to Stream channel");
          const userIds = chatId.split("_");

          if (userIds.length !== 2) {
            throw new Error("Invalid Firebase chat ID format");
          }

          const [user1Id, user2Id] = userIds;

          // Find existing Stream Chat channel
          const channels = await client.queryChannels({
            type: "messaging",
            members: { $in: [user1Id, user2Id] },
          });

          const exactMatch = channels.find((ch) => {
            const members = Object.keys(ch.state.members || {});
            return (
              members.length === 2 &&
              members.includes(user1Id) &&
              members.includes(user2Id)
            );
          });

          if (exactMatch) {
            channel = exactMatch;
          } else {
            // Create new Stream channel
            channel = await StreamChatService.createDirectChat(
              user1Id,
              user2Id
            );
          }
        } else {
          // Handle Stream channel ID directly
          console.log("🔄 Loading Stream channel directly");
          channel = client.channel("messaging", chatId);
          await channel.watch();
        }

        setStreamChannel(channel);

        // Get channel display name
        const members = Object.values(channel.state.members || {});
        const otherMember = members.find(
          (member: any) => member.user_id !== client?.userID
        );
        const displayName =
          (channel.data && (channel.data as { name?: string }).name) ||
          otherMember?.user?.name ||
          otherMember?.user_id ||
          "Unknown";

        setChatInfo({
          id: channel.id,
          name: displayName,
          avatar: null,
          isOnline: false,
          type: members.length > 2 ? "group" : "direct",
          isAnonymous: false,
          memberCount: members.length,
        });

        // Convert Stream messages to your format
        const streamMessages = channel.state.messages || [];
        const transformedMessages = streamMessages.map((msg: any) => ({
          id: msg.id,
          text: msg.text || "",
          timestamp: new Date(msg.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isOwn: msg.user?.id === client?.userID,
          date: new Date(msg.created_at).toISOString().split("T")[0],
          status: "sent",
          isDeleted: msg.deleted_at ? true : false,
          sender: msg.user?.name || "Unknown",
          senderAvatar: msg.user?.image || null,
          isSystem: msg.type === "system",
          senderId: msg.user?.id,
        }));

        setMessages(transformedMessages);
      } catch (error) {
        console.error("Error loading Stream chat data:", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    loadChatData();
  }, [chatId, user?.id, client, isConnected]);

  // Stream Chat real-time updates
  useEffect(() => {
    if (!streamChannel || !chatId || chatId === "self") return;

    console.log("Setting up Stream Chat real-time listener");

    const handleNewMessage = (event: any) => {
      console.log("New Stream message:", event.message);

      const newMessage = {
        id: event.message.id,
        text: event.message.text || "",
        timestamp: new Date(event.message.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwn: event.message.user?.id === client?.userID,
        date: new Date(event.message.created_at).toISOString().split("T")[0],
        status: "sent",
        isDeleted: false,
        sender: event.message.user?.name || "Unknown",
        senderAvatar: event.message.user?.image || null,
        isSystem: event.message.type === "system",
        senderId: event.message.user?.id,
      };

      setMessages((prev) => {
        // Avoid duplicates
        const exists = prev.find((m) => m.id === newMessage.id);
        if (exists) return prev;
        return [...prev, newMessage];
      });
    };

    const handleMessageUpdated = (event: any) => {
      console.log("Stream message updated:", event.message);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === event.message.id
            ? {
                ...msg,
                text: event.message.text || "",
                isDeleted: event.message.deleted_at ? true : false,
              }
            : msg
        )
      );
    };

    const handleMessageDeleted = (event: any) => {
      console.log("Stream message deleted:", event.message);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === event.message.id
            ? { ...msg, isDeleted: true, text: "" }
            : msg
        )
      );
    };

    streamChannel.on("message.new", handleNewMessage);
    streamChannel.on("message.updated", handleMessageUpdated);
    streamChannel.on("message.deleted", handleMessageDeleted);

    return () => {
      streamChannel.off("message.new", handleNewMessage);
      streamChannel.off("message.updated", handleMessageUpdated);
      streamChannel.off("message.deleted", handleMessageDeleted);
    };
  }, [streamChannel, chatId, client]);

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
          return matchesText && matchesDate && !message.isSystem;
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

  // Send message to Stream Chat
  const handleSendMessage = async () => {
    if (inputText.trim() && streamChannel) {
      try {
        const messageData: any = {
          text: inputText.trim(),
        };

        // Add reply if exists
        if (replyToMessage) {
          messageData.parent_id = replyToMessage.id;
        }

        await streamChannel.sendMessage(messageData);

        setInputText("");
        setReplyToMessage(null);
        scrollToBottom();
      } catch (error) {
        console.error("Error sending Stream message:", error);
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
        if (message && !message.isDeleted) {
          await Clipboard.setStringAsync(message.text);
          console.log("Message copied to clipboard");
        }
      } else if (selectedMessages.length > 1) {
        const selectedMessagesData = messages
          .filter((m) => selectedMessages.includes(m.id) && !m.isDeleted)
          .map((m) => `${m.isOwn ? "You" : chatInfo?.name}: ${m.text}`)
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
      if (message && !message.isDeleted) {
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
    if (!streamChannel) return;

    try {
      for (const messageId of selectedMessages) {
        await streamChannel.deleteMessage(messageId);
      }
      setShowDeleteModal(false);
      setSelectedMessages([]);
    } catch (error) {
      console.error("Error deleting Stream messages:", error);
    }
  };

  const handleDeleteForMe = async () => {
    try {
      // For Stream Chat, we just hide the message locally
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
