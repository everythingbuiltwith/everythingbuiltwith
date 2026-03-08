import { v } from "convex/values";
import { z } from "zod";
import type { Doc, Id } from "./_generated/dataModel";
import { type QueryCtx, query } from "./_generated/server";

export const companySlugInputSchema = z.object({
  slug: z.string().trim().min(1),
});

export const companySlugsInputSchema = z.object({
  slugs: z.array(z.string().trim().min(1)),
});

export const teaserIconSchema = z.object({
  name: z.string(),
  icon: z.string(),
});

export const companyCardSchema = z.object({
  name: z.string(),
  description: z.string(),
  industry: z.string(),
  icon: z.string(),
  slug: z.string(),
  teaserIcons: z.array(teaserIconSchema),
});

export const companyDetailsSchema = z.object({
  _id: z.string(),
  name: z.string(),
  slug: z.string(),
  logo: z.string(),
  description: z.string(),
  verificationStatus: z.enum(["public_data_only", "verified"]),
  companyInfo: z.object({
    size: z.string(),
    website: z.string(),
    hq: z.string(),
  }),
  industry: z.object({
    _id: z.string(),
    name: z.string(),
  }),
});

export const techCategorySchema = z.object({
  _id: z.string(),
  name: z.string(),
  order: z.number(),
});

export const detailTechnologySchema = z.object({
  _id: z.string(),
  name: z.string(),
  iconPath: z.string(),
});

export const techReasonSchema = z.object({
  _id: z.string(),
  name: z.string(),
});

export const updateReasonSchema = z.object({
  _id: z.string(),
  name: z.string(),
});

export const techStackEntrySchema = z.object({
  category: techCategorySchema,
  reason: techReasonSchema.optional(),
  shortDescription: z.string(),
  longDescription: z.string(),
  technologies: z.array(detailTechnologySchema),
});

export const techUpdateEntrySchema = z.object({
  _id: z.string(),
  date: z.number(),
  description: z.string(),
  reason: updateReasonSchema,
  oldTechnology: detailTechnologySchema.optional(),
});

export const techUpdateGroupSchema = z.object({
  category: techCategorySchema,
  updates: z.array(techUpdateEntrySchema),
});

export const companyDetailsPageSchema = z.object({
  company: companyDetailsSchema,
  techStack: z.array(techStackEntrySchema),
  techUpdates: z.array(techUpdateGroupSchema),
});

export const usageLinkSchema = z.object({
  label: z.string(),
  url: z.string(),
});

export const userDetailsSchema = z.object({
  _id: z.string(),
  clerkUserId: z.string(),
  username: z.string(),
  name: z.string(),
  imageUrl: z.string(),
  description: z.string(),
  githubUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
  usageLinks: z.array(usageLinkSchema),
});

export const userDetailsPageSchema = z.object({
  user: userDetailsSchema,
  techStack: z.array(techStackEntrySchema),
  techUpdates: z.array(techUpdateGroupSchema),
});

interface TeaserIconOutput {
  icon: string;
  name: string;
}

interface CompanyCardOutput {
  description: string;
  icon: string;
  industry: string;
  name: string;
  slug: string;
  teaserIcons: TeaserIconOutput[];
}

interface UserStackCardOutput {
  description: string;
  imageUrl?: string;
  name: string;
  teaserIcons: TeaserIconOutput[];
  username: string;
}

interface CompanyDetailsOutput {
  company: {
    _id: Id<"company">;
    name: string;
    slug: string;
    logo: string;
    description: string;
    companyInfo: {
      size: string;
      website: string;
      hq: string;
    };
    industry: {
      _id: Id<"industry">;
      name: string;
    };
  };
  techStack: {
    category: {
      _id: Id<"techCategory">;
      name: string;
      order: number;
    };
    reason?:
      | {
          _id: Id<"techReason">;
          name: string;
        }
      | undefined;
    shortDescription: string;
    longDescription: string;
    technologies: {
      _id: Id<"technology">;
      name: string;
      iconPath: string;
    }[];
  }[];
  techUpdates: {
    category: {
      _id: Id<"techCategory">;
      name: string;
      order: number;
    };
    updates: {
      _id: Id<"techStackUpdate">;
      date: number;
      description: string;
      reason: {
        _id: Id<"updateReason">;
        name: string;
      };
      oldTechnology?:
        | {
            _id: Id<"technology">;
            name: string;
            iconPath: string;
          }
        | undefined;
    }[];
  }[];
}

interface UserDetailsOutput {
  techStack: {
    category: {
      _id: Id<"techCategory">;
      name: string;
      order: number;
    };
    reason?:
      | {
          _id: Id<"techReason">;
          name: string;
        }
      | undefined;
    shortDescription: string;
    longDescription: string;
    technologies: {
      _id: Id<"technology">;
      name: string;
      iconPath: string;
    }[];
  }[];
  techUpdates: {
    category: {
      _id: Id<"techCategory">;
      name: string;
      order: number;
    };
    updates: {
      _id: Id<"techStackUpdate">;
      date: number;
      description: string;
      reason: {
        _id: Id<"updateReason">;
        name: string;
      };
      oldTechnology?:
        | {
            _id: Id<"technology">;
            name: string;
            iconPath: string;
          }
        | undefined;
    }[];
  }[];
  user: {
    _id: Id<"userProfile">;
    clerkUserId: string;
    username: string;
    name: string;
    imageUrl: string;
    description: string;
    githubUrl?: string;
    twitterUrl?: string;
    linkedinUrl?: string;
    websiteUrl?: string;
    usageLinks: {
      label: string;
      url: string;
    }[];
  };
}

interface UserTechStackEditorDataOutput {
  categories: {
    _id: Id<"techCategory">;
    name: string;
    order: number;
    isActive: boolean;
    state: {
      techReasonId?: Id<"techReason">;
      shortDescription: string;
      longDescription: string;
      technologyIds: Id<"technology">[];
    };
  }[];
  categoryUpdates: {
    categoryId: Id<"techCategory">;
    updates: {
      _id: Id<"techStackUpdate">;
      oldTechnologyId: Id<"technology">;
      updateReasonId: Id<"updateReason">;
      description: string;
      date: number;
    }[];
  }[];
  profile: {
    description: string;
    githubUrl?: string;
    twitterUrl?: string;
    linkedinUrl?: string;
    websiteUrl?: string;
    usageLinks: {
      label: string;
      url: string;
    }[];
  };
  technologies: {
    _id: Id<"technology">;
    name: string;
    iconPath: string;
  }[];
  techReasons: {
    _id: Id<"techReason">;
    name: string;
  }[];
  updateReasons: {
    _id: Id<"updateReason">;
    name: string;
  }[];
}

interface CompanyTechStackEditorDataOutput {
  categories: {
    _id: Id<"techCategory">;
    name: string;
    order: number;
    isActive: boolean;
    state: {
      techReasonId?: Id<"techReason">;
      shortDescription: string;
      longDescription: string;
      technologyIds: Id<"technology">[];
    };
  }[];
  categoryUpdates: {
    categoryId: Id<"techCategory">;
    updates: {
      _id: Id<"techStackUpdate">;
      oldTechnologyId: Id<"technology">;
      updateReasonId: Id<"updateReason">;
      description: string;
      date: number;
    }[];
  }[];
  company: {
    name: string;
    logo: string;
    description: string;
    companyInfo: {
      size: string;
      website: string;
      hq: string;
    };
  };
  technologies: {
    _id: Id<"technology">;
    name: string;
    iconPath: string;
  }[];
  techReasons: {
    _id: Id<"techReason">;
    name: string;
  }[];
  updateReasons: {
    _id: Id<"updateReason">;
    name: string;
  }[];
}

