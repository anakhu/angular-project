import { Injectable } from '@angular/core';
import { AUTH_USERS } from '../mock';
import { AuthUser } from '../../models/authUsers'; 
import { from, Observable, of, BehaviorSubject, Subject, combineLatest, forkJoin } from 'rxjs';
import { find, mergeMap, tap, concatMap, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthResponse } from './auth.response';
import { LoginUser } from './login.user';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { NewUser } from '../users/user';
import { UsersService } from '../users/users.service';
import { User } from 'src/shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<LoginUser>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UsersService
  ) {}

  public signUp(email: string, password: string, payload: any = {}) {
    return this.http.post(`${environment.signUpUrl}${environment.apiKey}`,
      {email, password, returnSecureToken: true})
      .pipe(
        tap((data: AuthResponse) => console.log(data)),
        concatMap((data: AuthResponse) => {
          const id = data.localId;
          return this.collectUserDataOnSignUp({...payload, id})
            .pipe(
              map((user: Partial<User>) => ({data, user}))
            );
        }),
        map((result: {data: AuthResponse, user: Partial<User>}) => {
          this._loginHandler(result.data);
          return result.data;
        })
      );
  }

  public login(email: string, password: string) {
    return this.http.post(`${environment.loginUrl}${environment.apiKey}`,
      {email, password, returnSecureToken: true })
      .pipe(
      tap((data: any) => {
        this._loginHandler(data);
      })
    );
  }

  private _loginHandler(data: AuthResponse) {
    const expirationDate: number = new Date(new Date().getTime() +
      Number(data.expiresIn) * 1000).getTime();

    const user: LoginUser = new LoginUser(
      data.email,
      data.localId,
      data.idToken,
      expirationDate,
    );

    this.user.next(user);
    this._saveLoginUserToLocalStorage(user);
    console.log(data.localId);

    this.router.navigate(['/users', data.localId]);
  }

  public collectUserDataOnSignUp(userData: Partial<User>): Observable<User> {
    return this.userService.addUser(userData);
  }

  public getLoginUserOnAppLoad(): void {
    const user = JSON.parse(window.localStorage.getItem('user'));
    if (user) {
      const { email, id, _token, _expirationDate } = user;
      const loginUser = new LoginUser(
        email,
        id,
        _token,
        _expirationDate,
      );

      if (loginUser.token) {
        this.user.next(loginUser);
      } else {
        this._clearLocalStorage();
      }
    }
  }

  private _clearLocalStorage(): void {
    window.localStorage.removeItem('user');
  }

  private _saveLoginUserToLocalStorage(user: LoginUser): void {
    window.localStorage.setItem('user', JSON.stringify(user));
  }

  public createSubscription(): Observable<LoginUser> {
    return this.user.asObservable();
  }

  public logout() {
    this.user.next(null);
    this._clearLocalStorage();
  }
}
