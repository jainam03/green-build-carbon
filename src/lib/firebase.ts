import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAiYvX4cclmpObksIP5WS8x116UkyRD20o",
  authDomain: "gcl-project-ebf08.firebaseapp.com",
  projectId: "gcl-project-ebf08",
  storageBucket: "gcl-project-ebf08.firebasestorage.app",
  messagingSenderId: "599511157687",
  appId: "1:599511157687:web:26d4ac1208c1b251d5b632",
  measurementId: "G-LE3PX7B9VV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
