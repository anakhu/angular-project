import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { map, concatMap, finalize } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NotificationsService } from 'src/app/shared/services/notifications/notifications.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit {
  @Input() userId: string | null;
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private users: UsersService,
    private ngxService: NgxUiLoaderService,
    private notifications: NotificationsService,
  ) { }

  ngOnInit(): void {
    this._initEditForm();
  }

  public submit(): void {
    this.ngxService.start();
    const { country, name, occupation } = this.editForm.value.profile;
    this.users.getUser(this.userId)
      .pipe(
        map((user: User) => {
          const updatedUser = {...user, country, name, occupation};
          return updatedUser;
        }),
        concatMap((updatedUser: User) => {
          return this.users.updateUserDetail(updatedUser);
        }),
        finalize(() => this.ngxService.stop())
      )
      .subscribe((user: User ) => {
        this.notifications.createNotification('User detail updated. Reload the page to see the changes');
        this.editForm.reset();
      });
  }

  private _initEditForm() {
    this.editForm = this.fb.group({
      profile: []
    });
  }
}
