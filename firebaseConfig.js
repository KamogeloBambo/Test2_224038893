import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAzKjIok1TLbiNbDc_cOAyMb33C9PHgq8w",
  authDomain: "test2-69c0c.firebaseapp.com",
  projectId: "test2-69c0c",
  storageBucket: "test2-69c0c.firebasestorage.app",
  messagingSenderId: "198935039413",
  appId: "1:198935039413:web:14f4e9060369b571171dfc"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
