import { Action } from '@ngrx/store';
import { LoggedInUser } from '../../shared/models/user/loggedInUser';
import { User } from 'src/app/shared/models/user/user';

export const LOGIN_START = '[Auth] LOGIN_START';
export const LOGIN_SUCCESS = '[Auth] LOGIN_SUCCESS';
export const LOGIN_FAILED = '[Auth] LOGIN_FAILED';
export const LOGOUT_START = '[Auth] LOGOUT_START';
export const LOGOUT_END = '[Auth] LOGOUT_END';
export const SIGN_UP_START = '[Auth] SIGN_UP_START';
export const SIGN_UP_SUCCESS = '[Auth] SIGN_UP_SUCCESS';
export const SIGN_UP_FAILED = '[Auth] SIGN_UP_FAILED';
export const USER_IS_LOADING = '[Auth] USER_IS_LOADING';


export  class LoginStartAction implements Action {
  readonly type = LOGIN_START;
  constructor(
    public payload: {email: string, password: string }
  ){}
}

export class LoginSuccessAction implements Action {
  readonly type = LOGIN_SUCCESS;
  constructor(public payload: LoggedInUser) {}
}

export class LoginFailedAction implements Action {
  readonly type = LOGIN_FAILED;
  constructor(public payload: any) {}
}

export class LogoutStartAction implements Action {
  readonly type = LOGOUT_START;
  constructor() {}
}

export class LogoutEndAction implements Action {
  readonly type = LOGOUT_END;
  constructor() {}
}

export class SignUpStartAction implements Action {
  readonly type = SIGN_UP_START;
  constructor(public payload: {email: string, password: string, userData: Partial<User>}) {}
}

export class SignUpSuccessAction implements Action {
  readonly type = SIGN_UP_SUCCESS;
  constructor() {}
}

export class SignUpFailedAction implements Action {
  readonly type = SIGN_UP_FAILED;
  constructor(public payload: any) {}
}

export class UserIsLoading implements Action {
  readonly type = USER_IS_LOADING;
  constructor() {}
}

export type AuthActions =
  LogoutStartAction |
  LoginSuccessAction |
  LoginFailedAction |
  LoginStartAction |
  LogoutEndAction |
  SignUpStartAction |
  SignUpSuccessAction |
  SignUpFailedAction |
  UserIsLoading;
