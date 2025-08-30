"use client"
import React, { useState } from "react";

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
  validationType?: 'letters' | 'numbers';
  inputClassName?: any;
  error?: undefined | any;
  validationMessage?: string;
  validationRegex?: RegExp;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onValidationError?: (message: string) => void;
};

const GlobalInput = ({
  id,
  value,
  ref,
  title,
  error,
  onChange,
  onKeyDown,
  className,
  placeholder,
  validationType,
  inputClassName,
  onValidationError,
  width = "full",
  labelFont = '400',
  bgColor = "transparent",
  type,
  height = "42px",
  labelColor = "#2D2D2D",
}: props) => {

  const [localError, setLocalError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    let errorMessage = '';

    if (inputValue === '') {
      setLocalError(null);
      if (onChange) onChange(e);
      return;
    }

    if (validationType === 'letters') {
      if (/[^a-zA-Z\s]/.test(inputValue)) {
        errorMessage = 'Letters only (e.g., Name).';
      }
    }

    if (validationType === 'numbers') {

      if (!/^\d*(\.\d*)?$/.test(inputValue)) {
        errorMessage = 'Only numbers and decimals allowed.';
      }


      if ((inputValue.match(/\./g) || []).length > 1) {
        errorMessage = 'Only one decimal point is allowed.';
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
    <div className={`space-y-1 w-full ${className}`} >
      <label style={{ color: labelColor, fontWeight: labelFont }} className="text-[13px]">
        {title}
      </label>
      <input
        id={id}
        type={type}
        ref={ref}
        value={value}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        onChange={handleInputChange}
        min={type === "number" ? 0 : undefined}
        style={{ height: height, width: width, backgroundColor: bgColor }}
        className={`globalinput-placeholder placeholder:text-[13px] text-[13px] text-black autofill:text-[#A6A6A6] placeholder:text-[#A6A6A6] rounded-[5px] border focus:outline-none block placeholder:font-[300] border-[#C4C4C4] px-4 ${inputClassName}`}
      />
      {(error || localError) && (
        <div className={`${error || localError ? "mb-1" : ""}`}>
          <span className="text-sm text-red-500 px-1">
            {error || localError}
          </span>
        </div>
      )}
    </div>
  );
};

export default GlobalInput;