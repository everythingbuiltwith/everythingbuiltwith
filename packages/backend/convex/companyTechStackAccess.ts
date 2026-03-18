const COMPANY_TECH_STACK_ADMIN_METADATA_KEY = "company_tech_stack_admin";
const COMPANY_TECH_STACK_MAINTAINER_METADATA_KEY =
  "company_tech_stack_maintainer";

function getBooleanMetadataField(
  source: unknown,
  key: string
): boolean | undefined {
  if (source === null || typeof source !== "object") {
    return undefined;
  }

  const value = (source as Record<string, unknown>)[key];
  if (value === true) {
    return true;
  }
  if (value === false) {
    return false;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") {
      return true;
    }
    if (normalized === "false") {
      return false;
    }
  }

  return undefined;
}

function getStringArrayMetadataField(
  source: unknown,
  key: string
): string[] | undefined {
  if (source === null || typeof source !== "object") {
    return undefined;
  }

  const value = (source as Record<string, unknown>)[key];
  if (Array.isArray(value)) {
    const normalizedValues = value
      .filter((entry): entry is string => typeof entry === "string")
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);

    return normalizedValues.length > 0 ? normalizedValues : [];
  }

  if (typeof value !== "string") {
    return undefined;
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) {
      return undefined;
    }

    const normalizedValues = parsed
      .filter((entry): entry is string => typeof entry === "string")
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);

    return normalizedValues.length > 0 ? normalizedValues : [];
  } catch {
    return undefined;
  }
}

function findMetadataValue<T>(
  source: unknown,
  getter: (candidate: unknown, key: string) => T | undefined,
  key: string,
  seen: WeakSet<object> = new WeakSet()
): T | undefined {
  const directValue = getter(source, key);
  if (directValue !== undefined) {
    return directValue;
  }

  if (source === null || typeof source !== "object") {
    return undefined;
  }

  if (seen.has(source)) {
    return undefined;
  }
  seen.add(source);

  const nestedSources = Object.values(source as Record<string, unknown>);
  for (const nestedSource of nestedSources) {
    const nestedValue = findMetadataValue(nestedSource, getter, key, seen);
    if (nestedValue !== undefined) {
      return nestedValue;
    }
  }

  return undefined;
}

export function hasCompanyTechStackAdminAccess(
  identity: Record<string, unknown>
): boolean {
  return (
    findMetadataValue(
      identity,
      getBooleanMetadataField,
      COMPANY_TECH_STACK_ADMIN_METADATA_KEY
    ) ?? false
  );
}

export function getCompanyTechStackMaintainerSlugs(
  identity: Record<string, unknown>
): string[] {
  return (
    findMetadataValue(
      identity,
      getStringArrayMetadataField,
      COMPANY_TECH_STACK_MAINTAINER_METADATA_KEY
    ) ?? []
  );
}

export function canEditCompanyTechStack(
  identity: Record<string, unknown>,
  companySlug: string
): boolean {
  if (hasCompanyTechStackAdminAccess(identity)) {
    return true;
  }

  const normalizedCompanySlug = companySlug.trim().toLowerCase();
  if (normalizedCompanySlug.length === 0) {
    return false;
  }

  return getCompanyTechStackMaintainerSlugs(identity).some(
    (slug) => slug.toLowerCase() === normalizedCompanySlug
  );
}
