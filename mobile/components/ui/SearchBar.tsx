"use client"
import { View, TextInput, TouchableOpacity, StyleSheet, type ViewStyle, type TextStyle } from "react-native"
import { Search, X, Loader } from "lucide-react-native"
import { useTheme } from "@/contexts/ThemeContext"

interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
  onSubmit?: () => void
  placeholder?: string
  autoFocus?: boolean
  loading?: boolean
  clearable?: boolean
  icon?: string
  style?: ViewStyle
  inputStyle?: TextStyle
}

export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  placeholder = "Search...",
  autoFocus = false,
  loading = false,
  clearable = true,
  style,
  inputStyle,
}: SearchBarProps) {
  const { theme } = useTheme()

  const handleClear = () => {
    onChangeText("")
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xxxl,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      height: 48,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    input: {
      flex: 1,
      color: theme.colors.text,
      fontSize: 16,
      paddingHorizontal: theme.spacing.sm,
      fontWeight: "500",
      ...theme.typography.body,
    },
    iconButton: {
      padding: theme.spacing.xs,
    },
  })

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.iconButton}>
        <Search color={theme.colors.textSecondary} size={20} />
      </TouchableOpacity>

      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        autoFocus={autoFocus}
        returnKeyType="search"
      />

      {loading && (
        <TouchableOpacity style={styles.iconButton}>
          <Loader color={theme.colors.textSecondary} size={20} />
        </TouchableOpacity>
      )}

      {clearable && value.length > 0 && !loading && (
        <TouchableOpacity style={styles.iconButton} onPress={handleClear}>
          <X color={theme.colors.textSecondary} size={20} />
        </TouchableOpacity>
      )}
    </View>
  )
}
