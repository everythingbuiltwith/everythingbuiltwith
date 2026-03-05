import {
  ConsentManagerDialog,
  ConsentManagerProvider,
  CookieBanner,
  useConsentManager,
} from "@c15t/react";
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
import posthog from "posthog-js";
import { useCallback, useEffect, useRef } from "react";
import Footer from "../components/footer";
import Header from "../components/header";
import { Toaster } from "../components/ui/sonner";
import appCss from "../index.css?url";

export const staticTitle = " | Everything Built With";

const posthogOptions = {
  api_host: env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: "2026-01-30",
} as const;

const consentTheme = {
  "banner.root": {
    style: { left: "auto", right: "1rem", bottom: "1rem" },
  },
  "banner.card": {
    style: {
      "--banner-background-color": "var(--card)",
      "--banner-background-color-dark": "var(--card)",
      "--banner-border-color": "var(--border)",
      "--banner-border-color-dark": "var(--border)",
      "--banner-border-radius": "var(--radius)",
    },
  },
  "banner.header.root": {
    style: {
      "--banner-text-color": "var(--foreground)",
      "--banner-text-color-dark": "var(--foreground)",
    },
  },
  "banner.header.title": {
    style: {
      "--banner-title-color": "var(--foreground)",
      "--banner-title-color-dark": "var(--foreground)",
    },
  },
  "banner.header.description": {
    style: {
      "--banner-description-color": "var(--muted-foreground)",
      "--banner-description-color-dark": "var(--muted-foreground)",
    },
  },
  "banner.footer": {
    style: {
      "--banner-footer-background-color": "var(--muted)",
      "--banner-footer-background-color-dark": "var(--muted)",
    },
  },
  "dialog.card": {
    style: {
      "--dialog-background-color": "var(--card)",
      "--dialog-background-color-dark": "var(--card)",
      "--dialog-border-color": "var(--border)",
      "--dialog-border-color-dark": "var(--border)",
      "--dialog-border-radius": "var(--radius)",
    },
  },
  "dialog.title": {
    style: {
      "--dialog-title-color": "var(--foreground)",
      "--dialog-title-color-dark": "var(--foreground)",
    },
  },
  "dialog.description": {
    style: {
      "--dialog-description-color": "var(--muted-foreground)",
      "--dialog-description-color-dark": "var(--muted-foreground)",
    },
  },
};

const fetchClerkAuth = createServerFn({ method: "GET" }).handler(async () => {
  const clerkAuth = await auth();
  const token = await clerkAuth.getToken({ template: "convex" });
  return { userId: clerkAuth.userId, token };
});

interface RouterAppContext {
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

function PostHogConsentRestore({
  ensurePostHogInitialized,
}: {
  ensurePostHogInitialized: () => void;
}) {
  const { has } = useConsentManager();

  useEffect(() => {
    if (has("measurement")) {
      ensurePostHogInitialized();
      posthog.opt_in_capturing();
    }
  }, [has, ensurePostHogInitialized]);

  return null;
}

function RootDocument() {
  const context = useRouteContext({ from: Route.id });
  const posthogInitializedRef = useRef(false);

  const ensurePostHogInitialized = useCallback(() => {
    if (typeof window === "undefined" || posthogInitializedRef.current) {
      return;
    }

    posthog.init(env.VITE_PUBLIC_POSTHOG_KEY, posthogOptions);
    posthogInitializedRef.current = true;
  }, []);

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "var(--primary)",
          colorDanger: "var(--destructive)",
          colorSuccess: "var(--primary)",
          colorWarning: "var(--accent)",
          colorNeutral: "var(--muted)",
          colorForeground: "var(--foreground)",
          colorPrimaryForeground: "var(--primary-foreground)",
          colorMutedForeground: "var(--muted-foreground)",
          colorMuted: "var(--muted)",
          colorBackground: "var(--card)",
          colorInputForeground: "var(--foreground)",
          colorInput: "var(--input)",
          colorShimmer: "var(--muted-foreground)",
          colorRing: "var(--ring)",
          colorShadow: "var(--shadow-color)",
          colorBorder: "var(--muted-foreground)",
          colorModalBackdrop: "color-mix(in oklch, var(--background) 75%, black)",
          borderRadius: "var(--radius)",
        },
      }}
    >
      <ConvexProviderWithClerk
        client={context.convexQueryClient.convexClient}
        useAuth={useAuth}
      >
        <ConsentManagerProvider
          options={{
            mode: "offline",
            consentCategories: ["necessary", "measurement"],
            ignoreGeoLocation: true,
            react: {
              colorScheme: "dark",
            },
            scripts: [
              {
                id: "posthog",
                category: "measurement",
                callbackOnly: true,
              },
            ],
            callbacks: {
              onConsentSet({ preferences }) {
                if (preferences.measurement) {
                  ensurePostHogInitialized();
                  posthog.opt_in_capturing();
                } else if (posthogInitializedRef.current) {
                  posthog.opt_out_capturing();
                  posthog.reset();
                }
              },
            },
            legalLinks: {
              privacyPolicy: {
                href: "/privacy",
                label: "Privacy Policy",
              },
              termsOfService: {
                href: "/terms",
                label: "Terms of Service",
              },
            },
            translations: {
              defaultLanguage: "en",
              translations: {
                en: {
                  consentTypes: {
                    measurement: {
                      title: "PostHog (Analytics)",
                      description:
                        "Product analytics to understand usage and improve the product. Requires consent under GDPR/DSGVO.",
                    },
                    necessary: {
                      title: "Strictly necessary",
                      description:
                        "Required for core site functionality, including storing your consent choices and maintaining secure login sessions.",
                    },
                  },
                },
              },
            },
          }}
        >
          <PostHogConsentRestore
            ensurePostHogInitialized={ensurePostHogInitialized}
          />
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
              <CookieBanner
                legalLinks={["privacyPolicy", "termsOfService"]}
                theme={consentTheme}
              />
              <ConsentManagerDialog
                legalLinks={["privacyPolicy", "termsOfService"]}
                theme={consentTheme}
              />
            </body>
          </html>
        </ConsentManagerProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
