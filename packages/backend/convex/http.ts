import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

interface ClerkWebhookEvent {
  data: {
    id: string;
    username?: string | null;
    image_url?: string | null;
    first_name?: string | null;
    last_name?: string | null;
  };
  type: string;
}

function buildFullName(
  firstName: string | null | undefined,
  lastName: string | null | undefined
): string | undefined {
  const fullName = [firstName?.trim(), lastName?.trim()]
    .filter((part): part is string => part !== undefined && part.length > 0)
    .join(" ")
    .trim();
  return fullName.length > 0 ? fullName : undefined;
}

const http = httpRouter();

http.route({
  path: "/clerk/webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (webhookSecret === undefined || webhookSecret.length === 0) {
      return new Response("Missing CLERK_WEBHOOK_SECRET", { status: 500 });
    }

    const svixId = req.headers.get("svix-id");
    const svixTimestamp = req.headers.get("svix-timestamp");
    const svixSignature = req.headers.get("svix-signature");
    if (svixId === null || svixTimestamp === null || svixSignature === null) {
      return new Response("Missing svix headers", { status: 400 });
    }

    const payload = await req.text();
    let event: ClerkWebhookEvent;
    try {
      const wh = new Webhook(webhookSecret);
      event = wh.verify(payload, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as ClerkWebhookEvent;
    } catch {
      return new Response("Invalid signature", { status: 400 });
    }

    if (event.type !== "user.created" && event.type !== "user.updated") {
      return new Response("ok", { status: 200 });
    }

    await ctx.runMutation(
      internal.mutations.upsertUserProfileFromClerkWebhook,
      {
        clerkUserId: event.data.id,
        username: event.data.username ?? undefined,
        imageUrl: event.data.image_url ?? undefined,
        name: buildFullName(event.data.first_name, event.data.last_name),
      }
    );

    return new Response("ok", { status: 200 });
  }),
});

export default http;
