/* biome-ignore-all lint/style/useFilenamingConvention: TanStack route filenames require $param and dot suffixes. */
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@everythingbuiltwith/backend/convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { CompanyTechStackEditor } from "@/components/company-tech-stack-editor";
import { staticTitle } from "../__root";

export const Route = createFileRoute("/stacks/company/$slug/edit")({
  loader: async ({ context, params }) =>
    context.queryClient.ensureQueryData(
      convexQuery(api.queries.getCompanyTechStackEditorData, {
        slug: params.slug,
      })
    ),
  head: ({ params }) => ({
    meta: [
      {
        title: `Edit ${params.slug} Tech Stack${staticTitle}`,
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const pageData = Route.useLoaderData();
  const params = Route.useParams();

  return (
    <CompanyTechStackEditor
      categories={pageData.categories}
      categoryUpdates={pageData.categoryUpdates}
      company={pageData.company}
      slug={params.slug}
      technologies={pageData.technologies}
      techReasons={pageData.techReasons}
      updateReasons={pageData.updateReasons}
    />
  );
}
