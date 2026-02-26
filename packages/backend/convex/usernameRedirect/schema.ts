import { defineTable } from "convex/server";
import { v } from "convex/values";

export const usernameRedirect = defineTable({
  oldUsername: v.string(),
  newUsername: v.string(),
  userProfileId: v.id("userProfile"),
})
  .index("by_old_username", ["oldUsername"])
  .index("by_new_username", ["newUsername"])
  .index("by_user_profile_id", ["userProfileId"]);
