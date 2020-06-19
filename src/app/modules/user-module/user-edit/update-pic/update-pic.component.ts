import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { finalize, } from 'rxjs/operators';
import { NotificationsService } from 'src/app/shared/services/notifications/notifications.service';
import { FileValidator } from 'ngx-material-file-input';
import { LoggedInUser } from 'src/app/shared/models/user/loggedInUser';

@Component({
  selector: 'app-update-pic',
  templateUrl: './update-pic.component.html',
  styleUrls: ['./update-pic.component.scss']
})
export class UpdatePicComponent implements OnInit, OnDestroy{
  imageForm: FormGroup;
  authSubscription: Subscription;
  authUserId: string;
  isLoading = false;

  readonly maxSize = 400000;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private users: UsersService,
    private notifications: NotificationsService,
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
    this.isLoading = true;
    const file = this.imageForm.value.image.files[0];
    this.users.changeProfilePicture(this.authUserId, file)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe(() => {
        this.notifications
          .createNotification('Picture successfully updated.');
        this.imageForm.reset();
      });
  }

  private _initForm() {
    this.imageForm = this.fb.group({
      image: [undefined, [Validators.required, FileValidator.maxContentSize(this.maxSize)]]
    });
  }

  private _subscribe() {
    this.authSubscription = this.auth.createSubscription()
      .subscribe((user: LoggedInUser) => this.authUserId = user ? user.uid : null);
  }
}
