"use client";

import * as RadixSelect from "@radix-ui/react-select";
import { useRouter, useSearchParams } from "next/navigation";
import { SortIcon } from "@/components/ui/icons/SortIcon";
import { DEFAULT_SORT, SORT_OPTIONS, type SortKey } from "./TransactionSort";

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2 6L5 9L10 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TransactionSortMobile() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = (searchParams.get("sort") as SortKey) ?? DEFAULT_SORT;

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === DEFAULT_SORT) {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  }

  return (
    <RadixSelect.Root value={current} onValueChange={handleChange}>
      <RadixSelect.Trigger
        aria-label="Sort transactions"
        className="text-grey-900 flex shrink-0 items-center justify-center focus:outline-none"
      >
        <SortIcon />
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={4}
          className="z-50 overflow-hidden rounded-lg bg-white shadow-lg"
        >
          <RadixSelect.Viewport className="py-100">
            {SORT_OPTIONS.map((option) => (
              <RadixSelect.Item
                key={option.value}
                value={option.value}
                className="border-grey-100 text-preset-4 text-grey-900 flex cursor-pointer items-center justify-between border-b px-300 py-200 outline-none select-none last:border-0 data-[state=checked]:font-bold"
              >
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                <RadixSelect.ItemIndicator className="text-grey-900">
                  <CheckIcon />
                </RadixSelect.ItemIndicator>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
