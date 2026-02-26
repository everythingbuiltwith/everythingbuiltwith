import { defineTable } from "convex/server";
import { v } from "convex/values";

export const userProfile = defineTable({
  clerkUserId: v.string(),
  username: v.string(),
  name: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
  description: v.optional(v.string()),
  githubUrl: v.optional(v.string()),
  twitterUrl: v.optional(v.string()),
  linkedinUrl: v.optional(v.string()),
  websiteUrl: v.optional(v.string()),
  usageLinks: v.optional(
    v.array(
      v.object({
        label: v.string(),
        url: v.string(),
      })
    )
  ),
})
  .index("by_clerk_user_id", ["clerkUserId"])
  .index("by_username", ["username"]);
