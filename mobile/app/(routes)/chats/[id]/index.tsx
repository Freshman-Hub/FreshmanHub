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
import { getChannelAvatar, getChannelDisplayName } from "@/utils/stream-chat.helpers";

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
  const [error, setError] = useState<string | null>(null); // Add this line

  // const isStreamChannelId = (id: string) => {
  //   return id.startsWith("!") || !isFirebaseChatId(id);
  // };

  // Determine if this is a group chat
  const isGroupChat = chatInfo?.type === "group";

  // Load Stream Chat data
  useEffect(() => {
    // Update the loadChatData function to use the existing helper:

    const loadChatData = async () => {
      if (!chatId || chatId === "self") return;

      setLoading(false); // No loading for immediate display
      setError(null); // Clear any previous errors
      console.log("Loading chat:", chatId);

      try {
        // Get info from params for immediate display
        const contactName = params.userName as string;
        const contactAvatar = params.userAvatar as string;
        const isGroup = params.isGroup === "true";
        // const contactId = params.contactId as string;
        const groupMembers = params.groupMembers
          ? JSON.parse(params.groupMembers as string)
          : [];

        // Set chat info immediately with params data
        setChatInfo({
          id: chatId,
          name: contactName || "Unknown",
          avatar: contactAvatar || null,
          isOnline: false,
          type: isGroup ? "group" : "direct",
          isAnonymous: params.isAnonymous === "true",
          memberCount: isGroup ? groupMembers.length : 2,
        });

        // Check if this is a pending direct chat (no real channel yet)
        const isPendingDirectChat = chatId.startsWith("pending_") && !isGroup;

        if (isPendingDirectChat) {
          console.log("📝 Pending direct chat - no channel created yet");
          setMessages([]); // Empty messages
          setStreamChannel(null); // No channel yet
          return;
        }

        // For real channels (groups or existing direct chats), load normally
        if (!client || !isConnected) {
          console.log("⚠️ Stream Chat not connected yet");
          setError("Not connected to chat service");
          return;
        }

        // Determine channel type
        let channelType = "messaging";
        if (chatId.startsWith("!members-") || isGroup) {
          channelType = "team";
        }

        // Load existing channel
        try {
          const channel = await StreamChatService.getChannel(
            channelType,
            chatId
          );

          if (!channel) {
            throw new Error("Channel not found");
          }

          setStreamChannel(channel);

          // FIXED: Just use the helper function like in chats screen
          const displayName = getChannelDisplayName(
            channel,
            client?.userID || ""
          );
          const avatar = getChannelAvatar(channel, client?.userID || "");

          setChatInfo((prev: any) => ({
            ...prev,
            id: channel.id,
            name: displayName,
            avatar: avatar,
            type:
              Object.keys(channel.state.members || {}).length > 2
                ? "group"
                : "direct",
            memberCount: Object.keys(channel.state.members || {}).length,
            isAnonymous: (channel.data as any)?.isAnonymous || false,
          }));

          // Load messages from the existing channel
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
            status: (() => {
              if (!msg.user || msg.user.id !== client?.userID)
                return "received";
              const readBy = msg.read_by || [];
              const otherUsersRead = readBy.filter(
                (read: any) => read.user.id !== client?.userID
              );
              if (otherUsersRead.length > 0) return "read";
              if (msg.created_at) return "delivered";
              return "sent";
            })(),
            isDeleted: msg.deleted_at ? true : false,
            sender: msg.user?.name || "Unknown",
            senderAvatar: msg.user?.image || null,
            isSystem: msg.type === "system",
            senderId: msg.user?.id,
            replyTo: msg.quoted_message
              ? {
                  id: msg.quoted_message.id,
                  text: msg.quoted_message.text || "",
                  sender: msg.quoted_message.user?.name || "Unknown",
                }
              : msg.parent_id
                ? {
                    id: msg.parent_id,
                    text:
                      streamMessages.find((m: any) => m.id === msg.parent_id)
                        ?.text || "Original message",
                    sender:
                      streamMessages.find((m: any) => m.id === msg.parent_id)
                        ?.user?.name || "User",
                  }
                : undefined,
            parentId: msg.parent_id || undefined,
            messageType: msg.type || "regular",
            readBy: msg.read_by || [],
          }));

          setMessages(transformedMessages);
          console.log("✅ Chat loaded successfully with name:", displayName);
        } catch (channelError: any) {
          console.error("Error loading channel:", channelError);
          setError(`Failed to load conversation: ${channelError.message}`);
        }
      } catch (error: any) {
        console.error("Error loading chat data:", error);
        // Don't show error for pending direct chats
        if (!chatId.startsWith("pending_")) {
          setError(error.message);
        }
      }
    };

    loadChatData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, user?.id, client, isConnected]);

  // Stream Chat real-time updates
  useEffect(() => {
    if (!streamChannel || !chatId || chatId === "self") return;

    console.log("Setting up Stream Chat real-time listener");

    // Fix the handleNewMessage function to avoid duplicates:

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
        status: event.message.user?.id === client?.userID ? "sent" : "received",
        isDeleted: false,
        sender: event.message.user?.name || "Unknown",
        senderAvatar: event.message.user?.image || null,
        isSystem: event.message.type === "system",
        senderId: event.message.user?.id,
        replyTo: event.message.quoted_message
          ? {
              id: event.message.quoted_message.id,
              text: event.message.quoted_message.text || "",
              sender: event.message.quoted_message.user?.name || "Unknown",
            }
          : event.message.parent_id
            ? {
                id: event.message.parent_id,
                text: (() => {
                  const parentMsg = messages.find(
                    (m) => m.id === event.message.parent_id
                  );
                  return parentMsg?.text || "Original message";
                })(),
                sender: (() => {
                  const parentMsg = messages.find(
                    (m) => m.id === event.message.parent_id
                  );
                  return parentMsg?.sender || "User";
                })(),
              }
            : undefined,
        parentId: event.message.parent_id || undefined,
        messageType: event.message.type || "regular",
        readBy: event.message.read_by || [],
      };

      setMessages((prev) => {
        // FIXED: Check for both real ID and temp ID to avoid duplicates
        const existsWithRealId = prev.find((m) => m.id === newMessage.id);
        const existsWithTempId = prev.find(
          (m) =>
            m.id.startsWith("temp-") &&
            m.text === newMessage.text &&
            m.isOwn === newMessage.isOwn
        );

        if (existsWithRealId) {
          console.log("🔄 Message already exists with real ID, skipping");
          return prev;
        }

        if (existsWithTempId) {
          console.log("🔄 Replacing temp message with real message");
          // Replace the temp message with the real one
          return prev.map((m) =>
            m.id === existsWithTempId.id ? newMessage : m
          );
        }

        console.log("🔄 Adding new message");
        return [...prev, newMessage];
      });

      // Auto-update status to 'delivered' after a short delay (only for own messages that came from real-time)
      if (newMessage.isOwn) {
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === newMessage.id && msg.status === "sent"
                ? { ...msg, status: "delivered" }
                : msg
            )
          );
        }, 1000);
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Mark messages as read when chat loads or new messages arrive
  useEffect(() => {
    if (!loading && streamChannel && messages.length > 0) {
      const markAsRead = async () => {
        try {
          await streamChannel.markRead();
          console.log("✅ Channel marked as read");
        } catch (error) {
          console.error("Error marking channel as read:", error);
        }
      };

      // Mark as read with a small delay to ensure messages are displayed
      const timer = setTimeout(markAsRead, 1000);
      return () => clearTimeout(timer);
    }
  }, [loading, streamChannel, messages.length]);

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
      console.log("🔄 Setting reply to message:", messageToReply);
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

  // Update the handleSendMessage function:

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const messageText = inputText.trim();
    const tempMessageId = `temp-${Date.now()}`;

    // Add optimistic message immediately
    const optimisticMessage = {
      id: tempMessageId,
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOwn: true,
      date: new Date().toISOString().split("T")[0],
      status: "pending" as const,
      isDeleted: false,
      sender: `${user?.firstName} ${user?.lastName}` || "You",
      senderAvatar: user?.profileImage || null,
      isSystem: false,
      senderId: user?.id,
      replyTo: replyToMessage
        ? {
            id: replyToMessage.id,
            text: replyToMessage.text,
            sender: replyToMessage.sender,
          }
        : undefined,
      parentId: replyToMessage?.id || undefined,
      messageType: "regular" as const,
      readBy: [],
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setInputText("");
    setReplyToMessage(null);
    scrollToBottom();

    try {
      let channel = streamChannel;

      // Check if we need to create the channel first (ONLY for pending direct chats)
      const isPendingDirectChat =
        chatId.startsWith("pending_") && params.isGroup !== "true";

      if (isPendingDirectChat || !channel) {
        console.log("🔄 Creating direct channel for first message...");

        if (!client?.userID || !isConnected) {
          throw new Error("Not connected to chat service");
        }

        // Only create direct channels here, groups are already created
        const contactId = params.contactId as string;
        if (!contactId) {
          throw new Error("Contact ID not found");
        }

        channel = await StreamChatService.createDirectChat(
          client.userID,
          contactId
        );

        // REMOVED: Don't navigate, just update local state
        // router.replace({
        //   pathname: "/(routes)/chats/[id]",
        //   params: {
        //     id: channel.id,
        //     userName: params.userName,
        //     userAvatar: params.userAvatar,
        //     isGroup: "false",
        //   },
        // });

        // Update local state only
        setStreamChannel(channel);

        // Update chat info with real channel ID
        setChatInfo((prev: any) => ({
          ...prev,
          id: channel.id,
        }));


        console.log("✅ Direct channel created:", channel.id);
      }

      // Send the message
      const messageData: any = { text: messageText };
      if (replyToMessage) {
        messageData.parent_id = replyToMessage.id;
      }

      const sentMessage = await channel.sendMessage(messageData);
      console.log("✅ Message sent successfully:", sentMessage.message.id);

      // Update the temp message with real ID
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessageId
            ? {
                ...msg,
                id: sentMessage.message.id,
                status: "sent" as const,
              }
            : msg
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);

      // Mark as failed
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessageId ? { ...msg, status: "failed" as const } : msg
        )
      );
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
    if (streamChannel) {
      streamChannel.markRead().catch(console.error);
    }
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
