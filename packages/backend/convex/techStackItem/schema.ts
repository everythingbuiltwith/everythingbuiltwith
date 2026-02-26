import { defineTable } from "convex/server";
import { v } from "convex/values";

export const techStackItem = defineTable({
  ownerId: v.id("stackOwner"),
  techCategoryId: v.id("techCategory"),
  technologyId: v.id("technology"),
  order: v.optional(v.number()),
})
  .index("by_owner_id", ["ownerId"])
  .index("by_owner_id_and_tech_category_id", ["ownerId", "techCategoryId"])
  .index("by_owner_id_and_technology_id", ["ownerId", "technologyId"])
  .index("by_technology_id_and_owner_id", ["technologyId", "ownerId"]);
