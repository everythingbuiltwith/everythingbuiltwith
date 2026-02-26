/* biome-ignore-all lint/style/useFilenamingConvention: TanStack route filenames require $param and dot suffixes. */
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/stacks/user/$username")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
