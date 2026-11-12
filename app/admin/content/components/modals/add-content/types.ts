import { ContentStatus } from "@/src/contexts/admin-context";
import { MainCategoryType } from "../../../types";

export type EducationalMaterialType = "ملخص" | "شرح" | "مصدر" | "امتحان";

export interface ContentUploadState {
  file: File | null;
  fileName: string;
  fileSizeFormatted: string;
  fileSizeBytes: number;
  fileTypeDetected: "PDF" | "DOCX" | "SLIDES" | "IMAGE" | "ZIP" | "VIDEO" | "LINK";
  progress: number;
  isUploading: boolean;
  error?: string;
}

export interface ContentFormValues {
  courseId: string;
  courseName: string;
  courseCode: string;
  type: EducationalMaterialType;
  category: MainCategoryType;
  title: string;
  description: string;
  author: string;
  status: ContentStatus;
  url: string;
}

export interface ContentFormErrors {
  courseId?: string;
  title?: string;
  file?: string;
  general?: string;
}

