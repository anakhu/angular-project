import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService, FireBaseUser } from 'src/app/shared/services/auth/auth.service';
import { NotificationsService } from 'src/app/shared/services/notifications/notifications.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent implements OnInit, OnDestroy {

  @ViewChild('form', {static: true}) form: NgForm;
  public authUser: FireBaseUser;
  private authSubscription: Subscription;

  @Input() data: any;
  @Output() next: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private auth: AuthService,
    private notifications: NotificationsService,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.auth.createSubscription()
      .subscribe((user: FireBaseUser) => {
        this.authUser = user ? user : null;
      });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  public onSubmit(form: NgForm) {
    this.ngxService.start();
    if (form.value.email === this.authUser.email) {
      this.deleteAccount();
    }
  }

  public deleteAccount(): void {
    this.auth.deleteUserAccount()
      .pipe(
        finalize(() => this.ngxService.stop())
      )
      .subscribe((result: boolean | any) => {
        if (!(result instanceof Error)) {
          this.auth.logout();
          this.notifications.createNotification('Account was successfully deleted');
        }
    });
  }

}