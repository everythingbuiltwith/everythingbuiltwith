import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { TechnologyIcon } from "@/components/technology-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
  industry: string;
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
      <Card
        className={cn(
          "relative flex w-[280px] flex-col text-left transition-colors sm:w-[320px]",
          className
        )}
      >
        <CardHeader>
          <div className="flex justify-end">
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="flex justify-center">
            <Skeleton className="h-12 w-24" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex-1" />
          <div className="flex items-center gap-4 border-border border-t pt-4">
            <Skeleton className="h-3 w-16" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }

  const metaBadgeLabel = industry;
  const initials = getInitials(name);
  const userVisual = imageUrl ? (
    <img
      alt={`${name} avatar`}
      className="size-14 rounded-full object-cover"
      height={56}
      src={imageUrl}
      width={56}
    />
  ) : (
    <div className="flex size-14 items-center justify-center rounded-full bg-muted font-semibold text-muted-foreground text-sm">
      {initials}
    </div>
  );

  return (
    <Card
      className={cn(
        "relative flex w-[280px] flex-col text-left transition-colors sm:w-[320px]",
        className
      )}
    >
      <CardHeader>
        {stackType === "company" ? (
          <div className="mb-4 flex justify-end">
            <Badge variant="secondary">{metaBadgeLabel}</Badge>
          </div>
        ) : null}
        <div className="flex justify-center">
          {stackType === "user" ? (
            userVisual
          ) : (
            <img
              alt={`${name} logo`}
              className="h-12 w-fit max-w-24"
              height={300}
              src={`/icons/company/${icon}.svg`}
              width={100}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="text-muted-foreground text-sm">{description}</p>
        <div className="flex-1" />
        <div className="flex items-center gap-4 border-border border-t pt-4">
          <p className="font-semibold text-muted-foreground text-xs">
            Highlights
          </p>
          <div className="flex items-center gap-2 text-muted-foreground">
            <TooltipProvider>
              {teaserIcons.map((tech) => (
                <Tooltip key={tech.name}>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1 text-lg">
                      <TechnologyIcon
                        iconPath={tech.icon}
                        name={tech.name}
                        size={28}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tech.name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          {stackType === "user" && username ? (
            <Link
              className="flex w-full items-center justify-center"
              params={{ username }}
              to="/stacks/user/$username"
            >
              <span>View Stack</span>
              <ArrowRight className="ml-2 size-4" />
            </Link>
          ) : (
            <Link
              className="flex w-full items-center justify-center"
              params={{ slug: slug ?? "" }}
              to="/stacks/company/$slug"
            >
              <span>View Stack</span>
              <ArrowRight className="ml-2 size-4" />
            </Link>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
