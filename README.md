# Freelanzo — Phase 1 (Frontend)

Freelanzo is a freelance portfolio platform. Freelancers showcase projects and skills; clients discover freelancers and view their portfolios.

**Phase 1 is frontend only.** It uses HTML, CSS and vanilla JavaScript, with no frameworks and no backend.

- All freelancer profiles are **fictional sample data** (`js/sample-data.js`).
- Login and Sign Up **validate the form only**. They do not sign anyone in, create accounts, store passwords or contact a server.
- The profile page's Contact button says messaging is a future feature and sends nothing.

## Project structure

```
freelanzo-phase-1/
├── index.html          Landing page (hero, search, categories, featured, how it works)
├── explore.html        Search + category filters + empty state
├── profile.html        One freelancer, chosen with ?id=aarav-mehta
├── login.html          Login form with validation
├── signup.html         Sign-up form with validation
├── css/
│   └── style.css       Design tokens (CSS variables) + all styles
├── js/
│   ├── sample-data.js  Fictional freelancers + categories (replace in Phase 3)
│   ├── freelancers.js  FreelancerService + cards, search, filters, profile page
│   ├── auth.js         Form validation + password show/hide
│   └── main.js         Mobile menu, scroll reveal, footer year, home search
├── assets/images/
│   └── favicon.svg     Site icon (extra file; the only image asset in Phase 1)
└── README.md
```

Project images in Phase 1 are CSS-drawn placeholders, so no photo files are needed. Avatars use initials.

## Run it in VS Code

1. Install [Visual Studio Code](https://code.visualstudio.com/).
2. Open VS Code, go to **Extensions** (Ctrl+Shift+X), search for **Live Server** (by Ritwick Dey), and install it.
3. Choose **File → Open Folder…** and select the `freelanzo-phase-1` folder.
4. Open `index.html`, then right-click in the editor and choose **Open with Live Server** (or click **Go Live** in the bottom-right status bar).
5. Your browser opens at `http://127.0.0.1:5500/index.html`. Edits save and refresh automatically.

You can also double-click `index.html` to open it directly, and everything works. Live Server is recommended because it matches how GitHub Pages serves the site.

> The fonts (Bricolage Grotesque and Instrument Sans) load from Google Fonts. Offline, the site falls back to your system font and still works.

## Deploy to GitHub Pages

1. Create a repository and push the **contents** of this folder (so `index.html` is at the repository root).
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, and save.
4. After a minute the site is live at `https://<your-username>.github.io/<repository-name>/`.

All links are relative, so it works under a repository sub-path.

## Testing checklist

Tick each item in a desktop browser, then repeat the layout checks at tablet and phone widths (use browser DevTools device mode).

**Navigation (every page)**
- [ ] Logo goes to `index.html`
- [ ] Home, Explore Freelancers, How It Works, Login and Sign Up all open the right page
- [ ] How It Works scrolls to the section on the homepage (and from other pages)
- [ ] The current page is highlighted in the navbar
- [ ] Navbar stays at the top while scrolling
- [ ] Footer links (Quick links, About, Contact) all work
- [ ] Pressing Tab first shows a "Skip to main content" link

**Mobile menu (below 860px wide)**
- [ ] Hamburger button opens and closes the menu
- [ ] Escape closes the menu and returns focus to the button
- [ ] Choosing a link closes the menu

**Homepage**
- [ ] Headline, subheading and both buttons appear
- [ ] Typing a name or skill and pressing Search opens Explore with results filtered
- [ ] Each popular skill chip opens Explore with that search
- [ ] Each of the six categories opens Explore filtered to that category
- [ ] Four featured freelancer cards appear, and View profile opens the right profile
- [ ] On a phone, categories and featured cards scroll sideways

**Explore**
- [ ] All nine sample freelancers show at first
- [ ] Typing "figma" shows only Rohan and Neil
- [ ] Searching a name (for example "meera") works
- [ ] Category buttons filter results, and "All categories" resets
- [ ] Search and category work together
- [ ] Searching "zzzz" shows the empty state; "Clear search and filters" restores everything
- [ ] The result count updates ("Showing 2 freelancers")

**Profile**
- [ ] `profile.html?id=aarav-mehta` shows Aarav's profile
- [ ] `profile.html?id=isha-kulkarni` shows a different person
- [ ] `profile.html?id=nonsense` and `profile.html` show the "couldn't find that profile" message
- [ ] The Contact button shows that messaging arrives in a future phase and nothing is sent
- [ ] Back to Explore works

**Login**
- [ ] Empty submit shows errors for email and password
- [ ] `abc` as email shows an invalid email error
- [ ] Show/Hide toggles the password and its label
- [ ] Valid entries show the "isn't connected yet" message, with no redirect and no success claim
- [ ] The password field is cleared after a valid submit

**Sign Up**
- [ ] Empty submit shows an error on every field, account type and terms
- [ ] Password under 8 characters, or without a number, is rejected
- [ ] Mismatched confirmation shows an error
- [ ] Account type must be chosen and terms must be checked
- [ ] Valid entries show the "no account was created" message
- [ ] Both Show/Hide buttons work

**Accessibility and quality**
- [ ] Every page can be used with the keyboard alone, with a visible focus outline
- [ ] The browser console (F12) shows no errors on any page
- [ ] Layout has no sideways scroll at 360px, 768px and 1280px wide
- [ ] With the system setting "reduce motion" on, animations are off

## How the frontend is prepared for Firebase

The code is split so Firebase can be added without redesigning anything.

- **One data gateway.** `FreelancerService` in `js/freelancers.js` is the only code that knows where freelancers come from. Its methods (`getAll`, `getFeatured`, `getById`) are already `async`, like Firestore calls. In Phase 3 you rewrite those three functions to read from Firestore and delete `sample-data.js`. The cards, search and profile code stay the same.
- **Data shaped like documents.** Each sample freelancer is a plain object with an `id`, which maps directly to a Firestore document in a `freelancers` collection.
- **Profile URLs already use IDs.** `profile.html?id=...` will later use the Firestore document ID.
- **Validation is separate from submission.** In `js/auth.js` the validators are independent of what happens on submit. In Phase 2 you replace the two `// PHASE 2` comments with `signInWithEmailAndPassword` and `createUserWithEmailAndPassword`, and add `onAuthStateChanged` for logout and protected pages.
- **Account type is collected now.** The sign-up form already asks Freelancer or Client, so Phase 3 can store it on the user profile.
- **No credentials in the repo.** Nothing Firebase-related is hardcoded. When you add Firebase, put your project settings in a new `js/firebase-config.js`, and load Firebase with `<script type="module">` on the pages that need it. Firestore Security Rules, not hidden config, are what protect your data.
- **Safe rendering.** Data is inserted with `textContent`, never `innerHTML`, so real user-written profiles in Phase 3 can't inject markup.

## Phases

| Phase | Scope |
|-------|-------|
| 1 | Frontend with sample data (this folder) |
| 2 | Firebase Authentication: real signup/login, logout, protected pages |
| 3 | Firestore profiles: create/read/update/delete, public profiles, real search |
| 4 | Real-time messaging with `onSnapshot`, inbox, security rules |
| 5 | Testing, bug fixes, polish, deployment, documentation |
