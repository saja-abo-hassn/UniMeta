import { apiClient, LaravelResponse } from "./api-client";
import { MOCK_MATERIALS, MockMaterial } from "./mock-backend/mock-materials";
import { requireData } from "./api-result";
import type { components } from "../../types/api";

export interface StudentLibraryCatalog {
  subjects: components["schemas"]["StudentLibrarySubject"][];
  materials: MockMaterial[];
}

class MaterialsService {
  async getLibraryCatalog(): Promise<LaravelResponse<StudentLibraryCatalog>> {
    if (apiClient.isUsingMock()) {
      return apiClient.createSuccessResponse({ subjects: [], materials: MOCK_MATERIALS });
    }

    try {
      const subjects = requireData(
        await apiClient.all<components["schemas"]["StudentLibrarySubject"]>("/library/subjects")
      );
      const resources = await Promise.all(subjects.map(async (subject) => {
        const items = requireData(
          await apiClient.all<components["schemas"]["StudentLibraryResource"]>(`/library/subjects/${subject.id}/resources`)
        );
        return items.map((resource) => ({
          id: String(resource.id),
          title: resource.title,
          courseName: subject.subject_name,
          courseCode: subject.subject_code,
          category: ({
            SUMMARY: "الملخصات",
            LECTURE: "المحاضرات",
            STUDY_NOTE: "الملاحظات الدراسية",
            EXAM_MODEL: "النماذج السابقة",
            APPROVED_REFERENCE: "المراجع",
            AUTHORIZED_DIGITAL_BOOK: "الكتب",
          } as Record<string, MockMaterial["category"]>)[resource.resource_type] ?? "المراجع",
          fileType: resource.mime_type,
          fileSize: `${(resource.file_size / 1024 / 1024).toFixed(2)} MB`,
          date: resource.created_at,
        }));
      }));
      return apiClient.createSuccessResponse({ subjects, materials: resources.flat() });
    } catch (error) {
      return apiClient.createErrorResponse<StudentLibraryCatalog>(
        (error as Error).message,
        { api: ["تعذر تحميل المكتبة"] },
        null
      );
    }
  }

  async getMaterials(category?: string): Promise<LaravelResponse<MockMaterial[]>> {
    if (!apiClient.isUsingMock()) {
      try {
        const subjects=requireData(await apiClient.all<{id:number;subject_name:string;subject_code:string}>("/library/subjects"));
        const categories:Record<string,MockMaterial["category"]>={SUMMARY:"الملخصات",LECTURE:"المحاضرات",STUDY_NOTE:"الملاحظات الدراسية",EXAM_MODEL:"النماذج السابقة",APPROVED_REFERENCE:"المراجع",AUTHORIZED_DIGITAL_BOOK:"الكتب"};
        const lists=await Promise.all(subjects.map(async s=>{
          const resources=requireData(await apiClient.all<{id:number;title:string;resource_type:string;mime_type:string;file_size:number;created_at:string}>(`/library/subjects/${s.id}/resources`));
          return resources.map(r=>({id:String(r.id),title:r.title,courseName:s.subject_name,courseCode:s.subject_code,category:categories[r.resource_type]??"المراجع",fileType:r.mime_type,fileSize:`${(r.file_size/1024/1024).toFixed(2)} MB`,date:r.created_at}));
        }));
        const items=lists.flat();
        return apiClient.createSuccessResponse(category&&category!=="all"?items.filter(m=>m.category===category):items);
      } catch(error) {return apiClient.createErrorResponse<MockMaterial[]>((error as Error).message,{api:["تعذر تحميل المكتبة"]},null);}
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

