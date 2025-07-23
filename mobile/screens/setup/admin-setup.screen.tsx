"use client";

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { createAdminUser } from "../../utils/create-admin-helper";

export default function AdminSetupScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [adminCreated, setAdminCreated] = useState(false);

  const handleCreateAdmin = async () => {
    setIsLoading(true);

    try {
      // Firebase configuration
      const firebaseConfig = {
        apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
        authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!,
        projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
        storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET!,
        messagingSenderId:
          process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
        appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID!,
        measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID!,
      };

      const result = await createAdminUser(firebaseConfig);

      if (result.success) {
        setAdminCreated(true);
        Alert.alert(
          "Admin Created Successfully! 🎉",
          `Your admin account has been created:\n\n📧 Email: ${result.email}\n🔑 Password: 12345678Admin\n👤 Role: Head of Coaches\n🆔 UID: ${result.uid}\n\n⚠️ Please change your password after first login!`,
          [
            {
              text: "Go to Login",
              onPress: () => router.replace("/(auth)/login"),
            },
          ]
        );
      } else {
        if (result.code === "auth/email-already-in-use") {
          Alert.alert(
            "Email Already Exists",
            "This email is already registered. If you're the admin, you can login directly. If not, please contact support.",
            [
              {
                text: "Go to Login",
                onPress: () => router.replace("/(auth)/login"),
              },
              { text: "OK" },
            ]
          );
        } else {
          Alert.alert("Error", `Failed to create admin: ${result.error}`);
        }
      }
    } catch (error: any) {
      Alert.alert("Error", `Unexpected error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
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
      alignItems: "center",
      borderBottomLeftRadius: theme.borderRadius.xl,
      borderBottomRightRadius: theme.borderRadius.xl,
    },
    headerIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    headerTitle: {
      ...theme.typography.h1,
      color: "#ffffff",
      fontWeight: "700",
      marginBottom: theme.spacing.xs,
    },
    headerSubtitle: {
      ...theme.typography.body,
      color: "rgba(255, 255, 255, 0.9)",
      textAlign: "center",
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    infoCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
      shadowColor: theme.colors.border,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    infoTitle: {
      ...theme.typography.h3,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      fontWeight: "600",
    },
    infoText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      lineHeight: 24,
      marginBottom: theme.spacing.md,
    },
    credentialsBox: {
      backgroundColor: theme.colors.primary + "15",
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
    },
    credentialItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    credentialLabel: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "600",
      width: 80,
    },
    credentialValue: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      flex: 1,
      fontFamily: "monospace",
    },
    warningCard: {
      backgroundColor: theme.colors.error + "15",
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.error,
    },
    warningTitle: {
      ...theme.typography.h5,
      color: theme.colors.error,
      fontWeight: "600",
      marginBottom: theme.spacing.sm,
    },
    warningText: {
      ...theme.typography.bodySmall,
      color: theme.colors.error,
      lineHeight: 20,
    },
    createButton: {
      height: 60,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.xl,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.lg,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    createButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
      shadowOpacity: 0,
      elevation: 0,
    },
    createButtonText: {
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
    successCard: {
      backgroundColor: theme.colors.success + "15",
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      alignItems: "center",
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.success,
    },
    successIcon: {
      marginBottom: theme.spacing.md,
    },
    successTitle: {
      ...theme.typography.h3,
      color: theme.colors.success,
      fontWeight: "600",
      marginBottom: theme.spacing.sm,
    },
    successText: {
      ...theme.typography.body,
      color: theme.colors.success,
      textAlign: "center",
      lineHeight: 24,
    },
    loginButton: {
      height: 50,
      backgroundColor: theme.colors.success,
      borderRadius: theme.borderRadius.lg,
      justifyContent: "center",
      alignItems: "center",
      marginTop: theme.spacing.lg,
    },
    loginButtonText: {
      ...theme.typography.button,
      color: "#ffffff",
      fontWeight: "600",
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.primary}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="shield-checkmark" size={40} color="#ffffff" />
        </View>
        <Text style={styles.headerTitle}>Admin Setup</Text>
        <Text style={styles.headerSubtitle}>
          Initialize your first administrator account
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!adminCreated ? (
          <>
            {/* Info Card */}
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>First-Time Setup</Text>
              <Text style={styles.infoText}>
                This is a one-time setup process to create your first
                administrator account. Once created, this admin can login and
                create other users through the admin portal.
              </Text>

              <Text style={styles.infoTitle}>Admin Credentials</Text>
              <View style={styles.credentialsBox}>
                <View style={styles.credentialItem}>
                  <Text style={styles.credentialLabel}>Email:</Text>
                  <Text style={styles.credentialValue}>
                    emmanuel.adoum@ashesi.edu.gh
                  </Text>
                </View>
                <View style={styles.credentialItem}>
                  <Text style={styles.credentialLabel}>Password:</Text>
                  <Text style={styles.credentialValue}>12345678Admin</Text>
                </View>
                <View style={styles.credentialItem}>
                  <Text style={styles.credentialLabel}>Role:</Text>
                  <Text style={styles.credentialValue}>Head of Coaches</Text>
                </View>
              </View>
            </View>

            {/* Warning Card */}
            <View style={styles.warningCard}>
              <Text style={styles.warningTitle}>
                ⚠️ Important Security Notice
              </Text>
              <Text style={styles.warningText}>
                • Change the default password immediately after first login
                {"\n"}• This admin will have full system access{"\n"}• Keep
                these credentials secure{"\n"}• Only run this setup once
              </Text>
            </View>

            {/* Create Button */}
            <TouchableOpacity
              style={[
                styles.createButton,
                isLoading && styles.createButtonDisabled,
              ]}
              onPress={handleCreateAdmin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <Ionicons name="refresh" size={22} color="#ffffff" />
                  <Text style={styles.loadingText}>Creating Admin...</Text>
                </View>
              ) : (
                <Text style={styles.createButtonText}>
                  Create First Admin User
                </Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          /* Success Card */
          <View style={styles.successCard}>
            <Ionicons
              name="checkmark-circle"
              size={60}
              color={theme.colors.success}
              style={styles.successIcon}
            />
            <Text style={styles.successTitle}>Admin Created Successfully!</Text>
            <Text style={styles.successText}>
              Your administrator account has been created and is ready to use.
              You can now login and start managing users.
            </Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.replace("/(auth)/login")}
            >
              <Text style={styles.loginButtonText}>Go to Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
