"use client"
import { View, Image, Text, TouchableOpacity, StyleSheet, type ViewStyle } from "react-native"
import { useTheme } from "@/contexts/ThemeContext"

interface AvatarProps {
  imageUrl?: string
  initials?: string
  size?: number
  onPress?: () => void
  style?: ViewStyle
}

export function Avatar({ imageUrl, initials, size = 40, onPress, style }: AvatarProps) {
  const { theme } = useTheme()

  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    image: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    initials: {
      color: "white",
      ...theme.typography.button,
      fontSize: size * 0.4,
      fontWeight: "700",
    },
  });

  const AvatarContent = (
    <View style={[styles.container, style]}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <Text style={styles.initials}>{initials || "?"}</Text>
      )}
    </View>
  )

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {AvatarContent}
      </TouchableOpacity>
    )
  }

  return AvatarContent
}
