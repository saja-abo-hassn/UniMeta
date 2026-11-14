import { apiClient, LaravelResponse } from "../api-client";
import { InvitationDetails, InvitationsServiceContract } from "./types";

export class RealInvitationsService implements InvitationsServiceContract {
  async get(token: string): Promise<LaravelResponse<InvitationDetails>> {
    const response=await apiClient.get<InvitationDetails>(`/invitations/${token}`);
    return {...response,data:response.data?{...response.data,role:"moderator",status:"دعوة معلّقة",isExpired:false}:null};
  }

  async accept(token: string, password: string): Promise<LaravelResponse<{ email: string }>> {
    return apiClient.post<{ email: string }>(`/invitations/${token}/accept`, { password });
  }
}

