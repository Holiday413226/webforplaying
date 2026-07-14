"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Mic, MapPin } from "lucide-react";
import { formatPrice, parseJsonArray } from "@/lib/utils";

interface CompanionCardProps {
  companion: {
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
  };
}

export function CompanionCard({ companion }: CompanionCardProps) {
  const tags = parseJsonArray(companion.tags);
  const genderLabel = companion.gender === "MALE" ? "男" : companion.gender === "FEMALE" ? "女" : "其他";
  const genderColor = companion.gender === "MALE" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700";

  return (
    <Link href={`/companion/${companion.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Avatar className="w-full h-full rounded-none">
            <AvatarImage src={companion.avatarUrl} alt={companion.nickname} className="object-cover" />
            <AvatarFallback className="text-4xl bg-gradient-to-br from-pink-400 to-purple-500 text-white rounded-none">
              {companion.nickname.charAt(0)}
            </AvatarFallback>
          </Avatar>

          {/* Status Badge */}
          <div className="absolute top-2 right-2">
            <Badge
              variant={companion.status === "ONLINE" ? "default" : "secondary"}
              className={companion.status === "ONLINE" ? "bg-green-500" : ""}
            >
              {companion.status === "ONLINE" ? "在线" : companion.status === "BUSY" ? "忙碌" : "离线"}
            </Badge>
          </div>

          {/* Voice Indicator */}
          {companion.voiceIntroUrl && (
            <div className="absolute bottom-2 left-2">
              <Badge variant="secondary" className="bg-black/60 text-white border-0">
                <Mic className="h-3 w-3 mr-1" />
                有语音
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg">{companion.nickname}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge className={genderColor} variant="secondary">
                  {genderLabel}
                </Badge>
                <span>{companion.age}岁</span>
                <span className="flex items-center gap-0.5">
                  <MapPin className="h-3 w-3" />
                  {companion.city}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">{formatPrice(companion.pricePerHour)}</div>
              <div className="text-xs text-muted-foreground">/小时</div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{companion.rating.toFixed(1)}</span>
            <span>({companion.orderCount}单)</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}