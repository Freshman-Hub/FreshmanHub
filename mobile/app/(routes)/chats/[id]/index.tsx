"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  Text,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";

import { ChatConversationHeader } from "@/components/chats/ChatConversationHeader";
import { MessageBubble } from "@/components/chats/MessageBubble";
import { MessageInput } from "@/components/chats/MessageInput";
import { DateSeparator } from "@/components/chats/DateSeparator";
import { ChatSearchHeader } from "@/components/chats/ChatSearchHeader";
import { MessageSelectionHeader } from "@/components/chats/MessageSelectionHeader";
import { MessageInfoModal } from "@/components/chats/MessageInfoModal";
import { SearchDateModal } from "@/components/chats/SearchDateModal";
import { DeleteMessageModal } from "@/components/chats/DeleteMessageModal";
import { DeletedMessageBubble } from "@/components/chats/DeletedMessageBubble";
import { GroupWelcomeMessage } from "@/components/chats/GroupWelcomeMessage";

// TODO: Replace with actual backend data
const mockMessages = [
  {
    id: "1",
    text: "Je vais bien Dieu et les activités?",
    timestamp: "21:29",
    isOwn: false,
    date: "2025-06-25",
  },
  {
    id: "2",
    text: "Les activités évoluent bien encore",
    timestamp: "21:32",
    isOwn: true,
    date: "2025-06-25",
    status: "read" as const,
  },
  {
    id: "3",
    text: "Ok Dieu merci",
    timestamp: "22:42",
    isOwn: false,
    date: "2025-06-25",
  },
  {
    id: "4",
    text: "🥰❤️",
    timestamp: "21:38",
    isOwn: true,
    date: "2025-07-02",
    status: "read" as const,
  },
  {
    id: "5",
    text: "Cc",
    timestamp: "21:34",
    isOwn: true,
    date: "2025-07-02",
    status: "read" as const,
  },
  {
    id: "6",
    text: "Oui c'est comment?",
    timestamp: "22:01",
    isOwn: false,
    date: "2025-07-02",
  },
  {
    id: "7",
    text: "Ça va bien merci et toi",
    timestamp: "22:01",
    isOwn: true,
    date: "2025-07-02",
    status: "read" as const,
  },
  {
    id: "8",
    text: "Je vais bien Dieu merci et les activités?",
    timestamp: "22:06",
    isOwn: false,
    date: "2025-07-02",
  },
  {
    id: "9",
    text: "Les activités évoluent bien encore",
    timestamp: "22:07",
    isOwn: true,
    date: "2025-07-02",
    status: "read" as const,
  },
  {
    id: "10",
    text: "Ok cool alors",
    timestamp: "22:13",
    isOwn: false,
    date: "2025-07-02",
  },
  {
    id: "11",
    text: "🤓",
    timestamp: "11:40",
    isOwn: true,
    date: "2025-07-03",
    status: "read" as const,
  },
  {
    id: "deleted-1",
    text: "",
    timestamp: "18:37",
    isOwn: true,
    date: "2025-07-29",
    isDeleted: true,
  },
];

const mockGroupMessages = [
  {
    id: "system-1",
    text: "Adoum Ouang-namou Emmanuel was added",
    timestamp: "",
    isOwn: false,
    date: "2025-07-29",
    isSystem: true,
  },
  {
    id: "group-1",
    text: "Hello there",
    timestamp: "20:00",
    isOwn: true,
    date: "2025-07-29",
    status: "read" as const,
  },
  {
    id: "group-2",
    text: "Hi what's up",
    timestamp: "20:01",
    isOwn: false,
    date: "2025-07-29",
    sender: "Adoum Ouang-namou Emmanuel",
    senderAvatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

const mockChatInfo = {
  id: "1",
  name: "Naré Barké Noaga Mariama",
  avatar:
    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
  isOnline: true,
  type: "direct" as const,
  isAnonymous: false,
};

const mockGroupInfo = {
  id: "group-1",
  name: "Emma group",
  subtitle: "Adoum, You",
  avatar: null,
  isOnline: false,
  type: "group" as const,
  isAnonymous: false,
  memberCount: 2,
};

const ChatConversationScreen: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);

  // Determine if this is a group chat
  const isGroupChat = params.id === "group-1";
  const chatInfo = isGroupChat ? mockGroupInfo : mockChatInfo;
  const initialMessages = isGroupChat ? mockGroupMessages : mockMessages;

  const [messages, setMessages] = useState(initialMessages);
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

  const chatId = params.id as string;

  useEffect(() => {
    console.log("Loading chat:", chatId);
  }, [chatId]);

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
          return matchesText && matchesDate && !('isSystem' in message && message.isSystem);
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

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: inputText.trim(),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwn: true,
        date: new Date().toISOString().split("T")[0],
        status: "sent" as const,
        replyTo: replyToMessage
          ? {
              id: replyToMessage.id,
              text: replyToMessage.text,
              sender: chatInfo.name,
            }
          : undefined,
      } as any;

      setMessages((prev) => [...prev, newMessage]);
      setInputText("");
      setReplyToMessage(null);

      console.log("Sending message:", newMessage);
      scrollToBottom();
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
        if (message && !('isDeleted' in message && message.isDeleted)) {
          await Clipboard.setStringAsync(message.text);
          console.log("Message copied to clipboard");
        }
      } else if (selectedMessages.length > 1) {
        const selectedMessagesData = messages
          .filter((m) => selectedMessages.includes(m.id) && !('isDeleted' in m && m.isDeleted))
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
      if (message && !('isDeleted' in message && message.isDeleted)) {
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

  const handleDeleteForEveryone = () => {
    setMessages((prev) =>
      prev.map((msg) =>
        selectedMessages.includes(msg.id)
          ? ({ ...msg, isDeleted: true, text: "" } as typeof msg)
          : msg
      )
    );
    setShowDeleteModal(false);
    setSelectedMessages([]);
  };

  const handleDeleteForMe = () => {
    setMessages((prev) =>
      prev.filter((msg) => !selectedMessages.includes(msg.id))
    );
    setShowDeleteModal(false);
    setSelectedMessages([]);
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
    <SafeAreaView style={styles.container} edges={["top"]}>
      {isSearchMode ? (
        <ChatSearchHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onBack={handleSearchBack}
          onCalendar={handleSearchCalendar}
          onPrevious={handleSearchPrevious}
          onNext={handleSearchNext}
          currentResult={currentSearchIndex >= 0 ? currentSearchIndex + 1 : 0}
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
                {isGroupChat && date === "2025-07-29" && (
                  <GroupWelcomeMessage
                    groupName={chatInfo.name}
                    memberCount={'memberCount' in chatInfo ? chatInfo.memberCount : 2}
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
                      searchQuery={searchQuery.length >= 2 ? searchQuery : ""}
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
    </SafeAreaView>
  );
};

export default ChatConversationScreen;
