const NAME_PART_SPLIT_REGEX = /\s+/;

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_TEASER_ICON_LIMIT = 6;

export function trimTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function toAbsoluteUrl(
  pathOrUrl: string | undefined,
  siteUrl: string
): string | undefined {
  const normalized = pathOrUrl?.trim();
  if (!normalized) {
    return undefined;
  }
  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }
  const base = trimTrailingSlash(siteUrl);
  const path = normalized.startsWith("/") ? normalized : `/${normalized}`;
  return `${base}${path}`;
}

export function getInitials(name: string): string {
  const normalized = name.trim();
  if (normalized.length === 0) {
    return "?";
  }
  return (
    normalized
      .split(NAME_PART_SPLIT_REGEX)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "?"
  );
}

export function truncate(value: string | undefined, maxLength: number): string {
  const normalized = value?.trim() ?? "";
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength - 1)}…`;
}
