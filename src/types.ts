export type Role = "student" | "organization" | "admin";
export type Status = "pending" | "approved" | "rejected";
export type AppStatus =
  | "submitted"
  | "under_review"
  | "accepted"
  | "not_selected";

export type Profile = {
  id: string;
  full_name: string | null;
  role: Role;
  province: string | null;
  organization_name: string | null;
  verified: boolean;
  institution: string | null;
  field_of_study: string | null;
  year_of_study: string | null;
};

export type Opportunity = {
  id: string;
  owner_id: string | null;
  title: string;
  organization: string;
  org_type: string;
  category: string;
  province: string;
  description: string;
  deadline: string;
  apply_url: string;
  country: string | null;
  amount_usd: number | null;
  status: Status;
  created_at: string;
  eligibility?: string | null;
  how_to_apply?: string | null;
  contact?: string | null;
  rejection_reason?: string | null;
};

export type Application = {
  id: string;
  opportunity_id: string;
  student_id: string;
  note: string | null;
  contact: string | null;
  status: AppStatus;
  created_at: string;
};
