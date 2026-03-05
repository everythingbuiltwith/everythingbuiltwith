import { Show, SignInButton, useUser } from "@clerk/tanstack-react-start";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@everythingbuiltwith/backend/convex/_generated/api";
import type { Id } from "@everythingbuiltwith/backend/convex/_generated/dataModel";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { TechStackCard } from "@/components/tech-stack-card";
import { TechnologyIcon } from "@/components/technology-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectList,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StackListPageProps {
  mode: "company" | "user";
}

interface StackListFilterOptions {
  industries: { _id: Id<"industry">; name: string }[];
  technologies: { iconPath: string; name: string }[];
}

interface CompanyCard {
  description: string;
  icon: string;
  industry: string;
  name: string;
  slug: string;
  teaserIcons: { icon: string; name: string }[];
}

interface UserCard {
  description: string;
  imageUrl?: string;
  name: string;
  teaserIcons: { icon: string; name: string }[];
  username: string;
}

const PAGE_SIZE = 12;

interface FilterSidebarProps {
  filterOptions: StackListFilterOptions;
  isCompanyMode: boolean;
  onIndustryChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onToggleTechnology: (iconPath: string) => void;
  resetFilters: () => void;
  search: string;
  selectedIndustryId: string;
  selectedTechnologyPaths: string[];
}

