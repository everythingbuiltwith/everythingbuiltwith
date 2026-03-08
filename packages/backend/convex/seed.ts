import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";

const industries = [
  { name: "Developer Tools & Platforms" },
  { name: "Cloud Infrastructure" },
  { name: "Payments & Fintech" },
  { name: "Authentication & Security" },
  { name: "Design & Creative Tools" },
  { name: "Analytics & Monitoring" },
] as const;

const categories = [
  { name: "Frontend", order: 1 },
  { name: "Backend", order: 2 },
  { name: "Database", order: 3 },
  { name: "Authentication", order: 4 },
  { name: "Hosting / Infrastructure", order: 5 },
  { name: "Payments", order: 6 },
  { name: "Dev Tools / CI/CD", order: 7 },
  { name: "Monitoring / Logs", order: 8 },
  { name: "Other Key Tools", order: 9 },
] as const;

const technologies = [
  { name: "Next.js", iconPath: "tech/nextjs" },
  { name: "React", iconPath: "tech/react" },
  { name: "Angular", iconPath: "tech/angular" },
  { name: "TypeScript", iconPath: "tech/typescript" },
  { name: "tRPC", iconPath: "tech/trpc" },
  { name: "shadcn", iconPath: "tech/shadcn" },
  { name: "tailwindcss", iconPath: "tech/tailwind" },
  { name: "Go", iconPath: "tech/go" },
  { name: "Node.js", iconPath: "tech/nodejs" },
  { name: "grpc", iconPath: "tech/grpc" },
  { name: "PostgreSQL", iconPath: "tech/postgres" },
  { name: "PlanetScale", iconPath: "company/planetscale" },
  { name: "Vercel", iconPath: "company/vercel" },
  { name: "Stripe", iconPath: "company/stripe" },
  { name: "Auth0", iconPath: "company/auth0" },
  { name: "Github Actions", iconPath: "tech/github-actions" },
  { name: "Sentry", iconPath: "company/sentry" },
  { name: "Figma", iconPath: "company/figma" },
  { name: "Kafka", iconPath: "tech/kafka" },
  { name: "Kubernetes", iconPath: "tech/kubernetes" },
  { name: "prisma", iconPath: "company/prisma" },
] as const;

type VerificationStatus = "public_data_only" | "verified";

const companies = [
  {
    name: "Vercel",
    slug: "vercel",
    logo: "vercel_full",
    description:
      "The platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.",
    industryName: "Cloud Infrastructure",
    companyInfo: {
      size: "201-500",
      website: "https://vercel.com",
      hq: "San Francisco, CA",
    },
    featured: true,
    verificationStatus: "verified" as VerificationStatus,
  },
  {
    name: "Linear",
    slug: "linear",
    logo: "linear_full",
    description:
      "The issue tracking tool you'll enjoy using. Build high-quality software, fast.",
    industryName: "Developer Tools & Platforms",
    companyInfo: {
      size: "51-200",
      website: "https://linear.app",
      hq: "San Francisco, CA",
    },
    featured: true,
    verificationStatus: "verified" as VerificationStatus,
  },
  {
    name: "Stripe",
    slug: "stripe",
    logo: "stripe",
    description:
      "Financial infrastructure for the internet. Millions of companies of all sizes use Stripe online and in person to accept payments.",
    industryName: "Payments & Fintech",
    companyInfo: {
      size: "1000+",
      website: "https://stripe.com",
      hq: "San Francisco, CA",
    },
    featured: false,
    verificationStatus: "public_data_only" as VerificationStatus,
  },
  {
    name: "Supabase",
    slug: "supabase",
    logo: "supabase_full",
    description:
      "The open source Firebase alternative. Build in a weekend, scale to millions.",
    industryName: "Developer Tools & Platforms",
    companyInfo: {
      size: "51-200",
      website: "https://supabase.com",
      hq: "San Francisco, CA",
    },
    featured: true,
    verificationStatus: "verified" as VerificationStatus,
  },
  {
    name: "Convex",
    slug: "convex",
    logo: "convex_full",
    description: "The backend platform that keeps your app in sync.",
    industryName: "Developer Tools & Platforms",
    companyInfo: {
      size: "51-200",
      website: "https://convex.dev",
      hq: "San Francisco, CA",
    },
    featured: true,
    verificationStatus: "verified" as VerificationStatus,
  },
] as const;

