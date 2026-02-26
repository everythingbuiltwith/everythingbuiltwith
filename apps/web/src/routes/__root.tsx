import { ClerkProvider, useAuth } from "@clerk/tanstack-react-start";
import { auth } from "@clerk/tanstack-react-start/server";
import type { ConvexQueryClient } from "@convex-dev/react-query";
import { env } from "@everythingbuiltwith/env/web";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useRouteContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { createServerFn } from "@tanstack/react-start";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { PostHogProvider } from "posthog-js/react";
import Footer from "../components/footer";
import Header from "../components/header";
import { Toaster } from "../components/ui/sonner";
import appCss from "../index.css?url";

export const staticTitle = " | Everything Built With";

const posthogOptions = {
  api_host: env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: "2026-01-30",
} as const;

const fetchClerkAuth = createServerFn({ method: "GET" }).handler(async () => {
  const clerkAuth = await auth();
  const token = await clerkAuth.getToken({ template: "convex" });
  return { userId: clerkAuth.userId, token };
});

export interface RouterAppContext {
  convexQueryClient: ConvexQueryClient;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      {
        rel: "manifest",
        href: "/site.webmanifest",
      },
    ],
  }),

  component: RootDocument,
  beforeLoad: async (ctx) => {
    const { userId, token } = await fetchClerkAuth();
    if (token) {
      ctx.context.convexQueryClient.serverHttpClient?.setAuth(token);
    }
    return { userId, token };
  },
});

function RootDocument() {
  const context = useRouteContext({ from: Route.id });
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk
        client={context.convexQueryClient.convexClient}
        useAuth={useAuth}
      >
        <PostHogProvider
          apiKey={env.VITE_PUBLIC_POSTHOG_KEY}
          options={posthogOptions}
        >
          <html className="dark" lang="en">
            <head>
              <HeadContent />
            </head>
            <body>
              <Header />
              <main className="min-h-screen">
                <Outlet />
              </main>
              <Footer />
              <Toaster />
              <TanStackRouterDevtools position="bottom-left" />
              <Scripts />
            </body>
          </html>
        </PostHogProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
