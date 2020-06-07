import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ServerNotificationsService } from 'src/app/shared/services/server-notifications/server-notifications.service';
import { ServerNotification } from 'src/app/shared/models/serverNotifications';
import { AuthService, FireBaseUser } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.scss']
})
export class UserNotificationsComponent implements OnInit, OnDestroy {
 userId: string;
  notifications$: Observable<ServerNotification[]>;
  authSubscription: Subscription;

  constructor(
    private notificationsService: ServerNotificationsService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this._authSubscribe();
    this.notificationsService.listenToChanges(this.userId);
    this.notifications$ = this.notificationsService.getNotifications();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
    this.notificationsService.removeFirebaseReference(this.userId);
  }

  markAsRead(index: number) {
    this.notificationsService.markMessageAsRead(this.userId, index);
  }

  private _authSubscribe(): void {
    this.authSubscription = this.auth.createSubscription()
      .subscribe((user: FireBaseUser) => {
        this.userId = user?.uid || null;
    });
  }

}
