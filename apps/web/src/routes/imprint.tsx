import { createFileRoute } from "@tanstack/react-router";
import { staticTitle } from "./__root";

export const Route = createFileRoute("/imprint")({
  head: () => ({
    meta: [
      {
        title: `Imprint${staticTitle}`,
      },
    ],
  }),
  component: ImprintPage,
});

function ImprintPage() {
  return (
    <div className="container mx-auto px-6 py-14">
      <header className="space-y-3">
        <h1 className="font-semibold text-3xl tracking-tight">Imprint</h1>
        <p className="text-muted-foreground text-sm">
          Information pursuant to German law (in particular § 5 TMG and, where
          applicable, § 18(2) MStV).
        </p>
      </header>

      <div className="mt-10 space-y-10">
        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">
            Service provider
          </h2>
          <div className="space-y-1 text-sm leading-relaxed">
            <p>
              <strong>Max Wagner</strong>
            </p>
            <p>Zum Aubühl 5</p>
            <p>95326 Kulmbach</p>
            <p>Germany</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">Contact</h2>
          <div className="space-y-1 text-sm leading-relaxed">
            <p>
              Email: <strong>contact@everythingbuiltwith.com</strong>
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">
            Responsible for content
          </h2>
          <p className="text-sm leading-relaxed">
            Responsible pursuant to § 18(2) MStV (where applicable):{" "}
            <strong>Max Wagner</strong>,{" "}
            <strong>Zum Aubühl 5, 95326 Kulmbach, Germany</strong>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">
            EU online dispute resolution / consumer dispute resolution
          </h2>
          <p className="text-sm leading-relaxed">
            The European Commission provides a platform for online dispute
            resolution (ODR):{" "}
            <a
              className="underline underline-offset-4 hover:text-foreground"
              href="https://ec.europa.eu/consumers/odr/"
              rel="noopener noreferrer"
              target="_blank"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            .<br />
            We are not obliged and not willing to participate in dispute
            resolution proceedings before a consumer arbitration board.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">Liability</h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              We are responsible for our own content on these pages in
              accordance with general laws. However, we do not assume any
              liability for accuracy, completeness, or timeliness of
              information, to the extent permitted by law.
            </p>
            <p>
              Our pages may contain links to external third‑party websites. We
              have no influence over their content and therefore cannot assume
              any liability for such external content. The respective provider
              or operator is always responsible for the content of linked pages.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">
            User-generated content
          </h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              Users can submit their own tech stacks and related information.
              Users are solely responsible for the content they submit (e.g.
              correctness, legality, and third‑party rights).
            </p>
            <p>
              We do not adopt user submissions as our own. We are not liable for
              user-generated content, to the extent permitted by law. If we
              become aware of unlawful content, we will remove or block access
              to it within a reasonable time.
            </p>
            <p>
              Content we create and curate ourselves (e.g. company stacks) is
              our responsibility under the general laws.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
