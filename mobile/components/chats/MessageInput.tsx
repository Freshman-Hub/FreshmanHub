"use client";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Send, Mic, X } from "lucide-react-native";
// import { Send, Paperclip, Camera, Mic, X } from "lucide-react-native";
import { useRef, useState } from "react";

interface MessageInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  placeholder?: string;
  onFocus?: () => void;
  replyToMessage?: any;
  onCancelReply?: () => void;
}

export function MessageInput({
  value,
  onChangeText,
  onSend,
  placeholder = "Message",
  onFocus,
  replyToMessage,
  onCancelReply,
}: MessageInputProps) {
  const { theme } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const [inputHeight, setInputHeight] = useState(44);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    replyContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.background,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.primary,
    },
    replyContent: {
      flex: 1,
      marginLeft: theme.spacing.sm,
    },
    replyTitle: {
      ...theme.typography.captionSmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    replyText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginTop: 2,
      fontWeight: "500",
    },
    cancelReplyButton: {
      padding: theme.spacing.xs,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "flex-end",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    inputWrapper: {
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-end",
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      marginRight: theme.spacing.sm,
      minHeight: 44,
      maxHeight: 120,
    },
    textInput: {
      flex: 1,
      ...theme.typography.body,
      color: theme.colors.text,
      paddingVertical: theme.spacing.xs,
      textAlignVertical: "top",
      maxHeight: 100,
      fontWeight: "500",
    },
    attachmentButton: {
      padding: theme.spacing.xs,
      justifyContent: "center",
      alignItems: "center",
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    micButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.textSecondary,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  const hasText = value.trim().length > 0;

  const handleFocus = () => {
    onFocus?.();
  };

  const handleContentSizeChange = (event: any) => {
    const { height } = event.nativeEvent.contentSize;
    setInputHeight(Math.max(44, Math.min(120, height + 20)));
  };

  return (
    <View style={styles.container}>
      {/* Reply Preview */}
      {replyToMessage && (
        <View style={styles.replyContainer}>
          <View style={styles.replyContent}>
            <Text style={styles.replyTitle}>
              Replying to{" "}
              {replyToMessage.isOwn
                ? "You"
                : replyToMessage.sender || "Contact"}
            </Text>
            <Text style={styles.replyText} numberOfLines={2}>
              {replyToMessage.text}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.cancelReplyButton}
            onPress={onCancelReply}
          >
            <X size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      )}

      {/* Input Container */}
      <View style={styles.inputContainer}>
        <View style={[styles.inputWrapper, { height: inputHeight }]}>
          {/* <TouchableOpacity
            style={styles.attachmentButton}
            onPress={() => console.log("Attachment pressed")}
          >
            <Paperclip size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity> */}

          <TextInput
            ref={inputRef}
            style={styles.textInput}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            onFocus={handleFocus}
            onContentSizeChange={handleContentSizeChange}
            returnKeyType="default"
            blurOnSubmit={false}
          />

          {/* <TouchableOpacity
            style={styles.attachmentButton}
            onPress={() => console.log("Camera pressed")}
          >
            <Camera size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity> */}
        </View>

        <TouchableOpacity
          style={hasText ? styles.sendButton : styles.micButton}
          onPress={hasText ? onSend : () => console.log("Voice message")}
        >
          {hasText ? (
            <Send size={20} color="white" />
          ) : (
            <Mic size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
