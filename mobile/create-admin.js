const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");
const { getFirestore, doc, setDoc, Timestamp } = require("firebase/firestore");

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA0jhA21wcBD4IP6CDBDCuX7enrKi-w00M",
  authDomain: "freshmanhub-education.firebaseapp.com",
  projectId: "freshmanhub-education",
  storageBucket: "freshmanhub-education.firebasestorage.app",
  messagingSenderId: "835117007681",
  appId: "1:835117007681:web:b50403084d609eec63d7c0",
  measurementId: "G-VKWHG505CF",
};

async function createAdmin() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      "emmanuel.adoum@ashesi.edu.gh",
      "12345678Admin"
    );

    await setDoc(doc(db, "users", userCredential.user.uid), {
      id: userCredential.user.uid,
      firstName: "Emmanuel",
      lastName: "Adoum",
      email: "emmanuel.adoum@ashesi.edu.gh",
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
    });

    console.log("✅ Admin created successfully!");
    console.log("Email: emmanuel.adoum@ashesi.edu.gh");
    console.log("Password: 12345678Admin");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

createAdmin();
