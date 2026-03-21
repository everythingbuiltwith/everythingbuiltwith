import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ImageResponse } from "@vercel/og";
import type { ReactElement } from "react";
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH, toAbsoluteUrl } from "./og";

const ogBackgroundStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  padding: "48px",
  backgroundColor: "#09090b",
  backgroundImage:
    "linear-gradient(to top, rgba(39,39,42,0.50) 0%, rgba(39,39,42,0.20) 50%, transparent 100%)",
  color: "#f5f5f7",
  fontFamily: "Inter, Arial, sans-serif",
} as const;

const STATIC_HERO_LOGOS = [
  { icon: "company/convex", name: "Convex" },
  { icon: "company/linear", name: "Linear" },
  { icon: "company/clerk", name: "Clerk" },
  { icon: "tech/kubernetes", name: "Kubernetes" },
  { icon: "tech/react", name: "React" },
  { icon: "company/sentry", name: "Sentry" },
] as const;

let cachedFontPromise:
  | Promise<{ regular: ArrayBuffer; bold: ArrayBuffer } | undefined>
  | undefined;

async function loadLocalFont(): Promise<
  { regular: ArrayBuffer; bold: ArrayBuffer } | undefined
> {
  if (cachedFontPromise !== undefined) {
    return cachedFontPromise;
  }

  cachedFontPromise = (async () => {
    const dir = dirname(fileURLToPath(import.meta.url));
    const bases = [
      join(dir, "..", "..", "public", "fonts"),
      join(process.cwd(), "public", "fonts"),
      join(process.cwd(), "apps", "web", "public", "fonts"),
    ];
    const bun =
      "Bun" in globalThis
        ? (
            globalThis as unknown as {
              Bun: {
                file: (p: string) => {
                  exists: () => Promise<boolean>;
                  arrayBuffer: () => Promise<ArrayBuffer>;
                };
              };
            }
          ).Bun
        : null;

    const load = async (path: string): Promise<ArrayBuffer | undefined> => {
      try {
        if (bun) {
          const file = bun.file(path);
          if (await file.exists()) {
            return await file.arrayBuffer();
          }
        } else {
          const buf = await readFile(path);
          const copy = new Uint8Array(buf.length);
          copy.set(buf);
          return copy.buffer;
        }
      } catch {
        return undefined;
      }

      return undefined;
    };

    for (const base of bases) {
      const regular = await load(join(base, "Inter-Regular.ttf"));
      const bold = await load(join(base, "Inter-Bold.ttf"));
      if (regular !== undefined && bold !== undefined) {
        return { regular, bold };
      }
    }

    return undefined;
  })();

  return cachedFontPromise;
}

export async function createMainSiteOgResponse(
  element: ReactElement,
  headers?: Record<string, string>
): Promise<Response> {
  try {
    const fonts = await loadLocalFont();
    const fontDefinitions =
      fonts !== undefined
        ? [
            {
              data: fonts.regular,
              name: "Inter",
              style: "normal" as const,
              weight: 400 as const,
            },
            {
              data: fonts.bold,
              name: "Inter",
              style: "normal" as const,
              weight: 700 as const,
            },
          ]
        : undefined;

    const image = new ImageResponse(element, {
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      fonts: fontDefinitions,
    });
    const body = await image.arrayBuffer();

    return new Response(body, {
      headers: {
        ...headers,
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    console.error("Main site OG image generation failed:", error);
    return new Response("Failed to generate image", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

export function MainSiteOgImage({ siteUrl }: { siteUrl: string }) {
  const brandLogoUrl =
    toAbsoluteUrl("/everythingbuiltwith_logo_white_og.png", siteUrl) ??
    "/everythingbuiltwith_logo_white_og.png";
  const logoCards = STATIC_HERO_LOGOS.map((item) => ({
    ...item,
    src: toAbsoluteUrl(`/icons/${item.icon}.svg`, siteUrl),
  }));

  return (
    <div style={{ ...ogBackgroundStyle, justifyContent: "flex-start" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 34 }}>
        <img
          alt="Everything Built With logo"
          height={44}
          src={brandLogoUrl}
          style={{ height: 44, objectFit: "contain" }}
          width={298}
        />
      </div>

      <div style={{ display: "flex", flex: 1, gap: 32, alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            gap: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div
              style={{
                fontSize: 54,
                lineHeight: 1.04,
                fontWeight: 700,
                letterSpacing: -1.8,
              }}
            >
              Discover What Companies
            </div>
            <div
              style={{
                fontSize: 54,
                lineHeight: 1.04,
                fontWeight: 700,
                letterSpacing: -1.8,
              }}
            >
              And Users Build With +
            </div>
            <div
              style={{
                fontSize: 54,
                lineHeight: 1.04,
                fontWeight: 700,
                letterSpacing: -1.8,
                color: "#e8453a",
              }}
            >
              Why
            </div>
          </div>

          <div
            style={{
              fontSize: 22,
              color: "#c8c8d0",
              lineHeight: 1.42,
              maxWidth: 560,
            }}
          >
            Explore the tech stacks behind leading companies, alongside
            community-submitted personal stacks from users. Get curated
            stories, practical insights, and the reasons behind every choice.
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "flex-start",
              marginTop: 10,
              height: 44,
              paddingLeft: 20,
              paddingRight: 20,
              borderRadius: 10,
              background: "#e8453a",
              color: "#ffffff",
              fontSize: 18,
              fontWeight: 500,
            }}
          >
            Explore stacks now
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
            {logoCards.map((technology) => (
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
                  gap: 12,
                  color: "#f3f4f6",
                }}
              >
                {technology.src ? (
                  <img
                    alt={`${technology.name} logo`}
                    height={48}
                    src={technology.src}
                    style={{
                      width: 48,
                      height: 48,
                      objectFit: "contain",
                    }}
                    width={48}
                  />
                ) : null}
                <span style={{ fontSize: 20 }}>{technology.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
