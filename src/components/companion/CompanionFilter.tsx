"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { CompanionFilters } from "@/types";

interface CompanionFilterProps {
  filters: CompanionFilters;
  onChange: (filters: CompanionFilters) => void;
}

export function CompanionFilter({ filters, onChange }: CompanionFilterProps) {
  const [expanded, setExpanded] = useState(false);

  function updateFilter(key: keyof CompanionFilters, value: any) {
    onChange({ ...filters, [key]: value, page: 1 });
  }

  function clearFilters() {
    onChange({ page: 1, pageSize: 20 });
  }

  const hasActiveFilters = filters.gender || filters.city || filters.minPrice || filters.maxPrice || filters.hasVoice;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索陪玩昵称、游戏、标签..."
            className="pl-9"
            value={filters.keyword || ""}
            onChange={(e) => updateFilter("keyword", e.target.value)}
          />
        </div>
        <Button
          variant={expanded ? "secondary" : "outline"}
          onClick={() => setExpanded(!expanded)}
        >
          <SlidersHorizontal className="h-4 w-4 mr-1" />
          筛选
          {hasActiveFilters && (
            <span className="ml-1 flex h-2 w-2 rounded-full bg-primary" />
          )}
        </Button>
      </div>

      {/* Expanded Filters */}
      {expanded && (
        <div className="p-4 border rounded-lg bg-muted/30 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Gender */}
            <div className="space-y-2">
              <Label>性别</Label>
              <Select
                value={filters.gender || "all"}
                onValueChange={(v) => updateFilter("gender", v === "all" || !v ? undefined : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="不限" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">不限</SelectItem>
                  <SelectItem value="MALE">男</SelectItem>
                  <SelectItem value="FEMALE">女</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <Label>最低价格</Label>
              <Input
                type="number"
                placeholder="¥0"
                value={filters.minPrice || ""}
                onChange={(e) => updateFilter("minPrice", e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            <div className="space-y-2">
              <Label>最高价格</Label>
              <Input
                type="number"
                placeholder="不限"
                value={filters.maxPrice || ""}
                onChange={(e) => updateFilter("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <Label>排序方式</Label>
              <Select
                value={filters.sortBy || "order_count"}
                onValueChange={(v) => updateFilter("sortBy", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="order_count">最受欢迎</SelectItem>
                  <SelectItem value="rating">评分最高</SelectItem>
                  <SelectItem value="price_asc">价格从低到高</SelectItem>
                  <SelectItem value="price_desc">价格从高到低</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Has Voice */}
          <div className="flex items-center gap-2">
            <Switch
              id="hasVoice"
              checked={filters.hasVoice || false}
              onCheckedChange={(v) => updateFilter("hasVoice", v || undefined)}
            />
            <Label htmlFor="hasVoice">仅显示有语音介绍的陪玩</Label>
          </div>

          {/* Clear */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              清除筛选
            </Button>
          )}
        </div>
      )}
    </div>
  );
}