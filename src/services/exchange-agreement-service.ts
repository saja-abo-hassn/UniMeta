import { STUDENT_PROFILES_DATABASE, VerifiedStudentParty, recordAgreementAuditLog } from "./student-verification-service";
import { AdminAgreementItem } from "../contexts/admin-context";
import {
  StudentKycData,
  ExchangeRequestPayload,
  OutgoingAgreementRequest,
} from "../types/exchange-agreement";
import {
  STORAGE_SAVED_KYC_KEY,
  STORAGE_OUTGOING_REQUESTS_KEY,
  STORAGE_ADMIN_AGREEMENTS_KEY,
  STORAGE_ADMIN_NOTIFICATIONS_KEY,
  calculateDeadline,
} from "../lib/exchange-kyc-utils";

export type {
  StudentKycData,
  AgreementSignature,
  AgreementPledge,
  ExchangeRequestPayload,
  OutgoingAgreementRequest,
} from "../types/exchange-agreement";

export {
  STORAGE_SAVED_KYC_KEY,
  STORAGE_OUTGOING_REQUESTS_KEY,
  STORAGE_ADMIN_AGREEMENTS_KEY,
  STORAGE_ADMIN_NOTIFICATIONS_KEY,
  STORAGE_PHONE_OTPS_KEY,
  OFFICIAL_PLEDGE_VERSION,
  OFFICIAL_PLEDGE_TEXT,
  validateNationalId,
  validatePhone,
  maskNationalId,
  maskPhone,
  validateSignatureFile,
} from "../lib/exchange-kyc-utils";

export { sendPhoneOtp, verifyPhoneOtp } from "./exchange-otp-service";

export function getSavedStudentKyc(defaultStudentId?: string): StudentKycData | null {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_SAVED_KYC_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.nationalId && parsed.phone) return parsed;
      }
    } catch {
      // ignore
    }
  }

  if (defaultStudentId) {
    const student = Object.values(STUDENT_PROFILES_DATABASE).find(
      (s) => s.studentId === defaultStudentId || s.id === defaultStudentId
    );
    if (student) {
      return {
        nationalId: student.nationalId,
        maskedNationalId: student.maskedNationalId,
        phone: student.phone,
        maskedPhone: student.maskedPhone,
        studentId: student.studentId,
        fullName: student.name,
        college: student.college,
        major: student.major,
        isPhoneVerified: true,
      };
    }
  }

  return null;
}

