import { apiClient } from "../api-client";
import { InvitationsServiceContract } from "./types";
import { MockInvitationsService } from "./mock-invitations-service";
import { RealInvitationsService } from "./real-invitations-service";

export * from "./types";

export const invitationsService: InvitationsServiceContract = apiClient.isUsingMock()
  ? new MockInvitationsService()
  : new RealInvitationsService();

