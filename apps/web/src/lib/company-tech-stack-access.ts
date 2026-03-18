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
  getter: (metadata: unknown, key: string) => T | undefined,
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

export function canEditCompanyTechStack(
  metadataSource: unknown,
  companySlug: string
): boolean {
  const isAdmin =
    findMetadataValue(
      metadataSource,
      getBooleanMetadataField,
      "company_tech_stack_admin"
    ) ?? false;
  if (isAdmin) {
    return true;
  }

  const allowedSlugs =
    findMetadataValue(
      metadataSource,
      getStringArrayMetadataField,
      "company_tech_stack_maintainer"
    ) ?? [];
  const normalizedCompanySlug = companySlug.trim().toLowerCase();

  if (normalizedCompanySlug.length === 0) {
    return false;
  }

  return allowedSlugs.some(
    (slug) => slug.toLowerCase() === normalizedCompanySlug
  );
}
