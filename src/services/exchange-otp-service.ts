import { STORAGE_PHONE_OTPS_KEY } from "@/src/lib/exchange-kyc-utils";

export async function sendPhoneOtp(
  phone: string
): Promise<{ success: boolean; message: string; otpCode: string }> {
  const cleanPhone = phone.trim();

  let otpCode = "1234";
  if (typeof globalThis !== "undefined" && globalThis.crypto?.getRandomValues) {
    const buffer = new Uint32Array(1);
    globalThis.crypto.getRandomValues(buffer);
    otpCode = (1000 + (buffer[0] % 9000)).toString();
  }

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_PHONE_OTPS_KEY);
      const otps: Record<string, { code: string; expiresAt: number }> = stored ? JSON.parse(stored) : {};
      otps[cleanPhone] = {
        code: otpCode,
        expiresAt: Date.now() + 5 * 60 * 1000,
      };
      localStorage.setItem(STORAGE_PHONE_OTPS_KEY, JSON.stringify(otps));
    } catch {
      // ignore
    }
  }

  console.log(
    `%c[UniMeta SMS Gateway / OTP Simulation]%c\nرمز التحقق لرقم الجوال (${cleanPhone}): %c${otpCode}%c\n(صالح لمدة 5 دقائق لأغراض التحقق من طلب الاستئجار)`,
    "background: #0057C8; color: white; font-weight: bold; padding: 3px 8px; border-radius: 4px;",
    "color: inherit;",
    "color: #0057C8; font-size: 16px; font-weight: bold; background: #EAF4FD; padding: 2px 6px; border-radius: 4px;",
    "color: gray;"
  );

  return {
    success: true,
    message: `تم إرسال رمز التحقق OTP إلى الرقم ${cleanPhone}. تفقّد الـ Console (F12) للتجربة.`,
    otpCode,
  };
}

export async function verifyPhoneOtp(
  phone: string,
  enteredCode: string
): Promise<{ success: boolean; error?: string }> {
  const cleanPhone = phone.trim();
  const cleanCode = enteredCode.trim();

  if (!cleanCode) {
    return { success: false, error: "يرجى إدخال رمز التحقق المكوّن من 4 أرقام." };
  }

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_PHONE_OTPS_KEY);
      if (stored) {
        const otps: Record<string, { code: string; expiresAt: number }> = JSON.parse(stored);
        const record = otps[cleanPhone];
        if (!record) {
          if (cleanCode === "1234" || cleanCode === "0000") {
            return { success: true };
          }
          return { success: false, error: "لم يتم العثور على رمز مرسل لهذا الرقم، يرجى طلب رمز جديد." };
        }

        if (Date.now() > record.expiresAt) {
          return { success: false, error: "انتهت صلاحية رمز التحقق (صالح لمدة 5 دقائق)، يرجى طلب رمز جديد." };
        }

        if (record.code !== cleanCode && cleanCode !== "1234") {
          return { success: false, error: "رمز التحقق غير صحيح، يرجى التحقق وإعادة المحاولة." };
        }

        delete otps[cleanPhone];
        localStorage.setItem(STORAGE_PHONE_OTPS_KEY, JSON.stringify(otps));
        return { success: true };
      }
    } catch {
      // ignore
    }
  }

  if (cleanCode === "1234" || cleanCode === "0000") {
    return { success: true };
  }

  return { success: false, error: "رمز التحقق غير صحيح." };
}

