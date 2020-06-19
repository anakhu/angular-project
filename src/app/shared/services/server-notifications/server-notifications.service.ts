import { Injectable } from '@angular/core';
import { AppService } from '../app/app.service';
import { routes } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiService } from '../api/api.service';
import { ServerNotification } from '../../models/notifications/serverNotifications';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServerNotificationsService {
  private firebase: firebase.database.Database;
  private notifications: ServerNotification[] = [];
  private notifications$ = new BehaviorSubject<ServerNotification[]>([]);

  constructor(
    private app: AppService,
    private api: ApiService
  ) { }

  public getNotifications(): Observable<ServerNotification[]> {
    return this.notifications$.asObservable();
  }

  public listenToChanges(userId: string): void {
    this._subscribeToNotifications();

    this.firebase.ref(`${routes.users}/${userId}/notifications`)
      .limitToLast(3)
      .on('child_added', (snapshot: firebase.database.DataSnapshot) => {
        const id = snapshot.key;
        const newEntry = { ...snapshot.val(), id};
        if (this.notifications.indexOf(newEntry) === -1) {
          this.notifications.push(newEntry);
          this.notifications$.next(this.notifications);
        }
      });
  }

  public removeFirebaseReference(userId: string): void {
    this.firebase.ref(`${routes.users}/${userId}/notifications`).off();
    this.notifications.length = 0;
    this.notifications$.next(this.notifications);
  }

  public markMessageAsRead(userId: string, index: number) {
    const entry = {...this.notifications[index]};
    this._deleteNotification(userId, entry.id).pipe((take(1)))
      .subscribe((response: any) => {
        this.notifications.splice(index, 1);
        this.notifications$.next([...this.notifications]);
      });
  }

  public _deleteNotification(userId: string, entryId: string): Observable<string | null> {
    return this.api.deleteEntry(`${routes.users}/${userId}/notifications/${entryId}/`);
  }

  private _subscribeToNotifications() {
    this.firebase = this.app.getFirebaseReference();
  }
}
