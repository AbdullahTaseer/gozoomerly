"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  Music,
  Pause,
  Play,
  Plus,
  X,
  Search,
  ArrowLeft
} from "lucide-react";

import { musicList } from "@/lib/MockData";
import GlobalButton from "../buttons/GlobalButton";

import NoFileImg from "@/assets/svgs/add-wish.svg";
import ArrowRight from "@/assets/svgs/ArrowRight.svg";

interface FileItem {
  id: number;
  src: string;
}

type props = {
  doneOnclick: () => void;
  onClose: () => void;
}

const AddFilesModal = ({ doneOnclick, onClose }: props) => {
  const [step, setStep] = useState<"files" | "music">("files");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [selectedMusic, setSelectedMusic] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const handleRemove = (id: number) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));

    if (files[selectedIndex ?? 0]?.id === id) {
      setSelectedIndex(null);
    }
  };

  const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files).map((file: File, i) => ({
      id: Date.now() + i,
      src: URL.createObjectURL(file),
    }));

    setFiles((prev) => {
      const updated = [...prev, ...newFiles];

      if (selectedIndex === null && updated.length > 0) {
        setSelectedIndex(0);
      }
      return updated;
    });
  };

  return (
    <div>
      {step === "files" && (
        <>

          <div className="rounded-lg overflow-hidden relative">
            <div onClick={onClose} className="bg-black/50 text-white flex justify-center items-center cursor-pointer h-10 z-10 w-10 shrink-0 absolute top-4 left-4 rounded-full">
              <ChevronLeft />
            </div>
            <div onClick={() => setStep("music")} className="bg-black/50 text-white flex justify-center items-center cursor-pointer h-10 z-10 w-10 shrink-0 absolute top-4 right-4 rounded-full">
              <Music />
            </div>
            <div className="bg-black/50 text-white flex justify-center items-center cursor-pointer h-10 z-10 w-10 shrink-0 font-bold absolute top-4 right-18 rounded-full">
              Aa
            </div>
            {files.length > 0 && selectedIndex !== null ? (
              <div className="h-[420px] w-full relative">
                <Image
                  src={files[selectedIndex].src}
                  alt="preview"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <>
                <div className="w-full h-[420px] flex flex-col gap-3 items-center justify-center text-gray-600">
                  <Image src={NoFileImg} alt='' className='mx-auto' />
                  <p> No file selected</p>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center overflow-x-auto h-20 gap-2 mt-5">
            {files.map((file, index) => (
              <div
                key={file.id}
                className={`relative w-16 h-16 rounded-md flex-shrink-0 cursor-pointer border-2 ${selectedIndex === index
                  ? "border-blue-500"
                  : "border-transparent"
                  }`}
                onClick={() => setSelectedIndex(index)}
              >
                <Image
                  src={file.src}
                  alt="thumbnail"
                  width={64}
                  height={64}
                  className="object-cover rounded-sm w-full h-full"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(file.id);
                  }}
                  className="absolute -top-2 -right-2 bg-black text-white border border-white rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            <label className="w-16 h-16 flex items-center justify-center bg-[#e0dddd] rounded-md cursor-pointer flex-shrink-0">
              <Plus />
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleAdd}
              />
            </label>
          </div>

          <GlobalButton
            title="Next"
            icon={ArrowRight}
            height="44px"
            className="flex-row-reverse mt-6"
            onClick={() => setStep("music")}
          />
        </>
      )}

      {step === "music" && (
        <div className="bg-[#F2F2F2] rounded-md">

          <div className="flex justify-between items-center mb-4 p-2">
            <ArrowLeft onClick={() => setStep("files")} className="cursor-pointer" />
            <h2 className="font-semibold text-lg">Add Music</h2>
            <button onClick={doneOnclick} className="bg-gradient-to-r cursor-pointer from-[#F43C83] to-[#845CBA] font-bold text-transparent bg-clip-text">
              Done
            </button>
          </div>


          <div className="flex items-center border border-black rounded-full px-3 py-2 mb-4 mx-2">
            <Search size={16} className="text-black mr-2" />
            <input
              type="text"
              placeholder="Search Background Music"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm py-1 outline-none"
            />
          </div>


          <div className="h-[70vh] overflow-y-auto p-2">
            {musicList
              .filter((m) =>
                m.title.toLowerCase().includes(search.toLowerCase())
              )
              .map((music) => (
                <div
                  key={music.id}
                  className="flex items-center justify-between py-3 border-b cursor-pointer"
                  onClick={() => setSelectedMusic(music.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 shrink-0 w-12 flex bg-black text-white rounded-full justify-center items-center">
                      <Music size={24} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{music.title}</p>
                      <p className="text-xs text-gray-500">{music.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 flex bg-white rounded-full justify-center items-center">
                      {selectedMusic === music.id ? <Pause size={16} /> : <Play size={16} />}
                    </div>
                    <input
                      type="radio"
                      checked={selectedMusic === music.id}
                      readOnly
                      className="accent-black h-5 w-5"
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddFilesModal;