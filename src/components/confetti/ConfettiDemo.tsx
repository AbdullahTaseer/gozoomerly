"use client";

import React from "react";
import { Confetti } from "./index";

const ConfettiDemo = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold text-center mb-8">🎉 Confetti Component Examples</h2>
      
      {/* Example 1: Basic auto-fire confetti */}
      <div className="relative h-32 bg-gray-100 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">1. Basic Auto-Fire Confetti</h3>
        <p className="text-sm text-gray-600 mb-2">Automatically fires when component mounts</p>
        <Confetti autoFire={true} autoFireDelay={500} />
      </div>

      {/* Example 2: Confetti with button */}
      <div className="relative h-32 bg-blue-100 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">2. Confetti with Button</h3>
        <p className="text-sm text-gray-600 mb-2">Click the button to trigger confetti</p>
        <Confetti 
          autoFire={false} 
          showButton={true} 
          buttonText="🎊 Fire Confetti!" 
          buttonPosition="center"
        />
      </div>

      {/* Example 3: Custom colors and shapes */}
      <div className="relative h-32 bg-green-100 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">3. Custom Colors & Shapes</h3>
        <p className="text-sm text-gray-600 mb-2">Only stars with custom colors</p>
        <Confetti 
          autoFire={true} 
          autoFireDelay={1000} 
          showButton={true} 
          buttonText="⭐ Star Burst!" 
          buttonPosition="bottom-right"
          options={{
            particleCount: 50,
            colors: ['#FFD700', '#FF69B4', '#00CED1'],
            shapes: ['star'],
            scalar: 2
          }}
        />
      </div>

      {/* Example 4: Minimal confetti */}
      <div className="relative h-32 bg-purple-100 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">4. Minimal Confetti</h3>
        <p className="text-sm text-gray-600 mb-2">Fewer particles, subtle effect</p>
        <Confetti 
          autoFire={true} 
          autoFireDelay={1500} 
          showButton={true} 
          buttonText="✨ Subtle" 
          buttonPosition="top-left"
          options={{
            particleCount: 20,
            spread: 45,
            startVelocity: 30
          }}
        />
      </div>

      {/* Example 5: Fireworks style */}
      <div className="relative h-32 bg-red-100 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">5. Fireworks Style</h3>
        <p className="text-sm text-gray-600 mb-2">High velocity, wide spread</p>
        <Confetti 
          autoFire={false} 
          showButton={true} 
          buttonText="🚀 Fireworks!" 
          buttonPosition="center"
          options={{
            particleCount: 150,
            spread: 90,
            startVelocity: 60,
            colors: ['#FF4500', '#FFD700', '#FF69B4', '#00CED1', '#32CD32']
          }}
        />
      </div>
    </div>
  );
};

export default ConfettiDemo; 