/* biome-ignore-all lint/style/useFilenamingConvention: TanStack route filenames require $param and dot suffixes. */
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@everythingbuiltwith/backend/convex/_generated/api";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { UserTechStackEditor } from "@/components/user-tech-stack-editor";
import { staticTitle } from "../__root";

export const Route = createFileRoute("/stacks/user/$username/edit")({
  loader: async ({ context, params }) => {
    const routeResolution = await context.queryClient.ensureQueryData(
      convexQuery(api.queries.resolveUserUsernameRoute, {
        username: params.username,
      })
    );

    if (routeResolution.status === "not_found") {
      throw new Error(`User "${params.username}" not found`);
    }

    if (
      routeResolution.status === "redirect" &&
      routeResolution.username !== params.username
    ) {
      throw redirect({
        to: "/stacks/user/$username/edit",
        params: { username: routeResolution.username },
        statusCode: 308,
      });
    }

    return await context.queryClient.ensureQueryData(
      convexQuery(api.queries.getUserTechStackEditorData, {
        username: routeResolution.username,
      })
    );
  },
  head: () => ({
    meta: [
      {
        title: `Edit Tech Stack${staticTitle}`,
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const pageData = Route.useLoaderData();
  const params = Route.useParams();

  return (
    <UserTechStackEditor
      categories={pageData.categories}
      categoryUpdates={pageData.categoryUpdates}
      profile={pageData.profile}
      technologies={pageData.technologies}
      techReasons={pageData.techReasons}
      updateReasons={pageData.updateReasons}
      username={params.username}
    />
  );
}
