/** Mock-only records live here and are never imported by the real transport. */
export type MockStudent = {
  id: string;
  name: string;
  university: string;
  major: string;
};

export const mockStudent: MockStudent = {
  id: "student-001",
  name: "ليان أحمد",
  university: "جامعة النجاح الوطنية",
  major: "هندسة الحاسوب",
};
