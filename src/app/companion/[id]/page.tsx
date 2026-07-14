"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PhotoCarousel } from "@/components/companion/PhotoCarousel";
import { VoicePlayer } from "@/components/companion/VoicePlayer";
import { CreateOrderForm } from "@/components/order/CreateOrderForm";
import { parseJsonArray, formatPrice } from "@/lib/utils";
import { Star, MapPin, Clock, ShoppingBag, MessageCircle } from "lucide-react";

export default function CompanionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [companion, setCompanion] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/companions/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCompanion(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
      </div>
    );
  }

  if (!companion) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground text-lg">陪玩不存在或已下架</p>
      </div>
    );
  }

  const tags = parseJsonArray(companion.tags);
  const genderLabel = companion.gender === "MALE" ? "男" : companion.gender === "FEMALE" ? "女" : "其他";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Photos & Info */}
        <div className="lg:col-span-2 space-y-6">
          <PhotoCarousel
            photos={companion.photos}
            avatarUrl={companion.avatarUrl}
            nickname={companion.nickname}
          />

          {/* Voice Player */}
          <Card>
            <CardContent className="p-6">
              <VoicePlayer
                audioUrl={companion.voiceIntroUrl}
                duration={companion.voiceDuration}
              />
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{companion.nickname}</h1>
                  <div className="flex items-center gap-3 mt-2 text-muted-foreground">
                    <Badge variant="secondary">{genderLabel}</Badge>
                    <span>{companion.age}岁</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {companion.city}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{formatPrice(companion.pricePerHour)}</div>
                  <div className="text-sm text-muted-foreground">/小时</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{companion.rating?.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <ShoppingBag className="h-4 w-4" />
                  <span>{companion.orderCount} 单</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>

              {/* Bio */}
              {companion.bio && (
                <div>
                  <h3 className="font-semibold mb-2">个人介绍</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{companion.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reviews */}
          {companion.reviews && companion.reviews.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">用户评价 ({companion.reviews.length})</h3>
                <div className="space-y-4">
                  {companion.reviews.map((review: any) => (
                    <div key={review.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{review.user?.name || "匿名"}</span>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.content && <p className="text-sm text-muted-foreground">{review.content}</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Order Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">立即下单</h3>
                <CreateOrderForm
                  companionId={companion.id}
                  companionName={companion.nickname}
                  pricePerHour={companion.pricePerHour}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}