/* Password visibility must never depend on Firebase loading. This is a plain browser script. */
(function () {
  "use strict";

  function init() {
    document.querySelectorAll(".toggle-pw").forEach(function (button) {
      var input = document.getElementById(button.getAttribute("data-target"));
      if (!input) return;
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", function () {
        var reveal = input.type === "password";
        input.type = reveal ? "text" : "password";
        button.textContent = reveal ? "Hide" : "Show";
        button.setAttribute("aria-pressed", String(reveal));
        button.setAttribute("aria-label", (reveal ? "Hide " : "Show ") +
          (button.getAttribute("data-label") || "password"));
      });
    });

    document.querySelectorAll("#login-form, #signup-form").forEach(function (form) {
      // If modules are blocked (especially when opened with file://), show a useful
      // message instead of silently reloading the page or doing nothing.
      form.addEventListener("submit", function (event) {
        if (form.dataset.authReady === "true") return;
        event.preventDefault();
        var status = form.querySelector(".form-status");
        if (!status) return;
        status.dataset.kind = "error";
        status.textContent = window.location.protocol === "file:"
          ? "Please open this project with VS Code Live Server (http://localhost:5500/signup.html or /login.html). Firebase cannot run by double-clicking HTML files."
          : "The authentication script did not load. Check your internet connection, reload the page, and check your browser console (F12).";
      });
    });

    if (window.location.protocol === "file:") {
      var status = document.querySelector("#login-form .form-status, #signup-form .form-status");
      if (status) {
        status.dataset.kind = "error";
        status.textContent = "Open Freelanzo through VS Code Live Server, not as a file (file://). The Show password button works here, but Firebase signup/login needs http://localhost.";
      }
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
