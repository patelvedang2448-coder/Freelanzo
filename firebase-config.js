/* Phase 2 — Freelanzo Firebase project (web config is a public identifier, not a secret). */
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAT_uw4V0UNEeNFfX0N2acRv2it8Ye2oLc",
  authDomain: "freelanzo-9bccb.firebaseapp.com",
  projectId: "freelanzo-9bccb",
  storageBucket: "freelanzo-9bccb.firebasestorage.app",
  messagingSenderId: "476527905043",
  appId: "1:476527905043:web:ee67cae42ee8ec7f19f2e6"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { app, auth, db };
