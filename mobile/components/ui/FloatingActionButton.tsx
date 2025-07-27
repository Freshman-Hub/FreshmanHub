"use client";

import { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import {
  Plus,
  Calendar,
  Clock,
  Gift,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface FloatingActionButtonProps {
  onEventPress: () => void;
  onTaskPress?: () => void;
  onReminderPress?: () => void;
}

export function FloatingActionButton({
  onEventPress,
  onTaskPress,
  onReminderPress,
}: FloatingActionButtonProps) {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleExpanded = () => {
    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);

    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleOptionPress = (action: () => void) => {
    setIsExpanded(false);
    Animated.spring(animation, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
    action();
  };

  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      bottom: 20,
      right: 20,
      alignItems: "center",
    },
    mainButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    optionsContainer: {
      position: "absolute",
      bottom: 70,
      alignItems: "center",
      gap: 12,
    },
    optionButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.surface,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    backdrop: {
      position: "absolute",
      top: -1000,
      left: -1000,
      right: -1000,
      bottom: -1000,
      backgroundColor: "transparent",
    },
  });

  const optionTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  const optionOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const mainButtonRotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  return (
    <View style={styles.container}>
      {isExpanded && (
        <TouchableOpacity
          style={styles.backdrop}
          onPress={toggleExpanded}
          activeOpacity={1}
        />
      )}

      <Animated.View
        style={[
          styles.optionsContainer,
          {
            opacity: optionOpacity,
            transform: [{ translateY: optionTranslateY }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleOptionPress(onEventPress)}
        >
          <Calendar color={theme.colors.primary} size={24} />
        </TouchableOpacity>

        {onTaskPress && (
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleOptionPress(onTaskPress)}
          >
            <Clock color={theme.colors.textSecondary} size={24} />
          </TouchableOpacity>
        )}

        {onReminderPress && (
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleOptionPress(onReminderPress)}
          >
            <Gift color={theme.colors.textSecondary} size={24} />
          </TouchableOpacity>
        )}
      </Animated.View>

      <TouchableOpacity style={styles.mainButton} onPress={toggleExpanded}>
        <Animated.View style={{ transform: [{ rotate: mainButtonRotation }] }}>
          <Plus color="white" size={28} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}
