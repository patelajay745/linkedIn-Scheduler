import {
  Calendar03Icon,
  Clock01Icon,
  Linkedin01Icon,
  Upload01Icon,
  GiftIcon,
  SourceCodeIcon,
  ServerStack01Icon,
  Globe02Icon,
  UserGroupIcon,
  Store01Icon,
  MoneyBag01Icon,
} from "@hugeicons/core-free-icons";

export const FEATURES = [
  {
    icon: Calendar03Icon,
    title: "Visual Calendar",
    description: "See all your scheduled posts on a clean monthly calendar. Navigate months and see exactly what goes live and when.",
  },
  {
    icon: Clock01Icon,
    title: "Precise Scheduling",
    description: "Pick a date and time down to the minute. Posts go out automatically — no need to be online.",
  },
  {
    icon: Upload01Icon,
    title: "Rich Media Support",
    description: "Attach up to 20 images per post with a drag-and-drop uploader. Preview them inline before publishing.",
  },
  {
    icon: Linkedin01Icon,
    title: "Direct LinkedIn Publish",
    description: "Posts are published directly via the LinkedIn API. No third-party relay, no extra accounts.",
  },
];

export const WHY_FREE = [
  {
    icon: GiftIcon,
    heading: "No subscription, ever",
    body: "Most scheduling tools charge $15–50/month. This one costs what your server costs — often zero on a free tier.",
  },
  {
    icon: SourceCodeIcon,
    heading: "You own the code",
    body: "Fork it, modify it, white-label it. No black-box algorithms deciding when your posts get pushed.",
  },
  {
    icon: ServerStack01Icon,
    heading: "You own the data",
    body: "Your LinkedIn tokens, your post content, your schedule — all stored in your own database. Nothing leaves your infra.",
  },
  {
    icon: Globe02Icon,
    heading: "Community driven",
    body: "Open source means bugs get fixed faster, features get added by real users, and the project outlives any one person.",
  },
];

export const SAAS_STEPS = [
  {
    n: "01",
    title: "Add multi-user auth",
    body: "Swap the single-user session for team accounts. Each user connects their own LinkedIn.",
  },
  {
    n: "02",
    title: "Gate features with Stripe",
    body: "Add a payment wall — free tier for 5 posts/month, paid tier for unlimited. Drop in Stripe Checkout in an afternoon.",
  },
  {
    n: "03",
    title: "Deploy & charge",
    body: "Push to Vercel + Railway (or your own VPS). Set your price. Keep 100% of revenue minus Stripe fees.",
  },
];

export const USE_CASES = [
  {
    icon: UserGroupIcon,
    who: "Solo Creators",
    what: "Plan a week of LinkedIn content in one sitting. Let the scheduler handle the rest.",
  },
  {
    icon: Store01Icon,
    who: "Small Businesses",
    what: "Maintain a consistent LinkedIn presence without hiring a social media manager.",
  },
  {
    icon: SourceCodeIcon,
    who: "Developers",
    what: "Build your personal brand on LinkedIn while you focus on shipping. Set it and forget it.",
  },
  {
    icon: MoneyBag01Icon,
    who: "Indie Hackers",
    what: "Fork the repo, wrap it in payments, and sell it as a niche scheduling SaaS.",
  },
];

export const DEPLOY_COMMANDS = [
  "git clone the repo",
  "cp .env.example .env  # fill in 3 vars",
  "docker compose up -d  # or deploy to Railway",
];

export const TRUST_BADGES = ["No credit card", "Self-hosted", "LinkedIn API", "Open source"];
