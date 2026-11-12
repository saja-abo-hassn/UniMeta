import { apiClient, LaravelResponse } from "./api-client";
import { MOCK_MATERIALS, MockMaterial } from "./mock-backend/mock-materials";

class MaterialsService {
  async getMaterials(category?: string): Promise<LaravelResponse<MockMaterial[]>> {
    if (!apiClient.isUsingMock()) {
      const query = category ? `?category=${encodeURIComponent(category)}` : "";
      return apiClient.get<MockMaterial[]>(`/materials${query}`);
    }

    // Mock Backend:
    await new Promise((res) => setTimeout(res, 150));
    let items = MOCK_MATERIALS;
    if (category && category !== "all") {
      items = items.filter((m) => m.category === category);
    }
    return apiClient.createSuccessResponse(items, "تم استرجاع المواد والمصادر بنجاح.");
  }
}

export const materialsService = new MaterialsService();

