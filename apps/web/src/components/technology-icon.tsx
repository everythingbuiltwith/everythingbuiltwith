import { ShieldQuestionMark } from "lucide-react";
import { cn } from "@/lib/utils";

interface TechnologyIconProps {
  className?: string;
  iconPath?: string;
  name: string;
  size: number;
}

export function TechnologyIcon({
  className,
  iconPath,
  name,
  size,
}: TechnologyIconProps) {
  const normalizedIconPath = iconPath?.trim() ?? "";
  if (normalizedIconPath.length === 0) {
    return (
      <ShieldQuestionMark
        aria-label={`${name} icon missing`}
        className={cn("text-muted-foreground", className)}
        size={size}
      />
    );
  }

  return (
    <img
      alt={`${name} logo`}
      className={className}
      height={size}
      src={`/icons/${normalizedIconPath}.svg`}
      width={size}
    />
  );
}
