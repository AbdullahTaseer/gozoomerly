"use client";

import React from "react";
import { Facebook, Linkedin, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#18171F] text-white border-t border-white/10 mt-8">
      <div className="px-[5%] max-[769px]:px-4 py-6 flex flex-row max-[768px]:flex-col gap-4 max-[768px]:gap-3 items-center justify-between max-[768px]:text-center">
        <p className="text-whitetext-sm">
          © 2025 zoomerly | All rights reserved
        </p>

        <div className="flex items-center gap-3">
          <a
            href="#"
            aria-label="Facebook"
            className="w-10 h-10 rounded-full bg-[#15141B] flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <Facebook className="w-5 h-5 text-white" />
          </a>
          <a
            href="#"
            aria-label="LinkedIn"
            className="w-10 h-10 rounded-full bg-[#15141B] flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <Linkedin className="w-5 h-5 text-white" />
          </a>
          <a
            href="#"
            aria-label="Twitter"
            className="w-10 h-10 rounded-full bg-[#15141B] flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <Twitter fill="white" className="w-5 h-5 text-white" />
          </a>
          <a
            href="#"
            aria-label="YouTube"
            className="w-10 h-10 rounded-full bg-[#15141B] flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <Youtube className="w-5 h-5 text-white" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;