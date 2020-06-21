import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ServerNotificationsService } from 'src/app/shared/services/server-notifications/server-notifications.service';
import { ServerNotification } from 'src/app/shared/models/notifications/serverNotifications';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LoggedInUser } from 'src/app/shared/models/user/loggedInUser';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { selectAuthUserUid } from 'src/app/store/auth/auth.selectors';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.scss']
})
export class UserNotificationsComponent implements OnInit, OnDestroy {
  public notifications$: Observable<ServerNotification[]>;
  private userId: string;
  private authSubscription: Subscription;

  constructor(
    private notificationsService: ServerNotificationsService,
    private store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.store.select(selectAuthUserUid)
      .subscribe((userId: string) => this.userId = userId ? userId : null);
    this.notificationsService.listenToChanges(this.userId);
    this.notifications$ = this.notificationsService.getNotifications();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
    this.notificationsService.removeFirebaseReference(this.userId);
  }

  public markAsRead(index: number): void {
    this.notificationsService.markMessageAsRead(this.userId, index);
  }

}
