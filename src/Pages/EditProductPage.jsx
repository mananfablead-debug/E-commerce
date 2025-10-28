import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateProduct, fetchProducts } from "../features/Product/productApiSlice";
import { Form, Button, Container, Spinner, Alert } from "react-bootstrap";

const EditProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, status } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    categoryId: "",
    images: ["", "", ""], 
  });

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);


  useEffect(() => {
    const product = items.find((p) => p.id === parseInt(id));
    if (product) {
      const imgs = Array.isArray(product.images)
        ? product.images.slice(0, 3)
        : [product.images];

      setFormData({
        title: product.title,
        price: product.price,
        description: product.description,
        categoryId: product.category.id,
        images: [...imgs, "", "", ""].slice(0, 3), // ensure 3 slots
      });
      setPreview(imgs[0]);
    }
  }, [items, id]);


  if (user?.role !== "admin") {
    return (
      <Container className="mt-5 text-center">
        <Alert variant="danger">Access Denied: Admins only 🚫</Alert>
      </Container>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (index, value) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      newImages[index] = value;
      return { ...prev, images: newImages };
    });
    if (index === 0) setPreview(value); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const validImages = formData.images.filter((url) => url.trim() !== "");
    const updatedData = { ...formData, images: validImages };

    try {
      await dispatch(updateProduct({ id, updatedData })).unwrap();
      navigate("/products");
    } catch (err) {
      setError(err.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (!formData.title) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Loading product...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5 mt-5" style={{ maxWidth: "700px" }}>
      <h2 className="mb-4 text-center text-dark fw-bold">Edit Product</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter product title"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category ID</Form.Label>
          <Form.Control
            type="number"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            placeholder="Enter category ID"
            required
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Product Image URLs</Form.Label>
          {formData.images.map((img, index) => (
            <Form.Control
              key={index}
              type="url"
              value={img}
              onChange={(e) => handleImageChange(index, e.target.value)}
              placeholder={`Image URL ${index + 1} (https://...)`}
              className="mb-2"
            />
          ))}
          {preview && (
            <div className="mt-3 text-center">
              <img
                src={preview}
                alt="Preview"
                className="img-fluid rounded shadow"
                style={{ maxHeight: "200px" }}
              />
            </div>
          )}
        </Form.Group>

        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Updating..." : "Update Product"}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EditProductPage;
