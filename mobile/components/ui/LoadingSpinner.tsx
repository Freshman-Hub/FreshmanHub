import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface LoadingSpinnerProps {
  size?: "small" | "large";
  color?: string;
}

export function LoadingSpinner({ size = "large", color }: LoadingSpinnerProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color || theme.colors.primary} />
    </View>
  );
}
