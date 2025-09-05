"use client";
import React, { useEffect, useState } from "react";

const ANIM_MS = 1000;
const GAP_MS = 1000;

const AnimatedButton = () => {
  const [hovered, setHovered] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    let startTimeout: ReturnType<typeof setTimeout> | undefined;
    let stopTimeout: ReturnType<typeof setTimeout> | undefined;

    const runCycle = () => {
      setAnimate(true);
      stopTimeout = setTimeout(() => {
        setAnimate(false);
        startTimeout = setTimeout(() => {
          if (hovered) runCycle();
        }, GAP_MS);
      }, ANIM_MS);
    };

    if (hovered) {
      runCycle();
    } else {
      setAnimate(false);
    }

    return () => {
      if (startTimeout) clearTimeout(startTimeout);
      if (stopTimeout) clearTimeout(stopTimeout);
    };
  }, [hovered]);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden flex rounded-full items-center cursor-pointer justify-center transition-colors duration-300 w-[150px] h-[50px]"
      style={{ background: "linear-gradient(90deg, #FF4E94 0%, #8B5CF6 100%)" }}
    >
      <div className="relative h-full flex items-center overflow-hidden">
        <span
          className={`block text-lg text-white ${animate ? "text-slide-once" : ""
            }`}
        >
          Sign up
        </span>
      </div>

      <span className="absolute left-2 top-2 text-white sparkle1">✦</span>
      <span className="absolute right-4 top-2 text-white sparkle2">✦</span>
      <span className="absolute left-10 bottom-1 text-white sparkle3">✦</span>
    </button>
  );
};

export default AnimatedButton;
