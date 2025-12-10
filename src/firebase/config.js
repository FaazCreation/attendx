// Replace this config with your Firebase project config
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB-YWL_vrJj9ZZQqFtIZzS9VBcIQBySvyQ",
  authDomain: "attendxbd.firebaseapp.com",
  projectId: "attendxbd",
  storageBucket: "attendxbd.firebasestorage.app",
  messagingSenderId: "781451848528",
  appId: "1:781451848528:web:3c6589413fead309355a55"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