const companyCardValidator = v.object({
  name: v.string(),
  description: v.string(),
  industry: v.string(),
  icon: v.string(),
  slug: v.string(),
  teaserIcons: v.array(
    v.object({
      name: v.string(),
      icon: v.string(),
    })
  ),
});

const userStackCardValidator = v.object({
  description: v.string(),
  imageUrl: v.optional(v.string()),
  name: v.string(),
  teaserIcons: v.array(
    v.object({
      name: v.string(),
      icon: v.string(),
    })
  ),
  username: v.string(),
});

const paginatedCompanyStackCardsValidator = v.object({
  cards: v.array(companyCardValidator),
  continueCursor: v.optional(v.string()),
  currentPage: v.number(),
  isDone: v.boolean(),
  isLimited: v.boolean(),
  totalCount: v.number(),
});

const paginatedUserStackCardsValidator = v.object({
  cards: v.array(userStackCardValidator),
  continueCursor: v.optional(v.string()),
  currentPage: v.number(),
  isDone: v.boolean(),
  totalCount: v.number(),
});

const stackListFilterOptionsValidator = v.object({
  industries: v.array(
    v.object({
      _id: v.id("industry"),
      name: v.string(),
    })
  ),
  technologies: v.array(
    v.object({
      name: v.string(),
      iconPath: v.string(),
    })
  ),
});

const companyDetailsValidator = v.object({
  _id: v.id("company"),
  name: v.string(),
  slug: v.string(),
  logo: v.string(),
  description: v.string(),
  verificationStatus: v.union(
    v.literal("public_data_only"),
    v.literal("verified")
  ),
  companyInfo: v.object({
    size: v.string(),
    website: v.string(),
    hq: v.string(),
  }),
  industry: v.object({
    _id: v.id("industry"),
    name: v.string(),
  }),
});

const companyStackDetailsValidator = v.object({
  techStack: v.array(
    v.object({
      category: v.object({
        _id: v.id("techCategory"),
        name: v.string(),
        order: v.number(),
      }),
      reason: v.optional(
        v.object({
          _id: v.id("techReason"),
          name: v.string(),
        })
      ),
      shortDescription: v.string(),
      longDescription: v.string(),
      technologies: v.array(
        v.object({
          _id: v.id("technology"),
          name: v.string(),
          iconPath: v.string(),
        })
      ),
    })
  ),
  techUpdates: v.array(
    v.object({
      category: v.object({
        _id: v.id("techCategory"),
        name: v.string(),
        order: v.number(),
      }),
      updates: v.array(
        v.object({
          _id: v.id("techStackUpdate"),
          date: v.number(),
          description: v.string(),
          reason: v.object({
            _id: v.id("updateReason"),
            name: v.string(),
          }),
          oldTechnology: v.optional(
            v.object({
              _id: v.id("technology"),
              name: v.string(),
              iconPath: v.string(),
            })
          ),
        })
      ),
    })
  ),
});

const userDetailsPageValidator = v.object({
  user: v.object({
    _id: v.id("userProfile"),
    clerkUserId: v.string(),
    username: v.string(),
    name: v.string(),
    imageUrl: v.string(),
    description: v.string(),
    githubUrl: v.optional(v.string()),
    twitterUrl: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    usageLinks: v.array(
      v.object({
        label: v.string(),
        url: v.string(),
      })
    ),
  }),
  techStack: v.array(
    v.object({
      category: v.object({
        _id: v.id("techCategory"),
        name: v.string(),
        order: v.number(),
      }),
      reason: v.optional(
        v.object({
          _id: v.id("techReason"),
          name: v.string(),
        })
      ),
      shortDescription: v.string(),
      longDescription: v.string(),
      technologies: v.array(
        v.object({
          _id: v.id("technology"),
          name: v.string(),
          iconPath: v.string(),
        })
      ),
    })
  ),
  techUpdates: v.array(
    v.object({
      category: v.object({
        _id: v.id("techCategory"),
        name: v.string(),
        order: v.number(),
      }),
      updates: v.array(
        v.object({
          _id: v.id("techStackUpdate"),
          date: v.number(),
          description: v.string(),
          reason: v.object({
            _id: v.id("updateReason"),
            name: v.string(),
          }),
          oldTechnology: v.optional(
            v.object({
              _id: v.id("technology"),
              name: v.string(),
              iconPath: v.string(),
            })
          ),
        })
      ),
    })
  ),
});

const usernameRouteResolutionValidator = v.union(
  v.object({
    status: v.literal("resolved"),
    username: v.string(),
  }),
  v.object({
    status: v.literal("redirect"),
    username: v.string(),
  }),
  v.object({
    status: v.literal("not_found"),
  })
);

const userTechStackEditorDataValidator = v.object({
  profile: v.object({
    description: v.string(),
    githubUrl: v.optional(v.string()),
    twitterUrl: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    usageLinks: v.array(
      v.object({
        label: v.string(),
        url: v.string(),
      })
    ),
  }),
  categories: v.array(
    v.object({
      _id: v.id("techCategory"),
      name: v.string(),
      order: v.number(),
      isActive: v.boolean(),
      state: v.object({
        techReasonId: v.optional(v.id("techReason")),
        shortDescription: v.string(),
        longDescription: v.string(),
        technologyIds: v.array(v.id("technology")),
      }),
    })
  ),
  techReasons: v.array(
    v.object({
      _id: v.id("techReason"),
      name: v.string(),
    })
  ),
  updateReasons: v.array(
    v.object({
      _id: v.id("updateReason"),
      name: v.string(),
    })
  ),
  categoryUpdates: v.array(
    v.object({
      categoryId: v.id("techCategory"),
      updates: v.array(
        v.object({
          _id: v.id("techStackUpdate"),
          oldTechnologyId: v.id("technology"),
          updateReasonId: v.id("updateReason"),
          description: v.string(),
          date: v.number(),
        })
      ),
    })
  ),
  technologies: v.array(
    v.object({
      _id: v.id("technology"),
      name: v.string(),
      iconPath: v.string(),
    })
  ),
});

const companyTechStackEditorDataValidator = v.object({
  company: v.object({
    name: v.string(),
    logo: v.string(),
    description: v.string(),
    companyInfo: v.object({
      size: v.string(),
      website: v.string(),
      hq: v.string(),
    }),
  }),
  categories: v.array(
    v.object({
      _id: v.id("techCategory"),
      name: v.string(),
      order: v.number(),
      isActive: v.boolean(),
      state: v.object({
        techReasonId: v.optional(v.id("techReason")),
        shortDescription: v.string(),
        longDescription: v.string(),
        technologyIds: v.array(v.id("technology")),
      }),
    })
  ),
  techReasons: v.array(
    v.object({
      _id: v.id("techReason"),
      name: v.string(),
    })
  ),
  updateReasons: v.array(
    v.object({
      _id: v.id("updateReason"),
      name: v.string(),
    })
  ),
  categoryUpdates: v.array(
    v.object({
      categoryId: v.id("techCategory"),
      updates: v.array(
        v.object({
          _id: v.id("techStackUpdate"),
          oldTechnologyId: v.id("technology"),
          updateReasonId: v.id("updateReason"),
          description: v.string(),
          date: v.number(),
        })
      ),
    })
  ),
  technologies: v.array(
    v.object({
      _id: v.id("technology"),
      name: v.string(),
      iconPath: v.string(),
    })
  ),
});

type CompanyDoc = Doc<"company">;
type IndustryDoc = Doc<"industry">;
type StackOwnerDoc = Doc<"stackOwner">;
type UserProfileDoc = Doc<"userProfile">;
type TechCategoryDoc = Doc<"techCategory">;
type TechReasonDoc = Doc<"techReason">;
type TechStackItemDoc = Doc<"techStackItem">;
type TechnologyDoc = Doc<"technology">;
type UpdateReasonDoc = Doc<"updateReason">;
type UsernameRedirectDoc = Doc<"usernameRedirect">;