const userProfiles = [
  {
    clerkUserId: "user_39pz117IvJXBy9Vd22l1OYzjGjb",
    username: "maxwagner-dev",
    name: "Max Wagner",
    imageUrl: "",
    description:
      "Builder sharing practical stack decisions from real product work.",
    githubUrl: "https://github.com/maxwagner",
    twitterUrl: "https://x.com/maxwagner",
    linkedinUrl: "https://www.linkedin.com/in/maxwagner",
    websiteUrl: "https://maxwagner.dev",
    usageLinks: [
      {
        label: "everythingbuiltwith.com",
        url: "https://everythingbuiltwith.com",
      },
      {
        label: "Personal playground",
        url: "https://maxwagner.dev/projects",
      },
    ],
  },
] as const;

const techReasons = [
  { name: "Performance & Architecture" },
  { name: "Developer Experience" },
  { name: "Business & Product Needs" },
  { name: "Ecosystem & Integration" },
  { name: "Long-Term Strategy" },
] as const;

const updateReasons = [
  { name: "Scalability or Performance Limitations" },
  { name: "Poor Developer Experience" },
  { name: "High Costs or Inefficient Resource Use" },
  { name: "Immature Tooling or Ecosystem" },
  { name: "Poor Integration or Compatibility" },
  { name: "Low Team Familiarity or Hiring Difficulty" },
  { name: "Hard to Maintain or Extend" },
  { name: "Misaligned with Business Direction" },
] as const;

type CategoryName = (typeof categories)[number]["name"];
type TechReasonName = (typeof techReasons)[number]["name"];
type IndustryName = (typeof industries)[number]["name"];
type TechName = (typeof technologies)[number]["name"];
type CompanySlug = (typeof companies)[number]["slug"];
type Username = (typeof userProfiles)[number]["username"];
type UpdateReasonName = (typeof updateReasons)[number]["name"];

const SHORT_DESCRIPTION_MAX_CHARS = 250;

function toShortDescription(value: string): string {
  return value.slice(0, SHORT_DESCRIPTION_MAX_CHARS);
}

interface CompanyTechCategorySeed {
  categoryName: CategoryName;
  // Backward compatible legacy field so older seed entries still work.
  description?: string;
  longDescription?: string;
  shortDescription?: string;
  techReasonName: TechReasonName;
}

interface CompanyTechItemSeed {
  order: number;
  techCategoryName: CategoryName;
  technologyName: TechName;
}

interface CompanyTechStackSeed {
  categories: CompanyTechCategorySeed[];
  items: CompanyTechItemSeed[];
  updates?: CompanyTechUpdateSeed[];
}

interface CompanyTechUpdateSeed {
  categoryName: CategoryName;
  date: number;
  description: string;
  oldTechnologyName?: TechName;
  updateReasonName: UpdateReasonName;
}

