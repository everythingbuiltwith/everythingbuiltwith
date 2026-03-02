import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { TechnologyIcon } from "@/components/technology-icon";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TechStackCardProps {
  className?: string;
  description: string;
  icon?: string;
  imageUrl?: string;
  industry?: string;
  isLoading?: boolean;
  name: string;
  slug?: string;
  stackType?: "company" | "user";
  teaserIcons: {
    name: string;
    icon: string;
  }[];
  username?: string;
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

function CompanyLogo({ alt, icon }: { alt: string; icon: string }) {
  const baseName = icon.endsWith("_full") ? icon.slice(0, -5) : icon;
  const basePath = `/icons/company/${baseName}`;
  const fullPath = `${basePath}_full.svg`;
  const fallbackPath = `${basePath}.svg`;

  return (
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: onError fallback for missing _full logo
    <img
      alt={alt}
      className="h-12 w-fit max-w-36 object-contain sm:h-14 sm:max-w-40"
      height={56}
      onError={(e) => {
        const target = e.currentTarget;
        if (target.src.endsWith("_full.svg")) {
          target.src = fallbackPath;
        }
      }}
      src={fullPath}
      width={160}
    />
  );
}

export function TechStackCard({
  name,
  description,
  industry,
  icon,
  slug,
  teaserIcons,
  className,
  isLoading = false,
  stackType = "company",
  username,
  imageUrl,
}: TechStackCardProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "relative flex w-full min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card",
          className
        )}
      >
        <div className="absolute top-5 right-5 z-10">
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <div className="flex flex-1 flex-col items-center px-6 pt-14 pb-5">
          <div className="mb-5">
            <Skeleton className="h-14 w-36 rounded" />
          </div>
          <Skeleton className="mb-6 h-4 w-full max-w-[260px]" />
          <Skeleton className="mb-2 h-4 w-3/4 max-w-[260px]" />
          <div className="flex w-full items-center justify-center gap-5 rounded-lg bg-muted/40 py-3.5">
            <Skeleton className="size-[22px] rounded" />
            <Skeleton className="size-[22px] rounded" />
            <Skeleton className="size-[22px] rounded" />
          </div>
        </div>
        <div className="flex items-center justify-center gap-1.5 px-6 pb-5">
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    );
  }

  const initials = getInitials(name);
  const userVisual = imageUrl ? (
    <img
      alt={`${name} avatar`}
      className="size-16 rounded-full object-cover ring-2 ring-border"
      height={64}
      src={imageUrl}
      width={64}
    />
  ) : (
    <div className="flex size-16 items-center justify-center rounded-full bg-muted font-semibold text-lg text-muted-foreground tracking-tight ring-2 ring-border">
      {initials}
    </div>
  );

  const linkProps =
    stackType === "user" && username
      ? { params: { username }, to: "/stacks/user/$username" as const }
      : { params: { slug: slug ?? "" }, to: "/stacks/company/$slug" as const };

  const isCompany = stackType === "company";

  return (
    <Link
      className={cn(
        "group relative flex w-full min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card ring-1 ring-foreground/5 transition-all duration-200 hover:border-primary/40 hover:ring-primary/5",
        className
      )}
      {...linkProps}
    >
      <div className="absolute top-5 right-5 z-10">
        <Badge className="px-2.5 py-0.5" variant="secondary">
          {isCompany ? industry : `@${username}`}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col items-center px-6 pt-14 pb-5">
        <div className="mb-5">
          {isCompany && icon ? (
            <CompanyLogo alt={`${name} logo`} icon={icon} />
          ) : (
            userVisual
          )}
        </div>

        <p className="mb-6 min-h-[6.5rem] max-w-[260px] text-center text-[13px] text-muted-foreground leading-relaxed">
          {description}
        </p>

        <div className="flex min-h-14 w-full items-center justify-center gap-5 rounded-lg bg-muted/40 py-3.5">
          <TooltipProvider>
            {teaserIcons.map((tech) => (
              <Tooltip key={tech.name}>
                <TooltipTrigger>
                  <span className="flex items-center">
                    <TechnologyIcon
                      iconPath={tech.icon}
                      name={tech.name}
                      size={22}
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tech.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 px-6 pb-5 font-medium text-primary text-sm group-hover:underline">
        View stack
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
