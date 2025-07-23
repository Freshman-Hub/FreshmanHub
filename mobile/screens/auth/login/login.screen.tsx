"use client";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomAlert from "../../../components/ui/CustomAlert";
import { useTheme } from "../../../contexts/ThemeContext";
import { useUser } from "../../../contexts/UserContext";
import { ValidationUtils } from "../../../utils/validation";

const { height } = Dimensions.get("window");

export default function LoginScreen() {
  const { theme, isDark } = useTheme();
  const { signIn, loading: userLoading } = useUser();
  const router = useRouter();

  // State for custom alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<
    "success" | "error" | "info" | "warning"
  >("info");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [emailError, setEmailError] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateEmail = (email: string) => {
    const validation = ValidationUtils.validateEmail(email);
    setEmailError(validation.isValid ? "" : validation.error || "");
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    validateEmail(text);
  };

  // ...existing code...

  const handleLogin = async () => {
    // Client-side validation
    const emailValidation = ValidationUtils.validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || "");
      return;
    }

    if (!email.trim()) {
      setAlertType("error");
      setAlertTitle("Validation Error");
      setAlertMessage("Email is required");
      return;
    }

    if (!password.trim()) {
      setAlertType("error");
      setAlertTitle("Validation Error");
      setAlertMessage("Password is required");
      return;
    }

    setIsLoading(true);

    try {
      // Use Firebase authentication
      const { user, error } = await signIn(email, password);

      if (error) {
        setAlertType("error");
        setAlertTitle("Login Failed");
        setAlertMessage(error);
        setShowAlert(true);
        setIsLoading(false);
        return;
      }

      if (user) {
        setAlertType("success");
        setAlertTitle("Login Successful! 🎉");
        setAlertMessage(`Welcome back, ${user.firstName || "User"}!`);
        setShowAlert(true);
        // Navigate based on user role - using your actual UserRole types
        setTimeout(() => {
          if (
            user.role === "head_of_coaches" ||
            user.role === "academic_advisor" ||
            user.role === "odip" ||
            user.role === "sle" ||
            user.role === "admin"
          ) {
            // Admin users can access admin features
            router.replace("/(head-coach)");
          } else if (user.role === "freshman") {
            // Freshman users
            router.replace("/(student-tabs)");
          } else if (
            user.role === "peer_coach" ||
            user.role === "peer_advisor" ||
            user.role === "buddy"
          ) {
            // Coach/advisor users
            router.replace("/(head-coach)");
          } else {
            // Regular users (continuous, student_leader)
            router.replace("/(student-tabs)");
          }
        }, 1000);
      }
    } catch (error: any) {
      setAlertType("error");
      setAlertTitle("Login Failed");
      setAlertMessage(error.message || "An unexpected error occurred");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };
  const navigateToUserRequest = () => {
    router.push("/(auth)/register");
  };

  const navigateToForgotPassword = () => {
    router.push("/(auth)/forgot-password");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    backgroundImage: {
      height: height * 0.35,
      justifyContent: "center",
      alignItems: "center",
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    headerContent: {
      alignItems: "center",
    },
    logo: {
      width: 90,
      height: 90,
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      borderRadius: theme.borderRadius.lg,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.md,
      borderWidth: 2,
      borderColor: "rgba(255, 255, 255, 0.2)",
    },
    appTitle: {
      ...theme.typography.h1,
      color: "#ffffff",
      textAlign: "center",
      marginBottom: theme.spacing.xs,
      fontWeight: "700",
    },
    appSubtitle: {
      ...theme.typography.body,
      color: "rgba(255, 255, 255, 0.9)",
      textAlign: "center",
      fontWeight: "500",
    },
    formContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: theme.borderRadius.xxl,
      borderTopRightRadius: theme.borderRadius.xxl,
      marginTop: -theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.xl,
      justifyContent: "space-between",
    },
    formContent: {
      flex: 1,
    },
    welcomeText: {
      ...theme.typography.h2,
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.xs,
      fontWeight: "700",
    },
    subtitleText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: theme.spacing.xl,
      fontWeight: "500",
    },
    inputContainer: {
      marginBottom: theme.spacing.lg,
    },
    inputLabel: {
      ...theme.typography.label,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      fontWeight: "500",
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
      borderColor: theme.colors.primary,
      backgroundColor: isDark ? theme.colors.surface : "#f8faff",
    },
    inputWrapperDefault: {
      borderColor: theme.colors.border,
    },
    inputWrapperError: {
      borderColor: theme.colors.error,
      backgroundColor: isDark ? theme.colors.surface : "#fff5f5",
    },
    inputIcon: {
      marginRight: theme.spacing.sm,
    },
    textInput: {
      flex: 1,
      ...theme.typography.body,
      color: theme.colors.text,
      height: "100%",
      fontWeight: "500",
    },
    eyeIcon: {
      padding: theme.spacing.xs,
    },
    errorText: {
      ...theme.typography.captionSmall,
      color: theme.colors.error,
      marginTop: theme.spacing.xs,
      marginLeft: theme.spacing.xs,
      fontWeight: "500",
    },
    rememberForgotContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.xl,
    },
    rememberContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: theme.colors.border,
      marginRight: theme.spacing.sm,
      justifyContent: "center",
      alignItems: "center",
    },
    checkboxChecked: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    rememberText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    forgotPasswordText: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    buttonContainer: {
      paddingBottom: theme.spacing.lg,
    },
    loginButton: {
      height: 56,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.lg,
      shadowColor: theme.colors.primary,
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
      fontWeight: "600",
    },
    loadingContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    loadingText: {
      ...theme.typography.button,
      color: "#ffffff",
      marginLeft: theme.spacing.sm,
      fontWeight: "600",
    },
    requestContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      marginTop: theme.spacing.md,
    },
    requestText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    requestLink: {
      ...theme.typography.body,
      color: theme.colors.primary,
      fontWeight: "600",
      marginLeft: 4,
    },
  });

  const getInputWrapperStyle = (field: string) => {
    if (field === "email" && emailError) return styles.inputWrapperError;
    if (field === "email" && emailFocused) return styles.inputWrapperFocused;
    if (field === "password" && passwordFocused)
      return styles.inputWrapperFocused;
    return styles.inputWrapperDefault;
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      /> */}

      {/* Header with Background Image */}
      <ImageBackground
        source={require("../../../assets/images/login-background.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Animated.View
            style={[
              styles.headerContent,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <View style={styles.logo}>
              <Ionicons name="school" size={45} color="#ffffff" />
            </View>
            <Text style={styles.appTitle}>Freshman Hub</Text>
            <Text style={styles.appSubtitle}>Campus Community Platform</Text>
          </Animated.View>
        </View>
      </ImageBackground>

      {/* Form Container */}
      <KeyboardAvoidingView
        style={styles.formContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <Animated.View
          style={[
            styles.formContent,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <View>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <Text style={styles.subtitleText}>
              Sign in to access your account
            </Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View
                style={[styles.inputWrapper, getInputWrapperStyle("email")]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={
                    emailError
                      ? theme.colors.error
                      : emailFocused
                        ? theme.colors.primary
                        : theme.colors.textSecondary
                  }
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your Ashesi email"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={email}
                  onChangeText={handleEmailChange}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading && !userLoading}
                />
              </View>
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View
                style={[styles.inputWrapper, getInputWrapperStyle("password")]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={
                    passwordFocused
                      ? theme.colors.primary
                      : theme.colors.textSecondary
                  }
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading && !userLoading}
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

            {/* Remember Me & Forgot Password */}
            <View style={styles.rememberForgotContainer}>
              <TouchableOpacity
                style={styles.rememberContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe && styles.checkboxChecked,
                  ]}
                >
                  {rememberMe && (
                    <Ionicons name="checkmark" size={12} color="#ffffff" />
                  )}
                </View>
                <Text style={styles.rememberText}>Remember Me</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={navigateToForgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Section */}
          <View style={styles.buttonContainer}>
            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                (isLoading || userLoading || emailError) &&
                  styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isLoading || userLoading || !!emailError}
              activeOpacity={0.8}
            >
              {isLoading || userLoading ? (
                <View style={styles.loadingContainer}>
                  <Ionicons name="refresh" size={20} color="#ffffff" />
                  <Text style={styles.loadingText}>Signing In...</Text>
                </View>
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Request Access Link */}
            <View style={styles.requestContainer}>
              <Text style={styles.requestText}>Need an account?</Text>
              <TouchableOpacity onPress={navigateToUserRequest}>
                <Text style={styles.requestLink}>Request Access</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
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
