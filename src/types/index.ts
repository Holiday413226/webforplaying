import type { Companion, Order, User, Review, Transaction } from "@prisma/client";

// ─── Auth ────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  phone: string;
  name: string | null;
  role: string;
}

// ─── Companion ───────────────────────────────────────────
export interface CompanionWithUser extends Companion {
  user: Pick<User, "phone" | "name" | "avatar">;
}

export interface CompanionFilters {
  keyword?: string;
  gender?: string;
  city?: string;
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  hasVoice?: boolean;
  sortBy?: "price_asc" | "price_desc" | "rating" | "order_count";
  page?: number;
  pageSize?: number;
}

export interface CompanionFormData {
  nickname: string;
  gender: string;
  age: number;
  city: string;
  avatarUrl: string;
  photos: string[];
  voiceIntroUrl?: string;
  voiceDuration?: number;
  tags: string[];
  pricePerHour: number;
  bio?: string;
  status: string;
  isFeatured: boolean;
}

// ─── Order ───────────────────────────────────────────────
export interface OrderWithDetails extends Order {
  user: Pick<User, "phone" | "name" | "avatar">;
  companion: Companion;
  review?: Review | null;
}

export interface CreateOrderInput {
  companionId: string;
  serviceType: string;
  durationHours: number;
  paymentMethod: string;
}

// ─── Payment ─────────────────────────────────────────────
export interface RechargeInput {
  amount: number;
  paymentMethod: "ALIPAY" | "WECHAT";
}

export interface PaymentResult {
  success: boolean;
  tradeNo?: string;
  qrCode?: string; // 支付二维码链接
  error?: string;
}

// ─── Wallet ──────────────────────────────────────────────
export interface WalletInfo {
  balance: number;
  recentTransactions: Transaction[];
}

// ─── API Response ────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Dashboard ───────────────────────────────────────────
export interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  onlineCompanions: number;
  totalUsers: number;
  recentOrders: OrderWithDetails[];
}