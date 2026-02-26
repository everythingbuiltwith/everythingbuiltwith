import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { staticTitle } from "./__root";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      {
        title: `Blog${staticTitle}`,
      },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <div className="container mx-auto px-6 py-14">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="font-semibold text-4xl tracking-tight md:text-5xl">
          Blog
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Insights around modern tech stacks are coming soon.
        </p>
      </header>

      <section className="mx-auto mt-12">
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <FileText className="size-12" />
            </EmptyMedia>
            <EmptyTitle>No blog posts yet</EmptyTitle>
            <EmptyDescription>
              We are first collecting high-quality user and company tech stacks.
              After that, we will publish blog posts with comparisons,
              benchmarks, and best practices about the technologies people
              really use.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </section>
    </div>
  );
}
