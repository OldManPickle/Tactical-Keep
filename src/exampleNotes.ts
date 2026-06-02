import { Task } from './types';
import { getWeekDateString, getRelativeISODate } from './lotrData';

export const generateFiftyExampleNotes = (): Task[] => {
  const templates = [
    // --- Urgent & Important (15 tasks) ---
    {
      title: "Fix Stripe Webhook Decryption Failure",
      description: "Critical payment gateway integration issue. Real-time subscription provisioning is failing for initial enterprise beta signups.",
      quadrant: "urgent-important",
      completed: false,
      color: "RED",
      tags: ["Billing", "Security", "Severe"],
      offset: 0
    },
    {
      title: "Deploy Production Hotfix for Auth Token Expiry",
      description: "OAuth refresh token flow is expiring after 15 minutes instead of 14 days. Re-authenticating active clients persistently.",
      quadrant: "urgent-important",
      completed: true,
      color: "RED",
      tags: ["Authentication", "Hotfix"],
      offset: -1
    },
    {
      title: "Coordinate App Store & Play Store Sandbox Submit",
      description: "Submit final release candidate build v1.2.0-RC4 for automated review cycles before public announcement on Thursday.",
      quadrant: "urgent-important",
      completed: false,
      color: "BLUE",
      tags: ["Mobile", "Release"],
      offset: 1
    },
    {
      title: "Review Pen-Testing Vulnerability Report",
      description: "Secure cross-site scripting (XSS) hazard discovered in query parameters of search analytics panel before public client hands-on.",
      quadrant: "urgent-important",
      completed: false,
      color: "RED",
      tags: ["Security", "Compliance"],
      offset: 2
    },
    {
      title: "Configure Production DNS records & CDN Rules",
      description: "Point custom domains to host ingress. Verify SSL certificate auto-renewals and setup cloudflare protection policies.",
      quadrant: "urgent-important",
      completed: true,
      color: "GREEN",
      tags: ["DevOps", "Infrastructure"],
      offset: -2
    },
    {
      title: "Migrate Cloud SQL Database Schema",
      description: "Execute schema updates for tenant database. Add composite indices to user groups to solve slowing load-times under heavy traffic.",
      quadrant: "urgent-important",
      completed: false,
      color: "DEFAULT",
      tags: ["Database", "Performance"],
      offset: 0
    },
    {
      title: "Address Legal Privacy Policy & GDPR Audits",
      description: "Publish final privacy framework, update CookieConsent terms, and verify legal disclaimer visibility in user settings footer.",
      quadrant: "urgent-important",
      completed: false,
      color: "BLUE",
      tags: ["Legal", "Compliance"],
      offset: 1
    },
    {
      title: "Patch Redis Memory Consumption Leak",
      description: "Investigate and resolve runaway memory allocation inside real-time socket sessions handling canvas collaboration.",
      quadrant: "urgent-important",
      completed: true,
      color: "RED",
      tags: ["Sysops", "Database"],
      offset: -3
    },
    {
      title: "Approve Enterprise SLA Agreement Contracts",
      description: "Complete formal signoff on final uptime, security, support response parameters for primary anchor client.",
      quadrant: "urgent-important",
      completed: false,
      color: "GREEN",
      tags: ["Legal", "Sales"],
      offset: 2
    },
    {
      title: "Resolve API Route Hydration Mismatch",
      description: "Fix layout breakage occurring on user profile views when SSR routes serve stale cached metadata fields.",
      quadrant: "urgent-important",
      completed: true,
      color: "DEFAULT",
      tags: ["Frontend", "Bug"],
      offset: -1
    },
    {
      title: "Setup Emergency Rollback Shell Scripts",
      description: "Formulate one-click deployment rollback protocols in GH actions pipeline to swiftly revert to stable production in case of disaster.",
      quadrant: "urgent-important",
      completed: false,
      color: "RED",
      tags: ["CI-CD", "DevOps"],
      offset: 0
    },
    {
      title: "Purchase Production Hosting Subscriptions",
      description: "Upgrade basic enterprise workspaces on cloud consoles; set up automatic credit alerts to prevent accidental service freezes.",
      quadrant: "urgent-important",
      completed: true,
      color: "GREEN",
      tags: ["Billing", "Management"],
      offset: -2
    },
    {
      title: "Conduct High-Load Stress Testing runs",
      description: "Saturate API endpoints with 20,000 requests/min. Analyze memory utilization thresholds under simulated scaling loops.",
      quadrant: "urgent-important",
      completed: false,
      color: "RED",
      tags: ["QA", "Scalability"],
      offset: 1
    },
    {
      title: "Secure Project Root Keys in Vault",
      description: "Audit environment variables. Transfer plain text stripe keys, smtp logins, and cloud account credentials into secure key store.",
      quadrant: "urgent-important",
      completed: false,
      color: "BLUE",
      tags: ["Security", "Keys"],
      offset: 3
    },
    {
      title: "Repair Front-end Sentry Logging integration",
      description: "Fix telemetry loop silently discarding runtime stack traces of safari mobile browsers in staging layout models.",
      quadrant: "urgent-important",
      completed: true,
      color: "DEFAULT",
      tags: ["Telemetry", "Frontend"],
      offset: -4
    },

    // --- Important but Not Urgent (15 tasks) ---
    {
      title: "Draft Long-Term Microservices Roadmap",
      description: "Architect the transition of high-throughput transactional logging from centralized monolith to modular micro-services.",
      quadrant: "important-not-urgent",
      completed: false,
      color: "BLUE",
      tags: ["Architecture", "Roadmap"],
      offset: 3
    },
    {
      title: "Refactor Legacy API Router Modules",
      description: "Simplify nested middleware controllers. Improve overall code readability, compile speed and error catching flow.",
      quadrant: "important-not-urgent",
      completed: true,
      color: "GREEN",
      tags: ["Refactoring", "CodeQuality"],
      offset: -1
    },
    {
      title: "Write End-to-End Cypress Integrations",
      description: "Formulate rigorous script flows verifying account creation, custom checkout, configuration presets, and team sharing settings.",
      quadrant: "important-not-urgent",
      completed: false,
      color: "DEFAULT",
      tags: ["QA", "Cypress"],
      offset: 4
    },
    {
      title: "Design Custom Developer REST API Docs",
      description: "Prepare comprehensive OpenAPI schema specifications. Document route payloads, error codes, and request token structures.",
      quadrant: "important-not-urgent",
      completed: false,
      color: "BLUE",
      tags: ["Documentation", "API"],
      offset: 5
    },
    {
      title: "Establish Automated DB Backup Routines",
      description: "Implement continuous physical database snapshots with daily retention intervals, stored in geographically separate fireproof cloud storage.",
      quadrant: "important-not-urgent",
      completed: true,
      color: "RED",
      tags: ["SecOps", "Reliability"],
      offset: -2
    },
    {
      title: "Perform Comprehensive SEO Keyword Audit",
      description: "Structure semantic tags, update meta-headers, and compile indexable schema-marks onto the public product marketing landing deck.",
      quadrant: "important-not-urgent",
      completed: false,
      color: "BLUE",
      tags: ["Marketing", "SEO"],
      offset: 3
    },
    {
      title: "Draft Internal Incident Response Manual",
      description: "Compile exact playbooks outlining team communication channels, diagnostic checklists, and customer service updates during global system downtime.",
      quadrant: "important-not-urgent",
      completed: false,
      color: "DEFAULT",
      tags: ["Operations", "SOP"],
      offset: 4
    },
    {
      title: "Optimize Large Web Assets & Fonts Loading",
      description: "Convert all stock graphics to high-compression WebP. Configure server-side static caching strategies to bring down home index load times.",
      quadrant: "important-not-urgent",
      completed: true,
      color: "GREEN",
      tags: ["Performance", "UX"],
      offset: -3
    },
    {
      title: "Outline Team KPI Performance Metric Trackers",
      description: "Draft balanced dashboard frameworks evaluating sprint velocity, bug count ratios, operational overhead, and customer resolution timings.",
      quadrant: "important-not-urgent",
      completed: false,
      color: "DEFAULT",
      tags: ["Strategy", "KPI"],
      offset: 5
    },
    {
      title: "Establish Code Linting & Format Pre-commits",
      description: "Set up strict ESLint, Prettier, and Husky Git hooks to enforce consistent syntactic style constraints across our coding team.",
      quadrant: "important-not-urgent",
      completed: true,
      color: "BLUE",
      tags: ["Refactoring", "CI-CD"],
      offset: -1
    },
    {
      title: "Interview Target Customers & Collect Insights",
      description: "Interview five active beta users extensively to isolate friction points inside current onboarding navigation layout and task form screens.",
      quadrant: "important-not-urgent",
      completed: false,
      color: "GREEN",
      tags: ["UserResearch", "Product"],
      offset: 3
    },
    {
      title: "Research Advanced AI LLM Grounding Tactics",
      description: "Evaluate modern vector indexes for context assembly. Strategize seamless expansion of AI summaries using the latest SDK models.",
      quadrant: "important-not-urgent",
      completed: false,
      color: "DEFAULT",
      tags: ["TechR&D", "AI-Integration"],
      offset: 6
    },
    {
      title: "Upgrade Node.js & Docker Base Instances",
      description: "Migrate environment images to safe Long-Term-Support (LTS) releases to gain massive performance boosts and eliminate library alerts.",
      quadrant: "important-not-urgent",
      completed: true,
      color: "RED",
      tags: ["DevOps", "Security"],
      offset: -4
    },
    {
      title: "Design Onboarding Dashboard Tour Guides",
      description: "Build clean step-by-step visual overlay tooltips showing first-time users how to assign tasks, configure priorities, and generate views.",
      quadrant: "important-not-urgent",
      completed: false,
      color: "BLUE",
      tags: ["UX-Design", "Onboarding"],
      offset: 4
    },
    {
      title: "Inventory Asset Subscriptions & Service Limits",
      description: "Compile spreadsheet evaluating third-party service costs (SendGrid, Twilio, Loggly, Auth0) to discover optimization areas.",
      quadrant: "important-not-urgent",
      completed: false,
      color: "DEFAULT",
      tags: ["Finance", "Audit"],
      offset: 5
    },

    // --- Urgent but Not Important (10 tasks) ---
    {
      title: "Respond to Cold Sales Requests on LinkedIn",
      description: "Acknowledge inbound agency messages with generic pre-written polite template answers. Flag high-tier service providers for later.",
      quadrant: "urgent-not-important",
      completed: false,
      color: "DEFAULT",
      tags: ["Networking", "Social"],
      offset: 0
    },
    {
      title: "Rearrange Jira Board Custom Columns",
      description: "Re-order secondary dashboard stages from 'Needs Testing' to 'Ready for QA verification' at product owner's specific request.",
      quadrant: "urgent-not-important",
      completed: true,
      color: "BLUE",
      tags: ["Administration", "Jira"],
      offset: -1
    },
    {
      title: "Format Weekly Team Standup Slides",
      description: "Copy-paste current bullet progress achievements into the slide presentation layout for our brief administrative meeting.",
      quadrant: "urgent-not-important",
      completed: false,
      color: "GREEN",
      tags: ["Management", "Deck"],
      offset: 1
    },
    {
      title: "Resolve Temporary Workspace Mailbox Spam",
      description: "Create outlook rules filtering out bulk system newsletters and automated hosting status summaries from main shared accounts.",
      quadrant: "urgent-not-important",
      completed: false,
      color: "DEFAULT",
      tags: ["Admin", "Email"],
      offset: 2
    },
    {
      title: "Clean Out Staged Docker Images in Sandbox",
      description: "Reclaim disk space on the virtual machine by purging redundant container cached images from earlier exploratory testing runs.",
      quadrant: "urgent-not-important",
      completed: true,
      color: "RED",
      tags: ["Sysops", "DevOps"],
      offset: -2
    },
    {
      title: "Moderate Beta Slack Community invites",
      description: "Sort incoming beta application requests. Ban spam profiles and dispatch official invite keys to registered developer accounts.",
      quadrant: "urgent-not-important",
      completed: false,
      color: "BLUE",
      tags: ["Community", "Moderation"],
      offset: 0
    },
    {
      title: "Prepare Slide Deck for Secondary Investors",
      description: "Condense long growth prospects into standard 12-slide template representing initial project scaling expectations.",
      quadrant: "urgent-not-important",
      completed: true,
      color: "DEFAULT",
      tags: ["Investing", "Deck"],
      offset: -1
    },
    {
      title: "Replace Stale Feature Icons on Pitch Deck",
      description: "Exchange the static vector shapes with matching vector items aligned to latest web layout branding guidelines.",
      quadrant: "urgent-not-important",
      completed: false,
      color: "GREEN",
      tags: ["Presentation", "Graphics"],
      offset: 1
    },
    {
      title: "Configure Automated Slack Success Alerts",
      description: "Connect standard webhooks that post a matching green emoji in the dev feed whenever a deployment build finishes successfully.",
      quadrant: "urgent-not-important",
      completed: true,
      color: "DEFAULT",
      tags: ["CI-CD", "Slack"],
      offset: -2
    },
    {
      title: "Update Project Status Spreadsheet",
      description: "Manually toggle cells to green status in administrative roadmap log sheets to appease operations desk requirements.",
      quadrant: "urgent-not-important",
      completed: false,
      color: "BLUE",
      tags: ["Admin", "Reports"],
      offset: 0
    },

    // --- Not Urgent & Not Important (10 tasks) ---
    {
      title: "Monitor Competitors' Font Selections",
      description: "Browse competing software directories and take notes of their landing typography style variations. Save screenshots to reference pool.",
      quadrant: "not-urgent-not-important",
      completed: false,
      color: "GREEN",
      tags: ["Research", "Snooping", "Leisure"],
      offset: 6
    },
    {
      title: "Re-organize Desktop Icon Folders & Files",
      description: "Tidy up development desktop workspace folder layouts. Label categories of temporary screenshots and obsolete pdf files.",
      quadrant: "not-urgent-not-important",
      completed: true,
      color: "BLUE",
      tags: ["Admin", "Organization"],
      offset: -5
    },
    {
      title: "Configure Desktop Theme Color Coordinate Schemes",
      description: "Adjust IDE settings, editor syntax coloring modules, and local desktop layouts to achieve perfect visual synergy.",
      quadrant: "not-urgent-not-important",
      completed: false,
      color: "DEFAULT",
      tags: ["Customization", "Leisure"],
      offset: 6
    },
    {
      title: "Design Custom Slack Team Animated Emojis",
      description: "Crop high-resolution product images to 64x64 format. Generate dynamic looping GIFs of team members with success indicators.",
      quadrant: "not-urgent-not-important",
      completed: false,
      color: "RED",
      tags: ["InternalCulture", "Fun"],
      offset: 5
    },
    {
      title: "Read Tech News Aggregators & Blog Logs",
      description: "Browse technical blogs, startup chronicles, and design guides on popular feeds during compile cycles.",
      quadrant: "not-urgent-not-important",
      completed: true,
      color: "GREEN",
      tags: ["Reading", "Education"],
      offset: -3
    },
    {
      title: "Debate Best Mascot Animal on Public Slack",
      description: "Participate in a long, friendly team threat argument debating whether our SaaS mascot should be a fox or a red panda.",
      quadrant: "not-urgent-not-important",
      completed: false,
      color: "BLUE",
      tags: ["Chitchat", "Culture"],
      offset: 6
    },
    {
      title: "Re-render Landing Page Logo Spinner",
      description: "Tweak svg rotation degrees by 0.5% in stylesheet to achieve a slightly smoother visual sweep effect that no user will ever notice.",
      quadrant: "not-urgent-not-important",
      completed: true,
      color: "DEFAULT",
      tags: ["NicheTweak", "UX"],
      offset: -4
    },
    {
      title: "Brainstorm Cryptic Project Name Monikers",
      description: "Draft an Excel ledger listing hypothetical futuristic names based on ancient celestial artifacts or Latin elements.",
      quadrant: "not-urgent-not-important",
      completed: false,
      color: "GREEN",
      tags: ["Brainstorm", "Idle"],
      offset: 5
    },
    {
      title: "Re-arrange Physical Desk Cable ties",
      description: "Zip-tie power adapters under the standing desk partition to minimize visible floor-level cable tangles.",
      quadrant: "not-urgent-not-important",
      completed: false,
      color: "DEFAULT",
      tags: ["Workspace", "Ergonomics"],
      offset: 6
    },
    {
      title: "Sort Custom Sticker Collections",
      description: "Arrange technical stickers into layout rows. Choose which graphic logos to place on the outer side of the new testing laptop.",
      quadrant: "not-urgent-not-important",
      completed: true,
      color: "DEFAULT",
      tags: ["Gear", "Hobby"],
      offset: -2
    }
  ];

  return templates.map((t, index) => {
    const id = `example-note-${Math.random().toString(36).substr(2, 9)}-${index + 1}`;
    const priority = 50 - index;
    const createdAt = getRelativeISODate(t.offset < 0 ? Math.abs(t.offset) : 0, index % 24);
    
    let completedAt: string | undefined;
    if (t.completed) {
      completedAt = getRelativeISODate(t.offset < 0 ? Math.abs(t.offset) : 0, (index * 2) % 24);
    }

    const scheduledDate = getWeekDateString(t.offset);

    return {
      id,
      title: t.title,
      description: t.description,
      quadrant: t.quadrant as any,
      completed: t.completed,
      color: t.color,
      priority,
      createdAt,
      completedAt,
      scheduledDate,
      tags: t.tags
    };
  });
};
