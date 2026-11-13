/* ==========================================================================
   freelancers.js — freelancer data access + rendering for
   index.html (featured), explore.html (search/filter) and profile.html.

   Requires sample-data.js to be loaded first.

   Structure (so Firebase can be added later without a redesign):
     1. FreelancerService  – the ONLY place that knows where data comes from.
     2. Pure helpers       – search/filter logic, DOM builders.
     3. Page initialisers  – wire the DOM to the service.
   All text is inserted with textContent, never innerHTML, so data (and URL
   parameters) can never inject markup.
   ========================================================================== */

/* 1. DATA ACCESS --------------------------------------------------------- */
/* Methods are async on purpose: Firestore calls are async, so the page code
   below will not need to change when this object is rewritten in Phase 3.
   PHASE 3: replace the bodies with Firestore reads (getDocs / getDoc). */
const FreelancerService = {
  async getAll() {
    return SAMPLE_FREELANCERS.slice();
  },
  async getFeatured() {
    return SAMPLE_FREELANCERS.filter((f) => f.featured);
  },
  async getById(id) {
    return SAMPLE_FREELANCERS.find((f) => f.id === id) || null;
  }
};

/* 2. HELPERS ------------------------------------------------------------- */
function categoryLabel(categoryId) {
  const match = CATEGORIES.find((c) => c.id === categoryId);
  return match ? match.label : categoryId;
}

function initialsOf(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

/* Tiny element builder: el("p", { class: "x", text: "Hi" }, [children]) */
function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (key === "text") node.textContent = value;
    else if (key === "class") node.className = value;
    else node.setAttribute(key, value);
  });
  [].concat(children).forEach((child) => {
    if (child) node.appendChild(child);
  });
  return node;
}

/* Returns true when a freelancer matches the search text AND category. */
function matchesFilters(freelancer, query, category) {
  if (category && category !== "all" && freelancer.category !== category) return false;
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = [
    freelancer.name,
    freelancer.title,
    categoryLabel(freelancer.category),
    freelancer.skills.join(" ")
  ].join(" ").toLowerCase();
  return terms.every((term) => haystack.includes(term));
}

function profileUrl(id) {
  return "profile.html?id=" + encodeURIComponent(id);
}

function buildAvatar(freelancer, sizeClass) {
  return el("div", {
    class: ["avatar", sizeClass, "tone-" + freelancer.tone].filter(Boolean).join(" "),
    "aria-hidden": "true",
    text: initialsOf(freelancer.name)
  });
}

function buildTile(project, withLabel) {
  const tile = el("div", {
    class: "tile tile--" + project.pattern + " tone-" + project.tone,
    role: "img",
    "aria-label": "Placeholder image for " + project.title
  });
  if (withLabel) tile.appendChild(el("span", { class: "tile__label", text: project.tag }));
  return tile;
}

/* options.compact = true hides the portfolio preview (used on the homepage). */
function buildFreelancerCard(freelancer, options = {}) {
  const nameId = "fl-" + freelancer.id;
  const card = el("article", { class: "card", "aria-labelledby": nameId });

  card.appendChild(
    el("div", { class: "card__head" }, [
      buildAvatar(freelancer),
      el("div", {}, [
        el("h3", { id: nameId, text: freelancer.name }),
        el("p", { class: "card__title", text: freelancer.title })
      ])
    ])
  );

  card.appendChild(el("p", { class: "card__bio", text: freelancer.bio }));

  const skills = el("ul", { class: "card__skills", "aria-label": "Skills" });
  const shown = options.compact ? 3 : 4;
  freelancer.skills.slice(0, shown).forEach((skill) => {
    skills.appendChild(el("li", { class: "chip chip--tag", text: skill }));
  });
  card.appendChild(skills);

  if (!options.compact) {
    const preview = el("div", { class: "preview" });
    freelancer.projects.slice(0, 3).forEach((p) => preview.appendChild(buildTile(p, false)));
    card.appendChild(preview);
  }

  card.appendChild(
    el("div", { class: "card__foot" }, [
      el("a", {
        class: "btn btn--ghost btn--block",
        href: profileUrl(freelancer.id),
        text: "View profile",
        "aria-label": "View profile of " + freelancer.name
      })
    ])
  );
  return card;
}

