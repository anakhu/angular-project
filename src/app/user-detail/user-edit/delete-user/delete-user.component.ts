import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginUser } from 'src/app/shared/services/auth/login.user';
import { Subscription } from 'rxjs';
import { AuthService, FireBaseUser } from 'src/app/shared/services/auth/auth.service';
import { NotificationsService } from 'src/app/shared/services/notifications/notifications.service';
import { ErrorService } from 'src/app/shared/services/error/error.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent implements OnInit, OnDestroy {

  @ViewChild('form', {static: true}) form: NgForm;
  public authUser: FireBaseUser;
  public isDisabled = false;
  private authSubscription: Subscription;

  @Input() data: any;
  @Output() next: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private auth: AuthService,
    private notifications: NotificationsService,
    private errors: ErrorService,
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
    if (form.value.email === this.authUser.email) {
      this.isDisabled = true;
      this.deleteAccount();
    } else {
      this.errors.handleError(new Error('Can\'t delete account. Login again and retry'));
    }
  }

  public deleteAccount(): void {
    this.auth.deleteUserAccount()
      .subscribe((result: boolean | any) => {
        if (!(result instanceof Error)) {
          this.auth.logout();
          this.notifications.createNotification('Account was successfully deleted');
        } else {
          this.errors.handleError(new Error('Account wasn\'t deleted'));
        }
        this.isDisabled = false;
    });
  }

}
