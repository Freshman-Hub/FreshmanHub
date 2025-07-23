"use client";

import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, Timestamp } from "firebase/firestore";

// This is a one-time setup component to create the first admin user
export default function AdminSetupScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [adminCreated, setAdminCreated] = useState(false);

  const createFirstAdmin = async () => {
    setIsLoading(true);

    try {
      // Firebase configuration
     const firebaseConfig = {
       apiKey: "AIzaSyA0jhA21wcBD4IP6CDBDCuX7enrKi-w00M",
       authDomain: "freshmanhub-education.firebaseapp.com",
       projectId: "freshmanhub-education",
       storageBucket: "freshmanhub-education.firebasestorage.app",
       messagingSenderId: "835117007681",
       appId: "1:835117007681:web:b50403084d609eec63d7c0",
       measurementId: "G-VKWHG505CF",
     };
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const db = getFirestore(app);

      // Admin user details
      const adminEmail = "emmanuel.adoum@ashesi.edu.gh";
      const adminPassword = "12345678Admin";
      const adminData = {
        firstName: "Emmanuel",
        lastName: "Adoum",
        email: adminEmail,
        role: "head_of_coaches",
        country: "Ghana",
        gender: "Male",
        department: "Student Affairs",
        phoneNumber: "+233123456789",
        isActive: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        permissions: {
          canCreateUsers: true,
          canManageUsers: true,
          canViewReports: true,
          canManageEvents: true,
          canSendNotifications: true,
        },
      };

      // Create Firebase Auth account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        adminEmail,
        adminPassword
      );
      const firebaseUser = userCredential.user;

      // Create Firestore user document
      await setDoc(doc(db, "users", firebaseUser.uid), {
        ...adminData,
        id: firebaseUser.uid,
      });

      setAdminCreated(true);
      Alert.alert(
        "Admin User Created! 🎉",
        `Successfully created admin account:\n\nEmail: ${adminEmail}\nPassword: ${adminPassword}\nRole: ${adminData.role}\n\nYou can now use these credentials to login and access admin features.`,
        [{ text: "OK" }]
      );
    } catch (error: any) {
      console.error("Error creating admin:", error);
      Alert.alert("Error", `Failed to create admin user: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: "#f5f5f5",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      color: "#666",
      marginBottom: 30,
      textAlign: "center",
      lineHeight: 24,
    },
    button: {
      backgroundColor: "#007AFF",
      paddingHorizontal: 30,
      paddingVertical: 15,
      borderRadius: 10,
      marginBottom: 20,
    },
    buttonDisabled: {
      backgroundColor: "#ccc",
    },
    buttonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },
    successText: {
      color: "#28a745",
      fontSize: 18,
      fontWeight: "600",
      textAlign: "center",
      marginTop: 20,
    },
    infoBox: {
      backgroundColor: "#e3f2fd",
      padding: 15,
      borderRadius: 10,
      marginBottom: 20,
      borderLeftWidth: 4,
      borderLeftColor: "#2196f3",
    },
    infoText: {
      fontSize: 14,
      color: "#1976d2",
      lineHeight: 20,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Setup</Text>
      <Text style={styles.subtitle}>
        Create the first admin user for Freshman Hub. This is a one-time setup
        process.
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          This will create an admin account with:{"\n"}• Email:
          emmanuel.adoum@ashesi.edu.gh{"\n"}• Password: 12345678Admin{"\n"}•
          Role: Head of Coaches{"\n"}• Full admin permissions
        </Text>
      </View>

      {!adminCreated ? (
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={createFirstAdmin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Creating Admin..." : "Create First Admin User"}
          </Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.successText}>
          ✅ Admin user created successfully!
        </Text>
      )}
    </View>
  );
}
