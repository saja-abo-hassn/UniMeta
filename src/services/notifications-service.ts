import { apiClient, LaravelResponse, API_CONFIG } from "./api-client";
import { MOCK_NOTIFICATIONS, MockNotification } from "./mock-backend/mock-notifications";

class NotificationsService {
  private getStoredNotifications(): MockNotification[] {
    if (typeof window === "undefined") return MOCK_NOTIFICATIONS;
    try {
      const raw = localStorage.getItem(API_CONFIG.storageKeys.notifications);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return MOCK_NOTIFICATIONS;
  }

  private saveNotifications(items: MockNotification[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(API_CONFIG.storageKeys.notifications, JSON.stringify(items));
    } catch {
      // ignore
    }
  }

  async getNotifications(): Promise<LaravelResponse<MockNotification[]>> {
    if (!apiClient.isUsingMock()) {
      return apiClient.get<MockNotification[]>("/student/notifications");
    }

    // Mock Backend:
    await new Promise((res) => setTimeout(res, 150));
    const items = this.getStoredNotifications();
    return apiClient.createSuccessResponse(items, "تم استرجاع الإشعارات بنجاح.");
  }

  async markAsRead(notificationId: string): Promise<LaravelResponse<{ success: boolean }>> {
    if (!apiClient.isUsingMock()) {
      return apiClient.post<{ success: boolean }>(`/student/notifications/${notificationId}/read`);
    }

    // Mock Backend:
    const items = this.getStoredNotifications().map((n) =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    this.saveNotifications(items);
    return apiClient.createSuccessResponse({ success: true }, "تم تعليم الإشعار كمقروء.");
  }

  async markAllAsRead(): Promise<LaravelResponse<{ success: boolean }>> {
    if (!apiClient.isUsingMock()) {
      return apiClient.post<{ success: boolean }>("/student/notifications/read-all");
    }

    const items = this.getStoredNotifications().map((n) => ({ ...n, read: true }));
    this.saveNotifications(items);
    return apiClient.createSuccessResponse({ success: true }, "تم تعليم جميع الإشعارات كمقروءة.");
  }
}

export const notificationsService = new NotificationsService();

