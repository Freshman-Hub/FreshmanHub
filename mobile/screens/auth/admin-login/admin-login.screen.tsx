"use client";

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";

export default function AdminLoginScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [adminCode, setAdminCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleAdminLogin = async () => {
    if (!adminCode.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // TODO: Verify admin code and credentials
    if (adminCode !== "ADMIN2024") {
      Alert.alert("Error", "Invalid admin access code");
      return;
    }

    setIsLoading(true);

    // TODO: Implement admin authentication
    setTimeout(() => {
      setIsLoading(false);
      router.push("/(auth)/register");
    }, 1500);
  };

  const navigateToLogin = () => {
    router.back();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.error,
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      flexDirection: "row",
      alignItems: "center",
    },
    backButton: {
      marginRight: theme.spacing.md,
    },
    headerTitle: {
      ...theme.typography.h3,
      color: "#ffffff",
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xl,
      justifyContent: "center",
    },
    titleContainer: {
      alignItems: "center",
      marginBottom: theme.spacing.xl,
    },
    icon: {
      marginBottom: theme.spacing.md,
    },
    title: {
      ...theme.typography.h2,
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    warningBox: {
      backgroundColor: theme.colors.error + "20",
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.xl,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.error,
    },
    warningText: {
      ...theme.typography.bodySmall,
      color: theme.colors.error,
      fontWeight: "600",
    },
    inputContainer: {
      marginBottom: theme.spacing.lg,
    },
    inputLabel: {
      ...theme.typography.label,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      borderWidth: 2,
      paddingHorizontal: theme.spacing.md,
      height: 56,
    },
    inputWrapperFocused: {
      borderColor: theme.colors.error,
      backgroundColor: isDark ? theme.colors.surface : "#fff5f5",
    },
    inputWrapperDefault: {
      borderColor: theme.colors.border,
    },
    inputIcon: {
      marginRight: theme.spacing.sm,
    },
    textInput: {
      flex: 1,
      ...theme.typography.body,
      color: theme.colors.text,
      height: "100%",
    },
    eyeIcon: {
      padding: theme.spacing.xs,
    },
    loginButton: {
      height: 56,
      backgroundColor: theme.colors.error,
      borderRadius: theme.borderRadius.md,
      justifyContent: "center",
      alignItems: "center",
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.lg,
      shadowColor: theme.colors.error,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    loginButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
      shadowOpacity: 0,
      elevation: 0,
    },
    loginButtonText: {
      ...theme.typography.button,
      color: "#ffffff",
    },
    loadingContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    loadingText: {
      ...theme.typography.button,
      color: "#ffffff",
      marginLeft: theme.spacing.sm,
    },
    backContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: theme.spacing.md,
    },
    backText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
    },
    backLink: {
      ...theme.typography.body,
      color: theme.colors.primary,
      fontWeight: "600",
      marginLeft: 4,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={navigateToLogin}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Access</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.titleContainer}>
            <Ionicons
              name="shield-checkmark"
              size={60}
              color={theme.colors.error}
              style={styles.icon}
            />
            <Text style={styles.title}>Admin Portal</Text>
            <Text style={styles.subtitle}>
              Restricted access for administrators only
            </Text>
          </View>

          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              ⚠️ This area is restricted to authorized administrators only.
              Unauthorized access is prohibited.
            </Text>
          </View>

          {/* Admin Code Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Admin Access Code</Text>
            <View
              style={[
                styles.inputWrapper,
                focusedField === "adminCode"
                  ? styles.inputWrapperFocused
                  : styles.inputWrapperDefault,
              ]}
            >
              <Ionicons
                name="key-outline"
                size={20}
                color={
                  focusedField === "adminCode"
                    ? theme.colors.error
                    : theme.colors.textSecondary
                }
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Enter admin access code"
                placeholderTextColor={theme.colors.textSecondary}
                value={adminCode}
                onChangeText={setAdminCode}
                onFocus={() => setFocusedField("adminCode")}
                onBlur={() => setFocusedField("")}
                autoCapitalize="characters"
                autoCorrect={false}
                secureTextEntry
              />
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Admin Email</Text>
            <View
              style={[
                styles.inputWrapper,
                focusedField === "email"
                  ? styles.inputWrapperFocused
                  : styles.inputWrapperDefault,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={
                  focusedField === "email"
                    ? theme.colors.error
                    : theme.colors.textSecondary
                }
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Enter admin email"
                placeholderTextColor={theme.colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField("")}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View
              style={[
                styles.inputWrapper,
                focusedField === "password"
                  ? styles.inputWrapperFocused
                  : styles.inputWrapperDefault,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={
                  focusedField === "password"
                    ? theme.colors.error
                    : theme.colors.textSecondary
                }
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Enter password"
                placeholderTextColor={theme.colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField("")}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleAdminLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Ionicons name="refresh" size={20} color="#ffffff" />
                <Text style={styles.loadingText}>Verifying...</Text>
              </View>
            ) : (
              <Text style={styles.loginButtonText}>Access Admin Portal</Text>
            )}
          </TouchableOpacity>

          {/* Back to Login */}
          <View style={styles.backContainer}>
            <Text style={styles.backText}>Not an admin?</Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.backLink}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
