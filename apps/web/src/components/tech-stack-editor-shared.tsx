import type { Id } from "@everythingbuiltwith/backend/convex/_generated/dataModel";
import { format } from "date-fns";
import {
  ArrowDown,
  ArrowUp,
  Bold,
  Eye,
  Link2,
  Minus,
  Pencil,
  Plus,
  Trash2,
  Underline,
} from "lucide-react";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { TechnologyIcon } from "@/components/technology-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectList,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const markdownSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "u"],
  attributes: {
    ...defaultSchema.attributes,
    a: [...(defaultSchema.attributes?.a ?? []), "target", "rel"],
  },
};

export interface TechReason {
  _id: Id<"techReason">;
  name: string;
}

export interface Technology {
  _id: Id<"technology">;
  iconPath: string;
  name: string;
}

export interface CategoryEditorState {
  longDescription: string;
  shortDescription: string;
  technologyIds: Id<"technology">[];
  techReasonId?: Id<"techReason">;
}

export interface Category {
  _id: Id<"techCategory">;
  isActive: boolean;
  name: string;
  order: number;
  state: CategoryEditorState;
}

export interface UpdateReason {
  _id: Id<"updateReason">;
  name: string;
}

export interface TechnologyUpdate {
  _id: Id<"techStackUpdate">;
  date: number;
  description: string;
  oldTechnologyId: Id<"technology">;
  updateReasonId: Id<"updateReason">;
}

interface PrimarySectionConfig<PrimaryKey extends string> {
  isDirty: boolean;
  key: PrimaryKey;
  label: string;
  render: ReactNode;
}

interface TechStackEditorSharedProps<PrimaryKey extends string> {
  categories: Category[];
  categoryUpdates: {
    categoryId: Id<"techCategory">;
    updates: TechnologyUpdate[];
  }[];
  onCreateTechnology: (args: {
    name: string;
  }) => Promise<{ _id: Id<"technology">; name: string; iconPath: string }>;
  onDeleteTechnologyUpdate: (args: {
    categoryId: Id<"techCategory">;
    technologyId: Id<"technology">;
  }) => Promise<void>;
  onSaveCategory: (args: {
    categoryId: Id<"techCategory">;
    state: CategoryEditorState;
  }) => Promise<void>;
  onToggleCategory: (args: {
    categoryId: Id<"techCategory">;
    isActive: boolean;
  }) => Promise<void>;
  onUpsertTechnologyUpdate: (args: {
    categoryId: Id<"techCategory">;
    technologyId: Id<"technology">;
    updateReasonId: Id<"updateReason">;
    description: string;
    date: number;
  }) => Promise<{ updateId: Id<"techStackUpdate"> }>;
  primarySection: PrimarySectionConfig<PrimaryKey>;
  sidebarTitle: string;
  technologies: Technology[];
  techReasons: TechReason[];
  updateReasons: UpdateReason[];
}

type SectionKey<PrimaryKey extends string> = PrimaryKey | Id<"techCategory">;

const emptyCategoryState = (): CategoryEditorState => ({
  techReasonId: undefined,
  shortDescription: "",
  longDescription: "",
  technologyIds: [],
});

const uniqTech = (ids: Id<"technology">[]) => Array.from(new Set(ids));

