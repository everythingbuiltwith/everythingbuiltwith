import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import {
  internalMutation,
  type MutationCtx,
  mutation,
} from "./_generated/server";

const userProfileSyncResultValidator = v.object({
  userProfileId: v.id("userProfile"),
  username: v.string(),
  usernameChanged: v.boolean(),
});

interface UserProfileSyncInput {
  clerkUserId: string;
  imageUrl?: string;
  name?: string;
  username?: string;
}

interface UserProfileSyncOutput {
  username: string;
  usernameChanged: boolean;
  userProfileId: Id<"userProfile">;
}

const SHORT_DESCRIPTION_MAX_CHARS = 250;
const COMPANY_TECH_STACK_ADMIN_METADATA_KEY = "company_tech_stack_admin";

const usageLinkValidator = v.object({
  label: v.string(),
  url: v.string(),
});
const technologyUpdateMutationArgs = {
  categoryId: v.id("techCategory"),
  technologyId: v.id("technology"),
  updateReasonId: v.id("updateReason"),
  description: v.string(),
  date: v.number(),
};

function normalizeUsername(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  if (normalized === undefined || normalized.length === 0) {
    return undefined;
  }
  return normalized;
}

function normalizeOptionalString(
  value: string | undefined
): string | undefined {
  const normalized = value?.trim();
  if (normalized === undefined || normalized.length === 0) {
    return undefined;
  }
  return normalized;
}

function normalizeRequiredString(value: string, fieldName: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}

function normalizeTechnologyName(value: string): string {
  return normalizeRequiredString(value, "Technology name");
}

function toShortDescription(value: string | undefined): string | undefined {
  const normalized = normalizeOptionalString(value);
  if (normalized === undefined) {
    return undefined;
  }
  return normalized.slice(0, SHORT_DESCRIPTION_MAX_CHARS);
}

function normalizeOptionalUrl(value: string | undefined): string | undefined {
  const normalized = normalizeOptionalString(value);
  if (normalized === undefined) {
    return undefined;
  }
  try {
    const parsed = new URL(normalized);
    if (!(parsed.protocol === "https:" || parsed.protocol === "http:")) {
      throw new Error("Invalid URL protocol");
    }
    return normalized;
  } catch (_error) {
    throw new Error(`Invalid URL: "${normalized}"`);
  }
}

function normalizeRequiredUrl(value: string, fieldName: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) {
    throw new Error(`${fieldName} is required`);
  }
  const parsed = normalizeOptionalUrl(normalized);
  if (parsed === undefined) {
    throw new Error(`${fieldName} is required`);
  }
  return parsed;
}

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

function normalizeUsageLinks(
  usageLinks:
    | {
        label: string;
        url: string;
      }[]
    | undefined
):
  | {
      label: string;
      url: string;
    }[]
  | undefined {
  if (usageLinks === undefined) {
    return undefined;
  }

  const cleanedUsageLinks: { label: string; url: string }[] = [];
  for (const usageLink of usageLinks) {
    const label = normalizeOptionalString(usageLink.label);
    const url = normalizeOptionalUrl(usageLink.url);
    if (label === undefined || url === undefined) {
      continue;
    }
    cleanedUsageLinks.push({ label, url });
  }
  return cleanedUsageLinks;
}

async function ensureStackOwnerForUserProfile(
  ctx: MutationCtx,
  userProfileId: Id<"userProfile">
): Promise<Id<"stackOwner">> {
  const existingOwner = await ctx.db
    .query("stackOwner")
    .withIndex("by_user_profile_id", (q) =>
      q.eq("userProfileId", userProfileId)
    )
    .unique();

  if (existingOwner !== null) {
    return existingOwner._id;
  }

  return await ctx.db.insert("stackOwner", {
    type: "user",
    userProfileId,
  });
}

async function getRequiredCompanyBySlug(ctx: MutationCtx, slug: string) {
  const company = await ctx.db
    .query("company")
    .withIndex("by_slug", (q) => q.eq("slug", slug))
    .unique();

  if (company === null) {
    throw new Error(`Company not found for slug "${slug}"`);
  }
  return company;
}

