/* ==========================================================================
   sample-data.js — SAMPLE DATA ONLY (Phase 1 demo)

   Every person below is fictional. This file exists so the interface has
   something to show. In Phase 3 the app will read real profiles from
   Cloud Firestore instead, and this file can be deleted.

   Each freelancer has the same shape a Firestore document would have:
     id, name, title, category, location, skills[], bio, about, tone, featured,
     projects[{ title, tag, description, tone, pattern }]
   `tone` (1-6) picks a colour pair from the CSS; `pattern` (a/b/c) picks a
   placeholder tile design, so no image files are needed.
   ========================================================================== */

const SAMPLE_DATA_NOTICE =
  "Sample data: these profiles are fictional and shown only to demonstrate the Phase 1 interface.";

/* `id` values are used in URLs (explore.html?category=web-development). */
const CATEGORIES = [
  { id: "web-development", label: "Web Development" },
  { id: "graphic-design", label: "Graphic Design" },
  { id: "ui-ux-design", label: "UI/UX Design" },
  { id: "video-editing", label: "Video Editing" },
  { id: "content-writing", label: "Content Writing" },
  { id: "digital-marketing", label: "Digital Marketing" }
];

/* Suggestions shown under the search boxes. */
const POPULAR_SKILLS = ["JavaScript", "Figma", "Logo design", "Premiere Pro", "SEO", "Copywriting"];