/* 3. PAGE INITIALISERS --------------------------------------------------- */

/* index.html — featured freelancers */
async function initHome() {
  const container = document.getElementById("featured-list");
  if (!container) return;
  const featured = await FreelancerService.getFeatured();
  container.replaceChildren(...featured.map((f) => buildFreelancerCard(f, { compact: true })));
}

/* explore.html — search + category filter + empty state */
async function initExplore() {
  const form = document.getElementById("explore-form");
  const input = document.getElementById("explore-query");
  const chipBox = document.getElementById("category-filters");
  const results = document.getElementById("results");
  const meta = document.getElementById("results-meta");
  const empty = document.getElementById("empty-state");
  const emptyText = document.getElementById("empty-text");
  const clearBtn = document.getElementById("clear-filters");
  if (!form || !input || !chipBox || !results || !meta || !empty) return;

  const all = await FreelancerService.getAll();
  const params = new URLSearchParams(window.location.search);
  const state = { query: (params.get("q") || "").slice(0, 80), category: "all" };
  const requested = params.get("category");
  if (CATEGORIES.some((c) => c.id === requested)) state.category = requested;
  input.value = state.query;

  /* Build category chips: "All" first, then each category. */
  [{ id: "all", label: "All categories" }].concat(CATEGORIES).forEach((cat) => {
    const chip = el("button", {
      type: "button",
      class: "chip",
      "data-category": cat.id,
      "aria-pressed": "false",
      text: cat.label
    });
    chipBox.appendChild(chip);
  });

  function syncUrl() {
    const next = new URLSearchParams();
    if (state.query) next.set("q", state.query);
    if (state.category !== "all") next.set("category", state.category);
    const qs = next.toString();
    try {
      window.history.replaceState(null, "", window.location.pathname + (qs ? "?" + qs : ""));
    } catch (error) {
      /* Some browsers block this on file:// pages. The page still works. */
    }
  }

  function render() {
    chipBox.querySelectorAll("button").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.category === state.category));
    });

    const matches = all.filter((f) => matchesFilters(f, state.query, state.category));
    results.replaceChildren(...matches.map((f) => buildFreelancerCard(f)));

    const hasResults = matches.length > 0;
    results.hidden = !hasResults;
    empty.hidden = hasResults;
    meta.textContent = hasResults
      ? "Showing " + matches.length + (matches.length === 1 ? " freelancer" : " freelancers")
      : "No freelancers found";

    if (!hasResults) {
      const parts = [];
      if (state.query) parts.push("\u201c" + state.query + "\u201d");
      if (state.category !== "all") parts.push("in " + categoryLabel(state.category));
      emptyText.textContent =
        "Nothing matches " + (parts.join(" ") || "these filters") +
        ". Check the spelling, try a broader skill such as \u201cdesign\u201d, or clear the filters.";
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    state.query = input.value.trim();
    syncUrl();
    render();
  });
  input.addEventListener("input", () => {
    state.query = input.value.trim();
    syncUrl();
    render();
  });
  chipBox.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-category]");
    if (!btn) return;
    state.category = btn.dataset.category;
    syncUrl();
    render();
  });
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      state.query = "";
      state.category = "all";
      input.value = "";
      syncUrl();
      render();
      input.focus();
    });
  }

  render();
}

