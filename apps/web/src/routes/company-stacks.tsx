import { createFileRoute } from "@tanstack/react-router";
import { StackListPage } from "@/components/stack-list-page";
import { staticTitle } from "./__root";

export const Route = createFileRoute("/company-stacks")({
  head: () => ({
    meta: [{ title: `Company Tech Stacks${staticTitle}` }],
  }),
  component: CompanyStacksRoute,
});

function CompanyStacksRoute() {
  return <StackListPage mode="company" />;
}
