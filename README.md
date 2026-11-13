# Freelanzo — Phase 2 (Firebase Authentication)

This is the **complete, updated Phase 1 codebase plus working Phase 2 auth code** for the college club project Freelanzo.

- **Real:** Firebase Email/Password signup, login, logout, persistent session, private dashboard, roles (Freelancer/Client), private Firestore `users/{uid}` records.
- **Still a demo:** The nine listings on Home, Explore and Profile are fictional data in `js/sample-data.js`. No real public freelancer listing, portfolio CRUD, contact messaging, payments or automatic responses are implemented in Phase 2.
- **Firebase project:** `freelanzo-9bccb`.

## Folder contents

```text
Freelanzo_Phase_2/
├── index.html, explore.html, profile.html
├── login.html, signup.html, dashboard.html
├── css/style.css
├── js/firebase-config.js   # one-time Firebase initialization
├── js/auth.js              # signup/login + original form validation
├── js/auth-state.js        # navigation, protected-page redirects, logout
├── js/dashboard.js         # Firestore account details / interrupted signup recovery
├── js/main.js              # original common behaviour
├── js/freelancers.js       # original sample freelancer views
├── js/sample-data.js       # fictional listing data
├── assets/images/favicon.svg
├── firestore.rules
└── README.md
```

## Required Firebase Console setup (do this before creating an account)

1. Open https://console.firebase.google.com/ → **freelanzo-9bccb**.
2. **Build → Authentication → Sign-in method** → make sure **Email/Password** is enabled (not Email link only).
3. **Build → Firestore Database** → make sure your database exists.
4. **Firestore Database → Rules:** replace the rules with the **entire contents** of `firestore.rules`, review them, then click **Publish**. This step is mandatory. Only signed-in users can read/write their own document; all other collections are denied during Phase 2.
5. **Authentication → Settings → Authorized domains:** confirm the domain you use for deployment is authorized (e.g. your GitHub Pages hostname). For local development, add `localhost` if not present. Firebase projects created after April 2025 may not add `localhost` by default. If Live Server is served from `127.0.0.1`, use `http://localhost:5500` instead when needed. Do not add arbitrary domains.

No Firebase Admin key, service account JSON, CLI or paid plan is needed to run this Phase 2 site.

## Run locally

1. Open **Freelanzo_Phase_2** as the folder in VS Code.
2. Install **Live Server** and run `index.html` through Live Server; ideally visit `http://localhost:5500/index.html` (the port can vary).
3. **Do not open the HTML using `file://` / double-click**: the Firebase SDK uses ES modules and requires a local HTTP server.
4. Keep an internet connection to load Firebase SDK modules from Google's CDN and connect to Firebase.

### Typical login workflow

1. Open `signup.html` and register with a new email, password, name and role.
2. Your account appears in **Firebase Console → Authentication → Users**.
3. Your private record appears in **Firestore Database → Data → users → <your Firebase UID>** with `uid`, `email`, `fullName`, `role`, `profileCompleted: false`, `createdAt`.
4. You are redirected to `dashboard.html`. Refresh it: you should remain signed in.
5. Log out from the navbar or dashboard and sign back in from `login.html`.

### Recovery if Firestore write fails

Firebase Auth can create an account even when Firestore blocks the profile write. If that happens, **do not register a second time with the same email**. Publish the rules, then use **Dashboard → Finish account setup**; or sign back in and open `dashboard.html`. This flow uses your existing Auth UID and does not create a second Firebase login.

## Publish to GitHub Pages

- Push the **contents** of this folder to the repository root (`index.html` at root).
- Repo **Settings → Pages → Deploy from a branch → main → root**.
- In **Firebase Authentication → Settings → Authorized domains**, authorize your actual GitHub Pages hostname (`YOURNAME.github.io`), not the entire URL. Confirm the domain is permitted for your chosen Firebase auth features.
- All site links use relative paths and should work under a repository subpath.

## Security model

- Firebase web config values are public app identifiers, **not security credentials**. Never upload service-account private keys.
- `users/{uid}` can only be **got** by the matching signed-in user; `list` is denied. User documents contain email and are not public.
- New documents require matching Auth UID and email, valid role/name/schema, server-generated creation timestamp, and `profileCompleted: false`.
- Updates may change **only** `fullName`; role, email, UID and timestamps cannot be edited with client-side APIs.
- Deletion and all other Firestore collections are denied for Phase 2.
- Frontend redirects improve UX only. **Firestore Rules enforce database access.**
- When Phase 3 introduces publicly searchable freelancer profiles, use a **separate public profile collection** with carefully scoped rules. Do not make private `users` documents publicly readable.

## Testing checklist

These are **manual Firebase checks**, NOT claims that the downloaded project has been tested against your live Firebase database.

### Accounts
- [ ] Create a **Freelancer** account. Verify one new Firebase Authentication user and a matching `users/{uid}` document.
- [ ] Create a **Client** account with a different email; verify role in Firestore.
- [ ] Confirm the full name and role displayed on `dashboard.html` match the saved document.
- [ ] Refresh dashboard; stay signed in.
- [ ] Open `login.html` / `signup.html` while signed in; redirect to dashboard.
- [ ] Sign out from dashboard and public-page navbar; logout hides private account information.
- [ ] Enter `dashboard.html` while logged out; it must redirect to `login.html`.
- [ ] Test invalid email, password too short, mismatched passwords, missing role/check, repeated submit.
- [ ] Test duplicate email, invalid password at login, and temporary offline network error.
- [ ] With rules **not** deployed (test in a separate test project only), register and verify recovery UI is offered; publish rules then finish account setup.

### Firestore rules (Rules Playground or Emulator)
- [ ] Signed-in A can read `users/A`; cannot get `users/B` or list `users`.
- [ ] Anonymous user cannot read/write `users/A`.
- [ ] A cannot create `users/B` or write UID/email different from Auth token.
- [ ] A cannot change role, email, UID, createdAt or profileCompleted.
- [ ] A cannot delete their record or write unrelated collections.
- [ ] A can update only own fullName to a valid 2–80-character value.

### Phase 1 regression
- [ ] Homepage hero, categories and search still work.
- [ ] Four featured profiles still appear on Home.
- [ ] Explore shows nine fictional profiles, filters work (try “figma”), and zero-results message works.
- [ ] `profile.html?id=aarav-mehta` works; invalid IDs show not-found notice.
- [ ] Contact on sample profiles does not send messages.
- [ ] Mobile nav, password visibility toggles, footer, animations, keyboard focus, and 360/768/1280px layouts work.
- [ ] No errors in the browser dev console.
- [ ] GitHub Pages resolves all CSS/JS modules correctly after domain authorization.

## Implementation notes / known limits

- SDK is pinned to **Firebase JS 11.10.0** via Google's browser module CDN. Future SDK upgrades should update every Firebase import URL to the same version.
- Authentication is handled in the browser by Firebase, not a custom server. The browser maintains session persistence using the SDK's default local persistence.
- The Firebase web configuration includes an API key intended for use in browser apps; security is enforced by Firebase Auth and Firestore Rules, not by hiding this key.
- We have **not** validated end-to-end registration, permissions, or hosting against your live Firebase project; those need your Console and browser.
- The sample freelancers are not linked to the real accounts you create.

## Next phases

- **Phase 3:** Real public freelancer profiles and portfolio CRUD with separate public/profile rules.
- **Phase 4:** Two-way Firestore messaging and secure participant-only conversations.
- **Phase 5:** Integration testing, UX polish and deployment.
