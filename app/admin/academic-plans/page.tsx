"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { PermissionGuard } from "@/components/admin/permission-guard";
import { initialStudyPlans } from "@/src/data/study-plans-data";
import {
  universityPlansService,
  type AdminMajorOption,
  type UniversityPlan,
} from "@/src/services/university-plans-service";

type PlanForm = {
  selectedPlanId: string;
  planYear: string;
  college: string;
  degree: "" | "BACHELOR" | "MASTER";
  semestersCount: string;
};

const emptyForm: PlanForm = {
  selectedPlanId: "",
  planYear: "",
  college: "",
  degree: "",
  semestersCount: "",
};

function formatError(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function normalizeMajorName(name: string): string {
  return name.normalize("NFKC").trim().replace(/\s+/g, " ");
}

export default function AdminAcademicPlansPage() {
  const [plans, setPlans] = useState<UniversityPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<UniversityPlan | null>(null);
  const [form, setForm] = useState<PlanForm>(emptyForm);
  const [majorOptions, setMajorOptions] = useState<AdminMajorOption[]>([]);
  const [areMajorsLoading, setAreMajorsLoading] = useState(false);
  const [majorsError, setMajorsError] = useState("");
  const [planPdf, setPlanPdf] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingPlanId, setDeletingPlanId] = useState<number | null>(null);

  const loadPlans = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      setPlans(await universityPlansService.list());
    } catch (loadError) {
      setError(formatError(loadError, "تعذر تحميل الخطط الجامعية."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPlans();
  }, [loadPlans]);

  const loadMajors = useCallback(async () => {
    setAreMajorsLoading(true);
    setMajorsError("");
    try {
      setMajorOptions(await universityPlansService.listMajors());
    } catch (loadError) {
      setMajorsError(formatError(loadError, "تعذر تحميل التخصصات من الخادم."));
    } finally {
      setAreMajorsLoading(false);
    }
  }, []);

  const openCreateForm = () => {
    setEditingPlan(null);
    setForm(emptyForm);
    setPlanPdf(null);
    setActionError("");
    setNotice("");
    setIsFormOpen(true);
    void loadMajors();
  };

  const openEditForm = (plan: UniversityPlan) => {
    setEditingPlan(plan);
    setForm({
      selectedPlanId: "",
      planYear: "",
      college: plan.college ?? "",
      degree: plan.degree ?? "",
      semestersCount: plan.semesters_count == null ? "" : String(plan.semesters_count),
    });
    setPlanPdf(null);
    setActionError("");
    setNotice("");
    setIsFormOpen(true);
  };

  const savePlan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setActionError("");
    setNotice("");

    try {
      if (editingPlan) {
        await universityPlansService.updateDetails(editingPlan.id, {
          college: form.college.trim() || null,
          degree: form.degree || null,
          semesters_count: form.semestersCount ? Number(form.semestersCount) : null,
        });
        setNotice("تم تحديث تفاصيل الخطة.");
      } else {
        throw new Error("عقد الخادم لا يدعم رفع PDF وربطه بالخطة بعد؛ لم يتم إرسال أو حفظ أي ملف.");
      }

      setIsFormOpen(false);
      await loadPlans();
    } catch (saveError) {
      setActionError(formatError(saveError, "تعذر حفظ الخطة. راجع البيانات وحاول مجدداً."));
    } finally {
      setIsSaving(false);
    }
  };

  const deletePlan = async (plan: UniversityPlan) => {
    if (!window.confirm(`هل تريد حذف الخطة «${plan.plan_name}»؟ إذا كانت مرتبطة بطلاب سيرفض الخادم الحذف.`)) return;
    setDeletingPlanId(plan.id);
    setActionError("");
    setNotice("");
    try {
      await universityPlansService.remove(plan.id);
      setNotice("تم حذف الخطة.");
      await loadPlans();
    } catch (deleteError) {
      setActionError(formatError(deleteError, "تعذر حذف الخطة."));
    } finally {
      setDeletingPlanId(null);
    }
  };

  const selectedStudyPlan = initialStudyPlans.find((plan) => plan.id === form.selectedPlanId);
  const selectedMajor = selectedStudyPlan
    ? majorOptions.find((major) => normalizeMajorName(major.name) === normalizeMajorName(selectedStudyPlan.major))
    : undefined;

  return (
    <PermissionGuard superAdminOnly>
      <section className="space-y-6" dir="rtl">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
              <span className="text-xs font-bold text-brand-primary">إدارة البرامج الأكاديمية</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-ink tracking-tight">الخطط الجامعية</h1>
            <p className="text-xs sm:text-sm text-brand-muted">الخطط المعتمدة التي يستخدمها الطلاب في المسار الأكاديمي.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-brand-muted">{plans.length} خطة</span>
            <button
              type="button"
              onClick={openCreateForm}
              className="px-4 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:opacity-90"
            >
              إضافة خطة
            </button>
          </div>
        </header>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" role="note">
          اختر خطة من الخطط الأصلية. قائمة البداية تحتوي 11 خطة؛ الإضافة مع PDF تحتاج دعم رفع وربط الملف في الباك قبل تفعيل الحفظ. الحذف متاح للمسؤول العام، ويرفضه الخادم إذا كانت الخطة مرتبطة بطلاب.
        </div>

        {notice && <p className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800" role="status">{notice}</p>}
        {!isFormOpen && actionError && <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">{actionError}</p>}

        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" role="presentation">
            <section className="w-full max-w-2xl max-h-[90dvh] overflow-y-auto rounded-3xl border border-brand-border-soft bg-white shadow-xl" role="dialog" aria-modal="true" aria-labelledby="plan-form-title">
              <form onSubmit={(event) => void savePlan(event)} className="space-y-5 p-5 sm:p-7" dir="rtl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 id="plan-form-title" className="text-xl font-extrabold text-brand-ink">{editingPlan ? "تعديل تفاصيل الخطة" : "إضافة خطة جامعية"}</h2>
                    <p className="mt-1 text-sm text-brand-muted">{editingPlan ? "عدّل التفاصيل التي يسمح بها عقد الخادم." : "اختر الخطة وأرفق ملفها بصيغة PDF."}</p>
                  </div>
                  <button type="button" onClick={() => setIsFormOpen(false)} disabled={isSaving} className="rounded-xl border border-brand-border-soft px-3 py-2 text-sm text-brand-muted">إغلاق</button>
                </div>

                {!editingPlan && (
                  <>
                    <div>
                      <label htmlFor="study-plan-select" className="mb-1.5 block text-sm font-bold text-brand-ink">الخطة الدراسية</label>
                      <select id="study-plan-select" required value={form.selectedPlanId} disabled={areMajorsLoading || !!majorsError} onChange={(event) => {
                        const plan = initialStudyPlans.find((item) => item.id === event.target.value);
                        setForm({
                          ...form,
                          selectedPlanId: event.target.value,
                          college: plan?.college ?? "",
                          degree: plan?.degree === "ماجستير" ? "MASTER" : "BACHELOR",
                          semestersCount: plan ? String(plan.semestersCount) : "",
                        });
                      }} className="w-full rounded-xl border border-brand-border-soft bg-white px-4 py-3 text-sm outline-none focus:border-brand-primary disabled:opacity-60">
                        <option value="">اختر خطة</option>
                        {initialStudyPlans.map((plan) => {
                          const hasMatchingMajor = majorOptions.some((major) => normalizeMajorName(major.name) === normalizeMajorName(plan.major));
                          return <option key={plan.id} value={plan.id} disabled={!hasMatchingMajor}>{plan.major}{hasMatchingMajor ? "" : " — غير موجود بالتخصصات الموثقة"}</option>;
                        })}
                      </select>
                      {areMajorsLoading && <p className="mt-1 text-xs text-brand-muted" role="status">جارٍ تحميل تخصصات الخادم...</p>}
                      {majorsError && <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-red-700" role="alert"><span>{majorsError}</span><button type="button" onClick={() => void loadMajors()} className="rounded-lg border border-red-200 bg-white px-3 py-1.5 font-bold">إعادة المحاولة</button></div>}
                      {!areMajorsLoading && !majorsError && selectedStudyPlan && !selectedMajor && <p className="mt-1 text-xs text-red-700" role="alert">لم نجد تخصصاً مطابقاً في رد الخادم؛ لن يُرسل معرّف غير مؤكد.</p>}
                    </div>
                    {selectedStudyPlan && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl border border-brand-border-soft bg-brand-surface-blue/50 p-4 text-sm">
                        <p><span className="text-brand-muted">إجمالي الساعات:</span> <strong className="text-brand-ink">{selectedStudyPlan.totalCredits}</strong></p>
                        <p><span className="text-brand-muted">عدد الفصول:</span> <strong className="text-brand-ink">{selectedStudyPlan.semestersCount}</strong></p>
                        <p><span className="text-brand-muted">الكلية:</span> <strong className="text-brand-ink">{selectedStudyPlan.college}</strong></p>
                        <p><span className="text-brand-muted">الدرجة:</span> <strong className="text-brand-ink">{selectedStudyPlan.degree}</strong></p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="plan-year" className="mb-1.5 block text-sm font-bold text-brand-ink">سنة الخطة</label>
                        <input id="plan-year" required type="number" min="1900" max="2100" step="1" value={form.planYear} onChange={(event) => setForm({ ...form, planYear: event.target.value })} className="w-full rounded-xl border border-brand-border-soft bg-white px-4 py-3 text-sm outline-none focus:border-brand-primary" />
                      </div>
                      <div>
                        <label htmlFor="plan-pdf" className="mb-1.5 block text-sm font-bold text-brand-ink">ملف الخطة (PDF)</label>
                        <input id="plan-pdf" required type="file" accept="application/pdf,.pdf" onChange={(event) => {
                          const file = event.target.files?.[0] ?? null;
                          setPlanPdf(file && (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) ? file : null);
                          setActionError(file && file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf") ? "الرجاء اختيار ملف PDF." : "");
                        }} className="w-full rounded-xl border border-brand-border-soft bg-white px-3 py-2.5 text-sm file:me-3 file:rounded-lg file:border-0 file:bg-brand-surface-blue file:px-3 file:py-2 file:font-bold file:text-brand-primary" />
                        {planPdf && <p className="mt-1 text-xs text-brand-muted">الملف المحدد: {planPdf.name}</p>}
                      </div>
                    </div>
                    <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-6 text-amber-900" role="note">عقد `POST /admin/academic-plans` يقبل JSON ولا يقبل ملفاً، ولا يوجد مسار موثق لرفع PDF أو إرجاع رابطه للطالب. لذلك الحفظ متوقف حالياً حتى لا تُنشأ خطة بدون ملفها.</p>
                  </>
                )}

                {editingPlan && <div className="rounded-2xl border border-brand-border-soft bg-brand-surface-blue/50 p-4 text-sm text-brand-ink">
                  <p className="font-bold">{editingPlan.plan_name}</p>
                  <p className="mt-1 text-xs text-brand-muted">التخصص #{editingPlan.major_id} · سنة {editingPlan.plan_year} · {editingPlan.total_required_hours} ساعة</p>
                </div>}

                {editingPlan && <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="plan-college" className="mb-1.5 block text-sm font-bold text-brand-ink">الكلية <span className="font-normal text-brand-muted">(اختياري)</span></label>
                      <input id="plan-college" maxLength={255} value={form.college} onChange={(event) => setForm({ ...form, college: event.target.value })} className="w-full rounded-xl border border-brand-border-soft bg-white px-4 py-3 text-sm outline-none focus:border-brand-primary" />
                    </div>
                    <div>
                      <label htmlFor="plan-degree" className="mb-1.5 block text-sm font-bold text-brand-ink">الدرجة <span className="font-normal text-brand-muted">(اختياري)</span></label>
                      <select id="plan-degree" value={form.degree} onChange={(event) => setForm({ ...form, degree: event.target.value as PlanForm["degree"] })} className="w-full rounded-xl border border-brand-border-soft bg-white px-4 py-3 text-sm outline-none focus:border-brand-primary">
                        <option value="">غير محددة</option>
                        <option value="BACHELOR">بكالوريوس</option>
                        <option value="MASTER">ماجستير</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="plan-semesters" className="mb-1.5 block text-sm font-bold text-brand-ink">عدد الفصول <span className="font-normal text-brand-muted">(اختياري)</span></label>
                      <input id="plan-semesters" type="number" min="1" max="20" step="1" value={form.semestersCount} onChange={(event) => setForm({ ...form, semestersCount: event.target.value })} className="w-full rounded-xl border border-brand-border-soft bg-white px-4 py-3 text-sm outline-none focus:border-brand-primary" />
                    </div>
                </div>}

                {actionError && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{actionError}</p>}
                <div className="flex flex-wrap gap-3 border-t border-brand-border-soft pt-4">
                  <button type="submit" disabled={isSaving || !editingPlan} title={!editingPlan ? "رفع PDF غير مدعوم في عقد الباك الحالي" : undefined} className="rounded-xl bg-brand-primary px-5 py-3 text-sm font-bold text-white disabled:opacity-60">
                    {isSaving ? "جارٍ الحفظ..." : editingPlan ? "حفظ التعديلات" : "الإضافة تنتظر دعم PDF من الباك"}
                  </button>
                  <button type="button" disabled={isSaving} onClick={() => setIsFormOpen(false)} className="rounded-xl border border-brand-border-soft px-5 py-3 text-sm font-bold text-brand-ink disabled:opacity-60">إلغاء</button>
                </div>
              </form>
            </section>
          </div>
        )}

        {isLoading && (
          <div className="rounded-3xl border border-brand-border-soft bg-white p-8 text-center text-sm text-brand-muted" role="status" aria-busy="true">
            جارٍ تحميل الخطط الجامعية...
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700" role="alert">
            <p>{error}</p>
            <button type="button" onClick={() => void loadPlans()} className="mt-3 rounded-xl border border-red-200 bg-white px-4 py-2 font-bold hover:bg-red-100">
              إعادة المحاولة
            </button>
          </div>
        )}

        {!isLoading && !error && plans.length === 0 && (
          <div className="rounded-3xl border border-brand-border-soft bg-white p-10 text-center shadow-xs">
            <h2 className="font-bold text-brand-ink">لا توجد خطط جامعية لعرضها</h2>
            <p className="mt-2 text-sm text-brand-muted">ستظهر الخطط التي يعيدها الخادم هنا وفي دليل الخطط لدى الطلاب.</p>
          </div>
        )}

        {!isLoading && !error && plans.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
            {plans.map((plan) => (
              <article key={plan.id} className="rounded-3xl bg-white border border-brand-border-soft shadow-xs p-6 sm:p-7 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="font-extrabold text-lg text-brand-ink break-words">{plan.plan_name}</h2>
                    <p className="mt-1 text-xs text-brand-muted">الخطة #{plan.id} · التخصص #{plan.major_id}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-brand-surface-blue px-3 py-1 text-xs font-bold text-brand-primary border border-brand-border-soft">
                    {plan.plan_year}
                  </span>
                </div>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-brand-border-soft pt-4 text-sm">
                  <div>
                    <dt className="text-xs text-brand-muted">الكلية والدرجة</dt>
                    <dd className="mt-1 font-bold text-brand-ink">{plan.college || "غير محددة"} · {plan.degree === "MASTER" ? "ماجستير" : plan.degree === "BACHELOR" ? "بكالوريوس" : "غير محددة"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-brand-muted">الساعات المطلوبة · الفصول</dt>
                    <dd className="mt-1 font-bold text-brand-ink">{plan.total_required_hours} ساعة · {plan.semesters_count ?? "غير محدد"}</dd>
                  </div>
                </dl>
                <div className="flex flex-wrap gap-3 border-t border-brand-border-soft pt-4">
                  <button type="button" onClick={() => openEditForm(plan)} className="rounded-xl border border-brand-border-soft px-4 py-2 text-sm font-bold text-brand-primary hover:bg-brand-surface-blue">تعديل التفاصيل</button>
                  <button type="button" disabled={deletingPlanId === plan.id} onClick={() => void deletePlan(plan)} className="rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-60">
                    {deletingPlanId === plan.id ? "جارٍ الحذف..." : "حذف الخطة"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </PermissionGuard>
  );
}
