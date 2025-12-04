import Image from "next/image";
import React, { useRef, useState } from "react";
import FloatingInput from "../inputs/FloatingInput";
import GlobalButton from "../buttons/GlobalButton";
import { UploadCloud } from "lucide-react";

const AddCircleModal = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<any>(null);

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="space-y-6">

      <FloatingInput title="Name" width="100%" />

      <div>
        <p className="text-[16px] font-medium mb-2">Profile Picture*</p>

        <div onClick={() => fileInputRef.current?.click()} className="w-full h-[180px] relative border-2 border-dashed border-gray-300 rounded-[12px] flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition">
          {preview ? (
            <Image
              src={preview}
              alt="uploaded image"
              fill
              className="rounded-xl object-cover"
            />
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <UploadCloud size={26} className="text-gray-600" />
              </div>
              <p className="text-gray-500 mt-2">Upload Picture</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <GlobalButton title="Done" width="100%" />
    </div>
  );
};

export default AddCircleModal;
