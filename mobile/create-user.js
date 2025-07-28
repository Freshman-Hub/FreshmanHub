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
      "Roger.ababasa@ashesi.edu.gh",
      "1234Admin"
    );

    await setDoc(doc(db, "users", userCredential.user.uid), {
      id: userCredential.user.uid,
      firstName: "Roger",
      lastName: "Ababasa",
      email: "Roger.ababasa@ashesi.edu.gh",
      role: "freshman",
      country: "Cameroon",
      major: "Electrical and Electronic Engineering",
      gender: "Male",
      studentId: "34362027",
      yearGroup: "2027",
      isActive: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: "0EmQUEDw9zVbO6zsiDhJWO62kRH2",
    });

    console.log("✅ User created successfully!");
    console.log("Email: ");
    console.log("Password: 1234Admin");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

createAdmin();
