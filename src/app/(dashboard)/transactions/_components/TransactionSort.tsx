"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/Select";

export const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "az", label: "A to Z" },
  { value: "za", label: "Z to A" },
  { value: "highest", label: "Highest" },
  { value: "lowest", label: "Lowest" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

export const DEFAULT_SORT: SortKey = "latest";

export function TransactionSort() {
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
    <Select
      options={[...SORT_OPTIONS]}
      value={current}
      onValueChange={handleChange}
    />
  );
}