const SHORT_DESCRIPTION_MAX_CHARS = 250;
const MAX_USERNAME_REDIRECT_HOPS = 10;
const COMPANY_TECH_STACK_ADMIN_METADATA_KEY = "company_tech_stack_admin";
const DEFAULT_STACK_LIST_LIMIT = 12;
const MAX_STACK_LIST_LIMIT = 48;

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

function hasCompanyTechStackAdminAccess(
  identity: Record<string, unknown>
): boolean {
  const directValue = getBooleanMetadataField(
    identity,
    COMPANY_TECH_STACK_ADMIN_METADATA_KEY
  );
  if (directValue !== undefined) {
    return directValue;
  }

  const publicMetadataSnake = getBooleanMetadataField(
    identity.public_metadata,
    COMPANY_TECH_STACK_ADMIN_METADATA_KEY
  );
  if (publicMetadataSnake !== undefined) {
    return publicMetadataSnake;
  }

  const publicMetadataCamel = getBooleanMetadataField(
    identity.publicMetadata,
    COMPANY_TECH_STACK_ADMIN_METADATA_KEY
  );
  if (publicMetadataCamel !== undefined) {
    return publicMetadataCamel;
  }

  return false;
}

function toShortDescription(value: string): string {
  return value.slice(0, SHORT_DESCRIPTION_MAX_CHARS);
}

function normalizeUsername(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  if (normalized === undefined || normalized.length === 0) {
    return undefined;
  }
  return normalized;
}

function normalizeSearchValue(value: string | undefined): string | undefined {
  const normalized = value?.trim().toLowerCase();
  if (normalized === undefined || normalized.length === 0) {
    return undefined;
  }
  return normalized;
}

function normalizeTechnologyIconPaths(values: string[] | undefined): string[] {
  if (values === undefined) {
    return [];
  }
  return Array.from(
    new Set(
      values.map((value) => value.trim()).filter((value) => value.length > 0)
    )
  );
}

function clampStackListLimit(limit: number | undefined): number {
  if (limit === undefined || Number.isNaN(limit) || !Number.isFinite(limit)) {
    return DEFAULT_STACK_LIST_LIMIT;
  }
  return Math.min(Math.max(Math.trunc(limit), 1), MAX_STACK_LIST_LIMIT);
}

function parseStackListCursor(cursor: string | undefined): number {
  if (cursor === undefined) {
    return 0;
  }
  const parsed = Number.parseInt(cursor, 10);
  if (Number.isNaN(parsed) || parsed < 0) {
    return 0;
  }
  return parsed;
}

function paginateArray<T>(
  values: T[],
  cursor: string | undefined,
  limit: number
): {
  page: T[];
  continueCursor?: string;
  isDone: boolean;
  start: number;
} {
  const start = parseStackListCursor(cursor);
  const end = Math.min(start + limit, values.length);
  const page = values.slice(start, end);
  const isDone = end >= values.length;
  return {
    page,
    continueCursor: isDone ? undefined : String(end),
    isDone,
    start,
  };
}

async function getStackOwnerIdsForTechnologyFilters(
  ctx: QueryCtx,
  technologyIconPaths: string[]
): Promise<Set<Id<"stackOwner">> | null> {
  if (technologyIconPaths.length === 0) {
    return null;
  }

  const ownerSets: Set<Id<"stackOwner">>[] = [];
  for (const iconPath of technologyIconPaths) {
    const technology = await ctx.db
      .query("technology")
      .withIndex("by_icon_path", (q) => q.eq("iconPath", iconPath))
      .unique();

    if (technology === null) {
      return new Set();
    }

    const stackItems = await ctx.db
      .query("techStackItem")
      .withIndex("by_technology_id_and_owner_id", (q) =>
        q.eq("technologyId", technology._id)
      )
      .collect();
    ownerSets.push(new Set(stackItems.map((item) => item.ownerId)));
  }

  const [initialSet, ...restSets] = ownerSets;
  const intersection = new Set(initialSet);
  for (const ownerId of intersection) {
    for (const set of restSets) {
      if (!set.has(ownerId)) {
        intersection.delete(ownerId);
        break;
      }
    }
  }

  return intersection;
}

async function getCompanyBySlug(
  ctx: QueryCtx,
  slug: string
): Promise<CompanyDoc | null> {
  return await ctx.db
    .query("company")
    .withIndex("by_slug", (q) => q.eq("slug", slug))
    .unique();
}

async function getRequiredCompanyBySlug(
  ctx: QueryCtx,
  slug: string
): Promise<CompanyDoc> {
  const company = await getCompanyBySlug(ctx, slug);
  if (company === null) {
    throw new Error(`Company not found for slug "${slug}"`);
  }
  return company;
}

async function getRequiredIndustry(
  ctx: QueryCtx,
  industryId: Id<"industry">
): Promise<IndustryDoc> {
  const industry = await ctx.db.get(industryId);
  if (industry === null) {
    throw new Error(`Industry not found for id "${industryId}"`);
  }
  return industry;
}

async function getRequiredStackOwnerForCompany(
  ctx: QueryCtx,
  companyId: Id<"company">
): Promise<StackOwnerDoc> {
  const owner = await ctx.db
    .query("stackOwner")
    .withIndex("by_company_id", (q) => q.eq("companyId", companyId))
    .unique();
  if (owner === null) {
    throw new Error(`Stack owner not found for company "${companyId}"`);
  }
  return owner;
}

async function getUserProfileByUsername(
  ctx: QueryCtx,
  username: string
): Promise<UserProfileDoc | null> {
  return await ctx.db
    .query("userProfile")
    .withIndex("by_username", (q) => q.eq("username", username))
    .unique();
}

async function getRequiredUserProfileByUsername(
  ctx: QueryCtx,
  username: string
): Promise<UserProfileDoc> {
  const userProfile = await getUserProfileByUsername(ctx, username);
  if (userProfile === null) {
    throw new Error(`User profile not found for username "${username}"`);
  }
  return userProfile;
}

async function getRequiredStackOwnerForUserProfile(
  ctx: QueryCtx,
  userProfileId: Id<"userProfile">
): Promise<StackOwnerDoc> {
  const owner = await ctx.db
    .query("stackOwner")
    .withIndex("by_user_profile_id", (q) =>
      q.eq("userProfileId", userProfileId)
    )
    .unique();
  if (owner === null) {
    throw new Error(
      `Stack owner not found for user profile "${userProfileId}"`
    );
  }
  return owner;
}

async function getStackOwnerForUserProfile(
  ctx: QueryCtx,
  userProfileId: Id<"userProfile">
): Promise<StackOwnerDoc | null> {
  return await ctx.db
    .query("stackOwner")
    .withIndex("by_user_profile_id", (q) =>
      q.eq("userProfileId", userProfileId)
    )
    .unique();
}

async function getUserProfileByClerkUserId(
  ctx: QueryCtx,
  clerkUserId: string
): Promise<UserProfileDoc | null> {
  return await ctx.db
    .query("userProfile")
    .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", clerkUserId))
    .unique();
}

async function getUsernameRedirectByOldUsername(
  ctx: QueryCtx,
  oldUsername: string
): Promise<UsernameRedirectDoc | null> {
  return await ctx.db
    .query("usernameRedirect")
    .withIndex("by_old_username", (q) => q.eq("oldUsername", oldUsername))
    .unique();
}

