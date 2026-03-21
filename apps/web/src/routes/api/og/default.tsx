import { env } from "@everythingbuiltwith/env/web";
import { createFileRoute } from "@tanstack/react-router";
import {
  createMainSiteOgResponse,
  MainSiteOgImage,
} from "@/lib/main-site-og";

export const Route = createFileRoute("/api/og/default")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const siteUrl = env.VITE_PUBLIC_SITE_URL;

          return createMainSiteOgResponse(<MainSiteOgImage siteUrl={siteUrl} />, {
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
          });
        } catch (error) {
          console.error("Default OG image route error:", error);
          return new Response("Internal Server Error", {
            status: 500,
            headers: { "Content-Type": "text/plain" },
          });
        }
      },
    },
  },
});
