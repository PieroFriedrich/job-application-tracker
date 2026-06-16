export const STATUSES = [
  "pending",
  "active",
  "inactive",
] as const;

export type Status = (typeof STATUSES)[number];

export const STATUS_LABELS: Record<Status, string> = {
  pending: "Pending",
  active: "Active / Applied",
  inactive: "Inactive / Rejected",
};

export const STAGES = [
  "none",
  "wishlist",
  "oa",
  "hr_interview",
  "round_2",
  "round_3",
  "round_4",
  "round_5",
  "onsite",
  "offer",
] as const;

export type Stage = (typeof STAGES)[number];

export const STAGE_LABELS: Record<Stage, string> = {
  none: "None",
  wishlist: "Wishlist",
  oa: "OA",
  hr_interview: "HR Interview",
  round_2: "Round 2",
  round_3: "Round 3",
  round_4: "Round 4",
  round_5: "Round 5",
  onsite: "On Site / Final Round",
  offer: "Offer",
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
  stage: Stage;
  source: Source;
  coverLetter: boolean;
  appliedDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};
