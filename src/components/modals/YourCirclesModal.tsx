"use client";
import React, { useState, useEffect } from "react";
import GlobalButton from "../buttons/GlobalButton";
import { getUserCircles, CircleWithDetails } from "@/lib/supabase/circles";

interface YourCirclesModalProps {
  onCircleSelect: (circle: CircleWithDetails) => void;
  onCreateNew: () => void;
  userId: string;
}

const YourCirclesModal: React.FC<YourCirclesModalProps> = ({
  onCircleSelect,
  onCreateNew,
  userId,
}) => {
  const [circles, setCircles] = useState<CircleWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (userId) {
      fetchCircles();
    }
  }, [userId]);

  const fetchCircles = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await getUserCircles(userId);

      if (fetchError) {
        console.error("Error fetching circles:", fetchError);
        setError("Failed to load circles. Please try again.");
        setCircles([]);
      } else {
        setCircles(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An unexpected error occurred.");
      setCircles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCirclePress = (circle: CircleWithDetails) => {
    onCircleSelect(circle);
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="py-10 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading circles...</p>
        </div>
      ) : circles.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-gray-500 mb-4">No circles yet</p>
          <p className="text-sm text-gray-400 mb-6">Create a circle to organize your connections</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {circles.map((circle) => (
            <button
              key={circle.id}
              onClick={() => handleCirclePress(circle)}
              className="w-full flex items-center gap-4 p-4 rounded-[12px] border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-gray-200">
                {circle.image_url && !imageErrors.has(circle.id) ? (
                  <img
                    src={circle.image_url}
                    alt={circle.name}
                    className="w-full h-full object-cover"
                    onError={() => {
                      setImageErrors((prev) => new Set(prev).add(circle.id));
                    }}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-white font-semibold text-lg"
                    style={{
                      backgroundColor: circle.color || "#667eea",
                    }}
                  >
                    {circle.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 text-left">
                <p className="text-[16px] font-medium text-black">
                  {circle.name}
                </p>
                {circle.memberCount > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {circle.memberCount} {circle.memberCount === 1 ? 'member' : 'members'}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      <GlobalButton
        title="Create New Circles"
        bgColor="black"
        width="100%"
        onClick={onCreateNew}
      />
    </div>
  );
};

export default YourCirclesModal;

