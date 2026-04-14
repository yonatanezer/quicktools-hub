export const brandIdentity = {
  name: "QuickTools Hub",
  positioning: "Free professional online tools for everyone",
  tone: ["simple", "confident", "minimal", "value-focused"] as const,
  trustSignals: [
    "No signup required",
    "Free forever tools",
    "Instant results",
    "Secure and privacy-friendly",
  ] as const,
  primaryCta: { label: "Explore Tools", href: "#popular-tools" },
  secondaryCta: { label: "Browse Categories", href: "#tool-categories" },
} as const;
