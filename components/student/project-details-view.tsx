"use client";

import React, { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { initialGraduationProjects } from "@/src/data/graduation-projects-data";
import { useNotifications } from "@/src/contexts/notifications-context";
import { Modal } from "@/components/shared/modal";

export function ProjectDetailsView({ id }: { id: string }) {
  const { notify } = useNotifications();
  const project = initialGraduationProjects.find((p) => p.id === id);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applicantRole, setApplicantRole] = useState("");
  const [applicantMessage, setApplicantMessage] = useState("");
  const [applicantStage, setApplicantStage] = useState<"مشروع 1" | "مشروع 2" | "مشروع 1 و 2" | "">("");
  const [stageError, setStageError] = useState("");
  const [hasApplied, setHasApplied] = useState(false);

  if (!project) {
    notFound();
  }

  const isLookingForMembers = project.status === "يبحث عن شركاء";

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantStage) {
      setStageError("يرجى تحديد المرحلة الدراسية للمشروع (مشروع 1 أو 2 أو 1 و 2).");
      return;
    }
    setStageError("");

    notify({
      type: "project",
      title: "تم إرسال طلب الانضمام! 🎓",
      message: `تم إرسال طلب انضمامك بمرحلة (${applicantStage}) إلى المشرف ${project.supervisor} وقائد الفريق ${project.leader}. بانتظار الاعتماد والمراجعة.`,
      playSound: true,
      browserNotify: true,
    });
    setHasApplied(true);
    setIsApplyModalOpen(false);
    setApplicantRole("");
    setApplicantMessage("");
    setApplicantStage("");
  };

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/student/projects"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-brand-surface-soft border border-brand-border-soft text-brand-primary text-xs font-bold transition-colors shadow-2xs"
        >
          <span>&rarr;</span>
          <span>العودة لكافة مشاريع التخرج</span>
        </Link>

        <span className="text-xs text-brand-muted font-semibold">
          العام الأكاديمي: {project.academicYear}
        </span>
      </div>

      {/* Main Project Hero Card */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-border-soft shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs px-3 py-1 rounded-full bg-brand-surface-blue text-brand-primary border border-brand-border-soft">
              {project.major}
            </span>
            <span className="text-xs text-brand-muted font-semibold">
              {project.department}
            </span>
          </div>

          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              isLookingForMembers
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-slate-100 text-brand-muted border border-brand-border-soft"
            }`}
          >
            {project.status}
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-ink leading-tight">
            {project.title}
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-2 leading-relaxed">
            {project.summary}
          </p>
        </div>

        {/* Project Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-brand-border-soft/60 text-xs">
          <div className="p-3 rounded-2xl bg-brand-surface-muted border border-brand-border-soft">
            <span className="text-brand-muted block mb-0.5">المشرف الأكاديمي:</span>
            <span className="font-bold text-brand-ink">{project.supervisor}</span>
          </div>
          <div className="p-3 rounded-2xl bg-brand-surface-muted border border-brand-border-soft">
            <span className="text-brand-muted block mb-0.5">قائد الفريق:</span>
            <span className="font-bold text-brand-primary">{project.leader}</span>
          </div>
          <div className="p-3 rounded-2xl bg-brand-surface-muted border border-brand-border-soft">
            <span className="text-brand-muted block mb-0.5">المرحلة الحالية:</span>
            <span className="font-bold text-brand-hover-medium">{project.stage}</span>
          </div>
          <div className="p-3 rounded-2xl bg-brand-surface-muted border border-brand-border-soft">
            <span className="text-brand-muted block mb-0.5">تاريخ التسليم المتوقع:</span>
            <span className="font-bold font-mono text-brand-ink" dir="ltr">
              {project.submissionDate}
            </span>
          </div>
        </div>
      </section>

      {/* Two Column Layout: Details vs Team */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Problem statement & Objectives */}
        <div className="lg:col-span-2 space-y-6">
          {/* Problem Statement Card */}
          <section className="p-6 rounded-3xl bg-white border border-brand-border-soft shadow-xs space-y-3">
            <h2 className="text-base font-bold text-brand-ink flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-primary" />
              <span>بيان المشكلة (Problem Statement)</span>
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
              {project.problemStatement}
            </p>
          </section>

          {/* Objectives Card */}
          <section className="p-6 rounded-3xl bg-white border border-brand-border-soft shadow-xs space-y-3">
            <h2 className="text-base font-bold text-brand-ink flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-secondary" />
              <span>أهداف المشروع (Project Objectives)</span>
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-brand-ink">
              {project.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-brand-surface-blue text-brand-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{obj}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Milestones Timeline */}
          <section className="p-6 rounded-3xl bg-white border border-brand-border-soft shadow-xs space-y-4">
            <h2 className="text-base font-bold text-brand-ink flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-hover-medium" />
              <span>المراحل الزمنية ومواعيد التسليم (Milestones)</span>
            </h2>

            <div className="space-y-3">
              {project.milestones.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-brand-surface-muted border border-brand-border-soft flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-3 h-3 rounded-full shrink-0 ${
                        m.status === "completed"
                          ? "bg-emerald-500"
                          : m.status === "in_progress"
                          ? "bg-brand-primary animate-pulse"
                          : "bg-slate-300"
                      }`}
                    />
                    <span className="font-bold text-brand-ink">{m.title}</span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px] text-brand-muted" dir="ltr">
                    <span>{m.date}</span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-sans font-bold ${
                        m.status === "completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : m.status === "in_progress"
                          ? "bg-brand-surface-blue text-brand-primary"
                          : "bg-slate-100 text-brand-muted"
                      }`}
                    >
                      {m.status === "completed" ? "منجز" : m.status === "in_progress" ? "جاري" : "قادم"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tech Stack */}
          <section className="p-6 rounded-3xl bg-white border border-brand-border-soft shadow-xs space-y-3">
            <h2 className="text-base font-bold text-brand-ink">التقنيات والأدوات المستخدمة</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-xl bg-brand-surface-soft border border-brand-border-soft text-xs font-mono font-bold text-brand-primary"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (1 col): Team members & Join action */}
        <div className="space-y-6">
          {/* Join Callout Card */}
          {hasApplied ? (
            <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold space-y-1">
              <span className="block text-sm">✓ تم تقديم طلبك بنجاح!</span>
              <p className="font-medium text-emerald-700 text-[11px]">
                طلبك الآن قيد مراجعة المشرف الأكاديمي وقائد المشروع للبت فيه والاعتماد.
              </p>
            </div>
          ) : isLookingForMembers ? (
            <section className="p-6 rounded-3xl bg-gradient-to-br from-brand-surface-blue to-brand-border-soft/50 border border-brand-primary/20 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-primary">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
                <span>الفريق يبحث عن شركاء! ({project.neededCount} مقاعد)</span>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-brand-muted block">الأدوار الشاغرة:</span>
                <div className="flex flex-wrap gap-1.5">
                  {project.neededRoles.map((r) => (
                    <span
                      key={r}
                      className="px-2.5 py-1 rounded-lg bg-white border border-brand-border-soft text-xs font-bold text-brand-ink"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsApplyModalOpen(true)}
                className="w-full py-3 rounded-2xl bg-brand-primary hover:bg-brand-hover-medium text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <span>تقديم طلب انضمام للفريق</span>
                <span>&larr;</span>
              </button>
            </section>
          ) : null}

          {/* Members List */}
          <section className="p-6 rounded-3xl bg-white border border-brand-border-soft shadow-xs space-y-4">
            <h2 className="text-base font-bold text-brand-ink">
              أعضاء الفريق الحاليين ({project.members.length})
            </h2>

            <div className="space-y-3">
              {project.members.map((member, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-brand-surface-muted border border-brand-border-soft flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-primary text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {member.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-xs text-brand-ink block truncate">
                      {member.name}
                    </span>
                    <span className="text-[11px] text-brand-hover-medium block truncate">
                      {member.role}
                    </span>
                    <span className="text-[10px] text-brand-muted block">
                      {member.major}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Modal: طلب انضمام */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        size="md"
      >
        <form onSubmit={handleApplySubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <Modal.Header
            title={`طلب انضمام لمشروع: ${project.title}`}
            description={`قائد الفريق: ${project.leader}`}
            onClose={() => setIsApplyModalOpen(false)}
          />

          <Modal.Body className="p-5 sm:p-6 space-y-4 text-xs">
            {/* Mandatory Phase Selection */}
            <div className="space-y-1.5">
              <label className="font-bold text-brand-ink block">
                حدد المرحلة التي تدرسها حالياً <span className="text-red-500">* (إلزامي)</span>:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["مشروع 1", "مشروع 2", "مشروع 1 و 2"] as const).map((stage) => (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => {
                      setApplicantStage(stage);
                      setStageError("");
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                      applicantStage === stage
                        ? "bg-brand-primary text-white border-brand-primary shadow-xs"
                        : "bg-brand-surface-muted border-brand-border-soft text-brand-ink hover:bg-brand-surface-soft"
                    }`}
                  >
                    {stage}
                  </button>
                ))}
              </div>
              {stageError && (
                <p className="text-red-600 text-[11px] font-bold mt-1">
                  ⚠ {stageError}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-ink block">الدور المطلوب:</label>
              <input
                type="text"
                required
                value={applicantRole}
                onChange={(e) => setApplicantRole(e.target.value)}
                placeholder="مثال: مطور خوارزميات الذكاء الاصطناعي"
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border-soft font-semibold text-brand-ink bg-brand-surface-muted"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-ink block">رسالتك لقائد الفريق:</label>
              <textarea
                rows={3}
                required
                value={applicantMessage}
                onChange={(e) => setApplicantMessage(e.target.value)}
                placeholder="عرف بنفسك وبمهاراتك وخبراتك السابقة في لغات البرمجة..."
                className="w-full px-3.5 py-2 rounded-xl border border-brand-border-soft font-semibold text-brand-ink bg-brand-surface-muted"
              />
            </div>

            <div className="p-3 rounded-2xl bg-[#FFF9F2] border border-brand-border-soft text-amber-900 text-[11px] leading-relaxed">
              <strong>تعليمات القبول:</strong> دور الطالب يقتصر على تقديم الطلب، بينما القبول والرفض واعتماد الأعضاء حق حصري لمشرف المشروع وصاحب المشروع.
            </div>
          </Modal.Body>

          <Modal.Footer>
            <button
              type="button"
              onClick={() => setIsApplyModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-brand-border-soft text-brand-ink font-semibold hover:bg-brand-surface-muted cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-primary text-white font-bold shadow-xs hover:bg-brand-hover-medium cursor-pointer"
            >
              إرسال الطلب الآن
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

