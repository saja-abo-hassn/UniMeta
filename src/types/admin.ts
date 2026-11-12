export type AdminRole = "super_admin" | "moderator";

export type AdminPermission =
  | "manage_content"
  | "manage_agreements"
  | "manage_exams"
  | "manage_finances"
  | "manage_reports"
  | "manage_members"
  | "manage_moderators"
  | "manage_settings";

export type ModeratorStatus = "نشط" | "معطل" | "دعوة معلّقة";

export interface ModeratorUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  title?: string | null;
  avatar?: string;
  avatarUrl?: string | null;
  assignedDepartment: string;
  status: ModeratorStatus;
  inviteToken?: string;
  inviteExpiresAt?: string;
  invitedAt?: string;
  createdAt: string;
  permissions: Record<AdminPermission, boolean>;
}

export type ContentCategory =
  | "الكتب"
  | "الملخصات"
  | "النماذج السابقة"
  | "الفيديوهات"
  | "summaries"
  | "lectures"
  | "resources"
  | "exams"
  | "other"
  | string;

export type ContentStatus = "منشور" | "مسودة" | "قيد المراجعة" | "مرفوض";

export interface CourseMaterialItem {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  title: string;
  category: ContentCategory;
  fileType: "PDF" | "DOCX" | "SLIDES" | "IMAGE" | "ZIP" | "VIDEO" | "LINK";
  fileSize: string;
  downloads: number;
  author: string;
  studentName?: string;
  fileName?: string;
  date: string;
  status: ContentStatus;
  description?: string;
  url?: string;
  isFeatured?: boolean;
}

export interface AdminCourse {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  college: string;
  level: string;
  semester: string;
  instructor: string;
  materialsCount: number;
}

export type AdminAgreementStatus = "قيد الانتظار" | "موافق عليها" | "مرفوضة" | "طلب تعديل";

export interface AdminAgreementItem {
  id: string;
  title: string;
  category: "أجهزة" | "كتب ومراجع";
  requesterId?: string;
  requesterName: string;
  requesterMajor: string;
  ownerId?: string;
  ownerName: string;
  ownerMajor: string;
  startDate: string;
  returnDeadline: string;
  depositAmount: number;
  dailyRate?: number;
  status: AdminAgreementStatus;
  createdAt: string;
  notes?: string;
  rejectionReason?: string;
  modificationNote?: string;
  attachments?: string[];
  signatureUrl?: string;
  pledgeVersion?: string;
  pledgeText?: string;
  agreedAt?: string;
  timeline?: Array<{
    title: string;
    date: string;
    description: string;
    status: "completed" | "current" | "pending";
  }>;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  category: "agreement" | "report" | "content" | "system";
  createdAt: string;
  read: boolean;
  link?: string;
  targetRole: "all" | "super_admin" | "moderator";
}

export interface AdminExamItem {
  id: string;
  courseCode: string;
  courseName: string;
  examType: "نصفي" | "نهائي" | "عملي";
  date: string;
  time: string;
  hall: string;
  instructor: string;
  studentsCount: number;
  status: "مجدول" | "قيد الانعقاد" | "مكتمل";
}

export interface AdminReportItem {
  id: string;
  targetType: "محتوى" | "تعليق" | "اتفاقية" | "مستخدم";
  targetTitle: string;
  reportedBy: string;
  reportedUser?: string;
  reason: string;
  createdAt: string;
  status: "مفتوح" | "قيد المعالجة" | "مغلق";
  actionTaken?: string;
  contentSnippet?: string;
}

export interface AdminPaymentItem {
  id: string;
  studentId: string;
  studentName: string;
  major: string;
  college?: string;
  amount: number;
  semester: string;
  paymentDate: string;
  paymentMethod?: string;
  method?: string;
  status: "مكتمل" | "قيد المعالجة" | "ملغي" | "معلق";
  transactionRef: string;
}

export interface AdminMemberItem {
  id: string;
  studentId: string;
  name: string;
  email: string;
  major: string;
  college: string;
  joinedDate: string;
  lastActive: string;
  status: "نشط" | "معلق" | "محظور";
  borrowedItemsCount: number;
}

export interface AdminSettingsData {
  platformName: string;
  academicYear: string;
  currentSemester: string;
  allowStudentUploads: boolean;
  maintenanceMode: boolean;
  requireAdminApprovalForAgreements: boolean;
  supportEmail: string;
}

export interface AdminContextValue {
  currentUser: ModeratorUser;
  switchRole: (role: AdminRole) => void;
  updateAdminProfile: (updates: { name?: string; title?: string | null; avatarUrl?: string | null }) => void;
  hasPermission: (permission: AdminPermission) => boolean;

  moderators: ModeratorUser[];
  addModerator: (mod: Omit<ModeratorUser, "id" | "createdAt">) => void;
  updateModeratorPermissions: (modId: string, perms: Record<AdminPermission, boolean>) => void;
  toggleModeratorStatus: (modId: string) => void;
  deleteModerator: (modId: string) => void;

  courses: AdminCourse[];
  materials: CourseMaterialItem[];
  addMaterial: (
    item: Omit<CourseMaterialItem, "id" | "date" | "downloads" | "courseId" | "courseCode"> & {
      courseId?: string;
      courseCode?: string;
    }
  ) => void;
  updateMaterial: (id: string, updates: Partial<CourseMaterialItem>) => void;
  deleteMaterial: (id: string) => void;
  toggleMaterialStatus: (id: string, status: ContentStatus) => void;

  agreements: AdminAgreementItem[];
  approveAgreement: (id: string) => void;
  rejectAgreement: (id: string, reason: string) => void;
  requestAgreementModification: (id: string, note: string) => void;

  exams: AdminExamItem[];
  addExam: (exam: Omit<AdminExamItem, "id">) => void;
  updateExam: (id: string, updates: Partial<AdminExamItem>) => void;
  deleteExam: (id: string) => void;

  reports: AdminReportItem[];
  updateReportStatus: (id: string, status: "مفتوح" | "قيد المعالجة" | "مغلق", action?: string) => void;
  deleteReport: (id: string) => void;

  payments: AdminPaymentItem[];
  addPayment: (payment: Omit<AdminPaymentItem, "id">) => void;

  members: AdminMemberItem[];
  updateMemberStatus: (id: string, status: "نشط" | "معلق" | "محظور") => void;

  settings: AdminSettingsData;
  updateSettings: (updates: Partial<AdminSettingsData>) => void;

  notifications: AdminNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;
}
