"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { parseJsonArray } from "@/lib/utils";

interface PhotoCarouselProps {
  photos: string;
  avatarUrl: string;
  nickname: string;
}

export function PhotoCarousel({ photos, avatarUrl, nickname }: PhotoCarouselProps) {
  const photoList = parseJsonArray(photos);
  const allPhotos = photoList.length > 0 ? photoList : [avatarUrl];
  const [current, setCurrent] = useState(0);

  function prev() {
    setCurrent((c) => (c === 0 ? allPhotos.length - 1 : c - 1));
  }

  function next() {
    setCurrent((c) => (c === allPhotos.length - 1 ? 0 : c + 1));
  }

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
      <img
        src={allPhotos[current]}
        alt={`${nickname} 照片 ${current + 1}`}
        className="w-full h-full object-cover"
      />

      {allPhotos.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full"
            onClick={prev}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full"
            onClick={next}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {allPhotos.map((_, i) => (
              <button
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  i === current ? "bg-white w-4" : "bg-white/50"
                )}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}