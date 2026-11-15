import { apiClient, LaravelResponse, API_CONFIG } from "./api-client";
import { MOCK_NOTIFICATIONS, MockNotification } from "./mock-backend/mock-notifications";
interface ProjectEvent {id:number;project_id:number;event_type:string;is_read:boolean;created_at:string;}
interface ServerNotification {id:number;type:MockNotification["type"];title:string;message:string;link:string;read_at:string|null;created_at:string;}

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
      const [response,notices]=await Promise.all([apiClient.all<ProjectEvent>("/project-context-events"),apiClient.all<ServerNotification>("/notifications")]);
      if(response.errors||notices.errors)return {...(response.errors?response:notices),data:null};
      return {...response,data:[...(response.data??[]).map(e=>({id:`project-${e.id}`,type:"project" as const,title:"تحديث مشروع تخرج",message:e.event_type,createdAt:Date.parse(e.created_at),read:e.is_read,link:`/student/projects/${e.project_id}`})),...(notices.data??[]).map(n=>({id:`server-${n.id}`,type:n.type,title:n.title,message:n.message,createdAt:Date.parse(n.created_at),read:!!n.read_at,link:n.link}))].sort((a,b)=>b.createdAt-a.createdAt)};
    }

    // Mock Backend:
    await new Promise((res) => setTimeout(res, 150));
    const items = this.getStoredNotifications();
    return apiClient.createSuccessResponse(items, "تم استرجاع الإشعارات بنجاح.");
  }

  async markAsRead(notificationId: string): Promise<LaravelResponse<{ success: boolean }>> {
    if (!apiClient.isUsingMock()) {
      if(!notificationId.startsWith("project-")&&!notificationId.startsWith("server-"))return apiClient.createSuccessResponse({success:true});
      const response=await apiClient.patch(notificationId.startsWith("server-")?`/notifications/${notificationId.slice(7)}/read`:`/project-context-events/${notificationId.slice(8)}/read`);
      return {...response,data:response.errors?null:{success:true}};
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
      const response=await apiClient.post<{success:boolean}>("/notifications/read-all");
      if(response.errors)return response;
      const projects=await apiClient.all<ProjectEvent>("/project-context-events");
      if(projects.errors||!projects.data)return {...projects,data:null};
      for(const item of projects.data.filter(n=>!n.is_read)){
        const saved=await this.markAsRead(`project-${item.id}`);
        if(saved.errors)return saved;
      }
      return apiClient.createSuccessResponse({success:true});
    }

    const items = this.getStoredNotifications().map((n) => ({ ...n, read: true }));
    this.saveNotifications(items);
    return apiClient.createSuccessResponse({ success: true }, "تم تعليم جميع الإشعارات كمقروءة.");
  }
}

export const notificationsService = new NotificationsService();

