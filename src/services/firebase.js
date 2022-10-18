import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuWV6wPBUTXcmHkwuyo38zDvCDS3OA924",
  authDomain: "fan-club-cf4c2.firebaseapp.com",
  projectId: "fan-club-cf4c2",
  storageBucket: "fan-club-cf4c2.appspot.com",
  messagingSenderId: "287886258892",
  appId: "1:287886258892:web:87ee787bd70e0ac3424869"
};

// Initialize Firebase, auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };