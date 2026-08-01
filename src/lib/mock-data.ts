/**
 * Mock Data Registry — single source of truth for all demo content.
 *
 * Every page, widget, and empty state reads realistic data from here.
 * When real data arrives (API, database), replace this file with
 * actual data fetching — zero changes to page components.
 *
 * All data is server-safe: no hooks, no browser APIs, no randomness.
 * Dates are relative to 2026-07-31 (current project date).
 */

// ─── Fixed reference date ───────────────────────────────────────────

export const MOCK_TODAY = "2026-07-31";

// ─── Shared Types ───────────────────────────────────────────────────

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate: string;
  project?: string;
}

export interface HabitItem {
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
  frequency: "daily" | "weekly";
  category: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  mood: "great" | "good" | "neutral" | "low";
}

export interface NoteItem {
  id: string;
  title: string;
  excerpt: string;
  updatedAt: string;
  tags: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  progress: number; // 0-100
  status: "active" | "on-hold" | "completed";
  category: string;
  deadline?: string;
}

export interface GoalItem {
  id: string;
  title: string;
  description: string;
  progress: number; // 0-100
  target: number;
  unit: string;
  deadline: string;
  category: string;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: number; // 0-100
  hours: number;
  projects: number;
  interviewReady: boolean;
}

export type SkillCategory =
  "programming" | "frontend" | "backend" | "cloud" | "soft-skills" | "languages";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "meeting" | "deadline" | "personal" | "health";
}

export interface InterviewItem {
  id: string;
  company: string;
  role: string;
  date: string;
  status: "upcoming" | "completed" | "rejected" | "offer";
  round: string;
  notes?: string;
}

export interface ExpenseItem {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  type: "income" | "expense";
}

export interface ResumeSection {
  name: string;
  completion: number; // 0-100
  lastUpdated: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  module: string;
  timestamp: string;
  iconName: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string; // initials
}

export interface RoadmapPhase {
  phase: string;
  title: string;
  status: "completed" | "in-progress" | "upcoming";
  items: string[];
}

export interface FeatureCard {
  title: string;
  description: string;
  iconName: string;
  href: string;
}

export interface AnalyticsData {
  productivityScore: number;
  tasksCompleted: number;
  habitsMaintained: number;
  journalStreak: number;
  weeklyOverview: { day: string; tasksDone: number; focusMinutes: number }[];
}

// ─── Mock Tasks ─────────────────────────────────────────────────────

export const MOCK_TASKS: TaskItem[] = [
  {
    id: "t-1",
    title: "Design authentication flow",
    completed: false,
    priority: "high",
    dueDate: "2026-08-01",
    project: "LifeOS",
  },
  {
    id: "t-2",
    title: "Review database schema",
    completed: false,
    priority: "high",
    dueDate: "2026-08-02",
    project: "LifeOS",
  },
  {
    id: "t-3",
    title: "Set up CI/CD pipeline",
    completed: false,
    priority: "medium",
    dueDate: "2026-08-03",
  },
  {
    id: "t-4",
    title: "Write unit tests for auth module",
    completed: true,
    priority: "medium",
    dueDate: "2026-07-30",
    project: "LifeOS",
  },
  {
    id: "t-5",
    title: "Fix responsive sidebar bug",
    completed: true,
    priority: "low",
    dueDate: "2026-07-29",
    project: "LifeOS",
  },
  {
    id: "t-6",
    title: "Update project documentation",
    completed: false,
    priority: "low",
    dueDate: "2026-08-10",
  },
];

// ─── Mock Habits ────────────────────────────────────────────────────

export const MOCK_HABITS: HabitItem[] = [
  {
    id: "h-1",
    name: "Morning meditation",
    streak: 12,
    completedToday: true,
    frequency: "daily",
    category: "Wellness",
  },
  {
    id: "h-2",
    name: "Code for 1 hour",
    streak: 8,
    completedToday: true,
    frequency: "daily",
    category: "Learning",
  },
  {
    id: "h-3",
    name: "Read 30 minutes",
    streak: 5,
    completedToday: false,
    frequency: "daily",
    category: "Learning",
  },
  {
    id: "h-4",
    name: "Evening walk",
    streak: 15,
    completedToday: true,
    frequency: "daily",
    category: "Health",
  },
  {
    id: "h-5",
    name: "Journal review",
    streak: 3,
    completedToday: false,
    frequency: "daily",
    category: "Reflection",
  },
  {
    id: "h-6",
    name: "Weekly planning",
    streak: 4,
    completedToday: true,
    frequency: "weekly",
    category: "Productivity",
  },
];

// ─── Mock Journal Entries ──────────────────────────────────────────

export const MOCK_JOURNAL: JournalEntry[] = [
  {
    id: "j-1",
    title: "Progress on the design system",
    excerpt:
      "Finally nailed the color palette. The cool-blue undertones feel exactly like Apple's aesthetic.",
    date: "2026-07-31",
    mood: "good",
  },
  {
    id: "j-2",
    title: "Docker configuration struggles",
    excerpt:
      "Spent 2 hours debugging a networking issue. Turns out it was a missing environment variable in docker-compose.",
    date: "2026-07-30",
    mood: "neutral",
  },
  {
    id: "j-3",
    title: "Sidebar finally works!",
    excerpt:
      "Got the Zustand sidebar store working perfectly. Desktop collapse, mobile overlay, keyboard shortcuts.",
    date: "2026-07-29",
    mood: "good",
  },
  {
    id: "j-4",
    title: "Interview prep anxiety",
    excerpt:
      "Feeling nervous about upcoming tech interviews. Need to review data structures and system design patterns.",
    date: "2026-07-28",
    mood: "low",
  },
];

// ─── Mock Notes ────────────────────────────────────────────────────

export const MOCK_NOTES: NoteItem[] = [
  {
    id: "n-1",
    title: "System design: URL shortener",
    excerpt:
      "Key considerations: hash function choice, database partitioning, cache strategy with Redis, rate limiting via token bucket.",
    updatedAt: "2026-07-31",
    tags: ["system-design", "interview"],
  },
  {
    id: "n-2",
    title: "React 19 patterns",
    excerpt:
      "Server components by default, `use client` only when needed. Server Actions replace API routes for mutations.",
    updatedAt: "2026-07-30",
    tags: ["react", "frontend"],
  },
  {
    id: "n-3",
    title: "Drizzle ORM quick reference",
    excerpt:
      "Schema definition with pgTable, relations with InferSelectModel, migrations with drizzle-kit.",
    updatedAt: "2026-07-29",
    tags: ["database", "backend"],
  },
  {
    id: "n-4",
    title: "Interview questions bank",
    excerpt: "Top 20 behavioral questions, STAR method template, technical question categories.",
    updatedAt: "2026-07-28",
    tags: ["interview", "career"],
  },
  {
    id: "n-5",
    title: "Design inspiration sources",
    excerpt:
      "Linear, Notion, Arc Browser, Apple HIG, Raycast, Vercel. Focus on minimalism, short transitions, generous whitespace.",
    updatedAt: "2026-07-27",
    tags: ["design", "reference"],
  },
];

// ─── Mock Projects ─────────────────────────────────────────────────

export const MOCK_PROJECTS: ProjectItem[] = [
  {
    id: "p-1",
    name: "LifeOS",
    description: "Personal operating system — full-stack portfolio project built with Next.js 15",
    progress: 40,
    status: "active",
    deadline: "2026-09-15",
    category: "full-stack",
  },
  {
    id: "p-2",
    name: "CS Thesis — Distributed Systems",
    description: "Research paper on consensus protocols in mesh environments",
    progress: 65,
    status: "active",
    deadline: "2026-08-30",
    category: "research",
  },
  {
    id: "p-3",
    name: "Portfolio Website",
    description: "Personal portfolio with project showcases and resume",
    progress: 10,
    status: "on-hold",
    deadline: "2026-10-01",
    category: "frontend",
  },
  {
    id: "p-4",
    name: "Algorithm Visualizer",
    description: "Interactive visualisation of sorting and graph algorithms",
    progress: 90,
    status: "completed",
    deadline: "2026-07-15",
    category: "education",
  },
];

