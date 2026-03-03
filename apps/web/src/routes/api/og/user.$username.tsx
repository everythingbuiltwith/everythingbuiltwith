/* biome-ignore-all lint/style/useFilenamingConvention: TanStack route filenames require $param and dot suffixes. */
import { api } from "@everythingbuiltwith/backend/convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { ImageResponse } from "@vercel/og";
import { ConvexHttpClient } from "convex/browser";
import type { ReactElement } from "react";
import {
  getInitials,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  OG_TEASER_ICON_LIMIT,
  toAbsoluteUrl,
  truncate,
} from "@/lib/og";

const backgroundStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: "48px",
  backgroundColor: "#09090b",
  backgroundImage:
    "linear-gradient(to top, rgba(39,39,42,0.35) 0%, rgba(39,39,42,0.20) 50%, transparent 100%)",
  color: "#f5f5f7",
  fontFamily: "Inter, sans-serif",
} as const;

const GOOGLE_FONT_SRC_REGEX =
  /src: url\((.+)\) format\('(opentype|truetype)'\)/;

/** Load Inter font in TTF format from Google Fonts (faster parsing than WOFF for Satori). */
async function loadGoogleFont(
  font: string,
  weight: number,
  text: string
): Promise<ArrayBuffer | undefined> {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await fetch(url).then((r) => (r.ok ? r.text() : ""));
  const match = css.match(GOOGLE_FONT_SRC_REGEX);
  if (match) {
    const response = await fetch(match[1]);
    if (response.ok) {
      return response.arrayBuffer();
    }
  }
  return undefined;
}

let interFontsPromise: Promise<{
  bold?: ArrayBuffer;
  regular?: ArrayBuffer;
}> | null = null;

function getInterFontData() {
  if (interFontsPromise !== null) {
    return interFontsPromise;
  }
  const sampleText = "Everything Built With 0123456789";
  interFontsPromise = Promise.all([
    loadGoogleFont("Inter", 400, sampleText),
    loadGoogleFont("Inter", 700, sampleText),
  ]).then(([regular, bold]) => ({ bold, regular }));
  return interFontsPromise;
}

function renderFallbackCard(username: string, siteUrl: string) {
  const brandLogoUrl =
    toAbsoluteUrl("/everythingbuiltwith_logo_white_og.png", siteUrl) ??
    "/everythingbuiltwith_logo_white_og.png";

  return (
    <div style={backgroundStyle}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          alt="Everything Built With logo"
          height={52}
          src={brandLogoUrl}
          style={{ height: 52, objectFit: "contain" }}
          width={352}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.05 }}>
          {`@${truncate(username, 30)}`}
        </div>
        <div style={{ fontSize: 30, color: "#c8c8d0", maxWidth: "80%" }}>
          Discover user tech stacks on Everything Built With.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(255,255,255,0.12)",
          paddingTop: 18,
          color: "#a1a1b4",
          fontSize: 22,
        }}
      >
        <span>everythingbuiltwith.com</span>
        <span style={{ color: "#d7d7de" }}>Powered by real stack data</span>
      </div>
    </div>
  );
}

