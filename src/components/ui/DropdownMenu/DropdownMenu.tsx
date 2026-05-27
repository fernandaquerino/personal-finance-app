"use client";

import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import { Fragment, type ReactNode } from "react";

export type DropdownItem = {
  label: string;
  onClick: () => void;
  destructive?: boolean;
};

type Props = {
  trigger: ReactNode;
  items: DropdownItem[];
};

export function DropdownMenu({ trigger, items }: Props) {
  return (
    <RadixDropdown.Root>
      <RadixDropdown.Trigger asChild>{trigger}</RadixDropdown.Trigger>
      <RadixDropdown.Portal>
        <RadixDropdown.Content
          className="z-50 w-[168px] rounded-xl bg-white py-100 shadow-[0_4px_24px_rgba(0,0,0,0.25)]"
          align="end"
          sideOffset={4}
        >
          {items.map((item, i) => (
            <Fragment key={item.label}>
              {i > 0 && (
                <RadixDropdown.Separator className="bg-grey-100 mx-400 my-100 h-px" />
              )}
              <RadixDropdown.Item
                className={`text-preset-4 mx-100 cursor-pointer rounded-lg px-300 py-200 transition-colors outline-none select-none ${
                  item.destructive
                    ? "text-red focus:bg-red/10"
                    : "text-grey-900 focus:bg-grey-100"
                }`}
                onSelect={item.onClick}
              >
                {item.label}
              </RadixDropdown.Item>
            </Fragment>
          ))}
        </RadixDropdown.Content>
      </RadixDropdown.Portal>
    </RadixDropdown.Root>
  );
}
