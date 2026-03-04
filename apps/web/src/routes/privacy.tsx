import { createFileRoute } from "@tanstack/react-router";
import { staticTitle } from "./__root";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      {
        title: `Privacy Policy${staticTitle}`,
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="container mx-auto px-6 py-14">
      <header className="space-y-3">
        <h1 className="font-semibold text-3xl tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground text-sm">
          Information required under GDPR (Art. 13/14) and the German TTDSG (§
          25).
        </p>
      </header>

      <div className="mt-10 space-y-10">
        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">
            1. Controller
          </h2>
          <div className="space-y-1 text-sm leading-relaxed">
            <p>
              <strong>Max Wagner</strong>
            </p>
            <p>Zum Aubühl 5</p>
            <p>95326 Kulmbach</p>
            <p>Germany</p>
            <p>
              Email: <strong>contact@everythingbuiltwith.com</strong>
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">
            2. What we process and why (summary)
          </h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              We process personal data only to run this website and provide the
              product, or where you have given consent, or where another legal
              basis applies.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Consent management (c15t)</strong>: storing your consent
                preferences in a necessary cookie (offline mode), so your
                choices can be remembered. <strong>Legal basis</strong>: § 25(2)
                no. 2 TTDSG (strictly necessary) and Art. 6(1)(f) GDPR.
              </li>
              <li>
                <strong>Website delivery & security (Vercel hosting)</strong>:
                technical logs and access data (e.g. IP address, timestamps,
                requested URLs, user agent). <strong>Legal basis</strong>: Art.
                6(1)(f) GDPR.
              </li>
              <li>
                <strong>Accounts & authentication (Clerk)</strong>: sign-up,
                sign-in, and session management (e.g. email, auth/session
                identifiers, security metadata). <strong>Legal basis</strong>:
                Art. 6(1)(b) GDPR; and Art. 6(1)(f) GDPR (security).
              </li>
              <li>
                <strong>App data storage (Convex)</strong>: storing and
                retrieving app data (e.g. profiles, tech stacks and related
                metadata). <strong>Legal basis</strong>: Art. 6(1)(b) GDPR.
              </li>
              <li>
                <strong>Analytics (PostHog)</strong>: usage analytics to improve
                the product. <strong>Only with consent</strong>.{" "}
                <strong>Legal basis</strong>: Art. 6(1)(a) GDPR; § 25(1) TTDSG.
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">
            3. Hosting (Vercel)
          </h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              This website is hosted via <strong>Vercel</strong>. For delivery
              and security, Vercel processes technical data (e.g. IP address,
              timestamps, requested pages, user agent).
            </p>
            <p>
              <strong>Legal basis</strong>: Art. 6(1)(f) GDPR (legitimate
              interest in secure and reliable operation).
            </p>
            <p>
              <strong>International transfers</strong>: Depending on provider
              setup, data may be processed outside the EU/EEA (e.g. in the US).
              Where applicable, transfers rely on appropriate safeguards (e.g.
              EU Standard Contractual Clauses) and/or adequacy decisions.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">
            4. Authentication (Clerk)
          </h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              We use <strong>Clerk</strong> for registration, sign-in and
              session management. Depending on how you use the service, this may
              include email address, authentication/session identifiers and
              security metadata needed to provide and protect logins.
            </p>
            <p>
              <strong>Legal basis</strong>: Art. 6(1)(b) GDPR (contract / steps
              prior to entering into a contract) and Art. 6(1)(f) GDPR
              (security, abuse prevention).
            </p>
            <p>
              <strong>Storage on your device</strong>: Clerk uses technically
              necessary cookies and/or local storage for login/session
              functionality. <strong>Legal basis</strong>: § 25(2) no. 2 TTDSG
              (strictly necessary).
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">
            5. Database & app backend (Convex)
          </h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              We use <strong>Convex</strong> to store and process app data (for
              example: tech stacks, reasons/metadata, user profiles). Processing
              is necessary to provide product functionality and operate the
              service securely.
            </p>
            <p>
              <strong>Legal basis</strong>: Art. 6(1)(b) GDPR (service
              provision).
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">
            6. Analytics (PostHog)
          </h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              If you consent, we use <strong>PostHog</strong> to understand how
              the product is used (e.g. page views, interactions, events) so we
              can improve it. PostHog may use cookies or similar technologies
              and process technical information (e.g. IP address, device/browser
              data) and event data.
            </p>
            <p>
              <strong>Legal basis</strong>: consent under Art. 6(1)(a) GDPR and
              § 25(1) TTDSG. Without consent, PostHog tracking does not run.
            </p>
            <p>
              <strong>Withdrawal</strong>: you can withdraw your consent at any
              time with effect for the future by changing your cookie/tracking
              settings (if available) or by deleting stored cookies/local
              storage data.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">
            7. Consent management (c15t)
          </h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              We use <strong>c15t</strong> in offline mode to manage your cookie
              choices. Your consent decision is stored on your device in a
              strictly necessary cookie so your preferences can be remembered.
            </p>
            <p>
              <strong>Legal basis</strong>: § 25(2) no. 2 TTDSG (strictly
              necessary storage) and Art. 6(1)(f) GDPR (legitimate interest in
              legally compliant consent management).
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">
            8. Recipients & processors
          </h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              We use service providers (processors) for hosting, authentication,
              analytics, and infrastructure (e.g. Vercel, Clerk, PostHog,
              Convex). Where required, we enter into data processing agreements.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">9. Retention</h2>
          <p className="text-sm leading-relaxed">
            We keep personal data only as long as needed for the purposes above
            or as required by law. Server logs are typically kept for a limited
            period. Account and app data are processed for as long as your
            account exists; after deletion, data may be retained where legally
            required or to establish, exercise, or defend legal claims.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">
            10. Your rights
          </h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              Subject to the GDPR, you have the right of access, rectification,
              erasure, restriction of processing, data portability, and to
              object to certain processing (Art. 15–21 GDPR). If processing is
              based on consent, you can withdraw it at any time (Art. 7(3)
              GDPR).
            </p>
            <p>
              You also have the right to lodge a complaint with a supervisory
              authority (Art. 77 GDPR).
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">
            11. Updates to this policy
          </h2>
          <p className="text-sm leading-relaxed">
            We may update this policy if legal requirements or our processing
            activities change. The current version is published on this page.
          </p>
        </section>
      </div>
    </div>
  );
}
