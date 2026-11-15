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
    void payload;
    return { success: false, messageId: "" };
  }

  async sendModeratorInvite(payload: ModeratorInvitePayload): Promise<{ success: boolean; messageId: string }> {
    void payload;
    await new Promise((res) => setTimeout(res, 200));

    return {
      success: true,
      messageId: `invite_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };
  }
}

export const mailService = new MailService();
