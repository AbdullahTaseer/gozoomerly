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

// Country phone codes mapping
const COUNTRY_PHONE_CODES: Record<string, string> = {
  US: "+1", CA: "+1", GB: "+44", AU: "+61", NZ: "+64",
  IN: "+91", PK: "+92", BD: "+880", LK: "+94", NP: "+977",
  AF: "+93", AE: "+971", SA: "+966", IQ: "+964", IR: "+98",
  IL: "+972", JO: "+962", LB: "+961", SY: "+963", TR: "+90",
  EG: "+20", ZA: "+27", NG: "+234", KE: "+254", ET: "+251",
  GH: "+233", TZ: "+255", UG: "+256", DZ: "+213", MA: "+212",
  TN: "+216", LY: "+218", SD: "+249", SO: "+252", DJ: "+253",
  ER: "+291", SS: "+211", CM: "+237", CD: "+243", CG: "+242",
  CF: "+236", TD: "+235", NE: "+227", ML: "+223", MR: "+222",
  SN: "+221", GM: "+220", GW: "+245", GN: "+224", SL: "+232",
  LR: "+231", CI: "+225", BF: "+226", BJ: "+229", TG: "+228",
  GA: "+241", GQ: "+240", ST: "+239", AO: "+244", ZM: "+260",
  ZW: "+263", BW: "+267", LS: "+266", SZ: "+268", MZ: "+258",
  MG: "+261", MU: "+230", SC: "+248", KM: "+269", YT: "+262",
  RE: "+262", BI: "+257", RW: "+250", MW: "+265", CV: "+238",
  CN: "+86", JP: "+81", KR: "+82", TH: "+66", VN: "+84",
  PH: "+63", ID: "+62", MY: "+60", SG: "+65", MM: "+95",
  KH: "+855", LA: "+856", BN: "+673", TL: "+670", MN: "+976",
  KZ: "+7", UZ: "+998", TJ: "+992", KG: "+996", TM: "+993",
  GE: "+995", AM: "+374", AZ: "+994", BY: "+375", MD: "+373",
  UA: "+380", PL: "+48", CZ: "+420", SK: "+421", HU: "+36",
  RO: "+40", BG: "+359", RS: "+381", HR: "+385", BA: "+387",
  ME: "+382", MK: "+389", AL: "+355", GR: "+30", CY: "+357",
  MT: "+356", IT: "+39", ES: "+34", PT: "+351", FR: "+33",
  BE: "+32", NL: "+31", DE: "+49", AT: "+43", CH: "+41",
  LI: "+423", LU: "+352", IE: "+353", IS: "+354", NO: "+47",
  SE: "+46", DK: "+45", FI: "+358", EE: "+372", LV: "+371",
  LT: "+372", RU: "+7", BR: "+55", MX: "+52", AR: "+54",
  CL: "+56", CO: "+57", PE: "+51", VE: "+58", EC: "+593",
  BO: "+591", PY: "+595", UY: "+598", GY: "+592", SR: "+597",
  GF: "+594", FK: "+500", GS: "+500", AQ: "+672", HM: "+672",
  CC: "+61", CX: "+61", NF: "+672", TV: "+688", KI: "+686",
  NR: "+674", PG: "+675", SB: "+677", VU: "+678", FJ: "+679",
  PW: "+680", TO: "+676", WS: "+685", AS: "+1", GU: "+1",
  MP: "+1", VI: "+1", PR: "+1", DO: "+1", HT: "+509",
  CU: "+53", JM: "+1", BS: "+1", BB: "+1", AG: "+1",
  LC: "+1", VC: "+1", GD: "+1", DM: "+1", KN: "+1",
  TT: "+1", BZ: "+501", CR: "+506", PA: "+507", HN: "+504",
  NI: "+505", SV: "+503", GT: "+502", KY: "+1",
  TC: "+1", AI: "+1", VG: "+1", MS: "+1", BL: "+590",
  MF: "+590", PM: "+508", WF: "+681", PF: "+689", NC: "+687",
  PN: "+870", SH: "+290", AC: "+247", TA: "+290", IO: "+246",
  BV: "+47", SJ: "+47", AX: "+358", FO: "+298", GL: "+299",
  SX: "+1", CW: "+599", BQ: "+599", AW: "+297", AD: "+376",
  MC: "+377", SM: "+378", VA: "+39", GI: "+350", JE: "+44",
  GG: "+44", IM: "+44", XK: "+383", PS: "+970",
  EH: "+212", TW: "+886", HK: "+852", MO: "+853", KP: "+850",
};

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
}) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const lastSentValueRef = useRef<string>("");
  const isInitializedRef = useRef<boolean>(false);

  const countries = Country.getAllCountries();

  // Initialize from value prop if it contains country code (only on mount or external changes)
  useEffect(() => {
    // Calculate what our current full phone would be
    const currentFullPhone = selectedCountryCode && COUNTRY_PHONE_CODES[selectedCountryCode]
      ? `${COUNTRY_PHONE_CODES[selectedCountryCode]}${phoneNumber}`
      : phoneNumber;

    // If the value matches what we last sent, it's our own update - ignore it
    if (value === lastSentValueRef.current) {
      return;
    }

    // Only update if the incoming value is different from what we have
    if (value !== currentFullPhone) {
      if (value) {
        // Check if value starts with a country code
        const matchedCode = Object.entries(COUNTRY_PHONE_CODES).find(([_, code]) =>
          value.startsWith(code)
        );
        if (matchedCode) {
          const [countryIso, code] = matchedCode;
          setSelectedCountryCode(countryIso);
          setPhoneNumber(value.replace(code, "").trim());
        } else if (value.startsWith("+")) {
          // Try to extract country code from value
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
        // Value is empty, reset only on initial mount
        setSelectedCountryCode("");
        setPhoneNumber("");
        isInitializedRef.current = true;
      }
    } else {
      isInitializedRef.current = true;
    }
  }, [value]);

  // Validate and notify parent
  useEffect(() => {
    if (!isInitializedRef.current) {
      return;
    }

    const fullPhone = selectedCountryCode && COUNTRY_PHONE_CODES[selectedCountryCode]
      ? `${COUNTRY_PHONE_CODES[selectedCountryCode]}${phoneNumber}`
      : phoneNumber;

    // Only call onChange if the value actually changed
    if (fullPhone !== lastSentValueRef.current && onChange) {
      lastSentValueRef.current = fullPhone;
      onChange(fullPhone);
    }
  }, [selectedCountryCode, phoneNumber, onChange]);

  // Separate validation effect
  useEffect(() => {
    // Validation
    if (required && !selectedCountryCode) {
      const errorMsg = "Country code is required";
      setLocalError(errorMsg);
      if (onValidationError) {
        onValidationError(errorMsg);
      }
    } else if (required && selectedCountryCode && !phoneNumber.trim()) {
      const errorMsg = "Phone number is required";
      setLocalError(errorMsg);
      if (onValidationError) {
        onValidationError(errorMsg);
      }
    } else if (phoneNumber && !/^[\d\s\-\(\)]+$/.test(phoneNumber)) {
      const errorMsg = "Invalid phone number format";
      setLocalError(errorMsg);
      if (onValidationError) {
        onValidationError(errorMsg);
      }
    } else {
      setLocalError(null);
      if (onValidationError) {
        onValidationError("");
      }
    }
  }, [selectedCountryCode, phoneNumber, required, onValidationError]);

  const handleCountryChange = (countryIso: string) => {
    setSelectedCountryCode(countryIso);
    setLocalError(null);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Only allow digits, spaces, hyphens, and parentheses
    if (inputValue === "" || /^[\d\s\-\(\)]*$/.test(inputValue)) {
      setPhoneNumber(inputValue);
      setLocalError(null);
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
        {/* Country Code Selector */}
        <div className="relative" style={{ width: "120px", flexShrink: 0 }}>
          <Select
            value={selectedCountryCode}
            onValueChange={handleCountryChange}
            required={required}
          >
            <SelectTrigger
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full border bg-white border-[#2E2C39]"
              style={{ height }}
            >
              <SelectValue placeholder="Code">
                {getDisplayValue() || "Select"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              {countries
                .filter((country) => COUNTRY_PHONE_CODES[country.isoCode])
                .map((country) => (
                  <SelectItem key={country.isoCode} value={country.isoCode}>
                    <span className="flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                      <span className="text-gray-500">
                        {COUNTRY_PHONE_CODES[country.isoCode]}
                      </span>
                    </span>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Phone Number Input */}
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
              (error || localError) ? "border-red-500" : ""
            }`}
          />
          <label
            htmlFor={id}
            className={`absolute left-3 bg-white px-1 text-gray-500 transition-all
            top-1/2 -translate-y-1/2 text-[15px]
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-[15px] peer-placeholder-shown:text-gray-400
            peer-focus:-top-[1px] peer-focus:text-[14px]
            peer-[&:not(:placeholder-shown)]:top-[-1px] peer-[&:not(:placeholder-shown)]:text-[13px]
            peer-[&:-webkit-autofill]:-top-[1px] peer-[&:-webkit-autofill]:text-[13px]`}
          >
            {title}
          </label>
        </div>
      </div>

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

export default PhoneInput;
