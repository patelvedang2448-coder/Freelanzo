/* ==========================================================================
   main.js — behaviour shared by every page
     • mobile navigation (hamburger)
     • subtle scroll reveal
     • footer year
     • homepage search box -> explore.html
   ========================================================================== */

/* Tell the CSS that JavaScript is running, so the reveal effect is only
   applied when it can actually be un-applied. */
document.documentElement.classList.add("js");

/* Mobile navigation ------------------------------------------------------ */
function initNav() {
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");
  if (!toggle || !menu) return;

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("is-open", open);
  }

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  /* Escape closes the menu and returns focus to the button. */
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  /* Close after choosing a link (useful for #how-it-works on the same page). */
  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  /* Reset when the window grows back to desktop width. */
  window.matchMedia("(min-width: 861px)").addEventListener("change", (e) => {
    if (e.matches) setOpen(false);
  });
}

/* Scroll reveal ---------------------------------------------------------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (items.length === 0) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  items.forEach((item) => observer.observe(item));
}

/* Footer year ------------------------------------------------------------ */
function initYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}

/* Homepage search: send the visitor to the Explore page with their query.
   (Plain GET form in the HTML already does this; this only trims whitespace
   and avoids an empty "?q=" in the address.) */
function initHomeSearch() {
  const form = document.getElementById("home-search");
  const input = document.getElementById("home-query");
  if (!form || !input) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = input.value.trim();
    window.location.href = "explore.html" + (query ? "?q=" + encodeURIComponent(query) : "");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initReveal();
  initYear();
  initHomeSearch();
});
