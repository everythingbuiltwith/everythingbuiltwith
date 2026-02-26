import { defineTable } from "convex/server";
import { v } from "convex/values";

export const stackOwner = defineTable({
  type: v.union(v.literal("company"), v.literal("user")),
  companyId: v.optional(v.id("company")),
  userProfileId: v.optional(v.id("userProfile")),
})
  .index("by_type", ["type"])
  .index("by_company_id", ["companyId"])
  .index("by_user_profile_id", ["userProfileId"]);
