import Slider from "react-slick";
import data from "../Data/data.json";

export const TopBrands = () => {
  const brands = data.topBrands;

  const settings = {
    slidesToShow: 5,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    arrows: false,
    autoplaySpeed: 2000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Top Brands</h2>
        <Slider {...settings}>
          {brands.map((brand) => (
            <div key={brand.id} className="p-4 flex items-center justify-center">
              <img
                src={brand.logo}
                alt={`Brand ${brand.id}`}
                className="h-16 object-contain filter grayscale hover:grayscale-0 transition duration-300"
              />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};
