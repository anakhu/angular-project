import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Subscription, Observable, pipe } from 'rxjs';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { finalize, take, concatMap, exhaustMap, } from 'rxjs/operators';
import { NotificationsService } from 'src/app/shared/services/notifications/notifications.service';
import { FileValidator } from 'ngx-material-file-input';
import { LoggedInUser } from 'src/app/shared/models/user/loggedInUser';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { selectAuthUserUid } from 'src/app/store/auth/auth.selectors';

@Component({
  selector: 'app-update-pic',
  templateUrl: './update-pic.component.html',
  styleUrls: ['./update-pic.component.scss']
})
export class UpdatePicComponent implements OnInit, OnDestroy{
  imageForm: FormGroup;
  authUserId: string;
  isLoading = false;
  authUserId$: Observable<string>;

  readonly maxSize = 400000;

  constructor(
    private fb: FormBuilder,
    private users: UsersService,
    private notifications: NotificationsService,
    private store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    this._initForm();
    this.authUserId$ = this.store.select(selectAuthUserUid);
  }

  ngOnDestroy(): void {}

  get image(): any {
    return this.imageForm.get('image');
  }

  public submit(): void{
    this.isLoading = true;
    const file = this.imageForm.value.image.files[0];
    this.authUserId$
      .pipe(
        take(1),
        exhaustMap((userId: string) => {
            return this.users.changeProfilePicture(userId, file);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(() => {
        this.notifications.createNotification('Picture successfully updated.');
        this.imageForm.reset();
      });
  }

  private _initForm() {
    this.imageForm = this.fb.group({
      image: [undefined, [Validators.required, FileValidator.maxContentSize(this.maxSize)]]
    });
  }
}
