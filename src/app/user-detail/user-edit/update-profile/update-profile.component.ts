import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { map, concatMap, finalize } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit {
  @Input() userId: string | null;
  editForm: FormGroup;
  isBlocked = false;

  constructor(
    private fb: FormBuilder,
    private users: UsersService
  ) { }

  ngOnInit(): void {
    this.initEditForm();
  }

  private initEditForm() {
    this.editForm = this.fb.group({
      profile: []
    });
  }

  public submit(): void {
    const { country, name, occupation } = this.editForm.value.profile;
    this.isBlocked = true;
    this.users.getUser(this.userId)
      .pipe(
        map((user: User) => {
          console.log(user);
          const updatedUser = {...user, country, name, occupation};
          console.log(updatedUser);
          return updatedUser;
        }),
        concatMap((updatedUser: User) => {
          return this.users.updateUserDetail(updatedUser);
        }),
        finalize(() => this.isBlocked = false)
      ).subscribe((user: User ) => {
        // this.valueUpdated.emit(user);
        console.log('updated successfully');
      });
    // this.users.getUser()
  }
}
