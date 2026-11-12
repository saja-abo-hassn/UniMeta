import { apiClient, LaravelResponse } from "../api-client";
import { InvitationDetails, InvitationsServiceContract } from "./types";

export class RealInvitationsService implements InvitationsServiceContract {
  async get(token: string): Promise<LaravelResponse<InvitationDetails>> {
    return apiClient.get<InvitationDetails>(`/invitations/${token}`);
  }

  async accept(token: string, password: string): Promise<LaravelResponse<{ email: string }>> {
    return apiClient.post<{ email: string }>(`/invitations/${token}/accept`, { password });
  }
}

