import { api } from "@everythingbuiltwith/backend/convex/_generated/api";
import type { Id } from "@everythingbuiltwith/backend/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type Category,
  type CategoryEditorState,
  type Technology,
  type TechnologyUpdate,
  type TechReason,
  TechStackEditorShared,
  type UpdateReason,
} from "@/components/tech-stack-editor-shared";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface UsageLink {
  label: string;
  url: string;
}

interface UsageLinkDraft extends UsageLink {
  id: string;
}

interface ProfileState {
  description: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  usageLinks: UsageLinkDraft[];
  websiteUrl: string;
}
interface UserTechStackEditorProps {
  categories: Category[];
  categoryUpdates: {
    categoryId: Id<"techCategory">;
    updates: TechnologyUpdate[];
  }[];
  profile: {
    description: string;
    githubUrl?: string;
    twitterUrl?: string;
    linkedinUrl?: string;
    websiteUrl?: string;
    usageLinks: UsageLink[];
  };
  technologies: Technology[];
  techReasons: TechReason[];
  updateReasons: UpdateReason[];
  username: string;
}

let usageLinkIdCounter = 0;

const createUsageLinkId = () => `usage-link-${usageLinkIdCounter++}`;

const createProfileState = (
  profile: UserTechStackEditorProps["profile"]
): ProfileState => ({
  description: profile.description,
  githubUrl: profile.githubUrl ?? "",
  twitterUrl: profile.twitterUrl ?? "",
  linkedinUrl: profile.linkedinUrl ?? "",
  websiteUrl: profile.websiteUrl ?? "",
  usageLinks: profile.usageLinks.map((x) => ({
    id: createUsageLinkId(),
    label: x.label,
    url: x.url,
  })),
});
const normalizeUsageLinks = (links: UsageLinkDraft[]) =>
  links
    .map((l) => ({ label: l.label.trim(), url: l.url.trim() }))
    .filter((l) => l.label.length > 0 && l.url.length > 0);

