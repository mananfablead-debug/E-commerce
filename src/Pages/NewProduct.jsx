import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fetchProducts } from "../features/Product/productApiSlice";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

export const NewArrivals = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const { items, status } = useSelector((state) => state.products);

  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [dispatch, status]);

  const uniqueCategoryProducts = [];
  const seenCategories = new Set();

  items.forEach((product) => {
    const categoryName = product.category?.name || "Unknown";
    if (!seenCategories.has(categoryName)) {
      seenCategories.add(categoryName);
      uniqueCategoryProducts.push(product);
    }
  });

  // GSAP animations
  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };
    container.addEventListener("wheel", onWheel, { passive: false });

    const cards = gsap.utils.toArray(".product-card");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none reverse",
        once: true,
      },
    });

    tl.fromTo(
      cards,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      }
    );

    return () => {
      container.removeEventListener("wheel", onWheel);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [uniqueCategoryProducts]);

  return (
    <section
      ref={sectionRef}
      id="new-arrivals"
      aria-label="New Arrival Products"
      className="w-full py-12 "
    >
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center text-purple-700 mb-6">
          New <span className="text-gray-800">Arrivals</span>
        </h2>

        <div
          ref={containerRef}
          className="flex gap-6 overflow-x-scroll scroll-smooth w-full pb-4 mt-5 scrollbar-hide"
        >
          {uniqueCategoryProducts.length === 0 && status === "loading" ? (
            <p className="text-center text-gray-500 w-full py-10">
              Loading products...
            </p>
          ) : (
            uniqueCategoryProducts.map((product) => (
              <div
                key={product.id}
                className="product-card flex-1 min-w-[300px] max-w-[300px] bg-white rounded-2xl overflow-hidden shadow hover:shadow-2xl transition-shadow duration-300 flex-shrink-0 cursor-pointer border border-gray-100 "
                onClick={() => navigate(`/products/${product.id}`)}
                aria-label={`View details for ${product.title}`}
              >
                <img
                  src={
                    Array.isArray(product.images)
                      ? product.images[0]
                      : product.category?.image
                  }
                  alt={product.title}
                  loading="lazy"
                  decoding="async"
                  width="300"
                  height="256"
                  className="w-full h-64 object-cover"
                />
                <div className="p-5 text-center">
                  <h3 className="font-semibold text-lg text-gray-900 truncate">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">
                    {product.category?.name}
                  </p>
                  <p className="text-purple-600 font-bold mb-3">
                    ${product.price.toFixed(2)}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/products/${product.id}`);
                    }}
                    className="bg-purple-600 text-white px-5 py-2 rounded-pill hover:bg-purple-700 transition-transform transform hover:scale-105"
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
