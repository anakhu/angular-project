export interface ServerNotification {
  type: string;
  message: string;
  payload: string[];
  isRead: boolean;
  id?: string;
}
