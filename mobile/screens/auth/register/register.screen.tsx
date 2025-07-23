"use client";

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  // Dimensions,
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
// import { useUser } from "../../../contexts/UserContext";
import { Picker } from "@react-native-picker/picker";
import { AuthService } from "../../../services/auth.service";
import { ValidationUtils } from "../../../utils/validation";
import type { User, UserRole } from "../../../types/user.types";

// const { width, height } = Dimensions.get("window");

// User roles based on your specifications
const USER_ROLES = [
  {
    id: "freshman",
    label: "Freshman Student",
    icon: "school-outline",
    color: "#3B82F6",
  },
  {
    id: "continuous",
    label: "Continuous Student",
    icon: "book-outline",
    color: "#10B981",
  },
  {
    id: "student_leader",
    label: "Student Leader",
    icon: "people-outline",
    color: "#F59E0B",
  },
  {
    id: "peer_coach",
    label: "Peer Coach",
    icon: "fitness-outline",
    color: "#EF4444",
  },
  {
    id: "peer_advisor",
    label: "Peer Advisor",
    icon: "chatbubbles-outline",
    color: "#8B5CF6",
  },
  { id: "buddy", label: "Buddy", icon: "heart-outline", color: "#EC4899" },
  {
    id: "head_of_coaches",
    label: "Head of Coaches",
    icon: "medal-outline",
    color: "#F97316",
  },
  {
    id: "academic_advisor",
    label: "Academic Advisor",
    icon: "library-outline",
    color: "#06B6D4",
  },
  { id: "odip", label: "ODIP Staff", icon: "globe-outline", color: "#84CC16" },
  { id: "sle", label: "SLE Staff", icon: "home-outline", color: "#6366F1" },
];

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

