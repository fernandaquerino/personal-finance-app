import type { Category } from "@/generated/prisma/enums";

export const CATEGORY_LABELS: Record<Category, string> = {
  Entertainment: "Entertainment",
  Bills: "Bills",
  Groceries: "Groceries",
  DiningOut: "Dining Out",
  Transportation: "Transportation",
  PersonalCare: "Personal Care",
  Education: "Education",
  Lifestyle: "Lifestyle",
  Shopping: "Shopping",
  General: "General",
};

export const VALID_CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];