async function resolveUsernameRedirectChain(
  ctx: QueryCtx,
  username: string
): Promise<{ finalUsername: string; visited: string[]; hasRedirect: boolean }> {
  const visited = new Set<string>();
  const history: string[] = [];
  let currentUsername = username;

  for (let hop = 0; hop < MAX_USERNAME_REDIRECT_HOPS; hop += 1) {
    if (visited.has(currentUsername)) {
      break;
    }
    visited.add(currentUsername);
    history.push(currentUsername);

    const redirect = await getUsernameRedirectByOldUsername(
      ctx,
      currentUsername
    );
    if (redirect === null) {
      return {
        finalUsername: currentUsername,
        visited: history,
        hasRedirect: currentUsername !== username,
      };
    }

    if (redirect.newUsername === currentUsername) {
      break;
    }

    currentUsername = redirect.newUsername;
  }

  return {
    finalUsername: currentUsername,
    visited: history,
    hasRedirect: currentUsername !== username,
  };
}

async function buildCompanyCard(
  ctx: QueryCtx,
  company: CompanyDoc
): Promise<CompanyCardOutput> {
  const [industry, owner] = await Promise.all([
    getRequiredIndustry(ctx, company.industryId),
    getRequiredStackOwnerForCompany(ctx, company._id),
  ]);

  const [categoryLinks, stackItems] = await Promise.all([
    ctx.db
      .query("techStackCategoryLink")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", owner._id))
      .collect(),
    ctx.db
      .query("techStackItem")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", owner._id))
      .collect(),
  ]);

  const categoryMap = await getRequiredTechCategoryMap(
    ctx,
    categoryLinks.map((link) => link.categoryId)
  );

  const firstFiveCategoryIds = categoryLinks
    .map((link) => categoryMap.get(link.categoryId))
    .filter((category): category is TechCategoryDoc => category !== undefined)
    .sort((a, b) => a.order - b.order)
    .slice(0, 5)
    .map((category) => category._id);

  const teaserItemByCategory = new Map<Id<"techCategory">, TechStackItemDoc>();
  for (const item of stackItems) {
    if (!firstFiveCategoryIds.includes(item.techCategoryId)) {
      continue;
    }
    const existing = teaserItemByCategory.get(item.techCategoryId);
    if (existing === undefined) {
      teaserItemByCategory.set(item.techCategoryId, item);
      continue;
    }

    const existingOrder = existing.order ?? Number.MAX_SAFE_INTEGER;
    const itemOrder = item.order ?? Number.MAX_SAFE_INTEGER;
    if (
      itemOrder < existingOrder ||
      (itemOrder === existingOrder &&
        item._creationTime < existing._creationTime)
    ) {
      teaserItemByCategory.set(item.techCategoryId, item);
    }
  }

  const teaserItems = firstFiveCategoryIds
    .map((categoryId) => teaserItemByCategory.get(categoryId))
    .filter((item): item is TechStackItemDoc => item !== undefined);

  const teaserIcons = (
    await Promise.all(
      teaserItems.map(async (item) => {
        const technology = await ctx.db.get(item.technologyId);
        if (technology === null) {
          return null;
        }
        return {
          name: technology.name,
          icon: technology.iconPath,
        };
      })
    )
  ).filter((item): item is TeaserIconOutput => item !== null);

  const card: CompanyCardOutput = {
    name: company.name,
    description: company.description,
    industry: industry.name,
    icon: company.logo,
    slug: company.slug,
    teaserIcons,
  };
  return card;
}

async function buildUserCard(
  ctx: QueryCtx,
  userProfile: UserProfileDoc
): Promise<UserStackCardOutput> {
  const owner = await getStackOwnerForUserProfile(ctx, userProfile._id);
  if (owner === null) {
    return {
      name: userProfile.name?.trim() || userProfile.username,
      username: userProfile.username,
      description: userProfile.description ?? "",
      imageUrl: userProfile.imageUrl,
      teaserIcons: [],
    };
  }

  const [categoryLinks, stackItems] = await Promise.all([
    ctx.db
      .query("techStackCategoryLink")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", owner._id))
      .collect(),
    ctx.db
      .query("techStackItem")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", owner._id))
      .collect(),
  ]);

  const categoryMap = await getRequiredTechCategoryMap(
    ctx,
    categoryLinks.map((link) => link.categoryId)
  );

  const firstFiveCategoryIds = categoryLinks
    .map((link) => categoryMap.get(link.categoryId))
    .filter((category): category is TechCategoryDoc => category !== undefined)
    .sort((a, b) => a.order - b.order)
    .slice(0, 5)
    .map((category) => category._id);

  const teaserItemByCategory = new Map<Id<"techCategory">, TechStackItemDoc>();
  for (const item of stackItems) {
    if (!firstFiveCategoryIds.includes(item.techCategoryId)) {
      continue;
    }
    const existing = teaserItemByCategory.get(item.techCategoryId);
    if (existing === undefined) {
      teaserItemByCategory.set(item.techCategoryId, item);
      continue;
    }

    const existingOrder = existing.order ?? Number.MAX_SAFE_INTEGER;
    const itemOrder = item.order ?? Number.MAX_SAFE_INTEGER;
    if (
      itemOrder < existingOrder ||
      (itemOrder === existingOrder &&
        item._creationTime < existing._creationTime)
    ) {
      teaserItemByCategory.set(item.techCategoryId, item);
    }
  }

  const teaserItems = firstFiveCategoryIds
    .map((categoryId) => teaserItemByCategory.get(categoryId))
    .filter((item): item is TechStackItemDoc => item !== undefined);

  const teaserIcons = (
    await Promise.all(
      teaserItems.map(async (item) => {
        const technology = await ctx.db.get(item.technologyId);
        if (technology === null) {
          return null;
        }
        return {
          name: technology.name,
          icon: technology.iconPath,
        };
      })
    )
  ).filter((item): item is TeaserIconOutput => item !== null);

  return {
    name: userProfile.name?.trim() || userProfile.username,
    username: userProfile.username,
    description: userProfile.description ?? "",
    imageUrl: userProfile.imageUrl,
    teaserIcons,
  };
}

async function getRequiredTechCategoryMap(
  ctx: QueryCtx,
  categoryIds: Id<"techCategory">[]
): Promise<Map<Id<"techCategory">, TechCategoryDoc>> {
  const uniqueCategoryIds = Array.from(new Set(categoryIds));
  const categories = await Promise.all(
    uniqueCategoryIds.map((categoryId) => ctx.db.get(categoryId))
  );

  const categoryMap: Map<Id<"techCategory">, TechCategoryDoc> = new Map();
  for (const category of categories) {
    if (category !== null) {
      categoryMap.set(category._id, category);
    }
  }

  for (const categoryId of uniqueCategoryIds) {
    if (!categoryMap.has(categoryId)) {
      throw new Error(`Tech category not found for id "${categoryId}"`);
    }
  }

  return categoryMap;
}

async function getRequiredTechReasonMap(
  ctx: QueryCtx,
  reasonIds: Id<"techReason">[]
): Promise<Map<Id<"techReason">, TechReasonDoc>> {
  const uniqueReasonIds = Array.from(new Set(reasonIds));
  const reasons = await Promise.all(
    uniqueReasonIds.map((reasonId) => ctx.db.get(reasonId))
  );

  const reasonMap: Map<Id<"techReason">, TechReasonDoc> = new Map();
  for (const reason of reasons) {
    if (reason !== null) {
      reasonMap.set(reason._id, reason);
    }
  }

  for (const reasonId of uniqueReasonIds) {
    if (!reasonMap.has(reasonId)) {
      throw new Error(`Tech reason not found for id "${reasonId}"`);
    }
  }

  return reasonMap;
}

async function getRequiredTechnologyMap(
  ctx: QueryCtx,
  technologyIds: Id<"technology">[]
): Promise<Map<Id<"technology">, TechnologyDoc>> {
  const uniqueTechnologyIds = Array.from(new Set(technologyIds));
  const technologies = await Promise.all(
    uniqueTechnologyIds.map((technologyId) => ctx.db.get(technologyId))
  );

  const technologyMap: Map<Id<"technology">, TechnologyDoc> = new Map();
  for (const technology of technologies) {
    if (technology !== null) {
      technologyMap.set(technology._id, technology);
    }
  }

  for (const technologyId of uniqueTechnologyIds) {
    if (!technologyMap.has(technologyId)) {
      throw new Error(`Technology not found for id "${technologyId}"`);
    }
  }

  return technologyMap;
}

