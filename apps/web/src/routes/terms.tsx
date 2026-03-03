import { createFileRoute } from "@tanstack/react-router";
import { staticTitle } from "./__root";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      {
        title: `Terms of Use${staticTitle}`,
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="container mx-auto px-6 py-14">
      <header className="space-y-3">
        <h1 className="font-semibold text-3xl tracking-tight">Terms of Use</h1>
        <p className="text-muted-foreground text-sm">
          Effective date: <strong>February 18, 2026</strong>
        </p>
      </header>

      <div className="mt-10 space-y-10">
        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">
            1. Scope & provider
          </h2>
          <p className="text-sm leading-relaxed">
            These Terms of Use govern your use of the website and related
            features (the “Service”) available at{" "}
            <strong>everythingbuiltwith.com</strong>. The provider is{" "}
            <strong>Max Wagner</strong> (“we”, “us”).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">
            2. Accounts, sign-in and security
          </h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              Some features (for example submitting tech stacks) require an
              account. Authentication is provided via a third‑party provider
              (Clerk). You must keep your credentials confidential and notify us
              promptly if you suspect misuse.
            </p>
            <p>
              We may suspend or terminate accounts if there are indications of
              abuse, legal violations, or security risks.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">
            3. User submissions (tech stacks) – rights and ownership
          </h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              Users can submit content, in particular information about tech
              stacks, technologies, reasons, descriptions, links and metadata
              (“User Content”).
            </p>
            <p>
              <strong>Important</strong>: By submitting User Content, you assign
              to us, to the maximum extent permitted by law, all exclusive,
              worldwide, transferable and sublicensable rights of use in the
              User Content, for an unlimited term and scope, including the right
              to reproduce, distribute, make publicly available, edit/adapt, and
              commercially exploit it.
            </p>
            <p>
              Where a full assignment is not legally possible, you grant us an{" "}
              <strong>
                exclusive, royalty‑free, irrevocable, transferable and
                sublicensable license
              </strong>{" "}
              to the maximum extent permitted by law. This includes the right to
              use User Content for our own business purposes and to sell it.
            </p>
            <p>
              You represent that you have the necessary rights to grant the
              rights above and that your User Content does not infringe
              third‑party rights (e.g. copyrights, trademarks, database rights,
              trade secrets). You will indemnify us against third‑party claims
              arising from unlawful User Content to the extent you are
              responsible for the infringement.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">
            4. Prohibited content and conduct
          </h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              You must not submit User Content or engage in conduct that
              violates applicable law or third‑party rights. In particular, you
              must not:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>post unlawful, abusive or discriminatory content</li>
              <li>share trade secrets or confidential information</li>
              <li>
                spam, mass-submit automatically, or manipulate the Service
              </li>
              <li>distribute malware, phishing, or attack systems</li>
            </ul>
            <p>
              We may review, moderate, block or remove content where there are
              indications of violations.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">
            5. Availability and changes
          </h2>
          <p className="text-sm leading-relaxed">
            We aim for high availability but do not guarantee uninterrupted
            operation. We may change, restrict or discontinue features for
            technical, security, legal or business reasons.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">
            6. Logos, trademarks and sponsorship disclosure
          </h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              Company names, logos and marks displayed on the Service are used
              for identification and reference purposes only. All logos,
              trademarks and other marks are the property of their respective
              owners.
            </p>
            <p>
              Unless explicitly labeled as sponsored, paid, or promoted, listed
              companies do not pay to be included on this website.
            </p>
            <p>
              In some cases, we may receive free credits or other support from
              a listed company. Such support is not provided in exchange for
              listing, placement, ranking, or endorsement unless explicitly
              stated otherwise.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">
            7. Warranty disclaimer and limitation of liability
          </h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              To the extent permitted by law, the Service is provided “as is”
              and “as available”. Content (especially User Content) may be
              incomplete, inaccurate or outdated.
            </p>
            <p>
              Nothing in these Terms limits liability for intent or gross
              negligence, or for injury to life, body or health, or under
              mandatory product liability rules. In cases of simple negligence,
              we are liable only for breaches of essential contractual
              obligations (cardinal duties) and only for typical, foreseeable
              damages. Any further liability is excluded to the extent permitted
              by law.
            </p>
            <p>
              We are not responsible for User Content. If you rely on any tech
              stack information submitted by users, you do so at your own risk.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">8. Privacy</h2>
          <p className="text-sm leading-relaxed">
            Information about how we process personal data is available in our
            Privacy Policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">
            9. Governing law and venue
          </h2>
          <p className="text-sm leading-relaxed">
            German law applies, excluding the UN Convention on Contracts for the
            International Sale of Goods (CISG), unless mandatory consumer
            protection rules provide otherwise. If you are a merchant, a legal
            entity under public law, or a special fund under public law, the
            exclusive place of jurisdiction is our registered address.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">10. Contact</h2>
          <p className="text-sm leading-relaxed">
            If you have questions about these Terms, contact us at{" "}
            <strong>contact@everythingbuiltwith.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
