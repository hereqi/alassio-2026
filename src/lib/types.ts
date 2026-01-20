/**
 * Datenmodell für eine Verfügbarkeit
 */
export type Availability = {
  id: string;
  name: string;
  from: string; // ISO date string (YYYY-MM-DD)
  to: string; // ISO date string (YYYY-MM-DD)
  createdAt: string; // ISO datetime string
};

/**
 * Typ für das Formular (ohne id und createdAt)
 */
export type AvailabilityInput = Omit<Availability, "id" | "createdAt">;

/**
 * API Response Types
 */
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

