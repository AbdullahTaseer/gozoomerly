"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export type SearchSelectOption = {
  value: string;
  label: string;
  keywords?: string[];
};

type FloatingSearchSelectProps = {
  label: string;
  value?: string;
  onChange: (val: string) => void;
  options: SearchSelectOption[];
  disabled?: boolean;
  searchPlaceholder?: string;
};

const FloatingSearchSelect = ({
  label,
  value,
  onChange,
  options,
  disabled,
  searchPlaceholder = "Search...",
}: FloatingSearchSelectProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filtered = options.filter((opt) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    if (opt.label.toLowerCase().includes(q)) return true;
    if (opt.value.toLowerCase().includes(q)) return true;
    if (opt.keywords?.some((k) => k.toLowerCase().includes(q))) return true;
    return false;
  });

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  return (
    <div className="relative w-full">
      <label
        className={cn(
          "absolute left-3 transition-all bg-white px-1 text-[#020202] z-[1] pointer-events-none",
          value || isFocused || isOpen
            ? "text-[14px] -top-2"
            : "text-[16px] top-1/2 -translate-y-1/2"
        )}
      >
        {label}
      </label>

      <Select
        value={value || undefined}
        onValueChange={onChange}
        disabled={disabled}
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <SelectTrigger
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full border bg-white border-[#2E2C39] !h-[50px]"
        >
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent className="max-h-[400px]">
          <div className="p-2 border-b border-gray-200 sticky top-0 bg-popover z-10">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  e.stopPropagation();
                  setSearchQuery(e.target.value);
                }}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === "Escape") setIsOpen(false);
                }}
                onClick={(e) => e.stopPropagation()}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="max-h-[280px] overflow-y-auto p-1">
            {filtered.length > 0 ? (
              filtered.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-sm text-gray-500">
                No results
              </div>
            )}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FloatingSearchSelect;
