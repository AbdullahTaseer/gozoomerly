import React from "react";
import Image from "next/image";

import AppLogo from "@/assets/svgs/Zoomerly.svg";
import GlobalButton from "../buttons/GlobalButton";

const Footer = () => {
  return (
    <footer className="bg-[#18171F] text-white py-10 px-[4%] mt-6">
      <div className="grid grid-cols-3 max-[900px]:grid-cols-2 max-[500px]:grid-cols-1 gap-8 mx-auto">

        <div className="max-[900px]:col-span-2 max-[500px]:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Image src={AppLogo} alt="Logo" />
          </div>
          <p className="text-[#C4C4C4] leading-relaxed">
            Zoomerly creates interactive boards for celebrations. Collect wishes, photos, and videos for every occasion.
          </p>
        </div>

        <div className="pl-20 max-[900px]:pl-0">
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-[#C4C4C4]">
            <li>About</li>
            <li>Contact</li>
            <li>Terms</li>
            <li>Privacy Policy</li>
            <li>FAQs</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Stay Updated</h4>
          <p className="text-[#C4C4C4] mb-4">Subscribe for updates</p>
          <div className="flex max-w-[300px] items-center p-1 bg-transparent border border-[#333] rounded-full overflow-hidden">
            <input
              type="email"
              placeholder="Your email"
              className="bg-transparent px-4 py-2 outline-none text-white w-full"
            />
            <GlobalButton title="Submit" width="120px" />
          </div>
        </div>
      </div>

      <div className="border-t border-[#2A2933] mt-10 pt-6 text-center text-sm text-[#888]">
        © 2024 birthday text. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;