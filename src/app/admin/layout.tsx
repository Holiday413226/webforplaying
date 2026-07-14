"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (status === "unauthenticated" || (session?.user as any)?.role !== "ADMIN") {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-6 min-h-screen bg-muted/10">
        {children}
      </main>
    </div>
  );
}