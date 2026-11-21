import { apiClient } from "./api-client";
import { requireData } from "./api-result";
import { StudyPlan } from "../data/study-plans-data";

interface Plan { id: number; major_id: number; plan_name: string; total_required_hours: number; }
interface PlanCourse { course_id: number; course_code: string; course_name: string; credit_hours: number; description: string | null; requirement_category_id:number|null; }
interface Requirement {id:number;scope:string;kind:string;required_hours:number;}
interface Attempt { id: number; course_id: number; attempt_number: number; grade: string | null; }
interface PlanDetails { college:string|null; degree:string|null; semesters_count:number|null; tuition_rate:{hourly_rate:string}|null; course_semesters:{course_id:number;semester:number|null}[]; }

const courseIds = new Map<string, number>();
const attemptIds = new Map<string, number>();
const gradeWrites = new Map<string, Promise<void>>();
// Share catalogue reads across mounts and plan selections; never cache personal records.
const references = new Map<string, Promise<unknown[]>>();
function reference<T>(path:string):Promise<T[]> {
  let pending=references.get(path);
  if(!pending){pending=apiClient.all<T>(path).then(requireData).catch(error=>{references.delete(path);throw error;});references.set(path,pending);}
  return pending as Promise<T[]>;
}
export const academicService = {
  async load() {
    courseIds.clear(); attemptIds.clear();
    const [planResponse, assignmentResponse, attemptResponse, majorResponse] = await Promise.all([
      reference<Plan>("/academic-plans"),
      apiClient.get<{ academic_plan_id: number }>("/students/me/academic-plan"),
      apiClient.all<Attempt>("/students/me/courses"),
      reference<{id:number;name:string}>("/majors"),
    ]);
    const plansReference = planResponse;
    const attempts = requireData(attemptResponse);
    const majors = majorResponse;
    if (assignmentResponse.errors) throw new Error(assignmentResponse.message);
    const grades: Record<string, number> = {};
    const plans: StudyPlan[] = await Promise.all(plansReference.map(async (plan) => {
      const [courseResponse, requirementResponse, detailResponse] = await Promise.all([
        reference<PlanCourse>(`/academic-plans/${plan.id}/courses`),
        reference<Requirement>(`/academic-plans/${plan.id}/requirements`),
        apiClient.get<PlanDetails>(`/academic-plans/${plan.id}/details`).then(requireData),
      ]);
      const courses = courseResponse;
      const requirements = requirementResponse;
      // Reference metadata and financial rates are supplied by Laravel.
      const major = majors.find(m=>m.id===plan.major_id)?.name ?? plan.plan_name;
      return {
        id: String(plan.id), major, college: detailResponse.college ?? "غير محددة",
        degree: detailResponse.degree === "MASTER" ? "ماجستير" : "بكالوريوس", totalCredits: plan.total_required_hours,
        compulsoryCredits: requirements.filter(r=>r.kind==="MANDATORY").reduce((n,r)=>n+r.required_hours,0),
        electiveCredits: requirements.filter(r=>r.kind==="ELECTIVE").reduce((n,r)=>n+r.required_hours,0),
        semestersCount: detailResponse.semesters_count ?? 0, hourlyRate: Number(detailResponse.tuition_rate?.hourly_rate ?? 0),
        description: plan.plan_name, courses: courses.map(course => {
          courseIds.set(`${plan.id}:${course.course_code}`, course.course_id);
          if (plan.id === assignmentResponse.data?.academic_plan_id) {
            const latest = attempts.filter(a => a.course_id === course.course_id).sort((a,b) => b.attempt_number-a.attempt_number)[0];
            if (latest) {
              attemptIds.set(course.course_code, latest.id);
              if (latest.grade !== null) grades[course.course_code] = Number(latest.grade);
            }
          }
          const requirement = requirements.find(r=>r.id===course.requirement_category_id);
          const category = requirement?.kind==="ELECTIVE" ? "elective" : requirement?.scope==="UNIVERSITY" ? "university" : requirement?.scope==="COLLEGE" ? "college" : "major";
          return { code: course.course_code, name: course.course_name, credits: Number(course.credit_hours),
            semester: detailResponse.course_semesters.find(c=>c.course_id===course.course_id)?.semester ?? 1, category: category as "elective"|"university"|"college"|"major",
            description: course.description ?? undefined };
        }),
      };
    }));
    return { plans, selectedPlanId: assignmentResponse.data ? String(assignmentResponse.data.academic_plan_id) : "", grades };
  },
  async select(planId: string) {
    requireData(await apiClient.put("/students/me/academic-plan", { academic_plan_id: Number(planId) }));
  },
  async grade(planId: string, code: string, grade: number | undefined) {
    const key = `${planId}:${code}`;
    const previous = gradeWrites.get(key) ?? Promise.resolve();
    const write = previous.catch(() => undefined).then(async () => {
    const id = attemptIds.get(code);
    if (id) {
      requireData(await apiClient.patch(`/students/me/courses/${id}`, { grade: grade ?? null }));
    } else if (grade !== undefined) {
      const courseId = courseIds.get(`${planId}:${code}`);
      if (!courseId) throw new Error("المادة غير موجودة في الخطة المختارة.");
      const attempt = requireData(await apiClient.post<Attempt>("/students/me/courses", { course_id: courseId, grade }));
      attemptIds.set(code, attempt.id);
    }
    });
    gradeWrites.set(key, write);
    return write.finally(() => { if (gradeWrites.get(key) === write) gradeWrites.delete(key); });
  },
};
