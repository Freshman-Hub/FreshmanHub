import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, Timestamp } from "firebase/firestore";

// Helper function to create admin user
export async function createAdminUser(firebaseConfig: any) {
  try {
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

    return {
      success: true,
      uid: firebaseUser.uid,
      email: adminEmail,
      message: "Admin user created successfully!",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }
}
