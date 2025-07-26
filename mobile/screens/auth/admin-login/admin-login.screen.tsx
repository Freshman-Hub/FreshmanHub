import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { AuthService } from "../../../services/auth.service";
import { ValidationUtils } from "../../../utils/validation";
import type { User } from "../../../types/user.types";

export default function AdminAuthScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();

  const [adminCredentials, setAdminCredentials] = useState({
    adminCode: "",
    adminEmail: "",
    adminPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleAdminAuth = async () => {
    // Validate admin credentials
    const validation = ValidationUtils.validateAdminCredentials(
      adminCredentials.adminCode,
      adminCredentials.adminEmail,
      adminCredentials.adminPassword
    );

    if (!validation.isValid) {
      Alert.alert("Validation Error", validation.errors.join("\n"));
      return;
    }

    setIsLoading(true);

    try {
      // Verify admin credentials
      const { user, error } = await AuthService.verifyAdminCredentials(
        adminCredentials.adminCode,
        adminCredentials.adminEmail,
        adminCredentials.adminPassword
      );

      if (error) {
        Alert.alert("Authentication Failed", error);
        return;
      }

      if (user) {
        // Navigate to register screen with admin data
        router.push({
          pathname: "/(auth)/register",
          params: {
            adminData: JSON.stringify({
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              email: user.email,
            }),
          },
        });
      }
    } catch (error: any) {
      Alert.alert(
        "Authentication Error",
        error.message || "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (
    field: string,
    label: string,
    placeholder: string,
    icon: string,
    required = true,
    secureTextEntry = false,
    keyboardType = "default" as any
  ) => {
    const isFocused = focusedField === field;

    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>
          {label}
          {required && <Text style={styles.requiredStar}> *</Text>}
        </Text>
        <View
          style={[
            styles.inputWrapper,
            isFocused ? styles.inputWrapperFocused : styles.inputWrapperDefault,
          ]}
        >
          <Ionicons
            name={icon as any}
            size={22}
            color={
              isFocused ? theme.colors.primary : theme.colors.textSecondary
            }
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.textInput}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textSecondary}
            value={adminCredentials[field as keyof typeof adminCredentials]}
            onChangeText={(value) =>
              setAdminCredentials((prev) => ({ ...prev, [field]: value }))
            }
            onFocus={() => setFocusedField(field)}
            onBlur={() => setFocusedField("")}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={field === "adminEmail" ? "none" : "words"}
            autoCorrect={false}
            editable={!isLoading}
          />
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      borderBottomLeftRadius: theme.borderRadius.xl,
      borderBottomRightRadius: theme.borderRadius.xl,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      justifyContent: "center",
      alignItems: "center",
      marginRight: theme.spacing.md,
    },
    headerTitle: {
      ...theme.typography.h2,
      color: "#ffffff",
      flex: 1,
      fontWeight: "700",
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xl,
      justifyContent: "center",
    },
    titleContainer: {
      alignItems: "center",
      marginBottom: theme.spacing.xl,
    },
    title: {
      ...theme.typography.h1,
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.sm,
      fontWeight: "700",
    },
    subtitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: 24,
      fontWeight: "500",
    },
    authCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.xl,
      shadowColor: theme.colors.border,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    authHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.lg,
      justifyContent: "center",
    },
    authIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.primary + "20",
      justifyContent: "center",
      alignItems: "center",
      marginRight: theme.spacing.md,
    },
    authTitle: {
      ...theme.typography.h3,
      color: theme.colors.text,
      fontWeight: "600",
    },
    authSubtitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: theme.spacing.xl,
      lineHeight: 22,
      fontWeight: "500",
    },
    inputContainer: {
      marginBottom: theme.spacing.lg,
    },
    inputLabel: {
      ...theme.typography.label,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      fontWeight: "600",
    },
    requiredStar: {
      color: theme.colors.error,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      paddingHorizontal: theme.spacing.md,
      height: 56,
      shadowColor: theme.colors.border,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    inputWrapperFocused: {
      borderColor: theme.colors.primary,
      backgroundColor: isDark ? theme.colors.background : "#f8faff",
      shadowColor: theme.colors.primary,
      shadowOpacity: 0.2,
    },
    inputWrapperDefault: {
      borderColor: theme.colors.border,
    },
    inputIcon: {
      marginRight: theme.spacing.md,
    },
    textInput: {
      flex: 1,
      ...theme.typography.body,
      color: theme.colors.text,
      height: "100%",
      fontSize: 16,
      fontWeight: "500",
    },
    authButton: {
      height: 56,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      justifyContent: "center",
      alignItems: "center",
      marginTop: theme.spacing.lg,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    authButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
      shadowOpacity: 0,
      elevation: 0,
    },
    authButtonText: {
      ...theme.typography.button,
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "700",
    },
    loadingContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    loadingText: {
      ...theme.typography.button,
      color: "#ffffff",
      marginLeft: theme.spacing.sm,
      fontSize: 16,
      fontWeight: "600",
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.primary}
      />

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={isLoading}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Authentication</Text>
      </Animated.View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Admin Portal</Text>
              <Text style={styles.subtitle}>
                Authenticate to access user management
              </Text>
            </View>

            {/* Authentication Card */}
            <View style={styles.authCard}>
              <View style={styles.authHeader}>
                <View style={styles.authIcon}>
                  <Ionicons
                    name="shield-checkmark"
                    size={30}
                    color={theme.colors.primary}
                  />
                </View>
              </View>

              <Text style={styles.authTitle}>Secure Access Required</Text>
              <Text style={styles.authSubtitle}>
                Please provide your administrative credentials to proceed
              </Text>

              {renderInput(
                "adminCode",
                "Admin Access Code",
                "Enter admin code",
                "key-outline",
                true,
                true
              )}
              {renderInput(
                "adminEmail",
                "Admin Email",
                "Enter your admin email",
                "mail-outline",
                true,
                false,
                "email-address"
              )}
              {renderInput(
                "adminPassword",
                "Admin Password",
                "Enter admin password",
                "lock-closed-outline",
                true,
                true
              )}

              <TouchableOpacity
                style={[
                  styles.authButton,
                  isLoading && styles.authButtonDisabled,
                ]}
                onPress={handleAdminAuth}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#ffffff" size={20} />
                    <Text style={styles.loadingText}>Authenticating...</Text>
                  </View>
                ) : (
                  <Text style={styles.authButtonText}>
                    Authenticate & Continue
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
