import React, { Suspense } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import data from "../Data/data.json";

const Slider = React.lazy(() => import("react-slick"));

export default function HeroSection() {
  const slides = data.heroSlides;

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    accessibility: true,
    focusOnSelect: true,
    customPaging: (i) => (
      <button
        aria-label={`Go to slide ${i + 1}`}
        className="w-3 h-3 rounded-full bg-purple-500 hover:bg-purple-700 focus:outline-none"
      ></button>
    ),
    appendDots: (dots) => (
      <div className="absolute bottom-6 w-full flex justify-center z-50">
        <ul className="flex gap-3">{dots}</ul>
      </div>
    ),
  };

  return (
    <section
      id="home"
      className="relative w-full h-[90vh] overflow-hidden bg-gray-50"
      aria-label="Hero Section"
    >
      <Suspense fallback={<div className="h-[90vh] bg-gray-200 animate-pulse" />}>
        <Slider {...settings}>
          {slides.map((slide) => (
            <article
              key={slide.id}
              className="relative w-full h-[90vh]"
              aria-labelledby={`slide-title-${slide.id}`}
            >
              <img
                src={slide.image}
                alt={slide.alt || slide.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover brightness-75 transition-transform duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-5">
                <h1
                  id={`slide-title-${slide.id}`}
                  className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg leading-tight"
                >
                  {slide.title}
                </h1>

                <p className="text-base md:text-xl mb-6 max-w-2xl text-gray-200">
                  {slide.subtitle}
                </p>

                <button
                  aria-label={slide.buttonText}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-pill text-lg font-semibold transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-400"
                >
                  {slide.buttonText}
                </button>
              </div>
            </article>
          ))}
        </Slider>
      </Suspense>
    </section>
  );
}
