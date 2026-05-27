import type { Meta, StoryObj } from "@storybook/react";
import { DropdownMenu } from "./DropdownMenu";

const meta: Meta<typeof DropdownMenu> = {
  title: "UI/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
  parameters: { backgrounds: { default: "light" } },
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  render: () => (
    <div className="flex justify-center p-600">
      <DropdownMenu
        trigger={
          <button
            type="button"
            className="text-grey-500 hover:text-grey-900 rounded p-100 transition-colors"
            aria-label="Options"
          >
            ···
          </button>
        }
        items={[
          { label: "Edit Budget", onClick: () => {} },
          { label: "Delete Budget", onClick: () => {}, destructive: true },
        ]}
      />
    </div>
  ),
};

export const WithoutDestructive: Story = {
  render: () => (
    <div className="flex justify-center p-600">
      <DropdownMenu
        trigger={
          <button
            type="button"
            className="text-grey-500 hover:text-grey-900 rounded p-100 transition-colors"
            aria-label="Options"
          >
            ···
          </button>
        }
        items={[
          { label: "Edit Pot", onClick: () => {} },
          { label: "Delete Pot", onClick: () => {}, destructive: true },
        ]}
      />
    </div>
  ),
};
