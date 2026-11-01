// Change branding, navigation, and articles here. The rest of the template follows.
export const siteConfig = {
  name: "Forma",
  description: "A little guidance. A world of possibilities.",
  home: "/docs",
  dashboardLabel: "Dashboard",
  tabs: [
    { label: "Help Center", href: "/docs", slug: "introduction" },
    { label: "Learning Center", href: "/docs/article/learning-center", slug: "learning-center" },
    { label: "API Reference", href: "/docs/article/api-overview", slug: "api-overview" },
    { label: "FAQs", href: "/docs/article/faq", slug: "faq" },
    { label: "Changelog", href: "/docs/article/changelog", slug: "changelog" },
  ],
};

export type IconName = "grid" | "link" | "users" | "sparkles" | "book" | "search" | "upload" | "file" | "globe" | "palette" | "type" | "layout" | "sliders" | "folder" | "clock" | "share" | "download" | "code" | "mail" | "shield" | "credit-card" | "help" | "zap" | "settings" | "check" | "terminal" | "bell" | "layers";

export interface ResourceCard {
  title: string;
  slug: string;
  icon: IconName;
  description?: string;
}

export interface CodeToken {
  content: string;
  color?: string;
  fontStyle?: number;
}

export type HighlightedCode = CodeToken[][];

export type ContentBlock =
  | { type: "callout"; tone: "info" | "tip" | "warning"; title?: string; text: string }
  | { type: "steps"; items: { title: string; text: string }[] }
  | { type: "code"; title?: string; language: string; code: string; highlightedCode?: HighlightedCode }
  | { type: "tabs"; items: { label: string; text: string; code?: string; language?: string; highlightedCode?: HighlightedCode }[] }
  | { type: "accordion"; items: { title: string; text: string }[] }
  | { type: "table"; columns: string[]; rows: string[][] };

export interface DocSection {
  id: string;
  title: string;
  description?: string;
  cards?: ResourceCard[];
  columns?: 2 | 3;
  blocks?: ContentBlock[];
}

export interface DocArticle {
  slug: string;
  title: string;
  group: string;
  description: string;
  tour?: boolean;
  sections: DocSection[];
}

const card = (title: string, slug: string, icon: IconName, description?: string): ResourceCard => ({ title, slug, icon, description });

const introduction: DocArticle = {
  slug: "introduction",
  title: "Introduction to Forma",
  group: "Getting Started",
  description: "Forma brings your projects, people, and ideas together in one place. Here’s everything you need to get started and make it your own.",
  tour: true,
  sections: [
    { id: "getting-started", title: "Getting Started", description: "Before starting your first project, create your account, personalize your workspace, and bring your team on board.", cards: [card("Set Up Your Workspace", "quickstart", "grid"), card("Connect Your Apps", "integrations", "link"), card("Invite Your Team", "team-management", "users")] },
    { id: "your-workspace", title: "Your Workspace", description: "A home for everything you’re working on. Learn the essentials, find your way around, and keep your best ideas moving.", cards: [card("Workspace Overview", "workspace-overview", "layout"), card("Projects and Collections", "projects", "folder"), card("Find What You Need", "search", "search")] },
    { id: "create-and-import", title: "Create and Import", description: "Start something new or bring your existing work with you. Import files, use a template, or build a project from scratch.", cards: [card("Create Your First Project", "create-project", "file"), card("Import Your Files", "import-files", "upload"), card("Supported File Types", "file-types", "layers")] },
    { id: "make-it-your-own", title: "Make It Your Own", description: "Make your workspace feel like home. Customize your brand, organize your content, and choose the way you like to work.", cards: [card("Add Your Logo and Fonts", "branding", "type"), card("Customize Appearance", "appearance", "palette"), card("Choose Your Layout", "layouts", "layout"), card("Workspace Preferences", "preferences", "sliders"), card("Use Project Templates", "templates", "grid")] },
    { id: "work-together", title: "Work Together", description: "Good work happens together. Give your team a shared space to collaborate, leave feedback, and keep everyone on the same page.", columns: 2, cards: [card("Manage Your Team", "team-management", "users"), card("Sharing and Permissions", "sharing", "share")] },
    { id: "organize-your-work", title: "Organize Your Work", description: "A little organization goes a long way. Keep projects tidy, find the right file, and make room for your next big idea.", cards: [card("Projects and Collections", "projects", "folder"), card("Search Your Workspace", "search", "search"), card("Save and Restore Versions", "version-history", "clock"), card("Manage Notifications", "notifications", "bell"), card("Keyboard Shortcuts", "keyboard-shortcuts", "terminal"), card("Workspace Settings", "preferences", "settings")] },
    { id: "share-and-publish", title: "Share and Publish", description: "Ready to share your work? Publish a project, create a shareable link, or invite someone to take a look.", cards: [card("Share Your Projects", "sharing", "share"), card("Publish to the Web", "publishing", "globe"), card("Manage Access", "permissions", "shield")] },
    { id: "export-your-work", title: "Export Your Work", description: "Your work goes where you go. Download projects in the format you need, or connect them to the tools you already use.", columns: 2, cards: [card("Download and Export", "exporting", "download"), card("Connect Your Tools", "integrations", "link")] },
    { id: "build-with-forma", title: "Build with Forma", description: "Connect your workflow with our API and integrations. Automate the everyday things so you can focus on what comes next.", columns: 2, cards: [card("Explore the API", "api-overview", "code"), card("Automate Your Workflow", "automations", "zap")] },
    { id: "more-resources", title: "More Resources", description: "A few more things to help you get the most out of Forma.", cards: [card("Account and Login", "account", "mail"), card("Plans and Billing", "billing", "credit-card"), card("Privacy and Security", "security", "shield"), card("Learning Center", "learning-center", "book"), card("Frequently Asked Questions", "faq", "help"), card("What’s New", "changelog", "sparkles")] },
  ],
};

