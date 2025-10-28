import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../features/Product/productApiSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <p className="text-xl font-semibold text-red-600">
          ❌ Access Denied — Admins Only
        </p>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    categoryId: "",
    images: ["", "", ""],
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required.";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters.";
    }

    if (!formData.price) {
      newErrors.price = "Price is required.";
    } else if (Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0.";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category ID is required.";
    } else if (isNaN(formData.categoryId)) {
      newErrors.categoryId = "Category ID must be a number.";
    }

    formData.images.forEach((img, idx) => {
      if (!img.trim()) {
        newErrors[`image${idx}`] = "Image URL is required.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please correct the highlighted errors.");
      return;
    }

    dispatch(addProduct({ ...formData, price: Number(formData.price) }))
      .unwrap()
      .then(() => {
        toast.success("✅ Product added successfully!");
        setTimeout(() => navigate("/products"), 1500);
      })
      .catch(() => {
        toast.error("❌ Failed to add product. Check your permissions.");
      });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 pt-20 pb-10 px-4 sm:px-6 lg:px-8 mt-6">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-7xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          🛍️ Add New Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Title*</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter product title"
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Price ($)*</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 ${
                errors.price ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter product price"
            />
            {errors.price && (
              <p className="text-sm text-red-500 mt-1">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              rows="3"
              placeholder="Enter product description"
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Category ID*</label>
            <input
              type="number"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 ${
                errors.categoryId ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter category ID (e.g. 1)"
            />
            {errors.categoryId && (
              <p className="text-sm text-red-500 mt-1">{errors.categoryId}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Image URLs*</label>
            {formData.images.map((img, index) => (
              <div key={index} className="mb-3">
                <input
                  type="text"
                  value={img}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 ${
                    errors[`image${index}`]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder={`Image ${index + 1} URL`}
                />
                {errors[`image${index}`] && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors[`image${index}`]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="w-full sm:w-auto bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              ← Back
            </button>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
            >
              {status === "loading" ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>

        {error && (
          <p className="text-center text-red-500 text-sm mt-4">⚠️ {error}</p>
        )}
      </div>
    </div>
  );
};

export default AddProductPage;
