/* Phase 2: real email/password registration + login. No passwords saved in Firestore. */
/* Firebase imports are intentionally lazy. The form itself still runs and
   reports a useful error even when the Firebase CDN is unavailable. */
let firebasePromise;
function loadFirebase() {
  if (!firebasePromise) {
    firebasePromise = Promise.all([
      import("https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js"),
      import("https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js"),
      import("./firebase-config.js")
    ]).then(([authSdk, firestoreSdk, config]) => ({ ...authSdk, ...firestoreSdk, ...config }))
      .catch((error) => {
        firebasePromise = null; // Let a later attempt retry a transient CDN failure.
        throw error;
      });
  }
  return firebasePromise;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const validators = {
  name(value) {
    const name = value.trim();
    if (!name) return "Enter your full name.";
    if (name.length < 2) return "Your name must be at least 2 characters.";
    if (name.length > 80) return "Use 80 characters or fewer.";
    return "";
  },
  email(value) {
    if (!value.trim()) return "Enter your email address.";
    if (!EMAIL_PATTERN.test(value.trim())) return "Enter a valid email address, like name@example.com.";
    return "";
  },
  loginPassword(value) { return value ? "" : "Enter your password."; },
  newPassword(value) {
    if (!value) return "Create a password.";
    if (value.length < 8) return "Use at least 8 characters.";
    if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return "Include at least one letter and one number.";
    return "";
  }
};

function showFieldError(input, message) {
  const target = document.getElementById(input.id + "-error");
  if (target) target.textContent = message;
  if (message) input.setAttribute("aria-invalid", "true");
  else input.removeAttribute("aria-invalid");
}
function checkField(input, validate) {
  const message = validate(input.value);
  showFieldError(input, message);
  return message === "";
}
function setStatus(form, message, type = "info", link = null) {
  const status = form.querySelector(".form-status");
  if (!status) return;
  status.textContent = message;
  status.dataset.kind = type;
  if (link) {
    const a = document.createElement("a");
    a.href = link.href;
    a.textContent = link.label;
    status.appendChild(document.createTextNode(" "));
    status.appendChild(a);
  }
}
function setBusy(form, busy, busyText) {
  form.dataset.submitting = String(busy);
  const button = form.querySelector('button[type="submit"]');
  if (!button) return;
  if (!button.dataset.originalLabel) button.dataset.originalLabel = button.textContent;
  button.disabled = busy;
  button.textContent = busy ? busyText : button.dataset.originalLabel;
}
function explainAuthError(error) {
  if (location.protocol === "file:")
    return "Open Freelanzo using VS Code Live Server, not by double-clicking an HTML file.";
  if (!error?.code) return "Firebase could not load. Check the internet connection, reload, or inspect the browser console (F12). Make sure Google's Firebase CDN is not blocked.";
  switch (error.code) {
    case "auth/email-already-in-use": return "An account already uses that email. Log in instead.";
    case "auth/invalid-email": return "That email address isn't valid.";
    case "auth/weak-password": return "Choose a stronger password.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found": return "Incorrect email or password. Please try again.";
    case "auth/too-many-requests": return "Too many attempts. Please try again later.";
    case "auth/network-request-failed": return "Network error. Check your internet connection and try again.";
    case "auth/operation-not-allowed": return "Email/Password sign-in is not enabled for this Firebase project.";
    case "auth/unauthorized-domain": return "This website's domain is not authorized in Firebase Authentication settings.";
    case "permission-denied": return "Firestore blocked account setup. Publish the included firestore.rules in Firebase Console → Firestore Database → Rules, then use Dashboard to finish setup.";
    case "auth/invalid-api-key": return "Firebase API key is invalid. Check js/firebase-config.js against your Firebase Console web app settings.";
    case "auth/app-not-authorized": return "Firebase rejected this website. Check Authentication → Settings → Authorized domains.";
    case "unavailable": return "Firestore is unavailable right now. Check your internet connection and retry.";
    default: return "Something went wrong. Please check your connection and try again.";
  }
}
function attachLiveValidation(input, validate) {
  input.addEventListener("blur", () => checkField(input, validate));
  input.addEventListener("input", () => {
    if (input.getAttribute("aria-invalid") === "true") checkField(input, validate);
  });
}

function initLogin() {
  const form = document.getElementById("login-form");
  if (!form) return;
  const email = document.getElementById("login-email");
  const password = document.getElementById("login-password");
  attachLiveValidation(email, validators.email);
  attachLiveValidation(password, validators.loginPassword);
  form.dataset.authReady = "true";
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (form.dataset.submitting === "true") return;
    setStatus(form, "");
    if (!checkField(email, validators.email)) return email.focus();
    if (!checkField(password, validators.loginPassword)) return password.focus();
    setBusy(form, true, "Logging in…");
    try {
      const { signInWithEmailAndPassword, auth } = await loadFirebase();
      await signInWithEmailAndPassword(auth, email.value.trim(), password.value);
      password.value = "";
      setStatus(form, "Signed in. Opening your dashboard…", "success");
      window.location.replace("dashboard.html");
    } catch (error) {
      console.error("Login failed:", error.code || error.message);
      setStatus(form, explainAuthError(error), "error");
      password.value = "";
    } finally {
      setBusy(form, false);
    }
  });
}

