import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_APIKEY,
  authDomain: import.meta.env.VITE_GOOGLE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_GOOGLE_PROJECTID,
  storageBucket: import.meta.env.VITE_GOOGLE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_GOOGLE_MESSAGINGSSENDERID,
  appId: import.meta.env.VITE_GOOGLE_APPID,
  measurementId: import.meta.env.VITE_GOOGLE_MEASUREMENTID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut, onAuthStateChanged };