const companyTechStacks: Partial<Record<CompanySlug, CompanyTechStackSeed>> = {
  vercel: {
    categories: [
      {
        categoryName: "Frontend",
        techReasonName: "Performance & Architecture",
        description:
          "voluptate elit sunt commodo commodo anim duis do non esse et et consectetur pariatur velit laboris nostrud elit adipisicing sunt duis cillum dolor sit commodo proident ut occaecat do labore mollit cillum est deserunt et amet nostrud et commodo tempor ad deserunt ipsum magna culpa in reprehenderit ea esse exercitation magna excepteur aliqua irure enim non tempor officia mollit velit magna fugiat aute magna aliquip est quis ipsum veniam nostrud anim ea laboris labore magna cupidatat anim cillum laborum irure sint anim fugiat officia eu excepteur culpa sint nostrud dolor est id et consequat nostrud adipisicing exercitation dolore excepteur culpa ex aliqua adipisicing magna dolor amet excepteur ex ea voluptate laboris duis laboris voluptate dolor esse esse do esse eu eu officia dolore ex Lorem officia in aliqua consequat aute ut ex do ex magna magna officia cillum et sunt Lorem sit non et id anim Lorem aliquip qui reprehenderit ut nostrud veniam minim magna quis incididunt proident excepteur quis exercitation proident laboris anim velit magna proident nostrud consequat duis ex elit elit id duis duis exercitation dolor non deserunt eu mollit deserunt ea quis est eiusmod Lorem nulla adipisicing sunt ipsum consectetur dolore qui est sunt labore qui elit",
      },
      {
        categoryName: "Backend",
        techReasonName: "Business & Product Needs",
      },
      {
        categoryName: "Database",
        techReasonName: "Long-Term Strategy",
        description:
          "voluptate elit sunt commodo commodo anim duis do non esse et et consectetur pariatur velit laboris nostrud elit adipisicing sunt duis cillum dolor sit commodo proident ut occaecat do labore mollit cillum est deserunt et amet nostrud et commodo tempor ad deserunt ipsum magna culpa in reprehenderit ea esse exercitation magna excepteur aliqua irure enim non tempor officia mollit velit magna fugiat aute magna aliquip est quis ipsum veniam nostrud anim ea laboris labore magna cupidatat anim cillum laborum irure sint anim fugiat officia eu excepteur culpa sint nostrud dolor est id et consequat nostrud adipisicing exercitation dolore excepteur culpa ex aliqua adipisicing magna dolor amet excepteur ex ea voluptate laboris duis laboris voluptate dolor esse esse do esse eu eu officia dolore ex Lorem officia in aliqua consequat aute ut ex do ex magna magna officia cillum et sunt Lorem sit non et id anim Lorem aliquip qui reprehenderit ut nostrud veniam minim magna quis incididunt proident excepteur quis exercitation proident laboris anim velit magna proident nostrud consequat duis ex elit elit id duis duis exercitation dolor non deserunt eu mollit deserunt ea quis est eiusmod Lorem nulla adipisicing sunt ipsum consectetur dolore qui est sunt labore qui elit",
      },
      {
        categoryName: "Authentication",
        techReasonName: "Ecosystem & Integration",
        description: "Chose Auth0 for secure, managed authentication.",
      },
      {
        categoryName: "Hosting / Infrastructure",
        techReasonName: "Developer Experience",
        description: "Easy deployments and previews.",
      },
      {
        categoryName: "Payments",
        techReasonName: "Business & Product Needs",
        description: "Test bla",
      },
      {
        categoryName: "Dev Tools / CI/CD",
        techReasonName: "Ecosystem & Integration",
        description: "Seamless with GitHub repos.",
      },
      {
        categoryName: "Monitoring / Logs",
        techReasonName: "Performance & Architecture",
        description: "Real-time error monitoring.",
      },
      {
        categoryName: "Other Key Tools",
        techReasonName: "Developer Experience",
        description: "Centralized design and prototyping.",
      },
    ],
    items: [
      {
        techCategoryName: "Frontend",
        technologyName: "Next.js",
        order: 1,
      },
      {
        techCategoryName: "Frontend",
        technologyName: "tRPC",
        order: 2,
      },
      {
        techCategoryName: "Frontend",
        technologyName: "shadcn",
        order: 3,
      },
      {
        techCategoryName: "Frontend",
        technologyName: "tailwindcss",
        order: 4,
      },
      {
        techCategoryName: "Frontend",
        technologyName: "prisma",
        order: 5,
      },
      {
        techCategoryName: "Backend",
        technologyName: "Go",
        order: 1,
      },
      {
        techCategoryName: "Backend",
        technologyName: "grpc",
        order: 2,
      },
      {
        techCategoryName: "Database",
        technologyName: "PostgreSQL",
        order: 1,
      },
      {
        techCategoryName: "Authentication",
        technologyName: "Auth0",
        order: 1,
      },
      {
        techCategoryName: "Hosting / Infrastructure",
        technologyName: "Vercel",
        order: 1,
      },
      {
        techCategoryName: "Payments",
        technologyName: "Stripe",
        order: 1,
      },
      {
        techCategoryName: "Dev Tools / CI/CD",
        technologyName: "Github Actions",
        order: 1,
      },
      {
        techCategoryName: "Monitoring / Logs",
        technologyName: "Sentry",
        order: 1,
      },
      {
        techCategoryName: "Other Key Tools",
        technologyName: "Figma",
        order: 1,
      },
    ],
    updates: [
      {
        categoryName: "Frontend",
        oldTechnologyName: "Angular",
        updateReasonName: "Poor Integration or Compatibility",
        description:
          "Switched to React for better component reusability and ecosystem.",
        date: new Date("2022-05-15").getTime(),
      },
      {
        categoryName: "Frontend",
        oldTechnologyName: "React",
        updateReasonName: "Scalability or Performance Limitations",
        description:
          "Initial MVP was built quickly with Angular due to team experience.",
        date: new Date("2023-11-01").getTime(),
      },
    ],
  },
};

