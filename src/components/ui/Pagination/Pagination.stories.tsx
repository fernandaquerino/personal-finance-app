import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Pagination } from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "UI/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  argTypes: {
    currentPage: { control: { type: "number", min: 1 } },
    totalPages: { control: { type: "number", min: 0 } },
    onPageChange: { action: "onPageChange" },
  },
  args: {
    currentPage: 1,
    totalPages: 5,
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {};

export const MiddlePage: Story = {
  args: { currentPage: 3, totalPages: 5 },
};

export const LastPage: Story = {
  args: { currentPage: 5, totalPages: 5 },
};

export const ManyPages: Story = {
  args: { currentPage: 5, totalPages: 20 },
};

export const SinglePage: Story = {
  args: { currentPage: 1, totalPages: 1 },
};

export const Interactive: Story = {
  args: { currentPage: 1, totalPages: 10 },
  render: function Render(args) {
    const [page, setPage] = useState(args.currentPage);
    return <Pagination {...args} currentPage={page} onPageChange={setPage} />;
  },
};
