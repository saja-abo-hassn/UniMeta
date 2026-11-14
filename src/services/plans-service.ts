import { apiClient, LaravelResponse } from "./api-client";
import { MOCK_STUDY_PLAN_COURSES, MockPlanCourse } from "./mock-backend/mock-plans";
import { academicService } from "./academic-service";

class PlansService {
  async getStudyPlan(): Promise<LaravelResponse<MockPlanCourse[]>> {
    if (!apiClient.isUsingMock()) {
      try {
        const data = await academicService.load();
        const plan = data.plans.find(p=>p.id===data.selectedPlanId);
        return apiClient.createSuccessResponse((plan?.courses??[]).map(c=>({code:c.code,name:c.name,hours:c.credits,grade:data.grades[c.code],status:data.grades[c.code]>=60?"completed" as const:"remaining" as const,semester:String(c.semester),year:Math.ceil(c.semester/2)})));
      } catch (error) { return apiClient.createErrorResponse<MockPlanCourse[]>((error as Error).message, {api:["تعذر تحميل الخطة"]}, null); }
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

