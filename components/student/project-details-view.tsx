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
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F0F7FD] border border-[#D7EAF7] text-[#0057C8] text-xs font-bold transition-colors shadow-2xs"
        >
          <span>&rarr;</span>
          <span>العودة لكافة مشاريع التخرج</span>
        </Link>

        <span className="text-xs text-[#66788A] font-semibold">
          العام الأكاديمي: {project.academicYear}
        </span>
      </div>

      {/* Main Project Hero Card */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-[#D7EAF7] shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs px-3 py-1 rounded-full bg-[#EAF4FD] text-[#0057C8] border border-[#D7EAF7]">
              {project.major}
            </span>
            <span className="text-xs text-[#66788A] font-semibold">
              {project.department}
            </span>
          </div>

          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              isLookingForMembers
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-slate-100 text-slate-600 border border-slate-200"
            }`}
          >
            {project.status}
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#16324A] leading-tight">
            {project.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#66788A] mt-2 leading-relaxed">
            {project.summary}
          </p>
        </div>

        {/* Project Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#D7EAF7]/60 text-xs">
          <div className="p-3 rounded-2xl bg-[#F8FBFE] border border-[#D7EAF7]">
            <span className="text-[#66788A] block mb-0.5">المشرف الأكاديمي:</span>
            <span className="font-bold text-[#16324A]">{project.supervisor}</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#F8FBFE] border border-[#D7EAF7]">
            <span className="text-[#66788A] block mb-0.5">قائد الفريق:</span>
            <span className="font-bold text-[#0057C8]">{project.leader}</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#F8FBFE] border border-[#D7EAF7]">
            <span className="text-[#66788A] block mb-0.5">المرحلة الحالية:</span>
            <span className="font-bold text-[#2D78B7]">{project.stage}</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#F8FBFE] border border-[#D7EAF7]">
            <span className="text-[#66788A] block mb-0.5">تاريخ التسليم المتوقع:</span>
            <span className="font-bold font-mono text-[#16324A]" dir="ltr">
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
          <section className="p-6 rounded-3xl bg-white border border-[#D7EAF7] shadow-xs space-y-3">
            <h2 className="text-base font-bold text-[#16324A] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0057C8]" />
              <span>بيان المشكلة (Problem Statement)</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#66788A] leading-relaxed">
              {project.problemStatement}
            </p>
          </section>

          {/* Objectives Card */}
          <section className="p-6 rounded-3xl bg-white border border-[#D7EAF7] shadow-xs space-y-3">
            <h2 className="text-base font-bold text-[#16324A] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4DB7F2]" />
              <span>أهداف المشروع (Project Objectives)</span>
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-[#16324A]">
              {project.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#EAF4FD] text-[#0057C8] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{obj}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Milestones Timeline */}
          <section className="p-6 rounded-3xl bg-white border border-[#D7EAF7] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#16324A] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2D78B7]" />
              <span>المراحل الزمنية ومواعيد التسليم (Milestones)</span>
            </h2>

            <div className="space-y-3">
              {project.milestones.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#F8FBFE] border border-[#D7EAF7] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-3 h-3 rounded-full shrink-0 ${
                        m.status === "completed"
                          ? "bg-emerald-500"
                          : m.status === "in_progress"
                          ? "bg-[#0057C8] animate-pulse"
                          : "bg-slate-300"
                      }`}
                    />
                    <span className="font-bold text-[#16324A]">{m.title}</span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px] text-[#66788A]" dir="ltr">
                    <span>{m.date}</span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-sans font-bold ${
                        m.status === "completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : m.status === "in_progress"
                          ? "bg-[#EAF4FD] text-[#0057C8]"
                          : "bg-slate-100 text-slate-500"
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
          <section className="p-6 rounded-3xl bg-white border border-[#D7EAF7] shadow-xs space-y-3">
            <h2 className="text-base font-bold text-[#16324A]">التقنيات والأدوات المستخدمة</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-xl bg-[#F0F7FD] border border-[#D7EAF7] text-xs font-mono font-bold text-[#0057C8]"
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
            <section className="p-6 rounded-3xl bg-gradient-to-br from-[#EAF4FD] to-[#D7EAF7]/50 border border-[#0057C8]/20 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0057C8]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0057C8]" />
                <span>الفريق يبحث عن شركاء! ({project.neededCount} مقاعد)</span>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-[#66788A] block">الأدوار الشاغرة:</span>
                <div className="flex flex-wrap gap-1.5">
                  {project.neededRoles.map((r) => (
                    <span
                      key={r}
                      className="px-2.5 py-1 rounded-lg bg-white border border-[#D7EAF7] text-xs font-bold text-[#16324A]"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsApplyModalOpen(true)}
                className="w-full py-3 rounded-2xl bg-[#0057C8] hover:bg-[#2D78B7] text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <span>تقديم طلب انضمام للفريق</span>
                <span>&larr;</span>
              </button>
            </section>
          ) : null}

          {/* Members List */}
          <section className="p-6 rounded-3xl bg-white border border-[#D7EAF7] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#16324A]">
              أعضاء الفريق الحاليين ({project.members.length})
            </h2>

            <div className="space-y-3">
              {project.members.map((member, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#F8FBFE] border border-[#D7EAF7] flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0057C8] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {member.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-xs text-[#16324A] block truncate">
                      {member.name}
                    </span>
                    <span className="text-[11px] text-[#2D78B7] block truncate">
                      {member.role}
                    </span>
                    <span className="text-[10px] text-[#66788A] block">
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
              <label className="font-bold text-[#16324A] block">
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
                        ? "bg-[#0057C8] text-white border-[#0057C8] shadow-xs"
                        : "bg-[#F8FBFE] border-[#D7EAF7] text-[#16324A] hover:bg-[#F0F7FD]"
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
              <label className="font-bold text-[#16324A] block">الدور المطلوب:</label>
              <input
                type="text"
                required
                value={applicantRole}
                onChange={(e) => setApplicantRole(e.target.value)}
                placeholder="مثال: مطور خوارزميات الذكاء الاصطناعي"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7EAF7] font-semibold text-[#16324A] bg-[#F8FBFE]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#16324A] block">رسالتك لقائد الفريق:</label>
              <textarea
                rows={3}
                required
                value={applicantMessage}
                onChange={(e) => setApplicantMessage(e.target.value)}
                placeholder="عرف بنفسك وبمهاراتك وخبراتك السابقة في لغات البرمجة..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#D7EAF7] font-semibold text-[#16324A] bg-[#F8FBFE]"
              />
            </div>

            <div className="p-3 rounded-2xl bg-[#FFF9F2] border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
              <strong>تعليمات القبول:</strong> دور الطالب يقتصر على تقديم الطلب، بينما القبول والرفض واعتماد الأعضاء حق حصري لمشرف المشروع وصاحب المشروع.
            </div>
          </Modal.Body>

          <Modal.Footer>
            <button
              type="button"
              onClick={() => setIsApplyModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#D7EAF7] text-[#16324A] font-semibold hover:bg-[#F8FBFE] cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0057C8] text-white font-bold shadow-xs hover:bg-[#2D78B7] cursor-pointer"
            >
              إرسال الطلب الآن
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

