import { defineTable } from "convex/server";
import { v } from "convex/values";

export const techStackCategoryLink = defineTable({
  ownerId: v.id("stackOwner"),
  categoryId: v.id("techCategory"),
  techReasonId: v.optional(v.id("techReason")),
  shortDescription: v.optional(v.string()),
  longDescription: v.optional(v.string()),
})
  .index("by_owner_id", ["ownerId"])
  .index("by_owner_id_and_category_id", ["ownerId", "categoryId"]);
