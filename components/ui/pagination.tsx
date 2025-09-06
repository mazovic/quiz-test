"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
  className?: string;
}

// Pagination Container
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const pages: (number | string)[] = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);
    if (left > 2) pages.push("...");

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
    >
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
        </PaginationItem>

        {/* Page Numbers */}
        {visiblePages.map((page, index) =>
          page === "..." ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => onPageChange(page as number)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            onClick={() =>
              currentPage < totalPages && onPageChange(currentPage + 1)
            }
            disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </nav>
  );
};
Pagination.displayName = "Pagination";

// Pagination Content (ul)
const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

// Pagination Item (li)
const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

// Pagination Link (page button)
type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"button">;

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <button
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

// Previous Button
const PaginationPrevious = ({
  className,
  disabled,
  ...props
}: React.ComponentProps<"button"> & { disabled?: boolean }) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn(
      "gap-1 pl-2.5",
      disabled ? "opacity-50 pointer-events-none" : "",
      className
    )}
    disabled={disabled}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

// Next Button
const PaginationNext = ({
  className,
  disabled,
  ...props
}: React.ComponentProps<"button"> & { disabled?: boolean }) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn(
      "gap-1 pr-2.5",
      disabled ? "opacity-50 pointer-events-none" : "",
      className
    )}
    disabled={disabled}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

// Ellipsis (...)
const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
