import { apiClient, LaravelResponse } from "./api-client";
import { MOCK_STUDY_PLAN_COURSES, MockPlanCourse } from "./mock-backend/mock-plans";

class PlansService {
  async getStudyPlan(): Promise<LaravelResponse<MockPlanCourse[]>> {
    if (!apiClient.isUsingMock()) {
      return apiClient.get<MockPlanCourse[]>("/student/study-plan");
    }

    // Mock Backend:
    await new Promise((res) => setTimeout(res, 150));
    return apiClient.createSuccessResponse(
      MOCK_STUDY_PLAN_COURSES,
      "تم استرجاع الخطة الدراسية بنجاح."
    );
  }
}

export const plansService = new PlansService();

