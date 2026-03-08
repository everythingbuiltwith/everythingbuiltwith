import { defineTable } from "convex/server";
import { v } from "convex/values";

export const company = defineTable({
  name: v.string(),
  slug: v.string(),
  logo: v.string(),
  description: v.string(),
  industryId: v.id("industry"),
  verificationStatus: v.union(
    v.literal("public_data_only"),
    v.literal("verified")
  ),
  companyInfo: v.object({
    size: v.string(),
    website: v.string(),
    hq: v.string(),
  }),
  featured: v.optional(v.boolean()),
})
  .index("by_slug", ["slug"])
  .index("by_industry_id", ["industryId"])
  .index("by_featured", ["featured"]);
