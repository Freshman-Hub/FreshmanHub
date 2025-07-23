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
  ScrollView,
  Animated,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Picker } from "@react-native-picker/picker";
import { UserService } from "../../../services/user.service";
import { ValidationUtils } from "../../../utils/validation";
import type { UserRequest } from "../../../types/user.types";

// African countries with flags
const AFRICAN_COUNTRIES = [
  { code: "DZ", name: "Algeria", flag: "🇩🇿" },
  { code: "AO", name: "Angola", flag: "🇦🇴" },
  { code: "BJ", name: "Benin", flag: "🇧🇯" },
  { code: "BW", name: "Botswana", flag: "🇧🇼" },
  { code: "BF", name: "Burkina Faso", flag: "🇧🇫" },
  { code: "BI", name: "Burundi", flag: "🇧🇮" },
  { code: "CM", name: "Cameroon", flag: "🇨🇲" },
  { code: "CV", name: "Cape Verde", flag: "🇨🇻" },
  { code: "CF", name: "Central African Republic", flag: "🇨🇫" },
  { code: "TD", name: "Chad", flag: "🇹🇩" },
  { code: "KM", name: "Comoros", flag: "🇰🇲" },
  { code: "CG", name: "Congo", flag: "🇨🇬" },
  { code: "CD", name: "Democratic Republic of Congo", flag: "🇨🇩" },
  { code: "DJ", name: "Djibouti", flag: "🇩🇯" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "GQ", name: "Equatorial Guinea", flag: "🇬🇶" },
  { code: "ER", name: "Eritrea", flag: "🇪🇷" },
  { code: "SZ", name: "Eswatini", flag: "🇸🇿" },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹" },
  { code: "GA", name: "Gabon", flag: "🇬🇦" },
  { code: "GM", name: "Gambia", flag: "🇬🇲" },
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "GN", name: "Guinea", flag: "🇬🇳" },
  { code: "GW", name: "Guinea-Bissau", flag: "🇬🇼" },
  { code: "CI", name: "Ivory Coast", flag: "🇨🇮" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "LS", name: "Lesotho", flag: "🇱🇸" },
  { code: "LR", name: "Liberia", flag: "🇱🇷" },
  { code: "LY", name: "Libya", flag: "🇱🇾" },
  { code: "MG", name: "Madagascar", flag: "🇲🇬" },
  { code: "MW", name: "Malawi", flag: "🇲🇼" },
  { code: "ML", name: "Mali", flag: "🇲🇱" },
  { code: "MR", name: "Mauritania", flag: "🇲🇷" },
  { code: "MU", name: "Mauritius", flag: "🇲🇺" },
  { code: "MA", name: "Morocco", flag: "🇲🇦" },
  { code: "MZ", name: "Mozambique", flag: "🇲🇿" },
  { code: "NA", name: "Namibia", flag: "🇳🇦" },
  { code: "NE", name: "Niger", flag: "🇳🇪" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "RW", name: "Rwanda", flag: "🇷🇼" },
  { code: "ST", name: "São Tomé and Príncipe", flag: "🇸🇹" },
  { code: "SN", name: "Senegal", flag: "🇸🇳" },
  { code: "SC", name: "Seychelles", flag: "🇸🇨" },
  { code: "SL", name: "Sierra Leone", flag: "🇸🇱" },
  { code: "SO", name: "Somalia", flag: "🇸🇴" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "SS", name: "South Sudan", flag: "🇸🇸" },
  { code: "SD", name: "Sudan", flag: "🇸🇩" },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿" },
  { code: "TG", name: "Togo", flag: "🇹🇬" },
  { code: "TN", name: "Tunisia", flag: "🇹🇳" },
  { code: "UG", name: "Uganda", flag: "🇺🇬" },
  { code: "ZM", name: "Zambia", flag: "🇿🇲" },
  { code: "ZW", name: "Zimbabwe", flag: "🇿🇼" },
];

const YEAR_GROUPS = ["2024", "2025", "2026", "2027", "2028"];