const userTechStacks: Partial<Record<Username, CompanyTechStackSeed>> = {
  "maxwagner-dev": {
    categories: [
      {
        categoryName: "Frontend",
        techReasonName: "Developer Experience",
        shortDescription:
          "TanStack Router + React provide fast iteration and maintainable routes.",
        longDescription:
          "I chose React and TanStack Router because they make it easy to keep routes type-safe while still moving quickly. Combined with shadcn and tailwindcss, UI work stays consistent and productive.",
      },
      {
        categoryName: "Backend",
        techReasonName: "Performance & Architecture",
        shortDescription:
          "Convex keeps app data in sync with minimal backend glue code.",
      },
      {
        categoryName: "Database",
        techReasonName: "Long-Term Strategy",
        shortDescription:
          "Convex documents plus Postgres support cover current and future data needs.",
      },
      {
        categoryName: "Authentication",
        techReasonName: "Business & Product Needs",
        shortDescription:
          "Clerk handles auth flows and account UX out of the box.",
      },
      {
        categoryName: "Hosting / Infrastructure",
        techReasonName: "Developer Experience",
        shortDescription:
          "Vercel simplifies deploy previews and production rollouts.",
      },
      {
        categoryName: "Dev Tools / CI/CD",
        techReasonName: "Ecosystem & Integration",
        shortDescription:
          "GitHub Actions automates checks and keeps the release process reliable.",
      },
      {
        categoryName: "Monitoring / Logs",
        techReasonName: "Performance & Architecture",
        shortDescription:
          "Sentry helps surface issues early and reduce regressions.",
      },
    ],
    items: [
      {
        techCategoryName: "Frontend",
        technologyName: "React",
        order: 1,
      },
      {
        techCategoryName: "Frontend",
        technologyName: "TypeScript",
        order: 2,
      },
      {
        techCategoryName: "Frontend",
        technologyName: "tailwindcss",
        order: 3,
      },
      {
        techCategoryName: "Frontend",
        technologyName: "shadcn",
        order: 4,
      },
      {
        techCategoryName: "Backend",
        technologyName: "Node.js",
        order: 1,
      },
      {
        techCategoryName: "Database",
        technologyName: "PostgreSQL",
        order: 1,
      },
      {
        techCategoryName: "Authentication",
        technologyName: "Auth0",
        order: 1,
      },
      {
        techCategoryName: "Hosting / Infrastructure",
        technologyName: "Vercel",
        order: 1,
      },
      {
        techCategoryName: "Dev Tools / CI/CD",
        technologyName: "Github Actions",
        order: 1,
      },
      {
        techCategoryName: "Monitoring / Logs",
        technologyName: "Sentry",
        order: 1,
      },
    ],
    updates: [
      {
        categoryName: "Frontend",
        oldTechnologyName: "Angular",
        updateReasonName: "Poor Developer Experience",
        description:
          "Moved to React + TypeScript for faster development cycles.",
        date: new Date("2024-08-01").getTime(),
      },
    ],
  },
};

