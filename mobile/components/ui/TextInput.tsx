"use client";

import type React from "react";
import { useState } from "react";
import {
  View,
  TextInput as RNTextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
  type KeyboardType,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardType;
  multiline?: boolean;
  error?: boolean;
  disabled?: boolean;
  leftIcon?: React.ComponentType<{ color: string; size: number }>;
  rightIcon?: React.ComponentType<{ color: string; size: number }>;
  onIconPress?: () => void;
  style?: ViewStyle;
  inputStyle?: TextStyle;
}

export function TextInput({
  value,
  onChangeText,
  label,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  multiline = false,
  error = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onIconPress,
  style,
  inputStyle,
}: TextInputProps) {
  const { theme } = useTheme();
  const [isSecureTextVisible, setIsSecureTextVisible] = useState(false);

  const toggleSecureText = () => {
    setIsSecureTextVisible(!isSecureTextVisible);
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    label: {
      ...theme.typography.label,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      fontWeight: "500",
    },
    inputContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: error ? theme.colors.error : theme.colors.border,
      flexDirection: "row",
      alignItems: multiline ? "flex-start" : "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: multiline ? theme.spacing.md : theme.spacing.sm,
      minHeight: multiline ? 100 : 48,
    },
    inputContainerFocused: {
      borderColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    },
    inputContainerDisabled: {
      backgroundColor: theme.colors.border + "40",
      borderColor: theme.colors.border,
    },
    leftIconContainer: {
      marginRight: theme.spacing.sm,
      paddingTop: multiline ? theme.spacing.xs : 0,
    },
    input: {
      flex: 1,
      color: theme.colors.text,
      ...theme.typography.body,
      textAlignVertical: multiline ? "top" : "center",
      fontWeight: "400",
    },
    rightIconContainer: {
      marginLeft: theme.spacing.sm,
      paddingTop: multiline ? theme.spacing.xs : 0,
    },
    iconButton: {
      padding: theme.spacing.xs,
    },
  });

  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          disabled && styles.inputContainerDisabled,
        ]}
      >
        {LeftIcon && (
          <View style={styles.leftIconContainer}>
            <LeftIcon color={theme.colors.textSecondary} size={20} />
          </View>
        )}

        <RNTextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          secureTextEntry={secureTextEntry && !isSecureTextVisible}
          keyboardType={keyboardType}
          multiline={multiline}
          editable={!disabled}
          autoCorrect={false}
          autoCapitalize="none"
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
        />

        {secureTextEntry && (
          <TouchableOpacity
            style={[styles.rightIconContainer, styles.iconButton]}
            onPress={toggleSecureText}
          >
            {isSecureTextVisible ? (
              <EyeOff color={theme.colors.textSecondary} size={20} />
            ) : (
              <Eye color={theme.colors.textSecondary} size={20} />
            )}
          </TouchableOpacity>
        )}

        {RightIcon && !secureTextEntry && (
          <TouchableOpacity
            style={[styles.rightIconContainer, styles.iconButton]}
            onPress={onIconPress}
          >
            <RightIcon color={theme.colors.textSecondary} size={20} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
