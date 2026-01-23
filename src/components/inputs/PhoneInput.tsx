"use client";
import React, { useState, useEffect, useRef } from "react";
import { Country } from "country-state-city";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { COUNTRY_PHONE_CODES } from "@/lib/MockData";
import { Search } from "lucide-react";

interface PhoneInputProps {
  id?: string;
  title?: string;
  value?: string;
  onChange?: (value: string) => void;
  onValidationError?: (message: string) => void;
  error?: string;
  className?: string;
  width?: string;
  height?: string;
  required?: boolean;
  placeholder?: string;
  validateOnMount?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  id,
  title = "Phone Number",
  value = "",
  onChange,
  onValidationError,
  error,
  className = "",
  width = "100%",
  height = "50px",
  required = false,
  placeholder,
  validateOnMount = false,
}) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [shouldShowValidation, setShouldShowValidation] = useState(false);
  const lastSentValueRef = useRef<string>("");
  const isInitializedRef = useRef<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const countries = Country.getAllCountries();
  
  const filteredCountries = countries.filter((country) => {
    if (!COUNTRY_PHONE_CODES[country.isoCode]) return false;
    if (!countrySearchQuery.trim()) return true;
    const query = countrySearchQuery.toLowerCase();
    return (
      country.name.toLowerCase().includes(query) ||
      COUNTRY_PHONE_CODES[country.isoCode].includes(query) ||
      country.isoCode.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    const currentFullPhone = selectedCountryCode && COUNTRY_PHONE_CODES[selectedCountryCode]
      ? `${COUNTRY_PHONE_CODES[selectedCountryCode]}${phoneNumber}`
      : phoneNumber;

    if (value === lastSentValueRef.current) {
      return;
    }

    if (value !== currentFullPhone) {
      if (value) {
        const matchedCode = Object.entries(COUNTRY_PHONE_CODES).find(([_, code]) =>
          value.startsWith(code)
        );
        if (matchedCode) {
          const [countryIso, code] = matchedCode;
          setSelectedCountryCode(countryIso);
          setPhoneNumber(value.replace(code, "").trim());
        } else if (value.startsWith("+")) {
          const codeMatch = value.match(/^\+(\d{1,3})/);
          if (codeMatch) {
            const code = `+${codeMatch[1]}`;
            const country = Object.entries(COUNTRY_PHONE_CODES).find(
              ([_, c]) => c === code
            );
            if (country) {
              setSelectedCountryCode(country[0]);
              setPhoneNumber(value.replace(code, "").trim());
            } else {
              setPhoneNumber(value);
            }
          } else {
            setPhoneNumber(value);
          }
        } else {
          setPhoneNumber(value);
        }
      } else if (!isInitializedRef.current) {
        setSelectedCountryCode("");
        setPhoneNumber("");
        isInitializedRef.current = true;
      }
    } else {
      isInitializedRef.current = true;
    }
  }, [value]);

  useEffect(() => {
    if (!isInitializedRef.current && !phoneNumber && !selectedCountryCode) {
      return;
    }

    if (!isInitializedRef.current && (phoneNumber || selectedCountryCode)) {
      isInitializedRef.current = true;
    }

    const fullPhone = selectedCountryCode && COUNTRY_PHONE_CODES[selectedCountryCode]
      ? `${COUNTRY_PHONE_CODES[selectedCountryCode]}${phoneNumber}`
      : phoneNumber;

    if (fullPhone !== lastSentValueRef.current && onChange) {
      lastSentValueRef.current = fullPhone;
      onChange(fullPhone);
    }
  }, [selectedCountryCode, phoneNumber, onChange]);

  useEffect(() => {
    if (validateOnMount) {
      setShouldShowValidation(true);
    }
  }, [validateOnMount]);

  const validate = (force = false) => {
    if (!force && !shouldShowValidation) {
      if (!required) {
        if (onValidationError) {
          onValidationError("");
        }
        return;
      }
      return;
    }

    if (!required) {
      setLocalError(null);
      if (onValidationError) {
        onValidationError("");
      }
      return;
    }

    if (!selectedCountryCode) {
      const errorMsg = "Country code is required";
      setLocalError(errorMsg);
      if (onValidationError) {
        onValidationError(errorMsg);
      }
      return;
    }

    if (!phoneNumber.trim()) {
      const errorMsg = "Phone number is required";
      setLocalError(errorMsg);
      if (onValidationError) {
        onValidationError(errorMsg);
      }
      return;
    }

    if (!/^[\d\s\-\(\)]+$/.test(phoneNumber)) {
      const errorMsg = "Invalid phone number format";
      setLocalError(errorMsg);
      if (onValidationError) {
        onValidationError(errorMsg);
      }
      return;
    }

    setLocalError(null);
    if (onValidationError) {
      onValidationError("");
    }
  };

  useEffect(() => {
    if (shouldShowValidation) {
      validate(true);
    }
  }, [selectedCountryCode, phoneNumber, required, onValidationError, shouldShowValidation]);

  useEffect(() => {
    if (validateOnMount) {
      validate(true);
    }
  }, [validateOnMount]);

  const handleCountryChange = (countryIso: string) => {
    setSelectedCountryCode(countryIso);
    if (shouldShowValidation) {
      setLocalError(null);
    }
    setCountrySearchQuery("");
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setCountrySearchQuery("");
    }
  }, [isOpen]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === "" || /^[\d\s\-\(\)]*$/.test(inputValue)) {
      setPhoneNumber(inputValue);
      if (shouldShowValidation) {
        setLocalError(null);
      }
    }
  };

  const getDisplayValue = () => {
    if (selectedCountryCode && COUNTRY_PHONE_CODES[selectedCountryCode]) {
      const country = countries.find((c) => c.isoCode === selectedCountryCode);
      return country ? `${country.flag} ${COUNTRY_PHONE_CODES[selectedCountryCode]}` : "";
    }
    return "";
  };

  return (
    <div className={`w-full ${className}`} style={{ width }}>
      <div className="flex gap-2">
        <div className="relative" style={{ width: "120px", flexShrink: 0 }}>
          <Select
            value={selectedCountryCode}
            onValueChange={handleCountryChange}
            required={required}
            open={isOpen}
            onOpenChange={setIsOpen}
          >
            <SelectTrigger
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full border bg-white border-[#2E2C39]"
              style={{ height }}
            >
              <SelectValue placeholder="Code" className="text-black">
                {getDisplayValue() || "Code"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[400px]">
              <div className="p-2 border-b border-gray-200 sticky top-0 bg-white z-10">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={countrySearchQuery}
                    onChange={(e) => {
                      e.stopPropagation();
                      setCountrySearchQuery(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === "Escape") {
                        setIsOpen(false);
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Search country..."
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="overflow-y-auto max-h-[280px]">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <SelectItem
                      key={country.isoCode}
                      value={country.isoCode}
                      className="cursor-pointer"
                    >
                      <span className="flex items-center gap-2 w-full">
                        <span>{country.flag}</span>
                        <span className="flex-1">{country.name}</span>
                        <span className="text-gray-500 text-xs">
                          {COUNTRY_PHONE_CODES[country.isoCode]}
                        </span>
                      </span>
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-3 py-4 text-center text-sm text-gray-500">
                    No countries found
                  </div>
                )}
              </div>
            </SelectContent>
          </Select>
        </div>

        <div className="relative flex-1">
          <input
            id={id}
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder || " "}
            required={required && !!selectedCountryCode}
            style={{ height, width: "100%" }}
            className={`peer block w-full rounded-md border border-[#2E2C39] px-4 text-[16px] text-black focus:outline-none placeholder-transparent autofill:bg-white ${
              (error || (localError && shouldShowValidation)) ? "border-black" : ""
            }`}
          />
          <label
            htmlFor={id}
            className={`absolute left-3 bg-white px-1 text-black transition-all
            top-1/2 -translate-y-1/2 text-[15px]
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-[15px] peer-placeholder-shown:text-black
            peer-focus:-top-[1px] peer-focus:text-[14px]
            peer-[&:not(:placeholder-shown)]:top-[-1px] peer-[&:not(:placeholder-shown)]:text-[13px]
            peer-[&:-webkit-autofill]:-top-[1px] peer-[&:-webkit-autofill]:text-[13px]`}
          >
            {title}
          </label>
        </div>
      </div>

      {((error && shouldShowValidation) || (localError && shouldShowValidation)) && (
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

export default PhoneInput;
