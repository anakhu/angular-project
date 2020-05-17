import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  body: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  notifications = new BehaviorSubject<Notification>(null);
  constructor() { }

  public createNotification(message: string): void {
    this.notifications.next({body : message});
  }

  public subscribe(): Observable<Notification> {
    return this.notifications.asObservable();
  }
}
