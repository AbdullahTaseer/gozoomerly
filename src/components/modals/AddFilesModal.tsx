"use client";

import React, { useMemo, useState } from "react";
import {
  Music,
  Pause,
  Play,
  Search,
  ArrowLeft
} from "lucide-react";

import { musicList } from "@/lib/MockData";
import ImageEditorSection from "./ImageEditorSection";
import { uploadBoardMedia } from "@/lib/supabase/boards";
import { authService } from '@/lib/supabase/auth';

export interface FileItem {
  id: number;
  src: string;
  file?: File;
  mediaId?: string;
}

export type FontStyle = "modern" | "classic" | "signature";

export interface FileEditSettings {
  caption: string;
  captionColor: string;
  captionBg: string;
  fontStyle: FontStyle;
  fontSize: number;
  textAlign: "left" | "center" | "right";
  zoom: number;
}

type MediaUrlItem = {
  id: string;
  url: string;
  type: 'image' | 'video';
};

type props = {
  doneOnclick: () => void;
  onClose: () => void;
  boardId?: string;
  onMediaUploaded?: (mediaIds: string[], selectedMusicId?: number, mediaUrls?: MediaUrlItem[]) => void;
}

const AddFilesModal = ({ doneOnclick, onClose, boardId, onMediaUploaded }: props) => {
  const [step, setStep] = useState<"files" | "music">("files");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const [selectedMusic, setSelectedMusic] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const [editSettingsById, setEditSettingsById] = useState<Record<number, FileEditSettings>>({});
  const [showEditor, setShowEditor] = useState<boolean>(false);

  const handleRemove = (id: number) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));

    if (files[selectedIndex ?? 0]?.id === id) {
      setSelectedIndex(null);
    }

    setEditSettingsById((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files).map((file: File, i) => ({
      id: Date.now() + i,
      src: URL.createObjectURL(file),
      file: file,
    }));

    setFiles((prev) => {
      const updated = [...prev, ...newFiles];

      if (selectedIndex === null && updated.length > 0) {
        setSelectedIndex(0);
      }
      return updated;
    });

    setEditSettingsById((prev) => {
      const next = { ...prev };
      newFiles.forEach((f) => {
        if (!next[f.id]) {
          next[f.id] = {
            caption: "",
            captionColor: "#ffffff",
            captionBg: "#E23F87",
            fontStyle: "classic",
            fontSize: 22,
            textAlign: "center",
            zoom: 1.0,
          };
        }
      });
      return next;
    });
  };

  const selectedFile = useMemo(() => {
    if (selectedIndex === null) return undefined;
    return files[selectedIndex];
  }, [files, selectedIndex]);

  const selectedSettings: FileEditSettings | undefined = useMemo(() => {
    if (!selectedFile) return undefined;
    return editSettingsById[selectedFile.id];
  }, [editSettingsById, selectedFile]);

  const updateSelectedSettings = (partial: Partial<FileEditSettings>) => {
    if (!selectedFile) return;
    setEditSettingsById((prev) => ({
      ...prev,
      [selectedFile.id]: { ...prev[selectedFile.id], ...partial },
    }));
  };

  const handleUploadAndDone = async () => {
    if (!boardId || files.length === 0) {
      doneOnclick();
      return;
    }

    setUploading(true);
    try {
      const user = await authService.getUser();
      if (!user) {
        return;
      }

      const uploadPromises = files.map(async (fileItem) => {
        if (!fileItem.file) return null;

        const mediaType = fileItem.file.type.startsWith('image/')
          ? 'image' as const
          : fileItem.file.type.startsWith('video/')
            ? 'video' as const
            : 'audio' as const;

        const { data, error } = await uploadBoardMedia(
          boardId,
          user.id,
          fileItem.file,
          mediaType
        );

        if (error) {
          return null;
        }

        return {
          id: data?.id,
          url: data?.cdn_url,
          type: mediaType === 'audio' ? 'image' : mediaType,
        };
      });

      const uploadResults = await Promise.all(uploadPromises);
      const successfulUploads = uploadResults.filter((item): item is { id: string; url: string; type: 'image' | 'video' } =>
        item !== null && item.id !== undefined && item.url !== undefined
      );

      const mediaIds = successfulUploads.map(item => item.id);
      const mediaUrls: MediaUrlItem[] = successfulUploads.map(item => ({
        id: item.id,
        url: item.url,
        type: item.type,
      }));

      if (onMediaUploaded) {
        onMediaUploaded(mediaIds, selectedMusic || undefined, mediaUrls);
      }

      doneOnclick();
    } catch (error) {
      alert('Failed to upload some media files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`${showEditor ? "pb-4" : "pb-0"}`}>
      {step === "files" && (
        <ImageEditorSection
          files={files}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          onRemove={handleRemove}
          onAdd={handleAdd}
          onClose={onClose}
          onNext={() => setStep("music")}
          showEditor={showEditor}
          onToggleEditor={() => setShowEditor((s) => !s)}
          selectedSettings={selectedSettings}
          updateSelectedSettings={updateSelectedSettings}
        />
      )}

      {step === "music" && (
        <div className="bg-[#F2F2F2] rounded-md">

          <div className="flex justify-between items-center mb-4 p-2">
            <ArrowLeft onClick={() => setStep("files")} className="cursor-pointer" />
            <h2 className="font-semibold text-lg">Add Music</h2>
            <button
              onClick={handleUploadAndDone}
              disabled={uploading}
              className="bg-gradient-to-r cursor-pointer from-[#F43C83] to-[#845CBA] font-bold text-transparent bg-clip-text disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Done"}
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