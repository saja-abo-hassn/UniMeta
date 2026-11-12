import { mailService } from "./mail-service";

export interface StoredVerification {
  email: string;
  codeHash: string;
  expiresAt: number;        // timestamp in ms (10 minutes)
  createdAt: number;
  failedAttempts: number;   // max 5 attempts
  lockedUntil: number | null; // lockout timestamp if >= 5 attempts (15 mins)
  resendCount: number;      // max 3 per hour
  resendWindowStart: number; // timestamp for tracking hourly window
}

const STORAGE_KEY = "unimeta_email_verifications";
const CODE_LIFETIME_MS = 10 * 60 * 1000; // 10 minutes
const LOCKOUT_MS = 15 * 60 * 1000;       // 15 minutes
const RESEND_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_FAILED_ATTEMPTS = 5;
const MAX_RESENDS_PER_HOUR = 3;

/**
 * Generate a cryptographically secure 6-digit random code (100000 - 999999)
 * Uses window.crypto.getRandomValues (NOT Math.random)
 */
export function generateCrypto6DigitCode(): string {
  if (typeof globalThis !== "undefined" && globalThis.crypto?.getRandomValues) {
    const buffer = new Uint32Array(1);
    globalThis.crypto.getRandomValues(buffer);
    const code = 100000 + (buffer[0] % 900000);
    return code.toString();
  }
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Compute SHA-256 hash of the code with a salt
 */
export async function hashVerificationCode(code: string, salt: string = "unimeta_verification"): Promise<string> {
  const text = `${code.trim()}:${salt}`;
  if (typeof globalThis !== "undefined" && globalThis.crypto?.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

function getAllRecords(): Record<string, StoredVerification> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAllRecords(records: Record<string, StoredVerification>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // ignore
  }
}

export function getVerificationRecord(email: string): StoredVerification | null {
  const records = getAllRecords();
  return records[email.toLowerCase().trim()] || null;
}

export function deleteVerificationRecord(email: string): void {
  const records = getAllRecords();
  const cleanEmail = email.toLowerCase().trim();
  if (records[cleanEmail]) {
    delete records[cleanEmail];
    saveAllRecords(records);
  }
}

export interface SendCodeResult {
  success: boolean;
  message: string;
  error?: string;
  expiresInMinutes?: number;
}

export interface VerifyCodeResult {
  success: boolean;
  message: string;
  error?: string;
  remainingAttempts?: number;
  lockedMinutes?: number;
}

/**
 * VerificationService manages code generation, storage, rate limits, and verification
 */
class VerificationService {
  /**
   * Generates a new cryptographically random 6-digit code, hashes it, saves the record,
   * invalidates old codes, enforces hourly rate limits, and sends via mailService.
   */
  async createAndSendCode(email: string, studentName?: string): Promise<SendCodeResult> {
    const cleanEmail = email.toLowerCase().trim();
    const now = Date.now();
    const records = getAllRecords();
    const existing = records[cleanEmail];

    let resendCount = 1;
    let resendWindowStart = now;

    if (existing) {
      // Check lockout status
      if (existing.lockedUntil && now < existing.lockedUntil) {
        const remainingLocked = Math.ceil((existing.lockedUntil - now) / 60000);
        return {
          success: false,
          error: `تم قفل الحساب مؤقتاً بسبب تكرار المحاولات الخاطئة. يرجى الانتظار لمدة ${remainingLocked} دقيقة.`,
          message: "الحساب مقفل مؤقتاً.",
        };
      }

      // Check hourly resend rate limit (max 3 resends per hour)
      if (now - existing.resendWindowStart < RESEND_WINDOW_MS) {
        if (existing.resendCount >= MAX_RESENDS_PER_HOUR) {
          const remainingMins = Math.ceil((RESEND_WINDOW_MS - (now - existing.resendWindowStart)) / 60000);
          return {
            success: false,
            error: `تجاوزت الحد الأقصى لإعادة الإرسال (3 مرات في الساعة). يرجى المحاولة بعد ${remainingMins} دقيقة.`,
            message: "تم تجاوز حد إعادة الإرسال.",
          };
        }
        resendCount = existing.resendCount + 1;
        resendWindowStart = existing.resendWindowStart;
      } else {
        // New hourly window
        resendCount = 1;
        resendWindowStart = now;
      }
    }

    // 1. Generate crypto 6-digit code
    const rawCode = generateCrypto6DigitCode();

    // 2. Hash the code
    const codeHash = await hashVerificationCode(rawCode);

    // 3. Invalidate old code by overwriting with new record
    const newRecord: StoredVerification = {
      email: cleanEmail,
      codeHash,
      expiresAt: now + CODE_LIFETIME_MS,
      createdAt: now,
      failedAttempts: 0,
      lockedUntil: null,
      resendCount,
      resendWindowStart,
    };

    records[cleanEmail] = newRecord;
    saveAllRecords(records);

    // 4. Send via isolated mail service
    await mailService.sendVerificationEmail({
      to: cleanEmail,
      studentName,
      code: rawCode,
      expiresInMinutes: 10,
    });

    return {
      success: true,
      message: "تم إرسال رمز التحقق بنجاح إلى بريدك الإلكتروني.",
      expiresInMinutes: 10,
    };
  }

  /**
   * Verifies the 6-digit code against the stored hash
   */
  async verifyCode(email: string, enteredCode: string): Promise<VerifyCodeResult> {
    const cleanEmail = email.toLowerCase().trim();
    const cleanCode = enteredCode.trim();
    const now = Date.now();
    const records = getAllRecords();
    const record = records[cleanEmail];

    if (!record) {
      return {
        success: false,
        error: "لا يوجد رمز تحقق نشط لهذا الحساب. يرجى طلب رمز جديد.",
        message: "رمز غير موجود.",
      };
    }

    // 1. Check lockout
    if (record.lockedUntil && now < record.lockedUntil) {
      const remainingLocked = Math.ceil((record.lockedUntil - now) / 60000);
      return {
        success: false,
        error: `تم قفل محاولات التحقق مؤقتاً لتكرار الأخطاء. يرجى الانتظار لمدة ${remainingLocked} دقيقة قبل المحاولة.`,
        message: "الحساب مقفل مؤقتاً.",
        lockedMinutes: remainingLocked,
      };
    }

    // 2. Check expiration (10 minutes)
    if (now > record.expiresAt) {
      return {
        success: false,
        error: "انتهت صلاحية رمز التحقق (صالح لمدة 10 دقائق فقط). يرجى طلب رمز جديد.",
        message: "الرمز منتهي الصلاحية.",
      };
    }

    // 3. Hash entered code and compare
    const enteredHash = await hashVerificationCode(cleanCode);

    if (enteredHash === record.codeHash) {
      // Success: Delete verification record (consumed/invalidated)
      delete records[cleanEmail];
      saveAllRecords(records);

      return {
        success: true,
        message: "تم التحقق من البريد الإلكتروني بنجاح!",
      };
    }

    // 4. Failed attempt: increment failed attempts counter
    record.failedAttempts += 1;

    if (record.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      record.lockedUntil = now + LOCKOUT_MS;
      records[cleanEmail] = record;
      saveAllRecords(records);

      return {
        success: false,
        error: "تم تجاوز الحد الأقصى للمحاولات الخاطئة (5 محاولات). تم قفل الحساب مؤقتاً لمدة 15 دقيقة لحمايته.",
        message: "تم قفل الحساب مؤقتاً.",
        lockedMinutes: 15,
        remainingAttempts: 0,
      };
    }

    records[cleanEmail] = record;
    saveAllRecords(records);

    const remaining = MAX_FAILED_ATTEMPTS - record.failedAttempts;
    return {
      success: false,
      error: `رمز التحقق غير صحيح. تبقى لك ${remaining} محاولات قبل القفل المؤقت.`,
      message: "رمز غير صحيح.",
      remainingAttempts: remaining,
    };
  }
}

export const verificationService = new VerificationService();
