"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Play } from "lucide-react";

import Avatar from "@/assets/svgs/Sohail.svg";

type props = {
  goToProfile?: () => void;
  videos?: any[];
}

const PostsVideoCard = ({ goToProfile, videos = [] }: props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  if (!videos || videos.length === 0) {
    return null;
  }

  const currentVideo = videos[currentVideoIndex];

  return (
    <>
      {videos.map((video, index) => {
        const uploader = video.profiles || { name: 'Unknown User', profile_pic_url: null };
        
        return (
          <div key={video.id || index} className="border border-[#E8E8E8] rounded-[24px] overflow-clip mb-6">
            <div className="flex justify-between items-center flex-wrap gap-3 px-5 py-4">
              <div onClick={goToProfile} className="flex cursor-pointer items-center gap-3">
                {uploader.profile_pic_url ? (
                  <img
                    src={uploader.profile_pic_url}
                    alt={uploader.name}
                    className="rounded-full border-2 border-pink-100 w-[50px] h-[50px] object-cover"
                  />
                ) : (
                  <Image
                    src={Avatar}
                    alt=""
                    height={50}
                    width={50}
                    className="rounded-full border-2 border-pink-100"
                  />
                )}
                <span className="font-semibold">{uploader.name}</span>
                <span className="bg-[#F4F4F4] rounded-full px-2 py-1 text-sm">
                  Contributor
                </span>
              </div>
              <div className="space-x-2 flex flex-wrap">
                <span className="bg-black text-white rounded-full px-3 py-1 text-xs">
                  🎥 Video
                </span>
              </div>
            </div>

          <div className="relative px-5">
            <video
              className="rounded-xl w-full max-h-[500px] object-cover"
              controls
              src={video.cdn_url}
            >
              Your browser does not support the video tag.
            </video>
          </div>


            <p className="mt-4 px-5 text-sm">
              {video.filename || 'Video contribution'}
            </p>

            <div className="border-t bg-[#F4F4F4] mt-4 py-3 px-5 flex justify-between text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Heart size={16} />
                <span>0 likes</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle size={16} />
                <span>0 comments</span>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default PostsVideoCard;