"use client";

import { CompanionCard } from "./CompanionCard";

interface CompanionGridProps {
  companions: Array<{
    id: string;
    nickname: string;
    gender: string;
    age: number;
    city: string;
    avatarUrl: string;
    tags: string;
    pricePerHour: number;
    rating: number;
    orderCount: number;
    voiceIntroUrl: string | null;
    status: string;
  }>;
}

export function CompanionGrid({ companions }: CompanionGridProps) {
  if (companions.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">暂无符合条件的陪玩</p>
        <p className="text-muted-foreground text-sm mt-1">试试调整筛选条件</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {companions.map((companion) => (
        <CompanionCard key={companion.id} companion={companion} />
      ))}
    </div>
  );
}