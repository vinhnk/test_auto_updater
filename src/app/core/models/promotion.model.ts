export interface Promotion {
  id?: number;
  name?: string;
  description?: string;
  startDate?: string; // LocalDate
  endDate?: string; // LocalDate
  status?: string;
  numUsage?: number;
  createdDate?: string; // Instant
  approvedBy?: string;
  approvedDate?: string; // Instant
  createdBy?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string; // Instant
  discountType?: string;
  discountValue?: number;
  discountUnit?: string;
  province?: string;
  province2?: string[];
  route?: string;
  route2?: string[];
  applyDateDetail?: string;
  applyTimeDetail?: string;
  isNotifying?: boolean;
}

export interface NotificationResponse {
  successCount: number;
  message: string;
}
