import { SignedIn, SignedOut, SignInButton } from "@clerk/tanstack-react-start";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@everythingbuiltwith/backend/convex/_generated/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { TechStackCard } from "@/components/tech-stack-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

const HERO_BORDER_ICONS = [
  { icon: "company/convex", name: "Convex", top: "5%", left: "18%" },
  { icon: "company/linear", name: "Linear", top: "0%", left: "82%" },
  { icon: "company/vercel", name: "Vercel", top: "30%", left: "3%" },
  { icon: "tech/kubernetes", name: "Next.js", top: "20%", left: "97%" },
  { icon: "tech/react", name: "Tailwind", top: "60%", left: "0%" },
  { icon: "company/sentry", name: "Sentry", top: "70%", left: "100%" },
  { icon: "tech/tanstack", name: "Supabase", top: "98%", left: "10%" },
  { icon: "tech/shadcn", name: "shadcn", top: "98%", left: "90%" },
];

function HeroSection() {
  return (
    <section className="relative flex min-h-screen w-full items-center overflow-hidden bg-background py-16">
      <div className="container relative z-10 mx-auto grid w-full grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[1fr_auto] lg:gap-20">
        {/* Left — text */}
        <div className="flex max-w-2xl flex-col items-start text-left">
          <h1 className="hero-reveal hero-reveal-1 font-bold text-4xl leading-[1.15] tracking-tight md:text-5xl lg:text-6xl">
            Discover What Companies And Users Build With +{" "}
            <span className="text-primary">Why</span>
          </h1>
          <p className="hero-reveal hero-reveal-2 mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Explore the tech stacks behind leading companies, alongside
            community-submitted personal stacks from users. Get curated stories,
            practical insights, and the reasons behind every choice.
          </p>
          <div className="hero-reveal hero-reveal-3 mt-10">
            <div className="flex gap-4">
              <SignedOut>
                <SignInButton>
                  <Button size="lg" variant="default">
                    Login And Explore Stacks Now
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link to="/community-stacks">
                  <Button size="lg" variant="default">
                    Submit Your Own Stack Now
                  </Button>
                </Link>
              </SignedIn>
            </div>
          </div>
        </div>

        {/* Right — stacked cube SVG with tech icons around it */}
        <div className="hero-reveal hero-reveal-4 relative shrink-0">
          {/* Thin light effect behind SVG */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/10 blur-3xl md:h-[500px] md:w-[500px] lg:h-[580px] lg:w-[580px]"
          />
          {HERO_BORDER_ICONS.map((item, i) => (
            <div
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              key={item.name}
              style={{
                top: item.top,
                left: item.left,
                animation: "hero-icon-drift 5s ease-in-out infinite both",
                animationDelay: `${i * 0.5}s`,
              }}
            >
              <div className="flex size-10 items-center justify-center rounded-xl border border-border/60 bg-card/80 shadow-lg backdrop-blur-sm">
                <img
                  alt={item.name}
                  aria-hidden
                  className="size-5 object-contain"
                  height={20}
                  src={`/icons/${item.icon}.svg`}
                  width={20}
                />
              </div>
            </div>
          ))}
          <svg
            aria-hidden
            className="pointer-events-none h-[380px] w-[380px] shrink-0 opacity-40 md:h-[450px] md:w-[450px] lg:h-[520px] lg:w-[520px]"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            viewBox="130 30 330 355"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Decorative stacked shape</title>
            <g
              shapeRendering="geometricPrecision"
              stroke="#FFFFFF"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              transform="translate(295,207) scale(0.72,1.18) translate(-290,-204)"
            >
              <path d="M180 100 L400 80 Q415 78 425 90 L465 170 Q475 185 460 190 L240 210 Q225 212 215 200 L175 120 Q165 105 180 100 Z" />
              <path
                d="M165 130 L385 110 Q400 108 410 120 L450 200 Q460 215 445 220 L225 240 Q210 242 200 230 L160 150 Q150 135 165 130 Z"
                opacity="0.85"
              />
              <path
                d="M150 160 L370 140 Q385 138 395 150 L435 230 Q445 245 430 250 L210 270 Q195 272 185 260 L145 180 Q135 165 150 160 Z"
                opacity="0.7"
              />
              <path
                d="M135 190 L355 170 Q370 168 380 180 L420 260 Q430 275 415 280 L195 300 Q180 302 170 290 L130 210 Q120 195 135 190 Z"
                opacity="0.55"
              />
              <path
                d="M120 220 L340 200 Q355 198 365 210 L405 290 Q415 305 400 310 L180 330 Q165 332 155 320 L115 240 Q105 225 120 220 Z"
                opacity="0.4"
              />
            </g>
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes hero-icon-drift {
          0%, 100% { transform: translate(-50%, -50%) translate(0, 0); }
          33% { transform: translate(-50%, -50%) translate(3px, -4px); }
          66% { transform: translate(-50%, -50%) translate(-3px, 2px); }
        }
      `}</style>
    </section>
  );
}

function HomeComponent() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <FeaturedStacksSection />
      <SignedOut>
        <GetStartedSection />
      </SignedOut>
    </>
  );
}

const TIMELINE_ENTRIES = [
  { date: "2021-06-05", icon: "/icons/tech/react.svg", label: "React" },
  { date: "2024-09-22", icon: "/icons/tech/nextjs.svg", label: "Next.js" },
  {
    date: "2026-02-15",
    icon: "/icons/tech/tanstack.svg",
    label: "Tanstack Start",
  },
];

const REASON_BADGES = [
  "Developer Experience",
  "Ecosystem & Integration",
  "Long-Term Strategy",
  "Performance & Architecture",
  "Business & Product Needs",
];

const REASON_BADGE_STAIR = ["", "ml-2", "ml-4", "ml-6", "ml-8"];

const FEATURE_CARD_ICONS = [
  { icon: "/icons/tech/go.svg", name: "Golang", top: "30%", left: "10%" },
  {
    icon: "/icons/tech/kafka.svg",
    name: "Kafka",
    top: "15%",
    left: "80%",
  },
  {
    icon: "/icons/company/clerk.svg",
    name: "Clerk",
    top: "80%",
    left: "20%",
  },
  {
    icon: "/icons/tech/kubernetes.svg",
    name: "Kubernetes",
    top: "60%",
    left: "90%",
  },
  {
    icon: "/icons/tech/postgres.svg",
    name: "Postgres",
    top: "10%",
    left: "30%",
  },
  {
    icon: "/icons/tech/typescript.svg",
    name: "Typescript",
    top: "90%",
    left: "70%",
  },
];

function FeaturesSection() {
  return (
    <section className="relative w-full overflow-hidden py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 left-0 h-52 bg-linear-to-t from-secondary/35 via-secondary/20 to-transparent"
      />
      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-bold text-4xl tracking-tight md:text-5xl">
            More than just a list of tools
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Context, reasoning, and real stories behind every technology choice
            — so you can learn from what others have shipped.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[0.85fr_1.15fr] lg:grid-rows-2">
          <div className="rounded-xl border border-border bg-card p-6 md:p-8 lg:row-span-2 lg:min-h-[432px]">
            <div className="relative mb-16 flex h-52 items-center justify-center">
              {FEATURE_CARD_ICONS.map((item) => (
                <div
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                  key={item.name}
                  style={{
                    top: item.top,
                    left: item.left,
                  }}
                >
                  <div className="flex size-9 items-center justify-center rounded-lg border border-border/70 bg-background/80 shadow-sm backdrop-blur-sm">
                    <img
                      alt={item.name}
                      className="size-5 object-contain"
                      height={20}
                      src={item.icon}
                      width={20}
                    />
                  </div>
                </div>
              ))}
              <img
                alt="EverythingBuiltWith"
                className="size-20 shrink-0 opacity-90 md:size-32"
                height={96}
                src="/everythingbuiltwith_icon_red.svg"
                width={96}
              />
            </div>
            <div>
              <h3 className="font-bold text-2xl tracking-tight">
                Company & Community Stacks
              </h3>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                Deep-dive into leading companies' technology choices or browse
                personal stacks submitted by real developers and makers. See
                what teams and individuals actually build with and compare
                approaches across the industry.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 md:p-6 lg:min-h-[210px]">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_auto] md:items-stretch">
              <div>
                <h3 className="font-bold text-2xl tracking-tight">
                  The <span className="text-primary">Why</span> Behind Every
                  Choice
                </h3>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                  Go beyond the list. Every technology comes with the reasoning
                  and context that led to the decision.
                </p>
              </div>
              <div className="flex flex-col items-start gap-4 md:min-w-[230px]">
                {REASON_BADGES.map((badge, index) => (
                  <Badge
                    className={REASON_BADGE_STAIR[index] ?? "ml-8"}
                    key={badge}
                    variant="secondary"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 md:p-6 lg:col-start-2 lg:min-h-[210px]">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_auto] md:items-start">
              <div>
                <h3 className="font-bold text-2xl tracking-tight">
                  Stack Evolution Over Time
                </h3>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                  Track how stacks evolve — see what companies migrate to and
                  the trends shaping the industry.
                </p>
              </div>
              <div className="relative md:min-h-[170px] md:min-w-[230px] md:self-stretch">
                <div
                  aria-hidden="true"
                  className="absolute top-0 bottom-0 left-2 w-px bg-border"
                />
                <div className="flex h-full flex-col justify-between gap-3">
                  {TIMELINE_ENTRIES.map((entry) => (
                    <div
                      className="relative flex items-center gap-2 pl-6"
                      key={entry.label}
                    >
                      <span className="absolute top-1/2 left-2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-primary" />
                      <img
                        alt={entry.label}
                        className="size-5 object-contain"
                        height={20}
                        src={entry.icon}
                        width={20}
                      />
                      <span className="text-muted-foreground text-xs">
                        {format(new Date(entry.date), "PPP")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
