import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/Material wave loading.json";

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen  text-black">
      <div className="mb-90">
        <Lottie animationData={loadingAnimation} loop={true} />
      </div>
      <p className="text-xl font-semibold animate-pulse text-purple-400">
        Loading, please wait...
      </p>
    </div>
  );
};

export default LoadingScreen;
