import { Injectable } from '@angular/core';
import { AUTH_USERS } from '../mock';
import { AuthUser } from '../../models/authUsers'; 
import { from, Observable, of, BehaviorSubject } from 'rxjs';
import { find, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUserId: number;
  private loginStatus = new BehaviorSubject(false);
  public isLoggedIn: boolean;

  constructor() {}

  public createSubscription(): Observable<boolean> {
    return this.loginStatus.asObservable();
  }

  public getAuthUserId(): number {
    return this.authUserId;
  }

  private setAuthUserId(id: number): void {
    this.authUserId = id;
    this.isLoggedIn = true;
    this.loginStatus.next(this.isLoggedIn);
  }

  private loadUser() {
    const user = window.localStorage.getItem('user');
    if (!user) {
      this.isLoggedIn = false;
    } else {
      try {
        const id: number = +JSON.parse(user).id;
        this.setAuthUserId(id);
      } catch (error) {
        console.log('failed to load a user');
      }
    }
  }

  public logUserIn({ email, password }: Partial <AuthUser>): Observable <AuthUser | Error> {
    return from(AUTH_USERS)
     .pipe(
       find(({email: userEmail, password: userPassword}: AuthUser) => {
         return userEmail === email && userPassword === password;
       }),
       mergeMap((user: AuthUser | undefined) => {
          if (!user) {
            throw Error('Login failed');
          }

          this.setAuthUserId(user.id);
          this.updateLocalStorage({
            id: user.id,
            email: user.email,
          });
          return of(user);
       })
     );
  }

  public logUserOut(): void {
    this.authUserId = undefined;
    this.isLoggedIn = false;
    this.loginStatus.next(false);
    window.localStorage.removeItem('user');
  }

  public init() {
    this.loadUser();
  }

  private updateLocalStorage({id, email}: Partial<AuthUser>): void {
    const user: Partial<AuthUser> = {
      id,
      email,
    };
    window.localStorage.setItem('user', JSON.stringify(user));
  }
}
