import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import data from "../Data/data.json";

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
    customPaging: () => (
      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
    ),
    // appendDots: (dots) => (
    //   <div className="absolute bottom-8 w-full flex justify-center z-50">
    //     <ul className="flex gap-2">{dots}</ul>
    //   </div>
    // ),
  };

  return (
    <div className="relative w-full h-[90vh] overflow-hidden" id="home">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id} className="relative w-full h-[90vh]">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover brightness-75"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-5">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl mb-6 max-w-2xl text-gray-200">
                {slide.subtitle}
              </p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-pill text-lg transition-all duration-300 hover:scale-105">
                {slide.buttonText}
              </button>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
