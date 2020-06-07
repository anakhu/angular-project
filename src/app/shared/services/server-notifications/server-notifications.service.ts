import { Injectable } from '@angular/core';
import { AppService } from '../app/app.service';
import { routes } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiService } from '../api/api.service';
import { ServerNotification } from '../../models/serverNotifications';

@Injectable({
  providedIn: 'root'
})
export class ServerNotificationsService {
  firebase: any;
  notifications: ServerNotification[] = [];
  notifications$ = new BehaviorSubject<ServerNotification[]>([]);

  constructor(
    private app: AppService,
    private api: ApiService
  ) { }

  public getNotifications(): Observable<any[]> {
    return this.notifications$.asObservable();
  }

  public listenToChanges(userId: string): void {
    this._subscribeToNotifications();

    return this.firebase.ref(`${routes.users}/${userId}/notifications`)
      .limitToLast(3)
      .on('child_added', snap => {
        const id = snap.key;
        const newEntry = { ...snap.val(), id};
        if (this.notifications.indexOf(newEntry) === -1) {
          this.notifications.push(newEntry);
          this.notifications$.next(this.notifications);
        }
      });
  }

  public removeFirebaseReference(userId: string) {
    this.firebase.ref(`${routes.users}/${userId}/notifications`).off();
    this.notifications.length = 0;
    this.notifications$.next(this.notifications);
  }

  public markMessageAsRead(userId: string, index: number) {
    const entry = {...this.notifications[index]};
    this._updateNotification(userId, entry.id)
      .subscribe((response: any) => {
        this.notifications.splice(index, 1);
        this.notifications$.next([...this.notifications]);
      });
  }

  public _updateNotification(userId: string, entryId: string): Observable<any> {
    return this.api.deleteEntry(`${routes.users}/${userId}/notifications/${entryId}/`);
  }

  private _subscribeToNotifications() {
    this.firebase = this.app.getFirebaseReference();
  }
}
