// firebase-config.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // Assure-toi d'importer l'authentification
import { getFirestore } from "firebase/firestore";  // Pour Firestore
import { getStorage } from 'firebase/storage';

// Configuration Firebase de ton projet
const firebaseConfig = {
  apiKey: "AIzaSyDoBa3u9bB8wmU0Xxlu46CnzgWg0E2ZD9Q",
  authDomain: "vue-auth-e88ed.firebaseapp.com",
  projectId: "vue-auth-e88ed",
  storageBucket: "vue-auth-e88ed.firebasestorage.app",
  messagingSenderId: "843461895268",
  appId: "1:843461895268:web:4a08ba5d27a4eb6df96b71",
  measurementId: "G-E3SYR3P9B9"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db ,storage };  // Exportation des services Firebase
