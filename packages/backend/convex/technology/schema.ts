import { defineTable } from "convex/server";
import { v } from "convex/values";

export const technology = defineTable({
  name: v.string(),
  iconPath: v.string(),
})
  .index("by_name", ["name"])
  .index("by_icon_path", ["iconPath"]);
