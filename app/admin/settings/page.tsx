"use client";

import React, { useState, useEffect } from "react";
import { useAdmin, AdminSettingsData } from "@/src/contexts/admin-context";
import { PermissionGuard } from "@/components/admin/permission-guard";

export default function AdminSettingsPage() {
  const { currentUser, settings, updateSettings, updateAdminProfile } = useAdmin();

  const [formData, setFormData] = useState<AdminSettingsData>({
    platformName: settings.platformName,
    academicYear: settings.academicYear,
    currentSemester: settings.currentSemester,
    allowStudentUploads: settings.allowStudentUploads,
    maintenanceMode: settings.maintenanceMode,
    requireAdminApprovalForAgreements: settings.requireAdminApprovalForAgreements,
    supportEmail: settings.supportEmail,
  });

  const [adminName, setAdminName] = useState(currentUser.name);
  const [adminTitle, setAdminTitle] = useState(currentUser.title || "");
  const [adminAvatarUrl, setAdminAvatarUrl] = useState(currentUser.avatarUrl || "");

  useEffect(() => {
    setAdminName(currentUser.name);
    setAdminTitle(currentUser.title || "");
    setAdminAvatarUrl(currentUser.avatarUrl || "");
  }, [currentUser]);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    updateAdminProfile({
      name: adminName.trim() || currentUser.name,
      title: adminTitle.trim() || null,
      avatarUrl: adminAvatarUrl.trim() || null,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  return (
    <PermissionGuard permission="manage_settings">
      <div className="space-y-6 animate-fade-in" dir="rtl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
              <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                تهيئة وإعداد النظام
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-ink tracking-tight">
              إعدادات المنصة وحساب الإدارة
            </h1>
            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed max-w-2xl">
              التحكم في المتغيرات العامة لمنصة UniMeta، فترات التسجيل، الفصول الدراسية، وسياسات الأمان والموافقات.
            </p>
          </div>

          {savedSuccess && (
            <div className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <span>✓</span>
              <span>تم حفظ الإعدادات والملف الشخصي وتطبيقها بنجاح!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div id="profile" className="p-6 sm:p-7 rounded-3xl bg-white border border-brand-border-soft shadow-xs space-y-5 scroll-mt-28">
            <div className="flex items-center gap-3 pb-3 border-b border-brand-border-soft">
              <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                👤
              </div>
              <div>
                <h2 className="text-base font-black text-brand-ink">
                  الملف الشخصي وإعدادات الحساب
                </h2>
                <span className="text-xs text-brand-muted">
                  تعديل الاسم والمنصب وصورة الحساب وتحديثها فوريًا عبر النظام
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-ink block">
                  الاسم الكامل للمسؤول <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="مثال: د. سارة محمد"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border-soft bg-white text-xs sm:text-sm font-semibold text-brand-ink focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-ink block">
                  المسمى الوظيفي
                </label>
                <input
                  type="text"
                  value={adminTitle}
                  onChange={(e) => setAdminTitle(e.target.value)}
                  placeholder="مثال: المسؤول العام أو مشرف أكاديمي"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border-soft bg-white text-xs sm:text-sm font-semibold text-brand-ink focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-brand-ink block">
                  رابط صورة الحساب الشخصي (Avatar URL)
                </label>
                <input
                  type="url"
                  dir="ltr"
                  value={adminAvatarUrl}
                  onChange={(e) => setAdminAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... أو اتركه فارغاً لعرض أول حرفين تلقائياً"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border-soft bg-white text-xs sm:text-sm font-mono text-brand-ink focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-brand-border-soft shadow-xs space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-brand-border-soft">
              <div className="w-10 h-10 rounded-xl bg-brand-surface-blue text-brand-primary flex items-center justify-center font-bold text-lg shrink-0">
                ⚙️
              </div>
              <div>
                <h2 className="text-base font-black text-brand-ink">
                  المعلومات والتقويم الأكاديمي العام
                </h2>
                <span className="text-xs text-brand-muted">
                  تظهر هذه البيانات في ترويسات ومسارات النظام للطلاب والمشرفين
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-ink block">
                  اسم المنصة الأكاديمية
                </label>
                <input
                  type="text"
                  required
                  value={formData.platformName}
                  onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border-soft bg-white text-xs sm:text-sm font-semibold text-brand-ink focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-ink block">
                  بريد الدعم الفني والمراسلات
                </label>
                <input
                  type="email"
                  required
                  value={formData.supportEmail}
                  onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border-soft bg-white text-xs sm:text-sm font-mono text-brand-ink focus:outline-none focus:border-brand-primary"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-ink block">
                  العام الأكاديمي النشط
                </label>
                <input
                  type="text"
                  required
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border-soft bg-white text-xs sm:text-sm font-semibold text-brand-ink focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-ink block">
                  الفصل الدراسي الحالي
                </label>
                <select
                  value={formData.currentSemester}
                  onChange={(e) => setFormData({ ...formData, currentSemester: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border-soft bg-brand-surface-muted text-xs sm:text-sm font-bold text-brand-ink focus:outline-none focus:border-brand-primary"
                >
                  <option value="الفصل الدراسي الأول">الفصل الدراسي الأول</option>
                  <option value="الفصل الدراسي الثاني">الفصل الدراسي الثاني</option>
                  <option value="الفصل الدراسي الصيفي">الفصل الدراسي الصيفي</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-brand-border-soft shadow-xs space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-brand-border-soft">
              <div className="w-10 h-10 rounded-xl bg-brand-surface-blue text-brand-primary flex items-center justify-center font-bold text-lg shrink-0">
                🛡️
              </div>
              <div>
                <h2 className="text-base font-black text-brand-ink">
                  سياسات الصلاحيات والنشر
                </h2>
                <span className="text-xs text-brand-muted">
                  تحديد القواعد التنظيمية لمشاركة الملفات واعتماد الاتفاقيات
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-brand-surface-muted border border-brand-border-soft">
                <div className="space-y-0.5">
                  <span className="text-xs sm:text-sm font-bold text-brand-ink block">
                    السماح للطلاب برفع ومشاركة المواد الدراسية
                  </span>
                  <span className="text-[11px] text-brand-muted block">
                    عند التفعيل، يمكن للطلاب رفع ملخصاتهم في بنك المواد، وتخضع للمراجعة قبل النشر.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, allowStudentUploads: !formData.allowStudentUploads })
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.allowStudentUploads ? "bg-brand-primary" : "bg-slate-300"
                  }`}
                  aria-label="تبديل رفع الطلاب"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      formData.allowStudentUploads ? "-translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-brand-surface-muted border border-brand-border-soft">
                <div className="space-y-0.5">
                  <span className="text-xs sm:text-sm font-bold text-brand-ink block">
                    اشتراط موافقة الإدارة لاعتماد اتفاقيات استعارة الأجهزة والكتب
                  </span>
                  <span className="text-[11px] text-brand-muted block">
                    تفعيل الرقابة الإدارية: لا تصبح الاتفاقية سارية إلا بعد اعتماد مشرف المنصة.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      requireAdminApprovalForAgreements: !formData.requireAdminApprovalForAgreements,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.requireAdminApprovalForAgreements ? "bg-brand-primary" : "bg-slate-300"
                  }`}
                  aria-label="تبديل اعتماد الاتفاقيات"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      formData.requireAdminApprovalForAgreements ? "-translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50/50 border border-amber-200">
                <div className="space-y-0.5">
                  <span className="text-xs sm:text-sm font-bold text-amber-900 block">
                    تفعيل وضع الصيانة المؤقتة (Maintenance Mode)
                  </span>
                  <span className="text-[11px] text-amber-800 block">
                    حجب المنصة عن الطلاب مؤقتاً لعرض صفحة الصيانة الدورية أثناء تحديثات السيرفر.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, maintenanceMode: !formData.maintenanceMode })
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.maintenanceMode ? "bg-amber-600" : "bg-slate-300"
                  }`}
                  aria-label="تبديل وضع الصيانة"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      formData.maintenanceMode ? "-translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-brand-primary hover:bg-brand-hover-medium text-white text-xs sm:text-sm font-black transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>حفظ وتطبيق إعدادات المنصة</span>
            </button>
          </div>
        </form>
      </div>
    </PermissionGuard>
  );
}
