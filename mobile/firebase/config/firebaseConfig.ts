import {
  initializeApp,
  getApps,
  getApp,
} from "firebase/app";
import {
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyA0jhA21wcBD4IP6CDBDCuX7enrKi-w00M",
  authDomain: "freshmanhub-education.firebaseapp.com",
  projectId: "freshmanhub-education",
  storageBucket: "freshmanhub-education.firebasestorage.app",
  messagingSenderId: "835117007681",
  appId: "1:835117007681:web:b50403084d609eec63d7c0",
  measurementId: "G-VKWHG505CF",
};

// Initialize Firebase only if it hasn't been initialized already
 let app;
 if (!getApps().length) {
   app = initializeApp(firebaseConfig);
 } else {
   app = getApp(); // retrieve the default app
}
 
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db: Firestore = getFirestore(app);

// , {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage),
// }