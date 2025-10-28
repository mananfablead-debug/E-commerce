import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../features/Product/productApiSlice";
import { FaHeart } from "react-icons/fa";
import { addToWishlist } from "../features/Wishlist/wishlistSlice";

export const ProductsSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status, error } = useSelector((state) => state.products);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  const displayedProducts = items.slice(0, 6);

  const toggleWishlist = (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 2000);
      return;
    }

    dispatch(
      addToWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        image: Array.isArray(product.images)
          ? product.images[0]
          : product.images,
      })
    );
  };

  return (
    <section id="products" className="mt-5">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Our Products
        </h2>

        {status === "loading" && (
          <p className="text-center text-gray-500 animate-pulse">
            Loading products...
          </p>
        )}

        {status === "failed" && (
          <p className="text-center text-red-500">Error: {error}</p>
        )}

        {status === "succeeded" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-5">
              {displayedProducts.map((product) => {
                const isWishlisted = wishlistItems.some(
                  (item) => item.id === product.id
                );

                return (
                  <div
                    key={product.id}
                    className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="overflow-hidden">
                      <img
                        src={
                          Array.isArray(product.images)
                            ? product.images[0]
                            : product.images
                        }
                        alt={product.title}
                        className="w-full h-64 object-cover rounded-t-2xl transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    <div className="p-5 text-center">
                      <h3 className="font-semibold text-lg text-gray-800 truncate">
                        {product.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 capitalize">
                        {product.category?.name || product.category}
                      </p>
                      <p className="mt-3 text-xl font-bold text-purple-600">
                        ${product.price.toFixed(2)}
                      </p>

                      <div className="mt-5 flex items-center justify-center gap-3">
                        <button onClick={() => navigate("/products")} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 px-6 rounded-pill font-medium shadow-md hover:from-pink-500 hover:to-purple-600 transition-all duration-300">
                          Add to Cart
                        </button>
                        <button
                          onClick={() => toggleWishlist(product)}
                          className={`p-3 rounded-pill border ${
                            isWishlisted
                              ? "bg-red-500 text-white border-red-500 scale-110"
                              : "border-gray-200 text-gray-400 hover:bg-red-500 hover:text-white"
                          } transition-all duration-300`}
                          title={
                            isWishlisted
                              ? "Remove from Wishlist"
                              : "Add to Wishlist"
                          }
                        >
                          <FaHeart size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {items.length > 5 && (
              <div className="text-center mt-14">
                <button
                  onClick={() => navigate("/products")}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2.5 rounded-pill font-semibold shadow-md hover:from-pink-500 hover:to-purple-600 transition-all duration-300"
                >
                  See All Products
                </button>
              </div>
            )}
          </>
        )}

        {showLoginPrompt && (
          <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-bounce">
            Please login to add items to wishlist 💜
          </div>
        )}
      </div>
    </section>
  );
};
