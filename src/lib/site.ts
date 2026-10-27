// Profile copy in one place. LinkedIn and GitHub stay hidden until they are filled in.
export const RESUME_HREF = "/resume/Vishula-Gamaetige-Resume.pdf";

export const SITE = {
  name: "Vish",
  fullName: "Vishula Gamaetige",
  year: 2026,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  role: "Systems Administrator → Cloud & Systems Engineer",
  pitch: "Five years in IT across managed services, local government and healthcare. I keep Microsoft 365, Intune and hybrid infrastructure secure, tidy and boring.",
  email: "vpgamaetige@gmail.com",
  linkedin: "https://www.linkedin.com/in/vishula-gamaetige-aab039126/",
  github: "",
  location: "Brisbane, Australia",
  status: "Open to cloud and systems engineering conversations",
};

// About statement: "accent" phrases are highlighted in blue, "muted" fades to grey.
export const ABOUT: { text: string; tone?: "accent" | "muted" }[] = [
  { text: "Systems Administrator with 5+ years across " },
  { text: "managed services, local and state government", tone: "accent" },
  { text: " and " },
  { text: "healthcare.", tone: "accent" },
  { text: " I administer and secure Microsoft 365 and Entra ID across multiple client tenants, investigate and contain email-borne incidents, and automate administration with PowerShell and Microsoft Graph. Now pursuing " },
  { text: "Microsoft Azure", tone: "accent" },
  { text: " certification on the " },
  { text: "path to systems and cloud engineering.", tone: "muted" },
];

export const TOOLS: { group: string; icon: string; items: string[] }[] = [
  { group: "Identity and Access", icon: "Lock", items: ["Entra ID", "PIM", "Conditional Access", "App Registrations", "Azure RBAC", "Active Directory", "Duo MFA"] },
  { group: "Microsoft 365", icon: "CloudUpload", items: ["Exchange Online", "SharePoint Online", "OneDrive", "Intune", "Teams Rooms"] },
  { group: "Security", icon: "ShieldCheck", items: ["Microsoft Defender", "Microsoft Purview", "SentinelOne", "Bitdefender", "Barracuda", "Mail Assure", "SPF / DKIM / DMARC"] },
  { group: "Automation", icon: "SquareTerminal", items: ["PowerShell", "Microsoft Graph", "PnP PowerShell", "Python", "WP-CLI"] },
  { group: "Servers and Hosting", icon: "Server", items: ["Windows Server", "Remote Desktop Services", "SQL Server / SSMS", "Linux / SSH", "WHM / cPanel", "MySQL", "WordPress"] },
  { group: "Networking", icon: "Network", items: ["UniFi", "Cisco", "WireGuard VPN", "DNS", "DHCP", "VLANs", "Cloudflare", "Synology NAS"] },
  { group: "Backup and Recovery", icon: "RotateCw", items: ["ShadowProtect SPX", "Cove Backup", "VSS", "Macrium Reflect", "Robocopy"] },
  { group: "Support and RMM", icon: "MonitorPlay", items: ["N-central", "SCCM / MECM", "ServiceNow", "RepairShopr", "ConnectWise", "Splashtop", "TeamViewer"] },
];