// ─── Mock Goals ───────────────────────────────────────────────────────

export const MOCK_GOALS: GoalItem[] = [
  {
    id: "g-1",
    title: "Land a full-stack internship",
    description: "Apply to 30 companies, complete 15 technical interviews, secure 1 offer",
    progress: 45,
    target: 100,
    unit: "%",
    deadline: "2026-09-01",
    category: "career",
  },
  {
    id: "g-2",
    title: "Complete LifeOS MVP",
    description:
      "Finish Phase 3 (auth), Phase 4 (AI), Phase 5 (mobile) of the LifeOS project by December",
    progress: 25,
    target: 100,
    unit: "%",
    deadline: "2027-01-01",
    category: "project",
  },
  {
    id: "g-3",
    title: "Build 10 full-time projects deployed",
    description: "Deploy 10 polished projects to production in 2026 as portfolio pieces",
    progress: 10,
    target: 10,
    unit: "projects",
    deadline: "2027-01-01",
    category: "career",
  },
  {
    id: "g-4",
    title: "Learn AWS & Cloud Architecture",
    description: "Get comfortable with IAM, EC2, Lambda, S3, RDS, CloudFront, and CI/CD pipelines",
    progress: 20,
    target: 100,
    unit: "%",
    deadline: "2026-10-01",
    category: "learning",
  },
];

// ─── Mock Skills ───────────────────────────────────────────────────

export const MOCK_SKILLS: Skill[] = [
  {
    id: "s-1",
    name: "TypeScript",
    category: "programming",
    proficiency: 85,
    hours: 480,
    projects: 12,
    interviewReady: true,
  },
  {
    id: "s-2",
    name: "Python",
    category: "programming",
    proficiency: 70,
    hours: 250,
    projects: 8,
    interviewReady: true,
  },
  {
    id: "s-3",
    name: "Java",
    category: "programming",
    proficiency: 60,
    hours: 180,
    projects: 5,
    interviewReady: false,
  },
  {
    id: "s-4",
    name: "React & Next.js",
    category: "frontend",
    proficiency: 82,
    hours: 400,
    projects: 10,
    interviewReady: true,
  },
  {
    id: "s-5",
    name: "Tailwind CSS",
    category: "frontend",
    proficiency: 75,
    hours: 150,
    projects: 9,
    interviewReady: true,
  },
  {
    id: "s-6",
    name: "Node.js",
    category: "backend",
    proficiency: 78,
    hours: 320,
    projects: 8,
    interviewReady: true,
  },
  {
    id: "s-7",
    name: "PostgreSQL",
    category: "backend",
    proficiency: 68,
    hours: 180,
    projects: 6,
    interviewReady: true,
  },
  {
    id: "s-8",
    name: "Drizzle ORM",
    category: "backend",
    proficiency: 55,
    hours: 60,
    projects: 3,
    interviewReady: false,
  },
  {
    id: "s-9",
    name: "Docker",
    category: "cloud",
    proficiency: 62,
    hours: 120,
    projects: 4,
    interviewReady: false,
  },
  {
    id: "s-10",
    name: "AWS Basics",
    category: "cloud",
    proficiency: 40,
    hours: 80,
    projects: 2,
    interviewReady: false,
  },
  {
    id: "s-11",
    name: "Git & GitHub",
    category: "cloud",
    proficiency: 80,
    hours: 300,
    projects: 15,
    interviewReady: true,
  },
  {
    id: "s-12",
    name: "Communication",
    category: "soft-skills",
    proficiency: 75,
    hours: 50,
    projects: 3,
    interviewReady: true,
  },
  {
    id: "s-13",
    name: "System Design",
    category: "soft-skills",
    proficiency: 45,
    hours: 30,
    projects: 2,
    interviewReady: false,
  },
  {
    id: "s-14",
    name: "English",
    category: "languages",
    proficiency: 90,
    hours: 2000,
    projects: 50,
    interviewReady: true,
  },
  {
    id: "s-15",
    name: "French",
    category: "languages",
    proficiency: 25,
    hours: 40,
    projects: 1,
    interviewReady: false,
  },
];

