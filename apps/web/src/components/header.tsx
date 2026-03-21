import { Show, SignInButton, SignOutButton, UserAvatar, useClerk, useUser } from "@clerk/tanstack-react-start";
import { api } from "@everythingbuiltwith/backend/convex/_generated/api";
import { Link } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { BookOpen, Building2, Layers, LogOut, Menu, Settings, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const stackLinks = [
  {
    description:
      "Deep-dive into the technology choices of leading companies — from frameworks and databases to infrastructure and tooling.",
    href: "/company-stacks" as const,
    icon: Building2,
    title: "Company Tech Stacks",
  },
  {
    description:
      "Browse personal tech stacks submitted by developers and makers. See what real people choose for their own projects.",
    href: "/community-stacks" as const,
    icon: Users,
    title: "Community Stacks",
  },
];

const mobileNavLinks = [
  {
    description:
      "Browse curated stack breakdowns from leading software companies.",
    href: "/company-stacks" as const,
    icon: Building2,
    label: "Company Stacks",
  },
  {
    description:
      "Explore personal stacks shared by developers, makers, and teams.",
    href: "/community-stacks" as const,
    icon: Users,
    label: "Community Stacks",
  },
  {
    description:
      "Read product updates and future editorial content about modern stacks.",
    href: "/blog" as const,
    icon: BookOpen,
    label: "Blog",
  },
];

export default function Header() {
  const { openUserProfile } = useClerk();
  const { isLoaded, isSignedIn, user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const syncCurrentUserProfile = useMutation(
    api.mutations.syncCurrentUserProfile
  );
  const lastSyncedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!(isLoaded && isSignedIn) || user === null) {
      lastSyncedUserId.current = null;
      return;
    }

    if (lastSyncedUserId.current === user.id) {
      return;
    }

    lastSyncedUserId.current = user.id;
    syncCurrentUserProfile({
      username: user.username ?? undefined,
      name:
        user.fullName ??
        user.firstName ??
        user.primaryEmailAddress?.emailAddress ??
        undefined,
      imageUrl: user.imageUrl ?? undefined,
    }).catch(() => {
      // Keep the UI responsive even if profile sync fails.
      lastSyncedUserId.current = null;
    });
  }, [isLoaded, isSignedIn, syncCurrentUserProfile, user]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const closeMobileMenuOnDesktop = () => {
      if (mediaQuery.matches) {
        setIsMobileMenuOpen(false);
      }
    };

    closeMobileMenuOnDesktop();
    mediaQuery.addEventListener("change", closeMobileMenuOnDesktop);

    return () => {
      mediaQuery.removeEventListener("change", closeMobileMenuOnDesktop);
    };
  }, []);

  const displayName =
    user?.username ??
    user?.fullName ??
    user?.firstName ??
    user?.primaryEmailAddress?.emailAddress ??
    "Profile";

  return (
    <header className="sticky top-0 z-30 w-full border-border/60 border-b bg-linear-to-b from-background to-background/85 px-4 py-4 backdrop-blur-sm">
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-4 md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center">
          <Link to="/">
            <img
              alt="Everything Built With logo"
              className="h-auto w-[150px] sm:w-[220px] md:w-[250px]"
              height={32}
              src="/everythingbuiltwith_logo_white.svg"
              width={250}
            />
          </Link>

          {/* Navigation - Center */}
          <NavigationMenu align="center" className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-semibold text-[15px]">
                  Stacks
                </NavigationMenuTrigger>
                <NavigationMenuContent className="group-data-[viewport=false]/navigation-menu:bg-card group-data-[viewport=false]/navigation-menu:p-0 group-data-[viewport=false]/navigation-menu:shadow-none group-data-[viewport=false]/navigation-menu:ring-0">
                  <ul className="grid w-[420px] gap-0 bg-card p-2">
                    {stackLinks.map((item, index) => {
                      const Icon = item.icon;

                      return (
                        <li key={item.href}>
                          {index > 0 ? (
                            <Separator className="my-1" role="presentation" />
                          ) : null}
                          <NavigationMenuLink
                            className="flex items-start gap-3 rounded-lg border border-transparent bg-card p-3 transition-[border-color,box-shadow] duration-200 hover:border-primary/40 hover:ring-1 hover:ring-primary/5"
                            render={<Link to={item.href} />}
                          >
                            <div className="relative mt-0.5 shrink-0">
                              <div
                                aria-hidden="true"
                                className="absolute -inset-2 rounded-full bg-primary/10 blur-lg"
                              />
                              <Icon
                                className="relative size-5 text-primary"
                                strokeWidth={1.5}
                              />
                            </div>
                            <div>
                              <div className="font-semibold text-sm leading-none tracking-tight">
                                {item.title}
                              </div>
                              <p className="mt-1.5 text-muted-foreground text-xs leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </NavigationMenuLink>
                        </li>
                      );
                    })}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} font-semibold text-[15px]`}
                  render={<Link to="/blog" />}
                >
                  Blog
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex min-w-0 items-center justify-end gap-3 sm:gap-4">
            <a
              aria-label="GitHub"
              className="hidden items-center justify-center opacity-60 transition-opacity hover:opacity-100 md:flex"
              href="https://github.com/everythingbuiltwith/everythingbuiltwith"
              rel="noopener noreferrer"
              target="_blank"
            >
              <img
                alt="GitHub"
                className="size-5"
                height={20}
                src="/icons/company/github.svg"
                width={20}
              />
            </a>
            <div aria-hidden="true" className="hidden h-5 w-px bg-border md:block" />
            <Show when="signed-out">
              <SignInButton>
                <Button className="px-3 sm:px-4" variant="secondary">
                  Sign in
                </Button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label="Open account menu"
                  className="group inline-flex min-w-0 items-center gap-2 text-sm transition-colors hover:text-foreground"
                >
                  <UserAvatar rounded />
                  <span className="hidden max-w-40 truncate font-medium text-foreground/90 group-hover:text-foreground sm:inline">
                    {displayName}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => openUserProfile()}>
                    <Settings className="size-4" />
                    Manage account
                  </DropdownMenuItem>
                  {user?.username ? (
                    <DropdownMenuItem
                      render={
                        <Link
                          params={{ username: user.username }}
                          to="/stacks/user/$username"
                        />
                      }
                    >
                      <Layers className="size-4" />
                      My tech stack
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuSeparator className="my-1.5 bg-white/30" />
                  <SignOutButton>
                    <DropdownMenuItem variant="destructive">
                      <LogOut className="size-4" />
                      Sign out
                    </DropdownMenuItem>
                  </SignOutButton>
                </DropdownMenuContent>
              </DropdownMenu>
            </Show>
            <Sheet onOpenChange={setIsMobileMenuOpen} open={isMobileMenuOpen}>
              <SheetTrigger
                render={
                  <Button
                    aria-label="Open navigation menu"
                    className="md:hidden"
                    size="icon-sm"
                    variant="outline"
                  />
                }
              >
                <Menu className="size-4" />
                <span className="sr-only">Open navigation menu</span>
              </SheetTrigger>
              <SheetContent className="p-0 md:hidden" side="right">
                <SheetHeader className="border-border/70 border-b px-4 py-4">
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-3 p-4">
                  <div className="space-y-2">
                    <p className="px-1 font-medium text-[11px] text-muted-foreground uppercase tracking-[0.2em]">
                      Browse
                    </p>
                    {mobileNavLinks.map((item) => {
                      const Icon = item.icon;

                      return (
                        <Link
                          className="flex items-start gap-3 rounded-xl border border-border/70 bg-card px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-muted/40"
                          key={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          to={item.href}
                        >
                          <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Icon className="size-4" strokeWidth={1.8} />
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-sm">
                              {item.label}
                            </div>
                            <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <Separator />
                  <a
                    className="inline-flex items-center justify-between rounded-xl border border-border/70 bg-card px-4 py-3 font-medium text-sm transition-colors hover:border-primary/40 hover:bg-muted/40"
                    href="https://github.com/everythingbuiltwith/everythingbuiltwith"
                    onClick={() => setIsMobileMenuOpen(false)}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    GitHub
                    <img
                      alt=""
                      aria-hidden="true"
                      className="size-4"
                      height={16}
                      src="/icons/company/github.svg"
                      width={16}
                    />
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
