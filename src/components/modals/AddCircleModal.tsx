"use client";
import Image from "next/image";
import React, { useRef, useState } from "react";
import FloatingInput from "../inputs/FloatingInput";
import GlobalButton from "../buttons/GlobalButton";
import { UploadCloud } from "lucide-react";
import { createCircle, updateCircle, CreateCircleData } from "@/lib/supabase/circles";

interface AddCircleModalProps {
  onCircleCreated?: () => void;
  editMode?: boolean;
  circleData?: {
    id: string;
    name: string;
    image_url?: string;
    color?: string;
    description?: string;
    circle_type?: string;
    icon?: string;
    is_default?: boolean;
    display_order?: number;
  };
}

const AddCircleModal = ({ onCircleCreated, editMode = false, circleData }: AddCircleModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(circleData?.image_url || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<CreateCircleData>({
    name: circleData?.name || '',
    circle_type: circleData?.circle_type || 'custom',
    description: circleData?.description || '',
    color: circleData?.color || '#667eea',
    icon: circleData?.icon || 'users',
    image_url: circleData?.image_url || '',
    is_default: circleData?.is_default || false,
    display_order: circleData?.display_order || 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('circles-media')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from('circles-media')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('Circle name is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let imageUrl = formData.image_url;
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          setError(`Failed to upload image. ${editMode ? 'Updating' : 'Creating'} circle without new image.`);
        }
      }

      if (editMode && circleData?.id) {
        const { error: updateError } = await updateCircle(circleData.id, {
          ...formData,
          image_url: imageUrl,
        });

        if (updateError) {
          setError(`Failed to update circle: ${updateError.message}`);
          return;
        }
      } else {
        const { error: createError } = await createCircle({
          ...formData,
          image_url: imageUrl,
        });

        if (createError) {
          setError(`Failed to create circle: ${createError.message}`);
          return;
        }
      }

      if (onCircleCreated) {
        onCircleCreated();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <FloatingInput
        title="Circle Name"
        width="100%"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />

      <div>
        <p className="text-[16px] font-medium mb-2">Circle Picture (Optional)</p>

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

      <GlobalButton
        title={loading ? (editMode ? "Updating..." : "Creating...") : (editMode ? "Update Circle" : "Create Circle")}
        width="100%"
        onClick={handleSubmit}
        disabled={loading}
      />
    </div>
  );
};

export default AddCircleModal;