async function getRequiredStackOwnerForCompany(
  ctx: MutationCtx,
  companyId: Id<"company">
) {
  const owner = await ctx.db
    .query("stackOwner")
    .withIndex("by_company_id", (q) => q.eq("companyId", companyId))
    .unique();

  if (owner === null) {
    throw new Error(`Stack owner not found for company "${companyId}"`);
  }
  return owner;
}

async function getRequiredCompanyStackOwnerBySlug(
  ctx: MutationCtx,
  slug: string
) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    throw new Error("Not authenticated");
  }
  if (!hasCompanyTechStackAdminAccess(identity as Record<string, unknown>)) {
    throw new Error("Not authorized to edit company tech stacks");
  }

  const company = await getRequiredCompanyBySlug(ctx, slug);
  const owner = await getRequiredStackOwnerForCompany(ctx, company._id);
  return { company, owner };
}

async function getRequiredUserProfileByUsername(
  ctx: MutationCtx,
  username: string
) {
  const userProfile = await ctx.db
    .query("userProfile")
    .withIndex("by_username", (q) => q.eq("username", username))
    .unique();

  if (userProfile === null) {
    throw new Error(`User profile not found for username "${username}"`);
  }

  return userProfile;
}

async function getUsernameRedirectByOldUsername(
  ctx: MutationCtx,
  oldUsername: string
) {
  return await ctx.db
    .query("usernameRedirect")
    .withIndex("by_old_username", (q) => q.eq("oldUsername", oldUsername))
    .unique();
}

async function saveUsernameRedirect(
  ctx: MutationCtx,
  oldUsername: string,
  newUsername: string,
  userProfileId: Id<"userProfile">
): Promise<void> {
  if (oldUsername === newUsername) {
    return;
  }

  const reverseRedirect = await getUsernameRedirectByOldUsername(
    ctx,
    newUsername
  );
  if (reverseRedirect !== null && reverseRedirect.newUsername === oldUsername) {
    await ctx.db.delete(reverseRedirect._id);
  }

  const redirectsPointingToOld = await ctx.db
    .query("usernameRedirect")
    .withIndex("by_new_username", (q) => q.eq("newUsername", oldUsername))
    .collect();
  for (const redirect of redirectsPointingToOld) {
    if (redirect.oldUsername !== newUsername) {
      await ctx.db.patch(redirect._id, {
        newUsername,
        userProfileId,
      });
    }
  }

  const existingRedirect = await getUsernameRedirectByOldUsername(
    ctx,
    oldUsername
  );
  if (existingRedirect === null) {
    await ctx.db.insert("usernameRedirect", {
      oldUsername,
      newUsername,
      userProfileId,
    });
    return;
  }

  await ctx.db.patch(existingRedirect._id, {
    newUsername,
    userProfileId,
  });
}

