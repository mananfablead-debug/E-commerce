import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FaHeart,
  FaShoppingCart,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import { addToCart } from "../features/cart/cartSlice";
import { addToWishlist } from "../features/Wishlist/wishlistSlice";
import { deleteProduct } from "../features/Product/productApiSlice"; 
import { Modal, Button } from "react-bootstrap"; 

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items } = useSelector((state) => state.products);
  const { token, user } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const cartItems = useSelector((state) => state.cart.items);

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); 
  const [selectedSize, setSelectedSize] = useState("M");

  useEffect(() => {
    const selectedProduct = items.find((p) => p.id === parseInt(id));
    if (selectedProduct) {
      setProduct(selectedProduct);
      setMainImage(
        Array.isArray(selectedProduct.images)
          ? selectedProduct.images[0]
          : selectedProduct.images
      );
    }
  }, [id, items]);

  if (!product)
    return <p className="text-center mt-10 text-gray-700">Loading product...</p>;

  const inCart = cartItems.some(
    (item) => item.id === product.id && item.size === selectedSize
  );

  const handleAddToCart = () => {
    if (!token) return setShowLoginModal(true);

    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: mainImage,
        size: selectedSize,
      })
    );
  };

 const handleDirectAddTocart = () => {
    if(!token) return setShowLoginModal(true);

    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: mainImage,
        size: selectedSize,
      }),
      navigate("/cart")
    )
  }

  const handleAddToWishlist = () => {
    if (!token) return setShowLoginModal(true);

    dispatch(
      addToWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        image: mainImage,
      })
    );
  };

  const handleDelete = () => {
    dispatch(deleteProduct(product.id))
      .unwrap()
      .then(() => {
        setShowDeleteModal(false);
        navigate("/products");
      })
      .catch((err) => {
        console.error("Error deleting product:", err);
      });
  };

  return (
    <div className="min-h-screen text-black py-12 px-6 md:px-20 mt-19">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex gap-6 md:w-1/2">
          <div className="flex flex-col gap-4">
            {Array.isArray(product.images) &&
              product.images.slice(0, 3).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`thumb-${index}`}
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                    mainImage === img
                      ? "border-purple-500"
                      : "border-transparent"
                  }`}
                />
              ))}
          </div>
          <div className="flex-1">
            <img
              src={mainImage}
              alt={product.title}
              className="w-full h-[500px] object-cover rounded-xl shadow-lg"
            />
          </div>
        </div>

        <div className="md:w-1/2 flex flex-col justify-between space-y-6">
          <div>
            <h2 className="text-4xl font-bold mb-3">{product.title}</h2>
            <p className="text-purple-600 text-3xl font-semibold mb-4">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-gray-800 mb-6">{product.description}</p>

            <div className="mb-6">
              <p className="block mb-2 text-gray-500 font-semibold">
                Select Size:
              </p>
              <div className="flex gap-3">
                {["S", "M", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 flex items-center justify-center rounded-pill border-2 font-semibold transition-colors ${
                      selectedSize === size
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-gray-100 text-gray-700 border-gray-300 hover:border-purple-500 hover:text-purple-600"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
              {inCart ? (
                <button
                  onClick={() => navigate("/cart")}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 w-full rounded-pill hover:bg-green-700 transition font-semibold shadow-lg"
                >
                  Go to Cart
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 bg-yellow-600 text-white px-6 py-3 w-full rounded-pill hover:bg-yellow-700 transition font-semibold shadow-lg"
                >
                  <FaShoppingCart /> Add to Cart
                </button>
              )}
              <button
                onClick={handleDirectAddTocart}
                className="flex items-center justify-center gap-2 bg-orange-600 text-white px-1 py-3 w-full rounded-pill hover:bg-orange-700 transition font-semibold shadow-lg"
              >
                Buy Now
              </button>
              <button
                onClick={handleAddToWishlist}
                className="p-3 rounded-pill border border-purple-500 hover:bg-purple-700 transition shadow"
              >
                <FaHeart className="text-purple-500 text-xl" />
              </button>
            </div>

            {user?.role === "admin" && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => navigate(`/edit-product/${product.id}`)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-pill transition shadow"
                >
                  <FaEdit /> Edit Product
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-pill transition shadow"
                >
                  <FaTrash /> Delete Product
                </button>
              </div>
            )}
          </div>
        </div>
      </div>


      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You must be logged in to add items to your cart or wishlist.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => navigate("/login")}>
            Go to Login
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to permanently delete{" "}
          <strong>{product.title}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductDetailPage;
