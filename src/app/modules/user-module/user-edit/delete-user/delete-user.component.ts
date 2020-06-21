import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { NotificationsService } from 'src/app/shared/services/notifications/notifications.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize, take, first } from 'rxjs/operators';
import { LoggedInUser } from 'src/app/shared/models/user/loggedInUser';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { selectAuthUser } from 'src/app/store/auth/auth.selectors';
import * as fromAuthReducer from 'src/app/store/auth/auth.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent implements OnInit, OnDestroy {

  @ViewChild('form', {static: true}) form: NgForm;
  public authUser: LoggedInUser;
  @Input() data: any;
  @Output() next: EventEmitter<any> = new EventEmitter<any>();
  warnMessage = false;
  authUser$: Observable<LoggedInUser>;

  constructor(
    private auth: AuthService,
    private notifications: NotificationsService,
    private ngxService: NgxUiLoaderService,
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authUser$ = this.store.select(selectAuthUser);
  }

  ngOnDestroy(): void {}

  public onSubmit(form: NgForm): void {
    this.ngxService.start();
    this.deleteAccount();
  }

  public deleteAccount(): void {
    this.auth.deleteUserAccount()
      .pipe(
        first(),
        finalize(() => this.ngxService.stop())
      )
      .subscribe((result: boolean | any) => {
        if (!!result) {
          this.router.navigate(['/login']);
          this.notifications.createNotification('Account was successfully deleted');
        } else {
          this.warnMessage = true;
        }
    });
  }

}