async function createOgPngResponse(
  element: ReactElement,
  init: {
    width: number;
    height: number;
    headers?: Record<string, string>;
  }
): Promise<Response> {
  try {
    const interFonts = await getInterFontData();
    const fontDefinitions = [
      interFonts.regular
        ? {
            data: interFonts.regular,
            name: "Inter",
            style: "normal" as const,
            weight: 400 as const,
          }
        : null,
      interFonts.bold
        ? {
            data: interFonts.bold,
            name: "Inter",
            style: "normal" as const,
            weight: 700 as const,
          }
        : null,
    ].filter((font): font is Exclude<typeof font, null> => font !== null);

    const image = new ImageResponse(element, {
      width: init.width,
      height: init.height,
      fonts: fontDefinitions.length > 0 ? fontDefinitions : undefined,
    });
    const body = await image.arrayBuffer();
    return new Response(body, {
      headers: {
        "Content-Type": "image/png",
        ...init.headers,
      },
    });
  } catch (error) {
    console.error("OG image generation failed:", error);
    return new Response("Failed to generate image", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

export const Route = createFileRoute("/api/og/user/$username")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const siteUrl =
            process.env.VITE_PUBLIC_SITE_URL ??
            `http://localhost:${process.env.PORT ?? "3001"}`;
          const convexUrl = process.env.VITE_CONVEX_URL;
          const username = params.username.trim();

          if (username.length === 0) {
            return createOgPngResponse(renderFallbackCard("user", siteUrl), {
              width: OG_IMAGE_WIDTH,
              height: OG_IMAGE_HEIGHT,
            });
          }

          const userDetails =
            convexUrl !== undefined
              ? await new ConvexHttpClient(convexUrl)
                  .query(api.queries.getUserDetailsByUsername, {
                    username,
                  })
                  .catch(() => null)
              : null;

          if (userDetails === null) {
            return createOgPngResponse(renderFallbackCard(username, siteUrl), {
              width: OG_IMAGE_WIDTH,
              height: OG_IMAGE_HEIGHT,
              headers: {
                "Cache-Control": "public, max-age=300, s-maxage=3600",
              },
            });
          }

          const teaserIcons = userDetails.techStack
            .map((category) => category.technologies[0])
            .filter((technology) => technology !== undefined)
            .map((technology) => ({
              icon: technology.iconPath,
              name: technology.name,
            }))
            .slice(0, OG_TEASER_ICON_LIMIT);

          const avatarUrl = toAbsoluteUrl(userDetails.user.imageUrl, siteUrl);
          const normalizedDescription =
            truncate(userDetails.user.description, 160) ||
            "No description yet. See this user's current tech stack.";
          const technologyChips = teaserIcons;
          const brandLogoUrl =
            toAbsoluteUrl("/everythingbuiltwith_logo_white_og.png", siteUrl) ??
            "/everythingbuiltwith_logo_white_og.png";

          return createOgPngResponse(
            <div style={{ ...backgroundStyle, justifyContent: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                alt="Everything Built With logo"
                height={44}
                src={brandLogoUrl}
                style={{ height: 44, objectFit: "contain" }}
                width={298}
              />
            </div>

            <div
              style={{
                display: "flex",
                flex: 1,
                gap: 32,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  gap: 20,
                }}
              >
                <div
                  style={{
                    width: 150,
                    height: 150,
                    borderRadius: 999,
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#18181b",
                    color: "#f5f5f7",
                    fontWeight: 800,
                    fontSize: 56,
                    flexShrink: 0,
                  }}
                >
                  {avatarUrl ? (
                    <img
                      alt={userDetails.user.name}
                      height={150}
                      src={avatarUrl}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      width={150}
                    />
                  ) : (
                    getInitials(userDetails.user.name)
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      fontSize: 50,
                      fontWeight: 700,
                      lineHeight: 1.08,
                    }}
                  >
                    {truncate(userDetails.user.name, 30)}
                  </div>
                  <div
                    style={{
                      fontSize: 26,
                      color: "#c8c8d0",
                      lineHeight: 1.35,
                      maxWidth: 580,
                    }}
                  >
                    {normalizedDescription}
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      color: "#a1a1b4",
                      marginTop: 4,
                    }}
                  >
                    {`@${userDetails.user.username}`}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  padding: 16,
                  background: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: 16,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 14,
                    width: 374,
                  }}
                >
                  {technologyChips.length > 0
                    ? technologyChips.map((technology) => {
                        const iconUrl = toAbsoluteUrl(
                          `/icons/${technology.icon}.svg`,
                          siteUrl
                        );
                        return (
                          <div
                            key={`${technology.name}-${technology.icon}`}
                            style={{
                              width: 180,
                              height: 140,
                              borderRadius: 12,
                              background: "rgba(255,255,255,0.04)",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: 10,
                              color: "#f3f4f6",
                            }}
                          >
                            {iconUrl ? (
                              <img
                                alt={`${technology.name} logo`}
                                height={48}
                                src={iconUrl}
                                style={{
                                  width: 48,
                                  height: 48,
                                  objectFit: "contain",
                                }}
                                width={48}
                              />
                            ) : null}
                            <span style={{ fontSize: 20 }}>
                              {technology.name}
                            </span>
                          </div>
                        );
                      })
                    : [
                        <div
                          key="no-teaser-icons"
                          style={{
                            width: 374,
                            height: 140,
                            borderRadius: 12,
                            background: "rgba(255,255,255,0.04)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 20,
                            color: "#f3f4f6",
                          }}
                        >
                          Stack details available on profile
                        </div>,
                      ]}
                </div>
              </div>
            </div>
          </div>,
            {
              width: OG_IMAGE_WIDTH,
              height: OG_IMAGE_HEIGHT,
              headers: {
                "Cache-Control": "public, max-age=300, s-maxage=3600",
              },
            }
          );
        } catch (error) {
          console.error("OG image route error:", error);
          return new Response("Internal Server Error", {
            status: 500,
            headers: { "Content-Type": "text/plain" },
          });
        }
      },
    },
  },
});
