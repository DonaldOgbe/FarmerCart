import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext.jsx";
import { Link, useParams } from "react-router-dom";
import { FaTractor, FaMapMarkerAlt, FaBox } from "react-icons/fa";
import { assets } from "../assets/assets.js";
import ProductCart from "../components/ProductCart.jsx";

const ProductDetails = () => {
  const { products, navigate, currency, addToCart } = useAppContext();
  const { id } = useParams();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  const product = products.find((item) => item.id === id);

  useEffect(() => {
    if (products.length > 0 && product) {
      let productsCopy = products.filter(
        (item) => item.category === product.category && item.id !== product.id,
      );
      setRelatedProducts(productsCopy.slice(0, 5));
    }
  }, [products, product]);

  useEffect(() => {
    setThumbnail(product?.images[0] ? product.images[0] : null);
  }, [product]);

  return product ? (
    <div className="mt-8">
      <p className="text-sm text-gray-500">
        <Link to={"/"} className="hover:underline">
          Home
        </Link>{" "}
        /
        <Link to={"/products"} className="hover:underline">
          {" "}
          Products
        </Link>{" "}
        /
        <Link
          to={`/products/${product.category.toLowerCase()}`}
          className="hover:underline"
        >
          {" "}
          {product.category}
        </Link>{" "}
        /<span className="text-primary-dult font-medium"> {product.name}</span>
      </p>

      <div className="flex flex-col md:flex-row gap-12 mt-6">
        {/* Image Gallery */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-3">
            {product.images.map((image, index) => (
              <div
                key={index}
                onClick={() => setThumbnail(image)}
                className={`border max-w-20 rounded overflow-hidden cursor-pointer ${thumbnail === image ? "border-primary ring-2 ring-primary/30" : "border-gray-300"}`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-20 h-20 object-cover"
                />
              </div>
            ))}
          </div>

          <div className="border border-gray-300 max-w-md w-96 h-96 rounded overflow-hidden flex items-center justify-center bg-gray-50">
            <img
              src={thumbnail}
              alt="Selected product"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="text-sm w-full md:w-1/2">
          <h1 className="text-3xl font-semibold text-gray-800">
            {product.name}
          </h1>

          {/* Farm & Origin Badge */}
          <div className="mt-2 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-md flex flex-col gap-1 text-sm">
            <p className="font-semibold flex items-center gap-2">
              <FaTractor className="text-emerald-600 shrink-0" />
              <span>
                Farm: {product.farmer?.farmName || "Verified Local Farm"}
              </span>
            </p>
            <p className="text-xs text-emerald-700 flex items-center gap-2">
              <FaMapMarkerAlt className="text-emerald-600 shrink-0" />
              <span>
                Origin Location:{" "}
                {product.location || product.farmer?.state || "Nigeria"}
              </span>
            </p>
            <p className="text-xs text-emerald-700 flex items-center gap-2">
              <FaBox className="text-emerald-600 shrink-0" />
              <span>
                Sold per: <strong className="font-bold">{product.unit}</strong>
              </span>
            </p>
          </div>

          <div className="mt-6">
            {product.offerPrice && (
              <p className="text-gray-400 line-through">
                Regular Price: {currency}
                {product.price}
              </p>
            )}
            <p className="text-3xl font-bold text-gray-900">
              Price: {currency}
              {product.offerPrice || product.price}
              <span className="text-sm font-normal text-gray-500 ml-2">
                per {product.unit}
              </span>
            </p>
            <span className="text-xs text-gray-400">
              (inclusive of all taxes & handling)
            </span>
          </div>

          <p className="text-base font-semibold mt-6 text-gray-800">
            Produce Description
          </p>
          <div className="text-gray-600 mt-2 space-y-1 whitespace-pre-line bg-gray-50 p-4 rounded border border-gray-200">
            {product.description}
          </div>

          <div className="flex items-center mt-8 gap-4 text-base">
            <button
              onClick={() => addToCart(product.id)}
              className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800 border border-gray-300 rounded hover:bg-gray-200 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                addToCart(product.id);
                navigate("/cart");
              }}
              className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white rounded hover:bg-primary-dull transition shadow-sm"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="flex flex-col items-center mt-20">
          <div className="flex flex-col items-center w-max">
            <p className="text-2xl font-semibold">Related Produce</p>
            <div className="w-16 h-0.5 bg-primary rounded-full mt-2"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 lg:grid-cols-5 mt-6 w-full">
            {relatedProducts
              .filter((p) => p.inStock)
              .map((p) => (
                <ProductCart key={p.id} product={p} />
              ))}
          </div>
        </div>
      )}
    </div>
  ) : null;
};

export default ProductDetails;
