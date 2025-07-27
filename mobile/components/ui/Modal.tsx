"use client";

import { ReactNode } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
   Modal as RNModal
} from "react-native";
import { X } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  dismissable?: boolean;
  showCloseIcon?: boolean;
  animationType?: "slide" | "fade" | "none";
  position?: "center" | "bottom";
}

const { height: screenHeight } = Dimensions.get("window");

export function Modal({
  visible,
  onClose,
  children,
  dismissable = true,
  showCloseIcon = true,
  animationType = "slide",
  position = "center",
}: ModalProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: position === "bottom" ? "flex-end" : "center",
      alignItems: "center",
    },
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: position === "bottom" ? 0 : theme.borderRadius.xl,
      borderTopLeftRadius:
        position === "bottom" ? theme.borderRadius.xl : theme.borderRadius.xl,
      borderTopRightRadius:
        position === "bottom" ? theme.borderRadius.xl : theme.borderRadius.xl,
      maxWidth: position === "bottom" ? "100%" : "90%",
      width: position === "bottom" ? "100%" : "auto",
      maxHeight: position === "bottom" ? screenHeight * 0.9 : "80%",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: -4,
      },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 16,
    },
    closeButton: {
      position: "absolute",
      top: theme.spacing.md,
      right: theme.spacing.md,
      zIndex: 1,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.sm,
    },
  });

  return (
    <RNModal
      visible={visible}
      transparent={true}
      animationType={animationType}
      onRequestClose={dismissable ? onClose : undefined}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={dismissable ? onClose : undefined}
      >
        <TouchableOpacity
          style={styles.container}
          activeOpacity={1}
          onPress={() => {}}
        >
          {showCloseIcon && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X color={theme.colors.textSecondary} size={20} />
            </TouchableOpacity>
          )}
          {children}
        </TouchableOpacity>
      </TouchableOpacity>
    </RNModal>
  );
}