async function getRequiredUpdateReasonMap(
  ctx: QueryCtx,
  reasonIds: Id<"updateReason">[]
): Promise<Map<Id<"updateReason">, UpdateReasonDoc>> {
  const uniqueReasonIds = Array.from(new Set(reasonIds));
  const reasons = await Promise.all(
    uniqueReasonIds.map((reasonId) => ctx.db.get(reasonId))
  );

  const reasonMap: Map<Id<"updateReason">, UpdateReasonDoc> = new Map();
  for (const reason of reasons) {
    if (reason !== null) {
      reasonMap.set(reason._id, reason);
    }
  }

  for (const reasonId of uniqueReasonIds) {
    if (!reasonMap.has(reasonId)) {
      throw new Error(`Update reason not found for id "${reasonId}"`);
    }
  }

  return reasonMap;
}

async function buildCompanyDetailsPage(
  ctx: QueryCtx,
  company: CompanyDoc
): Promise<CompanyDetailsOutput> {
  const [industry, owner] = await Promise.all([
    getRequiredIndustry(ctx, company.industryId),
    getRequiredStackOwnerForCompany(ctx, company._id),
  ]);

  const categoryLinks = await ctx.db
    .query("techStackCategoryLink")
    .withIndex("by_owner_id", (q) => q.eq("ownerId", owner._id))
    .collect();

  const techCategoryMap = await getRequiredTechCategoryMap(
    ctx,
    categoryLinks.map((link) => link.categoryId)
  );
  const techReasonMap = await getRequiredTechReasonMap(
    ctx,
    categoryLinks
      .map((link) => link.techReasonId)
      .filter(
        (reasonId): reasonId is Id<"techReason"> => reasonId !== undefined
      )
  );

  const sortedCategoryLinks = [...categoryLinks].sort((a, b) => {
    const categoryA = techCategoryMap.get(a.categoryId);
    const categoryB = techCategoryMap.get(b.categoryId);
    if (categoryA === undefined || categoryB === undefined) {
      return 0;
    }
    return categoryA.order - categoryB.order;
  });

  const techStack = await Promise.all(
    sortedCategoryLinks.map(async (categoryLink) => {
      const category = techCategoryMap.get(categoryLink.categoryId);
      const reason =
        categoryLink.techReasonId === undefined
          ? undefined
          : techReasonMap.get(categoryLink.techReasonId);
      if (category === undefined) {
        throw new Error("Missing category for tech stack entry");
      }
      if (categoryLink.techReasonId !== undefined && reason === undefined) {
        throw new Error("Missing reason for tech stack entry");
      }

      const stackItems = await ctx.db
        .query("techStackItem")
        .withIndex("by_owner_id_and_tech_category_id", (q) =>
          q.eq("ownerId", owner._id).eq("techCategoryId", category._id)
        )
        .collect();

      const orderedStackItems = [...stackItems].sort((a, b) => {
        const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
        const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
        if (orderA === orderB) {
          return a._creationTime - b._creationTime;
        }
        return orderA - orderB;
      });

      const technologyMap = await getRequiredTechnologyMap(
        ctx,
        orderedStackItems.map((item) => item.technologyId)
      );

      return {
        category: {
          _id: category._id,
          name: category.name,
          order: category.order,
        },
        reason:
          reason === undefined
            ? undefined
            : {
                _id: reason._id,
                name: reason.name,
              },
        shortDescription: toShortDescription(
          (categoryLink as { shortDescription?: string }).shortDescription ??
            (categoryLink as { description?: string }).description ??
            ""
        ),
        longDescription:
          (categoryLink as { longDescription?: string }).longDescription ??
          (categoryLink as { description?: string }).description ??
          "",
        technologies: orderedStackItems.map((item) => {
          const technology = technologyMap.get(item.technologyId);
          if (technology === undefined) {
            throw new Error(
              `Technology not found for id "${item.technologyId}"`
            );
          }
          return {
            _id: technology._id,
            name: technology.name,
            iconPath: technology.iconPath,
          };
        }),
      };
    })
  );

  const updatesByCategory = await Promise.all(
    sortedCategoryLinks.map(async (categoryLink) => {
      const updates = await ctx.db
        .query("techStackUpdate")
        .withIndex("by_owner_id_and_category_id", (q) =>
          q.eq("ownerId", owner._id).eq("categoryId", categoryLink.categoryId)
        )
        .collect();

      const orderedUpdates = [...updates].sort((a, b) => b.date - a.date);
      const updateReasonMap = await getRequiredUpdateReasonMap(
        ctx,
        orderedUpdates.map((update) => update.updateReasonId)
      );

      const oldTechnologyIds = orderedUpdates
        .map((update) => update.oldTechnologyId)
        .filter(
          (id): id is Id<"technology"> => id !== undefined && id !== null
        );
      const technologyMap = await getRequiredTechnologyMap(
        ctx,
        oldTechnologyIds
      );

      return {
        categoryId: categoryLink.categoryId,
        updates: orderedUpdates.map((update) => {
          const reason = updateReasonMap.get(update.updateReasonId);
          if (reason === undefined) {
            throw new Error(
              `Update reason not found for id "${update.updateReasonId}"`
            );
          }

          const oldTechnology =
            update.oldTechnologyId === undefined
              ? undefined
              : technologyMap.get(update.oldTechnologyId);

          return {
            _id: update._id,
            date: update.date,
            description: update.description,
            reason: {
              _id: reason._id,
              name: reason.name,
            },
            oldTechnology:
              oldTechnology === undefined
                ? undefined
                : {
                    _id: oldTechnology._id,
                    name: oldTechnology.name,
                    iconPath: oldTechnology.iconPath,
                  },
          };
        }),
      };
    })
  );

  const techUpdates = sortedCategoryLinks.map((categoryLink) => {
    const category = techCategoryMap.get(categoryLink.categoryId);
    if (category === undefined) {
      throw new Error(
        `Tech category not found for id "${categoryLink.categoryId}"`
      );
    }

    const updateEntry = updatesByCategory.find(
      (entry) => entry.categoryId === categoryLink.categoryId
    );

    return {
      category: {
        _id: category._id,
        name: category.name,
        order: category.order,
      },
      updates: updateEntry?.updates ?? [],
    };
  });

  const detailsPage: CompanyDetailsOutput = {
    company: {
      _id: company._id,
      name: company.name,
      slug: company.slug,
      logo: company.logo,
      description: company.description,
      companyInfo: company.companyInfo,
      industry: {
        _id: industry._id,
        name: industry.name,
      },
    },
    techStack,
    techUpdates,
  };
  return detailsPage;
}

