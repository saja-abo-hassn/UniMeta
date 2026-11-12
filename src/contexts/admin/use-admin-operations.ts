"use client";

import { useState, useCallback } from "react";
import { useNotifications } from "../notifications-context";
import {
  AdminAgreementItem,
  AdminReportItem,
  AdminPaymentItem,
  AdminMemberItem,
  AdminSettingsData,
} from "@/src/types/admin";
import {
  initialAgreementsList,
  initialReportsList,
  initialPaymentsList,
  initialMembersList,
  initialSettingsData,
} from "@/src/data/mock-admin-data";

export function useAdminOperations() {
  const { notify } = useNotifications();

  const [agreements, setAgreements] = useState<AdminAgreementItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("unimeta_admin_agreements_v1");
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return initialAgreementsList;
  });

  const [reports, setReports] = useState<AdminReportItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("unimeta_admin_reports_v1");
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return initialReportsList;
  });

  const [payments, setPayments] = useState<AdminPaymentItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("unimeta_admin_payments_v1");
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return initialPaymentsList;
  });

  const [members, setMembers] = useState<AdminMemberItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("unimeta_admin_members_v1");
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return initialMembersList;
  });

  const [settings, setSettings] = useState<AdminSettingsData>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("unimeta_admin_settings_v1");
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return initialSettingsData;
  });

  const approveAgreement = useCallback(
    (id: string) => {
      setAgreements((prev) =>
        prev.map((agr) =>
          agr.id === id ? { ...agr, status: "موافق عليها" } : agr
        )
      );
      notify({
        type: "general",
        title: "تمت الموافقة على الاتفاقية بنجاح! 🤝",
        message: `تم اعتماد الاتفاقية رقم ${id} وإشعار الأطراف المعنية مباشرة.`,
        playSound: true,
      });
    },
    [notify]
  );

  const rejectAgreement = useCallback(
    (id: string, reason: string) => {
      setAgreements((prev) =>
        prev.map((agr) =>
          agr.id === id ? { ...agr, status: "مرفوضة", rejectionReason: reason } : agr
        )
      );
      notify({
        type: "general",
        title: "تم رفض الاتفاقية",
        message: `تم رفض الاتفاقية رقم ${id} مع إرفاق سبب الرفض للطرفين.`,
        playSound: false,
      });
    },
    [notify]
  );

  const requestAgreementModification = useCallback(
    (id: string, note: string) => {
      setAgreements((prev) =>
        prev.map((agr) =>
          agr.id === id ? { ...agr, status: "طلب تعديل", modificationNote: note } : agr
        )
      );
      notify({
        type: "general",
        title: "تم إرسال طلب تعديل للاتفاقية 📝",
        message: `تم إشعار أطراف الاتفاقية ${id} بالملاحظات المطلوبة.`,
        playSound: false,
      });
    },
    [notify]
  );

  const updateReportStatus = useCallback(
    (id: string, status: "مفتوح" | "قيد المعالجة" | "مغلق", action?: string) => {
      setReports((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status, actionTaken: action || r.actionTaken } : r
        )
      );
      notify({
        type: "general",
        title: "تم تحديث حالة البلاغ",
        message: `تم تغيير حالة البلاغ ${id} إلى "${status}".`,
        playSound: false,
      });
    },
    [notify]
  );

  const deleteReport = useCallback((id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const addPayment = useCallback((payment: Omit<AdminPaymentItem, "id">) => {
    const newPay: AdminPaymentItem = {
      ...payment,
      id: `pay-${Date.now()}`,
    };
    setPayments((prev) => [newPay, ...prev]);
  }, []);

  const updateMemberStatus = useCallback(
    (id: string, status: "نشط" | "معلق" | "محظور") => {
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status } : m))
      );
      notify({
        type: "general",
        title: "تم تحديث حالة العضو",
        message: `تم تحديث حالة حساب الطالب إلى "${status}".`,
        playSound: false,
      });
    },
    [notify]
  );

  const updateSettings = useCallback(
    (updates: Partial<AdminSettingsData>) => {
      setSettings((prev) => ({ ...prev, ...updates }));
      notify({
        type: "general",
        title: "تم حفظ إعدادات المنصة بنجاح ✅",
        message: "تم تطبيق التغييرات على النظام والمنصة مباشرة.",
        playSound: true,
      });
    },
    [notify]
  );

  return {
    agreements,
    approveAgreement,
    rejectAgreement,
    requestAgreementModification,
    reports,
    updateReportStatus,
    deleteReport,
    payments,
    addPayment,
    members,
    updateMemberStatus,
    settings,
    updateSettings,
  };
}

