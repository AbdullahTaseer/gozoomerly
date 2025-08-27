"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import confetti from "canvas-confetti";

export interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  origin?: { x: number; y: number };
  colors?: string[];
  shapes?: ('circle' | 'square' | 'star')[];
  scalar?: number;
  startVelocity?: number;
  decay?: number;
  gravity?: number;
  drift?: number;
  ticks?: number;
  angle?: number;
}

export interface ConfettiProps {
  autoFire?: boolean;
  autoFireDelay?: number;
  showButton?: boolean;
  buttonText?: string;
  buttonPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  buttonClassName?: string;
  onConfettiComplete?: () => void;
  options?: ConfettiOptions;
  className?: string;
  style?: React.CSSProperties;
  triggerOnScroll?: boolean;
  scrollThreshold?: number;
}

const Confetti: React.FC<ConfettiProps> = ({
  autoFire = true,
  autoFireDelay = 300,
  showButton = false,
  buttonText = "🎉 Celebrate!",
  buttonPosition = 'top-right',
  buttonClassName = "",
  onConfettiComplete,
  options = {},
  className = "",
  style = {},
  triggerOnScroll = false,
  scrollThreshold = 0.3
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  const defaultOptions = useMemo<ConfettiOptions>(() => ({
    particleCount: 60,
    spread: 70,
    origin: { y: 0.6, x: 0.5 },
    colors: ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#9370DB', '#32CD32', '#FF4500', '#1E90FF'],
    shapes: ['circle', 'square'],
    scalar: 1.2,
    startVelocity: 45,
    decay: 0.9,
    gravity: 1,
    drift: 0,
    ticks: 200,
    ...options
  }), [options]);

  const fireConfetti = useCallback((customOptions?: ConfettiOptions) => {
    if (hasTriggered) return; // Prevent multiple triggers

    setHasTriggered(true);
    const finalOptions = { ...defaultOptions, ...customOptions };

    // Main explosion from center with ultra-wide spread
    confetti({
      ...finalOptions,
      spread: 120, // Ultra-wide spread to cover beyond component boundaries
      origin: { y: 0.6, x: 0.5 }
    });

    // Far left burst to cover left empty space
    setTimeout(() => {
      confetti({
        particleCount: Math.floor((finalOptions.particleCount || 100) * 0.4),
        angle: 30,
        spread: 70,
        origin: { y: 0.6, x: -0.1 }, // Start from beyond left edge
        colors: finalOptions.colors,
        startVelocity: 45,
        decay: 0.9,
        gravity: 1
      });
    }, 200);

    // Far right burst to cover right empty space
    setTimeout(() => {
      confetti({
        particleCount: Math.floor((finalOptions.particleCount || 100) * 0.4),
        angle: 150,
        spread: 70,
        origin: { y: 0.6, x: 1.1 }, // Start from beyond right edge
        colors: finalOptions.colors,
        startVelocity: 45,
        decay: 0.9,
        gravity: 1
      });
    }, 400);

    // Left edge burst for left coverage
    setTimeout(() => {
      confetti({
        particleCount: Math.floor((finalOptions.particleCount || 100) * 0.3),
        angle: 60,
        spread: 60,
        origin: { y: 0.6, x: 0.05 }, // Start from very left edge
        colors: finalOptions.colors,
        startVelocity: 40,
        decay: 0.9,
        gravity: 1
      });
    }, 300);

    // Right edge burst for right coverage
    setTimeout(() => {
      confetti({
        particleCount: Math.floor((finalOptions.particleCount || 100) * 0.3),
        angle: 120,
        spread: 60,
        origin: { y: 0.6, x: 0.95 }, // Start from very right edge
        colors: finalOptions.colors,
        startVelocity: 40,
        decay: 0.9,
        gravity: 1
      });
    }, 500);

    // Additional center-left burst
    setTimeout(() => {
      confetti({
        particleCount: Math.floor((finalOptions.particleCount || 100) * 0.25),
        angle: 75,
        spread: 50,
        origin: { y: 0.6, x: 0.25 },
        colors: finalOptions.colors,
        startVelocity: 35,
        decay: 0.9,
        gravity: 1
      });
    }, 350);

    // Additional center-right burst
    setTimeout(() => {
      confetti({
        particleCount: Math.floor((finalOptions.particleCount || 100) * 0.25),
        angle: 105,
        spread: 50,
        origin: { y: 0.6, x: 0.75 },
        colors: finalOptions.colors,
        startVelocity: 35,
        decay: 0.9,
        gravity: 1
      });
    }, 450);

    // Call completion callback after all animations finish
    if (onConfettiComplete) {
      const totalDuration = 500 + (finalOptions.ticks || 200) * 16; // Convert ticks to milliseconds
      setTimeout(onConfettiComplete, totalDuration);
    }
  }, [hasTriggered, defaultOptions, onConfettiComplete]);

  // Separate function for manual button clicks that always works
  const handleButtonClick = useCallback(() => {
    const finalOptions = { ...defaultOptions, ...options };

    // Main explosion from center with ultra-wide spread
    confetti({
      ...finalOptions,
      spread: 120, // Ultra-wide spread to cover beyond component boundaries
      origin: { y: 0.6, x: 0.5 }
    });

    // Far left burst to cover left empty space
    setTimeout(() => {
      confetti({
        particleCount: Math.floor((finalOptions.particleCount || 100) * 0.4),
        angle: 30,
        spread: 70,
        origin: { y: 0.6, x: -0.1 }, // Start from beyond left edge
        colors: finalOptions.colors,
        startVelocity: 45,
        decay: 0.9,
        gravity: 1
      });
    }, 200);

    // Far right burst to cover right empty space
    setTimeout(() => {
      confetti({
        particleCount: Math.floor((finalOptions.particleCount || 100) * 0.4),
        angle: 150,
        spread: 70,
        origin: { y: 0.6, x: 1.1 }, // Start from beyond right edge
        colors: finalOptions.colors,
        startVelocity: 45,
        decay: 0.9,
        gravity: 1
      });
    }, 400);

    // Left edge burst for left coverage
    setTimeout(() => {
      confetti({
        particleCount: Math.floor((finalOptions.particleCount || 100) * 0.3),
        angle: 60,
        spread: 60,
        origin: { y: 0.6, x: 0.05 }, // Start from very left edge
        colors: finalOptions.colors,
        startVelocity: 40,
        decay: 0.9,
        gravity: 1
      });
    }, 300);

    // Right edge burst for right coverage
    setTimeout(() => {
      confetti({
        particleCount: Math.floor((finalOptions.particleCount || 100) * 0.3),
        angle: 120,
        spread: 60,
        origin: { y: 0.6, x: 0.95 }, // Start from very right edge
        colors: finalOptions.colors,
        startVelocity: 40,
        decay: 0.9,
        gravity: 1
      });
    }, 500);

    // Additional center-left burst
    setTimeout(() => {
      confetti({
        particleCount: Math.floor((finalOptions.particleCount || 100) * 0.25),
        angle: 75,
        spread: 50,
        origin: { y: 0.6, x: 0.25 },
        colors: finalOptions.colors,
        startVelocity: 35,
        decay: 0.9,
        gravity: 1
      });
    }, 350);

    // Additional center-right burst
    setTimeout(() => {
      confetti({
        particleCount: Math.floor((finalOptions.particleCount || 100) * 0.25),
        angle: 105,
        spread: 50,
        origin: { y: 0.6, x: 0.75 },
        colors: finalOptions.colors,
        startVelocity: 35,
        decay: 0.9,
        gravity: 1
      });
    }, 450);

    // Call completion callback after all animations finish
    if (onConfettiComplete) {
      const totalDuration = 500 + (finalOptions.ticks || 200) * 16; // Convert ticks to milliseconds
      setTimeout(onConfettiComplete, totalDuration);
    }
  }, [defaultOptions, options, onConfettiComplete]);

  // Intersection Observer for scroll-triggered confetti
  useEffect(() => {
    if (!triggerOnScroll || !containerRef.current) return;

    const currentContainer = containerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggered) {
            // Trigger confetti when component comes into view
            setTimeout(() => fireConfetti(), autoFireDelay);
          } else if (!entry.isIntersecting) {
            // Reset trigger state when component goes out of view
            setHasTriggered(false);
          }
        });
      },
      {
        threshold: scrollThreshold,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before fully in view
      }
    );

    observer.observe(currentContainer);

    return () => {
      observer.unobserve(currentContainer);
    };
  }, [triggerOnScroll, scrollThreshold, autoFireDelay, hasTriggered, fireConfetti]);

  // Auto-fire on mount (if not scroll-triggered)
  useEffect(() => {
    if (!autoFire || triggerOnScroll || hasTriggered) return;

    // Trigger confetti after component mounts
    const timer = setTimeout(() => fireConfetti(), autoFireDelay);
    return () => clearTimeout(timer);
  }, [autoFire, autoFireDelay, triggerOnScroll, hasTriggered, fireConfetti]);

  const getButtonPositionClasses = () => {
    switch (buttonPosition) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <div ref={containerRef} className={`absolute inset-0 pointer-events-none ${className}`} style={style}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ position: 'absolute' }}
      />
      {showButton && (
        <button
          onClick={() => handleButtonClick()}
          className={`absolute z-20 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 pointer-events-auto ${getButtonPositionClasses()} ${buttonClassName}`}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default Confetti; 