"use client";
import React, { useState } from "react";
import DateInputWithIcon from "@/components/inputs/DateInputWithIcon";

type props = {
  id?: any;
  ref?: any;
  value?: any;
  type?: string;
  width?: string;
  title?: string;
  className?: any;
  height?: string;
  bgColor?: string;
  labelFont?: string;
  inputLabel?: string;
  placeholder?: string;
  labelColor?: string;
  validationType?: "letters" | "numbers";
  inputClassName?: any;
  error?: undefined | any;
  validationMessage?: string;
  validationRegex?: RegExp;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onKeyDown?: (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onValidationError?: (message: string) => void;
};

const FloatingInput = ({
  id,
  value,
  ref,
  title,
  error,
  onChange,
  onKeyDown,
  className,
  validationType,
  inputClassName,
  onValidationError,
  width = "100%",
  labelFont = "400",
  bgColor = "transparent",
  type,
  height = "50px",
  labelColor = "#2D2D2D",
}: props) => {
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
      if (onValidationError) onValidationError(errorMessage);
    } else {
      setLocalError(null);
      if (onChange) onChange(e);
    }
  };

  if (type === "date") {
    const dateClassName = typeof inputClassName === "string" ? inputClassName : undefined;
    return (
      <div className={`relative w-full ${className ?? ""}`}>
        <DateInputWithIcon
          id={id}
          value={String(value ?? "")}
          onChange={(v) => {
            setLocalError(null);
            if (onChange) {
              onChange({ target: { value: v } } as React.ChangeEvent<HTMLInputElement>);
            }
          }}
          placeholder={title ? String(title) : "Select date"}
          height={height}
          width={width}
          className={dateClassName}
        />
        {(error || localError) && (
          <div className="mt-1">
            <span className="text-sm text-red-500">{error || localError}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`}>
      <input
        id={id}
        type={type}
        ref={ref}
        value={value}
        onKeyDown={onKeyDown}
        placeholder=" "
        onChange={handleInputChange}
        min={type === "number" ? 0 : undefined}
        style={{ height: height, width: width, backgroundColor: bgColor }}
        className={`peer block w-full rounded-md border border-[#2E2C39] px-4 text-[16px] text-black focus:outline-none placeholder-transparent ${inputClassName} autofill:bg-white`}
      />
      <label
        htmlFor={id}
        className={`absolute left-3 bg-white px-1 text-gray-500 transition-all
        top-1/2 -translate-y-1/2 text-[15px]
        peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-[15px] peer-placeholder-shown:text-gray-400
        peer-focus:-top-[1px] peer-focus:text-[14px]
        peer-[&:not(:placeholder-shown)]:top-[-1px] peer-[&:not(:placeholder-shown)]:text-[13px]
        peer-[&:-webkit-autofill]:-top-[1px] peer-[&:-webkit-autofill]:text-[13px]`}
        style={{ color: labelColor, fontWeight: labelFont }}
      >
        {title}
      </label>

      {(error || localError) && (
        <div className="mt-1">
          <span className="text-sm text-red-500">{error || localError}</span>
        </div>
      )}

      <style jsx>{`
        input:-webkit-autofill {
          box-shadow: 0 0 0px 1000px white inset !important;
          -webkit-text-fill-color: #000 !important;
          transition: background-color 9999s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
};

export default FloatingInput;