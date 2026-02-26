import { createFileRoute } from "@tanstack/react-router";
import { StackListPage } from "@/components/stack-list-page";
import { staticTitle } from "./__root";

export const Route = createFileRoute("/community-stacks")({
  head: () => ({
    meta: [{ title: `Community Tech Stacks${staticTitle}` }],
  }),
  component: CommunityStacksRoute,
});

function CommunityStacksRoute() {
  return <StackListPage mode="user" />;
}
