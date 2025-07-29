"use client"
import { View, Text, Image, StyleSheet } from "react-native"
import { useTheme } from "@/contexts/ThemeContext"
import { Users, UserX, Megaphone } from "lucide-react-native"

interface AvatarProps {
  source: string | null
  name: string
  size: number
  isOnline?: boolean
  type?: "direct" | "group" | "anonymous" | "announcement"
}

export function Avatar({ source, name, size, isOnline = false, type = "direct" }: AvatarProps) {
  const { theme } = useTheme()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getBackgroundColor = (name: string) => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
      "#85C1E9",
    ]
    const index = name.length % colors.length
    return colors[index]
  }

  const getTypeIcon = () => {
    const iconSize = size * 0.4
    switch (type) {
      case "group":
        return <Users size={iconSize} color="white" />
      case "anonymous":
        return <UserX size={iconSize} color="white" />
      case "announcement":
        return <Megaphone size={iconSize} color="white" />
      default:
        return null
    }
  }

  const styles = StyleSheet.create({
    container: {
      position: "relative",
    },
    avatar: {
      width: size,
      height: size,
      borderRadius: size / 2,
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      width: size,
      height: size,
      borderRadius: size / 2,
    },
    initials: {
      color: "white",
      fontSize: size * 0.35,
      fontWeight: "600",
    },
    onlineIndicator: {
      position: "absolute",
      bottom: 2,
      right: 2,
      width: size * 0.25,
      height: size * 0.25,
      borderRadius: size * 0.125,
      backgroundColor: theme.colors.success,
      borderWidth: 2,
      borderColor: theme.colors.background,
    },
  })

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.avatar,
          {
            backgroundColor: source ? "transparent" : getBackgroundColor(name),
          },
        ]}
      >
        {source ? (
          <Image source={{ uri: source }} style={styles.image} />
        ) : type !== "direct" ? (
          getTypeIcon()
        ) : (
          <Text style={styles.initials}>{getInitials(name)}</Text>
        )}
      </View>
      {isOnline && type === "direct" && <View style={styles.onlineIndicator} />}
    </View>
  )
}
