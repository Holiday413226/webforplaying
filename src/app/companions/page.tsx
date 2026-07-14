"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CompanionGrid } from "@/components/companion/CompanionGrid";
import { CompanionFilter } from "@/components/companion/CompanionFilter";
import { Button } from "@/components/ui/button";
import type { CompanionFilters } from "@/types";

function CompanionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [companions, setCompanions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<CompanionFilters>({
    keyword: searchParams.get("keyword") || undefined,
    page: 1,
    pageSize: 20,
  });

  const fetchCompanions = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value));
      }
    });

    try {
      const res = await fetch(`/api/companions?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setCompanions(data.data);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCompanions();
  }, [fetchCompanions]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">找陪玩</h1>

      <CompanionFilter filters={filters} onChange={setFilters} />

      <div className="mt-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          </div>
        ) : (
          <>
            <CompanionGrid companions={companions} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  disabled={filters.page === 1}
                  onClick={() => setFilters((f) => ({ ...f, page: f.page! - 1 }))}
                >
                  上一页
                </Button>
                <span className="flex items-center px-4 text-sm text-muted-foreground">
                  {filters.page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={filters.page === totalPages}
                  onClick={() => setFilters((f) => ({ ...f, page: f.page! + 1 }))}
                >
                  下一页
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function CompanionsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
      </div>
    }>
      <CompanionsContent />
    </Suspense>
  );
}