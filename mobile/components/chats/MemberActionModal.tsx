"use client";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { MessageCircle, Shield, UserMinus } from "lucide-react-native";
import { useRouter } from "expo-router";

interface Member {
  id: string;
  name: string;
  isAdmin: boolean;
  isCurrentUser: boolean;
}

interface MemberActionModalProps {
  visible: boolean;
  onClose: () => void;
  member: Member | null;
  groupId: string;
  onMakeAdmin: (memberId: string) => void;
  onRemoveMember: (memberId: string) => void;
}

export function MemberActionModal({
  visible,
  onClose,
  member,
  groupId,
  onMakeAdmin,
  onRemoveMember,
}: MemberActionModalProps) {
  const { theme } = useTheme();
  const router = useRouter();

  if (!member) return null;

  const handleMessageMember = () => {
    onClose();
    // Navigate to member's conversation
    router.push(`/(routes)/chats/${member.id}`);
  };

  const handleMakeAdmin = () => {
    onClose();
    onMakeAdmin(member.id);
  };

  const handleRemoveMember = () => {
    onClose();
    onRemoveMember(member.id);
  };

  // Options for current user (me)
  const currentUserOptions = [
    {
      id: "message",
      title: `Message ${member.name.split(" ")[0]}`,
      icon: MessageCircle,
      onPress: handleMessageMember,
    },
  ];

  // Options for other members
  const otherMemberOptions = [
    {
      id: "message",
      title: `Message ${member.name.split(" ")[0]}`,
      icon: MessageCircle,
      onPress: handleMessageMember,
    },
    {
      id: "make-admin",
      title: `Make ${member.name.split(" ")[0]} group admin`,
      icon: Shield,
      onPress: handleMakeAdmin,
    },
    {
      id: "remove",
      title: `Remove ${member.name.split(" ")[0]}`,
      icon: UserMinus,
      onPress: handleRemoveMember,
      isDestructive: true,
    },
  ];

  const options = member.isCurrentUser
    ? currentUserOptions
    : otherMemberOptions;

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modal: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: theme.spacing.lg,
      marginHorizontal: theme.spacing.xl,
      minWidth: 280,
      maxWidth: 320,
    },
    option: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      alignItems: "flex-start",
    },
    optionText: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "400",
    },
    destructiveText: {
      color: "#FF3B30",
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modal}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.option}
                  onPress={option.onPress}
                >
                  <Text
                    style={[
                      styles.optionText,
                      option.isDestructive && styles.destructiveText,
                    ]}
                  >
                    {option.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
