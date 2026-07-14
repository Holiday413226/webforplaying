"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { CompanionFormData } from "@/types";

interface CompanionFormProps {
  initialData?: CompanionFormData;
  companionId?: string;
  onSuccess?: () => void;
}

export function CompanionForm({ initialData, companionId, onSuccess }: CompanionFormProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CompanionFormData>(initialData || {
    nickname: "",
    gender: "FEMALE",
    age: 20,
    city: "",
    avatarUrl: "",
    photos: [],
    voiceIntroUrl: "",
    voiceDuration: 0,
    tags: [],
    pricePerHour: 0,
    bio: "",
    status: "OFFLINE",
    isFeatured: false,
  });
  const [tagInput, setTagInput] = useState("");

  function updateField<K extends keyof CompanionFormData>(key: K, value: CompanionFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleUpload(type: "photo" | "voice") {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = type === "photo" ? "image/*" : "audio/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch(`/api/upload/${type}`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          if (type === "photo") {
            updateField("photos", [...form.photos, data.url]);
          } else {
            updateField("voiceIntroUrl", data.url);
            updateField("voiceDuration", data.duration || 0);
          }
          toast.success("上传成功");
        }
      } catch {
        toast.error("上传失败");
      }
    };
    input.click();
  }

  function addTag() {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      updateField("tags", [...form.tags, tagInput.trim()]);
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    updateField("tags", form.tags.filter((t) => t !== tag));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const url = companionId ? `/api/companions/${companionId}` : "/api/companions";
      const method = companionId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(companionId ? "更新成功" : "创建成功");
        onSuccess?.();
      } else {
        toast.error(data.message || "操作失败");
      }
    } catch {
      toast.error("操作失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>昵称 *</Label>
          <Input value={form.nickname} onChange={(e) => updateField("nickname", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>性别</Label>
          <Select value={form.gender} onValueChange={(v) => updateField("gender", v || "FEMALE")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">男</SelectItem>
              <SelectItem value="FEMALE">女</SelectItem>
              <SelectItem value="OTHER">其他</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>年龄</Label>
          <Input type="number" value={form.age} onChange={(e) => updateField("age", Number(e.target.value))} />
        </div>
        <div className="space-y-2">
          <Label>城市</Label>
          <Input value={form.city} onChange={(e) => updateField("city", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>价格 (元/小时) *</Label>
          <Input type="number" value={form.pricePerHour} onChange={(e) => updateField("pricePerHour", Number(e.target.value))} required />
        </div>
        <div className="space-y-2">
          <Label>状态</Label>
          <Select value={form.status} onValueChange={(v) => updateField("status", v || "OFFLINE")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ONLINE">在线</SelectItem>
              <SelectItem value="OFFLINE">离线</SelectItem>
              <SelectItem value="BUSY">忙碌</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>个人简介</Label>
        <Textarea value={form.bio || ""} onChange={(e) => updateField("bio", e.target.value)} rows={3} />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>标签</Label>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="输入标签后按添加"
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
          />
          <Button type="button" variant="outline" onClick={addTag}>添加</Button>
        </div>
        <div className="flex flex-wrap gap-1">
          {form.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-secondary rounded-md text-sm">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">&times;</button>
            </span>
          ))}
        </div>
      </div>

      {/* Uploads */}
      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={() => handleUpload("photo")}>
          上传照片
        </Button>
        <Button type="button" variant="outline" onClick={() => handleUpload("voice")}>
          上传语音介绍
        </Button>
      </div>

      {form.photos.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {form.photos.map((url, i) => (
            <img key={i} src={url} alt={`照片${i + 1}`} className="w-20 h-20 object-cover rounded" />
          ))}
        </div>
      )}
      {form.voiceIntroUrl && (
        <p className="text-sm text-muted-foreground">语音已上传 ✓ (时长: {form.voiceDuration}秒)</p>
      )}

      <div className="flex items-center gap-2">
        <Switch
          checked={form.isFeatured}
          onCheckedChange={(v) => updateField("isFeatured", v)}
        />
        <Label>推荐位展示</Label>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "保存中..." : companionId ? "更新" : "创建"}
      </Button>
    </form>
  );
}