async function upsertUserProfileFromIdentityData(
  ctx: MutationCtx,
  args: UserProfileSyncInput
): Promise<UserProfileSyncOutput> {
  const normalizedUsername = normalizeUsername(args.username);
  const normalizedName = normalizeUsername(args.name);
  const normalizedImageUrl = normalizeUsername(args.imageUrl);

  const existingByClerkId = await ctx.db
    .query("userProfile")
    .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkUserId))
    .unique();

  const effectiveUsername =
    normalizedUsername ?? existingByClerkId?.username ?? args.clerkUserId;

  const usernameOwner = await ctx.db
    .query("userProfile")
    .withIndex("by_username", (q) => q.eq("username", effectiveUsername))
    .unique();
  if (
    usernameOwner !== null &&
    usernameOwner.clerkUserId !== args.clerkUserId
  ) {
    throw new Error(
      `Username "${effectiveUsername}" is already in use by another profile.`
    );
  }

  if (existingByClerkId === null) {
    const userProfileId = await ctx.db.insert("userProfile", {
      clerkUserId: args.clerkUserId,
      username: effectiveUsername,
      ...(normalizedName !== undefined ? { name: normalizedName } : {}),
      ...(normalizedImageUrl !== undefined
        ? { imageUrl: normalizedImageUrl }
        : {}),
    });
    return {
      userProfileId,
      username: effectiveUsername,
      usernameChanged: false,
    };
  }

  const previousUsername = existingByClerkId.username;
  const usernameChanged = previousUsername !== effectiveUsername;
  await ctx.db.patch(existingByClerkId._id, {
    username: effectiveUsername,
    ...(normalizedName !== undefined ? { name: normalizedName } : {}),
    ...(normalizedImageUrl !== undefined
      ? { imageUrl: normalizedImageUrl }
      : {}),
  });

  if (usernameChanged) {
    await saveUsernameRedirect(
      ctx,
      previousUsername,
      effectiveUsername,
      existingByClerkId._id
    );
  }

  return {
    userProfileId: existingByClerkId._id,
    username: effectiveUsername,
    usernameChanged,
  };
}

export const syncCurrentUserProfile = mutation({
  args: {
    username: v.optional(v.string()),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  returns: userProfileSyncResultValidator,
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const result = await upsertUserProfileFromIdentityData(ctx, {
      clerkUserId: identity.subject,
      username: args.username,
      name: args.name,
      imageUrl: args.imageUrl,
    });
    await ensureStackOwnerForUserProfile(ctx, result.userProfileId);
    return result;
  },
});

