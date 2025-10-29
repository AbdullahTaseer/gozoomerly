"use client";

import React, { useState } from "react";
import TitleCard from "@/components/cards/TitleCard";
import Image from "next/image";
import ProfileImg from "@/assets/svgs/avatar-list-icon-1.svg";
import { Camera, Video } from "lucide-react";

const VisitProfile = () => {
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");
  const [isFollowing, setIsFollowing] = useState(false);

  const user = {
    name: "Asad Ali",
    username: "asad.codes",
    bio: "💻 Frontend Developer | 🚀 Building with React & Next.js",
    avatar: ProfileImg,
    posts: 30,
    followers: 1089,
    following: 832,
    photos: [
      "https://images.unsplash.com/photo-1605460375648-278bcbd579a6?w=400&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80",
      "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=400&q=80",
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
      "https://images.unsplash.com/photo-1473187983305-f615310e7daa?w=400&q=80",
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80",
    ],
    videos: [
      "https://videos.pexels.com/video-files/855337/855337-hd_1920_1080_25fps.mp4",
      "https://videos.pexels.com/video-files/855337/855337-hd_1920_1080_25fps.mp4",
      "https://videos.pexels.com/video-files/855337/855337-hd_1920_1080_25fps.mp4",
      "https://videos.pexels.com/video-files/855337/855337-hd_1920_1080_25fps.mp4",
      "https://videos.pexels.com/video-files/855337/855337-hd_1920_1080_25fps.mp4",
    ],
  };

  const RenderPosts = () => {
    const posts = activeTab === "photos" ? user.photos : user.videos;

    return (
      <div className="grid grid-cols-3 gap-1 max-[700px]:grid-cols-2 max-[420px]:grid-cols-1 mt-6">
        {posts.map((item, index) => (
          <div
            key={index}
            className="relative aspect-square cursor-pointer overflow-hidden hover:opacity-90"
          >
            {activeTab === "photos" ? (
              <Image
                src={item}
                alt={`Post ${index + 1}`}
                fill
                className="object-cover"
              />
            ) : (
              <video
                src={item}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                autoPlay
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="px-[7%] max-[769px]:px-6 py-6">
      <TitleCard title={`${user.username}`} className="text-left mb-6" />

      <div className="flex items-center gap-8 max-[768px]:flex-col max-[768px]:text-center">
        <div className="relative w-32 h-32 rounded-full overflow-hidden">
          <Image
            src={user.avatar}
            alt={user.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-4 max-[768px]:justify-center">
            <h2 className="text-xl font-semibold">{user.username}</h2>

            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`px-4 py-1 rounded-md text-sm font-medium cursor-pointer border transition-all ${isFollowing
                ? "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                : "bg-pink-500 border-pink-500 text-white hover:bg-pink-600"
                }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>

            <button className="border px-4 py-1 rounded-md text-sm cursor-pointer font-medium hover:bg-gray-100">
              Message
            </button>
          </div>

          <div className="flex gap-8 mt-3 max-[768px]:justify-center max-[768px]:gap-6">
            <p><span className="font-semibold">{user.posts}</span> posts</p>
            <p><span className="font-semibold">{user.followers}</span> followers</p>
            <p><span className="font-semibold">{user.following}</span> following</p>
          </div>

          <div className="mt-3">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-600">{user.bio}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-10 mt-10 border-t pt-4 text-sm font-medium">
        <button
          onClick={() => setActiveTab("photos")}
          className={`border-b-2 pb-2 flex items-center gap-2 cursor-pointer ${activeTab === "photos"
            ? "border-pink-500 text-pink-600"
            : "border-transparent text-gray-500"
            }`}
        >
          <Camera className="w-4 h-4" /> Photos
        </button>

        <button
          onClick={() => setActiveTab("videos")}
          className={`border-b-2 pb-2 flex items-center gap-2 cursor-pointer ${activeTab === "videos"
            ? "border-pink-500 text-pink-600"
            : "border-transparent text-gray-500"
            }`}
        >
          <Video className="w-4 h-4" /> Videos
        </button>
      </div>

      <RenderPosts />
    </div>
  );
};

export default VisitProfile;
