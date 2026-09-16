import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import { FaTractor } from "react-icons/fa";

const ProductCart = ({ product }) => {
  const { currency, addToCart, removeFromCart, cartItems, navigate } =
    useAppContext();

  const cartQuantity = cartItems[product.id] || 0;

  return (
    product && (
      <div
        onClick={() => {
          navigate(`/products/${product.category.toLowerCase()}/${product.id}`);
          window.scrollTo(0, 0);
        }}
        className="border border-gray-500/40 rounded-md px-3 py-2 bg-gray-50/50 hover:shadow-md transition min-w-26 max-w-46 w-full cursor-pointer flex flex-col justify-between"
      >
        <div>
          <div className="group flex items-center justify-center px-2 py-2">
            <img
              className="group-hover:scale-105 transition max-w-26 md:max-w-36 h-32 object-cover rounded"
              src={product.images[0]}
              alt={product.name}
            />
          </div>

          <div className="text-sm mt-1">
            <p className="text-xs text-primary-dull font-semibold uppercase">
              {product.category}
            </p>
            <p
              className="text-gray-800 font-medium text-base truncate w-full"
              title={product.name}
            >
              {product.name}
            </p>

            {/* Farm Info Badge */}
            <p
              className="text-xs text-gray-500 truncate mt-0.5 flex items-center gap-1.5"
              title={`${product.farmer?.farmName} • ${product.location}`}
            >
              <FaTractor className="text-gray-400 shrink-0" />
              <span>{product.farmer?.farmName || "Local Farm"}</span>
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-400">Per {product.unit}</p>
              <p className="md:text-lg text-base font-semibold text-gray-900">
                {currency}
                {product.offerPrice || product.price}{" "}
                {product.offerPrice && (
                  <span className="text-gray-400 text-xs line-through font-normal">
                    {currency}
                    {product.price}
                  </span>
                )}
              </p>
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              {!cartQuantity ? (
                <button
                  className="flex items-center justify-center cursor-pointer gap-1 bg-primary/10 border border-primary/40 md:w-[72px] w-[60px] h-[32px] rounded text-primary font-medium text-sm hover:bg-primary/20 transition"
                  onClick={() => {
                    if (product.quantity <= 0) {
                      toast.error("Produce out of stock!");
                      return;
                    }
                    addToCart(product.id);
                  }}
                >
                  <img
                    src={assets.cart_icon}
                    alt="cart icon"
                    className="w-3.5"
                  />
                  Add
                </button>
              ) : (
                <div className="flex items-center justify-center gap-1.5 md:w-20 w-16 h-[32px] bg-primary/20 border border-primary text-gray-800 rounded select-none">
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="cursor-pointer text-sm font-bold px-1.5 h-full hover:bg-primary/30"
                  >
                    -
                  </button>
                  <span className="w-4 text-center text-sm font-semibold">
                    {cartQuantity}
                  </span>
                  <button
                    onClick={() => {
                      if (cartQuantity >= product.quantity) {
                        toast.error("Stock limit reached!");
                        return;
                      }
                      addToCart(product.id);
                    }}
                    className="cursor-pointer text-sm font-bold px-1.5 h-full hover:bg-primary/30"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductCart;
