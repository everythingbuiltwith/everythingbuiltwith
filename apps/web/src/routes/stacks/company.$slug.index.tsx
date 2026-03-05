/* biome-ignore-all lint/style/useFilenamingConvention: TanStack route filenames require $param and dot suffixes. */
import { Show, SignInButton, useUser } from "@clerk/tanstack-react-start";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@everythingbuiltwith/backend/convex/_generated/api";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CircleOff, Lock } from "lucide-react";
import { StackCategoryDetailCard } from "@/components/stack-category-detail-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { staticTitle } from "../__root";

export const Route = createFileRoute("/stacks/company/$slug/")({
  loader: async ({ context, params }) => {
    const company = await context.queryClient.ensureQueryData(
      convexQuery(api.queries.getCompanyDetailsBySlug, { slug: params.slug })
    );
    if (company === null) {
      throw notFound();
    }

    const stackData = await context.queryClient.ensureQueryData(
      convexQuery(api.queries.getCompanyStackDetailsBySlug, {
        slug: params.slug,
      })
    );

    return {
      company,
      stackData,
    };
  },
  head: ({ loaderData }) => {
    let pageTitle = `Company Tech Stack${staticTitle}`;
    if (loaderData?.company) {
      pageTitle = `${loaderData.company.name} Tech Stack${staticTitle}`;
    }

    return {
      meta: [
        {
          title: pageTitle,
        },
      ],
    };
  },
  notFoundComponent: CompanyStackNotFound,
  component: RouteComponent,
});

function CompanyStackNotFound() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Empty className="w-full">
        <EmptyHeader>
          <EmptyMedia>
            <CircleOff className="size-5" />
          </EmptyMedia>
          <EmptyTitle>Company stack not found</EmptyTitle>
          <EmptyDescription>
            We couldn&apos;t find a company stack for this URL.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}

function RouteComponent() {
  const pageData = Route.useLoaderData();
  const { user } = useUser();
  const canEditCompany =
    user?.publicMetadata?.company_tech_stack_admin === true;

  const { company, stackData } = pageData;

  return (
    <div className="container mx-auto flex flex-col gap-8 px-4 py-12">
      <div className="flex items-center gap-8">
        <img
          alt={company.name}
          className="w-60 rounded-xl p-2"
          height={240}
          src={`/icons/company/${company.logo}.svg`}
          width={240}
        />
        <div>
          <h1 className="mb-4 font-bold text-3xl">{company.name}</h1>
          <p className="text-muted-foreground">{company.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-8">
            <div>
              <div className="text-muted-foreground text-xs">Company Size</div>
              <div className="font-medium">{company.companyInfo.size}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Website</div>
              <a
                className="font-medium text-primary underline"
                href={company.companyInfo.website}
                rel="noopener noreferrer"
                target="_blank"
              >
                {company.companyInfo.website}
              </a>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Headquarters</div>
              <div className="font-medium">{company.companyInfo.hq}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Industry</div>
              <Badge variant="secondary">{company.industry.name}</Badge>
            </div>
          </div>
        </div>
      </div>
      {stackData === null ? (
        <>
          <Show when="signed-out">
            <Empty className="w-full">
              <EmptyHeader>
                <EmptyMedia>
                  <Lock className="size-5" />
                </EmptyMedia>
                <EmptyTitle>Sign in to view this company stack</EmptyTitle>
                <EmptyDescription>
                  The tech stack for {company.name} exists, but it is only
                  visible to signed-in users.
                </EmptyDescription>
                <div className="mt-6">
                  <SignInButton>
                    <Button>Sign in to continue</Button>
                  </SignInButton>
                </div>
              </EmptyHeader>
            </Empty>
          </Show>
          <Show when="signed-in">
            <Empty className="w-full">
              <EmptyHeader>
                <EmptyTitle>Company stack unavailable</EmptyTitle>
                <EmptyDescription>
                  We couldn&apos;t load this company stack right now.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </Show>
        </>
      ) : (
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-bold text-2xl">Overview</h2>
            {canEditCompany ? (
              <Button size="sm" variant="outline">
                <Link
                  params={{ slug: company.slug }}
                  to="/stacks/company/$slug/edit"
                >
                  Edit stack
                </Link>
              </Button>
            ) : null}
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {stackData.techStack.map((categoryData) => {
              const {
                category,
                reason,
                shortDescription,
                longDescription,
                technologies,
              } = categoryData;
              const categoryUpdateGroup = stackData.techUpdates.find(
                (updateData) => updateData.category._id === category._id
              );

              return (
                <StackCategoryDetailCard
                  categoryId={category._id}
                  categoryName={category.name}
                  key={category._id}
                  longDescription={longDescription}
                  reasonName={reason?.name ?? "No information"}
                  shortDescription={shortDescription}
                  technologies={technologies}
                  updates={categoryUpdateGroup?.updates}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
