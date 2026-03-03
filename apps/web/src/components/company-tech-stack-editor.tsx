import { api } from "@everythingbuiltwith/backend/convex/_generated/api";
import type { Id } from "@everythingbuiltwith/backend/convex/_generated/dataModel";
import { useMutation } from "convex/react";
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

interface CompanyDraft {
  companyInfo: { hq: string; size: string; website: string };
  description: string;
  logo: string;
  name: string;
}
interface CompanyTechStackEditorProps {
  categories: Category[];
  categoryUpdates: {
    categoryId: Id<"techCategory">;
    updates: TechnologyUpdate[];
  }[];
  company: {
    companyInfo: { hq: string; size: string; website: string };
    description: string;
    logo: string;
    name: string;
  };
  slug: string;
  technologies: Technology[];
  techReasons: TechReason[];
  updateReasons: UpdateReason[];
}

const createCompanyDraft = (
  company: CompanyTechStackEditorProps["company"]
): CompanyDraft => ({
  name: company.name,
  logo: company.logo,
  description: company.description,
  companyInfo: {
    size: company.companyInfo.size,
    website: company.companyInfo.website,
    hq: company.companyInfo.hq,
  },
});

export function CompanyTechStackEditor({
  slug,
  categories,
  categoryUpdates,
  company,
  techReasons,
  updateReasons,
  technologies,
}: CompanyTechStackEditorProps) {
  const saveCompany = useMutation(api.mutations.updateCompanyDetailsBySlug);
  const saveCategory = useMutation(
    api.mutations.upsertCompanyTechStackCategory
  );
  const setCategoryActive = useMutation(
    api.mutations.setCompanyTechStackCategoryActive
  );
  const upsertTechnologyUpdate = useMutation(
    api.mutations.upsertCompanyTechnologyDeprecationUpdate
  );
  const deleteTechnologyUpdate = useMutation(
    api.mutations.deleteCompanyTechnologyDeprecationUpdate
  );
  const createTechnology = useMutation(api.mutations.createTechnology);
  const [companyDraft, setCompanyDraft] = useState<CompanyDraft>(() =>
    createCompanyDraft(company)
  );
  const [savedCompany, setSavedCompany] = useState<CompanyDraft>(() =>
    createCompanyDraft(company)
  );
  const [isSavingCompany, setIsSavingCompany] = useState(false);
  const isCompanyDirty =
    JSON.stringify(companyDraft) !== JSON.stringify(savedCompany);

  const saveCompanySection = async () => {
    setIsSavingCompany(true);
    try {
      await saveCompany({ slug, ...companyDraft });
      setSavedCompany(companyDraft);
      toast.success("Company details saved");
    } catch (_error) {
      toast.error("Could not save company details");
    } finally {
      setIsSavingCompany(false);
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
      slug,
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
    await setCategoryActive({ slug, categoryId, isActive });
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
      slug,
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
      slug,
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
        key: "company",
        label: "Company",
        isDirty: isCompanyDirty,
        render: (
          <Card>
            <CardHeader>
              <CardTitle>Company details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Name</Label>
                  <Input
                    id="company-name"
                    onChange={(e) =>
                      setCompanyDraft((p) => ({ ...p, name: e.target.value }))
                    }
                    value={companyDraft.name}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-logo">Logo key</Label>
                  <Input
                    id="company-logo"
                    onChange={(e) =>
                      setCompanyDraft((p) => ({ ...p, logo: e.target.value }))
                    }
                    placeholder="e.g. github_full"
                    value={companyDraft.logo}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-description">Description</Label>
                <Textarea
                  id="company-description"
                  onChange={(e) =>
                    setCompanyDraft((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                  rows={4}
                  value={companyDraft.description}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="company-size">Company size</Label>
                  <Input
                    id="company-size"
                    onChange={(e) =>
                      setCompanyDraft((p) => ({
                        ...p,
                        companyInfo: { ...p.companyInfo, size: e.target.value },
                      }))
                    }
                    value={companyDraft.companyInfo.size}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-website">Website</Label>
                  <Input
                    id="company-website"
                    onChange={(e) =>
                      setCompanyDraft((p) => ({
                        ...p,
                        companyInfo: {
                          ...p.companyInfo,
                          website: e.target.value,
                        },
                      }))
                    }
                    value={companyDraft.companyInfo.website}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-hq">Headquarters</Label>
                  <Input
                    id="company-hq"
                    onChange={(e) =>
                      setCompanyDraft((p) => ({
                        ...p,
                        companyInfo: { ...p.companyInfo, hq: e.target.value },
                      }))
                    }
                    value={companyDraft.companyInfo.hq}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button
                disabled={!isCompanyDirty || isSavingCompany}
                onClick={saveCompanySection}
                type="button"
              >
                {isSavingCompany ? "Saving..." : "Save company"}
              </Button>
            </CardFooter>
          </Card>
        ),
      }}
      sidebarTitle="Edit company stack"
      technologies={technologies}
      techReasons={techReasons}
      updateReasons={updateReasons}
    />
  );
}
