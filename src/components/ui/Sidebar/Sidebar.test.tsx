import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Sidebar } from "./Sidebar";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

import { usePathname } from "next/navigation";

const mockUsePathname = vi.mocked(usePathname);

describe("Sidebar", () => {
  describe("rendering", () => {
    it("renders all nav links", () => {
      mockUsePathname.mockReturnValue("/");
      render(<Sidebar />);

      expect(
        screen.getByRole("link", { name: /overview/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /transactions/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /budgets/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /pots/i })).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /recurring bills/i }),
      ).toBeInTheDocument();
    });

    it("renders the logo", () => {
      mockUsePathname.mockReturnValue("/");
      render(<Sidebar />);

      expect(screen.getByAltText("finance")).toBeInTheDocument();
    });
  });

  describe("active state", () => {
    it("applies active classes to the current route link", () => {
      mockUsePathname.mockReturnValue("/budgets");
      render(<Sidebar />);

      const budgetsLink = screen.getByRole("link", { name: /budgets/i });
      expect(budgetsLink).toHaveClass("bg-beige-100", "border-l-green");
    });

    it("does not apply active classes to inactive links", () => {
      mockUsePathname.mockReturnValue("/budgets");
      render(<Sidebar />);

      const overviewLink = screen.getByRole("link", { name: /overview/i });
      expect(overviewLink).not.toHaveClass("bg-beige-100");
      expect(overviewLink).not.toHaveClass("border-l-green");
    });

    it("marks overview as active when on root path", () => {
      mockUsePathname.mockReturnValue("/");
      render(<Sidebar />);

      const overviewLink = screen.getByRole("link", { name: /overview/i });
      expect(overviewLink).toHaveClass("bg-beige-100", "border-l-green");
    });

    it("marks recurring bills as active on its route", () => {
      mockUsePathname.mockReturnValue("/recurring-bills");
      render(<Sidebar />);

      const recurringLink = screen.getByRole("link", {
        name: /recurring bills/i,
      });
      expect(recurringLink).toHaveClass("bg-beige-100", "border-l-green");
    });

    it("has only one active link at a time", () => {
      mockUsePathname.mockReturnValue("/pots");
      render(<Sidebar />);

      const activeLinks = screen
        .getAllByRole("link")
        .filter((link) => link.classList.contains("bg-beige-100"));

      expect(activeLinks).toHaveLength(1);
    });
  });
});
