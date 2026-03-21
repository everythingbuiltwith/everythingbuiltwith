export const HERO_BORDER_ICONS = [
  { icon: "company/convex", name: "Convex", top: "5%", left: "18%" },
  { icon: "company/linear", name: "Linear", top: "0%", left: "82%" },
  { icon: "company/vercel", name: "Vercel", top: "30%", left: "3%" },
  { icon: "tech/kubernetes", name: "Kubernetes", top: "20%", left: "97%" },
  { icon: "tech/react", name: "React", top: "60%", left: "0%" },
  { icon: "company/sentry", name: "Sentry", top: "70%", left: "100%" },
  { icon: "tech/tanstack", name: "Tanstack", top: "98%", left: "10%" },
  { icon: "tech/shadcn", name: "shadcn", top: "98%", left: "90%" },
] as const;

export const MOBILE_HERO_LOGOS = HERO_BORDER_ICONS.slice(0, 6);
