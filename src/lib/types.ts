export const STATUSES = [
  "wishlist",
  "applied",
  "interview",
  "offer",
  "rejected",
] as const;

export type Status = (typeof STATUSES)[number];

export const STATUS_LABELS: Record<Status, string> = {
  wishlist: "Wishlist",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};

export type Application = {
  id: string;
  company: string;
  role: string;
  jobUrl: string | null;
  status: Status;
  appliedDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};
