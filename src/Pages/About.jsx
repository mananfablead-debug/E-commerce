'use client';

import React, {
  forwardRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useImperativeHandle,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import ShoppingImage from "../assets/online-shopping-concept/5464026.jpg";

// Utility: combine class names
const cn = (...classes) => classes.filter(Boolean).join(" ");

// RotatingText component
const RotatingText = forwardRef(({
  texts,
  transition = { type: "spring", damping: 30, stiffness: 400 },
  initial = { y: "100%" },
  animate = { y: 0 },
  exit = { y: "-120%" },
  rotationInterval = 2000,
  staggerDuration = 0.02,
  staggerFrom = "last",
  loop = true,
  auto = true,
  mainClassName,
  splitLevelClassName,
  elementLevelClassName,
}, ref) => {
  const [index, setIndex] = useState(0);

  const elements = useMemo(() => {
    const currentText = texts[index];
    const words = currentText.split(" ");
    return words.map((word, i) => ({
      chars: Array.from(word),
      needsSpace: i !== words.length - 1,
    }));
  }, [texts, index]);

  const getDelay = (i, total) =>
    staggerFrom === "last"
      ? (total - 1 - i) * staggerDuration
      : i * staggerDuration;

  const next = useCallback(
    () => setIndex(prev => (prev === texts.length - 1 ? (loop ? 0 : prev) : prev + 1)),
    [texts.length, loop]
  );

  useImperativeHandle(ref, () => ({ next }), [next]);

  useEffect(() => {
    if (!auto) return;
    const interval = setInterval(next, rotationInterval);
    return () => clearInterval(interval);
  }, [next, rotationInterval, auto]);

  return (
    <motion.span className={cn("flex flex-wrap relative", mainClassName)}>
      <span className="sr-only">{texts[index]}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={index} className="flex flex-wrap relative">
          {elements.map((wordObj, wIdx, arr) => {
            const prevChars = arr
              .slice(0, wIdx)
              .reduce((sum, w) => sum + w.chars.length, 0);
            const totalChars = arr.reduce(
              (s, w) => s + w.chars.length,
              0
            );
            return (
              <span key={wIdx} className={cn("inline-flex", splitLevelClassName)}>
                {wordObj.chars.map((char, cIdx) => (
                  <motion.span
                    key={cIdx}
                    initial={initial}
                    animate={animate}
                    exit={exit}
                    transition={{
                      ...transition,
                      delay: getDelay(prevChars + cIdx, totalChars),
                    }}
                    className={cn("inline-block", elementLevelClassName)}
                  >
                    {char}
                  </motion.span>
                ))}
                {wordObj.needsSpace && <span className="whitespace-pre"> </span>}
              </span>
            );
          })}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
});

RotatingText.displayName = "RotatingText";

// About Section
const AboutSection = () => {
  return (
    <section className="text-black px-6 md:px-20 py-16 md:py-20">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8">
        About <span className="text-purple-500">React Shop</span>
      </h2>

      <p className="text-center text-gray-600 text-lg md:text-xl max-w-3xl mx-auto mb-12">
        We provide the best tech products for your everyday needs. Our focus is{" "}
        <RotatingText
          texts={["Quality", "Reliability", "Customer Satisfaction"]}
          mainClassName="text-purple-500 font-semibold flex justify-center"
          staggerFrom="last"
          initial={{ y: "50%" }}
          animate={{ y: 0 }}
          exit={{ y: "-40%" }}
          staggerDuration={0.02}
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          rotationInterval={2000}
        />{" "}
        in every purchase.
      </p>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
        {[
          {
            title: "Fast Shipping",
            desc: "Receive your products quickly and reliably, straight to your door.",
          },
          {
            title: "100% Authentic",
            desc: "All our products are genuine and high quality, from trusted brands.",
          },
          {
            title: "Customer Support",
            desc: "Our team is always ready to help you with questions and support.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-purple-400 transition-transform hover:-translate-y-2"
          >
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Our Story */}
      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 max-w-6xl mx-auto">
        <div className="md:w-1/2 space-y-5">
          <h3 className="text-3xl font-bold">Our Story</h3>
          <p className="text-gray-600 text-lg leading-relaxed">
            React Shop was founded with a passion for technology and a desire to make quality electronics accessible to everyone. Our mission is to provide a seamless shopping experience and build trust with every customer.
          </p>
          <a
            href="#products"
            className="inline-block bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition mt-4"
          >
            Explore Products
          </a>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img
            src={ShoppingImage}
            alt="Tech Shopping"
            className="w-full max-w-md rounded-lg shadow-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
