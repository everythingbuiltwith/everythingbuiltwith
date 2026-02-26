import { defineTable } from "convex/server";
import { v } from "convex/values";

export const techReason = defineTable({
  name: v.string(),
}).index("by_name", ["name"]);