export function UserTechStackEditor({
  username,
  categories,
  categoryUpdates,
  profile,
  techReasons,
  updateReasons,
  technologies,
}: UserTechStackEditorProps) {
  const saveProfile = useMutation(
    api.mutations.updateCurrentUserProfileDetails
  );
  const saveCategory = useMutation(api.mutations.upsertUserTechStackCategory);
  const setCategoryActive = useMutation(
    api.mutations.setUserTechStackCategoryActive
  );
  const upsertTechnologyUpdate = useMutation(
    api.mutations.upsertUserTechnologyDeprecationUpdate
  );
  const deleteTechnologyUpdate = useMutation(
    api.mutations.deleteUserTechnologyDeprecationUpdate
  );
  const createTechnology = useMutation(api.mutations.createTechnology);
  const [profileDraft, setProfileDraft] = useState<ProfileState>(() =>
    createProfileState(profile)
  );
  const [savedProfile, setSavedProfile] = useState<ProfileState>(() =>
    createProfileState(profile)
  );
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const isProfileDirty =
    JSON.stringify(profileDraft) !== JSON.stringify(savedProfile);

  const saveProfileSection = async () => {
    setIsSavingProfile(true);
    try {
      const usageLinks = normalizeUsageLinks(profileDraft.usageLinks);
      await saveProfile({ ...profileDraft, usageLinks });
      const next = { ...profileDraft, usageLinks };
      setProfileDraft(next);
      setSavedProfile(next);
      toast.success("Profile details saved");
    } catch (_error) {
      toast.error("Could not save profile details");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const saveCategoryState = async ({
    categoryId,
    state,
  }: {
    categoryId: Id<"techCategory">;
    state: CategoryEditorState;
  }) => {
    await saveCategory({
      username,
      categoryId,
      techReasonId: state.techReasonId,
      shortDescription: state.shortDescription,
      longDescription: state.longDescription,
      technologyIds: state.technologyIds,
    });
  };
  const toggleCategory = async ({
    categoryId,
    isActive,
  }: {
    categoryId: Id<"techCategory">;
    isActive: boolean;
  }) => {
    await setCategoryActive({ username, categoryId, isActive });
  };
  const saveTechnologyUpdate = async ({
    categoryId,
    technologyId,
    updateReasonId,
    description,
    date,
  }: {
    categoryId: Id<"techCategory">;
    technologyId: Id<"technology">;
    updateReasonId: Id<"updateReason">;
    description: string;
    date: number;
  }) =>
    await upsertTechnologyUpdate({
      username,
      categoryId,
      technologyId,
      updateReasonId,
      description,
      date,
    });
  const removeTechnologyUpdate = async ({
    categoryId,
    technologyId,
  }: {
    categoryId: Id<"techCategory">;
    technologyId: Id<"technology">;
  }) => {
    await deleteTechnologyUpdate({
      username,
      categoryId,
      technologyId,
    });
  };
  const createTechnologyByName = async ({ name }: { name: string }) =>
    await createTechnology({ name });

  return (
    <TechStackEditorShared
      categories={categories}
      categoryUpdates={categoryUpdates}
      onCreateTechnology={createTechnologyByName}
      onDeleteTechnologyUpdate={removeTechnologyUpdate}
      onSaveCategory={saveCategoryState}
      onToggleCategory={toggleCategory}
      onUpsertTechnologyUpdate={saveTechnologyUpdate}
      primarySection={{
        key: "profile",
        label: "Profile",
        isDirty: isProfileDirty,
        render: (
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  onChange={(e) =>
                    setProfileDraft((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                  rows={4}
                  value={profileDraft.description}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="github-url">GitHub URL</Label>
                  <Input
                    id="github-url"
                    onChange={(e) =>
                      setProfileDraft((p) => ({
                        ...p,
                        githubUrl: e.target.value,
                      }))
                    }
                    value={profileDraft.githubUrl}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter-url">Twitter / X URL</Label>
                  <Input
                    id="twitter-url"
                    onChange={(e) =>
                      setProfileDraft((p) => ({
                        ...p,
                        twitterUrl: e.target.value,
                      }))
                    }
                    value={profileDraft.twitterUrl}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin-url">LinkedIn URL</Label>
                  <Input
                    id="linkedin-url"
                    onChange={(e) =>
                      setProfileDraft((p) => ({
                        ...p,
                        linkedinUrl: e.target.value,
                      }))
                    }
                    value={profileDraft.linkedinUrl}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website-url">Website URL</Label>
                  <Input
                    id="website-url"
                    onChange={(e) =>
                      setProfileDraft((p) => ({
                        ...p,
                        websiteUrl: e.target.value,
                      }))
                    }
                    value={profileDraft.websiteUrl}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Usage links</Label>
                  <Button
                    onClick={() =>
                      setProfileDraft((p) => ({
                        ...p,
                        usageLinks: [
                          ...p.usageLinks,
                          { id: createUsageLinkId(), label: "", url: "" },
                        ],
                      }))
                    }
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    <Plus />
                    Add link
                  </Button>
                </div>
                <div className="space-y-3">
                  {profileDraft.usageLinks.map((link, index) => (
                    <div
                      className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]"
                      key={link.id}
                    >
                      <Input
                        onChange={(e) =>
                          setProfileDraft((p) => {
                            const usageLinks = [...p.usageLinks];
                            usageLinks[index] = {
                              ...usageLinks[index],
                              label: e.target.value,
                            };
                            return { ...p, usageLinks };
                          })
                        }
                        value={link.label}
                      />
                      <Input
                        onChange={(e) =>
                          setProfileDraft((p) => {
                            const usageLinks = [...p.usageLinks];
                            usageLinks[index] = {
                              ...usageLinks[index],
                              url: e.target.value,
                            };
                            return { ...p, usageLinks };
                          })
                        }
                        value={link.url}
                      />
                      <Button
                        className="text-destructive hover:text-destructive"
                        onClick={() =>
                          setProfileDraft((p) => ({
                            ...p,
                            usageLinks: p.usageLinks.filter(
                              (_, i) => i !== index
                            ),
                          }))
                        }
                        size="icon-sm"
                        type="button"
                        variant="ghost"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button
                disabled={!isProfileDirty || isSavingProfile}
                onClick={saveProfileSection}
                type="button"
              >
                {isSavingProfile ? "Saving..." : "Save profile"}
              </Button>
            </CardFooter>
          </Card>
        ),
      }}
      sidebarTitle="Edit your stack"
      technologies={technologies}
      techReasons={techReasons}
      updateReasons={updateReasons}
    />
  );
}