export const EXPERIENCE: { title: string; company: string; dates: string; sector: string; bullets: string[]; tools: string[] }[] = [
  {
    title: "Systems Administrator",
    company: "OJ Networks · Sunshine Coast",
    dates: "2025 – Present",
    sector: "Managed services",
    bullets: [
      "Administer Microsoft 365, Entra ID, Exchange Online and SharePoint across multiple client tenants, covering user lifecycle, licensing, access and mail flow.",
      "Investigate and contain security incidents, including Business Email Compromise and spoofing, using Entra ID sign-in and audit logs, SPF/DKIM/DMARC and Exchange mail flow rules.",
      "Strengthen identity security by removing excess admin roles, applying PIM best practices, enforcing MFA and configuring Entra ID app registrations for OAuth authentication.",
      "Automate administration and reporting with PowerShell (Exchange Online, SharePoint Online, Microsoft Graph), producing audit-ready access reviews for client sign-off.",
    ],
    tools: ["Microsoft 365", "Entra ID", "PIM", "Conditional Access", "Azure RBAC", "Purview", "Defender", "PowerShell", "Windows Server", "SentinelOne", "N-central", "UniFi", "Cloudflare"],
  },
  {
    title: "Senior Deployment Technician",
    company: "Sunshine Coast University Hospital · Sunshine Coast",
    dates: "2025 – Present",
    sector: "State government · Health",
    bullets: [
      "Deliver Level 1 and 2 on-site and remote ICT support across clinical and non-clinical environments.",
      "Configure, deploy and maintain end-user computing environments and enterprise applications in line with MOE standards.",
      "Support enterprise infrastructure by troubleshooting Active Directory, SCCM, DHCP and network connectivity issues.",
      "Support project deployments and hardware refresh programs, ensuring minimal disruption to clinical operations.",
    ],
    tools: ["ServiceNow", "Active Directory", "SCCM / MECM", "DHCP", "Cisco DNA Spaces"],
  },
  {
    title: "IT Service Support Officer",
    company: "Townsville City Council · Townsville",
    dates: "2022 – 2025",
    sector: "Local government",
    bullets: [
      "Provided Level 1 and 2 support for 1,800+ staff using ServiceNow, phone, in-person and remote tools, resolving 90% of tickets within SLA.",
      "Managed user accounts and permissions in Active Directory, Exchange Online and Microsoft 365.",
      "Administered Intune MDM for 500+ mobile devices, handling enrolment, configuration and security policies.",
      "Supported Microsoft Teams Rooms and Cisco AV systems.",
    ],
    tools: ["ServiceNow", "Active Directory", "Exchange Online", "Microsoft 365", "Intune", "SCCM / MECM", "Dameware", "Teams Rooms"],
  },
  {
    title: "IT Asset Officer",
    company: "Townsville City Council · Townsville",
    dates: "2024 – 2025",
    sector: "Local government",
    bullets: [
      "Managed the full IT asset lifecycle for 5,000+ IT assets, overseeing procurement, tracking and decommissioning in line with council policy.",
      "Maintained and optimised IT and financial asset registers, improving reporting accuracy by 20%.",
      "Worked with IT team managers on cost-effective asset management strategies, reducing unnecessary spending by 10%.",
      "Educated 100+ stakeholders on IT asset processes, improving compliance with asset policies.",
    ],
    tools: ["ServiceNow (Asset Management / CMDB)", "TechnologyOne", "Microsoft Excel"],
  },
  {
    title: "Project System Representative",
    company: "Department of Transport and Main Roads · Cloncurry",
    dates: "2021 – 2022",
    sector: "State government",
    bullets: [
      "Managed quality control, audits and risk assessments in CivilPro, maintaining full compliance with TMR quality and safety standards.",
      "Coordinated resources and fieldwork (road elevations, site measurements, soil testing), improving efficiency and keeping project data accurate.",
      "Collaborated with subcontractors and public stakeholders to keep work sites safe.",
    ],
    tools: ["CivilPro"],
  },
  {
    title: "IT Technician",
    company: "MIITS / XCDIT · Mount Isa",
    dates: "2020 – 2021",
    sector: "Managed services",
    bullets: [
      "Deployed and configured IT infrastructure at remote mine sites, setting up routers, switches and WAPs.",
      "Provided Tier 2 IT support, resolving 90% of software, server and remote access issues.",
      "Migrated 5+ businesses from on-premises to cloud, and installed and configured 10+ small-business environments.",
      "Managed network services including DNS, DHCP and VLANs.",
      "Created 50+ knowledge base articles and guides to improve IT support efficiency.",
    ],
    tools: ["Cisco", "Ubiquiti", "DNS", "DHCP", "VLANs", "Microsoft 365 migrations", "ConnectWise"],
  },
];

export const EDUCATION = [
  { name: "Bachelor of Information Technology", detail: "James Cook University · 2016 – 2020" },
  { name: "Full-Stack Developer", detail: "General Assembly · 2023 – 2024" },
  { name: "Microsoft Azure certification", detail: "In progress · 2026" },
];
