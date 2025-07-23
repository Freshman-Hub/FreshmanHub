"use client";

import { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";

const { height } = Dimensions.get("window");

type AlertType = "success" | "error" | "info" | "warning";

interface CustomAlertProps {
  isVisible: boolean;
  type: AlertType;
  title: string;
  message: string;
  onClose: () => void;
  autoCloseDelay?: number; // New prop for auto-close delay
}

export default function CustomAlert({
  isVisible,
  type,
  title,
  message,
  onClose,
  autoCloseDelay = 4000, // Default to 4 seconds
}: CustomAlertProps) {
  const { theme } = useTheme();
  const slideAnim = useRef(new Animated.Value(-height)).current; // Start off-screen top
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const autoCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isVisible) {
      // Clear any existing timer to prevent multiple auto-closes
      if (autoCloseTimer.current) {
        clearTimeout(autoCloseTimer.current);
      }

      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0, // Slide to top of screen
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Start auto-close timer after animation completes
        autoCloseTimer.current = setTimeout(() => {
          onClose();
        }, autoCloseDelay);
      });
    } else {
      // If alert is no longer visible, clear the timer
      if (autoCloseTimer.current) {
        clearTimeout(autoCloseTimer.current);
        autoCloseTimer.current = null;
      }
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -height, // Slide back off-screen top
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }

    // Cleanup on unmount
    return () => {
      if (autoCloseTimer.current) {
        clearTimeout(autoCloseTimer.current);
      }
    };
  }, [isVisible, slideAnim, opacityAnim, onClose, autoCloseDelay]);

  const getColors = (alertType: AlertType) => {
    switch (alertType) {
      case "success":
        return {
          background: theme.colors.surface, // Solid background
          border: theme.colors.success,
          text: theme.colors.text, // Use main text color for readability
          iconColor: theme.colors.success,
        };
      case "error":
        return {
          background: theme.colors.surface,
          border: theme.colors.error,
          text: theme.colors.text,
          iconColor: theme.colors.error,
        };
      case "info":
        return {
          background: theme.colors.surface,
          border: theme.colors.primary,
          text: theme.colors.text,
          iconColor: theme.colors.primary,
        };
      case "warning":
        return {
          background: theme.colors.surface,
          border: theme.colors.warning,
          text: theme.colors.text,
          iconColor: theme.colors.warning,
        };
      default:
        return {
          background: theme.colors.surface,
          border: theme.colors.border,
          text: theme.colors.text,
          iconColor: theme.colors.textSecondary,
        };
    }
  };

  const getIcon = (alertType: AlertType) => {
    switch (alertType) {
      case "success":
        return "checkmark-circle";
      case "error":
        return "close-circle";
      case "info":
        return "information-circle";
      case "warning":
        return "warning";
      default:
        return "alert-circle";
    }
  };

  const colors = getColors(type);
  const iconName = getIcon(type);

  const styles = StyleSheet.create({
    alertContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 999,
      paddingTop: 60, // Adjust for SafeAreaView top inset
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: colors.background,
      borderBottomLeftRadius: theme.borderRadius.xl,
      borderBottomRightRadius: theme.borderRadius.xl,
      borderBottomWidth: 2,
      borderBottomColor: colors.border,
      shadowColor: colors.border,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 10,
    },
    content: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingVertical: theme.spacing.md,
    },
    icon: {
      marginRight: theme.spacing.md,
      marginTop: 4, // Align icon with title
    },
    textContainer: {
      flex: 1,
    },
    title: {
      ...theme.typography.h5,
      color: colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.xs,
    },
    message: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      lineHeight: 20,
        opacity: 0.9,
      fontWeight: "500"
    },
    closeButton: {
      position: "absolute",
      top: 70,
      right: theme.spacing.lg,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: "rgba(0,0,0,0.1)",
    },
  });

  if (!isVisible && slideAnim.__getValue() === -height) {
    return null; // Don't render if not visible and fully off-screen
  }

  return (
    <Animated.View
      style={[
        styles.alertContainer,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={styles.content}>
        <Ionicons
          name={iconName as any}
          size={30}
          color={colors.iconColor}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>
    </Animated.View>
  );
}