function FilterSidebar({
  filterOptions,
  isCompanyMode,
  onIndustryChange,
  onSearchChange,
  onToggleTechnology,
  resetFilters,
  search,
  selectedIndustryId,
  selectedTechnologyPaths,
}: FilterSidebarProps) {
  const [technologySearch, setTechnologySearch] = useState("");
  const selectedIndustryName =
    selectedIndustryId === "all"
      ? "All industries"
      : (filterOptions.industries.find(
          (industry) => industry._id === selectedIndustryId
        )?.name ?? "Select industry");
  const filteredTechnologies = useMemo(() => {
    const normalizedQuery = technologySearch.trim().toLowerCase();
    if (normalizedQuery.length === 0) {
      return filterOptions.technologies;
    }
    return filterOptions.technologies.filter((technology) =>
      technology.name.toLowerCase().includes(normalizedQuery)
    );
  }, [filterOptions.technologies, technologySearch]);
  const selectedTechnologyLabel = useMemo(() => {
    if (selectedTechnologyPaths.length === 0) {
      return "Select technologies";
    }
    const selectedNames = selectedTechnologyPaths
      .map(
        (iconPath) =>
          filterOptions.technologies.find(
            (entry) => entry.iconPath === iconPath
          )?.name
      )
      .filter((name): name is string => name !== undefined);

    if (selectedNames.length === 1) {
      return selectedNames[0];
    }
    if (selectedNames.length === 2) {
      return selectedNames.join(", ");
    }
    return `${selectedTechnologyPaths.length} technologies selected`;
  }, [filterOptions.technologies, selectedTechnologyPaths]);

  return (
    <aside className="lg:sticky lg:top-24 lg:h-fit">
      <div className="rounded-xl border border-border/70 bg-card/40 p-4">
        <div className="space-y-1">
          <p className="font-semibold text-sm">Search</p>
          <Input
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={
              isCompanyMode
                ? "Search company name or slug"
                : "Search username or display name"
            }
            value={search}
          />
        </div>

        {isCompanyMode ? (
          <div className="mt-4 space-y-4">
            <div className="space-y-1">
              <p className="font-semibold text-sm">Industry</p>
              <Select
                onValueChange={(value) => onIndustryChange(value ?? "all")}
                value={selectedIndustryId}
              >
                <SelectTrigger>
                  <SelectValue>{selectedIndustryName}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectList>
                    <SelectItem value="all">All industries</SelectItem>
                    {filterOptions.industries.length === 0 ? (
                      <SelectItem disabled value="no-industries">
                        No industries available
                      </SelectItem>
                    ) : (
                      filterOptions.industries.map((industry) => (
                        <SelectItem key={industry._id} value={industry._id}>
                          {industry.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectList>
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : null}

        <div className="mt-4 space-y-2">
          <p className="font-semibold text-sm">Technologies</p>
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  className="w-full justify-between"
                  type="button"
                  variant="outline"
                />
              }
            >
              <span className="truncate text-left">
                {selectedTechnologyLabel}
              </span>
              <ChevronsUpDown className="size-4 text-muted-foreground" />
            </PopoverTrigger>
            <PopoverContent className="w-(--anchor-width) p-0">
              <div className="border-border border-b p-2">
                <div className="relative">
                  <Search className="absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="h-8 pl-7"
                    onChange={(event) =>
                      setTechnologySearch(event.target.value)
                    }
                    placeholder="Search technologies"
                    value={technologySearch}
                  />
                </div>
              </div>
              <div className="max-h-72 space-y-1 overflow-y-auto p-2">
                {filteredTechnologies.length === 0 ? (
                  <p className="px-1 py-2 text-muted-foreground text-sm">
                    No technologies found.
                  </p>
                ) : (
                  filteredTechnologies.map((technology) => {
                    const isSelected = selectedTechnologyPaths.includes(
                      technology.iconPath
                    );
                    return (
                      <Button
                        className="w-full justify-between px-2"
                        key={technology.iconPath}
                        onClick={() => onToggleTechnology(technology.iconPath)}
                        size="sm"
                        type="button"
                        variant={isSelected ? "secondary" : "ghost"}
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <TechnologyIcon
                            className="size-3.5"
                            iconPath={technology.iconPath}
                            name={technology.name}
                            size={14}
                          />
                          <span className="truncate">{technology.name}</span>
                        </span>
                        {isSelected ? <Check className="size-4" /> : null}
                      </Button>
                    );
                  })
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Button
          className="mt-4 w-full"
          onClick={resetFilters}
          size="sm"
          variant="outline"
        >
          Reset filters
        </Button>
      </div>
    </aside>
  );
}

interface ResultsSectionProps {
  canGoBack: boolean;
  canGoForward: boolean;
  companyCards: CompanyCard[];
  currentPage: number;
  filterOptions: StackListFilterOptions;
  isCompanyMode: boolean;
  isPending: boolean;
  isSignedIn: boolean;
  onNextPage: () => void;
  onPageSelect: (page: number) => void;
  onPreviousPage: () => void;
  selectedTechnologyPaths: string[];
  totalPages: number;
  userCards: UserCard[];
}

function ResultsSection({
  canGoBack,
  canGoForward,
  companyCards,
  currentPage,
  filterOptions,
  isCompanyMode,
  isPending,
  isSignedIn,
  onNextPage,
  onPageSelect,
  onPreviousPage,
  selectedTechnologyPaths,
  totalPages,
  userCards,
}: ResultsSectionProps) {
  const loadingKeys = [
    "loading-1",
    "loading-2",
    "loading-3",
    "loading-4",
    "loading-5",
    "loading-6",
  ];
  const activeCardsCount = isCompanyMode
    ? companyCards.length
    : userCards.length;
  const visiblePages =
    totalPages <= 4
      ? Array.from({ length: totalPages }, (_, index) => index + 1)
      : [1, 2, 3];
  const renderedCards: ReactNode[] = [];
  if (isPending) {
    renderedCards.push(
      ...loadingKeys.map((loadingKey) => (
        <TechStackCard
          description=""
          industry=""
          isLoading
          key={loadingKey}
          name=""
          teaserIcons={[]}
        />
      ))
    );
  } else if (isCompanyMode) {
    renderedCards.push(
      ...companyCards.map((card) => <TechStackCard key={card.slug} {...card} />)
    );
  } else {
    renderedCards.push(
      ...userCards.map((card) => (
        <TechStackCard
          description={card.description}
          imageUrl={card.imageUrl}
          industry=""
          key={card.username}
          name={card.name}
          stackType="user"
          teaserIcons={card.teaserIcons}
          username={card.username}
        />
      ))
    );
  }

  return (
    <section className="space-y-6">
      {selectedTechnologyPaths.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
            Active tech filters
          </span>
          {selectedTechnologyPaths.map((iconPath) => {
            const technology = filterOptions.technologies.find(
              (entry) => entry.iconPath === iconPath
            );
            return (
              <Badge key={iconPath} variant="secondary">
                {technology?.name ?? iconPath}
              </Badge>
            );
          })}
        </div>
      ) : null}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {renderedCards}
      </section>
      {!isPending && activeCardsCount === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No stacks found</EmptyTitle>
            <EmptyDescription>
              No results match your current filters. Try removing a filter or
              broadening your search.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}
      {totalPages > 1 ? (
        <Pagination>
          <PaginationContent>
            {canGoBack ? (
              <PaginationItem>
                <PaginationPrevious onClick={onPreviousPage} />
              </PaginationItem>
            ) : null}

            {visiblePages.map((page) => (
              <PaginationItem key={page}>
                <Button
                  onClick={() => onPageSelect(page)}
                  size="sm"
                  variant={currentPage === page ? "secondary" : "outline"}
                >
                  {page}
                </Button>
              </PaginationItem>
            ))}

            {totalPages > 4 ? (
              <>
                <PaginationItem>
                  <span className="px-2 text-muted-foreground text-sm">
                    ...
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    onClick={() => onPageSelect(totalPages)}
                    size="sm"
                    variant={
                      currentPage === totalPages ? "secondary" : "outline"
                    }
                  >
                    {totalPages}
                  </Button>
                </PaginationItem>
              </>
            ) : null}

            {canGoForward ? (
              <PaginationItem>
                <PaginationNext onClick={onNextPage} />
              </PaginationItem>
            ) : null}
          </PaginationContent>
        </Pagination>
      ) : null}
      {isCompanyMode && !isSignedIn ? (
        <Show when="signed-out">
          <div className="rounded-3xl border border-primary/30 bg-primary px-8 py-12 text-primary-foreground md:px-12">
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <div>
                <p className="font-semibold text-primary-foreground/80 text-sm uppercase tracking-[0.2em]">
                  Unlock all company stacks
                </p>
                <h2 className="mt-3 font-bold text-3xl tracking-tight md:text-4xl">
                  Want to see more stacks?
                </h2>
                <p className="mt-4 max-w-2xl text-base text-primary-foreground/90 leading-relaxed md:text-lg">
                  Signed-out users only see featured company stacks. Sign in to
                  unlock the full list and discover every company profile.
                </p>
              </div>
              <div className="mt-8">
                <SignInButton>
                  <Button
                    className="bg-background font-semibold text-foreground hover:bg-background/90"
                    size="lg"
                  >
                    Sign in or register
                  </Button>
                </SignInButton>
              </div>
            </div>
          </div>
        </Show>
      ) : null}
    </section>
  );
}

export function StackListPage({ mode }: StackListPageProps) {
  const { isSignedIn } = useUser();
  const isCompanyMode = mode === "company";

  const [search, setSearch] = useState("");
  const [selectedIndustryId, setSelectedIndustryId] = useState("all");
  const [selectedTechnologyPaths, setSelectedTechnologyPaths] = useState<
    string[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const currentCursor =
    currentPage === 1 ? undefined : String((currentPage - 1) * PAGE_SIZE);

  const { data: filterOptions } = useQuery(
    convexQuery(api.queries.getStackListFilterOptions, {})
  );

  const companyQueryArgs = useMemo(
    () => ({
      cursor: currentCursor,
      industryId:
        selectedIndustryId === "all"
          ? undefined
          : (selectedIndustryId as Id<"industry">),
      limit: PAGE_SIZE,
      search: search.trim() || undefined,
      technologyIconPaths:
        selectedTechnologyPaths.length > 0
          ? selectedTechnologyPaths
          : undefined,
    }),
    [currentCursor, selectedIndustryId, search, selectedTechnologyPaths]
  );

  const userQueryArgs = useMemo(
    () => ({
      cursor: currentCursor,
      limit: PAGE_SIZE,
      search: search.trim() || undefined,
      technologyIconPaths:
        selectedTechnologyPaths.length > 0
          ? selectedTechnologyPaths
          : undefined,
    }),
    [currentCursor, search, selectedTechnologyPaths]
  );

  const companyQuery = useQuery({
    ...convexQuery(api.queries.listCompanyStackCards, companyQueryArgs),
    enabled: isCompanyMode,
  });
  const userQuery = useQuery({
    ...convexQuery(api.queries.listUserStackCards, userQueryArgs),
    enabled: !isCompanyMode,
  });

  const listData = isCompanyMode ? companyQuery.data : userQuery.data;
  const isPending = isCompanyMode
    ? companyQuery.isPending
    : userQuery.isPending;

  const companyCards = (companyQuery.data?.cards ?? []) as CompanyCard[];
  const userCards = (userQuery.data?.cards ?? []) as UserCard[];

  const totalCount = listData?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < totalPages;

  const heading = isCompanyMode ? "Company Tech Stacks" : "Community Stacks";
  const subheading = isCompanyMode
    ? "Browse company stack cards with filters for industry, company size, and technologies."
    : "Browse personal stacks from the community and find people using your favorite technologies.";

  const filterOptionsData: StackListFilterOptions = {
    industries: filterOptions?.industries ?? [],
    technologies: filterOptions?.technologies ?? [],
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  const onSearchChange = (value: string) => {
    setSearch(value);
    resetPagination();
  };

  const onIndustryChange = (value: string) => {
    setSelectedIndustryId(value);
    resetPagination();
  };

  const toggleTechnology = (iconPath: string) => {
    setSelectedTechnologyPaths((current) =>
      current.includes(iconPath)
        ? current.filter((value) => value !== iconPath)
        : [...current, iconPath]
    );
    resetPagination();
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedIndustryId("all");
    setSelectedTechnologyPaths([]);
    resetPagination();
  };

  const onNextPage = () => {
    if (!canGoForward) {
      return;
    }
    setCurrentPage((current) => current + 1);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-2">
        <h1 className="font-bold text-3xl">{heading}</h1>
        <p className="max-w-3xl text-muted-foreground">{subheading}</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
        <FilterSidebar
          filterOptions={filterOptionsData}
          isCompanyMode={isCompanyMode}
          onIndustryChange={onIndustryChange}
          onSearchChange={onSearchChange}
          onToggleTechnology={toggleTechnology}
          resetFilters={resetFilters}
          search={search}
          selectedIndustryId={selectedIndustryId}
          selectedTechnologyPaths={selectedTechnologyPaths}
        />

        <ResultsSection
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          companyCards={companyCards}
          currentPage={currentPage}
          filterOptions={filterOptionsData}
          isCompanyMode={isCompanyMode}
          isPending={isPending}
          isSignedIn={isSignedIn === true}
          onNextPage={onNextPage}
          onPageSelect={setCurrentPage}
          onPreviousPage={() => setCurrentPage((current) => current - 1)}
          selectedTechnologyPaths={selectedTechnologyPaths}
          totalPages={totalPages}
          userCards={userCards}
        />
      </div>
    </div>
  );
}
