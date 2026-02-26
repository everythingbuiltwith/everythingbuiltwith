import { defineTable } from "convex/server";
import { v } from "convex/values";

export const updateReason = defineTable({
  name: v.string(),
}).index("by_name", ["name"]);
