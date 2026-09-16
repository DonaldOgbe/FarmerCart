import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { FaUser, FaEnvelope, FaLock, FaStore, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import toast from "react-hot-toast";

function Login() {
  const { setShowUserLogin, setUser, axios, navigate, fetchUser } = useAppContext();

  const [state, setState] = useState("login"); // "login" or "register"
  const [role, setRole] = useState("BUYER");    // "BUYER" or "FARMER"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Farmer specific fields
  const [farmName, setFarmName] = useState("");
  const [stateName, setStateName] = useState("");
  const [phone, setPhone] = useState("");

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://farmercart-6d0z.onrender.com";

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      let endpoint = state === "login" ? `${API_BASE_URL}/api/user/login` : `${API_BASE_URL}/api/user/register`;
      
      const payload = state === "login" 
        ? { email, password } 
        : { name, email, password, role, farmName, state: stateName, phone };

      const { data } = await axios.post(endpoint, payload);
      
      if (data.success) {
        setUser(data.user);
        await fetchUser();
        setShowUserLogin(false);
        toast.success(state === "login" ? "Logged in successfully!" : "Account created successfully!");
        
        // If farmer registers, redirect them to the seller dashboard
        if (role === "FARMER" && state === "register") {
          navigate('/seller');
        } else {
          navigate('/');
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div onClick={() => setShowUserLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center text-sm text-gray-600 bg-black/50 p-4">
      <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-10 w-full max-w-md text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white max-h-[90vh] overflow-y-auto" >
        
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">FarmerCart</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {/* Role Selector for Sign Up */}
        {state === "register" && (
          <div className="w-full flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase text-gray-400">Account Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setRole("BUYER")}
                className={`py-2 rounded border font-medium cursor-pointer transition ${role === "BUYER" ? "bg-primary text-white border-primary" : "bg-gray-50 border-gray-200"}`}>
                🛒 Buyer / Customer
              </button>
              <button type="button" onClick={() => setRole("FARMER")}
                className={`py-2 rounded border font-medium cursor-pointer transition ${role === "FARMER" ? "bg-primary text-white border-primary" : "bg-gray-50 border-gray-200"}`}>
                🚜 Farmer / Producer
              </button>
            </div>
          </div>
        )}

        {state === "register" && (
          <div className="w-full">
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
              <input onChange={(e) => setName(e.target.value)} value={name} placeholder="Full Name"
                className="border border-gray-200 rounded w-full pl-10 pr-3 py-2 mt-1 outline-primary focus:ring-2 focus:ring-primary"
                type="text" required />
            </div>
          </div>
        )}

        {/* Extra Fields if Role is FARMER */}
        {state === "register" && role === "FARMER" && (
          <>
            <div className="w-full">
              <div className="relative">
                <FaStore className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <input onChange={(e) => setFarmName(e.target.value)} value={farmName} placeholder="Farm / Business Name"
                  className="border border-gray-200 rounded w-full pl-10 pr-3 py-2 mt-1 outline-primary focus:ring-2 focus:ring-primary"
                  type="text" required />
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-3">
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <input onChange={(e) => setStateName(e.target.value)} value={stateName} placeholder="State (e.g. Oyo)"
                  className="border border-gray-200 rounded w-full pl-10 pr-3 py-2 mt-1 outline-primary focus:ring-2 focus:ring-primary"
                  type="text" required />
              </div>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <input onChange={(e) => setPhone(e.target.value)} value={phone} placeholder="Phone Number"
                  className="border border-gray-200 rounded w-full pl-10 pr-3 py-2 mt-1 outline-primary focus:ring-2 focus:ring-primary"
                  type="text" required />
              </div>
            </div>
          </>
        )}

        <div className="w-full">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
            <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Email Address"
              className="border border-gray-200 rounded w-full pl-10 pr-3 py-2 mt-1 outline-primary focus:ring-2 focus:ring-primary"
              type="email" required />
          </div>
        </div>

        <div className="w-full">
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
            <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Password"
              className="border border-gray-200 rounded w-full pl-10 pr-3 py-2 mt-1 outline-primary focus:ring-2 focus:ring-primary"
              type="password" required />
          </div>
        </div>

        {state === "register" ? (
          <p className="text-xs"> Already have an account?{" "}
            <span onClick={() => setState("login")} className="text-primary font-medium cursor-pointer underline">
              Login here </span>
          </p>
        ) : (
          <p className="text-xs"> Don't have an account?{" "}
            <span onClick={() => setState("register")} className="text-primary font-medium cursor-pointer underline">
              Sign up here </span>
          </p>
        )}

        <button className="bg-primary hover:bg-primary-dull transition-all text-white font-bold w-full py-2.5 rounded-md cursor-pointer mt-2">
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;