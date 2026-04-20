"use client";

import React from "react";
import { CalendarDays } from "lucide-react";

export type DateInputWithIconProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  width?: string;
  height?: string;
  className?: string;
};

function formatDisplayDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

const DateInputWithIcon = ({
  id,
  value,
  onChange,
  placeholder,
  disabled,
  width = "100%",
  height = "48px",
  className,
}: DateInputWithIconProps) => {
  const display = formatDisplayDate(value);
  const hint = placeholder || "Select date";

  return (
    <div
      className={`relative w-full rounded-[5px] border border-[#2E2C39] bg-white ${disabled ? "cursor-not-allowed opacity-60" : ""} ${className ?? ""}`}
      style={{ width, height }}
    >
      {/* Visual only — taps pass through to the native date input above */}
      <div
        className="pointer-events-none absolute inset-0 z-0 flex items-center gap-2 pl-4 pr-3"
        aria-hidden
      >
        <span
          className={`min-w-0 flex-1 truncate text-[15px] ${display ? "text-black" : "font-[300] text-[#020202]"}`}
        >
          {display || hint}
        </span>
        <CalendarDays
          className={`shrink-0 ${disabled ? "text-[#A6A6A6]" : "text-[#2E2C39]"}`}
          size={22}
          strokeWidth={1.75}
        />
      </div>

      <input
        id={id}
        type="date"
        disabled={disabled}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        aria-label={hint}
        style={{ height, width: "100%" }}
        className="absolute inset-0 z-10 box-border cursor-pointer border-0 bg-transparent p-0 opacity-0
          text-base
          [-webkit-appearance:none] [appearance:none]
          disabled:cursor-not-allowed
          [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer
          [&::-webkit-datetime-edit]:p-0 [&::-webkit-datetime-edit-fields-wrapper]:p-0"
      />
    </div>
  );
};

export default DateInputWithIcon;