/* profile.html — one freelancer chosen with ?id=... */
async function initProfile() {
  const root = document.getElementById("profile-root");
  if (!root) return;
  const id = new URLSearchParams(window.location.search).get("id");
  const freelancer = id ? await FreelancerService.getById(id) : null;

  if (!freelancer) {
    document.title = "Profile not found \u2014 Freelanzo";
    root.replaceChildren(
      el("div", { class: "empty" }, [
        el("h1", { text: "We couldn\u2019t find that profile" }),
        el("p", { text: "The link may be incomplete or the freelancer is not in the sample data." }),
        el("a", { class: "btn btn--primary", href: "explore.html", text: "Browse all freelancers" })
      ])
    );
    return;
  }

  document.title = freelancer.name + " \u2014 " + freelancer.title + " \u2014 Freelanzo";
  const firstName = freelancer.name.split(" ")[0];

  /* Contact button: honest about Phase 1, sends nothing. */
  const note = el("p", { class: "contact-note", id: "contact-note", role: "status" });
  const contactBtn = el("button", {
    type: "button",
    class: "btn btn--primary",
    "aria-describedby": "contact-note",
    text: "Contact " + firstName
  });
  contactBtn.addEventListener("click", () => {
    note.textContent = "Messaging arrives in a future phase. Nothing was sent.";
  });

  const hero = el("section", { class: "profile-hero", "aria-labelledby": "profile-name" }, [
    buildAvatar(freelancer, "avatar--lg"),
    el("div", { class: "profile-hero__main" }, [
      el("h1", { id: "profile-name", text: freelancer.name }),
      el("p", { class: "profile-hero__title", text: freelancer.title }),
      el("div", { class: "profile-hero__meta" }, [
        el("span", { class: "chip chip--tag", text: categoryLabel(freelancer.category) }),
        el("span", { class: "chip chip--tag", text: freelancer.location }),
        el("span", { class: "badge", text: "Sample profile" })
      ])
    ]),
    el("div", { class: "profile-hero__cta" }, [contactBtn, note])
  ]);

  const about = el("section", { class: "panel", "aria-labelledby": "about-heading" }, [
    el("h2", { id: "about-heading", text: "About me" }),
    el("p", { text: freelancer.about })
  ]);

  const projectsGrid = el("div", { class: "projects" });
  freelancer.projects.forEach((project) => {
    projectsGrid.appendChild(
      el("article", { class: "project" }, [
        buildTile(project, true),
        el("h3", { text: project.title }),
        el("p", { text: project.description })
      ])
    );
  });
  const projects = el("section", { class: "panel", "aria-labelledby": "projects-heading" }, [
    el("h2", { id: "projects-heading", text: "Portfolio projects" }),
    projectsGrid
  ]);

  const skillList = el("ul", { class: "chip-row", "aria-label": "Skills" });
  freelancer.skills.forEach((skill) => skillList.appendChild(el("li", { class: "chip chip--tag", text: skill })));
  const skills = el("section", { class: "panel", "aria-labelledby": "skills-heading" }, [
    el("h2", { id: "skills-heading", text: "Skills" }),
    skillList
  ]);

  const similar = el("section", { class: "panel", "aria-labelledby": "more-heading" }, [
    el("h2", { id: "more-heading", text: "Keep exploring" }),
    el("p", { text: "See more freelancers in " + categoryLabel(freelancer.category) + "." }),
    el("a", {
      class: "btn btn--secondary btn--block",
      href: "explore.html?category=" + encodeURIComponent(freelancer.category),
      text: "Browse " + categoryLabel(freelancer.category)
    })
  ]);

  root.replaceChildren(
    el("a", { class: "back-link", href: "explore.html", text: "\u2190 Back to Explore" }),
    hero,
    el("div", { class: "profile-layout" }, [
      el("div", {}, [about, projects]),
      el("aside", { "aria-label": "Skills and related links" }, [skills, similar])
    ])
  );
}

/* Run the right initialiser for the current page (set on <body data-page>). */
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "home") initHome();
  if (page === "explore") initExplore();
  if (page === "profile") initProfile();
});
