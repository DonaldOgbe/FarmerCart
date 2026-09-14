// client/src/components/Logo.jsx
import React from "react";
import { assets } from '../assets/assets.js'

function Logo({ className = "" }) {
  return (
    <a href="" className={`flex items-center gap-2 ${className}`}>
      <img className="h-9 w-auto" src={assets.logo} alt="" />
      <span className="text-xl font-semibold tracking-tight text-primary">
        FarmerCart
      </span>
    </a>
  );
}

export default Logo;