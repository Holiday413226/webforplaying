"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CompanionForm } from "@/components/companion/CompanionForm";
import { formatPrice, parseJsonArray } from "@/lib/utils";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star } from "lucide-react";

export default function AdminCompanionsPage() {
  const [companions, setCompanions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function fetchCompanions() {
    setLoading(true);
    fetch("/api/companions?pageSize=100")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCompanions(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchCompanions(); }, []);

  async function handleDelete(id: string) {
    if (!confirm("确定删除该陪玩？")) return;
    try {
      const res = await fetch(`/api/companions/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("删除成功");
        fetchCompanions();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("删除失败");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">陪玩管理</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger onClick={() => setEditing(null)} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
              <Plus className="h-4 w-4 mr-1" /> 新建陪玩
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "编辑陪玩" : "新建陪玩"}</DialogTitle>
            </DialogHeader>
            <CompanionForm
              initialData={editing}
              companionId={editing?.id}
              onSuccess={() => {
                setDialogOpen(false);
                setEditing(null);
                fetchCompanions();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        </div>
      ) : companions.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">暂无陪玩数据</div>
      ) : (
        <div className="space-y-3">
          {companions.map((c: any) => (
            <Card key={c.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <img src={c.avatarUrl} alt={c.nickname} className="w-16 h-16 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{c.nickname}</h3>
                    <Badge variant={c.status === "ONLINE" ? "default" : "secondary"} className={c.status === "ONLINE" ? "bg-green-500" : ""}>
                      {c.status === "ONLINE" ? "在线" : "离线"}
                    </Badge>
                    {c.isFeatured && <Badge variant="outline">推荐</Badge>}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <span>{c.gender === "MALE" ? "男" : "女"} · {c.age}岁 · {c.city}</span>
                    <span className="flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {c.rating?.toFixed(1)}
                    </span>
                    <span>{formatPrice(c.pricePerHour)}/h</span>
                    {c.voiceIntroUrl && <Badge variant="secondary" className="text-xs">有语音</Badge>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger
                        onClick={() => setEditing(c)}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
                      >
                        <Pencil className="h-4 w-4" />
                      </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editing ? "编辑陪玩" : "新建陪玩"}</DialogTitle>
                      </DialogHeader>
                      <CompanionForm
                        initialData={editing}
                        companionId={editing?.id}
                        onSuccess={() => {
                          setDialogOpen(false);
                          setEditing(null);
                          fetchCompanions();
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}