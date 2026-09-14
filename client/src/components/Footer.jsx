import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaGithub,
} from "react-icons/fa";
import { footerLinks } from "../assets/assets.js";
import Logo from "./Logo.jsx";

function Footer() {
  return (
    <footer className="w-full mt-24 border-t border-line bg-bg">
      <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 py-12 grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr_1fr] gap-10">
        <div>
          <Logo />
          <p className="mt-4 text-sm text-gray-600 max-w-[220px]">
            Fresh produce, straight from Nigerian farms to your doorstep.
          </p>
        </div>

        {footerLinks.map((section, i) => (
          <div key={i}>
            <p className="font-medium text-primary mb-3">{section.title}</p>
            <ul className="space-y-2 text-sm text-gray-600">
              {section.links.map((link, j) => (
                <li key={j}>
                  <a href={link.url} className="hover:text-accent transition">
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            © 2026 FarmerCart. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-lg text-primary">
            <a href="#" className="hover:text-accent transition">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-accent transition">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-accent transition">
              <FaLinkedinIn />
            </a>
            <a href="#" className="hover:text-accent transition">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-accent transition">
              <FaGithub />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
