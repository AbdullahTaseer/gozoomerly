"use client";
import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type FloatingSelectProps = {
  label: string;
  value?: string;
  onChange: (val: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
};

const FloatingSelect = ({
  label,
  value,
  onChange,
  children,
  disabled,
}: FloatingSelectProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full">

      <label
        className={cn(
          "absolute left-3 transition-all bg-white px-1 text-[#020202]",
          value || isFocused
            ? "text-[14px] -top-2"
            : "text-[16px] top-1/2 -translate-y-1/2"
        )}
      >
        {label}
      </label>

      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full border bg-white border-[#2E2C39] !h-[50px]"
        >
          <SelectValue placeholder={""} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  );
};

export default FloatingSelect;