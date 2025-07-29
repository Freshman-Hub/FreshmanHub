"use client"
import { TouchableOpacity, StyleSheet } from "react-native"
import { useTheme } from "@/contexts/ThemeContext"
import { Plus } from "lucide-react-native"

interface FloatingActionButtonProps {
  onPress: () => void
}

export function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  const { theme } = useTheme()

  const styles = StyleSheet.create({
    fab: {
      position: "absolute",
      bottom: 15,
      right: theme.spacing.md,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      elevation: 8,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
  })

  return (
    <TouchableOpacity style={styles.fab} onPress={onPress}>
      <Plus size={24} color="white" />
    </TouchableOpacity>
  )
}
