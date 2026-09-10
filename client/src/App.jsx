import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { Toaster } from 'react-hot-toast';
import Footer from "./components/Footer";
import { useAppContext } from "./context/AppContext.jsx";
import Login from "./components/Login";
import AllProducts from "./pages/AllProducts";
import ProductCategory from "./pages/ProductCategory";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import AddAddress from "./pages/AddAddress";
import MyOrders from "./pages/MyOrders";
import SellerLayout from "./pages/seller/SellerLayout";
import AddProduct from "./pages/seller/AddProduct";
import ProductList from "./pages/seller/ProductList.jsx";
import Orders from "./pages/seller/Orders.jsx";
import Loading from "./components/Loading.jsx";

function App() {
  const isSellerPath = useLocation().pathname.includes("seller");
  const { showUserLogin, user, setShowUserLogin } = useAppContext();

  const isFarmerOrAdmin = user?.role === 'FARMER' || user?.role === 'ADMIN';

  return (
    <>
      <div className="text-default min-h-screen text-gray-700 bg-white" >
        {isSellerPath ? null : <Navbar/> }
        {showUserLogin ? <Login /> : null }
        <Toaster />
        <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/products" element={<AllProducts/>} />
            <Route path="/products/:category" element={<ProductCategory/>} />
            <Route path="/products/:category/:id" element={<ProductDetails/>} />
            <Route path="/cart" element={<Cart/>} />
            <Route path="/add-address" element={<AddAddress/>} />
            <Route path="/my-orders" element={<MyOrders/>} />
            <Route path="/loader" element={<Loading/>} />
            
            {/* Farmer / Seller Portal Protected by User Role */}
            <Route path="/seller" element={isFarmerOrAdmin ? <SellerLayout /> : <UnauthorizedAccess onLoginClick={() => setShowUserLogin(true)} /> } >
              <Route index element={<AddProduct />} />
              <Route path="product-list" element={<ProductList />} />
              <Route path="orders" element={<Orders />} />
            </Route>
          </Routes>
        </div>
        {!isSellerPath && <Footer />}
      </div>
    </>
  );
}

function UnauthorizedAccess({ onLoginClick }) {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
      <h2 className="text-2xl font-semibold mb-2 text-gray-800">Farmer Access Required</h2>
      <p className="text-gray-500 mb-6">You need to log in with a Farmer account to access the producer dashboard.</p>
      <button onClick={onLoginClick} className="px-6 py-2.5 bg-primary text-white font-medium rounded-full cursor-pointer hover:bg-primary-dull transition">
        Login as Farmer
      </button>
    </div>
  );
}

export default App;