export function saveStudentKyc(data: StudentKycData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_SAVED_KYC_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export async function submitExchangeAgreementRequest(payload: ExchangeRequestPayload): Promise<{
  success: boolean;
  agreementId: string;
  message: string;
  error?: string;
}> {
  await new Promise((res) => setTimeout(res, 400));

  if (!payload.signature?.dataUrl) {
    return { success: false, agreementId: "", message: "التوقيع إجباري لاعتماد الطلب.", error: "التوقيع مفقود." };
  }

  if (!payload.pledge?.agreed) {
    return { success: false, agreementId: "", message: "يجب الموافقة على التعهد والمسؤولية الأكاديمية.", error: "التعهد غير معتمد." };
  }

  const isModification = !!payload.existingAgreementId;
  const targetId = payload.existingAgreementId || `AGR-2026-${Math.floor(100 + Math.random() * 900)}`;
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];
  const timeStr = now.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });

  saveStudentKyc(payload.studentKyc);

  const outgoingItem: OutgoingAgreementRequest = {
    id: targetId,
    itemName: payload.itemName,
    category: payload.itemType,
    ownerName: payload.ownerName,
    ownerMajor: payload.ownerMajor,
    requestedDuration: payload.durationText || `${payload.durationDays || 7} أيام`,
    proposedStartDate: payload.proposedStartDate || dateStr,
    deposit: payload.depositAmount,
    status: "قيد المراجعة",
    requestDate: `${dateStr} (${timeStr})`,
    signatureUrl: payload.signature.dataUrl,
    pledgeVersion: payload.pledge.pledgeVersion,
    studentKyc: payload.studentKyc,
  };

  if (typeof window !== "undefined") {
    try {
      const storedOutgoing = localStorage.getItem(STORAGE_OUTGOING_REQUESTS_KEY);
      let outgoingList: OutgoingAgreementRequest[] = storedOutgoing ? JSON.parse(storedOutgoing) : [];
      if (isModification) {
        outgoingList = outgoingList.map((r) => (r.id === targetId ? outgoingItem : r));
      } else {
        outgoingList.unshift(outgoingItem);
      }
      localStorage.setItem(STORAGE_OUTGOING_REQUESTS_KEY, JSON.stringify(outgoingList));

      const storedAdminAgreements = localStorage.getItem(STORAGE_ADMIN_AGREEMENTS_KEY);
      let adminList: AdminAgreementItem[] = storedAdminAgreements ? JSON.parse(storedAdminAgreements) : [];

      const requesterProfileId = `std-${payload.studentKyc.studentId || Date.now()}`;

      if (isModification) {
        adminList = adminList.map((agr) => {
          if (agr.id === targetId) {
            const currentTimeline = agr.timeline || [];
            return {
              ...agr,
              status: "قيد الانتظار" as const,
              modificationNote: undefined,
              signatureUrl: payload.signature.dataUrl,
              pledgeVersion: payload.pledge.pledgeVersion,
              pledgeText: payload.pledge.pledgeText,
              agreedAt: payload.pledge.agreedAt,
              timeline: [
                ...currentTimeline,
                {
                  title: "إعادة إرسال بعد التعديل",
                  date: `${dateStr} ${timeStr}`,
                  description: "تم استلام التعديلات المطلوبة وتحديث التوقيع والبيانات من الطالب.",
                  status: "completed" as const,
                },
                {
                  title: "مراجعة واعتماد المشرف",
                  date: "الآن",
                  description: "بانتظار تدقيق التعديلات والقرار الإداري من المشرف.",
                  status: "current" as const,
                },
              ],
            };
          }
          return agr;
        });

        recordAgreementAuditLog(
          payload.studentKyc.fullName,
          "طالب",
          targetId,
          "إعادة إرسال الاتفاقية بعد تعديل البيانات وتحديث التوقيع",
          payload.ownerName,
          payload.studentKyc.studentId
        );
      } else {
        const newAdminAgreement: AdminAgreementItem = {
          id: targetId,
          title: `${payload.itemType === "أجهزة" ? "استئجار جهاز" : "استعارة كتاب"}: ${payload.itemName}`,
          category: payload.itemType,
          requesterId: requesterProfileId,
          requesterName: payload.studentKyc.fullName || "طالب معتمد",
          requesterMajor: payload.studentKyc.major || "كلية الهندسة وتكنولوجيا المعلومات",
          ownerName: payload.ownerName,
          ownerMajor: payload.ownerMajor,
          startDate: payload.proposedStartDate || dateStr,
          returnDeadline: calculateDeadline(payload.proposedStartDate || dateStr, payload.durationDays || 7),
          depositAmount: payload.depositAmount,
          dailyRate: payload.dailyRate,
          status: "قيد الانتظار",
          createdAt: `${dateStr} ${timeStr}`,
          notes: payload.notes || `تم التوقيع الإلكتروني بنجاح (${payload.signature.type === "canvas" ? "رسم مباشر" : "رفع صورة"}). موافقة التعهد ${payload.pledge.pledgeVersion}`,
          signatureUrl: payload.signature.dataUrl,
          pledgeVersion: payload.pledge.pledgeVersion,
          pledgeText: payload.pledge.pledgeText,
          agreedAt: payload.pledge.agreedAt,
          timeline: [
            {
              title: "تقديم الطلب والبيانات",
              date: `${dateStr} ${timeStr}`,
              description: "تم ملء بيانات الطالب والتأكد من رقم الهوية وتأكيد الجوال بالـ OTP وتوقيع التعهد إلكترونياً.",
              status: "completed",
            },
            {
              title: "مراجعة واعتماد المشرف",
              date: "الآن",
              description: "بانتظار تدقيق الهويات والضمان من قبل مشرف المنصة أو المشرف العام.",
              status: "current",
            },
          ],
        };

        adminList.unshift(newAdminAgreement);

        recordAgreementAuditLog(
          payload.studentKyc.fullName,
          "طالب",
          targetId,
          "إنشاء وتقديم طلب اتفاقية وتوقيع التعهد رسمياً",
          payload.ownerName,
          payload.studentKyc.studentId
        );
      }

      localStorage.setItem(STORAGE_ADMIN_AGREEMENTS_KEY, JSON.stringify(adminList));

      const verifiedParty: VerifiedStudentParty = {
        id: requesterProfileId,
        studentId: payload.studentKyc.studentId,
        name: payload.studentKyc.fullName,
        academicYear: "طالب منتظم",
        college: payload.studentKyc.college || "كلية الهندسة وتكنولوجيا المعلومات",
        major: payload.studentKyc.major || "هندسة البرمجيات",
        phone: payload.studentKyc.phone,
        maskedPhone: payload.studentKyc.maskedPhone,
        nationalId: payload.studentKyc.nationalId,
        maskedNationalId: payload.studentKyc.maskedNationalId,
        borrowingEligibility: "مؤهل للاستعارة • تم التحقق بالـ OTP والتعهد الخطي الموقّع",
        verificationStatus: {
          emailVerified: true,
          phoneVerified: true,
          studentCardVerified: true,
          idVerified: true,
          overallVerified: true,
          verificationDate: dateStr,
          reviewerName: "النظام الآلي (UniMeta Gate)",
        },
      };

      const cachedProfilesRaw = localStorage.getItem("unimeta_dynamic_student_profiles_v1");
      const cachedProfiles: Record<string, VerifiedStudentParty> = cachedProfilesRaw ? JSON.parse(cachedProfilesRaw) : {};
      cachedProfiles[requesterProfileId] = verifiedParty;
      localStorage.setItem("unimeta_dynamic_student_profiles_v1", JSON.stringify(cachedProfiles));

      const storedNotifications = localStorage.getItem(STORAGE_ADMIN_NOTIFICATIONS_KEY);
      const notificationsList = storedNotifications ? JSON.parse(storedNotifications) : [];
      notificationsList.unshift({
        id: `notif-${Date.now()}`,
        title: "طلب اتفاقية جديدة بانتظار المراجعة",
        message: `قدم الطالب ${payload.studentKyc.fullName} طلب استعارة "${payload.itemName}" من ${payload.ownerName}. يتطلب تدقيق التوقيع والتعهد.`,
        category: "agreement",
        createdAt: `${dateStr} ${timeStr}`,
        read: false,
        link: "/admin/agreements",
        targetRole: "all",
      });
      localStorage.setItem(STORAGE_ADMIN_NOTIFICATIONS_KEY, JSON.stringify(notificationsList));

      window.dispatchEvent(new Event("unimeta_agreements_updated"));
      window.dispatchEvent(new Event("unimeta_admin_agreements_updated"));
    } catch (e) {
      console.error("Failed to persist agreement:", e);
    }
  }

  return {
    success: true,
    agreementId: targetId,
    message: "تم إنشاء طلبك وتوقيع التعهد بنجاح، وهو الآن بانتظار موافقة المشرف.",
  };
}
