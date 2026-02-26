import { SignedIn, SignedOut, SignInButton } from "@clerk/tanstack-react-start";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@everythingbuiltwith/backend/convex/_generated/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  GitCompareArrows,
  type LucideIcon,
  MessageCircle,
  Sparkles,
  Users,
} from "lucide-react";
import { TechStackCard } from "@/components/tech-stack-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { staticTitle } from "./__root";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: `Discover Companies and Users Tech Stacks + Why${staticTitle}`,
      },
    ],
  }),
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <FeaturedStacksSection />
      <GetStartedSection />
    </>
  );
}

function HeroSection() {
  const heroSlugs = ["convex", "linear"];
  const { data: heroCompanies } = useSuspenseQuery(
    convexQuery(api.queries.getCompanyCardsBySlugs, { slugs: heroSlugs })
  );

  const floatingTechIcons = [
    {
      icon: "tech/go",
      position: "top-[5%] right-[10%]",
    },
    {
      icon: "tech/postgres",
      position: "top-[40%] right-[5%]",
    },
    {
      icon: "company/planetscale",
      position: "bottom-[22%] left-[20%]",
    },
    {
      icon: "tech/typescript",
      position: "bottom-[5%] left-[10%]",
    },
    {
      icon: "tech/kubernetes",
      position: "top-[55%] left-[5%]",
    },
    {
      icon: "tech/react",
      position: "top-[20%] left-[70%]",
    },
  ];

  return (
    <section className="relative mt-[-100px] flex min-h-screen w-full items-center overflow-hidden pt-48 pb-32">
      <div
        aria-hidden="true"
        className="hero-gradient-bg absolute inset-0 z-0 h-full w-full"
      />
      <div
        aria-hidden="true"
        className="hero-grid-bg absolute inset-0 z-10 h-full w-full"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 z-10 h-56 w-full"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.3) 70%, var(--background) 100%)",
        }}
      />
      <div className="container relative z-20 mx-auto grid w-full grid-cols-1 items-center gap-24 px-6 md:grid-cols-2">
        <div className="flex flex-col items-start gap-6 text-left">
          <h1 className="hero-reveal hero-reveal-1 font-bold text-5xl leading-tight tracking-tighter md:text-6xl lg:text-7xl">
            Discover What Companies And Users Build With +{" "}
            <span className="text-primary">Why</span>
          </h1>
          <p className="hero-reveal hero-reveal-2 max-w-xl text-lg text-muted-foreground">
            Explore the tech stacks behind leading companies, alongside
            community-submitted personal stacks from users. Get curated stories,
            practical insights, and the reasons behind every choice.
          </p>
          <div className="hero-reveal hero-reveal-3 mt-6 flex gap-4">
            <SignedOut>
              <SignInButton>
                <Button size="lg" variant="outline">
                  Login And Explore Stacks Now
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link to="/user/submitted-stacks">
                <Button size="lg" variant="outline">
                  Submit Your Own Stack Now
                </Button>
              </Link>
            </SignedIn>
          </div>
        </div>
        <div className="hero-reveal hero-reveal-4 relative h-[500px] sm:h-[600px] md:h-[740px]">
          <div>
            <div className="absolute top-0 left-0">
              {heroCompanies[0] ? (
                <TechStackCard {...heroCompanies[0]} />
              ) : (
                <TechStackCard
                  description=""
                  icon=""
                  industry=""
                  isLoading
                  name=""
                  slug=""
                  teaserIcons={[]}
                />
              )}
            </div>
            <div className="absolute right-0 bottom-0">
              {heroCompanies[1] ? (
                <TechStackCard {...heroCompanies[1]} />
              ) : (
                <TechStackCard
                  description=""
                  icon=""
                  industry=""
                  isLoading
                  name=""
                  slug=""
                  teaserIcons={[]}
                />
              )}
            </div>
          </div>
          {floatingTechIcons.map((item) => (
            <div
              className={`absolute hidden sm:block ${item.position} transition-transform`}
              key={item.icon}
            >
              <img
                alt={`${item.icon} logo`}
                className="size-6 sm:size-[30px]"
                height={30}
                src={`/icons/${item.icon}.svg`}
                width={30}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const features: {
  icon: LucideIcon;
  title: string;
  description: string;
  className: string;
}[] = [
  {
    icon: Building2,
    title: "Company Tech Stacks",
    description:
      "Deep-dive into the technology choices of leading companies — from frameworks and databases to infrastructure and tooling.",
    className: "md:col-span-2",
  },
  {
    icon: Users,
    title: "Community Stacks",
    description:
      "Browse personal tech stacks submitted by developers and makers. See what real people choose for their own projects.",
    className: "",
  },
  {
    icon: MessageCircle,
    title: 'The "Why" Behind Every Choice',
    description:
      "Go beyond the list. Every technology comes with the reasoning and context that led to the decision.",
    className: "",
  },
  {
    icon: Sparkles,
    title: "Curated Insights",
    description:
      "Get practical stories and takeaways instead of generic overviews. Learn what worked, what didn't, and why.",
    className: "",
  },
  {
    icon: GitCompareArrows,
    title: "Stack Evolution Over Time",
    description:
      "Track how tech stacks evolve. See what companies migrate to, what they leave behind, and the trends shaping the industry.",
    className: "",
  },
];

function FeatureCard({
  icon: Icon,
  title,
  description,
  className,
}: (typeof features)[number]) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8",
        className
      )}
    >
      <div aria-hidden="true" className="feature-card-grid" />
      <div className="relative z-10">
        <div className="relative mb-1 w-fit">
          <div
            aria-hidden="true"
            className="absolute -inset-3 rounded-full bg-primary/10 blur-xl"
          />
          <Icon className="relative size-8 text-primary" strokeWidth={1.5} />
        </div>
        <h3 className="mt-3 font-semibold text-lg tracking-tight">{title}</h3>
        <p className="mt-2 max-w-md text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function FeaturesSection() {
  const topRowIcons: Array<{ key: string; name: string; icon: string }> = [
    { key: "vercel", name: "Vercel", icon: "/icons/company/vercel_full.svg" },
    { key: "linear", name: "Linear", icon: "/icons/company/linear_full.svg" },
    {
      key: "convex",
      name: "Convex",
      icon: "/icons/company/convex_full.svg",
    },
    { key: "sentry", name: "Sentry", icon: "/icons/company/sentry_full.svg" },
    {
      key: "cloudflare",
      name: "Cloudflare",
      icon: "/icons/company/cloudflare_full.svg",
    },
  ];
  const bottomRowIcons: Array<{ key: string; name: string; icon: string }> = [
    { key: "github", name: "GitHub", icon: "/icons/company/github_full.svg" },
    {
      key: "supabase-2",
      name: "Supabase",
      icon: "/icons/company/supabase_full.svg",
    },
    { key: "sentry-2", name: "Sentry", icon: "/icons/company/sentry_full.svg" },
  ];

  return (
    <section className="relative w-full py-16">
      <div className="container mx-auto px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-bold text-4xl tracking-tight md:text-5xl">
            More than just a list of tools
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Context, reasoning, and real stories behind every technology choice
            — so you can learn from what others have shipped.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 md:gap-5">
          <div className="flex items-center justify-center gap-6 md:gap-10">
            {topRowIcons.map((company) => (
              <img
                alt={`${company.name} logo`}
                className="h-5 w-auto shrink-0 object-contain md:h-7"
                height={48}
                key={company.key}
                src={company.icon}
                width={140}
              />
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 md:gap-10">
            {bottomRowIcons.map((company) => (
              <img
                alt={`${company.name} logo`}
                className="h-5 w-auto shrink-0 object-contain md:h-7"
                height={48}
                key={company.key}
                src={company.icon}
                width={140}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedStacksSection() {
  const { data: featuredCompanies } = useSuspenseQuery(
    convexQuery(api.queries.getFeaturedCompanyCards, {})
  );

  if (featuredCompanies.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_auto]">
          <div className="lg:self-center">
            <h2 className="font-bold text-4xl tracking-tight md:text-5xl">
              Explore Popular Stacks
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Handpicked tech stacks from leading companies — explore how they
              build and why they chose their tools.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {featuredCompanies.map((company) => (
              <TechStackCard key={company.slug} {...company} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GetStartedSection() {
  return (
    <section className="relative w-full py-16">
      <div className="container mx-auto px-6">
        <div className="rounded-3xl border border-primary/30 bg-primary px-8 py-12 text-primary-foreground md:px-12">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div>
              <p className="font-semibold text-primary-foreground/80 text-sm uppercase tracking-[0.2em]">
                Get started now
              </p>
              <h2 className="mt-3 font-bold text-3xl tracking-tight md:text-4xl">
                Join the community and share your stack
              </h2>
              <p className="mt-4 max-w-2xl text-base text-primary-foreground/90 leading-relaxed md:text-lg">
                Log in to submit your own tech stack and explain your choices.
                You can also explore every company tech stack to see what teams
                build with and why.
              </p>
            </div>
            <div className="mt-8">
              <SignInButton>
                <Button
                  className="bg-background font-semibold text-foreground hover:bg-background/90"
                  size="lg"
                >
                  Sign in
                </Button>
              </SignInButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