export const upsertUserProfileFromClerkWebhook = internalMutation({
  args: {
    clerkUserId: v.string(),
    username: v.optional(v.string()),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  returns: userProfileSyncResultValidator,
  handler: async (ctx, args) => {
    return await upsertUserProfileFromIdentityData(ctx, args);
  },
});

export const updateCurrentUserProfileDetails = mutation({
  args: {
    description: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    twitterUrl: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    usageLinks: v.optional(v.array(usageLinkValidator)),
  },
  returns: v.object({
    userProfileId: v.id("userProfile"),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const userProfile = await ctx.db
      .query("userProfile")
      .withIndex("by_clerk_user_id", (q) =>
        q.eq("clerkUserId", identity.subject)
      )
      .unique();
    if (userProfile === null) {
      throw new Error("User profile not found");
    }

    const usageLinks = normalizeUsageLinks(args.usageLinks);

    await ctx.db.patch(userProfile._id, {
      description: normalizeOptionalString(args.description),
      githubUrl: normalizeOptionalUrl(args.githubUrl),
      twitterUrl: normalizeOptionalUrl(args.twitterUrl),
      linkedinUrl: normalizeOptionalUrl(args.linkedinUrl),
      websiteUrl: normalizeOptionalUrl(args.websiteUrl),
      usageLinks,
    });

    return {
      userProfileId: userProfile._id,
    };
  },
});

export const createTechnology = mutation({
  args: {
    name: v.string(),
  },
  returns: v.object({
    _id: v.id("technology"),
    name: v.string(),
    iconPath: v.string(),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const normalizedName = normalizeTechnologyName(args.name);
    const existingTechnology = await ctx.db
      .query("technology")
      .withIndex("by_name", (q) => q.eq("name", normalizedName))
      .unique();
    if (existingTechnology !== null) {
      return {
        _id: existingTechnology._id,
        name: existingTechnology.name,
        iconPath: existingTechnology.iconPath,
      };
    }

    const normalizedNameLower = normalizedName.toLowerCase();
    const allTechnologies = await ctx.db.query("technology").collect();
    const existingCaseInsensitiveTechnology = allTechnologies.find(
      (technology) =>
        technology.name.trim().toLowerCase() === normalizedNameLower
    );
    if (existingCaseInsensitiveTechnology !== undefined) {
      return {
        _id: existingCaseInsensitiveTechnology._id,
        name: existingCaseInsensitiveTechnology.name,
        iconPath: existingCaseInsensitiveTechnology.iconPath,
      };
    }

    const createdId = await ctx.db.insert("technology", {
      name: normalizedName,
      iconPath: "",
    });
    return {
      _id: createdId,
      name: normalizedName,
      iconPath: "",
    };
  },
});

export const setUserTechStackCategoryActive = mutation({
  args: {
    username: v.string(),
    categoryId: v.id("techCategory"),
    isActive: v.boolean(),
  },
  returns: v.object({
    categoryId: v.id("techCategory"),
    isActive: v.boolean(),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const userProfile = await getRequiredUserProfileByUsername(
      ctx,
      args.username
    );
    if (userProfile.clerkUserId !== identity.subject) {
      throw new Error("Not authorized to edit this tech stack");
    }

    const category = await ctx.db.get(args.categoryId);
    if (category === null) {
      throw new Error(`Tech category not found for id "${args.categoryId}"`);
    }

    const existingOwner = await ctx.db
      .query("stackOwner")
      .withIndex("by_user_profile_id", (q) =>
        q.eq("userProfileId", userProfile._id)
      )
      .unique();

    if (args.isActive) {
      const ownerId =
        existingOwner?._id ??
        (await ensureStackOwnerForUserProfile(ctx, userProfile._id));
      const existingCategoryLink = await ctx.db
        .query("techStackCategoryLink")
        .withIndex("by_owner_id_and_category_id", (q) =>
          q.eq("ownerId", ownerId).eq("categoryId", args.categoryId)
        )
        .unique();

      if (existingCategoryLink === null) {
        await ctx.db.insert("techStackCategoryLink", {
          ownerId,
          categoryId: args.categoryId,
        });
      }
    } else if (existingOwner !== null) {
      const existingCategoryLink = await ctx.db
        .query("techStackCategoryLink")
        .withIndex("by_owner_id_and_category_id", (q) =>
          q.eq("ownerId", existingOwner._id).eq("categoryId", args.categoryId)
        )
        .unique();
      if (existingCategoryLink !== null) {
        await ctx.db.delete(existingCategoryLink._id);
      }

      const existingItems = await ctx.db
        .query("techStackItem")
        .withIndex("by_owner_id_and_tech_category_id", (q) =>
          q
            .eq("ownerId", existingOwner._id)
            .eq("techCategoryId", args.categoryId)
        )
        .collect();
      for (const existingItem of existingItems) {
        await ctx.db.delete(existingItem._id);
      }
    }

    return {
      categoryId: args.categoryId,
      isActive: args.isActive,
    };
  },
});

export const upsertUserTechStackCategory = mutation({
  args: {
    username: v.string(),
    categoryId: v.id("techCategory"),
    techReasonId: v.optional(v.id("techReason")),
    shortDescription: v.optional(v.string()),
    longDescription: v.optional(v.string()),
    technologyIds: v.array(v.id("technology")),
  },
  returns: v.object({
    categoryId: v.id("techCategory"),
    ownerId: v.id("stackOwner"),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const userProfile = await getRequiredUserProfileByUsername(
      ctx,
      args.username
    );
    if (userProfile.clerkUserId !== identity.subject) {
      throw new Error("Not authorized to edit this tech stack");
    }

    const category = await ctx.db.get(args.categoryId);
    if (category === null) {
      throw new Error(`Tech category not found for id "${args.categoryId}"`);
    }
    if (args.techReasonId !== undefined) {
      const reason = await ctx.db.get(args.techReasonId);
      if (reason === null) {
        throw new Error(`Tech reason not found for id "${args.techReasonId}"`);
      }
    }

    const ownerId = await ensureStackOwnerForUserProfile(ctx, userProfile._id);
    const uniqueTechnologyIds = Array.from(new Set(args.technologyIds));
    const uniqueTechnologyIdSet = new Set(uniqueTechnologyIds);
    const technologyDocs = await Promise.all(
      uniqueTechnologyIds.map((technologyId) => ctx.db.get(technologyId))
    );
    for (let index = 0; index < technologyDocs.length; index += 1) {
      if (technologyDocs[index] === null) {
        throw new Error(
          `Technology not found for id "${uniqueTechnologyIds[index]}"`
        );
      }
    }

    const existingCategoryLink = await ctx.db
      .query("techStackCategoryLink")
      .withIndex("by_owner_id_and_category_id", (q) =>
        q.eq("ownerId", ownerId).eq("categoryId", args.categoryId)
      )
      .unique();

    const categoryLinkFields = {
      techReasonId: args.techReasonId,
      shortDescription: toShortDescription(args.shortDescription),
      longDescription: normalizeOptionalString(args.longDescription),
    };

    if (existingCategoryLink === null) {
      await ctx.db.insert("techStackCategoryLink", {
        ownerId,
        categoryId: args.categoryId,
        ...categoryLinkFields,
      });
    } else {
      await ctx.db.patch(existingCategoryLink._id, categoryLinkFields);
    }

    const existingItems = await ctx.db
      .query("techStackItem")
      .withIndex("by_owner_id_and_tech_category_id", (q) =>
        q.eq("ownerId", ownerId).eq("techCategoryId", args.categoryId)
      )
      .collect();
    for (const existingItem of existingItems) {
      await ctx.db.delete(existingItem._id);
    }

    for (const [index, technologyId] of uniqueTechnologyIds.entries()) {
      await ctx.db.insert("techStackItem", {
        ownerId,
        techCategoryId: args.categoryId,
        technologyId,
        order: index + 1,
      });
    }

    const existingUpdates = await ctx.db
      .query("techStackUpdate")
      .withIndex("by_owner_id_and_category_id", (q) =>
        q.eq("ownerId", ownerId).eq("categoryId", args.categoryId)
      )
      .collect();
    for (const existingUpdate of existingUpdates) {
      if (
        existingUpdate.oldTechnologyId !== undefined &&
        uniqueTechnologyIdSet.has(existingUpdate.oldTechnologyId)
      ) {
        await ctx.db.delete(existingUpdate._id);
      }
    }

    return {
      categoryId: args.categoryId,
      ownerId,
    };
  },
});

export const updateCompanyDetailsBySlug = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    logo: v.string(),
    description: v.string(),
    companyInfo: v.object({
      size: v.string(),
      website: v.string(),
      hq: v.string(),
    }),
  },
  returns: v.object({
    companyId: v.id("company"),
  }),
  handler: async (ctx, args) => {
    const { company } = await getRequiredCompanyStackOwnerBySlug(
      ctx,
      args.slug
    );
    await ctx.db.patch(company._id, {
      name: normalizeRequiredString(args.name, "Company name"),
      logo: normalizeRequiredString(args.logo, "Company logo"),
      description: normalizeRequiredString(
        args.description,
        "Company description"
      ),
      companyInfo: {
        size: normalizeRequiredString(args.companyInfo.size, "Company size"),
        website: normalizeRequiredUrl(
          args.companyInfo.website,
          "Company website"
        ),
        hq: normalizeRequiredString(
          args.companyInfo.hq,
          "Company headquarters"
        ),
      },
    });
    return {
      companyId: company._id,
    };
  },
});

export const setCompanyTechStackCategoryActive = mutation({
  args: {
    slug: v.string(),
    categoryId: v.id("techCategory"),
    isActive: v.boolean(),
  },
  returns: v.object({
    categoryId: v.id("techCategory"),
    isActive: v.boolean(),
  }),
  handler: async (ctx, args) => {
    const { owner } = await getRequiredCompanyStackOwnerBySlug(ctx, args.slug);
    const category = await ctx.db.get(args.categoryId);
    if (category === null) {
      throw new Error(`Tech category not found for id "${args.categoryId}"`);
    }

    if (args.isActive) {
      const existingCategoryLink = await ctx.db
        .query("techStackCategoryLink")
        .withIndex("by_owner_id_and_category_id", (q) =>
          q.eq("ownerId", owner._id).eq("categoryId", args.categoryId)
        )
        .unique();
      if (existingCategoryLink === null) {
        await ctx.db.insert("techStackCategoryLink", {
          ownerId: owner._id,
          categoryId: args.categoryId,
        });
      }
    } else {
      const existingCategoryLink = await ctx.db
        .query("techStackCategoryLink")
        .withIndex("by_owner_id_and_category_id", (q) =>
          q.eq("ownerId", owner._id).eq("categoryId", args.categoryId)
        )
        .unique();
      if (existingCategoryLink !== null) {
        await ctx.db.delete(existingCategoryLink._id);
      }

      const existingItems = await ctx.db
        .query("techStackItem")
        .withIndex("by_owner_id_and_tech_category_id", (q) =>
          q.eq("ownerId", owner._id).eq("techCategoryId", args.categoryId)
        )
        .collect();
      for (const existingItem of existingItems) {
        await ctx.db.delete(existingItem._id);
      }
    }

    return {
      categoryId: args.categoryId,
      isActive: args.isActive,
    };
  },
});

export const upsertCompanyTechStackCategory = mutation({
  args: {
    slug: v.string(),
    categoryId: v.id("techCategory"),
    techReasonId: v.optional(v.id("techReason")),
    shortDescription: v.optional(v.string()),
    longDescription: v.optional(v.string()),
    technologyIds: v.array(v.id("technology")),
  },
  returns: v.object({
    categoryId: v.id("techCategory"),
    ownerId: v.id("stackOwner"),
  }),
  handler: async (ctx, args) => {
    const { owner } = await getRequiredCompanyStackOwnerBySlug(ctx, args.slug);
    const category = await ctx.db.get(args.categoryId);
    if (category === null) {
      throw new Error(`Tech category not found for id "${args.categoryId}"`);
    }
    if (args.techReasonId !== undefined) {
      const reason = await ctx.db.get(args.techReasonId);
      if (reason === null) {
        throw new Error(`Tech reason not found for id "${args.techReasonId}"`);
      }
    }

    const uniqueTechnologyIds = Array.from(new Set(args.technologyIds));
    const uniqueTechnologyIdSet = new Set(uniqueTechnologyIds);
    const technologyDocs = await Promise.all(
      uniqueTechnologyIds.map((technologyId) => ctx.db.get(technologyId))
    );
    for (let index = 0; index < technologyDocs.length; index += 1) {
      if (technologyDocs[index] === null) {
        throw new Error(
          `Technology not found for id "${uniqueTechnologyIds[index]}"`
        );
      }
    }

    const existingCategoryLink = await ctx.db
      .query("techStackCategoryLink")
      .withIndex("by_owner_id_and_category_id", (q) =>
        q.eq("ownerId", owner._id).eq("categoryId", args.categoryId)
      )
      .unique();

    const categoryLinkFields = {
      techReasonId: args.techReasonId,
      shortDescription: toShortDescription(args.shortDescription),
      longDescription: normalizeOptionalString(args.longDescription),
    };

    if (existingCategoryLink === null) {
      await ctx.db.insert("techStackCategoryLink", {
        ownerId: owner._id,
        categoryId: args.categoryId,
        ...categoryLinkFields,
      });
    } else {
      await ctx.db.patch(existingCategoryLink._id, categoryLinkFields);
    }

    const existingItems = await ctx.db
      .query("techStackItem")
      .withIndex("by_owner_id_and_tech_category_id", (q) =>
        q.eq("ownerId", owner._id).eq("techCategoryId", args.categoryId)
      )
      .collect();
    for (const existingItem of existingItems) {
      await ctx.db.delete(existingItem._id);
    }

    for (const [index, technologyId] of uniqueTechnologyIds.entries()) {
      await ctx.db.insert("techStackItem", {
        ownerId: owner._id,
        techCategoryId: args.categoryId,
        technologyId,
        order: index + 1,
      });
    }

    const existingUpdates = await ctx.db
      .query("techStackUpdate")
      .withIndex("by_owner_id_and_category_id", (q) =>
        q.eq("ownerId", owner._id).eq("categoryId", args.categoryId)
      )
      .collect();
    for (const existingUpdate of existingUpdates) {
      if (
        existingUpdate.oldTechnologyId !== undefined &&
        uniqueTechnologyIdSet.has(existingUpdate.oldTechnologyId)
      ) {
        await ctx.db.delete(existingUpdate._id);
      }
    }

    return {
      categoryId: args.categoryId,
      ownerId: owner._id,
    };
  },
});

export const upsertUserTechnologyDeprecationUpdate = mutation({
  args: {
    username: v.string(),
    ...technologyUpdateMutationArgs,
  },
  returns: v.object({
    updateId: v.id("techStackUpdate"),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const userProfile = await getRequiredUserProfileByUsername(
      ctx,
      args.username
    );
    if (userProfile.clerkUserId !== identity.subject) {
      throw new Error("Not authorized to edit this tech stack");
    }

    const ownerId = await ensureStackOwnerForUserProfile(ctx, userProfile._id);
    const category = await ctx.db.get(args.categoryId);
    if (category === null) {
      throw new Error(`Tech category not found for id "${args.categoryId}"`);
    }
    const technology = await ctx.db.get(args.technologyId);
    if (technology === null) {
      throw new Error(`Technology not found for id "${args.technologyId}"`);
    }
    const updateReason = await ctx.db.get(args.updateReasonId);
    if (updateReason === null) {
      throw new Error(
        `Update reason not found for id "${args.updateReasonId}"`
      );
    }
    if (!Number.isFinite(args.date) || args.date <= 0) {
      throw new Error("Update date is invalid");
    }

    const existingUpdate = (
      await ctx.db
        .query("techStackUpdate")
        .withIndex("by_owner_id_and_category_id", (q) =>
          q.eq("ownerId", ownerId).eq("categoryId", args.categoryId)
        )
        .collect()
    ).find((update) => update.oldTechnologyId === args.technologyId);

    const matchingStackItem = await ctx.db
      .query("techStackItem")
      .withIndex("by_owner_id_and_tech_category_id", (q) =>
        q.eq("ownerId", ownerId).eq("techCategoryId", args.categoryId)
      )
      .collect();
    const technologyStackItem = matchingStackItem.find(
      (item) => item.technologyId === args.technologyId
    );
    if (existingUpdate === undefined && technologyStackItem === undefined) {
      throw new Error("Technology is not part of this category");
    }

    const updateFields = {
      updateReasonId: args.updateReasonId,
      description: normalizeOptionalString(args.description) ?? "",
      date: args.date,
    };

    if (existingUpdate !== undefined) {
      await ctx.db.patch(existingUpdate._id, updateFields);
      if (technologyStackItem !== undefined) {
        await ctx.db.delete(technologyStackItem._id);
      }
      return { updateId: existingUpdate._id };
    }

    const updateId = await ctx.db.insert("techStackUpdate", {
      ownerId,
      categoryId: args.categoryId,
      oldTechnologyId: args.technologyId,
      ...updateFields,
    });
    if (technologyStackItem !== undefined) {
      await ctx.db.delete(technologyStackItem._id);
    }
    return { updateId };
  },
});

export const upsertCompanyTechnologyDeprecationUpdate = mutation({
  args: {
    slug: v.string(),
    ...technologyUpdateMutationArgs,
  },
  returns: v.object({
    updateId: v.id("techStackUpdate"),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    if (!hasCompanyTechStackAdminAccess(identity as Record<string, unknown>)) {
      throw new Error("Not authorized to edit company tech stacks");
    }

    const { owner } = await getRequiredCompanyStackOwnerBySlug(ctx, args.slug);
    const category = await ctx.db.get(args.categoryId);
    if (category === null) {
      throw new Error(`Tech category not found for id "${args.categoryId}"`);
    }
    const technology = await ctx.db.get(args.technologyId);
    if (technology === null) {
      throw new Error(`Technology not found for id "${args.technologyId}"`);
    }
    const updateReason = await ctx.db.get(args.updateReasonId);
    if (updateReason === null) {
      throw new Error(
        `Update reason not found for id "${args.updateReasonId}"`
      );
    }
    if (!Number.isFinite(args.date) || args.date <= 0) {
      throw new Error("Update date is invalid");
    }

    const existingUpdate = (
      await ctx.db
        .query("techStackUpdate")
        .withIndex("by_owner_id_and_category_id", (q) =>
          q.eq("ownerId", owner._id).eq("categoryId", args.categoryId)
        )
        .collect()
    ).find((update) => update.oldTechnologyId === args.technologyId);

    const matchingStackItem = await ctx.db
      .query("techStackItem")
      .withIndex("by_owner_id_and_tech_category_id", (q) =>
        q.eq("ownerId", owner._id).eq("techCategoryId", args.categoryId)
      )
      .collect();
    const technologyStackItem = matchingStackItem.find(
      (item) => item.technologyId === args.technologyId
    );
    if (existingUpdate === undefined && technologyStackItem === undefined) {
      throw new Error("Technology is not part of this category");
    }

    const updateFields = {
      updateReasonId: args.updateReasonId,
      description: normalizeOptionalString(args.description) ?? "",
      date: args.date,
    };

    if (existingUpdate !== undefined) {
      await ctx.db.patch(existingUpdate._id, updateFields);
      if (technologyStackItem !== undefined) {
        await ctx.db.delete(technologyStackItem._id);
      }
      return { updateId: existingUpdate._id };
    }

    const updateId = await ctx.db.insert("techStackUpdate", {
      ownerId: owner._id,
      categoryId: args.categoryId,
      oldTechnologyId: args.technologyId,
      ...updateFields,
    });
    if (technologyStackItem !== undefined) {
      await ctx.db.delete(technologyStackItem._id);
    }
    return { updateId };
  },
});

export const deleteUserTechnologyDeprecationUpdate = mutation({
  args: {
    username: v.string(),
    categoryId: v.id("techCategory"),
    technologyId: v.id("technology"),
  },
  returns: v.object({
    deleted: v.boolean(),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    const userProfile = await getRequiredUserProfileByUsername(
      ctx,
      args.username
    );
    if (userProfile.clerkUserId !== identity.subject) {
      throw new Error("Not authorized to edit this tech stack");
    }
    const ownerId = await ensureStackOwnerForUserProfile(ctx, userProfile._id);
    const existingUpdate = (
      await ctx.db
        .query("techStackUpdate")
        .withIndex("by_owner_id_and_category_id", (q) =>
          q.eq("ownerId", ownerId).eq("categoryId", args.categoryId)
        )
        .collect()
    ).find((update) => update.oldTechnologyId === args.technologyId);
    if (existingUpdate === undefined) {
      return { deleted: false };
    }
    await ctx.db.delete(existingUpdate._id);
    return { deleted: true };
  },
});

export const deleteCompanyTechnologyDeprecationUpdate = mutation({
  args: {
    slug: v.string(),
    categoryId: v.id("techCategory"),
    technologyId: v.id("technology"),
  },
  returns: v.object({
    deleted: v.boolean(),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    if (!hasCompanyTechStackAdminAccess(identity as Record<string, unknown>)) {
      throw new Error("Not authorized to edit company tech stacks");
    }
    const { owner } = await getRequiredCompanyStackOwnerBySlug(ctx, args.slug);
    const existingUpdate = (
      await ctx.db
        .query("techStackUpdate")
        .withIndex("by_owner_id_and_category_id", (q) =>
          q.eq("ownerId", owner._id).eq("categoryId", args.categoryId)
        )
        .collect()
    ).find((update) => update.oldTechnologyId === args.technologyId);
    if (existingUpdate === undefined) {
      return { deleted: false };
    }
    await ctx.db.delete(existingUpdate._id);
    return { deleted: true };
  },
});
