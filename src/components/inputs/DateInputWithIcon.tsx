"use client";

import React, { useRef } from "react";
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

function openDatePicker(input: HTMLInputElement | null) {
  if (!input) return;
  if (typeof input.showPicker === "function") {
    try {
      input.showPicker();
      return;
    } catch {
      /* user gesture required in some browsers */
    }
  }
  input.focus();
  input.click();
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
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={`relative w-full ${className ?? ""}`} style={{ width }}>
      <input
        id={id}
        ref={inputRef}
        type="date"
        disabled={disabled}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ height, width: "100%" }}
        className="relative globalinput-placeholder placeholder:text-[15px] text-[15px] text-black border focus:outline-none block border-[#2E2C39] rounded-[5px] pl-4 pr-12 bg-transparent
          [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-11 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
      />
      <button
        type="button"
        aria-label="Choose date"
        disabled={disabled}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => openDatePicker(inputRef.current)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#2E2C39] transition-colors hover:text-[#F43C83] disabled:pointer-events-none disabled:opacity-40"
      >
        <CalendarDays size={22} strokeWidth={1.75} aria-hidden />
      </button>
    </div>
  );
};

export default DateInputWithIcon;
