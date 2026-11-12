import { apiClient } from "../api-client";
import { ModeratorsServiceContract } from "./types";
import { MockModeratorsService } from "./mock-moderators-service";
import { RealModeratorsService } from "./real-moderators-service";

export * from "./types";

export const moderatorsService: ModeratorsServiceContract = apiClient.isUsingMock()
  ? new MockModeratorsService()
  : new RealModeratorsService();