interface GuideDefinition {
  slug: string;
  title: string;
  group: string;
  description: string;
  steps: [string, string][];
  tip: string;
  related?: ResourceCard[];
}

// These are example product docs. Replace the copy or add your own section blocks.
const guideDefinitions: GuideDefinition[] = [
  { slug: "quickstart", title: "Set Up Your Workspace", group: "Getting Started", description: "From a fresh start to your first project in just a few minutes.", steps: [["Create your workspace", "Choose a name for your workspace. Use your company, team, or personal name — you can always change it later in Settings."], ["Make it feel like you", "Add a workspace icon and select your preferred appearance. Your settings apply across all of your projects."], ["Bring your people", "Open Settings → Members and invite your teammates by email. Choose a role for each person before sending an invitation."], ["Create your first project", "Select New project, choose a blank canvas or a template, and give your project a name. You’re ready to go."]], tip: "Start with one project and a small team. You can add more structure as your workspace grows.", related: [card("Create Your First Project", "create-project", "file"), card("Invite Your Team", "team-management", "users")] },
  { slug: "account", title: "Account and Login", group: "Getting Started", description: "Manage your profile, sign in securely, and keep your account up to date.", steps: [["Sign in to your account", "Enter your email address on the sign-in screen. Open the verification email and follow the secure link to continue."], ["Update your profile", "Select your avatar → My account. You can update your display name, profile photo, and email address here."], ["Review your sessions", "Open Account → Security to see your active sessions. Sign out of devices you no longer use."]], tip: "If your sign-in email doesn’t arrive, check your spam folder and make sure the address is correct." },
  { slug: "workspace-overview", title: "Workspace Overview", group: "Your Workspace", description: "Get to know the space where your projects, people, and ideas come together.", steps: [["Your home", "Home shows your recent projects and the work shared with you. Pin the projects you open most often for quick access."], ["The sidebar", "Move between projects, collections, and shared spaces from the sidebar. Drag a project into a collection to keep related work together."], ["Workspace settings", "Select your workspace name to open settings, manage your team, or switch to another workspace."]], tip: "Press ⌘K on Mac or Ctrl K on Windows to find any project, collection, or setting." },
  { slug: "projects", title: "Projects and Collections", group: "Your Workspace", description: "Give every idea a place and keep related projects together.", steps: [["Create a collection", "Choose New collection from the sidebar. Give it a clear name, such as Marketing, Product, or Personal."], ["Add your projects", "Drag a project into the collection, or use the project’s Move to menu. Moving a project preserves its content and history."], ["Pin your favorites", "Open a project’s menu and select Add to favorites. Your favorites stay at the top of your sidebar."]], tip: "Use short, descriptive collection names so your whole team can find what they need." },
  { slug: "search", title: "Search Your Workspace", group: "Your Workspace", description: "Less looking, more doing. Find the right project, document, or person.", steps: [["Open search", "Click Search in the sidebar or press ⌘K / Ctrl K. Begin typing a project name, keyword, or teammate’s name."], ["Narrow your results", "Use filters to search by collection, owner, or last updated date. Combine filters to make larger workspaces easier to navigate."], ["Jump to a result", "Use the arrow keys to move through results, then press Enter to open the selected item."]], tip: "Search matches words in project titles and content, so you don’t need to remember an exact name." },
  { slug: "create-project", title: "Create Your First Project", group: "Create and Import", description: "Turn a blank canvas into the start of something great.", steps: [["Start a new project", "Select New project from your workspace home. Choose Blank project to start fresh, or browse templates for a head start."], ["Add your content", "Give your project a title, then add text, files, and links. Drag content to rearrange it into the order that works for you."], ["Save and share", "Changes save automatically as you work. Select Share when you’re ready to invite others into your project."]], tip: "You can duplicate any existing project from its menu to reuse its structure and content." },
  { slug: "import-files", title: "Import Your Files", group: "Create and Import", description: "Bring your existing work into Forma without starting over.", steps: [["Choose your files", "Open a project and choose Import from the toolbar. Select files from your computer, or drag them into the project."], ["Review the import", "Forma checks the file type and shows a preview. You can import multiple files together and organize them afterward."], ["Organize your content", "Rename the imported items, add them to a collection, and invite your teammates to collaborate."]], tip: "Keep an original copy of your files. Some formatting may change when importing between different tools.", related: [card("Supported File Types", "file-types", "layers"), card("Projects and Collections", "projects", "folder")] },
  { slug: "branding", title: "Add Your Logo and Fonts", group: "Customization", description: "Bring your brand into every project with a shared visual identity.", steps: [["Upload your logo", "Open Settings → Branding and upload a square SVG or PNG. For the sharpest result, use an image at least 256 × 256 pixels."], ["Set your colors", "Add your brand’s primary color. Forma uses this for shared project accents and published pages."], ["Choose your typography", "Choose a typeface for headings and body text. Preview your choices before applying them to the workspace."]], tip: "Use a transparent SVG logo for crisp results on both light and dark backgrounds." },
  { slug: "appearance", title: "Customize Appearance", group: "Customization", description: "Choose the look that helps you do your best work.", steps: [["Choose your theme", "Open your profile menu and choose Appearance. Select Light, Dark, or System to follow your device’s preferences."], ["Personalize your workspace", "Add a workspace icon and cover image under Settings → General. These help distinguish between multiple workspaces."], ["Preview your changes", "Check your workspace in both light and dark themes to make sure your brand stays easy to recognize."]], tip: "Theme preferences are personal. Changing your appearance won’t change the theme for your teammates." },
  { slug: "layouts", title: "Choose Your Layout", group: "Customization", description: "Find the right perspective for the work in front of you.", steps: [["Open the view menu", "At the top of a collection, select the view switcher. Choose Grid for visual browsing or List for a compact overview."], ["Sort your projects", "Sort by name, creation date, or last updated. Choose ascending or descending order from the sort menu."], ["Keep a useful default", "Your selected view is remembered for the next time you open the collection."]], tip: "Grid view works well for visual projects. List view helps when you want to scan many titles quickly." },
  { slug: "preferences", title: "Workspace Preferences", group: "Customization", description: "Adjust the everyday details to fit the way your team works.", steps: [["Open workspace settings", "Select your workspace name in the sidebar, then choose Settings. Only owners and admins can change workspace-wide preferences."], ["Set your defaults", "Choose your timezone, week start, default project access, and preferred language."], ["Review changes", "Check your settings, then select Save changes. New defaults apply to projects created after the update."]], tip: "Set the workspace timezone before scheduling published content or automated workflows." },
  { slug: "templates", title: "Use Project Templates", group: "Customization", description: "Skip the repetitive setup and start with a little structure.", steps: [["Browse templates", "Select New project → Use a template. Browse by category, or search for the kind of project you’re starting."], ["Make it your own", "Replace the example text, adjust the sections, and add your own files. Changes affect your project, not the original template."], ["Create a team template", "Open any project’s menu and choose Save as template to share its structure with your workspace."]], tip: "A good template includes short instructions so teammates know what to put in each section." },
  { slug: "team-management", title: "Invite Your Team", group: "Collaboration", description: "Bring everyone together in a workspace that’s built for shared work.", steps: [["Open the members page", "Go to Settings → Members. You’ll see your current teammates, their roles, and any pending invitations."], ["Send an invitation", "Select Invite members, enter email addresses, and choose a role. You can invite several people at once."], ["Manage your team", "Use the menu beside a member’s name to change their role or remove their workspace access."]], tip: "Give each person the lowest level of access they need. You can adjust their role at any time.", related: [card("Sharing and Permissions", "sharing", "share"), card("Manage Access", "permissions", "shield")] },
  { slug: "sharing", title: "Sharing and Permissions", group: "Collaboration", description: "Share your work with the right people, with the right level of access.", steps: [["Open sharing settings", "Select Share in the upper-right corner of your project. Review who already has access."], ["Invite a person or team", "Enter an email address and choose Can view, Can comment, or Can edit. Add a message if you’d like."], ["Create a shareable link", "Choose Copy link to share with existing members. To share publicly, enable Anyone with the link in the access settings."]], tip: "Projects are private until you share them. Public links can be disabled at any time." },
  { slug: "permissions", title: "Manage Access", group: "Collaboration", description: "Understand workspace roles and keep your projects in the right hands.", steps: [["Review workspace roles", "Owners manage billing and the workspace. Admins manage members and settings. Members create and collaborate on projects."], ["Set project permissions", "Project owners can choose who can view, comment, or edit. These permissions can be more restrictive than workspace access."], ["Review access regularly", "Remove unused invitations and update permissions when a teammate changes roles or leaves the team."]], tip: "Removing a member revokes their access to private workspace projects. Review any public links separately." },
  { slug: "version-history", title: "Save and Restore Versions", group: "Organize Your Work", description: "Work with confidence knowing you can always look back.", steps: [["Open version history", "From your project’s menu, select Version history. Versions appear in chronological order with the author and time."], ["Compare a version", "Select an earlier entry to preview its content. Your current work stays unchanged while you browse."], ["Restore your work", "Choose Restore this version to bring it back. A new history entry is created so you can undo the restoration later."]], tip: "Give important versions a name, such as Approved draft, so they’re easier to find later." },
  { slug: "notifications", title: "Manage Notifications", group: "Organize Your Work", description: "Stay in the loop without losing your focus.", steps: [["Open your preferences", "Select your avatar → Notifications. Notification preferences apply to your account across all workspaces."], ["Choose what reaches you", "Turn email and in-app notifications on or off for mentions, comments, invitations, and project updates."], ["Follow specific projects", "Use Follow in a project’s menu to receive updates. Unfollow when you no longer need every change."]], tip: "Keep mention notifications enabled so you don’t miss requests that need your attention." },
  { slug: "publishing", title: "Publish to the Web", group: "Share and Export", description: "Give your project a home on the web with a shareable public page.", steps: [["Prepare your project", "Review your content and remove any private information before publishing. Use Preview to see the visitor experience."], ["Publish your page", "Select Share → Publish to web. Choose a page title and enable search engine indexing only if you want the page to be discoverable."], ["Keep it up to date", "Select Publish changes after editing. You can unpublish at any time from the same menu."]], tip: "Always open the published link in a private browser window to check what visitors can see." },
  { slug: "exporting", title: "Download and Export", group: "Share and Export", description: "Take your work with you in a format that fits your next step.", steps: [["Choose what to export", "Open a project, select its menu, and choose Export. You can export a whole project or selected content."], ["Select a format", "Choose PDF for sharing, Markdown for portable text, or ZIP to include your original attachments."], ["Download your file", "Select Export and wait for the download to finish. Larger projects may take a little longer to prepare."]], tip: "PDF exports preserve your project’s layout. Markdown is better when you plan to keep editing in another tool." },
  { slug: "integrations", title: "Connect Your Apps", group: "Developers", description: "Keep your tools in sync and bring your workflow together.", steps: [["Find your integration", "Open Settings → Integrations and browse the available connections. Choose an app to see what it can access."], ["Authorize the connection", "Select Connect and sign in to the app. Review the permissions before authorizing access."], ["Choose what to sync", "Pick the projects or collections you want to connect. You can pause or disconnect an integration at any time."]], tip: "Use a shared team account for important integrations so connections don’t depend on a single person." },
  { slug: "automations", title: "Automate Your Workflow", group: "Developers", description: "Let the routine work take care of itself with simple, predictable automations.", steps: [["Choose a trigger", "Create an automation from Settings → Automations. Choose an event, such as a new project or an updated status."], ["Add an action", "Decide what should happen next: send a notification, move a project, or call a connected app."], ["Test and enable", "Run the automation with a sample project, check the result, then enable it for your workspace."]], tip: "Start with one trigger and one action. Add conditions after you’ve confirmed the basic workflow works." },
  { slug: "billing", title: "Plans and Billing", group: "Account and Billing", description: "Understand your plan and keep your workspace’s billing details current.", steps: [["See your current plan", "Workspace owners can open Settings → Billing to review the plan, member count, and next renewal date."], ["Update payment details", "Select Manage billing to update your payment method, billing address, or tax information."], ["Download an invoice", "Find the payment in Billing history and select Download invoice. Previous invoices remain available in your account."]], tip: "Plan and payment changes can only be made by a workspace owner." },
  { slug: "security", title: "Privacy and Security", group: "Account and Billing", description: "Practical steps to keep your account and your team’s work secure.", steps: [["Protect your account", "Use a unique password with your sign-in provider and enable two-factor authentication whenever available."], ["Keep access intentional", "Review members and project sharing regularly. Disable public links that are no longer needed."], ["Manage connected apps", "Check Settings → Integrations for apps with workspace access. Disconnect tools you no longer use."]], tip: "These are example documentation guidelines. Add your product’s actual security policies and data handling practices before publishing." },
];

