'use client'
import React from "react";
import Image from "next/image";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";

type Props = {
  title: string;
  width?: string;
  font?: string;
  color?: string;
  height?: string;
  icon?: StaticImport | string;
  bgColor?: string;
  loaderColor?: string;
  borderColor?: string;
  borderWidth?: string;
  borderRadius?: string;
  className?: string;
  hover?: {
    bgColor?: string;
    color?: string;
    borderColor?: string;
  };
  aos?: false | string;
  onClick?: (e: React.FormEvent) => void;
  disabled?: boolean;
};

const GlobalButton = ({
  hover,
  width,
  title,
  height = '40px',
  className,
  borderColor,
  borderWidth,
  icon,
  font = "600",
  color = "white",
  borderRadius = '50px',
  bgColor,
  onClick,
  aos = "zoom-in",
  disabled = false,
}: Props) => {

  const defaultGradient = "linear-gradient(90deg, #FF4E94 0%, #8B5CF6 100%)";
  const hoverBgColor = hover?.bgColor || defaultGradient;

  return (
    <div
      {...(aos ? { 'data-aos': aos } : {})}
      style={{
        width,
        color,
        height,
        borderRadius,
        fontWeight: font,
        background: disabled ? '#e5e5e5' : (bgColor || defaultGradient),
        border: `${borderWidth || "0px"} solid ${borderColor || "transparent"}`,
        userSelect: 'none',
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
      className={`gap-2 ${className} flex justify-center items-center text-[15px] max-[540px]:text-[13px] tracking-[0.1px]`}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = hoverBgColor;
          e.currentTarget.style.color = hover?.color || color;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = bgColor || defaultGradient;
          e.currentTarget.style.color = color;
        }
      }}
      onClick={disabled ? undefined : onClick}
    >
      {icon && <Image src={icon} alt="icon" />}
      {title}
    </div>
  );
};

export default GlobalButton;