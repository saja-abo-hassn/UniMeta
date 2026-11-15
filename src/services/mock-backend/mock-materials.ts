export interface MockMaterial {
  id: string;
  courseName: string;
  courseCode: string;
  title: string;
  category: "الكتب" | "الملخصات" | "النماذج السابقة" | "الفيديوهات" | "المحاضرات" | "الملاحظات الدراسية" | "المراجع";
  fileType: string;
  fileSize: string;
  downloads?: number;
  author?: string;
  date: string;
}

export const MOCK_MATERIALS: MockMaterial[] = [
  {
    id: "mat-1",
    courseName: "هندسة البرمجيات المتقدمة",
    courseCode: "ENCS3310",
    title: "كتاب هندسة البرمجيات المعتمد (Ian Sommerville - 10th Edition)",
    category: "الكتب",
    fileType: "PDF",
    fileSize: "28.4 MB",
    downloads: 480,
    author: "Ian Sommerville",
    date: "2026-02-15",
  },
  {
    id: "mat-2",
    courseName: "هندسة البرمجيات المتقدمة",
    courseCode: "ENCS3310",
    title: "ملخص شامل لأنماط التصميم (Design Patterns) مع أمثلة جافا",
    category: "الملخصات",
    fileType: "PDF",
    fileSize: "4.8 MB",
    downloads: 620,
    author: "ريم النجار",
    date: "2026-03-01",
  },
  {
    id: "mat-3",
    courseName: "هندسة البرمجيات المتقدمة",
    courseCode: "ENCS3310",
    title: "نماذج امتحانات نصفية (Midterm) مع الحلول 2023 - 2025",
    category: "النماذج السابقة",
    fileType: "PDF",
    fileSize: "7.6 MB",
    downloads: 750,
    author: "د. سارة الخطيب",
    date: "2026-03-05",
  },
  {
    id: "mat-4",
    courseName: "تراكيب البيانات والخوارزميات",
    courseCode: "ENCS2301",
    title: "شرح مصور: خوارزميات الرسوم البيانية (Graph Traversal BFS & DFS)",
    category: "الفيديوهات",
    fileType: "VIDEO",
    fileSize: "145 MB",
    downloads: 390,
    author: "م. طارق الزهار",
    date: "2026-02-22",
  },
];

