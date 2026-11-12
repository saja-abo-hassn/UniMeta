export interface StudentTaskItem {
  id: string;
  title: string;
  dueDate?: string;
  courseCode?: string;
  courseName?: string;
  completed: boolean;
  createdAt: string;
}

export function formatDateDisplay(dateStr?: string): string | null {
  if (!dateStr) return null;
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