function buildGuide(guide: GuideDefinition): DocArticle {
  return {
    slug: guide.slug, title: guide.title, group: guide.group, description: guide.description,
    sections: [
      { id: "before-you-begin", title: "Before You Begin", description: `You’ll need a Forma account and access to a workspace. ${guide.slug === "quickstart" ? "If you’re new here, the steps below will help you set everything up." : "If you’re working in a team, some settings may require an owner or admin role."}`, blocks: [{ type: "callout", tone: "info", title: "Keep your work in the right place", text: "If you belong to more than one workspace, check the workspace name in the sidebar before making changes." }] },
      { id: "step-by-step", title: "Step by Step", blocks: [{ type: "steps", items: guide.steps.map(([title, text]) => ({ title, text })) }] },
      { id: "good-to-know", title: "Good to Know", blocks: [{ type: "callout", tone: "tip", title: "A helpful tip", text: guide.tip }, { type: "accordion", items: [{ title: "Who can change these settings?", text: "You can manage your own account preferences. Workspace-wide settings require an owner or admin role; project settings require edit access." }, { title: "Will this affect my existing projects?", text: "Personal preferences apply to your account. Workspace defaults apply to new projects; changes to a specific project only affect that project." }] }] },
      { id: "whats-next", title: "What’s Next?", description: "Keep exploring with these related guides.", columns: 2, cards: guide.related ?? [card("Workspace Overview", "workspace-overview", "layout"), card("Frequently Asked Questions", "faq", "help")] },
    ],
  };
}