export const SKILL_CATEGORIES: { id: SkillCategory | "all"; label: string }[] = [
  { id: "all", label: "All Skills" },
  { id: "programming", label: "Programming" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "cloud", label: "Cloud & DevOps" },
  { id: "soft-skills", label: "Soft Skills" },
  { id: "languages", label: "Languages" },
];

// ─── Mock Calendar Events ───────────────────────────────────────────

export const MOCK_EVENTS: CalendarEvent[] = [
  { id: "e-1", title: "System Design Review", date: "2026-07-31", time: "14:00", type: "meeting" },
  {
    id: "e-2",
    title: "Submit Project Milestone",
    date: "2026-08-01",
    time: "23:59",
    type: "deadline",
  },
  { id: "e-3", title: "Gym Session", date: "2026-08-01", time: "07:00", type: "health" },
  {
    id: "e-4",
    title: "Technical Interview — Acme Corp",
    date: "2026-08-02",
    time: "10:00",
    type: "meeting",
  },
  {
    id: "e-5",
    title: "Code Review with Mentor",
    date: "2026-08-03",
    time: "16:00",
    type: "meeting",
  },
  { id: "e-6", title: "Weekly Reflection", date: "2026-08-04", time: "18:00", type: "personal" },
];

// ─── Mock Interviews ────────────────────────────────────────────────

export const MOCK_INTERVIEWS: InterviewItem[] = [
  {
    id: "i-1",
    company: "Acme Corp",
    role: "Full-Stack Intern",
    date: "2026-08-05",
    status: "upcoming",
    notes: "Review REST API design and React patterns",
    round: "Technical Round 1",
  },
  {
    id: "i-2",
    company: "TechStart",
    role: "Software Engineer Intern",
    date: "2026-07-25",
    status: "completed",
    notes: "Went well — waiting for feedback",
    round: "HR Screening",
  },
  {
    id: "i-3",
    company: "CloudScale Inc",
    role: "Backend Intern",
    date: "2026-08-12",
    status: "upcoming",
    notes: "Prepare system design + database normalization questions",
    round: "System Design Round",
  },
];

// ─── Mock Expenses ──────────────────────────────────────────────────

export const MOCK_EXPENSES: ExpenseItem[] = [
  {
    id: "x-1",
    category: "Food",
    description: "Weekly groceries",
    amount: 350,
    date: "2026-07-31",
    type: "expense",
  },
  {
    id: "x-2",
    category: "Transport",
    description: "Monthly metro pass",
    amount: 600,
    date: "2026-07-01",
    type: "expense",
  },
  {
    id: "x-3",
    category: "Education",
    description: "AWS Certified Developer course",
    amount: 1200,
    date: "2026-07-28",
    type: "expense",
  },
  {
    id: "x-4",
    category: "Food",
    description: "Team lunch",
    amount: 250,
    date: "2026-07-27",
    type: "expense",
  },
  {
    id: "x-5",
    category: "Freelance",
    description: "Website redesign",
    amount: 4000,
    date: "2026-07-20",
    type: "income",
  },
  {
    id: "x-6",
    category: "Software",
    description: "Copilot subscription",
    amount: 850,
    date: "2026-07-05",
    type: "expense",
  },
  {
    id: "x-7",
    category: "Food",
    description: "Coffee & snacks",
    amount: 80,
    date: "2026-07-30",
    type: "expense",
  },
  {
    id: "x-8",
    category: "Learning",
    description: "System Design Interview book",
    amount: 450,
    date: "2026-07-15",
    type: "expense",
  },
];

