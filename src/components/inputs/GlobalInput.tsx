"use client";

import React, { useState, forwardRef } from "react";

export type GlobalInputProps = {
  id?: string;
  value?: string | number;
  type?: string;
  width?: string;
  title?: string;
  className?: string;
  height?: string;
  bgColor?: string;
  labelFont?: string;
  inputLabel?: string;
  placeholder?: string;
  borderRadius?: string;
  labelColor?: string;
  validationType?: "letters" | "numbers";
  inputClassName?: string;
  error?: string;
  validationMessage?: string;
  validationRegex?: RegExp;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  onValidationError?: (message: string) => void;
  autoComplete?: string;
  name?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  enterKeyHint?: React.HTMLAttributes<HTMLInputElement>["enterKeyHint"];
};

const GlobalInput = forwardRef<HTMLInputElement, GlobalInputProps>(function GlobalInput(
  {
    id,
    value,
    title,
    error,
    onChange,
    onKeyDown,
    onFocus,
    onBlur,
    disabled,
    className,
    placeholder,
    validationType,
    inputClassName,
    onValidationError,
    width = "100%",
    labelFont = "400",
    bgColor = "transparent",
    type,
    height = "42px",
    labelColor = "#2D2D2D",
    borderRadius = "5px",
    autoComplete,
    name,
    inputMode,
    enterKeyHint,
  },
  ref,
) {
  const [localError, setLocalError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    let errorMessage = "";

    if (inputValue === "") {
      setLocalError(null);
      if (onChange) onChange(e);
      return;
    }

    if (validationType === "letters") {
      if (/[^a-zA-Z\s]/.test(inputValue)) {
        errorMessage = "Letters only (e.g., Name).";
      }
    }

    if (validationType === "numbers") {
      if (!/^\d*(\.\d*)?$/.test(inputValue)) {
        errorMessage = "Only numbers and decimals allowed.";
      }

      if ((inputValue.match(/\./g) || []).length > 1) {
        errorMessage = "Only one decimal point is allowed.";
      }
    }

    if (errorMessage) {
      setLocalError(errorMessage);
      if (onValidationError) {
        onValidationError(errorMessage);
      }
    } else {
      setLocalError(null);
      if (onChange) onChange(e);
    }
  };

  return (
    <div className={`space-y-1 w-full ${className ?? ""}`}>
      {title ? (
        <label style={{ color: labelColor, fontWeight: labelFont }} className="text-[13px]">
          {title}
        </label>
      ) : null}
      <input
        id={id}
        name={name}
        type={type}
        ref={ref}
        value={value}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        onChange={handleInputChange}
        min={type === "number" ? 0 : undefined}
        autoComplete={autoComplete}
        inputMode={inputMode}
        enterKeyHint={enterKeyHint}
        style={{ height: height, width: width, backgroundColor: bgColor, borderRadius: borderRadius }}
        className={`globalinput-placeholder placeholder:text-[15px] text-[15px] text-black autofill:text-[#A6A6A6] placeholder:text-[#020202] border focus:outline-none block placeholder:font-[300] border-[#2E2C39] px-4 ${inputClassName ?? ""}`}
      />
      {(error || localError) && (
        <div className={`${error || localError ? "mb-1" : ""}`}>
          <span className="text-sm text-red-500 px-1">{error || localError}</span>
        </div>
      )}
    </div>
  );
});

export default GlobalInput;
