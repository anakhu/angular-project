import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, FireBaseUser } from 'src/app/shared/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize } from 'rxjs/operators';
import { NotificationsService } from 'src/app/shared/services/notifications/notifications.service';

@Component({
  selector: 'app-update-pic',
  templateUrl: './update-pic.component.html',
  styleUrls: ['./update-pic.component.scss']
})
export class UpdatePicComponent implements OnInit, OnDestroy{
  imageForm: FormGroup;
  authSubscription: Subscription;
  authUserId: string;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private users: UsersService,
    private ngxService: NgxUiLoaderService,
    private notifications: NotificationsService
  ) {}

  ngOnInit(): void {
    this._initForm();
    this._subscribe();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  get image(): any {
    return this.imageForm.get('image');
  }

  public submit() {
    this.ngxService.start();
    const file = this.imageForm.value.image.files[0];
    this.users.changeProfilePicture(this.authUserId, file)
      .pipe(
        finalize(() => this.ngxService.stop())
      )
      .subscribe(() => {
        this.notifications
          .createNotification('Picture successfully updated. Reload the page to see the result');
        this.imageForm.reset();
      });
  }

  private _initForm() {
    this.imageForm = this.fb.group({
      image: ['', Validators.required]
    });
  }

  private _subscribe() {
    this.authSubscription = this.auth.createSubscription()
      .subscribe((user: FireBaseUser) => this.authUserId = user ? user.uid : null);
  }
}
