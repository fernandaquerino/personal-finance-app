"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/Select";
import { CATEGORY_LABELS } from "@/lib/categories";

const ALL_VALUE = "all";

const CATEGORY_OPTIONS = [
  { value: ALL_VALUE, label: "All Transactions" },
  ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
];

export function TransactionCategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("category") ?? ALL_VALUE;

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === ALL_VALUE) {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  }

  return (
    <Select
      options={CATEGORY_OPTIONS}
      value={current}
      onValueChange={handleChange}
    />
  );
}