export default function RegisterScreen() {
  const { theme, isDark } = useTheme();
  // const { user: currentUser } = useUser();
  const router = useRouter();

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    adminCode: "",
    adminEmail: "",
    adminPassword: "",
  });
  const [showAdminLogin, setShowAdminLogin] = useState(true);
  const [authenticatedAdmin, setAuthenticatedAdmin] = useState<User | null>(
    null
  );

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    studentId: "",
    department: "",
    phoneNumber: "",
    country: "",
    yearGroup: "",
    major: "",
    gender: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

 const handleRegister = async () => {
   // Validate form data
   const validation = ValidationUtils.validateUserData(formData as any);

   if (!validation.isValid) {
     setValidationErrors(validation.errors);
     Alert.alert("Validation Error", validation.errors.join("\n"));
     return;
   }

   // Check password confirmation
   if (formData.password !== formData.confirmPassword) {
     Alert.alert("Error", "Passwords do not match");
     return;
   }

   // Validate password strength
   const passwordValidation = ValidationUtils.validatePassword(
     formData.password
   );
   if (!passwordValidation.isValid) {
     Alert.alert("Password Error", passwordValidation.error!);
     return;
   }

   if (!authenticatedAdmin) {
     Alert.alert("Error", "Admin authentication required");
     return;
   }

   setIsLoading(true);

   try {
     // Create clean user data object without undefined values
     const userData: any = {
       firstName: ValidationUtils.sanitizeInput(formData.firstName),
       lastName: ValidationUtils.sanitizeInput(formData.lastName),
       email: formData.email.toLowerCase().trim(),
       role: formData.role as UserRole,
       country: formData.country,
       gender: formData.gender as any,
       createdBy: authenticatedAdmin.id,
     };

     // Only add fields that have actual values
     if (formData.studentId?.trim()) {
       userData.studentId = ValidationUtils.sanitizeInput(formData.studentId);
     }
     if (formData.department?.trim()) {
       userData.department = ValidationUtils.sanitizeInput(formData.department);
     }
     if (formData.phoneNumber?.trim()) {
       userData.phoneNumber = ValidationUtils.sanitizeInput(
         formData.phoneNumber
       );
     }
     if (formData.yearGroup?.trim()) {
       userData.yearGroup = formData.yearGroup;
     }
     if (formData.major?.trim()) {
       userData.major = formData.major;
     }

     const { user, error } = await AuthService.createUser(
       userData,
       formData.password,
       authenticatedAdmin.id
     );

     if (error) {
       Alert.alert("Registration Failed", error);
       return;
     }

     // Success
     Alert.alert(
       "User Created Successfully! 🎉",
       `Account created for ${user?.firstName} ${user?.lastName}\nEmail: ${user?.email}\nRole: ${user?.role}\n\nLogin credentials will be sent to the user's email.`,
       [
         {
           text: "Create Another",
           onPress: () => {
             // Clear form
             setFormData({
               firstName: "",
               lastName: "",
               email: "",
               password: "",
               confirmPassword: "",
               role: "",
               studentId: "",
               department: "",
               phoneNumber: "",
               country: "",
               yearGroup: "",
               major: "",
               gender: "",
             });
           },
         },
         {
           text: "Done",
           onPress: () => router.back(),
           style: "default",
         },
       ]
     );
   } catch (error: any) {
     Alert.alert(
       "Registration Error",
       error.message || "An unexpected error occurred"
     );
   } finally {
     setIsLoading(false);
   }
 };

  const navigateToLogin = () => {
    router.back();
  };

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
      // Verify admin credentials with Firebase
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
        setAuthenticatedAdmin(user);
        setIsAdminAuthenticated(true);
        setShowAdminLogin(false);
        Alert.alert(
          "Success",
          `Welcome, ${user.firstName}! You can now create user accounts.`
        );
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

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setShowAdminLogin(true);
    setAuthenticatedAdmin(null);
    setAdminCredentials({ adminCode: "", adminEmail: "", adminPassword: "" });
    // Clear form data
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      studentId: "",
      department: "",
      phoneNumber: "",
      country: "",
      yearGroup: "",
      major: "",
      gender: "",
    });
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
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
    },
    titleContainer: {
      alignItems: "center",
      marginBottom: theme.spacing.xs,
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
      marginBottom: theme.spacing.sm,
      fontWeight: "500",
    },
    progressIndicator: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.xl,
    },
    progressDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.border,
      marginHorizontal: 4,
    },
    progressDotActive: {
      backgroundColor: theme.colors.primary,
      width: 24,
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
      borderWidth: 1,
      paddingHorizontal: theme.spacing.sm,
      height: 50,
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
      fontWeight: "500",
    },
    eyeIcon: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
    },
    errorText: {
      ...theme.typography.captionSmall,
      color: theme.colors.error,
      marginTop: theme.spacing.sm,
      marginLeft: theme.spacing.sm,
    },
    roleContainer: {
      marginBottom: theme.spacing.md,
    },
    roleGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.xs,
    },
    roleChip: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg - 5,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.background,
      minWidth: "47%",
      shadowColor: theme.colors.border,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    roleChipSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.background,
      shadowColor: theme.colors.primary,
      shadowOpacity: 0.2,
    },
    roleIcon: {
      marginRight: theme.spacing.sm,
    },
    roleText: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      flex: 1,
      fontWeight: "500",
    },
    roleTextSelected: {
      color: theme.colors.primary,
      fontWeight: "600",
    },
    registerButton: {
      height: 50,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.xl,
      justifyContent: "center",
      alignItems: "center",
      margin: theme.spacing.lg,
      marginTop: theme.spacing.xs,
      marginBottom: theme.spacing.lg,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    registerButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
      shadowOpacity: 0,
      elevation: 0,
    },
    registerButtonText: {
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
      fontWeight: "500",
    },
    loginLink: {
      ...theme.typography.body,
      color: theme.colors.primary,
      fontWeight: "600",
      marginLeft: 4,
    },
    pickerWrapper: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: "hidden",
      shadowColor: theme.colors.border,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    picker: {
      height: 50,
      color: theme.colors.text,
    },
    adminAuthSection: {
      marginBottom: theme.spacing.xl,
    },
    adminAuthCard: {
      backgroundColor: theme.colors.error + "10",
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      borderWidth: 2,
      borderColor: theme.colors.error + "30",
      shadowColor: theme.colors.error,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      // elevation: 4,
    },
    adminAuthHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    adminAuthTitle: {
      ...theme.typography.h4,
      color: theme.colors.error,
      fontWeight: "600",
      marginLeft: theme.spacing.sm,
    },
    adminAuthSubtitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.lg,
      lineHeight: 22,
      fontWeight: "500",
    },
    adminAuthButton: {
      height: 56,
      backgroundColor: theme.colors.error,
      borderRadius: theme.borderRadius.lg,
      justifyContent: "center",
      alignItems: "center",
      marginTop: theme.spacing.md,
      shadowColor: theme.colors.error,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    adminAuthButtonText: {
      ...theme.typography.button,
      color: "#ffffff",
      fontWeight: "700",
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
      fontWeight: "500",
    },
    adminInfoCard: {
      backgroundColor: theme.colors.success + "15",
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.success,
      flexDirection: "row",
      alignItems: "center",
    },
    adminInfoText: {
      ...theme.typography.bodySmall,
      color: theme.colors.success,
      flex: 1,
      marginLeft: theme.spacing.sm,
      fontWeight: "500",
    },
  });

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
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.textInput}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textSecondary}
            value={formData[field as keyof typeof formData]}
            onChangeText={(value) => handleInputChange(field, value)}
            onFocus={() => setFocusedField(field)}
            onBlur={() => setFocusedField("")}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={field === "email" ? "none" : "words"}
            autoCorrect={false}
            editable={!isLoading}
          />
          {(field === "password" || field === "confirmPassword") && (
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => {
                if (field === "password") setShowPassword(!showPassword);
                if (field === "confirmPassword")
                  setShowConfirmPassword(!showConfirmPassword);
              }}
            >
              <Ionicons
                name={
                  (field === "password" ? showPassword : showConfirmPassword)
                    ? "eye"
                    : "eye-off"
                }
                size={22}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderAdminInput = (
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
            color={isFocused ? theme.colors.error : theme.colors.textSecondary}
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
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
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
        <Text style={styles.headerTitle}>Admin Portal</Text>
        {isAdminAuthenticated && (
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={handleAdminLogout}
            disabled={isLoading}
          >
            <Ionicons name="log-out" size={24} color="#ffffff" />
          </TouchableOpacity>
        )}
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
              <Text style={styles.title}>Create User Account</Text>
              <Text style={styles.subtitle}>
                Administrative user creation for students, staff, and coaches
              </Text>
            </View>

            {showAdminLogin && (
              <View style={styles.adminAuthSection}>
                <View style={styles.adminAuthCard}>
                  <View style={styles.adminAuthHeader}>
                    <Ionicons
                      name="shield-checkmark"
                      size={24}
                      color={theme.colors.error}
                    />
                    <Text style={styles.adminAuthTitle}>
                      Admin Authentication Required
                    </Text>
                  </View>
                  <Text style={styles.adminAuthSubtitle}>
                    Please authenticate with your admin credentials to create
                    user accounts
                  </Text>

                  {renderAdminInput(
                    "adminCode",
                    "Admin Access Code",
                    "Enter admin code",
                    "key-outline",
                    true,
                    true
                  )}
                  {renderAdminInput(
                    "adminEmail",
                    "Admin Email",
                    "Enter your admin email",
                    "mail-outline",
                    true,
                    false,
                    "email-address"
                  )}
                  {renderAdminInput(
                    "adminPassword",
                    "Admin Password",
                    "Enter admin password",
                    "lock-closed-outline",
                    true,
                    true
                  )}

                  <TouchableOpacity
                    style={styles.adminAuthButton}
                    onPress={handleAdminAuth}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <View style={styles.loadingContainer}>
                        <Ionicons name="refresh" size={20} color="#ffffff" />
                        <Text style={styles.loadingText}>
                          Authenticating...
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.adminAuthButtonText}>
                        Authenticate as Admin
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {isAdminAuthenticated && authenticatedAdmin && (
              <>
                {/* Admin Info Card */}
                <View style={styles.adminInfoCard}>
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={theme.colors.success}
                  />
                  <Text style={styles.adminInfoText}>
                    Authenticated as {authenticatedAdmin.firstName}{" "}
                    {authenticatedAdmin.lastName} ({authenticatedAdmin.role})
                  </Text>
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

                {/* Progress Indicator */}
                <View style={styles.progressIndicator}>
                  <View
                    style={[styles.progressDot, styles.progressDotActive]}
                  />
                  <View style={styles.progressDot} />
                  <View style={styles.progressDot} />
                </View>

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
                    <Text style={styles.sectionTitle}>
                      Personal Information
                    </Text>
                  </View>
                  {renderInput(
                    "firstName",
                    "First Name",
                    "Enter first name",
                    "person-outline"
                  )}
                  {renderInput(
                    "lastName",
                    "Last Name",
                    "Enter last name",
                    "person-outline"
                  )}
                  {renderInput(
                    "email",
                    "Email Address",
                    "Enter Ashesi email",
                    "mail-outline",
                    true,
                    false,
                    "email-address"
                  )}
                  {renderInput(
                    "phoneNumber",
                    "Phone Number",
                    "Enter phone number",
                    "call-outline",
                    false,
                    false,
                    "phone-pad"
                  )}
                </View>

                {/* Account Security Section */}
                <View style={styles.formSection}>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionIcon}>
                      <Ionicons
                        name="shield-checkmark"
                        size={20}
                        color={theme.colors.primary}
                      />
                    </View>
                    <Text style={styles.sectionTitle}>Account Security</Text>
                  </View>
                  {renderInput(
                    "password",
                    "Password",
                    "Create secure password",
                    "lock-closed-outline",
                    true,
                    !showPassword
                  )}
                  {renderInput(
                    "confirmPassword",
                    "Confirm Password",
                    "Confirm password",
                    "lock-closed-outline",
                    true,
                    !showConfirmPassword
                  )}
                </View>

                {/* Role Selection Section */}
                <View style={styles.formSection}>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionIcon}>
                      <Ionicons
                        name="people"
                        size={20}
                        color={theme.colors.primary}
                      />
                    </View>
                    <Text style={styles.sectionTitle}>User Role</Text>
                  </View>
                  <View style={styles.roleContainer}>
                    <View style={styles.roleGrid}>
                      {USER_ROLES.map((role) => (
                        <TouchableOpacity
                          key={role.id}
                          style={[
                            styles.roleChip,
                            formData.role === role.id &&
                              styles.roleChipSelected,
                          ]}
                          onPress={() => handleInputChange("role", role.id)}
                          disabled={isLoading}
                        >
                          <Ionicons
                            name={role.icon as any}
                            size={18}
                            color={
                              formData.role === role.id
                                ? role.color
                                : theme.colors.textSecondary
                            }
                            style={styles.roleIcon}
                          />
                          <Text
                            style={[
                              styles.roleText,
                              formData.role === role.id &&
                                styles.roleTextSelected,
                            ]}
                          >
                            {role.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                {/* Additional Information Section */}
                <View style={styles.formSection}>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionIcon}>
                      <Ionicons
                        name="information-circle"
                        size={20}
                        color={theme.colors.primary}
                      />
                    </View>
                    <Text style={styles.sectionTitle}>Additional Details</Text>
                  </View>
                  {renderInput(
                    "studentId",
                    "Student/Staff ID",
                    "Enter ID number",
                    "card-outline",
                    false
                  )}
                  {renderInput(
                    "department",
                    "Department",
                    "Enter department",
                    "business-outline",
                    false
                  )}
                  {renderPicker("country", "Country", AFRICAN_COUNTRIES)}
                  {renderPicker("yearGroup", "Year Group", YEAR_GROUPS, false)}
                  {renderPicker("major", "Major", MAJORS, false)}
                  {renderPicker("gender", "Gender", GENDERS)}
                </View>

                {/* Register Button */}
                <TouchableOpacity
                  style={[
                    styles.registerButton,
                    isLoading && styles.registerButtonDisabled,
                  ]}
                  onPress={handleRegister}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <Ionicons name="refresh" size={22} color="#ffffff" />
                      <Text style={styles.loadingText}>
                        Creating Account...
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.registerButtonText}>
                      Create User Account
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            {/* Back to Login */}
            {/* <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity onPress={navigateToLogin} disabled={isLoading}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View> */}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
