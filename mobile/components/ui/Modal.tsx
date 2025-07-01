"use client"

import type { ReactNode } from "react"
import { Modal as RNModal, View, Text, TouchableOpacity, StyleSheet, type ViewStyle, Dimensions } from "react-native"
import { X } from "lucide-react-native"
import { useTheme } from "@/contexts/ThemeContext"

interface ModalProps {
  visible: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  dismissable?: boolean
  fullScreen?: boolean
  style?: ViewStyle
  contentStyle?: ViewStyle
  showCloseIcon?: boolean
}

const { height: screenHeight } = Dimensions.get("window")

export function Modal({
  visible,
  onClose,
  children,
  title,
  dismissable = true,
  fullScreen = false,
  style,
  contentStyle,
  showCloseIcon = true,
}: ModalProps) {
  const { theme } = useTheme()

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: fullScreen ? "flex-start" : "center",
      alignItems: "center",
      padding: fullScreen ? 0 : theme.spacing.lg,
    },
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: fullScreen ? 0 : theme.borderRadius.xl,
      width: fullScreen ? "100%" : "90%",
      maxHeight: fullScreen ? screenHeight : screenHeight * 0.8,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 10,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      flex: 1,
    },
    closeButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: theme.spacing.lg,
    },
  })

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={dismissable ? onClose : undefined}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={dismissable ? onClose : undefined}>
        <TouchableOpacity activeOpacity={1} style={[styles.container, style]} onPress={() => {}}>
          {(title || showCloseIcon) && (
            <View style={styles.header}>
              {title && <Text style={styles.title}>{title}</Text>}
              {showCloseIcon && (
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <X color={theme.colors.text} size={24} />
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={[styles.content, contentStyle]}>{children}</View>
        </TouchableOpacity>
      </TouchableOpacity>
    </RNModal>
  )
}
