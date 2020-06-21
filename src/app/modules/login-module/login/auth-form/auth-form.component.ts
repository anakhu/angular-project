import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import * as fromAuthReducer from 'src/app/store/auth/auth.actions';
import { UserFormData } from 'src/app/shared/models/user/userFormData';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss']
})
export class AuthFormComponent implements OnInit {

  authForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this._initAuthForm();
  }

  public submit(): void {
    const { email, password } = this.authForm.controls.credentials.value;
    const userData = this.authForm.controls.profile.value;
    const newUser: UserFormData = { email, password, userData };
    this.store.dispatch(new fromAuthReducer.SignUpStartAction(newUser));
  }

  private _initAuthForm(): void {
    this.authForm = this.formBuilder.group({
      profile: [],
      credentials: [],
    });
  }
}
