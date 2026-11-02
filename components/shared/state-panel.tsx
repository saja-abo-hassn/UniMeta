import { Button } from "./button";

export type StateKind = "loading" | "empty" | "error" | "forbidden" | "offline";

const stateCopy: Record<StateKind, { icon: string; title: string; description: string }> = {
  loading: { icon: "…", title: "جارٍ التحميل", description: "يتم تجهيز المحتوى. سيظهر هنا عند اكتمال التحميل." },
  empty: { icon: "○", title: "لا يوجد محتوى بعد", description: "عندما تتوفر معلومات جديدة ستجدها هنا." },
  error: { icon: "!", title: "تعذر تحميل المحتوى", description: "تحقق من اتصالك ثم أعد المحاولة." },
  forbidden: { icon: "⌑", title: "يتعذر الوصول إلى هذه الصفحة", description: "قد تحتاج إلى تسجيل الدخول أو صلاحية مختلفة للمتابعة." },
  offline: { icon: "⌁", title: "أنت غير متصل بالإنترنت", description: "تحقق من اتصال الشبكة. ستتمكن من المحاولة مجددًا عند عودة الاتصال." },
};

export function StatePanel({ kind, title, description, onRetry, retryLabel = "إعادة المحاولة" }: {
  kind: StateKind; title?: string; description?: string; onRetry?: () => void; retryLabel?: string;
}) {
  const copy = stateCopy[kind];
  return (
    <section className={`state-panel state-${kind}`} role={kind === "error" || kind === "forbidden" || kind === "offline" ? "alert" : "status"} aria-live={kind === "loading" ? "polite" : undefined}>
      <span className="state-icon" aria-hidden="true">{copy.icon}</span>
      <h2>{title || copy.title}</h2>
      <p>{description || copy.description}</p>
      {onRetry && <Button type="button" variant="outline" onClick={onRetry}>{retryLabel}</Button>}
    </section>
  );
}
