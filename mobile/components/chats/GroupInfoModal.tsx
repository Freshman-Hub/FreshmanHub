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
import { UserPlus, Edit, Settings } from "lucide-react-native";

interface GroupInfoModalProps {
  visible: boolean;
  onClose: () => void;
  groupId: string;
  onAddMembers: () => void;
  onChangeGroupName: () => void;
  onGroupPermissions: () => void;
}

export function GroupInfoModal({
  visible,
  onClose,
  groupId,
  onAddMembers,
  onChangeGroupName,
  onGroupPermissions,
}: GroupInfoModalProps) {
  const { theme } = useTheme();

  const options = [
    {
      id: "add-members",
      title: "Add members",
      icon: UserPlus,
      onPress: () => {
        onClose();
        onAddMembers();
      },
    },
    {
      id: "change-name",
      title: "Change group name",
      icon: Edit,
      onPress: () => {
        onClose();
        onChangeGroupName();
      },
    },
    {
      id: "group-permissions",
      title: "Group permissions",
      icon: Settings,
      onPress: () => {
        onClose();
        onGroupPermissions();
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
