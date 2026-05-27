import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DropdownMenu } from "./DropdownMenu";

function TestDropdown({
  onEdit = vi.fn(),
  onDelete = vi.fn(),
}: {
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <DropdownMenu
      trigger={<button type="button">Open menu</button>}
      items={[
        { label: "Edit Budget", onClick: onEdit },
        { label: "Delete Budget", onClick: onDelete, destructive: true },
      ]}
    />
  );
}

describe("DropdownMenu", () => {
  it("renders the trigger and keeps menu hidden initially", () => {
    render(<TestDropdown />);

    expect(
      screen.getByRole("button", { name: "Open menu" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens the menu when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<TestDropdown />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Edit Budget" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Delete Budget" }),
    ).toBeInTheDocument();
  });

  it("calls the item callback when a menu item is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<TestDropdown onEdit={onEdit} />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(screen.getByRole("menuitem", { name: "Edit Budget" }));

    expect(onEdit).toHaveBeenCalledOnce();
  });

  it("calls the destructive item callback when delete is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<TestDropdown onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(screen.getByRole("menuitem", { name: "Delete Budget" }));

    expect(onDelete).toHaveBeenCalledOnce();
  });

  it("closes the menu after selecting an item", async () => {
    const user = userEvent.setup();
    render(<TestDropdown />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(screen.getByRole("menuitem", { name: "Edit Budget" }));

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("closes the menu when Escape is pressed", async () => {
    const user = userEvent.setup();
    render(<TestDropdown />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("returns focus to the trigger after closing", async () => {
    const user = userEvent.setup();
    render(<TestDropdown />);

    const trigger = screen.getByRole("button", { name: "Open menu" });
    await user.click(trigger);
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });
});