async function buildUserDetailsPage(
  ctx: QueryCtx,
  userProfile: UserProfileDoc
): Promise<UserDetailsOutput> {
  const owner = await getRequiredStackOwnerForUserProfile(ctx, userProfile._id);

  const categoryLinks = await ctx.db
    .query("techStackCategoryLink")
    .withIndex("by_owner_id", (q) => q.eq("ownerId", owner._id))
    .collect();

  const techCategoryMap = await getRequiredTechCategoryMap(
    ctx,
    categoryLinks.map((link) => link.categoryId)
  );
  const techReasonMap = await getRequiredTechReasonMap(
    ctx,
    categoryLinks
      .map((link) => link.techReasonId)
      .filter(
        (reasonId): reasonId is Id<"techReason"> => reasonId !== undefined
      )
  );

  const sortedCategoryLinks = [...categoryLinks].sort((a, b) => {
    const categoryA = techCategoryMap.get(a.categoryId);
    const categoryB = techCategoryMap.get(b.categoryId);
    if (categoryA === undefined || categoryB === undefined) {
      return 0;
    }
    return categoryA.order - categoryB.order;
  });

  const techStack = await Promise.all(
    sortedCategoryLinks.map(async (categoryLink) => {
      const category = techCategoryMap.get(categoryLink.categoryId);
      const reason =
        categoryLink.techReasonId === undefined
          ? undefined
          : techReasonMap.get(categoryLink.techReasonId);
      if (category === undefined) {
        throw new Error("Missing category for tech stack entry");
      }
      if (categoryLink.techReasonId !== undefined && reason === undefined) {
        throw new Error("Missing reason for tech stack entry");
      }

      const stackItems = await ctx.db
        .query("techStackItem")
        .withIndex("by_owner_id_and_tech_category_id", (q) =>
          q.eq("ownerId", owner._id).eq("techCategoryId", category._id)
        )
        .collect();

      const orderedStackItems = [...stackItems].sort((a, b) => {
        const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
        const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
        if (orderA === orderB) {
          return a._creationTime - b._creationTime;
        }
        return orderA - orderB;
      });

      const technologyMap = await getRequiredTechnologyMap(
        ctx,
        orderedStackItems.map((item) => item.technologyId)
      );

      return {
        category: {
          _id: category._id,
          name: category.name,
          order: category.order,
        },
        reason:
          reason === undefined
            ? undefined
            : {
                _id: reason._id,
                name: reason.name,
              },
        shortDescription: toShortDescription(
          categoryLink.shortDescription ?? ""
        ),
        longDescription: categoryLink.longDescription ?? "",
        technologies: orderedStackItems.map((item) => {
          const technology = technologyMap.get(item.technologyId);
          if (technology === undefined) {
            throw new Error(
              `Technology not found for id "${item.technologyId}"`
            );
          }
          return {
            _id: technology._id,
            name: technology.name,
            iconPath: technology.iconPath,
          };
        }),
      };
    })
  );

  const updatesByCategory = await Promise.all(
    sortedCategoryLinks.map(async (categoryLink) => {
      const updates = await ctx.db
        .query("techStackUpdate")
        .withIndex("by_owner_id_and_category_id", (q) =>
          q.eq("ownerId", owner._id).eq("categoryId", categoryLink.categoryId)
        )
        .collect();

      const orderedUpdates = [...updates].sort((a, b) => b.date - a.date);
      const updateReasonMap = await getRequiredUpdateReasonMap(
        ctx,
        orderedUpdates.map((update) => update.updateReasonId)
      );

      const oldTechnologyIds = orderedUpdates
        .map((update) => update.oldTechnologyId)
        .filter(
          (id): id is Id<"technology"> => id !== undefined && id !== null
        );
      const technologyMap = await getRequiredTechnologyMap(
        ctx,
        oldTechnologyIds
      );

      return {
        categoryId: categoryLink.categoryId,
        updates: orderedUpdates.map((update) => {
          const reason = updateReasonMap.get(update.updateReasonId);
          if (reason === undefined) {
            throw new Error(
              `Update reason not found for id "${update.updateReasonId}"`
            );
          }

          const oldTechnology =
            update.oldTechnologyId === undefined
              ? undefined
              : technologyMap.get(update.oldTechnologyId);

          return {
            _id: update._id,
            date: update.date,
            description: update.description,
            reason: {
              _id: reason._id,
              name: reason.name,
            },
            oldTechnology:
              oldTechnology === undefined
                ? undefined
                : {
                    _id: oldTechnology._id,
                    name: oldTechnology.name,
                    iconPath: oldTechnology.iconPath,
                  },
          };
        }),
      };
    })
  );

  const techUpdates = sortedCategoryLinks.map((categoryLink) => {
    const category = techCategoryMap.get(categoryLink.categoryId);
    if (category === undefined) {
      throw new Error(
        `Tech category not found for id "${categoryLink.categoryId}"`
      );
    }

    const updateEntry = updatesByCategory.find(
      (entry) => entry.categoryId === categoryLink.categoryId
    );

    return {
      category: {
        _id: category._id,
        name: category.name,
        order: category.order,
      },
      updates: updateEntry?.updates ?? [],
    };
  });

  const detailsPage: UserDetailsOutput = {
    user: {
      _id: userProfile._id,
      clerkUserId: userProfile.clerkUserId,
      username: userProfile.username,
      name: userProfile.name ?? userProfile.username,
      imageUrl: userProfile.imageUrl ?? "/icons/company/github.svg",
      description: userProfile.description ?? "",
      githubUrl: userProfile.githubUrl,
      twitterUrl: userProfile.twitterUrl,
      linkedinUrl: userProfile.linkedinUrl,
      websiteUrl: userProfile.websiteUrl,
      usageLinks: userProfile.usageLinks ?? [],
    },
    techStack,
    techUpdates,
  };
  return detailsPage;
}

export const getCompanyCardBySlug = query({
  args: {
    slug: v.string(),
  },
  returns: companyCardValidator,
  handler: async (ctx, args) => {
    const company = await getRequiredCompanyBySlug(ctx, args.slug);
    return await buildCompanyCard(ctx, company);
  },
});

export const getCompanyCardsBySlugs = query({
  args: {
    slugs: v.array(v.string()),
  },
  returns: v.array(companyCardValidator),
  handler: async (ctx, args) => {
    const cards: CompanyCardOutput[] = [];

    for (const slug of args.slugs) {
      const company = await getCompanyBySlug(ctx, slug);
      if (company !== null) {
        cards.push(await buildCompanyCard(ctx, company));
      }
    }

    return cards;
  },
});

export const getFeaturedCompanyCards = query({
  args: {},
  returns: v.array(companyCardValidator),
  handler: async (ctx) => {
    const companies = await ctx.db
      .query("company")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .take(4);

    const cards: CompanyCardOutput[] = [];
    for (const company of companies) {
      cards.push(await buildCompanyCard(ctx, company));
    }
    return cards;
  },
});

