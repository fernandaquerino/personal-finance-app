import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BottomNav } from "./BottomNav";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

import { usePathname } from "next/navigation";

const mockUsePathname = vi.mocked(usePathname);

describe("BottomNav", () => {
  describe("rendering", () => {
    it("renders all 5 nav links", () => {
      mockUsePathname.mockReturnValue("/");
      render(<BottomNav />);

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
      expect(screen.getByRole("link", { name: /bills/i })).toBeInTheDocument();
    });

    it("renders with accessible nav label", () => {
      mockUsePathname.mockReturnValue("/");
      render(<BottomNav />);

      expect(
        screen.getByRole("navigation", { name: /main navigation/i }),
      ).toBeInTheDocument();
    });

    it("all links have aria-label", () => {
      mockUsePathname.mockReturnValue("/");
      render(<BottomNav />);

      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).toHaveAttribute("aria-label");
      });
    });
  });

  describe("active state", () => {
    it("sets aria-current='page' on the active link", () => {
      mockUsePathname.mockReturnValue("/budgets");
      render(<BottomNav />);

      expect(screen.getByRole("link", { name: /budgets/i })).toHaveAttribute(
        "aria-current",
        "page",
      );
    });

    it("does not set aria-current on inactive links", () => {
      mockUsePathname.mockReturnValue("/budgets");
      render(<BottomNav />);

      expect(
        screen.getByRole("link", { name: /overview/i }),
      ).not.toHaveAttribute("aria-current");
      expect(screen.getByRole("link", { name: /pots/i })).not.toHaveAttribute(
        "aria-current",
      );
    });

    it("applies active background class to the active item", () => {
      mockUsePathname.mockReturnValue("/transactions");
      render(<BottomNav />);

      const activeLink = screen.getByRole("link", { name: /transactions/i });
      const pill = activeLink.querySelector("span");
      expect(pill).toHaveClass("bg-beige-100");
    });

    it("does not apply active background to inactive items", () => {
      mockUsePathname.mockReturnValue("/transactions");
      render(<BottomNav />);

      const inactiveLink = screen.getByRole("link", { name: /pots/i });
      const pill = inactiveLink.querySelector("span");
      expect(pill).not.toHaveClass("bg-beige-100");
    });

    it("has only one active link at a time", () => {
      mockUsePathname.mockReturnValue("/pots");
      render(<BottomNav />);

      const activeLinks = screen
        .getAllByRole("link")
        .filter((link) => link.getAttribute("aria-current") === "page");

      expect(activeLinks).toHaveLength(1);
    });

    it("marks overview as active on root path", () => {
      mockUsePathname.mockReturnValue("/");
      render(<BottomNav />);

      expect(screen.getByRole("link", { name: /overview/i })).toHaveAttribute(
        "aria-current",
        "page",
      );
    });

    it("marks bills as active on recurring-bills route", () => {
      mockUsePathname.mockReturnValue("/recurring-bills");
      render(<BottomNav />);

      expect(screen.getByRole("link", { name: /bills/i })).toHaveAttribute(
        "aria-current",
        "page",
      );
    });
  });
});