// ─── Mock Resume Data ────────────────────────────────────────────────

export const MOCK_RESUME_SECTIONS: ResumeSection[] = [
  { name: "Personal Information", completion: 100, lastUpdated: "2026-07-15" },
  { name: "Education", completion: 100, lastUpdated: "2026-07-15" },
  { name: "Skills", completion: 90, lastUpdated: "2026-07-20" },
  { name: "Work Experience", completion: 70, lastUpdated: "2026-07-25" },
  { name: "Projects", completion: 60, lastUpdated: "2026-07-28" },
  { name: "Certifications", completion: 30, lastUpdated: "2026-07-10" },
];

// ─── Mock Activity Feed ─────────────────────────────────────────────

export const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: "a-1",
    action: "Updated LifeOS design system tokens",
    module: "projects",
    timestamp: "2026-07-31T14:30:00",
    iconName: "palette",
  },
  {
    id: "a-2",
    action: "Completed 'Morning meditation' habit",
    module: "habits",
    timestamp: "2026-07-31T07:00:00",
    iconName: "check",
  },
  {
    id: "a-3",
    action: "Added journal entry 'Progress on design'",
    module: "journal",
    timestamp: "2026-07-31T22:00:00",
    iconName: "bookOpen",
  },
  {
    id: "a-4",
    action: "Created note: 'System design URL shortener'",
    module: "notes",
    timestamp: "2026-07-30T16:00:00",
    iconName: "fileText",
  },
  {
    id: "a-5",
    action: "Completed task 'Fix TypeScript sidebar bug'",
    module: "tasks",
    timestamp: "2026-07-30T11:15:00",
    iconName: "checkSquare",
  },
  {
    id: "a-6",
    action: "Updated goal 'Land a full-stack internship'",
    module: "goals",
    timestamp: "2026-07-29T09:00:00",
    iconName: "target",
  },
  {
    id: "a-7",
    action: "Practiced Python — 2 hours",
    module: "skills",
    timestamp: "2026-07-29T08:00:00",
    iconName: "code2",
  },
  {
    id: "a-8",
    action: "Added expense: Course subscription",
    module: "expenses",
    timestamp: "2026-07-28T12:30:00",
    iconName: "dollarSign",
  },
  {
    id: "a-9",
    action: "Scheduled interview with Acme Corp",
    module: "interviews",
    timestamp: "2026-07-27T10:00:00",
    iconName: "briefcase",
  },
  {
    id: "a-10",
    action: "Updated resume: Work Experience section",
    module: "resume",
    timestamp: "2026-07-25T15:45:00",
    iconName: "fileUser",
  },
];

// ─── Mock Analytics ─────────────────────────────────────────────────

export const MOCK_ANALYTICS: AnalyticsData = {
  productivityScore: 78,
  tasksCompleted: 42,
  habitsMaintained: 28,
  journalStreak: 5,
  weeklyOverview: [
    { day: "Mon", tasksDone: 5, focusMinutes: 180 },
    { day: "Tue", tasksDone: 8, focusMinutes: 240 },
    { day: "Wed", tasksDone: 4, focusMinutes: 120 },
    { day: "Thu", tasksDone: 7, focusMinutes: 200 },
    { day: "Fri", tasksDone: 6, focusMinutes: 160 },
    { day: "Sat", tasksDone: 3, focusMinutes: 90 },
    { day: "Sun", tasksDone: 2, focusMinutes: 60 },
  ],
};

// ─── Mock Testimonials ──────────────────────────────────────────────

export const MOCK_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "tm-1",
    name: "Alex Chen",
    role: "Computer Science Student",
    quote: "My life is finally organized. LifeOS replaced three separate apps used every day.",
    avatar: "AC",
  },
  {
    id: "tm-2",
    name: "Sarah Johnson",
    role: "Junior Developer",
    quote:
      "I replaced Notion, Todoist, and Google Calendar with one tool. Everything in one place.",
    avatar: "SJ",
  },
  {
    id: "tm-3",
    name: "Marcus Rivera",
    role: "Full-Stack Engineer",
    quote: "The OS metaphor just makes sense. Each module works independently but together.",
    avatar: "MR",
  },
];

