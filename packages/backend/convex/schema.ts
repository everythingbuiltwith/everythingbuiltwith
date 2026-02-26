import { defineSchema } from "convex/server";
import { company } from "./company/schema";
import { industry } from "./industry/schema";
import { stackOwner } from "./stackOwner/schema";
import { techCategory } from "./techCategory/schema";
import { technology } from "./technology/schema";
import { techReason } from "./techReason/schema";
import { techStackCategoryLink } from "./techStackCategoryLink/schema";
import { techStackItem } from "./techStackItem/schema";
import { techStackUpdate } from "./techStackUpdate/schema";
import { updateReason } from "./updateReason/schema";
import { usernameRedirect } from "./usernameRedirect/schema";
import { userProfile } from "./userProfile/schema";

export default defineSchema({
  company,
  industry,
  techCategory,
  technology,
  techReason,
  techStackCategoryLink,
  techStackItem,
  techStackUpdate,
  updateReason,
  userProfile,
  usernameRedirect,
  stackOwner,
});