function initSignup() {
  const form = document.getElementById("signup-form");
  if (!form) return;
  const name = document.getElementById("signup-name");
  const email = document.getElementById("signup-email");
  const password = document.getElementById("signup-password");
  const confirm = document.getElementById("signup-confirm");
  const demoCheck = document.getElementById("signup-terms");
  const typeError = document.getElementById("signup-type-error");
  const termsError = document.getElementById("signup-terms-error");
  const validateConfirm = (value) => !value ? "Re-enter your password." :
    value !== password.value ? "The passwords don't match." : "";

  [ [name, validators.name], [email, validators.email],
    [password, validators.newPassword], [confirm, validateConfirm]
  ].forEach(([input, validator]) => attachLiveValidation(input, validator));
  password.addEventListener("input", () => {
    if (confirm.value) checkField(confirm, validateConfirm);
  });
  form.querySelectorAll('input[name="account-type"]').forEach((radio) => {
    radio.addEventListener("change", () => { typeError.textContent = ""; });
  });
  demoCheck.addEventListener("change", () => {
    termsError.textContent = "";
    demoCheck.removeAttribute("aria-invalid");
  });

  form.dataset.authReady = "true";
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (form.dataset.submitting === "true") return;
    setStatus(form, "");
    const checks = [
      [name, checkField(name, validators.name)],
      [email, checkField(email, validators.email)],
      [password, checkField(password, validators.newPassword)],
      [confirm, checkField(confirm, validateConfirm)]
    ];
    const role = form.querySelector('input[name="account-type"]:checked')?.value;
    typeError.textContent = ["freelancer", "client"].includes(role) ? "" : "Choose Freelancer or Client.";
    termsError.textContent = demoCheck.checked ? "" : "Confirm that you understand this is a college project demo.";
    if (!demoCheck.checked) demoCheck.setAttribute("aria-invalid", "true");
    else demoCheck.removeAttribute("aria-invalid");

    const firstBad = checks.find(([, ok]) => !ok);
    if (firstBad) return firstBad[0].focus();
    if (!["freelancer", "client"].includes(role)) return form.querySelector('input[name="account-type"]').focus();
    if (!demoCheck.checked) return demoCheck.focus();

    setBusy(form, true, "Creating account…");
    let createdUser = null;
    try {
      const { createUserWithEmailAndPassword, updateProfile, doc, setDoc, serverTimestamp, auth, db } = await loadFirebase();
      const credential = await createUserWithEmailAndPassword(auth, email.value.trim(), password.value);
      createdUser = credential.user;
      /* Document write is awaited before sending users to the dashboard. */
      await setDoc(doc(db, "users", createdUser.uid), {
        uid: createdUser.uid,
        fullName: name.value.trim(),
        email: createdUser.email,
        role,
        createdAt: serverTimestamp(),
        profileCompleted: false
      });
      /* Auth display name is a convenience; Firestore is the dashboard source of truth. */
      try {
        await updateProfile(createdUser, { displayName: name.value.trim() });
      } catch (displayError) {
        console.warn("Auth display name update was skipped", displayError.code || displayError.message);
      }
      password.value = "";
      confirm.value = "";
      setStatus(form, "Account created. Opening your dashboard…", "success");
      window.location.replace("dashboard.html");
    } catch (error) {
      console.error("Registration failed:", error.code || error.message);
      password.value = "";
      confirm.value = "";
      if (createdUser) {
        setStatus(form,
          "Your login was created, but we couldn't finish saving your account profile. You can finish setup in the dashboard after publishing the Firestore rules.",
          "error", { href: "dashboard.html", label: "Finish setup in Dashboard" });
      } else {
        setStatus(form, explainAuthError(error), "error");
      }
    } finally {
      setBusy(form, false);
    }
  });
}

initLogin();
initSignup();
