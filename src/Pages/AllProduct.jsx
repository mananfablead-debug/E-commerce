import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/Product/productApiSlice";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaPlus, FaFilter, FaTimes } from "react-icons/fa";
import { addToWishlist } from "../features/Wishlist/wishlistSlice";
import { fetchProfile } from "../features/Auth/authSlice";
import Pagination from "@mui/material/Pagination";
import LoadingScreen from "../components/LoadingScreen";

export const AllProductsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, status, error } = useSelector((state) => state.products);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const { user } = useSelector((state) => state.auth);

  const [searchCategory, setSearchCategory] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceFilter, setPriceFilter] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 9;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, user]);

  const categories = [
    ...new Set(items.map((item) => item.category?.name || "Unknown")),
  ].filter((cat) =>
    cat.toLowerCase().includes(searchCategory.toLowerCase())
  );

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setPage(1);
  };

  const clearCategories = () => {
    setSelectedCategories([]);
    setPage(1);
  };

  let filteredProducts = items.filter(
    (product) =>
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category?.name)
  );

  if (priceFilter === "lowToHigh") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (priceFilter === "highToLow") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (priceFilter === "0-50") {
    filteredProducts = filteredProducts.filter((p) => p.price <= 50);
  } else if (priceFilter === "50-100") {
    filteredProducts = filteredProducts.filter(
      (p) => p.price > 50 && p.price <= 100
    );
  } else if (priceFilter === "100+") {
    filteredProducts = filteredProducts.filter((p) => p.price > 100);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handleAddToWishlist = (product) => {
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
          : product.category.image,
      })
    );
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 pt-24 pb-16 px-4 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Filter Toggle for Mobile */}
        <div className="flex justify-between items-center md:hidden mb-4">
          <h2 className="text-2xl font-bold text-gray-800">All Products</h2>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-full text-sm hover:bg-purple-700 transition"
          >
            {filterOpen ? <FaTimes /> : <FaFilter />} Filters
          </button>
        </div>

        {/* Sidebar (Filters) */}
        <aside
          className={`${
            filterOpen ? "block" : "hidden"
          } md:block bg-white shadow-md rounded-xl p-5 h-fit md:w-1/4 sticky top-28 transition-all duration-300`}
        >
          <h3 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
            Filters
          </h3>

          {/* Category Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search category..."
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-full text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-2">Categories</h4>
            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
              {categories.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2 px-3 rounded-lg hover:bg-gray-100 transition truncate"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="accent-purple-600 m-2"
                  />
                  <span className="text-sm">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-2">Price Range</h4>
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-full text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="">All Prices</option>
              <option value="lowToHigh">Low to High</option>
              <option value="highToLow">High to Low</option>
              <option value="0-50">$0 - $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100+">$100+</option>
            </select>
          </div>

          <button
            onClick={clearCategories}
            className="w-full bg-purple-600 text-white font-semibold px-4 py-2 rounded-full hover:bg-purple-700 transition"
          >
            Clear Filters
          </button>
        </aside>

        <div className="flex-1">
          <div className="hidden md:flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800">All Products</h2>
            <button
              onClick={() => navigate("/")}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-100 transition"
            >
              ← Back
            </button>
          </div>

          {status === "loading" && (
            <div className="flex justify-center items-center py-20">
              <LoadingScreen />
            </div>
          )}

          {status === "failed" && (
            <p className="text-center text-red-500 font-semibold">{error}</p>
          )}

          {status === "succeeded" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                {paginatedProducts.map((product) => {
                  const isWishlisted = wishlistItems.some(
                    (item) => item.id === product.id
                  );
                  return (
                    <div
                      key={product.id}
                      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-transform hover:-translate-y-1"
                    >
                      <img
                        onClick={() => navigate(`/products/${product.id}`)}
                        src={
                          Array.isArray(product.images)
                            ? product.images[0]
                            : product.category.image
                        }
                        alt={product.title}
                        className="w-full h-56 sm:h-64 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="p-4 text-center">
                        <h3
                          onClick={() => navigate(`/products/${product.id}`)}
                          className="font-semibold text-lg text-gray-900 truncate cursor-pointer"
                        >
                          {product.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-1">
                          {product.category?.name}
                        </p>
                        <p className="text-xl font-bold text-purple-700 mb-3">
                          ${product.price.toFixed(2)}
                        </p>

                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => navigate(`/products/${product.id}`)}
                            className="bg-purple-600 text-white px-3 py-1.5 rounded-pill text-sm hover:bg-purple-700 transition"
                          >
                            Add To Cart
                          </button>
                          <button
                            onClick={() => handleAddToWishlist(product)}
                            className={`px-2.5 py-2 rounded-pill border transition ${
                              isWishlisted
                                ? "bg-red-500 text-white border-red-500"
                                : "border-gray-300 text-gray-500 hover:bg-gray-100"
                            }`}
                          >
                            <FaHeart />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center mt-10">
                <Pagination
                  count={Math.ceil(filteredProducts.length / limit)}
                  page={page}
                  onChange={handlePageChange}
                  color="secondary"
                  size="large"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {user?.role === "admin" && (
        <button
          onClick={() => navigate("/add-product")}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-pill shadow-lg p-3 transition transform hover:scale-110 hover:shadow-purple-400"
          title="Add New Product"
        >
          <FaPlus size={22} />
        </button>
      )}

      {showLoginPrompt && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-2 rounded-lg shadow-lg text-sm animate-bounce">
          Please login to add to wishlist 💜
        </div>
      )}
    </section>
  );
};
