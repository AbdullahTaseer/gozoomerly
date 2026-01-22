'use client';

import React from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import MarketplaceIcon from '@/assets/svgs/marketplace.svg';
import DifferentBoard1 from '@/assets/pngs/different-board-1.png';
import DifferentBoard2 from '@/assets/pngs/different-board-2.png';
import PostCarousel1 from '@/assets/pngs/post-carousel-1.jpg';
import PostCarousel2 from '@/assets/pngs/posts-carsousel-2.jpg';
import Thumbnail from '@/assets/pngs/thumbnail.png';
import VideoThumbnail from '@/assets/pngs/video-thumbnail.png';

const ShoppeView = () => {
  const categories = [
    { name: 'Lightening', image: DifferentBoard1 },
    { name: 'Body Kits', image: DifferentBoard2 },
    { name: 'Modifications', image: PostCarousel1 },
    { name: 'Gadgets', image: PostCarousel2 },
    { name: 'Parts', image: Thumbnail },
    { name: 'Wheels', image: VideoThumbnail },
    { name: 'Interior', image: DifferentBoard1 },
    { name: 'Audio', image: DifferentBoard2 },
  ];

  const topSelling = [
    { id: 1, name: 'Universal 4 SMD Light L.', price: '$148.00', image: DifferentBoard1 },
    { id: 2, name: 'Universal 4 SMD Light L...', price: '$55.00', image: DifferentBoard2 },
    { id: 3, name: 'Universal Car Parts', price: '$66.97', image: Thumbnail },
    { id: 4, name: 'Premium LED Headlights', price: '$199.99', image: PostCarousel1 },
    { id: 5, name: 'Carbon Fiber Spoiler', price: '$349.00', image: PostCarousel2 },
    { id: 6, name: 'Performance Exhaust', price: '$425.50', image: VideoThumbnail },
    { id: 7, name: 'Racing Seats', price: '$599.00', image: DifferentBoard1 },
    { id: 8, name: 'Turbo Charger Kit', price: '$1,299.99', image: DifferentBoard2 },
  ];

  const newIn = [
    { id: 1, name: 'Smart Car Display', price: '$299.00', image: PostCarousel1 },
    { id: 2, name: 'Wireless Charging Pad', price: '$89.99', image: PostCarousel2 },
    { id: 3, name: 'Dash Cam Pro 4K', price: '$179.00', image: VideoThumbnail },
    { id: 4, name: 'LED Strip Kit RGB', price: '$45.00', image: DifferentBoard1 },
    { id: 5, name: 'Car Phone Mount', price: '$24.99', image: DifferentBoard2 },
    { id: 6, name: 'Bluetooth Adapter', price: '$35.00', image: Thumbnail },
    { id: 7, name: 'Car Vacuum Cleaner', price: '$79.99', image: PostCarousel1 },
    { id: 8, name: 'Tire Pressure Monitor', price: '$129.00', image: PostCarousel2 },
  ];

  return (
    <div className="space-y-8">
      {}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Categories</h2>
          <button className="text-pink-500 text-sm flex items-center gap-1">
            See All
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category, index) => (
            <div key={index} className="flex flex-col items-center gap-2 min-w-[80px]">
              <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden hover:border-pink-500 transition-colors cursor-pointer relative">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <span className="text-xs text-black font-medium text-center">{category.name}</span>
            </div>
          ))}
        </div>
      </div>

      {}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Top Selling</h2>
          <button className="text-pink-500 text-sm flex items-center gap-1">
            View all
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {topSelling.map((item) => (
            <div key={item.id} className="min-w-[140px] bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-pink-500 transition-colors cursor-pointer shadow-sm">
              <div className="w-full h-32 bg-gray-100 flex items-center justify-center relative">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-700 mb-1 line-clamp-2">{item.name}</p>
                <p className="text-sm font-semibold text-pink-500">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">New in</h2>
          <button className="text-pink-500 text-sm flex items-center gap-1">
            View all
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {newIn.map((item) => (
            <div key={item.id} className="min-w-[140px] bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-pink-500 transition-colors cursor-pointer shadow-sm">
              <div className="w-full h-32 bg-gray-100 flex items-center justify-center relative">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-700 mb-1 line-clamp-2">{item.name}</p>
                <p className="text-sm font-semibold text-pink-500">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShoppeView;

