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

export const STAGES = [
  "applied",
  "oa",
  "hr_screen",
  "technical_interview",
  "round_2",
  "round_3",
  "onsite",
  "offer",
] as const;

export type Stage = (typeof STAGES)[number];

export const STAGE_LABELS: Record<Stage, string> = {
  applied: "Applied",
  oa: "Online Assessment (OA)",
  hr_screen: "HR / Recruiter Screen",
  technical_interview: "Technical Interview",
  round_2: "Round 2",
  round_3: "Round 3",
  onsite: "Onsite / Final Round",
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
  stage: Stage | null;
  source: Source;
  coverLetter: boolean;
  appliedDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};
