import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthState } from 'src/app/store/auth/auth.reducer';
import * as fromAuthActions from 'src/app/store/auth/auth.actions';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit  {
  @ViewChild('form', {static: true}) form: NgForm;

  constructor(
    private store: Store<AuthState>
  ) { }

  ngOnInit(): void {}

  public onSubmit(form: NgForm) {
    const credentials: { email: string, password: string} = form.value;
    this.store.dispatch(new fromAuthActions.LoginStartAction(credentials));
  }
}