export const run = mutation({
  args: {},
  returns: v.object({
    insertedIndustries: v.number(),
    insertedCategories: v.number(),
    updatedCategories: v.number(),
    insertedTechnologies: v.number(),
    updatedTechnologies: v.number(),
    insertedTechReasons: v.number(),
    insertedUpdateReasons: v.number(),
    insertedUserProfiles: v.number(),
    updatedUserProfiles: v.number(),
  }),
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Seed orchestration is intentionally linear and idempotent.
  handler: async (ctx) => {
    let insertedIndustries = 0;
    for (const industry of industries) {
      const existing = await ctx.db
        .query("industry")
        .withIndex("by_name", (q) => q.eq("name", industry.name))
        .unique();
      if (existing === null) {
        await ctx.db.insert("industry", industry);
        insertedIndustries += 1;
      }
    }

    let insertedCategories = 0;
    let updatedCategories = 0;
    for (const category of categories) {
      const existing = await ctx.db
        .query("techCategory")
        .withIndex("by_name", (q) => q.eq("name", category.name))
        .unique();
      if (existing === null) {
        await ctx.db.insert("techCategory", category);
        insertedCategories += 1;
      } else if (existing.order !== category.order) {
        await ctx.db.patch(existing._id, { order: category.order });
        updatedCategories += 1;
      }
    }

    let insertedTechnologies = 0;
    let updatedTechnologies = 0;
    for (const technology of technologies) {
      const existing = await ctx.db
        .query("technology")
        .withIndex("by_name", (q) => q.eq("name", technology.name))
        .unique();
      if (existing === null) {
        await ctx.db.insert("technology", technology);
        insertedTechnologies += 1;
      } else if (existing.iconPath !== technology.iconPath) {
        await ctx.db.patch(existing._id, { iconPath: technology.iconPath });
        updatedTechnologies += 1;
      }
    }

    let insertedTechReasons = 0;
    for (const reason of techReasons) {
      const existing = await ctx.db
        .query("techReason")
        .withIndex("by_name", (q) => q.eq("name", reason.name))
        .unique();
      if (existing === null) {
        await ctx.db.insert("techReason", reason);
        insertedTechReasons += 1;
      }
    }

    let insertedUpdateReasons = 0;
    for (const reason of updateReasons) {
      const existing = await ctx.db
        .query("updateReason")
        .withIndex("by_name", (q) => q.eq("name", reason.name))
        .unique();
      if (existing === null) {
        await ctx.db.insert("updateReason", reason);
        insertedUpdateReasons += 1;
      }
    }

    let insertedUserProfiles = 0;
    let updatedUserProfiles = 0;
    const userProfileIds: Partial<Record<Username, Id<"userProfile">>> = {};
    for (const userProfile of userProfiles) {
      const existing = await ctx.db
        .query("userProfile")
        .withIndex("by_username", (q) => q.eq("username", userProfile.username))
        .unique();

      const payload = {
        clerkUserId: userProfile.clerkUserId,
        username: userProfile.username,
        name: userProfile.name,
        imageUrl: userProfile.imageUrl,
        description: userProfile.description,
        githubUrl: userProfile.githubUrl,
        twitterUrl: userProfile.twitterUrl,
        linkedinUrl: userProfile.linkedinUrl,
        websiteUrl: userProfile.websiteUrl,
        usageLinks: userProfile.usageLinks.map((link) => ({
          label: link.label,
          url: link.url,
        })),
      };

      if (existing === null) {
        userProfileIds[userProfile.username] = await ctx.db.insert(
          "userProfile",
          payload
        );
        insertedUserProfiles += 1;
      } else {
        await ctx.db.patch(existing._id, payload);
        userProfileIds[userProfile.username] = existing._id;
        updatedUserProfiles += 1;
      }
    }

    const updateReasonIds: Record<
      UpdateReasonName,
      Id<"updateReason">
    > = {} as Record<UpdateReasonName, Id<"updateReason">>;
    for (const reason of updateReasons) {
      const existing = await ctx.db
        .query("updateReason")
        .withIndex("by_name", (q) => q.eq("name", reason.name))
        .unique();
      if (existing === null) {
        throw new Error(
          `Update reason "${reason.name}" not found after seeding.`
        );
      }
      updateReasonIds[reason.name] = existing._id;
    }

    const industryIds: Record<IndustryName, Id<"industry">> = {} as Record<
      IndustryName,
      Id<"industry">
    >;
    for (const industry of industries) {
      const existing = await ctx.db
        .query("industry")
        .withIndex("by_name", (q) => q.eq("name", industry.name))
        .unique();
      if (existing === null) {
        throw new Error(`Industry "${industry.name}" not found after seeding.`);
      }
      industryIds[industry.name] = existing._id;
    }

    const categoryIds: Record<CategoryName, Id<"techCategory">> = {} as Record<
      CategoryName,
      Id<"techCategory">
    >;
    for (const category of categories) {
      const existing = await ctx.db
        .query("techCategory")
        .withIndex("by_name", (q) => q.eq("name", category.name))
        .unique();
      if (existing === null) {
        throw new Error(
          `Tech category "${category.name}" not found after seeding.`
        );
      }
      categoryIds[category.name] = existing._id;
    }

    const techReasonIds: Record<
      TechReasonName,
      Id<"techReason">
    > = {} as Record<TechReasonName, Id<"techReason">>;
    for (const reason of techReasons) {
      const existing = await ctx.db
        .query("techReason")
        .withIndex("by_name", (q) => q.eq("name", reason.name))
        .unique();
      if (existing === null) {
        throw new Error(
          `Tech reason "${reason.name}" not found after seeding.`
        );
      }
      techReasonIds[reason.name] = existing._id;
    }

    const techIds: Record<TechName, Id<"technology">> = {} as Record<
      TechName,
      Id<"technology">
    >;
    for (const technology of technologies) {
      const existing = await ctx.db
        .query("technology")
        .withIndex("by_name", (q) => q.eq("name", technology.name))
        .unique();
      if (existing === null) {
        throw new Error(
          `Technology "${technology.name}" not found after seeding.`
        );
      }
      techIds[technology.name] = existing._id;
    }

    const companyIds: Partial<Record<CompanySlug, Id<"company">>> = {};
    for (const company of companies) {
      const industryId = industryIds[company.industryName];
      if (industryId === undefined) {
        throw new Error(`Industry "${company.industryName}" is not available.`);
      }

      const payload = {
        name: company.name,
        slug: company.slug,
        logo: company.logo,
        description: company.description,
        industryId,
        verificationStatus: company.verificationStatus ?? "public_data_only",
        companyInfo: company.companyInfo,
        featured: company.featured,
      };

      const existing = await ctx.db
        .query("company")
        .withIndex("by_slug", (q) => q.eq("slug", company.slug))
        .unique();

      if (existing === null) {
        companyIds[company.slug] = await ctx.db.insert("company", payload);
      } else {
        await ctx.db.patch(existing._id, payload);
        companyIds[company.slug] = existing._id;
      }
    }

    const ownerIds: Partial<Record<CompanySlug, Id<"stackOwner">>> = {};
    for (const company of companies) {
      const slug = company.slug;
      const companyId = companyIds[slug];
      if (companyId === undefined) {
        throw new Error(`Company id was not created for "${slug}".`);
      }

      const existingOwner = await ctx.db
        .query("stackOwner")
        .withIndex("by_company_id", (q) => q.eq("companyId", companyId))
        .unique();

      const stackOwnerPayload = {
        type: "company" as const,
        companyId,
      };

      if (existingOwner === null) {
        ownerIds[slug] = await ctx.db.insert("stackOwner", stackOwnerPayload);
      } else {
        await ctx.db.patch(existingOwner._id, stackOwnerPayload);
        ownerIds[slug] = existingOwner._id;
      }
    }

    const userOwnerIds: Partial<Record<Username, Id<"stackOwner">>> = {};
    for (const userProfile of userProfiles) {
      const userProfileId = userProfileIds[userProfile.username];
      if (userProfileId === undefined) {
        throw new Error(
          `User profile id was not created for "${userProfile.username}".`
        );
      }

      const existingOwner = await ctx.db
        .query("stackOwner")
        .withIndex("by_user_profile_id", (q) =>
          q.eq("userProfileId", userProfileId)
        )
        .unique();

      if (existingOwner === null) {
        userOwnerIds[userProfile.username] = await ctx.db.insert("stackOwner", {
          type: "user",
          userProfileId,
        });
      } else {
        await ctx.db.patch(existingOwner._id, { type: "user", userProfileId });
        userOwnerIds[userProfile.username] = existingOwner._id;
      }
    }

    for (const slug of Object.keys(companyTechStacks) as CompanySlug[]) {
      const companyTechStack = companyTechStacks[slug];
      if (companyTechStack === undefined) {
        continue;
      }

      const ownerId = ownerIds[slug];
      if (ownerId === undefined) {
        throw new Error(`Stack owner was not created for "${slug}".`);
      }

      for (const category of companyTechStack.categories) {
        const categoryId = categoryIds[category.categoryName];
        const techReasonId = techReasonIds[category.techReasonName];
        if (categoryId === undefined || techReasonId === undefined) {
          throw new Error(
            `Missing category/reason ids for "${category.categoryName}" and "${category.techReasonName}".`
          );
        }

        const existing = await ctx.db
          .query("techStackCategoryLink")
          .withIndex("by_owner_id_and_category_id", (q) =>
            q.eq("ownerId", ownerId).eq("categoryId", categoryId)
          )
          .unique();

        const payload = {
          ownerId,
          categoryId,
          techReasonId,
          ...(category.shortDescription !== undefined ||
          category.longDescription !== undefined ||
          category.description !== undefined
            ? {
                shortDescription: toShortDescription(
                  category.shortDescription ??
                    category.description ??
                    category.longDescription ??
                    ""
                ),
                longDescription:
                  category.longDescription ?? category.description ?? "",
              }
            : {}),
        };

        if (existing === null) {
          await ctx.db.insert("techStackCategoryLink", payload);
        } else {
          await ctx.db.patch(existing._id, payload);
        }
      }

      for (const techItem of companyTechStack.items) {
        const techCategoryId = categoryIds[techItem.techCategoryName];
        const technologyId = techIds[techItem.technologyName];
        if (techCategoryId === undefined || technologyId === undefined) {
          throw new Error(
            `Missing category/technology ids for "${techItem.techCategoryName}" and "${techItem.technologyName}".`
          );
        }

        const existing = await ctx.db
          .query("techStackItem")
          .withIndex("by_owner_id_and_technology_id", (q) =>
            q.eq("ownerId", ownerId).eq("technologyId", technologyId)
          )
          .unique();

        const payload = {
          ownerId,
          techCategoryId,
          technologyId,
          order: techItem.order,
        };

        if (existing === null) {
          await ctx.db.insert("techStackItem", payload);
        } else {
          await ctx.db.patch(existing._id, payload);
        }
      }

      for (const update of companyTechStack.updates ?? []) {
        const categoryId = categoryIds[update.categoryName];
        const updateReasonId = updateReasonIds[update.updateReasonName];
        const oldTechnologyId =
          update.oldTechnologyName !== undefined
            ? techIds[update.oldTechnologyName]
            : undefined;

        if (categoryId === undefined || updateReasonId === undefined) {
          throw new Error(
            `Missing category/update reason ids for "${update.categoryName}" and "${update.updateReasonName}".`
          );
        }

        const existingUpdates = await ctx.db
          .query("techStackUpdate")
          .withIndex("by_owner_id_and_category_id", (q) =>
            q.eq("ownerId", ownerId).eq("categoryId", categoryId)
          )
          .collect();

        const existing = existingUpdates.find(
          (existingUpdate) => existingUpdate.date === update.date
        );

        const payload = {
          ownerId,
          categoryId,
          updateReasonId,
          description: update.description,
          date: update.date,
          ...(oldTechnologyId !== undefined ? { oldTechnologyId } : {}),
        };

        if (existing === undefined) {
          await ctx.db.insert("techStackUpdate", payload);
        } else {
          await ctx.db.patch(existing._id, payload);
        }
      }
    }

    for (const username of Object.keys(userTechStacks) as Username[]) {
      const userTechStack = userTechStacks[username];
      if (userTechStack === undefined) {
        continue;
      }

      const ownerId = userOwnerIds[username];
      if (ownerId === undefined) {
        throw new Error(`Stack owner was not created for "${username}".`);
      }

      for (const category of userTechStack.categories) {
        const categoryId = categoryIds[category.categoryName];
        const techReasonId = techReasonIds[category.techReasonName];
        if (categoryId === undefined || techReasonId === undefined) {
          throw new Error(
            `Missing category/reason ids for "${category.categoryName}" and "${category.techReasonName}".`
          );
        }

        const existing = await ctx.db
          .query("techStackCategoryLink")
          .withIndex("by_owner_id_and_category_id", (q) =>
            q.eq("ownerId", ownerId).eq("categoryId", categoryId)
          )
          .unique();

        const payload = {
          ownerId,
          categoryId,
          techReasonId,
          ...(category.shortDescription !== undefined ||
          category.longDescription !== undefined ||
          category.description !== undefined
            ? {
                shortDescription: toShortDescription(
                  category.shortDescription ??
                    category.description ??
                    category.longDescription ??
                    ""
                ),
                longDescription:
                  category.longDescription ?? category.description ?? "",
              }
            : {}),
        };

        if (existing === null) {
          await ctx.db.insert("techStackCategoryLink", payload);
        } else {
          await ctx.db.patch(existing._id, payload);
        }
      }

      for (const techItem of userTechStack.items) {
        const techCategoryId = categoryIds[techItem.techCategoryName];
        const technologyId = techIds[techItem.technologyName];
        if (techCategoryId === undefined || technologyId === undefined) {
          throw new Error(
            `Missing category/technology ids for "${techItem.techCategoryName}" and "${techItem.technologyName}".`
          );
        }

        const existing = await ctx.db
          .query("techStackItem")
          .withIndex("by_owner_id_and_technology_id", (q) =>
            q.eq("ownerId", ownerId).eq("technologyId", technologyId)
          )
          .unique();

        const payload = {
          ownerId,
          techCategoryId,
          technologyId,
          order: techItem.order,
        };

        if (existing === null) {
          await ctx.db.insert("techStackItem", payload);
        } else {
          await ctx.db.patch(existing._id, payload);
        }
      }

      for (const update of userTechStack.updates ?? []) {
        const categoryId = categoryIds[update.categoryName];
        const updateReasonId = updateReasonIds[update.updateReasonName];
        const oldTechnologyId =
          update.oldTechnologyName !== undefined
            ? techIds[update.oldTechnologyName]
            : undefined;

        if (categoryId === undefined || updateReasonId === undefined) {
          throw new Error(
            `Missing category/update reason ids for "${update.categoryName}" and "${update.updateReasonName}".`
          );
        }

        const existingUpdates = await ctx.db
          .query("techStackUpdate")
          .withIndex("by_owner_id_and_category_id", (q) =>
            q.eq("ownerId", ownerId).eq("categoryId", categoryId)
          )
          .collect();

        const existing = existingUpdates.find(
          (existingUpdate) => existingUpdate.date === update.date
        );

        const payload = {
          ownerId,
          categoryId,
          updateReasonId,
          description: update.description,
          date: update.date,
          ...(oldTechnologyId !== undefined ? { oldTechnologyId } : {}),
        };

        if (existing === undefined) {
          await ctx.db.insert("techStackUpdate", payload);
        } else {
          await ctx.db.patch(existing._id, payload);
        }
      }
    }

    return {
      insertedIndustries,
      insertedCategories,
      updatedCategories,
      insertedTechnologies,
      updatedTechnologies,
      insertedTechReasons,
      insertedUpdateReasons,
      insertedUserProfiles,
      updatedUserProfiles,
    };
  },
});