const MAJORS = [
  "Computer Science",
  "Business Administration",
  "Engineering",
  "Management Information Systems",
  "Computer Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Economics",
  "Mathematics",
  "Liberal Arts",
  "Communications",
  "Psychology",
  "International Studies",
];

const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

export default function UserRequestScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentId: "",
    yearGroup: "",
    major: "",
    country: "",
    gender: "",
    phoneNumber: "",
    additionalInfo: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleSubmitRequest = async () => {
    // Validate form data
    const validation = ValidationUtils.validateUserRequest(formData);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      Alert.alert("Validation Error", validation.errors.join("\n"));
      return;
    }

    setIsLoading(true);

    try {
      // Submit request to Firebase
      const { requestId, error } = await UserService.submitUserRequest({
        firstName: ValidationUtils.sanitizeInput(formData.firstName),
        lastName: ValidationUtils.sanitizeInput(formData.lastName),
        email: formData.email.toLowerCase().trim(),
        studentId: ValidationUtils.sanitizeInput(formData.studentId),
        yearGroup: formData.yearGroup,
        major: formData.major,
        country: formData.country,
        gender: formData.gender as any,
        phoneNumber: formData.phoneNumber
          ? ValidationUtils.sanitizeInput(formData.phoneNumber)
          : undefined,
        additionalInfo: formData.additionalInfo
          ? ValidationUtils.sanitizeInput(formData.additionalInfo)
          : undefined,
      });

      if (error) {
        Alert.alert("Submission Failed", error);
        return;
      }

      // Success
      Alert.alert(
        "Request Submitted Successfully! 🎉",
        "Your registration request has been sent to our administrators. You'll receive an email notification once your account is approved and activated.\n\nRequest ID: " +
          requestId,
        [
          {
            text: "OK",
            onPress: () => {
              // Clear form and navigate back
              setFormData({
                firstName: "",
                lastName: "",
                email: "",
                studentId: "",
                yearGroup: "",
                major: "",
                country: "",
                gender: "",
                phoneNumber: "",
                additionalInfo: "",
              });
              router.back();
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        "Submission Error",
        error.message || "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
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
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.xl,
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
    headerIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xl,
    },
    titleContainer: {
      alignItems: "center",
      marginBottom: theme.spacing.xl,
    },
    title: {
      ...theme.typography.h2,
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
    },
    welcomeCard: {
      backgroundColor: theme.colors.primary + "15",
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    welcomeHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    welcomeIcon: {
      marginRight: theme.spacing.sm,
    },
    welcomeTitle: {
      ...theme.typography.h5,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    welcomeText: {
      ...theme.typography.body,
      color: theme.colors.text,
      lineHeight: 22,
      opacity: 0.9,
    },
    progressIndicator: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.xl,
    },
    progressStep: {
      flexDirection: "row",
      alignItems: "center",
    },
    progressDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: theme.colors.primary,
      marginHorizontal: 4,
    },
    progressLine: {
      width: 30,
      height: 2,
      backgroundColor: theme.colors.border,
      marginHorizontal: 4,
    },
    formSection: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      shadowColor: theme.colors.border,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.lg,
    },
    sectionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary + "20",
      justifyContent: "center",
      alignItems: "center",
      marginRight: theme.spacing.md,
    },
    sectionTitle: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "600",
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
      borderWidth: 2,
      paddingHorizontal: theme.spacing.lg,
      height: 60,
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
    inputWrapperError: {
      borderColor: theme.colors.error,
      backgroundColor: isDark ? theme.colors.background : "#fff5f5",
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
    },
    textArea: {
      height: 120,
      textAlignVertical: "top",
      paddingTop: theme.spacing.lg,
    },
    errorText: {
      ...theme.typography.captionSmall,
      color: theme.colors.error,
      marginTop: theme.spacing.sm,
      marginLeft: theme.spacing.sm,
    },
    pickerWrapper: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 2,
      borderColor: theme.colors.border,
      overflow: "hidden",
      shadowColor: theme.colors.border,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    picker: {
      height: 60,
      color: theme.colors.text,
    },
    submitButton: {
      height: 60,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.xl,
      justifyContent: "center",
      alignItems: "center",
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.lg,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    submitButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
      shadowOpacity: 0,
      elevation: 0,
    },
    submitButtonText: {
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
    },
    loginContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      marginTop: theme.spacing.lg,
    },
    loginText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
    },
    loginLink: {
      ...theme.typography.body,
      color: theme.colors.primary,
      fontWeight: "600",
      marginLeft: 4,
    },
    validationErrorContainer: {
      backgroundColor: theme.colors.error + "15",
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.error,
    },
    validationErrorText: {
      ...theme.typography.bodySmall,
      color: theme.colors.error,
      lineHeight: 20,
    },
  });

  const renderInput = (
    field: string,
    label: string,
    placeholder: string,
    icon: string,
    required = true,
    keyboardType = "default" as any,
    multiline = false
  ) => {
    const isFocused = focusedField === field;
    const hasError = validationErrors.some((error) =>
      error.toLowerCase().includes(label.toLowerCase())
    );

    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>
          {label}
          {required && <Text style={styles.requiredStar}> *</Text>}
        </Text>
        <View
          style={[
            styles.inputWrapper,
            hasError
              ? styles.inputWrapperError
              : isFocused
                ? styles.inputWrapperFocused
                : styles.inputWrapperDefault,
            multiline && { height: 120, alignItems: "flex-start" },
          ]}
        >
          <Ionicons
            name={icon as any}
            size={22}
            color={
              hasError
                ? theme.colors.error
                : isFocused
                  ? theme.colors.primary
                  : theme.colors.textSecondary
            }
            style={[
              styles.inputIcon,
              multiline && { marginTop: theme.spacing.lg },
            ]}
          />
          <TextInput
            style={[styles.textInput, multiline && styles.textArea]}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textSecondary}
            value={formData[field as keyof typeof formData]}
            onChangeText={(value) => handleInputChange(field, value)}
            onFocus={() => setFocusedField(field)}
            onBlur={() => setFocusedField("")}
            keyboardType={keyboardType}
            autoCapitalize={field === "email" ? "none" : "words"}
            autoCorrect={false}
            multiline={multiline}
            numberOfLines={multiline ? 4 : 1}
            editable={!isLoading}
          />
        </View>
      </View>
    );
  };

  const renderPicker = (
    field: string,
    label: string,
    options: any[],
    required = true
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>
        {label}
        {required && <Text style={styles.requiredStar}> *</Text>}
      </Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData[field as keyof typeof formData]}
          onValueChange={(value) => handleInputChange(field, value)}
          style={styles.picker}
          enabled={!isLoading}
        >
          <Picker.Item label={`Select ${label}`} value="" />
          {field === "country"
            ? options.map((country) => (
                <Picker.Item
                  key={country.code}
                  label={`${country.flag} ${country.name}`}
                  value={country.name}
                />
              ))
            : options.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
        </Picker>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.primary}
      />

      {/* Beautiful Header */}
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
          onPress={navigateToLogin}
          disabled={isLoading}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request Access</Text>
        <View style={styles.headerIcon}>
          <Ionicons name="person-add" size={24} color="#ffffff" />
        </View>
      </Animated.View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Join Freshman Hub</Text>
              <Text style={styles.subtitle}>
                Submit your information to request access to our campus
                community platform
              </Text>
            </View>

            {/* Welcome Card */}
            <View style={styles.welcomeCard}>
              <View style={styles.welcomeHeader}>
                <Ionicons
                  name="sparkles"
                  size={24}
                  color={theme.colors.primary}
                  style={styles.welcomeIcon}
                />
                <Text style={styles.welcomeTitle}>
                  Welcome to Our Community!
                </Text>
              </View>
              <Text style={styles.welcomeText}>
                🎓 Once approved, you'll have access to peer coaching, academic
                support, campus events, and a vibrant student community. We'll
                review your request and send you login credentials via email.
              </Text>
            </View>

            {/* Progress Indicator */}
            <View style={styles.progressIndicator}>
              <View style={styles.progressStep}>
                <View style={styles.progressDot} />
                <Text
                  style={{
                    ...theme.typography.captionSmall,
                    color: theme.colors.primary,
                    marginLeft: 8,
                  }}
                >
                  Submit Request
                </Text>
              </View>
              <View style={styles.progressLine} />
              <View style={styles.progressStep}>
                <View
                  style={[
                    styles.progressDot,
                    { backgroundColor: theme.colors.border },
                  ]}
                />
                <Text
                  style={{
                    ...theme.typography.captionSmall,
                    color: theme.colors.textSecondary,
                    marginLeft: 8,
                  }}
                >
                  Admin Review
                </Text>
              </View>
              <View style={styles.progressLine} />
              <View style={styles.progressStep}>
                <View
                  style={[
                    styles.progressDot,
                    { backgroundColor: theme.colors.border },
                  ]}
                />
                <Text
                  style={{
                    ...theme.typography.captionSmall,
                    color: theme.colors.textSecondary,
                    marginLeft: 8,
                  }}
                >
                  Account Created
                </Text>
              </View>
            </View>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <View style={styles.validationErrorContainer}>
                <Text style={styles.validationErrorText}>
                  Please fix the following errors:
                  {validationErrors.map((error, index) => `\n• ${error}`)}
                </Text>
              </View>
            )}

            {/* Personal Information Section */}
            <View style={styles.formSection}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIcon}>
                  <Ionicons
                    name="person"
                    size={20}
                    color={theme.colors.primary}
                  />
                </View>
                <Text style={styles.sectionTitle}>Personal Information</Text>
              </View>
              {renderInput(
                "firstName",
                "First Name",
                "Enter your first name",
                "person-outline"
              )}
              {renderInput(
                "lastName",
                "Last Name",
                "Enter your last name",
                "person-outline"
              )}
              {renderInput(
                "email",
                "Email Address",
                "Enter your Ashesi email",
                "mail-outline",
                true,
                "email-address"
              )}
              {renderInput(
                "phoneNumber",
                "Phone Number",
                "Enter your phone number",
                "call-outline",
                false,
                "phone-pad"
              )}
              {renderPicker("gender", "Gender", GENDERS)}
              {renderPicker("country", "Country", AFRICAN_COUNTRIES)}
            </View>

            {/* Academic Information Section */}
            <View style={styles.formSection}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIcon}>
                  <Ionicons
                    name="school"
                    size={20}
                    color={theme.colors.primary}
                  />
                </View>
                <Text style={styles.sectionTitle}>Academic Information</Text>
              </View>
              {renderInput(
                "studentId",
                "Student ID",
                "Enter your student ID",
                "card-outline"
              )}
              {renderPicker("yearGroup", "Year Group", YEAR_GROUPS)}
              {renderPicker("major", "Major", MAJORS)}
            </View>

            {/* Additional Information Section */}
            <View style={styles.formSection}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIcon}>
                  <Ionicons
                    name="chatbubble-ellipses"
                    size={20}
                    color={theme.colors.primary}
                  />
                </View>
                <Text style={styles.sectionTitle}>Additional Information</Text>
              </View>
              {renderInput(
                "additionalInfo",
                "Tell us about yourself",
                "Share any additional information that might help us serve you better...",
                "document-text-outline",
                false,
                "default",
                true
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                isLoading && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmitRequest}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <Ionicons name="refresh" size={22} color="#ffffff" />
                  <Text style={styles.loadingText}>Submitting Request...</Text>
                </View>
              ) : (
                <Text style={styles.submitButtonText}>
                  Submit Access Request
                </Text>
              )}
            </TouchableOpacity>

            {/* Back to Login */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity onPress={navigateToLogin} disabled={isLoading}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
