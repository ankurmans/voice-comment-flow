
import { useEffect, useState } from "react";

interface ScrollingHeadlineProps {
  headlines: string[];
  interval?: number; // Time in ms between headline changes
}

export const ScrollingHeadline = ({
  headlines,
  interval = 3000,
}: ScrollingHeadlineProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % headlines.length);
        setIsAnimating(false);
      }, 500); // Animation duration
    }, interval);

    return () => clearInterval(timer);
  }, [headlines.length, interval]);

  return (
    <div className="h-24 flex items-center justify-center overflow-hidden">
      <h1 
        className={`text-3xl md:text-4xl lg:text-5xl font-extrabold text-center transition-all duration-500 ease-in-out ${
          isAnimating ? "opacity-0 -translate-y-8" : "opacity-100 translate-y-0"
        }`}
      >
        {headlines[currentIndex]}
      </h1>
    </div>
  );
};
