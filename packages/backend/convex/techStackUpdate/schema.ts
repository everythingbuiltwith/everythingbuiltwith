import { defineTable } from "convex/server";
import { v } from "convex/values";

export const techStackUpdate = defineTable({
  ownerId: v.id("stackOwner"),
  categoryId: v.id("techCategory"),
  oldTechnologyId: v.optional(v.id("technology")),
  updateReasonId: v.id("updateReason"),
  description: v.string(),
  date: v.number(),
})
  .index("by_owner_id", ["ownerId"])
  .index("by_owner_id_and_category_id", ["ownerId", "categoryId"])
  .index("by_owner_id_and_date", ["ownerId", "date"]);