export const getStackListFilterOptions = query({
  args: {},
  returns: stackListFilterOptionsValidator,
  handler: async (ctx) => {
    const [industries, technologies] = await Promise.all([
      ctx.db.query("industry").collect(),
      ctx.db.query("technology").collect(),
    ]);

    return {
      industries: [...industries]
        .map((industry) => ({
          _id: industry._id,
          name: industry.name,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
      technologies: [...technologies]
        .map((technology) => ({
          name: technology.name,
          iconPath: technology.iconPath,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    };
  },
});

export const listCompanyStackCards = query({
  args: {
    cursor: v.optional(v.string()),
    industryId: v.optional(v.id("industry")),
    limit: v.optional(v.number()),
    search: v.optional(v.string()),
    technologyIconPaths: v.optional(v.array(v.string())),
  },
  returns: paginatedCompanyStackCardsValidator,
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const isSignedIn = identity !== null;
    const normalizedSearch = normalizeSearchValue(args.search);
    const technologyIconPaths = normalizeTechnologyIconPaths(
      args.technologyIconPaths
    );
    const limit = clampStackListLimit(args.limit);

    const baseCompanies =
      args.industryId === undefined
        ? await ctx.db.query("company").collect()
        : await ctx.db
            .query("company")
            .withIndex("by_industry_id", (q) =>
              q.eq("industryId", args.industryId as Id<"industry">)
            )
            .collect();

    const allowedByTechnology = await getStackOwnerIdsForTechnologyFilters(
      ctx,
      technologyIconPaths
    );
    const companyIdsForTechnologyFilter = new Set<Id<"company">>();
    if (allowedByTechnology !== null) {
      const owners = await Promise.all(
        [...allowedByTechnology].map((ownerId) => ctx.db.get(ownerId))
      );
      for (const owner of owners) {
        if (owner?.companyId !== undefined) {
          companyIdsForTechnologyFilter.add(owner.companyId);
        }
      }
    }

    const filteredCompanies = baseCompanies
      .filter((company) => (isSignedIn ? true : company.featured === true))
      .filter((company) =>
        normalizedSearch
          ? `${company.name} ${company.slug}`
              .toLowerCase()
              .includes(normalizedSearch)
          : true
      )
      .filter((company) =>
        allowedByTechnology === null
          ? true
          : companyIdsForTechnologyFilter.has(company._id)
      )
      .sort((a, b) => a.name.localeCompare(b.name));

    const { page, continueCursor, isDone, start } = paginateArray(
      filteredCompanies,
      args.cursor,
      limit
    );
    const cards = await Promise.all(
      page.map(async (company) => await buildCompanyCard(ctx, company))
    );

    return {
      cards,
      continueCursor,
      currentPage: Math.floor(start / limit) + 1,
      isDone,
      isLimited: !isSignedIn,
      totalCount: filteredCompanies.length,
    };
  },
});

export const listUserStackCards = query({
  args: {
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
    search: v.optional(v.string()),
    technologyIconPaths: v.optional(v.array(v.string())),
  },
  returns: paginatedUserStackCardsValidator,
  handler: async (ctx, args) => {
    const normalizedSearch = normalizeSearchValue(args.search);
    const technologyIconPaths = normalizeTechnologyIconPaths(
      args.technologyIconPaths
    );
    const limit = clampStackListLimit(args.limit);

    const [profiles, allowedByTechnology] = await Promise.all([
      ctx.db.query("userProfile").collect(),
      getStackOwnerIdsForTechnologyFilters(ctx, technologyIconPaths),
    ]);

    const userProfileIdsForTechnologyFilter = new Set<Id<"userProfile">>();
    if (allowedByTechnology !== null) {
      const owners = await Promise.all(
        [...allowedByTechnology].map((ownerId) => ctx.db.get(ownerId))
      );
      for (const owner of owners) {
        if (owner?.userProfileId !== undefined) {
          userProfileIdsForTechnologyFilter.add(owner.userProfileId);
        }
      }
    }

    const filteredProfiles = profiles
      .filter((profile) =>
        normalizedSearch
          ? `${profile.name ?? ""} ${profile.username}`
              .toLowerCase()
              .includes(normalizedSearch)
          : true
      )
      .filter((profile) =>
        allowedByTechnology === null
          ? true
          : userProfileIdsForTechnologyFilter.has(profile._id)
      )
      .sort((a, b) =>
        (a.name ?? a.username).localeCompare(b.name ?? b.username)
      );

    const { page, continueCursor, isDone, start } = paginateArray(
      filteredProfiles,
      args.cursor,
      limit
    );
    const cards = await Promise.all(
      page.map(async (profile) => await buildUserCard(ctx, profile))
    );

    return {
      cards,
      continueCursor,
      currentPage: Math.floor(start / limit) + 1,
      isDone,
      totalCount: filteredProfiles.length,
    };
  },
});

export const getCompanyDetailsBySlug = query({
  args: {
    slug: v.string(),
  },
  returns: v.union(companyDetailsValidator, v.null()),
  handler: async (ctx, args) => {
    const company = await getCompanyBySlug(ctx, args.slug);
    if (company === null) {
      return null;
    }

    const industry = await getRequiredIndustry(ctx, company.industryId);
    return {
      _id: company._id,
      name: company.name,
      slug: company.slug,
      logo: company.logo,
      description: company.description,
      verificationStatus: company.verificationStatus,
      companyInfo: company.companyInfo,
      industry: {
        _id: industry._id,
        name: industry.name,
      },
    };
  },
});

export const getCompanyStackDetailsBySlug = query({
  args: {
    slug: v.string(),
  },
  returns: v.union(companyStackDetailsValidator, v.null()),
  handler: async (ctx, args) => {
    const company = await getCompanyBySlug(ctx, args.slug);
    if (company === null) {
      return null;
    }

    const identity = await ctx.auth.getUserIdentity();
    if (identity === null && company.featured !== true) {
      return null;
    }

    const detailsPage = await buildCompanyDetailsPage(ctx, company);
    return {
      techStack: detailsPage.techStack,
      techUpdates: detailsPage.techUpdates,
    };
  },
});

export const getUserDetailsByUsername = query({
  args: {
    username: v.string(),
  },
  returns: userDetailsPageValidator,
  handler: async (ctx, args) => {
    const userProfile = await getRequiredUserProfileByUsername(
      ctx,
      args.username
    );
    return await buildUserDetailsPage(ctx, userProfile);
  },
});

export const resolveUserUsernameRoute = query({
  args: {
    username: v.string(),
  },
  returns: usernameRouteResolutionValidator,
  handler: async (ctx, args) => {
    const requestedUsername = normalizeUsername(args.username);
    if (requestedUsername === undefined) {
      return { status: "not_found" as const };
    }

    const resolution = await resolveUsernameRedirectChain(
      ctx,
      requestedUsername
    );
    let existingProfile = await getUserProfileByUsername(
      ctx,
      resolution.finalUsername
    );

    if (existingProfile === null) {
      for (const candidate of [...resolution.visited].reverse()) {
        const candidateProfile = await getUserProfileByUsername(ctx, candidate);
        if (candidateProfile !== null) {
          existingProfile = candidateProfile;
          break;
        }
      }
    }

    if (existingProfile === null) {
      return { status: "not_found" as const };
    }

    if (existingProfile.username !== requestedUsername) {
      return {
        status: "redirect" as const,
        username: existingProfile.username,
      };
    }

    return {
      status: "resolved" as const,
      username: existingProfile.username,
    };
  },
});

export const getUserTechStackEditorData = query({
  args: {
    username: v.string(),
  },
  returns: userTechStackEditorDataValidator,
  handler: async (ctx, args): Promise<UserTechStackEditorDataOutput> => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const requestedUsername = normalizeUsername(args.username);
    if (requestedUsername === undefined) {
      throw new Error("Username is required");
    }

    const [userProfile, currentUserProfile] = await Promise.all([
      getRequiredUserProfileByUsername(ctx, requestedUsername),
      getUserProfileByClerkUserId(ctx, identity.subject),
    ]);
    if (
      currentUserProfile === null ||
      currentUserProfile._id !== userProfile._id
    ) {
      throw new Error("Not authorized to edit this profile");
    }

    const owner = await getStackOwnerForUserProfile(ctx, userProfile._id);
    const [
      categories,
      techReasons,
      updateReasons,
      technologies,
      categoryLinks,
      stackItems,
      techStackUpdates,
    ] = await Promise.all([
      ctx.db.query("techCategory").collect(),
      ctx.db.query("techReason").collect(),
      ctx.db.query("updateReason").collect(),
      ctx.db.query("technology").collect(),
      owner === null
        ? Promise.resolve([])
        : ctx.db
            .query("techStackCategoryLink")
            .withIndex("by_owner_id", (q) => q.eq("ownerId", owner._id))
            .collect(),
      owner === null
        ? Promise.resolve([])
        : ctx.db
            .query("techStackItem")
            .withIndex("by_owner_id", (q) => q.eq("ownerId", owner._id))
            .collect(),
      owner === null
        ? Promise.resolve([])
        : ctx.db
            .query("techStackUpdate")
            .withIndex("by_owner_id", (q) => q.eq("ownerId", owner._id))
            .collect(),
    ]);

    const linkByCategoryId = new Map<
      Id<"techCategory">,
      (typeof categoryLinks)[number]
    >();
    for (const categoryLink of categoryLinks) {
      linkByCategoryId.set(categoryLink.categoryId, categoryLink);
    }

    const stackItemsByCategory = new Map<
      Id<"techCategory">,
      (typeof stackItems)[number][]
    >();
    for (const stackItem of stackItems) {
      const existingItems =
        stackItemsByCategory.get(stackItem.techCategoryId) ?? [];
      existingItems.push(stackItem);
      stackItemsByCategory.set(stackItem.techCategoryId, existingItems);
    }

    const sortedCategories = [...categories].sort((a, b) => a.order - b.order);
    const sortedTechReasons = [...techReasons].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const sortedUpdateReasons = [...updateReasons].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const sortedTechnologies = [...technologies].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const updatesByCategory = new Map<
      Id<"techCategory">,
      {
        _id: Id<"techStackUpdate">;
        oldTechnologyId: Id<"technology">;
        updateReasonId: Id<"updateReason">;
        description: string;
        date: number;
      }[]
    >();
    for (const update of techStackUpdates) {
      if (update.oldTechnologyId === undefined) {
        continue;
      }
      const existingUpdates = updatesByCategory.get(update.categoryId) ?? [];
      existingUpdates.push({
        _id: update._id,
        oldTechnologyId: update.oldTechnologyId,
        updateReasonId: update.updateReasonId,
        description: update.description,
        date: update.date,
      });
      updatesByCategory.set(update.categoryId, existingUpdates);
    }

    return {
      profile: {
        description: userProfile.description ?? "",
        githubUrl: userProfile.githubUrl,
        twitterUrl: userProfile.twitterUrl,
        linkedinUrl: userProfile.linkedinUrl,
        websiteUrl: userProfile.websiteUrl,
        usageLinks: userProfile.usageLinks ?? [],
      },
      categories: sortedCategories.map((category) => {
        const categoryLink = linkByCategoryId.get(category._id);
        const items = [...(stackItemsByCategory.get(category._id) ?? [])].sort(
          (a, b) => {
            const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
            const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
            if (orderA === orderB) {
              return a._creationTime - b._creationTime;
            }
            return orderA - orderB;
          }
        );

        return {
          _id: category._id,
          name: category.name,
          order: category.order,
          isActive: categoryLink !== undefined,
          state: {
            techReasonId: categoryLink?.techReasonId,
            shortDescription: toShortDescription(
              categoryLink?.shortDescription ?? ""
            ),
            longDescription: categoryLink?.longDescription ?? "",
            technologyIds: items.map((item) => item.technologyId),
          },
        };
      }),
      techReasons: sortedTechReasons.map((reason) => ({
        _id: reason._id,
        name: reason.name,
      })),
      updateReasons: sortedUpdateReasons.map((reason) => ({
        _id: reason._id,
        name: reason.name,
      })),
      categoryUpdates: sortedCategories.map((category) => ({
        categoryId: category._id,
        updates: [...(updatesByCategory.get(category._id) ?? [])].sort(
          (a, b) => b.date - a.date
        ),
      })),
      technologies: sortedTechnologies.map((technology) => ({
        _id: technology._id,
        name: technology.name,
        iconPath: technology.iconPath,
      })),
    };
  },
});

export const canCurrentUserEditCompanyTechStack = query({
  args: {
    slug: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const company = await getCompanyBySlug(ctx, args.slug);
    if (company === null) {
      return false;
    }

    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      return false;
    }

    return hasCompanyTechStackAdminAccess(identity as Record<string, unknown>);
  },
});

export const getCompanyTechStackEditorData = query({
  args: {
    slug: v.string(),
  },
  returns: companyTechStackEditorDataValidator,
  handler: async (ctx, args): Promise<CompanyTechStackEditorDataOutput> => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    if (!hasCompanyTechStackAdminAccess(identity as Record<string, unknown>)) {
      throw new Error("Not authorized to edit company tech stacks");
    }

    const company = await getRequiredCompanyBySlug(ctx, args.slug);
    const owner = await getRequiredStackOwnerForCompany(ctx, company._id);
    const [
      categories,
      techReasons,
      updateReasons,
      technologies,
      categoryLinks,
      stackItems,
      techStackUpdates,
    ] = await Promise.all([
      ctx.db.query("techCategory").collect(),
      ctx.db.query("techReason").collect(),
      ctx.db.query("updateReason").collect(),
      ctx.db.query("technology").collect(),
      ctx.db
        .query("techStackCategoryLink")
        .withIndex("by_owner_id", (q) => q.eq("ownerId", owner._id))
        .collect(),
      ctx.db
        .query("techStackItem")
        .withIndex("by_owner_id", (q) => q.eq("ownerId", owner._id))
        .collect(),
      ctx.db
        .query("techStackUpdate")
        .withIndex("by_owner_id", (q) => q.eq("ownerId", owner._id))
        .collect(),
    ]);

    const linkByCategoryId = new Map<
      Id<"techCategory">,
      (typeof categoryLinks)[number]
    >();
    for (const categoryLink of categoryLinks) {
      linkByCategoryId.set(categoryLink.categoryId, categoryLink);
    }

    const stackItemsByCategory = new Map<
      Id<"techCategory">,
      (typeof stackItems)[number][]
    >();
    for (const stackItem of stackItems) {
      const existingItems =
        stackItemsByCategory.get(stackItem.techCategoryId) ?? [];
      existingItems.push(stackItem);
      stackItemsByCategory.set(stackItem.techCategoryId, existingItems);
    }

    const sortedCategories = [...categories].sort((a, b) => a.order - b.order);
    const sortedTechReasons = [...techReasons].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const sortedUpdateReasons = [...updateReasons].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const sortedTechnologies = [...technologies].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const updatesByCategory = new Map<
      Id<"techCategory">,
      {
        _id: Id<"techStackUpdate">;
        oldTechnologyId: Id<"technology">;
        updateReasonId: Id<"updateReason">;
        description: string;
        date: number;
      }[]
    >();
    for (const update of techStackUpdates) {
      if (update.oldTechnologyId === undefined) {
        continue;
      }
      const existingUpdates = updatesByCategory.get(update.categoryId) ?? [];
      existingUpdates.push({
        _id: update._id,
        oldTechnologyId: update.oldTechnologyId,
        updateReasonId: update.updateReasonId,
        description: update.description,
        date: update.date,
      });
      updatesByCategory.set(update.categoryId, existingUpdates);
    }

    return {
      company: {
        name: company.name,
        logo: company.logo,
        description: company.description,
        companyInfo: {
          size: company.companyInfo.size,
          website: company.companyInfo.website,
          hq: company.companyInfo.hq,
        },
      },
      categories: sortedCategories.map((category) => {
        const categoryLink = linkByCategoryId.get(category._id);
        const items = [...(stackItemsByCategory.get(category._id) ?? [])].sort(
          (a, b) => {
            const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
            const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
            if (orderA === orderB) {
              return a._creationTime - b._creationTime;
            }
            return orderA - orderB;
          }
        );

        return {
          _id: category._id,
          name: category.name,
          order: category.order,
          isActive: categoryLink !== undefined,
          state: {
            techReasonId: categoryLink?.techReasonId,
            shortDescription: toShortDescription(
              categoryLink?.shortDescription ?? ""
            ),
            longDescription: categoryLink?.longDescription ?? "",
            technologyIds: items.map((item) => item.technologyId),
          },
        };
      }),
      techReasons: sortedTechReasons.map((reason) => ({
        _id: reason._id,
        name: reason.name,
      })),
      updateReasons: sortedUpdateReasons.map((reason) => ({
        _id: reason._id,
        name: reason.name,
      })),
      categoryUpdates: sortedCategories.map((category) => ({
        categoryId: category._id,
        updates: [...(updatesByCategory.get(category._id) ?? [])].sort(
          (a, b) => b.date - a.date
        ),
      })),
      technologies: sortedTechnologies.map((technology) => ({
        _id: technology._id,
        name: technology.name,
        iconPath: technology.iconPath,
      })),
    };
  },
});
