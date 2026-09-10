import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaGithub,
} from "react-icons/fa";
import { assets } from "../assets/assets.js";

function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center w-full mt-18 py-10 bg-gradient-to-b from-[#264A1D]/5 to-[#264A1D]/15">
      <div className="flex items-center ">
        <img
          className="hover:bg-[#264A1D]/10 p-2 rounded-2xl cursor-pointer"
          src={assets.logo}
          alt="logo"
        />
      </div>

      {/* Copyright */}
      <p className="mt-4 text-center text-gray-700">
        Copyright © 2026{" "}
        <a href="#" className="underline text-[#264A1D] font-medium hover:text-[#F87C04] transition">
          FarmerCart
        </a>
        . All rights reserved.
      </p>

      {/* Social Icons */}
      <div className="flex items-center gap-6 mt-5 text-2xl">
        <a
          href="#"
          className="hover:-translate-y-0.5 transition-all duration-300 text-blue-600"
        >
          <FaFacebookF />
        </a>
        <a
          href="#"
          className="hover:-translate-y-0.5 transition-all duration-300 text-purple-600"
        >
          <FaInstagram />
        </a>
        <a
          href="#"
          className="hover:-translate-y-0.5 transition-all duration-300 text-blue-400"
        >
          <FaLinkedinIn />
        </a>
        <a
          href="#"
          className="hover:-translate-y-0.5 transition-all duration-300 text-sky-500"
        >
          <FaTwitter />
        </a>
        <a
          href="#"
          className="hover:-translate-y-0.5 transition-all duration-300 text-gray-700"
        >
          <FaGithub />
        </a>
      </div>
    </footer>
  );
}

export default Footer;