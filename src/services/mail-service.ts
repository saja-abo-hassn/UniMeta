export interface EmailTemplatePayload {
  to: string;
  studentName?: string;
  code: string;
  expiresInMinutes: number;
}

export interface ModeratorInvitePayload {
  to: string;
  name: string;
  inviteUrl: string;
  expiresAt: string;
  invitedBy?: string;
}

class MailService {
  async sendVerificationEmail(payload: EmailTemplatePayload): Promise<{ success: boolean; messageId: string }> {
    const { to, code, expiresInMinutes } = payload;
    await new Promise((res) => setTimeout(res, 200));

    if (typeof window !== "undefined") {
      console.log(
        "%c[UniMeta MailService] %c📧 إرسال رمز التحقق:",
        "color: #0057C8; font-weight: bold; font-size: 13px;",
        "color: #0EA5E9; font-weight: bold; font-size: 13px;"
      );
      console.log(
        `المستلم: ${to} | الرمز (${expiresInMinutes} دقيقة): ${code}`
      );
    }

    return {
      success: true,
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };
  }

  async sendModeratorInvite(payload: ModeratorInvitePayload): Promise<{ success: boolean; messageId: string }> {
    const { to, name, inviteUrl, expiresAt, invitedBy = "إدارة المنصة" } = payload;
    await new Promise((res) => setTimeout(res, 200));

    if (typeof window !== "undefined") {
      console.log(
        "%c[UniMeta MailService] %c✉️ دعوة مشرف جديد:",
        "color: #0057C8; font-weight: bold; font-size: 13px;",
        "color: #10B981; font-weight: bold; font-size: 13px;"
      );
      console.log(
        `مرحباً ${name}، تمت دعوتك بواسطة ${invitedBy} للانضمام كمشرف.\nرابط التفعيل: ${inviteUrl}\nصالح حتى: ${expiresAt}`
      );
    }

    return {
      success: true,
      messageId: `invite_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };
  }
}

export const mailService = new MailService();