const specialArticles: DocArticle[] = [
  { slug: "file-types", title: "Supported File Types", group: "Create and Import", description: "A quick reference for bringing your content into your workspace.", sections: [
    { id: "supported-formats", title: "Supported Formats", description: "Choose the format that best fits the content you’re importing.", blocks: [{ type: "table", columns: ["Content", "Formats", "Best for"], rows: [["Documents", ".md, .txt, .pdf", "Notes, guides, and reference material"], ["Images", ".png, .jpg, .webp, .svg", "Visuals, logos, and screenshots"], ["Data", ".csv, .json", "Structured data and project lists"], ["Archives", ".zip", "Multiple files and attachments"]] }] },
    { id: "importing", title: "Importing Your Content", description: "Drag a supported file into any project, or select Import in the project toolbar. You’ll see a preview before the content is added.", blocks: [{ type: "callout", tone: "warning", title: "Check your files first", text: "Password-protected or damaged files can’t be imported. Remove password protection and verify that the file opens correctly on your device." }] },
    { id: "next-steps", title: "Next Steps", columns: 2, cards: [card("Import Your Files", "import-files", "upload"), card("Create Your First Project", "create-project", "file")] },
  ] },
  { slug: "keyboard-shortcuts", title: "Keyboard Shortcuts", group: "Organize Your Work", description: "Small shortcuts that make room for a little more flow.", sections: [
    { id: "navigation", title: "Navigation", blocks: [{ type: "tabs", items: [{ label: "macOS", text: "Use Command (⌘) for the shortcuts below. Open search with ⌘ K, move through results with ↑ and ↓, then press Return." }, { label: "Windows & Linux", text: "Use Control for the shortcuts below. Open search with Ctrl K, move through results with ↑ and ↓, then press Enter." }] }, { type: "table", columns: ["Action", "macOS", "Windows"], rows: [["Open search", "⌘ K", "Ctrl K"], ["Close a dialog", "Esc", "Esc"], ["Move between controls", "Tab", "Tab"], ["Select previous control", "⇧ Tab", "Shift Tab"], ["Open focused link", "Return", "Enter"]] }] },
    { id: "accessibility", title: "Make Yourself at Home", description: "All navigation and article controls work with a keyboard. Use Tab to move between links and buttons, and press Enter or Space to activate a control.", blocks: [{ type: "callout", tone: "tip", text: "Press Tab when a page first loads to reveal the Skip to content link." }] },
  ] },
  { slug: "api-overview", title: "API Overview", group: "Developers", description: "Build your own connections. Explore the shape of an API integration with this example reference.", sections: [
    { id: "introduction", title: "Introduction", description: "This reference demonstrates an API documentation layout with authentication, request examples, and response tables. The endpoints below are illustrative and don’t connect to a live service.", blocks: [{ type: "callout", tone: "info", title: "Example API", text: "Replace the example URL, endpoints, and credentials with your product’s API before publishing." }] },
    { id: "authentication", title: "Authentication", description: "Include an API key as a Bearer token in the Authorization header. Store keys securely and avoid including them in browser-side code.", blocks: [{ type: "code", language: "HTTP", code: "Authorization: Bearer YOUR_API_KEY\nContent-Type: application/json" }] },
    { id: "your-first-request", title: "Your First Request", description: "Use the projects endpoint to list the projects available to your workspace.", blocks: [{ type: "tabs", items: [{ label: "cURL", text: "Run this request from your terminal.", code: "curl https://api.example.com/v1/projects \\\n  -H \"Authorization: Bearer YOUR_API_KEY\"" }, { label: "JavaScript", text: "Use fetch in your server-side application.", code: "const response = await fetch(\n  'https://api.example.com/v1/projects',\n  { headers: { Authorization: `Bearer ${apiKey}` } }\n);\nconst { data } = await response.json();" }, { label: "Python", text: "Use your preferred HTTP client.", code: "import requests\n\nresponse = requests.get(\n    'https://api.example.com/v1/projects',\n    headers={'Authorization': f'Bearer {api_key}'}\n)\nprojects = response.json()['data']" }] }] },
    { id: "response", title: "Response", blocks: [{ type: "code", title: "200 OK", language: "JSON", code: '{\n  "data": [\n    {\n      "id": "project_01",\n      "name": "A fresh start",\n      "status": "active"\n    }\n  ],\n  "has_more": false\n}' }, { type: "table", columns: ["Field", "Type", "Description"], rows: [["id", "string", "Unique project identifier"], ["name", "string", "Project display name"], ["status", "string", "active or archived"], ["has_more", "boolean", "Whether more results are available"]] }] },
    { id: "errors", title: "Error Handling", blocks: [{ type: "accordion", items: [{ title: "401 — Unauthorized", text: "Check that your Authorization header includes a valid API key. If the key was rotated, update it in your application." }, { title: "403 — Forbidden", text: "The key is valid but doesn’t have permission to access this resource. Review the key’s workspace role and scopes." }, { title: "429 — Too many requests", text: "Slow down and retry after the period specified in the Retry-After response header. Use exponential backoff for repeated failures." }] }] },
  ] },
  { slug: "faq", title: "Frequently Asked Questions", group: "Resources", description: "A few answers to the things you might be wondering about.", sections: [
    { id: "getting-started", title: "Getting Started", blocks: [{ type: "accordion", items: [{ title: "What is Forma?", text: "Forma is a fictional workspace product used throughout this reusable documentation template. The articles demonstrate how to organize product documentation with clear guides and shared components." }, { title: "Where should I begin?", text: "Start with Set Up Your Workspace for a guided introduction, or browse the resource cards on the Help Center homepage." }, { title: "Can I use this documentation on mobile?", text: "Yes. Open the navigation menu below the header to browse articles. Search and all article components also work on small screens." }] }] },
    { id: "your-workspace", title: "Your Workspace", blocks: [{ type: "accordion", items: [{ title: "Can I work with a team?", text: "The example guides show member invitations, roles, and project permissions. Use these layouts to document the collaboration features in your own product." }, { title: "How do I find an article?", text: "Click Search in the header or press Ctrl K / ⌘ K. Search matches article titles, descriptions, section headings, and article text." }, { title: "Is there a dark theme?", text: "Yes. Select the appearance control in the header and choose Light, Dark, or System. Your preference is saved in this browser." }] }] },
    { id: "account-and-billing", title: "Account and Billing", blocks: [{ type: "accordion", items: [{ title: "Where can I manage my subscription?", text: "See Plans and Billing for an example of a billing guide. Forma is a demo product and doesn’t charge for any subscription." }, { title: "How do I manage my data?", text: "The Download and Export guide demonstrates export documentation, while Privacy and Security covers example account safety practices. Replace these with your product’s actual policies." }] }] },
  ] },
  { slug: "learning-center", title: "A Little Learning Goes a Long Way", group: "Resources", description: "Practical guides to help you find your flow, from your very first project to a workspace that works for everyone.", tour: true, sections: [
    { id: "start-with-the-basics", title: "Start with the Basics", columns: 2, cards: [card("Your First Five Minutes", "quickstart", "sparkles", "Get comfortable, set things up, and make yourself at home."), card("Create Something New", "create-project", "file", "Go from an idea to your first project.")] },
    { id: "better-together", title: "Better Together", columns: 2, cards: [card("Build Your Team’s Home", "team-management", "users", "Bring the right people into the conversation."), card("A Place for Everything", "projects", "folder", "Create a little clarity in your everyday work.")] },
    { id: "go-a-little-further", title: "Go a Little Further", columns: 2, cards: [card("Make It Your Own", "branding", "palette", "Put your team’s personality into your workspace."), card("Connect the Dots", "automations", "zap", "Save time with a few thoughtful automations.")] },
  ] },
  { slug: "changelog", title: "What’s New", group: "Resources", description: "Small improvements, new possibilities. Here’s what’s happening in Forma.", sections: [
    { id: "a-more-comfortable-workspace", title: "A More Comfortable Workspace", description: "October 24, 2026 · Example release", blocks: [{ type: "callout", tone: "tip", title: "New: a theme for every moment", text: "Switch between Light, Dark, and System appearance. Your choice follows you through the documentation and stays saved for your next visit." }], cards: [card("Explore Appearance", "appearance", "palette")] },
    { id: "find-your-flow", title: "Find Your Flow", description: "October 10, 2026 · Example release", blocks: [{ type: "steps", items: [{ title: "Faster navigation", text: "Search the documentation from anywhere with ⌘K or Ctrl K. Use arrow keys to select a result and Enter to open it." }, { title: "A better experience on the go", text: "The navigation drawer and responsive article layouts make the Help Center easier to use on mobile." }, { title: "More helpful articles", text: "New guides cover API integrations, project organization, and team access." }] }] },
  ] },
];

export const articles: DocArticle[] = [introduction, ...guideDefinitions.map(buildGuide), ...specialArticles];

export const navigation = [
  { title: "Getting Started", slugs: ["introduction", "quickstart", "account"] },
  { title: "Your Workspace", slugs: ["workspace-overview", "projects", "search"] },
  { title: "Create and Import", slugs: ["create-project", "import-files", "file-types"] },
  { title: "Customization", slugs: ["branding", "appearance", "layouts", "preferences", "templates"] },
  { title: "Collaboration", slugs: ["team-management", "sharing", "permissions"] },
  { title: "Organize Your Work", slugs: ["version-history", "notifications", "keyboard-shortcuts"] },
  { title: "Share and Export", slugs: ["publishing", "exporting"] },
  { title: "Developers", slugs: ["api-overview", "integrations", "automations"] },
  { title: "Account and Billing", slugs: ["billing", "security"] },
  { title: "Resources", slugs: ["learning-center", "faq", "changelog"] },
];

export function getArticle(slug: string) {
  return articles.find(article => article.slug === (slug === "introduction-to-opusclip" ? "introduction" : slug));
}

export function articleHref(slug: string) {
  return slug === "introduction" ? "/docs" : `/docs/article/${slug}`;
}
