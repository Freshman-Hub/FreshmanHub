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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { AuthService } from "../../../services/auth.service";
import { ValidationUtils } from "../../../utils/validation";
import CustomAlert from "../../../components/ui/CustomAlert"; // Import the new component

export default function ForgotPasswordScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [emailError, setEmailError] = useState("");

  // State for custom alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<
    "success" | "error" | "info" | "warning"
  >("info");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateEmail = (email: string) => {
    const validation = ValidationUtils.validateEmail(email);
    setEmailError(validation.isValid ? "" : validation.error || "");
    return validation.isValid;
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      validateEmail(text);
    }
  };

  const handleSendResetEmail = async () => {
    // Validate email
    if (!validateEmail(email)) {
      setAlertType("error");
      setAlertTitle("Validation Error");
      setAlertMessage(
        emailError || "Please enter a valid Ashesi email address."
      );
      setShowAlert(true);
      return;
    }

    setIsLoading(true);
    setShowAlert(false); // Hide any previous alerts

    try {
      // Send password reset email using Firebase
      const { error } = await AuthService.sendPasswordReset(email);

      if (error) {
        setAlertType("error");
        setAlertTitle("Reset Failed");
        setAlertMessage(error);
        setShowAlert(true);
        return;
      }

      // Success - show success state
      setEmailSent(true);

      // Animate success state
      Animated.spring(successAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      setAlertType("success");
      setAlertTitle("Reset Email Sent! 📧");
      setAlertMessage(
        `We've sent a password reset link to ${email}. Please check your email`
      );
      setShowAlert(true);

      // Optional: Navigate back to login after a delay
    //   setTimeout(() => {
    //     router.back();
    //   }, 4000); // Increased delay to allow user to read the alert
    } catch (error: any) {
      setAlertType("error");
      setAlertTitle("Error");
      setAlertMessage(
        error.message || "Failed to send reset email. Please try again."
      );
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setShowAlert(false); // Hide current alert before resending
    await handleSendResetEmail();
  };

  const navigateToLogin = () => {
    router.back();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    backgroundHeader: {
      height: 200, // Reduced from 280
      position: "relative",
    },
    gradientOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    headerContent: {
      alignItems: "center",
      paddingTop: 25,
    },
    backButton: {
      position: "absolute",
      top: 60,
      left: 20,
      zIndex: 10,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      justifyContent: "center",
      alignItems: "center",
      backdropFilter: "blur(10px)",
    },
    logoContainer: {
      width: 80, // Reduced from 100
      height: 80, // Reduced from 100
      borderRadius: 40, // Reduced from 50
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.md, // Reduced from lg
      borderWidth: 2, // Reduced from 3
      borderColor: "rgba(255, 255, 255, 0.3)",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 }, // Reduced from 8
      shadowOpacity: 0.3,
      shadowRadius: 12, // Reduced from 16
      elevation: 6, // Reduced from 8
    },
    headerTitle: {
      ...theme.typography.h2, // Changed from h1
      color: "#ffffff",
      marginBottom: theme.spacing.xs,
      fontWeight: "700",
    },
    headerSubtitle: {
      ...theme.typography.bodySmall, // Changed from body
      color: "rgba(255, 255, 255, 0.9)",
      textAlign: "center",
      fontWeight: "500",
    },
    scrollContainer: {
      flex: 1,
    },
    formContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: theme.borderRadius.xxl,
      borderTopRightRadius: theme.borderRadius.xxl,
      marginTop: -theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.xl,
    },
    welcomeText: {
      ...theme.typography.h3, // Changed from h2
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.sm,
      fontWeight: "700",
    },
    subtitleText: {
      ...theme.typography.bodySmall, // Changed from body
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: theme.spacing.lg, // Reduced from xl
      lineHeight: 20, // Reduced from 24
      paddingHorizontal: theme.spacing.md,
      fontWeight: "600",
    },
    infoCard: {
      backgroundColor: theme.colors.primary + "15",
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary + "70",
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 1,
    },
    infoHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    infoIcon: {
      marginRight: theme.spacing.sm,
    },
    infoTitle: {
      ...theme.typography.h6,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    infoText: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      lineHeight: 20,
        opacity: 0.9,
        fontWeight: "500",
    },
    inputContainer: {
      marginBottom: theme.spacing.xxl, // Reduced from lg
    },
    inputLabel: {
      ...theme.typography.label,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      fontWeight: "600",
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xxl,
      borderWidth: 1,
      paddingHorizontal: theme.spacing.lg,
      height: 50,
      shadowColor: theme.colors.border,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    inputWrapperFocused: {
      borderColor: theme.colors.primary,
      backgroundColor: isDark ? theme.colors.surface : "#f8faff",
      shadowColor: theme.colors.primary,
      shadowOpacity: 0.2,
    },
    inputWrapperDefault: {
      borderColor: theme.colors.border,
    },
    inputWrapperError: {
      borderColor: theme.colors.error,
      backgroundColor: isDark ? theme.colors.surface : "#fff5f5",
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
    errorText: {
      ...theme.typography.captionSmall,
      color: theme.colors.error,
      marginTop: theme.spacing.sm,
      marginLeft: theme.spacing.sm,
      fontWeight: "500",
    },
    sendButton: {
      height: 50, // Reduced from 60
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.xxl,
      justifyContent: "center",
      alignItems: "center",
      marginTop: theme.spacing.lg, // Reduced from xl
      marginBottom: theme.spacing.md, // Reduced from lg
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 }, // Reduced from 6
      shadowOpacity: 0.3,
      shadowRadius: 8, // Reduced from 12
      elevation: 4, // Reduced from 6
    },
    sendButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
      shadowOpacity: 0,
      elevation: 0,
    },
    sendButtonText: {
      ...theme.typography.button,
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "700",
    },
    loadingContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      ...theme.typography.button,
      color: "#ffffff",
      marginLeft: theme.spacing.sm,
        fontSize: 16,
        fontWeight: "500",
    },
    successContainer: {
      alignItems: "center",
      paddingVertical: theme.spacing.xl,
    },
    successCard: {
      backgroundColor: theme.colors.success + "15",
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.xl,
      alignItems: "center",
      borderWidth: 2,
      borderColor: theme.colors.success + "30",
      marginBottom: theme.spacing.xl,
      shadowColor: theme.colors.success,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
    //   elevation: 6,
    },
    successIcon: {
      marginBottom: theme.spacing.lg,
    },
    successTitle: {
      ...theme.typography.h3,
      color: theme.colors.success,
      fontWeight: "700",
      marginBottom: theme.spacing.md,
      textAlign: "center",
    },
    successText: {
      ...theme.typography.body,
      color: theme.colors.text,
      textAlign: "center",
      lineHeight: 24,
        marginBottom: theme.spacing.lg,
        fontWeight: "500",
    },
    emailHighlight: {
      ...theme.typography.body,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    resendButton: {
      height: 50,
        backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.xxl,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.primary,
      marginBottom: theme.spacing.md,
    },
    resendButtonText: {
      ...theme.typography.button,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    backContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      marginTop: theme.spacing.lg,
    },
    backText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    backLink: {
      ...theme.typography.body,
      color: theme.colors.primary,
      fontWeight: "600",
      marginLeft: 4,
    },
    instructionsCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    instructionsTitle: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: theme.spacing.md,
    },
    instructionItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: theme.spacing.sm,
    },
    instructionNumber: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: theme.spacing.sm,
    },
    instructionNumberText: {
      ...theme.typography.captionSmall,
      color: "#ffffff",
      fontWeight: "600",
    },
    instructionText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      flex: 1,
        lineHeight: 18, // Reduced from 20
        fontWeight: "500",
    },
  });

  const getInputWrapperStyle = () => {
    if (emailError) return styles.inputWrapperError;
    if (focusedField === "email") return styles.inputWrapperFocused;
    return styles.inputWrapperDefault;
  };

  const getInputIconColor = () => {
    if (emailError) return theme.colors.error;
    if (focusedField === "email") return theme.colors.primary;
    return theme.colors.textSecondary;
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.primary}
      />

      {/* Header */}
      <View style={styles.backgroundHeader}>
        <View style={styles.gradientOverlay}>
          <TouchableOpacity style={styles.backButton} onPress={navigateToLogin}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>

          <Animated.View
            style={[
              styles.headerContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.logoContainer}>
              <Ionicons name="key" size={40} color="#ffffff" />
            </View>
            <Text style={styles.headerTitle}>Reset Password</Text>
            <Text style={styles.headerSubtitle}>
              We&apos;ll help you get back in
            </Text>
          </Animated.View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.formContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {!emailSent ? (
            <>
              <Text style={styles.welcomeText}>Forgot Password?</Text>
              <Text style={styles.subtitleText}>
                Enter your email to receive a password reset link.
              </Text>

              {/* Info Card */}
              <View style={styles.infoCard}>
                <View style={styles.infoHeader}>
                  <Ionicons
                    name="information-circle"
                    size={24}
                    color={theme.colors.primary}
                    style={styles.infoIcon}
                  />
                  <Text style={styles.infoTitle}>How it works</Text>
                </View>
                <Text style={styles.infoText}>
                  We&apos;ll send you a secure reset link that expires in 1 hour.
                </Text>
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={[styles.inputWrapper, getInputWrapperStyle()]}>
                  <Ionicons
                    name="mail-outline"
                    size={22}
                    color={getInputIconColor()}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your Ashesi email"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={email}
                    onChangeText={handleEmailChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField("")}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                </View>
                {emailError ? (
                  <Text style={styles.errorText}>{emailError}</Text>
                ) : null}
              </View>

              {/* Instructions
              <View style={styles.instructionsCard}>
                <Text style={styles.instructionsTitle}>Next steps:</Text>
                <Text style={styles.instructionText}>
                  • Check your email for the reset link{"\n"}• Click the link to
                  create a new password{"\n"}• Sign in with your new password
                </Text>
              </View> */}

              {/* Send Reset Email Button */}
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (isLoading || emailError) && styles.sendButtonDisabled,
                ]}
                onPress={handleSendResetEmail}
                disabled={isLoading || !!emailError}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <Ionicons name="refresh" size={22} color="#ffffff" />
                    <Text style={styles.loadingText}>Sending Email...</Text>
                  </View>
                ) : (
                  <Text style={styles.sendButtonText}>Send Reset Email</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            /* Success State */
            <Animated.View
              style={[
                styles.successContainer,
                {
                  opacity: successAnim,
                  transform: [{ scale: successAnim }],
                },
              ]}
            >
              <View style={styles.successCard}>
                <Ionicons
                  name="checkmark-circle"
                  size={80}
                  color={theme.colors.success}
                  style={styles.successIcon}
                />
                <Text style={styles.successTitle}>
                  Email Sent Successfully!
                </Text>
                <Text style={styles.successText}>
                  Reset link sent to{"\n"}
                  <Text style={styles.emailHighlight}>{email}</Text>
                  {"\n\n"}
                  Check your email and click the link to reset your password.
                </Text>

                <TouchableOpacity
                  style={styles.resendButton}
                  onPress={handleResendEmail}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <Text style={styles.resendButtonText}>Resend Email</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {/* Back to Login */}
          <View style={styles.backContainer}>
            <Text style={styles.backText}>Remember your password?</Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.backLink}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* Custom Alert Component */}
      <CustomAlert
        isVisible={showAlert}
        type={alertType}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setShowAlert(false)}
      />
    </SafeAreaView>
  );
}
