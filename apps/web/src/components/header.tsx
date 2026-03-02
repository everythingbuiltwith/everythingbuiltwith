import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserAvatar,
  useClerk,
  useUser,
} from "@clerk/tanstack-react-start";
import { api } from "@everythingbuiltwith/backend/convex/_generated/api";
import { Link } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { Building2, Layers, LogOut, Settings, Users } from "lucide-react";
import { useEffect, useRef } from "react";
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

export default function Header() {
  const { openUserProfile } = useClerk();
  const { isLoaded, isSignedIn, user } = useUser();
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

  const displayName =
    user?.username ??
    user?.fullName ??
    user?.firstName ??
    user?.primaryEmailAddress?.emailAddress ??
    "Profile";

  return (
    <header className="sticky top-0 z-30 w-full border-border/60 border-b bg-linear-to-b from-background to-background/85 px-4 py-4 backdrop-blur-sm">
      <div className="container mx-auto grid grid-cols-[1fr_auto_1fr] items-center">
        {/* Logo - Left */}
        <div className="flex items-center">
          <Link to="/">
            <img
              alt="Everything Built With logo"
              height={32}
              src="/everythingbuiltwith_logo_white.svg"
              width={250}
            />
          </Link>
        </div>

        {/* Navigation - Center */}
        <NavigationMenu align="center" className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="font-semibold text-[15px]">
                Stacks
              </NavigationMenuTrigger>
              <NavigationMenuContent className="group-data-[viewport=false]/navigation-menu:bg-card group-data-[viewport=false]/navigation-menu:p-0 group-data-[viewport=false]/navigation-menu:shadow-none group-data-[viewport=false]/navigation-menu:ring-0">
                <ul className="grid w-[420px] gap-0 bg-card p-2">
                  <li>
                    <NavigationMenuLink
                      className="flex items-start gap-3 rounded-lg border border-transparent bg-card p-3 transition-[border-color,box-shadow] duration-200 hover:border-primary/40 hover:ring-1 hover:ring-primary/5"
                      render={<Link to="/company-stacks" />}
                    >
                      <div className="relative mt-0.5 shrink-0">
                        <div
                          aria-hidden="true"
                          className="absolute -inset-2 rounded-full bg-primary/10 blur-lg"
                        />
                        <Building2
                          className="relative size-5 text-primary"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-sm leading-none tracking-tight">
                          Company Tech Stacks
                        </div>
                        <p className="mt-1.5 text-muted-foreground text-xs leading-relaxed">
                          Deep-dive into the technology choices of leading
                          companies — from frameworks and databases to
                          infrastructure and tooling.
                        </p>
                      </div>
                    </NavigationMenuLink>
                  </li>
                  <li role="presentation">
                    <Separator className="my-1" />
                  </li>
                  <li>
                    <NavigationMenuLink
                      className="flex items-start gap-3 rounded-lg border border-transparent bg-card p-3 transition-[border-color,box-shadow] duration-200 hover:border-primary/40 hover:ring-1 hover:ring-primary/5"
                      render={<Link to="/community-stacks" />}
                    >
                      <div className="relative mt-0.5 shrink-0">
                        <div
                          aria-hidden="true"
                          className="absolute -inset-2 rounded-full bg-primary/10 blur-lg"
                        />
                        <Users
                          className="relative size-5 text-primary"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-sm leading-none tracking-tight">
                          Community Stacks
                        </div>
                        <p className="mt-1.5 text-muted-foreground text-xs leading-relaxed">
                          Browse personal tech stacks submitted by developers
                          and makers. See what real people choose for their own
                          projects.
                        </p>
                      </div>
                    </NavigationMenuLink>
                  </li>
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

        <div className="flex items-center justify-end gap-4">
          <a
            aria-label="GitHub"
            className="flex items-center justify-center opacity-60 transition-opacity hover:opacity-100"
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
          <div aria-hidden="true" className="h-5 w-px bg-border" />
          <SignedOut>
            <SignInButton>
              <Button variant="secondary">Sign in</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Open account menu"
                className="group inline-flex items-center gap-2 text-sm transition-colors hover:text-foreground"
              >
                <UserAvatar rounded />
                <span className="max-w-48 truncate font-medium text-foreground/90 group-hover:text-foreground">
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
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
