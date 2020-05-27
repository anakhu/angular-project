import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, FireBaseUser } from 'src/app/shared/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/shared/services/users/users.service';

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
    private users: UsersService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this._subscribe();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  private _subscribe() {
    this.authSubscription = this.auth.createSubscription()
      .subscribe((user: FireBaseUser) => this.authUserId = user ? user.uid : null);
  }

  get image(): any {
    return this.imageForm.get('image');
  }

  private initForm() {
    this.imageForm = this.fb.group({
      image: ['', Validators.required]
    });
  }

  public submit() {
    const file = this.imageForm.value.image.files[0];
    this.users.changeProfilePicture(this.authUserId, file)
      .subscribe(x => console.log(x));
  }
}
