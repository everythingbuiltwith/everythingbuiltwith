import { ChevronLeft, ChevronRight } from "lucide-react";
import type * as React from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul className={cn("flex flex-row items-center gap-1", className)} {...props} />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li {...props} />;
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        buttonVariants({ size: "sm", variant: "outline" }),
        "gap-1 pl-2.5",
        className
      )}
      type="button"
      {...props}
    >
      <ChevronLeft className="size-4" />
      <span>Previous</span>
    </button>
  );
}

function PaginationNext({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        buttonVariants({ size: "sm", variant: "outline" }),
        "gap-1 pr-2.5",
        className
      )}
      type="button"
      {...props}
    >
      <span>Next</span>
      <ChevronRight className="size-4" />
    </button>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
};
