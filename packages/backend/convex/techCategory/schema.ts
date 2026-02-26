import { defineTable } from "convex/server";
import { v } from "convex/values";

export const techCategory = defineTable({
  name: v.string(),
  order: v.number(),
})
  .index("by_name", ["name"])
  .index("by_order", ["order"]);
