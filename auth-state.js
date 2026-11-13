/* Site-wide auth-aware navigation + sign out. Public freelancer data stays public. */
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { auth } from "./firebase-config.js";

function showNavigation(isSignedIn) {
  document.querySelectorAll('[data-auth="guest"]').forEach((element) => {
    element.hidden = isSignedIn;
  });
  document.querySelectorAll('[data-auth="user"]').forEach((element) => {
    element.hidden = !isSignedIn;
  });
}

/* Keep the registration page visible while the newly created user document is saved. */
function formIsSubmitting() {
  const form = document.querySelector("#login-form, #signup-form");
  return form?.dataset.submitting === "true";
}

document.querySelectorAll('[data-action="logout"]').forEach((button) => {
  button.addEventListener("click", async () => {
    if (button.disabled) return;
    button.disabled = true;
    const label = button.textContent;
    button.textContent = "Signing out…";
    try {
      await signOut(auth);
      if (document.body.dataset.page === "dashboard") {
        window.location.replace("login.html");
      }
    } catch (error) {
      console.error("Logout failed", error);
      window.alert("Could not sign out. Check your connection and try again.");
    } finally {
      button.disabled = false;
      button.textContent = label;
    }
  });
});

onAuthStateChanged(auth, (user) => {
  showNavigation(Boolean(user));
  const page = document.body.dataset.page;
  if (user && (page === "login" || page === "signup") && !formIsSubmitting()) {
    window.location.replace("dashboard.html");
  }
}, (error) => {
  console.error("Could not determine authentication status", error);
  showNavigation(false);
});