const SAMPLE_FREELANCERS = [
  {
    id: "aarav-mehta",
    name: "Aarav Mehta",
    title: "Full-Stack Web Developer",
    category: "web-development",
    location: "Pune, India",
    skills: ["HTML", "CSS", "JavaScript", "Node.js", "Firebase"],
    bio: "I build fast, accessible websites for student startups and small shops.",
    about:
      "I am a third-year computer engineering student who builds complete websites, from the first wireframe to deployment. I like clean code, clear communication, and delivering on the date I promise. I have shipped class projects and small business sites using plain HTML, CSS and JavaScript, plus Firebase for simple backends.",
    tone: 1,
    featured: true,
    projects: [
      { title: "Campus Canteen Ordering Site", tag: "Web app", tone: 1, pattern: "a", description: "A mobile-first menu and order-summary page built for a college canteen, with a live cart total." },
      { title: "Local Bakery Landing Page", tag: "Website", tone: 2, pattern: "c", description: "A one-page site with an online menu, opening hours and a map section for a neighbourhood bakery." },
      { title: "Study Group Scheduler", tag: "Web app", tone: 5, pattern: "b", description: "A small calendar tool that helps classmates pick a shared time to study." }
    ]
  },
  {
    id: "isha-kulkarni",
    name: "Isha Kulkarni",
    title: "Brand & Graphic Designer",
    category: "graphic-design",
    location: "Mumbai, India",
    skills: ["Logo design", "Branding", "Illustrator", "Photoshop"],
    bio: "Logos, colour systems and social media kits that make small brands look established.",
    about:
      "I design brand identities for new businesses and student clubs. My process starts with a short questionnaire so the logo reflects what the client actually does, then moves through sketches, a shortlist, and a final pack with colours, fonts and usage rules.",
    tone: 6,
    featured: true,
    projects: [
      { title: "Chai Corner Brand Identity", tag: "Branding", tone: 4, pattern: "c", description: "Logo, colour palette and cup packaging for a small tea stall." },
      { title: "Tech Fest Poster Series", tag: "Print", tone: 6, pattern: "a", description: "Three matching posters for a college technical festival." }
    ]
  },
  {
    id: "rohan-desai",
    name: "Rohan Desai",
    title: "UI/UX Designer",
    category: "ui-ux-design",
    location: "Nashik, India",
    skills: ["Figma", "Prototyping", "User research", "Design systems"],
    bio: "I turn rough ideas into clickable prototypes that people can understand in seconds.",
    about:
      "I design apps and websites around real user tasks. I interview a few users, map their steps, and test paper or Figma prototypes before anything is built. I also create small design systems so developers can reuse buttons, colours and spacing consistently.",
    tone: 5,
    featured: true,
    projects: [
      { title: "Bus Pass Renewal App", tag: "Mobile app", tone: 5, pattern: "b", description: "A redesign that cut the renewal flow from seven screens to three." },
      { title: "Club Event Portal Prototype", tag: "Web app", tone: 1, pattern: "a", description: "A clickable prototype for registering for college club events." },
      { title: "Mini Design System", tag: "System", tone: 3, pattern: "c", description: "Buttons, form fields and colour tokens documented for a student team." }
    ]
  },
  {
    id: "meera-iyer",
    name: "Meera Iyer",
    title: "Video Editor & Motion Designer",
    category: "video-editing",
    location: "Bengaluru, India",
    skills: ["Premiere Pro", "After Effects", "Colour grading", "Motion graphics"],
    bio: "Reels, event recaps and explainers with tight cuts and clean titles.",
    about:
      "I edit short videos for creators, clubs and small brands. I handle trimming, sound clean-up, captions, colour correction and simple motion graphics, and I deliver in the right format for each platform.",
    tone: 4,
    featured: true,
    projects: [
      { title: "Annual Day Highlight Reel", tag: "Event video", tone: 4, pattern: "a", description: "A two-minute recap cut from three cameras with music and lower-third titles." },
      { title: "Product Explainer Animation", tag: "Motion", tone: 2, pattern: "c", description: "A 45-second animated explainer for a student-built app." }
    ]
  },
  {
    id: "kabir-sharma",
    name: "Kabir Sharma",
    title: "Content Writer & Editor",
    category: "content-writing",
    location: "Delhi, India",
    skills: ["Blog writing", "SEO", "Copywriting", "Proofreading"],
    bio: "Clear, search-friendly articles and website copy for technology and education brands.",
    about:
      "I write blog posts, landing page copy and newsletters that explain things simply. Every piece starts with a brief about the reader, then an outline for approval, then a draft with one round of edits included.",
    tone: 3,
    featured: false,
    projects: [
      { title: "Beginner's Guide to Git", tag: "Blog series", tone: 3, pattern: "b", description: "A five-part series explaining version control with everyday examples." },
      { title: "Coaching Institute Website Copy", tag: "Copywriting", tone: 2, pattern: "a", description: "Homepage and course page text for a local coaching institute." }
    ]
  },
  {
    id: "ananya-joshi",
    name: "Ananya Joshi",
    title: "Digital Marketing Strategist",
    category: "digital-marketing",
    location: "Pune, India",
    skills: ["SEO", "Social media", "Google Analytics", "Email campaigns"],
    bio: "Simple, measurable marketing plans for new businesses on a small budget.",
    about:
      "I help small businesses get found online. I set up analytics, plan a month of social content, and write email campaigns, then report what worked in plain language so you know where to focus next.",
    tone: 2,
    featured: false,
    projects: [
      { title: "30-Day Social Calendar", tag: "Social media", tone: 2, pattern: "c", description: "A content plan with post ideas, captions and posting times for a fitness studio." },
      { title: "Newsletter Launch", tag: "Email", tone: 5, pattern: "b", description: "A three-email welcome sequence for a handmade jewellery shop." }
    ]
  },
  {
    id: "vikram-patil",
    name: "Vikram Patil",
    title: "Frontend Developer",
    category: "web-development",
    location: "Kolhapur, India",
    skills: ["JavaScript", "React", "Tailwind CSS", "Accessibility"],
    bio: "Responsive interfaces that work with a keyboard, a screen reader and a slow phone.",
    about:
      "I turn designs into pixel-accurate, accessible interfaces. I test with keyboard-only navigation and on low-end phones, and I write short documentation so your team can maintain the code.",
    tone: 5,
    featured: false,
    projects: [
      { title: "Expense Splitter", tag: "Web app", tone: 5, pattern: "a", description: "A small tool for splitting trip costs among friends." },
      { title: "Portfolio Template", tag: "Website", tone: 1, pattern: "b", description: "A reusable single-page portfolio with light and dark themes." }
    ]
  },
  {
    id: "sara-dsouza",
    name: "Sara D'Souza",
    title: "Illustrator & Poster Designer",
    category: "graphic-design",
    location: "Goa, India",
    skills: ["Illustration", "Procreate", "Poster design", "Typography"],
    bio: "Hand-drawn illustrations and bold posters for events, cafés and book covers.",
    about:
      "I draw custom illustrations and design posters with strong typography. I work in Procreate and Illustrator, and I can deliver print-ready files or web-sized exports.",
    tone: 6,
    featured: false,
    projects: [
      { title: "Open Mic Night Posters", tag: "Poster", tone: 6, pattern: "c", description: "A monthly poster series with a hand-lettered title." },
      { title: "Short Story Cover Art", tag: "Illustration", tone: 4, pattern: "a", description: "A cover illustration for a student-published story collection." }
    ]
  },
  {
    id: "neil-bhatt",
    name: "Neil Bhatt",
    title: "Product Designer",
    category: "ui-ux-design",
    location: "Ahmedabad, India",
    skills: ["Wireframing", "Figma", "Mobile app design", "Usability testing"],
    bio: "Mobile app flows that are easy to learn, tested with real people before launch.",
    about:
      "I design mobile apps from the first sketch to a tested prototype. I run short usability sessions, summarise what I learned, and update the design before handing it to developers.",
    tone: 1,
    featured: false,
    projects: [
      { title: "Hostel Mess Feedback App", tag: "Mobile app", tone: 3, pattern: "b", description: "A quick daily rating flow that takes under ten seconds." },
      { title: "Library Seat Booking Flow", tag: "Mobile app", tone: 1, pattern: "a", description: "Wireframes and a prototype for reserving study seats." }
    ]
  }
];