const detailsEqual = (a: CategoryEditorState, b: CategoryEditorState) =>
  a.techReasonId === b.techReasonId &&
  a.shortDescription === b.shortDescription &&
  a.longDescription === b.longDescription;

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: central shared editor orchestrates all panel interactions.
export function TechStackEditorShared<PrimaryKey extends string>({
  categoryUpdates,
  categories,
  onDeleteTechnologyUpdate,
  onSaveCategory,
  onUpsertTechnologyUpdate,
  onToggleCategory,
  onCreateTechnology,
  primarySection,
  sidebarTitle,
  techReasons,
  updateReasons,
  technologies,
}: TechStackEditorSharedProps<PrimaryKey>) {
  const initialDrafts = Object.fromEntries(
    categories.map((c) => [
      c._id,
      {
        ...c.state,
        technologyIds: [...c.state.technologyIds],
      },
    ])
  ) as Record<string, CategoryEditorState>;
  const initialActive = Object.fromEntries(
    categories.map((c) => [c._id, c.isActive])
  ) as Record<string, boolean>;
  const initialTechnologyUpdates = Object.fromEntries(
    categoryUpdates.map((entry) => [
      entry.categoryId,
      Object.fromEntries(
        entry.updates.map((update) => [update.oldTechnologyId, update])
      ),
    ])
  ) as Record<string, Record<string, TechnologyUpdate>>;

  const [activeSection, setActiveSection] = useState<SectionKey<PrimaryKey>>(
    primarySection.key
  );
  const [drafts, setDrafts] = useState(initialDrafts);
  const [savedDrafts, setSavedDrafts] = useState(initialDrafts);
  const [activeMap, setActiveMap] = useState(initialActive);
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [isTogglingCategoryId, setIsTogglingCategoryId] =
    useState<Id<"techCategory"> | null>(null);
  const [techSearch, setTechSearch] = useState("");
  const [pendingTechIds, setPendingTechIds] = useState<Id<"technology">[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isDeprecationDialogOpen, setIsDeprecationDialogOpen] = useState(false);
  const [isSavingDeprecation, setIsSavingDeprecation] = useState(false);
  const [allTechnologies, setAllTechnologies] = useState(technologies);
  const [isCreatingTechnology, setIsCreatingTechnology] = useState(false);
  const [editingTechnologyId, setEditingTechnologyId] =
    useState<Id<"technology"> | null>(null);
  const [deprecationReasonId, setDeprecationReasonId] = useState<
    Id<"updateReason"> | undefined
  >(undefined);
  const [deprecationDescription, setDeprecationDescription] = useState("");
  const [deprecationDate, setDeprecationDate] = useState<Date | undefined>(
    undefined
  );
  const [linkUrl, setLinkUrl] = useState("");
  const [longDescriptionMode, setLongDescriptionMode] = useState<
    "preview" | "edit"
  >("edit");
  const [technologyUpdatesByCategory, setTechnologyUpdatesByCategory] =
    useState(initialTechnologyUpdates);
  const longDescriptionRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    setAllTechnologies((previous) => {
      const technologiesById = new Map(
        previous.map((technology) => [technology._id, technology])
      );
      for (const technology of technologies) {
        technologiesById.set(technology._id, technology);
      }
      return [...technologiesById.values()].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    });
  }, [technologies]);

  const activeCategory =
    activeSection === primarySection.key
      ? null
      : (categories.find((c) => c._id === activeSection) ?? null);
  const activeCategoryEnabled =
    activeCategory === null
      ? false
      : (activeMap[activeCategory._id] ?? activeCategory.isActive);
  const activeState =
    activeCategory === null
      ? null
      : (drafts[activeCategory._id] ?? emptyCategoryState());

  const technologiesById = useMemo(
    () =>
      new Map(
        allTechnologies.map((technology) => [technology._id, technology])
      ),
    [allTechnologies]
  );
  const selectedTechnologies = useMemo(() => {
    if (!activeState) {
      return [];
    }
    return activeState.technologyIds
      .map((id) => technologiesById.get(id))
      .filter(
        (technology): technology is Technology => technology !== undefined
      );
  }, [activeState, technologiesById]);
  const activeTechnologyUpdates = useMemo<
    Record<string, TechnologyUpdate>
  >(() => {
    if (!activeCategory) {
      return {};
    }
    return technologyUpdatesByCategory[activeCategory._id] ?? {};
  }, [activeCategory, technologyUpdatesByCategory]);
  const currentTechnologies = useMemo(
    () =>
      selectedTechnologies.filter(
        (tech) => activeTechnologyUpdates[tech._id] === undefined
      ),
    [activeTechnologyUpdates, selectedTechnologies]
  );
  const deprecatedTechnologies = useMemo(
    () =>
      Object.values(activeTechnologyUpdates)
        .map((update) => ({
          technology: technologiesById.get(update.oldTechnologyId),
          update,
        }))
        .filter(
          (
            entry
          ): entry is { technology: Technology; update: TechnologyUpdate } =>
            entry.technology !== undefined
        )
        .sort((a, b) => b.update.date - a.update.date),
    [activeTechnologyUpdates, technologiesById]
  );
  const hasAnyTechnologyRows =
    currentTechnologies.length > 0 || deprecatedTechnologies.length > 0;
  const hasNoTechnologyRows = !hasAnyTechnologyRows;

  const normalizedTechSearch = techSearch.trim();
  const normalizedTechSearchLower = normalizedTechSearch.toLowerCase();
  const exactMatchTechnology = useMemo(
    () =>
      allTechnologies.find(
        (technology) =>
          technology.name.trim().toLowerCase() === normalizedTechSearchLower
      ),
    [allTechnologies, normalizedTechSearchLower]
  );
  const canCreateTechnology =
    activeCategoryEnabled &&
    normalizedTechSearch.length > 0 &&
    exactMatchTechnology === undefined;

  const availableTech = useMemo(() => {
    if (!activeState) {
      return [];
    }
    if (!activeCategoryEnabled) {
      return [];
    }
    const chosen = new Set(activeState.technologyIds);
    const q = techSearch.trim().toLowerCase();
    return allTechnologies.filter(
      (t) =>
        !chosen.has(t._id) &&
        (q.length === 0 || t.name.toLowerCase().includes(q))
    );
  }, [activeState, activeCategoryEnabled, allTechnologies, techSearch]);

  const resetDeprecationDialog = () => {
    setEditingTechnologyId(null);
    setDeprecationReasonId(undefined);
    setDeprecationDescription("");
    setDeprecationDate(undefined);
    setIsSavingDeprecation(false);
  };

  const openDeprecationDialog = (technologyId: Id<"technology">) => {
    if (!activeCategory) {
      return;
    }
    const existingUpdate =
      technologyUpdatesByCategory[activeCategory._id]?.[technologyId];
    setEditingTechnologyId(technologyId);
    setDeprecationReasonId(existingUpdate?.updateReasonId);
    setDeprecationDescription(existingUpdate?.description ?? "");
    setDeprecationDate(
      existingUpdate === undefined ? new Date() : new Date(existingUpdate.date)
    );
    setIsDeprecationDialogOpen(true);
  };

  const updateActiveState = (
    updater: (prev: CategoryEditorState) => CategoryEditorState
  ) => {
    if (!activeCategory) {
      return;
    }
    setDrafts((prev) => ({
      ...prev,
      [activeCategory._id]: updater(
        prev[activeCategory._id] ?? emptyCategoryState()
      ),
    }));
  };

  const autosaveTech = async (
    categoryId: Id<"techCategory">,
    savedDetails: CategoryEditorState,
    before: CategoryEditorState,
    after: CategoryEditorState
  ) => {
    const technologyIds = uniqTech(after.technologyIds);
    try {
      await onSaveCategory({
        categoryId,
        state: {
          ...savedDetails,
          technologyIds,
        },
      });
      setSavedDrafts((prev) => ({
        ...prev,
        [categoryId]: {
          ...savedDetails,
          technologyIds,
        },
      }));
    } catch (_error) {
      setDrafts((prev) => ({ ...prev, [categoryId]: before }));
      toast.error("Could not auto-save technologies");
    }
  };

  const applyTechChange = (
    updater: (prev: CategoryEditorState) => CategoryEditorState
  ) => {
    if (!activeCategory) {
      return;
    }
    if (!activeState) {
      return;
    }
    const before = activeState;
    const after = updater(before);
    const savedDetails =
      savedDrafts[activeCategory._id] ?? emptyCategoryState();
    setDrafts((prev) => ({ ...prev, [activeCategory._id]: after }));
    const nextIds = new Set(after.technologyIds);
    setTechnologyUpdatesByCategory((prev) => {
      const categoryUpdates = prev[activeCategory._id] ?? {};
      const filteredUpdates = Object.fromEntries(
        Object.entries(categoryUpdates).filter(([technologyId]) =>
          nextIds.has(technologyId as Id<"technology">)
        )
      ) as Record<string, TechnologyUpdate>;
      return {
        ...prev,
        [activeCategory._id]: filteredUpdates,
      };
    });
    autosaveTech(activeCategory._id, savedDetails, before, after).catch(() => {
      toast.error("Could not auto-save technologies");
    });
  };

  const saveCategoryDetails = async () => {
    if (!activeCategory) {
      return;
    }
    if (!activeState) {
      return;
    }
    setIsSavingDetails(true);
    try {
      const technologyIds = uniqTech(activeState.technologyIds);
      const next = { ...activeState, technologyIds };
      await onSaveCategory({
        categoryId: activeCategory._id,
        state: next,
      });
      setDrafts((prev) => ({ ...prev, [activeCategory._id]: next }));
      setSavedDrafts((prev) => ({ ...prev, [activeCategory._id]: next }));
      toast.success(`${activeCategory.name} details saved`);
    } catch (_error) {
      toast.error(`Could not save ${activeCategory.name}`);
    } finally {
      setIsSavingDetails(false);
    }
  };

  const toggleCategory = async (category: Category, isActive: boolean) => {
    setIsTogglingCategoryId(category._id);
    try {
      await onToggleCategory({ categoryId: category._id, isActive });
      setActiveMap((prev) => ({ ...prev, [category._id]: isActive }));
      if (isActive) {
        setDrafts((prev) => ({
          ...prev,
          [category._id]: prev[category._id] ?? emptyCategoryState(),
        }));
        setSavedDrafts((prev) => ({
          ...prev,
          [category._id]: prev[category._id] ?? emptyCategoryState(),
        }));
        setActiveSection(category._id);
      } else {
        setDrafts((prev) => ({
          ...prev,
          [category._id]: emptyCategoryState(),
        }));
        setSavedDrafts((prev) => ({
          ...prev,
          [category._id]: emptyCategoryState(),
        }));
        setTechnologyUpdatesByCategory((prev) => ({
          ...prev,
          [category._id]: {},
        }));
        if (activeSection === category._id) {
          setActiveSection(primarySection.key);
        }
      }
      toast.success(
        isActive ? `${category.name} activated` : `${category.name} deactivated`
      );
    } catch (_error) {
      toast.error(`Could not update ${category.name}`);
    } finally {
      setIsTogglingCategoryId(null);
    }
  };

  const formatLongDescription = (
    prefix: string,
    suffix: string,
    fallback: string
  ) => {
    if (!activeState) {
      return;
    }
    const textarea = longDescriptionRef.current;
    const start = textarea?.selectionStart ?? 0;
    const end = textarea?.selectionEnd ?? 0;
    const current = activeState.longDescription;
    const selected = current.slice(start, end);
    const text = selected.length > 0 ? selected : fallback;
    updateActiveState((prev) => ({
      ...prev,
      longDescription: `${current.slice(0, start)}${prefix}${text}${suffix}${current.slice(end)}`,
    }));
  };

  const saveTechnologyDeprecation = async () => {
    if (!activeCategory || editingTechnologyId === null) {
      return;
    }
    if (deprecationReasonId === undefined) {
      toast.error("Please choose an update reason");
      return;
    }
    if (deprecationDate === undefined) {
      toast.error("Please choose a date");
      return;
    }
    const timestamp = deprecationDate.getTime();
    if (!Number.isFinite(timestamp)) {
      toast.error("Please choose a valid date");
      return;
    }

    setIsSavingDeprecation(true);
    try {
      const result = await onUpsertTechnologyUpdate({
        categoryId: activeCategory._id,
        technologyId: editingTechnologyId,
        updateReasonId: deprecationReasonId,
        description: deprecationDescription,
        date: timestamp,
      });
      const nextUpdate: TechnologyUpdate = {
        _id: result.updateId,
        oldTechnologyId: editingTechnologyId,
        updateReasonId: deprecationReasonId,
        description: deprecationDescription.trim(),
        date: timestamp,
      };
      setTechnologyUpdatesByCategory((prev) => ({
        ...prev,
        [activeCategory._id]: {
          ...(prev[activeCategory._id] ?? {}),
          [editingTechnologyId]: nextUpdate,
        },
      }));
      setIsDeprecationDialogOpen(false);
      resetDeprecationDialog();
      toast.success("Technology deprecation saved");
    } catch (_error) {
      toast.error("Could not save technology deprecation");
    } finally {
      setIsSavingDeprecation(false);
    }
  };

  const deleteTechnologyDeprecation = async (
    technologyId: Id<"technology">
  ) => {
    if (!activeCategory) {
      return;
    }
    const previousUpdate =
      technologyUpdatesByCategory[activeCategory._id]?.[technologyId];
    if (!previousUpdate) {
      return;
    }
    setTechnologyUpdatesByCategory((prev) => {
      const categoryUpdates = { ...(prev[activeCategory._id] ?? {}) };
      delete categoryUpdates[technologyId];
      return {
        ...prev,
        [activeCategory._id]: categoryUpdates,
      };
    });
    try {
      await onDeleteTechnologyUpdate({
        categoryId: activeCategory._id,
        technologyId,
      });
      toast.success("Deprecated technology removed");
    } catch (_error) {
      setTechnologyUpdatesByCategory((prev) => ({
        ...prev,
        [activeCategory._id]: {
          ...(prev[activeCategory._id] ?? {}),
          [technologyId]: previousUpdate,
        },
      }));
      toast.error("Could not remove deprecated technology");
    }
  };

  const createTechnologyFromSearch = async () => {
    if (!canCreateTechnology) {
      return;
    }
    setIsCreatingTechnology(true);
    try {
      const createdTechnology = await onCreateTechnology({
        name: normalizedTechSearch,
      });
      setAllTechnologies((previous) => {
        if (
          previous.some(
            (technology) => technology._id === createdTechnology._id
          )
        ) {
          return previous;
        }
        return [...previous, createdTechnology].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      });
      setPendingTechIds((previous) =>
        uniqTech([...previous, createdTechnology._id])
      );
      setTechSearch(createdTechnology.name);
      toast.success(`Created "${createdTechnology.name}"`);
    } catch (_error) {
      toast.error("Could not create technology");
    } finally {
      setIsCreatingTechnology(false);
    }
  };

  let categoryDetailsDirty = false;
  if (activeCategory && activeState && activeCategoryEnabled) {
    categoryDetailsDirty = !detailsEqual(
      activeState,
      savedDrafts[activeCategory._id] ?? emptyCategoryState()
    );
  }
  let showInactiveCategoryCard = true;
  if (activeCategory && activeState && activeCategoryEnabled) {
    showInactiveCategoryCard = false;
  }
  const editableCategory =
    activeCategory && activeState && activeCategoryEnabled
      ? { category: activeCategory, state: activeState }
      : null;
  const activeCategories = categories.filter(
    (category) => activeMap[category._id] ?? category.isActive
  );
  const inactiveCategories = categories.filter(
    (category) => !(activeMap[category._id] ?? category.isActive)
  );

  let sectionContent: ReactNode;
  if (activeSection === primarySection.key) {
    sectionContent = primarySection.render;
  } else if (showInactiveCategoryCard) {
    sectionContent = (
      <Card>
        <CardHeader>
          <CardTitle>{activeCategory?.name ?? "Category"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Activate this category in the sidebar to edit and share it.
          </p>
        </CardContent>
      </Card>
    );
  } else {
    sectionContent = (
      <Card>
        <CardHeader>
          <CardTitle>{editableCategory?.category.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="tech-reason">Reason</Label>
            <Select
              onValueChange={(value) =>
                updateActiveState((prev) => ({
                  ...prev,
                  techReasonId: value ? (value as Id<"techReason">) : undefined,
                }))
              }
              value={editableCategory?.state.techReasonId ?? ""}
            >
              <SelectTrigger id="tech-reason">
                <SelectValue placeholder="No information">
                  {(value) => {
                    if (!value) {
                      return "No information";
                    }
                    return (
                      techReasons.find((reason) => reason._id === value)
                        ?.name ?? "No information"
                    );
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectList>
                  <SelectItem value="">No information</SelectItem>
                  {techReasons.map((reason) => (
                    <SelectItem key={reason._id} value={reason._id}>
                      {reason.name}
                    </SelectItem>
                  ))}
                </SelectList>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="short-description">Short description</Label>
            <Input
              id="short-description"
              onChange={(e) =>
                updateActiveState((prev) => ({
                  ...prev,
                  shortDescription: e.target.value,
                }))
              }
              value={editableCategory?.state.shortDescription ?? ""}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="long-description">Long description</Label>
              <ToggleGroup
                onValueChange={(values) => {
                  const [first] = values;
                  if (first === "preview" || first === "edit") {
                    setLongDescriptionMode(first);
                  }
                }}
                value={[longDescriptionMode]}
              >
                <ToggleGroupItem aria-label="Edit markdown mode" value="edit">
                  <Pencil className="mr-2 size-3.5" />
                  Edit
                </ToggleGroupItem>
                <ToggleGroupItem aria-label="Preview mode" value="preview">
                  <Eye className="mr-2 size-3.5" />
                  Preview
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            {longDescriptionMode === "edit" ? (
              <div className="space-y-2">
                <ToggleGroup
                  multiple
                  onValueChange={() => undefined}
                  value={[]}
                >
                  <ToggleGroupItem
                    aria-label="Bold"
                    onClick={() =>
                      formatLongDescription("**", "**", "bold text")
                    }
                    value="bold"
                  >
                    <Bold className="size-3.5" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    aria-label="Underline"
                    onClick={() =>
                      formatLongDescription("<u>", "</u>", "underlined text")
                    }
                    value="underline"
                  >
                    <Underline className="size-3.5" />
                  </ToggleGroupItem>
                  <Dialog
                    onOpenChange={setIsLinkDialogOpen}
                    open={isLinkDialogOpen}
                  >
                    <DialogTrigger
                      render={
                        <ToggleGroupItem
                          aria-label="Insert link"
                          onClick={() => setIsLinkDialogOpen(true)}
                          value="link"
                        />
                      }
                    >
                      <Link2 className="size-3.5" />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Insert link</DialogTitle>
                        <DialogDescription>
                          Turn selected text into markdown link text.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="px-4">
                        <Input
                          onChange={(e) => setLinkUrl(e.target.value)}
                          placeholder="https://example.com"
                          value={linkUrl}
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={() => setIsLinkDialogOpen(false)}
                          type="button"
                          variant="outline"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            if (!linkUrl.trim()) {
                              toast.error("Please provide a valid URL");
                              return;
                            }
                            formatLongDescription(
                              "[",
                              `](${linkUrl.trim()})`,
                              "link text"
                            );
                            setLinkUrl("");
                            setIsLinkDialogOpen(false);
                          }}
                          type="button"
                        >
                          Insert link
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </ToggleGroup>
                <Textarea
                  id="long-description"
                  onChange={(e) =>
                    updateActiveState((prev) => ({
                      ...prev,
                      longDescription: e.target.value,
                    }))
                  }
                  ref={longDescriptionRef}
                  rows={8}
                  value={editableCategory?.state.longDescription ?? ""}
                />
              </div>
            ) : (
              <div className="min-h-40 rounded-lg border border-input px-3 py-2 text-sm">
                {/* biome-ignore lint: prose utility ordering is intentional */}
                <div className="prose prose-invert max-w-none prose-a:text-destructive prose-a:underline prose-a:decoration-destructive prose-p:my-2 prose-ul:my-2 prose-ol:my-2">
                  <ReactMarkdown
                    components={{
                      a: ({ className, ...props }) => (
                        <a
                          className={cn(
                            "text-destructive underline decoration-destructive underline-offset-2",
                            className
                          )}
                          rel="noopener noreferrer"
                          target="_blank"
                          {...props}
                        />
                      ),
                    }}
                    rehypePlugins={[
                      rehypeRaw,
                      [rehypeSanitize, markdownSchema],
                    ]}
                    remarkPlugins={[remarkGfm]}
                  >
                    {editableCategory?.state.longDescription?.trim() ||
                      "_No long description yet._"}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-end border-border border-t pt-4">
            <Button
              disabled={!categoryDetailsDirty || isSavingDetails}
              onClick={saveCategoryDetails}
              type="button"
            >
              {isSavingDetails ? "Saving..." : "Save details"}
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Technologies</Label>
              </div>
              <Dialog
                onOpenChange={(open) => {
                  setIsDeprecationDialogOpen(open);
                  if (!open) {
                    resetDeprecationDialog();
                  }
                }}
                open={isDeprecationDialogOpen}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingTechnologyId &&
                      activeTechnologyUpdates[editingTechnologyId]
                        ? "Edit deprecation"
                        : "Deprecate technology"}
                    </DialogTitle>
                    <DialogDescription>
                      Explain why this technology was deprecated and when the
                      change happened.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 px-4">
                    <div className="space-y-2">
                      <Label htmlFor="deprecation-reason">Update reason</Label>
                      <Select
                        onValueChange={(value) =>
                          setDeprecationReasonId(value as Id<"updateReason">)
                        }
                        value={deprecationReasonId ?? ""}
                      >
                        <SelectTrigger id="deprecation-reason">
                          <SelectValue placeholder="Select a reason">
                            {(value) =>
                              updateReasons.find(
                                (reason) => reason._id === value
                              )?.name ?? "Select a reason"
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectList>
                            {updateReasons.map((reason) => (
                              <SelectItem key={reason._id} value={reason._id}>
                                {reason.name}
                              </SelectItem>
                            ))}
                          </SelectList>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deprecation-description">
                        Description
                      </Label>
                      <Textarea
                        id="deprecation-description"
                        onChange={(event) =>
                          setDeprecationDescription(event.target.value)
                        }
                        placeholder="Why did this technology become deprecated?"
                        rows={4}
                        value={deprecationDescription}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deprecation-date">Date</Label>
                      <DatePicker
                        id="deprecation-date"
                        onChange={setDeprecationDate}
                        value={deprecationDate}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => {
                        setIsDeprecationDialogOpen(false);
                        resetDeprecationDialog();
                      }}
                      type="button"
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={
                        isSavingDeprecation ||
                        deprecationReasonId === undefined ||
                        deprecationDate === undefined
                      }
                      onClick={saveTechnologyDeprecation}
                      type="button"
                    >
                      {isSavingDeprecation ? "Saving..." : "Save update"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog
                onOpenChange={(open) => {
                  setIsAddDialogOpen(open);
                  if (!open) {
                    setPendingTechIds([]);
                    setTechSearch("");
                  }
                }}
                open={isAddDialogOpen}
              >
                <DialogTrigger
                  render={<Button size="sm" type="button" variant="outline" />}
                >
                  <Plus />
                  Add technologies
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add technologies</DialogTitle>
                    <DialogDescription>
                      Select multiple technologies for{" "}
                      {editableCategory?.category.name ?? "this category"}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 px-4">
                    <Input
                      onChange={(e) => setTechSearch(e.target.value)}
                      placeholder="Search technologies..."
                      value={techSearch}
                    />
                    {canCreateTechnology ? (
                      <Button
                        disabled={isCreatingTechnology}
                        onClick={createTechnologyFromSearch}
                        size="sm"
                        type="button"
                        variant="outline"
                      >
                        {isCreatingTechnology
                          ? "Creating..."
                          : `Create "${normalizedTechSearch}"`}
                      </Button>
                    ) : null}
                    <div className="max-h-72 space-y-1 overflow-y-auto">
                      {availableTech.map((tech) => (
                        <label
                          className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted"
                          htmlFor={`add-tech-${tech._id}`}
                          key={tech._id}
                        >
                          <Checkbox
                            checked={pendingTechIds.includes(tech._id)}
                            id={`add-tech-${tech._id}`}
                            onCheckedChange={(checked) =>
                              setPendingTechIds((prev) =>
                                checked
                                  ? [...prev, tech._id]
                                  : prev.filter((id) => id !== tech._id)
                              )
                            }
                          />
                          <span className="flex items-center gap-2">
                            <TechnologyIcon
                              className="size-4"
                              iconPath={tech.iconPath}
                              name={tech.name}
                              size={16}
                            />
                            {tech.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <DialogFooter className="border-border border-t px-4 pt-4">
                    <p className="mr-auto text-muted-foreground text-sm">
                      {pendingTechIds.length} technologies selected
                    </p>
                    <Button
                      disabled={pendingTechIds.length === 0}
                      onClick={() => {
                        applyTechChange((prev) => ({
                          ...prev,
                          technologyIds: uniqTech([
                            ...prev.technologyIds,
                            ...pendingTechIds,
                          ]),
                        }));
                        setPendingTechIds([]);
                        setIsAddDialogOpen(false);
                      }}
                      type="button"
                    >
                      Add selected
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            {hasNoTechnologyRows ? (
              <Empty className="p-6">
                <EmptyHeader className="max-w-none">
                  <EmptyTitle className="text-base">
                    No technologies yet
                  </EmptyTitle>
                  <EmptyDescription className="mt-1 text-sm">
                    Add technologies to show what tools power this category.
                  </EmptyDescription>
                  <Button
                    className="mt-4"
                    onClick={() => setIsAddDialogOpen(true)}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    <Plus />
                    Add technology
                  </Button>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="space-y-5">
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">
                    Current technologies
                  </p>
                  {currentTechnologies.length === 0 ? (
                    <p className="rounded-lg border border-dashed px-3 py-2 text-muted-foreground text-sm">
                      No current technologies in this category.
                    </p>
                  ) : (
                    currentTechnologies.map((tech) => {
                      const index = selectedTechnologies.findIndex(
                        (selected) => selected._id === tech._id
                      );
                      return (
                        <div
                          className="flex items-center justify-between rounded-lg border px-3 py-2"
                          key={tech._id}
                        >
                          <div className="flex items-center gap-2">
                            <TechnologyIcon
                              className="size-4"
                              iconPath={tech.iconPath}
                              name={tech.name}
                              size={16}
                            />
                            <span className="font-medium text-sm">
                              {tech.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => openDeprecationDialog(tech._id)}
                              size="sm"
                              type="button"
                              variant="outline"
                            >
                              Deprecate
                            </Button>
                            <Button
                              disabled={index <= 0}
                              onClick={() =>
                                applyTechChange((prev) => {
                                  const next = [...prev.technologyIds];
                                  [next[index - 1], next[index]] = [
                                    next[index],
                                    next[index - 1],
                                  ];
                                  return { ...prev, technologyIds: next };
                                })
                              }
                              size="icon-sm"
                              type="button"
                              variant="outline"
                            >
                              <ArrowUp />
                            </Button>
                            <Button
                              disabled={
                                index === selectedTechnologies.length - 1
                              }
                              onClick={() =>
                                applyTechChange((prev) => {
                                  const next = [...prev.technologyIds];
                                  [next[index], next[index + 1]] = [
                                    next[index + 1],
                                    next[index],
                                  ];
                                  return { ...prev, technologyIds: next };
                                })
                              }
                              size="icon-sm"
                              type="button"
                              variant="outline"
                            >
                              <ArrowDown />
                            </Button>
                            <Button
                              className="text-destructive hover:text-destructive"
                              onClick={() =>
                                applyTechChange((prev) => ({
                                  ...prev,
                                  technologyIds: prev.technologyIds.filter(
                                    (id) => id !== tech._id
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
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">
                    Deprecated technologies
                  </p>
                  {deprecatedTechnologies.length === 0 ? (
                    <p className="rounded-lg border border-dashed px-3 py-2 text-muted-foreground text-sm">
                      No deprecated technologies yet.
                    </p>
                  ) : (
                    deprecatedTechnologies.map(
                      ({ technology: tech, update }) => {
                        const reason = updateReasons.find(
                          (item) => item._id === update.updateReasonId
                        );
                        return (
                          <div
                            className="flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2"
                            key={tech._id}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <TechnologyIcon
                                  className="size-4"
                                  iconPath={tech.iconPath}
                                  name={tech.name}
                                  size={16}
                                />
                                <span className="font-medium text-sm">
                                  {tech.name}
                                </span>
                              </div>
                              <p className="text-muted-foreground text-xs">
                                {reason?.name ?? "Update recorded"}{" "}
                                {update.date
                                  ? `• ${format(new Date(update.date), "PPP")}`
                                  : ""}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => openDeprecationDialog(tech._id)}
                                size="sm"
                                type="button"
                                variant="outline"
                              >
                                Edit
                              </Button>
                              <Button
                                className="text-destructive hover:text-destructive"
                                onClick={() =>
                                  deleteTechnologyDeprecation(tech._id)
                                }
                                size="icon-sm"
                                type="button"
                                variant="ghost"
                              >
                                <Trash2 />
                              </Button>
                            </div>
                          </div>
                        );
                      }
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <p className="text-muted-foreground text-xs">
            Technology changes save automatically
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="container mx-auto grid gap-6 px-4 py-10 lg:grid-cols-[320px_1fr]">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>{sidebarTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <button
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
              activeSection === primarySection.key
                ? "bg-primary/10 text-primary"
                : "hover:bg-muted"
            )}
            onClick={() => setActiveSection(primarySection.key)}
            type="button"
          >
            <span>{primarySection.label}</span>
            {primarySection.isDirty ? (
              <Badge variant="secondary">Unsaved</Badge>
            ) : null}
          </button>
          <div className="pt-2">
            <TooltipProvider>
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-muted-foreground text-xs uppercase tracking-wide">
                    Active categories
                  </p>
                  <div className="space-y-2">
                    {activeCategories.length === 0 ? (
                      <p className="px-2 py-1 text-muted-foreground text-xs">
                        No active categories yet.
                      </p>
                    ) : null}
                    {activeCategories.map((category) => {
                      const state =
                        drafts[category._id] ?? emptyCategoryState();
                      const isDirty = !detailsEqual(
                        state,
                        savedDrafts[category._id] ?? emptyCategoryState()
                      );
                      const isSelected = activeSection === category._id;

                      return (
                        <div
                          className={cn(
                            "rounded-lg border border-transparent px-2 py-1 transition-colors",
                            isSelected
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-muted"
                          )}
                          key={category._id}
                        >
                          <div className="flex items-center gap-2">
                            <button
                              className="flex-1 rounded-md px-2 py-1 text-left text-sm"
                              onClick={() => setActiveSection(category._id)}
                              type="button"
                            >
                              {category.name}
                            </button>
                            {isDirty ? (
                              <Badge variant="secondary">Unsaved</Badge>
                            ) : null}
                            <Tooltip>
                              <TooltipTrigger>
                                <Button
                                  aria-label={`Deactivate ${category.name}`}
                                  disabled={
                                    isTogglingCategoryId === category._id
                                  }
                                  onClick={() =>
                                    toggleCategory(category, false)
                                  }
                                  size="icon-sm"
                                  type="button"
                                  variant="ghost"
                                >
                                  <Minus className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Deactivate category</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-muted-foreground text-xs uppercase tracking-wide">
                    Inactive categories
                  </p>
                  <div className="space-y-2">
                    {inactiveCategories.length === 0 ? (
                      <p className="px-2 py-1 text-muted-foreground text-xs">
                        All categories are active.
                      </p>
                    ) : null}
                    {inactiveCategories.map((category) => (
                      <div
                        className="rounded-lg border border-transparent px-2 py-1 text-muted-foreground transition-colors hover:bg-muted"
                        key={category._id}
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex-1 rounded-md px-2 py-1 text-left text-sm">
                            {category.name}
                          </span>
                          <Tooltip>
                            <TooltipTrigger>
                              <Button
                                aria-label={`Activate ${category.name}`}
                                disabled={isTogglingCategoryId === category._id}
                                onClick={() => toggleCategory(category, true)}
                                size="icon-sm"
                                type="button"
                                variant="ghost"
                              >
                                <Plus className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Activate category</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>

      {sectionContent}
    </div>
  );
}