// ─── Roadmap Phases ────────────────────────────────────────────────

export const MOCK_ROADMAP: RoadmapPhase[] = [
  {
    phase: "Phase 1",
    title: "Foundation",
    status: "completed",
    items: [
      "TypeScript & Next.js 15 init",
      "Tailwind v4 design system",
      "Zustand sidebar",
      "AppShell layout",
    ],
  },
  {
    phase: "Phase 2",
    title: "Dashboard & Polish",
    status: "completed",
    items: ["Landing page polish", "Module empty states", "Skills module", "Shared components"],
  },
  {
    phase: "Phase 3",
    title: "Authentication",
    status: "upcoming",
    items: [
      "Better Auth integration",
      "OAuth providers",
      "Protected routes",
      "User profiles",
      "Session management",
    ],
  },
  {
    phase: "Phase 4",
    title: "Modules Engine",
    status: "upcoming",
    items: ["Tasks", "Habits", "Journal", "Projects", "Goals", "Analytics"],
  },
  {
    phase: "Phase 5",
    title: "AI Assistant",
    status: "upcoming",
    items: ["AI daily summaries", "Smart habit suggestions", "Journal sentiment analysis"],
  },
];

// ─── Feature Cards (Landing Page) ───────────────────────────────────

export const MOCK_FEATURES: FeatureCard[] = [
  {
    title: "Tasks",
    description: "Capture and prioritize — with due dates, priorities, and project groups.",
    iconName: "checkSquare",
    href: "/dashboard/tasks",
  },
  {
    title: "Habits",
    description: "Track streaks with visual momentum. Never break the chain.",
    iconName: "repeat",
    href: "/dashboard/habits",
  },
  {
    title: "Journal",
    description: "Daily reflection with mood tracking and rich-text entries.",
    iconName: "bookOpen",
    href: "/dashboard/journal",
  },
  {
    title: "Notes",
    description: "Second brain powered by markdown. Tag, search, link ideas.",
    iconName: "fileText",
    href: "/dashboard/notes",
  },
  {
    title: "Projects",
    description: "Manage progress across projects with timelines and deliverables.",
    iconName: "folders",
    href: "/dashboard/projects",
  },
  {
    title: "Goals",
    description: "OKR-inspired goals system. Break down into measurable progress.",
    iconName: "target",
    href: "/dashboard/goals",
  },
  {
    title: "Skills",
    description: "Track proficiency with visual progress for each technology.",
    iconName: "code2",
    href: "/dashboard/skills",
  },
  {
    title: "Calendar",
    description: "Events, deadlines, and meetings — one unified timeline.",
    iconName: "calendar",
    href: "/dashboard/calendar",
  },
  {
    title: "Resume",
    description: "Craft your resume incrementally with section-by-section progress.",
    iconName: "fileUser",
    href: "/dashboard/resume",
  },
  {
    title: "Interviews",
    description: "Prep tracker with company notes, dates, and confidence journal.",
    iconName: "briefcase",
    href: "/dashboard/interviews",
  },
  {
    title: "Expenses",
    description: "Simple income/expense tracking with monthly breakdowns.",
    iconName: "receipt",
    href: "/dashboard/expenses",
  },
];

// ─── Dashboard Stats Summary ────────────────────────────────────────

export const MOCK_DASHBOARD_STATS = {
  tasksDueToday: 2,
  tasksTotal: 6,
  habitsToComplete: 2,
  habitsStreak: 5,
  activeProjects: 3,
  skillsImproved: 4,
  interviewsScheduled: 2,
  expensesThisMonth: 3780,
  incomeThisMonth: 4000,
  recentNotes: 5,
  goalAverageProgress: 25,
};
