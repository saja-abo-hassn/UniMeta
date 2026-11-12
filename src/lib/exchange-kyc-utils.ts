export const STORAGE_SAVED_KYC_KEY = "unimeta_saved_student_kyc_v1";
export const STORAGE_OUTGOING_REQUESTS_KEY = "unimeta_student_outgoing_requests_v1";
export const STORAGE_ADMIN_AGREEMENTS_KEY = "unimeta_admin_agreements_v1";
export const STORAGE_ADMIN_NOTIFICATIONS_KEY = "unimeta_admin_notifications_v1";
export const STORAGE_PHONE_OTPS_KEY = "unimeta_active_phone_otps_v1";

export const OFFICIAL_PLEDGE_VERSION = "v1.4 - 2026 (معتمد من شؤون الطلبة)";

export const OFFICIAL_PLEDGE_TEXT = `تعهد والتزام خطي ومسؤولية قانونية وأكاديمية:

أقر وأتعهد أنا الطالب الموقّع أدناه، بأنني أطلب استعارة/استئجار هذا الغرض وفق القواعد المعتمدة في منصة UniMeta وعمادة شؤون الطلبة، وألتزم التزاماً قاطعاً بالآتي:
1. المحافظة الكاملة على الغرض واستخدامه للأغراض الدراسية والأكاديمية المشروعة دون إلحاق أي ضرر به.
2. تسليم وإعادة الغرض لمالكه في التاريخ والموعد المحدد دون مماطلة، وبنفس حالته الفنية الأصلية.
3. تحمّل المسؤولية المدنية والأكاديمية والمالية الكاملة عن أي تلف أو عطل أو فقدان كلي أو جزئي، ودفع قيمة التعويض الفوري أو استبدال القطعة.
4. إيداع مبلغ التأمين المتفق عليه وقبول تحكيم إدارة المنظمة والشؤون الأكاديمية كجهة ملزمة ونهائية في أي نزاع.`;

export function validateNationalId(id: string): { valid: boolean; error?: string } {
  const clean = id.trim();
  if (!clean) {
    return { valid: false, error: "يرجى إدخال رقم الهوية الوطنية." };
  }
  if (!/^\d{9}$/.test(clean)) {
    return { valid: false, error: "رقم الهوية يجب أن يتكوّن من 9 أرقام بالضبط." };
  }
  return { valid: true };
}

export function validatePhone(phone: string): { valid: boolean; error?: string } {
  const clean = phone.trim().replace(/[\s-]/g, "");
  if (!clean) {
    return { valid: false, error: "يرجى إدخال رقم الجوال للتواصل وتأكيد الهوية." };
  }
  const regex = /^(\+?(970|972)|0)?5[69]\d{7}$/;
  if (!regex.test(clean)) {
    return { valid: false, error: "صيغة رقم الجوال غير صحيحة (مثال: 0599123456 أو 0569123456)." };
  }
  return { valid: true };
}

export function maskNationalId(id: string): string {
  const clean = id.trim();
  if (clean.length < 5) return "•••••••••";
  return `${clean.slice(0, 2)}•••••${clean.slice(-2)}`;
}

export function maskPhone(phone: string): string {
  const clean = phone.trim().replace(/[\s-]/g, "");
  if (clean.length < 6) return "••••••••••";
  return `${clean.slice(0, 3)}••••${clean.slice(-2)}`;
}

export function validateSignatureFile(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = 2 * 1024 * 1024;
  const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: "صيغة الملف غير مدعومة. يرجى رفع صورة بصيغة PNG أو JPG أو WebP." };
  }

  if (file.size > MAX_SIZE) {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    return { valid: false, error: `حجم الصورة (${sizeInMb}MB) يتجاوز الحد الأقصى المسموح به (2MB).` };
  }

  return { valid: true };
}

export function calculateDeadline(startDate: string, durationDays: number): string {
  try {
    const d = new Date(startDate);
    d.setDate(d.getDate() + durationDays);
    return d.toISOString().split("T")[0];
  } catch {
    return startDate;
  }
}

