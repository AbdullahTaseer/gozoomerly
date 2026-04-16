"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { ChevronLeft, Music, Plus, X } from "lucide-react";

import NoFileImg from "@/assets/svgs/add-wish.svg";
import ArrowRight from "@/assets/svgs/ArrowRight.svg";
import GlobalButton from "../buttons/GlobalButton";

import type { FileItem, FileEditSettings, FontStyle } from "./AddFilesModal";

type Props = {
  files: FileItem[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  onRemove: (id: number) => void;
  onAdd: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onNext: () => void;
  showEditor: boolean;
  onToggleEditor: () => void;
  selectedSettings?: FileEditSettings;
  updateSelectedSettings: (partial: Partial<FileEditSettings>) => void;
};

const ImageEditorSection: React.FC<Props> = ({
  files,
  selectedIndex,
  onSelect,
  onRemove,
  onAdd,
  onClose,
  onNext,
  showEditor,
  onToggleEditor,
  selectedSettings,
  updateSelectedSettings,
}) => {
  const selectedFile = useMemo(() => {
    if (selectedIndex === null) return undefined;
    return files[selectedIndex];
  }, [files, selectedIndex]);

  return (
    <>
      <div className="rounded-lg overflow-hidden relative">
        <button onClick={onClose} className="bg-black/50 text-white flex justify-center items-center cursor-pointer h-10 z-10 w-10 shrink-0 absolute top-4 left-4 rounded-full">
          <ChevronLeft />
        </button>
        <button onClick={onNext} className="bg-black/50 text-white flex justify-center items-center cursor-pointer h-10 z-10 w-10 shrink-0 absolute top-4 right-4 rounded-full">
          <Music />
        </button>
        <button onClick={onToggleEditor} className="bg-black/50 text-white flex justify-center items-center cursor-pointer h-10 z-10 w-10 shrink-0 font-bold absolute top-4 right-18 rounded-full">
          Aa
        </button>

        {files.length > 0 && selectedIndex !== null ? (
          <div className="h-[420px] w-full relative overflow-hidden rounded-md">
            {showEditor && (
              <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20">
                <input
                  type="range"
                  min={100}
                  max={300}
                  value={Math.round((selectedSettings?.zoom ?? 1) * 100)}
                  onChange={(ev) => updateSelectedSettings({ zoom: Number(ev.target.value) / 100 })}
                  className="[writing-mode:vertical-rl] rotate-180 h-40 accent-white"
                />
              </div>
            )}

            <div className="absolute inset-0" style={{ transform: `scale(${selectedSettings?.zoom ?? 1})`, transformOrigin: "center center" }}>
              <Image
                src={selectedFile?.src ?? ""}
                alt="preview"
                fill
                className="object-cover select-none pointer-events-none"
                sizes="(max-width: 768px) 100vw, 640px"
              />
            </div>

            {selectedSettings && selectedSettings.caption !== "" && (
              <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 z-10 px-3">
                <div
                  className="rounded-full px-4 py-2 shadow-md"
                  style={{ backgroundColor: selectedSettings.captionBg }}
                >
                  <p
                    className="text-white"
                    style={{
                      color: selectedSettings.captionColor,
                      fontSize: selectedSettings.fontSize,
                      textAlign: selectedSettings.textAlign,
                      fontFamily:
                        selectedSettings.fontStyle === "modern"
                          ? "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto"
                          : selectedSettings.fontStyle === "classic"
                          ? "Georgia, Cambria, Times New Roman, Times, serif"
                          : '"Brush Script MT", "Segoe Script", cursive',
                    }}
                  >
                    {selectedSettings.caption}
                  </p>
                </div>
              </div>
            )}
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

      {showEditor && selectedSettings && (
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex gap-2 justify-center">
            {([
              { key: "modern", label: "Modern" },
              { key: "classic", label: "Classic" },
              { key: "signature", label: "Signature" },
            ] as { key: FontStyle; label: string }[]).map((opt) => (
              <button
                key={opt.key}
                onClick={() => updateSelectedSettings({ fontStyle: opt.key })}
                className={`px-4 py-2 rounded-md ${selectedSettings.fontStyle === opt.key ? "bg-black text-white" : "bg-[#e7e7e7] text-black"}`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 items-center justify-center">
            <input
              type="text"
              value={selectedSettings.caption}
              onChange={(e) => updateSelectedSettings({ caption: e.target.value })}
              placeholder="Add a caption..."
              className="px-3 py-2 rounded-md border w-60"
            />

            <div className="flex items-center gap-2 bg-white rounded-md px-3 py-2 border">
              <input
                type="color"
                value={selectedSettings.captionBg}
                onChange={(e) => updateSelectedSettings({ captionBg: e.target.value })}
                aria-label="Background color"
              />
            </div>

            <div className="flex items-center gap-2 bg-white rounded-md px-3 py-2 border">
              <input
                type="color"
                value={selectedSettings.captionColor}
                onChange={(e) => updateSelectedSettings({ captionColor: e.target.value })}
                aria-label="Text color"
              />
            </div>

            <div className="flex items-center gap-2 bg-white rounded-md px-3 py-2 border">
              <button onClick={() => updateSelectedSettings({ fontSize: Math.max(12, (selectedSettings.fontSize || 16) - 2) })}>A−</button>
              <button onClick={() => updateSelectedSettings({ fontSize: Math.min(64, (selectedSettings.fontSize || 16) + 2) })}>A+</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center overflow-x-auto h-20 gap-2 mt-5">
        {files.map((file, index) => (
          <div
            key={file.id}
            className={`relative w-16 h-16 rounded-md flex-shrink-0 cursor-pointer border-2 ${selectedIndex === index
              ? "border-blue-500"
              : "border-transparent"
              }`}
            onClick={() => onSelect(index)}
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
                onRemove(file.id);
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
            onChange={onAdd}
          />
        </label>
      </div>

      <GlobalButton
        title="Next"
        icon={ArrowRight}
        height="44px"
        className="flex-row-reverse mt-6"
        onClick={onNext}
      />
    </>
  );
};

export default ImageEditorSection;

