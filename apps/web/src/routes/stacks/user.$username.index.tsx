/* biome-ignore-all lint/style/useFilenamingConvention: TanStack route filenames require $param and dot suffixes. */
import { useUser } from "@clerk/tanstack-react-start";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@everythingbuiltwith/backend/convex/_generated/api";
import { env } from "@everythingbuiltwith/env/web";
import {
  createFileRoute,
  Link,
  notFound,
  redirect,
} from "@tanstack/react-router";
import { CircleOff, Globe, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { StackCategoryDetailCard } from "@/components/stack-category-detail-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { trimTrailingSlash, truncate } from "@/lib/og";
import { staticTitle } from "../__root";

interface SocialLink {
  href?: string;
  icon?: LucideIcon;
  iconSrc?: string;
  label: string;
}

const NAME_PART_SPLIT_REGEX = /\s+/;

function getInitials(name: string): string {
  return (
    name
      .trim()
      .split(NAME_PART_SPLIT_REGEX)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "?"
  );
}

function SocialLinkIcon({ link }: { link: SocialLink }) {
  const Icon = link.icon;
  if (link.iconSrc) {
    return (
      <img
        alt={`${link.label} icon`}
        className="size-3.5 shrink-0"
        height={14}
        src={link.iconSrc}
        width={14}
      />
    );
  }
  return Icon ? (
    <Icon aria-hidden="true" className="size-3.5 shrink-0" />
  ) : null;
}

export const Route = createFileRoute("/stacks/user/$username/")({
  loader: async ({ context, params }) => {
    const routeResolution = await context.queryClient.ensureQueryData(
      convexQuery(api.queries.resolveUserUsernameRoute, {
        username: params.username,
      })
    );

    if (routeResolution.status === "not_found") {
      throw notFound();
    }

    if (
      routeResolution.status === "redirect" &&
      routeResolution.username !== params.username
    ) {
      throw redirect({
        to: "/stacks/user/$username",
        params: { username: routeResolution.username },
        statusCode: 308,
      });
    }

    return await context.queryClient.ensureQueryData(
      convexQuery(api.queries.getUserDetailsByUsername, {
        username: routeResolution.username,
      })
    );
  },
  head: ({ loaderData }) => {
    const siteUrl = trimTrailingSlash(env.VITE_PUBLIC_SITE_URL);
    const pageTitle = loaderData
      ? `Personal Tech Stack of ${loaderData.user.name} (@${loaderData.user.username})${staticTitle}`
      : `User Tech Stack${staticTitle}`;
    const description = loaderData
      ? truncate(
          loaderData.user.description ||
            `Discover ${loaderData.user.name}'s current tech stack on Everything Built With.`,
          160
        )
      : "Discover user tech stacks on Everything Built With.";
    const username = loaderData?.user.username;
    const pageUrl = username
      ? `${siteUrl}/stacks/user/${encodeURIComponent(username)}`
      : `${siteUrl}/stacks/user`;
    const ogImageUrl = username
      ? `${siteUrl}/api/og/user/${encodeURIComponent(username)}`
      : `${siteUrl}/api/og/user/unknown`;

    return {
      meta: [
        {
          title: pageTitle,
        },
        {
          name: "description",
          content: description,
        },
        {
          property: "og:title",
          content: pageTitle.replace(staticTitle, ""),
        },
        {
          property: "og:description",
          content: description,
        },
        {
          property: "og:type",
          content: "profile",
        },
        {
          property: "og:url",
          content: pageUrl,
        },
        {
          property: "og:image",
          content: ogImageUrl,
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          name: "twitter:title",
          content: pageTitle.replace(staticTitle, ""),
        },
        {
          name: "twitter:description",
          content: description,
        },
        {
          name: "twitter:image",
          content: ogImageUrl,
        },
      ],
    };
  },
  notFoundComponent: UserStackNotFound,
  component: RouteComponent,
});

function UserStackNotFound() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Empty className="w-full">
        <EmptyHeader>
          <EmptyMedia>
            <CircleOff className="size-5" />
          </EmptyMedia>
          <EmptyTitle>User stack not found</EmptyTitle>
          <EmptyDescription>
            We couldn&apos;t find a user stack for this URL.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}

function RouteComponent() {
  const pageData = Route.useLoaderData();
  const { user } = useUser();

  if (!pageData) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-muted-foreground text-sm">
          User stack data is currently unavailable.
        </p>
      </div>
    );
  }

  const socialLinks: SocialLink[] = [
    {
      href: pageData.user.githubUrl,
      iconSrc: "/icons/company/github.svg",
      label: "GitHub",
    },
    {
      href: pageData.user.twitterUrl,
      iconSrc: "/icons/company/x.svg",
      label: "Twitter / X",
    },
    {
      href: pageData.user.linkedinUrl,
      iconSrc: "/icons/company/linkedin.svg",
      label: "LinkedIn",
    },
    { href: pageData.user.websiteUrl, icon: Globe, label: "Website" },
  ];

  const handleCopyProfileLink = async () => {
    const profileLink = `${window.location.origin}/stacks/user/${pageData.user.username}`;
    try {
      await navigator.clipboard.writeText(profileLink);
      toast.success("Copied profile link");
    } catch (_error) {
      toast.error("Could not copy profile link");
    }
  };

  const userInitials = getInitials(pageData.user.name);
  const hasProfileImage = Boolean(pageData.user.imageUrl?.trim());
  const normalizedRouteUsername = pageData.user.username.trim().toLowerCase();
  const normalizedSignedInUsername = user?.username?.trim().toLowerCase();
  const isViewingOwnProfile =
    user?.id === pageData.user.clerkUserId ||
    (normalizedSignedInUsername !== undefined &&
      normalizedSignedInUsername === normalizedRouteUsername);

  return (
    <div className="container mx-auto flex flex-col gap-8 px-4 py-12">
      <div className="flex items-center gap-8">
        <Avatar className="size-40">
          <AvatarImage
            alt={pageData.user.name}
            height={160}
            src={hasProfileImage ? pageData.user.imageUrl : undefined}
            width={160}
          />
          <AvatarFallback className="font-bold text-4xl">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="mb-4 font-bold text-3xl">{pageData.user.name}</h1>
          <p className="text-muted-foreground">
            {pageData.user.description || "No description available yet."}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button onClick={handleCopyProfileLink} type="button">
              <Badge
                className="cursor-pointer transition-colors hover:bg-secondary/80"
                variant="secondary"
              >
                @{pageData.user.username}
              </Badge>
            </button>
            {socialLinks.map((link) => {
              return link.href ? (
                <a
                  className="inline-flex items-center gap-1.5 font-medium text-primary text-sm underline"
                  href={link.href}
                  key={link.label}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <SocialLinkIcon link={link} />
                  {link.label}
                </a>
              ) : (
                <span
                  className="inline-flex items-center gap-1.5 text-muted-foreground text-sm"
                  key={link.label}
                >
                  <SocialLinkIcon link={link} />
                  {link.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-bold text-2xl">Overview</h2>
          {isViewingOwnProfile ? (
            <Button size="sm" variant="outline">
              <Link
                params={{ username: pageData.user.username }}
                to="/stacks/user/$username/edit"
              >
                Edit stack
              </Link>
            </Button>
          ) : null}
        </div>
        {pageData.techStack.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No tech stack yet</EmptyTitle>
              <EmptyDescription>
                This user has not added any stack categories yet.
              </EmptyDescription>
              {isViewingOwnProfile ? (
                <div className="mt-4">
                  <Button size="sm">
                    <Link
                      params={{ username: pageData.user.username }}
                      to="/stacks/user/$username/edit"
                    >
                      Create my stack
                    </Link>
                  </Button>
                </div>
              ) : null}
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {pageData.techStack.map((categoryData) => {
              const {
                category,
                reason,
                shortDescription,
                longDescription,
                technologies,
              } = categoryData;
              const categoryUpdateGroup = pageData.techUpdates.find(
                (updateData) => updateData.category._id === category._id
              );

              return (
                <StackCategoryDetailCard
                  categoryId={category._id}
                  categoryName={category.name}
                  key={category._id}
                  longDescription={longDescription}
                  reasonName={reason?.name ?? "No information"}
                  shortDescription={shortDescription}
                  technologies={technologies}
                  updates={categoryUpdateGroup?.updates}
                />
              );
            })}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 font-bold text-2xl">Where this stack is used</h2>
        {pageData.user.usageLinks.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No usage links have been shared yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {pageData.user.usageLinks.map((link) => (
              <a
                className="w-fit font-medium text-primary text-sm underline"
                href={link.url}
                key={`${link.label}-${link.url}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
