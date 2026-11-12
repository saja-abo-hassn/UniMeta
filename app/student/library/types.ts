export type LibraryCategory = "books" | "summaries" | "exams" | "other";

export interface LibraryFile {
  id: string;
  title: string;
  category: LibraryCategory;
  author: string;
  fileType: "PDF" | "SLIDES" | "ZIP" | "VIDEO";
  fileSize: string;
  downloads: number;
  date: string;
  description?: string;
  url?: string;
}

export interface LibraryCourse {
  code: string;
  nameAr: string;
  nameEn: string;
  instructor: string;
  level: string;
  semester: string;
  files: LibraryFile[];
}
