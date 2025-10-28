import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import data from "../Data/data.json";

gsap.registerPlugin(ScrollTrigger);

export const NewArrivals = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const newArrivals = data.newArrivals;

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;

    const onWheel = (e) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    };
    container.addEventListener("wheel", onWheel);

    const cards = gsap.utils.toArray(".product-card");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
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
  }, []);

  return (
    <section ref={sectionRef} id="products" className="w-full">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10 p-4">
          New Arrivals
        </h2>

        <div
          ref={containerRef}
          className="flex gap-6 overflow-x-scroll scroll-smooth w-full"
          style={{
            scrollBehavior: "smooth",
            scrollbarWidth: "none",
            msOverflowStyle: "none", 
          }}
        >
          {newArrivals.map((product, index) => (
            <div
              key={index}
              className="product-card flex-1 min-w-[300px] max-w-[300px] bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 flex-shrink-0"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-purple-600 font-bold">{product.price}</p>
                <button className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition duration-300">
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};
