import { Link } from "@tanstack/react-router";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const legalLinks = [
    { to: "/imprint", label: "Imprint" },
    { to: "/privacy", label: "Privacy Policy" },
    { to: "/terms", label: "Terms of Use" },
  ] as const;

  const socialLinks = [
    {
      href: "https://x.com/MaxWagnerDev",
      label: "Twitter / X",
      icon: "/icons/company/x.svg",
    },
    {
      href: "https://github.com/everythingbuiltwith/everythingbuiltwith",
      label: "GitHub",
      icon: "/icons/company/github.svg",
    },
  ];

  return (
    <footer className="w-full border-border border-t bg-background px-4 py-10">
      <div className="container mx-auto flex flex-col items-center gap-6 md:flex-row md:justify-between md:gap-0">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <div className="mb-2 flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                className="text-muted-foreground transition-colors hover:text-foreground"
                href={social.href}
                key={social.label}
                rel="noopener noreferrer"
                target="_blank"
              >
                <img
                  alt={social.label}
                  className="size-5"
                  height={18}
                  src={social.icon}
                  width={18}
                />
                <span className="sr-only">{social.label}</span>
              </a>
            ))}
          </div>
          <p className="text-muted-foreground text-sm">
            &copy; {currentYear} everythingbuiltwith.com. All rights reserved.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <nav>
            <ul className="flex items-center gap-4">
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                    to={link.to}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
