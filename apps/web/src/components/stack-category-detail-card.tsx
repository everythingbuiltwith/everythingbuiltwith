import { format } from "date-fns";
import { ArrowRight, HistoryIcon, LightbulbIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { TechnologyIcon } from "@/components/technology-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface DetailTechnology {
  _id: string;
  iconPath: string;
  name: string;
}

interface TechUpdateEntry {
  _id: string;
  date: number;
  description: string;
  oldTechnology?: DetailTechnology;
  reason: {
    _id: string;
    name: string;
  };
}

interface StackCategoryDetailCardProps {
  categoryId: string;
  categoryName: string;
  longDescription: string;
  reasonName: string;
  shortDescription: string;
  technologies: DetailTechnology[];
  updates?: TechUpdateEntry[];
}

const EMPTY_UPDATES: TechUpdateEntry[] = [];

const markdownSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "u"],
  attributes: {
    ...defaultSchema.attributes,
    a: [...(defaultSchema.attributes?.a ?? []), "target", "rel"],
  },
};

export function StackCategoryDetailCard({
  categoryId,
  categoryName,
  reasonName,
  shortDescription,
  longDescription,
  technologies,
  updates = EMPTY_UPDATES,
}: StackCategoryDetailCardProps) {
  const updateCount = updates.length;
  const hasUpdates = updateCount > 0;
  const shortDescriptionText =
    shortDescription.trim().length > 0
      ? shortDescription
      : "No information available";
  const hasLongDescription = longDescription.trim().length > 0;

  return (
    <Card
      className="relative flex h-full flex-col text-left transition-colors"
      key={categoryId}
    >
      <CardHeader>
        <div className="mb-2 flex justify-end">
          <Badge variant="secondary">{reasonName}</Badge>
        </div>
        <CardTitle className="font-extrabold text-xl tracking-tight">
          {categoryName}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative flex flex-1 flex-col gap-4 pt-2">
        <div className="mb-2 flex flex-wrap items-center justify-center gap-6 rounded-lg bg-muted/40 px-4 py-3.5">
          {technologies.map((tech) => (
            <div className="flex flex-col items-center gap-1" key={tech._id}>
              <div className="flex min-h-10 items-center gap-1.5 text-4xl">
                <TechnologyIcon
                  className="size-10"
                  iconPath={tech.iconPath}
                  name={tech.name}
                  size={40}
                />
              </div>
              <span className="mt-1 text-center text-muted-foreground text-xs">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
        <div>
          <div className="text-muted-foreground text-sm">
            {shortDescriptionText}
          </div>
        </div>
      </CardContent>
      {(hasUpdates || hasLongDescription) && (
        <CardFooter className="mt-auto flex items-center justify-between gap-3 border-t-0 bg-transparent">
          {hasUpdates ? (
            <Sheet>
              <SheetTrigger>
                <Button size="sm" variant="outline">
                  <HistoryIcon />
                  {updateCount} past change{updateCount !== 1 ? "s" : ""}
                </Button>
              </SheetTrigger>
              <SheetContent className="min-w-[500px]" side="right">
                <SheetHeader>
                  <SheetTitle>Past changes</SheetTitle>
                </SheetHeader>
                <div className="relative flex flex-col gap-0 px-4 py-4">
                  <div
                    aria-hidden="true"
                    className="absolute top-0 bottom-0 left-6 w-px bg-border"
                  />
                  {updates.map((update) => (
                    <div
                      className="relative flex flex-row items-start"
                      key={update._id}
                    >
                      <div className="relative flex w-12 flex-col items-center">
                        <span className="absolute left-[0.05rem] z-10 h-4 w-4 rounded-full border-2 border-background bg-primary" />
                      </div>
                      <div className="flex-1 pb-6">
                        {update.date && (
                          <div className="mb-2 text-muted-foreground text-xs">
                            {format(new Date(update.date), "PPP")}
                          </div>
                        )}
                        <div className="mb-4 flex items-center gap-2">
                          {update.oldTechnology && (
                            <span className="flex items-center text-2xl">
                              <TechnologyIcon
                                className="size-6"
                                iconPath={update.oldTechnology.iconPath}
                                name={update.oldTechnology.name}
                                size={24}
                              />
                            </span>
                          )}
                          <Badge variant="secondary">
                            {update.reason.name}
                          </Badge>
                        </div>
                        <div className="text-muted-foreground text-sm leading-snug">
                          {update.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <SheetFooter>
                  <SheetClose>
                    <Button variant="secondary">Close</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          ) : (
            <Button disabled size="sm" variant="outline">
              <HistoryIcon />
              No past changes
            </Button>
          )}
          {hasLongDescription ? (
            <Dialog>
              <DialogTrigger asChild>
                <button
                  className="inline-flex items-center gap-1.5 font-medium text-primary text-sm hover:underline"
                  type="button"
                >
                  Read full context
                  <ArrowRight className="size-3.5" />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Full context</DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto px-4 pb-2 text-sm leading-relaxed">
                  {/* biome-ignore lint: prose utility ordering is intentional */}
                  <div className="prose prose-invert max-w-none prose-a:text-destructive prose-a:underline prose-a:decoration-destructive prose-p:my-2 prose-ul:my-2 prose-ol:my-2">
                    <ReactMarkdown
                      components={{
                        a: (props) => (
                          <a
                            className="text-destructive underline decoration-destructive underline-offset-2"
                            rel="noopener noreferrer"
                            target="_blank"
                            {...props}
                          />
                        ),
                      }}
                      rehypePlugins={[
                        rehypeRaw,
                        [rehypeSanitize, markdownSchema],
                      ]}
                      remarkPlugins={[remarkGfm]}
                    >
                      {longDescription}
                    </ReactMarkdown>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose>
                    <Button variant="secondary">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            hasUpdates && (
              <Button disabled size="sm" variant="outline">
                <LightbulbIcon />
                No further context
              </Button>
            )
          )}
        </CardFooter>
      )}
    </Card>
  );
}
