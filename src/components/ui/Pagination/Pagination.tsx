import { cn } from "@/lib/cn";
import { ArrowRightIcon } from "../icons/ArrowRightIcon";

type PageItem = number | "ellipsis";

function getPageRange(
  currentPage: number,
  totalPages: number,
  window: number,
): PageItem[] {
  if (totalPages <= window * 2 + 3) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: PageItem[] = [1];
  const rangeStart = Math.max(2, currentPage - window);
  const rangeEnd = Math.min(totalPages - 1, currentPage + window);

  if (rangeStart > 2) items.push("ellipsis");
  for (let i = rangeStart; i <= rangeEnd; i++) items.push(i);
  if (rangeEnd < totalPages - 1) items.push("ellipsis");
  items.push(totalPages);

  return items;
}

function getMobilePageRange(
  currentPage: number,
  totalPages: number,
): PageItem[] {
  if (totalPages <= 3) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 2) {
    return [1, 2, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 1) {
    return [1, "ellipsis", totalPages - 1, totalPages];
  }

  return [1, "ellipsis", currentPage, totalPages - 1];
}

const baseButton =
  "flex items-center justify-center rounded-lg border text-preset-5-bold transition-colors duration-150 h-[40px] min-w-[40px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-40";

const inactiveButton =
  "border-beige-500 bg-white text-grey-900 hover:bg-beige-100";

const activeButton = "border-grey-900 bg-grey-900 text-white";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const desktopPages = getPageRange(currentPage, totalPages, 2);
  const mobilePages = getMobilePageRange(currentPage, totalPages);

  const prevDisabled = currentPage === 1;
  const nextDisabled = currentPage === totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="flex w-full items-center justify-between gap-200"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={prevDisabled}
        aria-label="Go to previous page"
        className={cn(baseButton, inactiveButton, "gap-200 px-300")}
      >
        <ArrowRightIcon className="rotate-180" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      <div className="hidden items-center gap-200 sm:flex">
        {desktopPages.map((page, i) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-desktop-${i}`}
              className={cn(baseButton, inactiveButton, "gap-200 px-300")}
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              aria-label={`Go to page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
              className={cn(
                baseButton,
                page === currentPage ? activeButton : inactiveButton,
              )}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <div className="flex items-center gap-200 sm:hidden">
        {mobilePages.map((page, i) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-mobile-${i}`}
              className={cn(baseButton, inactiveButton, "gap-200 px-300")}
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              aria-label={`Go to page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
              className={cn(
                baseButton,
                page === currentPage ? activeButton : inactiveButton,
              )}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={nextDisabled}
        aria-label="Go to next page"
        className={cn(baseButton, inactiveButton, "gap-200 px-300")}
      >
        <span className="hidden sm:inline">Next</span>
        <ArrowRightIcon />
      </button>
    </nav>
  );
}
