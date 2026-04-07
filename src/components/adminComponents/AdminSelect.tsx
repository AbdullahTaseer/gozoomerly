'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const adminSelectItemClassName =
  'data-[highlighted]:bg-gradient-to-r data-[highlighted]:from-black data-[highlighted]:to-black data-[highlighted]:text-white ' +
  'focus:bg-gradient-to-r focus:from-black focus:to-black focus:text-white ' +
  'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-black data-[state=checked]:to-black data-[state=checked]:text-white';

export type AdminSelectItemProps = React.ComponentProps<typeof SelectItem>;

function Item({ className, ...props }: AdminSelectItemProps) {
  return <SelectItem className={cn(adminSelectItemClassName, className)} {...props} />;
}

function Root(props: React.ComponentProps<typeof Select>) {
  return <Select {...props} />;
}

type AdminSelectCompound = typeof Root & {
  Trigger: typeof SelectTrigger;
  Value: typeof SelectValue;
  Content: typeof SelectContent;
  Item: typeof Item;
  Group: typeof SelectGroup;
  Label: typeof SelectLabel;
  Separator: typeof SelectSeparator;
  ScrollUpButton: typeof SelectScrollUpButton;
  ScrollDownButton: typeof SelectScrollDownButton;
};

const AdminSelect = Object.assign(Root, {
  Trigger: SelectTrigger,
  Value: SelectValue,
  Content: SelectContent,
  Item,
  Group: SelectGroup,
  Label: SelectLabel,
  Separator: SelectSeparator,
  ScrollUpButton: SelectScrollUpButton,
  ScrollDownButton: SelectScrollDownButton,
}) as AdminSelectCompound;

export default AdminSelect;
