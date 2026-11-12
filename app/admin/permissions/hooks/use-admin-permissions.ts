"use client";

import { useState, useMemo, useCallback } from "react";
import { useAdmin, ModeratorUser, AdminPermission, AdminRole } from "@/src/contexts/admin-context";
import { moderatorsService } from "@/src/services/moderators";
import { PermissionsFormData } from "../components/permissions-modals";

export function useAdminPermissions() {
  const {
    currentUser,
    moderators,
    addModerator,
    updateModeratorPermissions,
    toggleModeratorStatus,
    deleteModerator,
  } = useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<ModeratorUser | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastCreatedInvite, setLastCreatedInvite] = useState<{
    moderator: ModeratorUser;
    inviteUrl: string;
    token: string;
  } | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const [formData, setFormData] = useState<PermissionsFormData>({
    name: "",
    email: "",
    title: "مشرف أكاديمي",
    role: "moderator" as AdminRole,
    assignedDepartment: "إدارة المحتوى الأكاديمي",
    permissions: {
      manage_content: true,
      manage_agreements: false,
      manage_exams: false,
      manage_finances: false,
      manage_reports: true,
      manage_members: false,
      manage_moderators: false,
      manage_settings: false,
    } as Record<AdminPermission, boolean>,
  });
  const [formError, setFormError] = useState("");

  const counts = useMemo(() => {
    return {
      total: moderators.length,
      superAdmins: moderators.filter((m) => m.role === "super_admin").length,
      moderators: moderators.filter((m) => m.role === "moderator").length,
      active: moderators.filter((m) => m.status === "نشط").length,
      pending: moderators.filter((m) => m.status === "دعوة معلّقة").length,
    };
  }, [moderators]);

  const filteredModerators = useMemo(() => {
    if (!searchQuery.trim()) return moderators;
    const q = searchQuery.trim().toLowerCase();
    return moderators.filter((m) =>
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.assignedDepartment.toLowerCase().includes(q)
    );
  }, [moderators, searchQuery]);

  const handleTogglePermission = (mod: ModeratorUser, permKey: AdminPermission) => {
    if (mod.role === "super_admin") return;

    const currentVal = !!mod.permissions[permKey];
    const updated = {
      ...mod.permissions,
      [permKey]: !currentVal,
    };
    updateModeratorPermissions(mod.id, updated);
  };

  const copyInviteUrl = useCallback((url: string, tokenKey: string = "default") => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedToken(tokenKey);
        setTimeout(() => setCopiedToken(null), 3000);
      });
    }
  }, []);

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError("يرجى إدخال اسم المشرف وبريده الإلكتروني.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      const res = await moderatorsService.invite({
        name: formData.name.trim(),
        email: formData.email.trim(),
        title: formData.title.trim() || "مشرف أكاديمي",
        assignedDepartment: formData.assignedDepartment.trim(),
        permissions: formData.permissions,
      });

      if (res.errors || !res.data) {
        setFormError(res.message || "حدث خطأ أثناء إرسال الدعوة.");
        setIsSubmitting(false);
        return;
      }

      addModerator(res.data.moderator);

      console.log("%c[UniMeta] رابط دعوة المشرف:", "color: #0057C8; font-weight: bold; font-size: 14px;");
      console.log("المشرف:", res.data.moderator.name);
      console.log("البريد:", res.data.moderator.email);
      console.log("الرابط (صالح 48 ساعة):", res.data.inviteUrl);

      setLastCreatedInvite({
        moderator: res.data.moderator,
        inviteUrl: res.data.inviteUrl,
        token: res.data.token,
      });

      setIsAddModalOpen(false);
      setFormData({
        name: "",
        email: "",
        title: "مشرف أكاديمي",
        role: "moderator",
        assignedDepartment: "إدارة المحتوى الأكاديمي",
        permissions: {
          manage_content: true,
          manage_agreements: false,
          manage_exams: false,
          manage_finances: false,
          manage_reports: true,
          manage_members: false,
          manage_moderators: false,
          manage_settings: false,
        },
      });
      setFormError("");
    } catch {
      setFormError("حدث خطأ في الاتصال أثناء إنشاء الدعوة.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentUser,
    moderators,
    counts,
    filteredModerators,
    searchQuery,
    setSearchQuery,
    isAddModalOpen,
    setIsAddModalOpen,
    deleteCandidate,
    setDeleteCandidate,
    formData,
    setFormData,
    formError,
    setFormError,
    isSubmitting,
    lastCreatedInvite,
    setLastCreatedInvite,
    copiedToken,
    copyInviteUrl,
    handleTogglePermission,
    handleSubmitAdd,
    toggleModeratorStatus,
    deleteModerator,
  };
}
