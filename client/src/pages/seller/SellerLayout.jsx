import React from "react";
import { useAppContext } from "../../context/AppContext.jsx";
import { assets } from "../../assets/assets.js";
import { Link, NavLink, Outlet } from "react-router-dom";
import toast from "react-hot-toast";
import Logo from "../../components/Logo.jsx";

function SellerLayout() {
  const { setUser, navigate, axios, user } = useAppContext();

  const sidebarLinks = [
    { name: "Add Produce", path: "/seller", icon: assets.add_icon },
    {
      name: "Produce List",
      path: "/seller/product-list",
      icon: assets.product_list_icon,
    },
    { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
  ];

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
        <Link to="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-5 text-gray-500">
          <p>Hi, {user?.farmName || user?.name || "Farmer"}!</p>
          <button
            onClick={logout}
            className="border rounded-full text-sm px-4 py-1 cursor-pointer hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex">
        <div className="md:w-64 w-16 border-r h-[95vh] text-base border-gray-300 pt-4 flex flex-col">
          {sidebarLinks.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === "/seller"}
              className={({ isActive }) => `flex items-center py-3 px-4 gap-3 
                            ${
                              isActive
                                ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary-dull"
                                : "hover:bg-gray-100/90 border-white"
                            }`}
            >
              <img src={item.icon} alt="icon" className="w-7 h-7" />
              <p className="md:block hidden text-center">{item.name}</p>
            </NavLink>
          ))}
        </div>
        <Outlet />
      </div>
    </>
  );
}

export default SellerLayout;
