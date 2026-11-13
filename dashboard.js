/* Protected dashboard and recovery for registrations missing their Firestore profile. */
import { onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";

const loading = document.getElementById("dashboard-loading");
const content = document.getElementById("dashboard-content");
const recovery = document.getElementById("dashboard-recovery");
const errorPanel = document.getElementById("dashboard-error");
const recoveryForm = document.getElementById("recovery-form");
const recoveryStatus = document.getElementById("recovery-status");
const nameField = document.getElementById("recovery-name");
let currentUser = null;

function show(section) {
  [loading, content, recovery, errorPanel].forEach((node) => { node.hidden = node !== section; });
}
function setText(id, value) {
  const node = document.getElementById(id);
  if (node) node.textContent = value;
}
function showProfile(profile) {
  setText("dashboard-welcome", "Welcome, " + profile.fullName.split(/\s+/)[0] + "!");
  setText("dashboard-name", profile.fullName);
  setText("dashboard-email", profile.email);
  setText("dashboard-role", profile.role === "freelancer" ? "Freelancer" : "Client");
  setText("dashboard-completion", profile.profileCompleted ? "Completed" : "Not set up yet");
  document.getElementById("freelancer-panel").hidden = profile.role !== "freelancer";
  document.getElementById("client-panel").hidden = profile.role !== "client";
  show(content);
}
async function loadProfile(user) {
  currentUser = user;
  show(loading);
  try {
    const snapshot = await getDoc(doc(db, "users", user.uid));
    if (auth.currentUser?.uid !== user.uid) return; // avoid rendering a stale user after logout
    if (!snapshot.exists()) {
      nameField.value = user.displayName || "";
      setText("recovery-email", user.email || "");
      recoveryStatus.textContent = "";
      show(recovery);
      return;
    }
    const profile = snapshot.data();
    if (profile.uid !== user.uid || profile.email !== user.email ||
        !["freelancer", "client"].includes(profile.role)) {
      setText("dashboard-error-text", "Your account record appears incomplete. Please contact the project team.");
      show(errorPanel);
      return;
    }
    showProfile(profile);
  } catch (error) {
    console.error("Could not load account profile", error);
    if (auth.currentUser?.uid !== user.uid) return;
    setText("dashboard-error-text", error.code === "permission-denied" ?
      "Firestore access was denied. Publish the included firestore.rules in Firebase Console, then reload." :
      "Could not load your account. Check your connection and reload this page.");
    show(errorPanel);
  }
}

recoveryForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!currentUser || auth.currentUser?.uid !== currentUser.uid) return;
  const name = nameField.value.trim();
  const role = recoveryForm.querySelector('input[name="recovery-role"]:checked')?.value;
  recoveryStatus.textContent = "";
  if (name.length < 2 || name.length > 80) {
    recoveryStatus.textContent = "Enter your full name (2–80 characters).";
    return nameField.focus();
  }
  if (!["freelancer", "client"].includes(role)) {
    recoveryStatus.textContent = "Select Freelancer or Client.";
    return recoveryForm.querySelector('input[name="recovery-role"]').focus();
  }
  const button = recoveryForm.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = "Saving account…";
  try {
    const user = currentUser;
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      fullName: name,
      email: user.email,
      role,
      createdAt: serverTimestamp(),
      profileCompleted: false
    });
    try { await updateProfile(user, { displayName: name }); }
    catch (error) { console.warn("Optional Auth display name update failed", error.code || error.message); }
    if (auth.currentUser?.uid === user.uid) await loadProfile(user);
  } catch (error) {
    console.error("Could not finish account setup", error);
    recoveryStatus.textContent = error.code === "permission-denied" ?
      "Firestore rejected the account write. Publish the included security rules, then retry." :
      "Could not save the account. Check your connection and try again. If an account was already saved, reload.";
  } finally {
    button.disabled = false;
    button.textContent = "Finish account setup";
  }
});

onAuthStateChanged(auth, (user) => {
  if (!user) {
    currentUser = null;
    show(loading);
    window.location.replace("login.html");
    return;
  }
  loadProfile(user);
}, (error) => {
  console.error("Authentication check failed", error);
  setText("dashboard-error-text", "Unable to verify your login. Check your connection and reload.");
  show(errorPanel);
});
