/* ==========================================================================
   auth.js — login & signup forms (Phase 1: validation only)

   IMPORTANT: this file does NOT sign anyone in, create accounts, store
   credentials, or contact a server. When the form is valid it shows an honest
   "not connected yet" message and clears the password fields.

   PHASE 2: replace the two `// PHASE 2` blocks below with Firebase
   Authentication calls (signInWithEmailAndPassword /
   createUserWithEmailAndPassword). The validation functions stay as they are.
   ========================================================================== */

/* Validation rules ------------------------------------------------------- */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const validators = {
  name(value) {
    if (!value.trim()) return "Enter your full name.";
    if (value.trim().length < 2) return "Your name must be at least 2 characters.";
    return "";
  },
  email(value) {
    if (!value.trim()) return "Enter your email address.";
    if (!EMAIL_PATTERN.test(value.trim())) return "Enter a valid email address, like name@example.com.";
    return "";
  },
  loginPassword(value) {
    return value ? "" : "Enter your password.";
  },
  newPassword(value) {
    if (!value) return "Create a password.";
    if (value.length < 8) return "Use at least 8 characters.";
    if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return "Include at least one letter and one number.";
    return "";
  }
};

/* Small UI helpers ------------------------------------------------------- */
function showFieldError(input, message) {
  const error = document.getElementById(input.id + "-error");
  if (error) error.textContent = message;
  if (message) input.setAttribute("aria-invalid", "true");
  else input.removeAttribute("aria-invalid");
}

/* Runs a validator against an input, shows or clears its error, returns true if valid. */
function checkField(input, validate) {
  const message = validate(input.value);
  showFieldError(input, message);
  return message === "";
}

function showStatus(form, message) {
  const status = form.querySelector(".form-status");
  if (!status) return;
  status.textContent = message;
}

/* Show/hide password buttons: <button class="toggle-pw" data-target="inputId"> */
function initPasswordToggles() {
  document.querySelectorAll(".toggle-pw").forEach((button) => {
    const target = document.getElementById(button.dataset.target);
    if (!target) return;
    button.addEventListener("click", () => {
      const reveal = target.type === "password";
      target.type = reveal ? "text" : "password";
      button.textContent = reveal ? "Hide" : "Show";
      button.setAttribute("aria-label", (reveal ? "Hide" : "Show") + " " + button.dataset.label);
    });
  });
}

/* Validate each field when the user leaves it, then live once it has an error. */
function attachLiveValidation(input, validate) {
  input.addEventListener("blur", () => checkField(input, validate));
  input.addEventListener("input", () => {
    if (input.getAttribute("aria-invalid") === "true") checkField(input, validate);
  });
}

/* Login form ------------------------------------------------------------- */
function initLogin() {
  const form = document.getElementById("login-form");
  if (!form) return;
  const email = document.getElementById("login-email");
  const password = document.getElementById("login-password");

  attachLiveValidation(email, validators.email);
  attachLiveValidation(password, validators.loginPassword);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    showStatus(form, "");
    const emailOk = checkField(email, validators.email);
    const passwordOk = checkField(password, validators.loginPassword);
    if (!emailOk) return email.focus();
    if (!passwordOk) return password.focus();

    // PHASE 2: call Firebase Authentication here with email.value and password.value.
    password.value = "";
    showStatus(
      form,
      "Your details look valid, but sign-in isn\u2019t connected yet. Accounts arrive in Phase 2. Nothing was sent or saved."
    );
  });
}

/* Sign-up form ----------------------------------------------------------- */
function initSignup() {
  const form = document.getElementById("signup-form");
  if (!form) return;
  const name = document.getElementById("signup-name");
  const email = document.getElementById("signup-email");
  const password = document.getElementById("signup-password");
  const confirm = document.getElementById("signup-confirm");
  const terms = document.getElementById("signup-terms");
  const typeError = document.getElementById("signup-type-error");
  const termsError = document.getElementById("signup-terms-error");

  const validateConfirm = (value) => {
    if (!value) return "Re-enter your password.";
    if (value !== password.value) return "The passwords don\u2019t match.";
    return "";
  };

  attachLiveValidation(name, validators.name);
  attachLiveValidation(email, validators.email);
  attachLiveValidation(password, validators.newPassword);
  attachLiveValidation(confirm, validateConfirm);
  /* Changing the password should re-check the confirmation if it was filled in. */
  password.addEventListener("input", () => {
    if (confirm.value) checkField(confirm, validateConfirm);
  });

  function accountTypeChosen() {
    return Boolean(form.querySelector('input[name="account-type"]:checked'));
  }
  form.querySelectorAll('input[name="account-type"]').forEach((radio) => {
    radio.addEventListener("change", () => { typeError.textContent = ""; });
  });
  terms.addEventListener("change", () => {
    termsError.textContent = "";
    terms.removeAttribute("aria-invalid");
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    showStatus(form, "");

    const checks = [
      [name, checkField(name, validators.name)],
      [email, checkField(email, validators.email)],
      [password, checkField(password, validators.newPassword)],
      [confirm, checkField(confirm, validateConfirm)]
    ];

    const typeOk = accountTypeChosen();
    typeError.textContent = typeOk ? "" : "Choose Freelancer or Client.";
    const firstRadio = form.querySelector('input[name="account-type"]');

    const termsOk = terms.checked;
    termsError.textContent = termsOk ? "" : "Accept the Terms and Conditions to continue.";
    if (termsOk) terms.removeAttribute("aria-invalid");
    else terms.setAttribute("aria-invalid", "true");

    /* Move focus to the first problem, in page order. */
    const firstBadField = checks.find(([, ok]) => !ok);
    if (firstBadField) return firstBadField[0].focus();
    if (!typeOk) return firstRadio.focus();
    if (!termsOk) return terms.focus();

    // PHASE 2: call Firebase Authentication here, then save the account type
    // (freelancer or client) to the user's profile in Firestore (Phase 3).
    password.value = "";
    confirm.value = "";
    showStatus(
      form,
      "Your details look valid, but sign-up isn\u2019t connected yet. Accounts arrive in Phase 2. No account was created and nothing was saved."
    );
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initPasswordToggles();
  initLogin();
  initSignup();
});
