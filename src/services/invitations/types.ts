import { LaravelResponse } from "../api-client";

export interface InvitationDetails {
  name: string;
  email: string;
  title: string;
  assignedDepartment: string;
  role: "moderator";
  expiresAt: string;
  isExpired: boolean;
  status: "نشط" | "معطل" | "دعوة معلّقة";
}

export interface InvitationsServiceContract {
  get(token: string): Promise<LaravelResponse<InvitationDetails>>;
  accept(token: string, password: string): Promise<LaravelResponse<{ email: string }>>;
}

