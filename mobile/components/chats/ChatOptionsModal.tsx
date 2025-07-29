"use client";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Users, UserPlus, UserX } from "lucide-react-native";
import { useRouter } from "next/navigation";

interface ChatOptionsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ChatOptionsModal({ visible, onClose }: ChatOptionsModalProps) {
  const { theme } = useTheme();
  const router = useRouter();

  const options = [
    {
      id: "group",
      title: "New group",
      icon: Users,
      onPress: () => {
        router.push("/(routes)/chats/create-group/select-contacts");
      },
    },
    {
      id: "direct",
      title: "New contact",
      icon: UserPlus,
      onPress: () => {
        // Placeholder for direct chat creation logic
      },
    },
    {
      id: "anonymous",
      title: "Anonymous chat",
      icon: UserX,
      onPress: () => {
        // Placeholder for anonymous chat creation logic
      },
    },
  ];

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modal: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      paddingVertical: theme.spacing.lg,
    },
    handle: {
      width: 40,
      height: 4,
      backgroundColor: theme.colors.border,
      borderRadius: 2,
      alignSelf: "center",
      marginBottom: theme.spacing.lg,
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: theme.spacing.md,
    },
    optionText: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "500",
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modal}>
              <View style={styles.handle} />
              {options.map((option) => {
                const IconComponent = option.icon;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.option}
                    onPress={option.onPress}
                  >
                    <View style={styles.iconContainer}>
                      <IconComponent size={20} color="white" />
                    </View>
                    <Text style={styles.optionText}>{option.title}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
