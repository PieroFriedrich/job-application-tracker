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

export const SOURCES = [
  "linkedin",
  "indeed",
  "company_website",
  "other",
] as const;

export type Source = (typeof SOURCES)[number];

export const SOURCE_LABELS: Record<Source, string> = {
  linkedin: "LinkedIn",
  indeed: "Indeed",
  company_website: "Company Website",
  other: "Other",
};

export type Application = {
  id: string;
  company: string;
  role: string;
  jobUrl: string | null;
  status: Status;
  source: Source;
  coverLetter: boolean;
  appliedDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};
