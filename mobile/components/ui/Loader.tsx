"use client"
import { View, Text, StyleSheet, type ViewStyle, Modal } from "react-native"
import { Loader as LoaderIcon } from "lucide-react-native"
import { useTheme } from "@/contexts/ThemeContext"

interface LoaderProps {
  visible: boolean
  message?: string
  size?: "small" | "large"
  style?: ViewStyle
}

export function Loader({ visible, message, size = "large", style }: LoaderProps) {
  const { theme } = useTheme()

  const iconSize = size === "large" ? 40 : 24

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      alignItems: "center",
      justifyContent: "center",
    },
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.xl,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 10,
      minWidth: 120,
    },
    message: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginTop: theme.spacing.md,
      textAlign: "center",
    },
  })

  if (!visible) return null

  return (
    <Modal transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={[styles.container, style]}>
          <LoaderIcon color={theme.colors.primary} size={iconSize} />
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>
    </Modal>
  )
}
