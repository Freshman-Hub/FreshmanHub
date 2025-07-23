import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, Timestamp } from "firebase/firestore";

// Firebase configuration - replace with your actual config
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

async function createAdminUser() {
  try {
    console.log("🔥 Creating admin user...");

    // Admin user details
    const adminEmail = "emmanuel.adoum@ashesi.edu.gh";
    const adminPassword = "12345678Admin";
    const adminData = {
      firstName: "Emmanuel",
      lastName: "Adoum",
      email: adminEmail,
      role: "head_of_coaches", // Admin role
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
    console.log("📧 Creating Firebase Auth account...");
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      adminEmail,
      adminPassword
    );
    const firebaseUser = userCredential.user;

    console.log("✅ Firebase Auth account created:", firebaseUser.uid);

    // Create Firestore user document
    console.log("📄 Creating Firestore user document...");
    await setDoc(doc(db, "users", firebaseUser.uid), {
      ...adminData,
      id: firebaseUser.uid,
    });

    console.log("✅ Admin user created successfully!");
    console.log("📋 Admin Details:");
    console.log("   Email:", adminEmail);
    console.log("   Password:", adminPassword);
    console.log("   Role:", adminData.role);
    console.log("   UID:", firebaseUser.uid);
    console.log("");
    console.log("🎉 You can now use these credentials to:");
    console.log("   1. Login to the app");
    console.log("   2. Access the admin registration screen");
    console.log("   3. Create other users");
    console.log("");
    console.log("⚠️  Remember to change the password after first login!");

    process.exit(0);
  } catch (error: any) {
    console.error("❌ Error creating admin user:", error.message);

    if (error.code === "auth/email-already-in-use") {
      console.log("📧 Email already exists. Trying to update existing user...");

      try {
        // If email exists, just update the Firestore document
        // Note: You'll need to get the UID manually from Firebase Console
        console.log(
          "⚠️  Please check Firebase Console for the existing user's UID"
        );
        console.log(
          "   Then update the Firestore document manually or delete the existing user first"
        );
      } catch (updateError) {
        console.error("❌ Error updating user:", updateError);
      }
    }

    process.exit(1);
  }
}

// Run the script
createAdminUser();
