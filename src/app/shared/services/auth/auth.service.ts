import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { tap, concatMap, exhaustMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { UsersService } from '../users/users.service';
import { AppService } from '../app/app.service';
import { API_ERRORS } from 'src/app/shared/services/api/api-errors';
import { CustomError } from 'src/app/shared/models/custom-error';

export interface FireBaseUser {
  uid: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  fireBaseAuth: any;
  firebaseUser = new BehaviorSubject<FireBaseUser>(null);

  constructor(
    private router: Router,
    private users: UsersService,
    private app: AppService
  ) {
    this._setFireAuthRef();
  }

  public createSubscription(): Observable<FireBaseUser> {
    return this.firebaseUser.asObservable();
  }

  public signUp(email: string, password: string, payload: any = {}): Observable<User> {
    return from(this.fireBaseAuth.createUserWithEmailAndPassword(email, password))
      .pipe(
        exhaustMap((response: any) => {
          const id = response.user.uid;
          return this.users.addUser({...payload, id });
        }),
        tap((user: User) => user?.id
          ? this.router.navigate(['/users', user.id])
          : null)
      );
  }

  public login(email: string, password: string) {
    return from(this.fireBaseAuth.signInWithEmailAndPassword(email, password))
      .pipe(
        tap((response: any) => {
          if (!(response instanceof Error)) {
            this.router.navigate(['/users', response.user.uid]);
          }
        })
      );
  }

  public logout() {
    this.fireBaseAuth.signOut();
    this.firebaseUser.next(null);
    this.router.navigate(['/login']);
  }

  public deleteUserAccount(): Observable<any> {
    if (this.firebaseUser.getValue()) {
      return this.users.deleteUser(this.firebaseUser.getValue().uid)
        .pipe(
          concatMap((response: boolean) => {
            if (response) {
              const user = this.fireBaseAuth.currentUser;
              return from(user.delete());
            } else {
              const err: CustomError = {...API_ERRORS.delete};
              throw err;
            }
          })
        );
    }
  }

  private _setFireAuthRef(): void {
    this.fireBaseAuth = this.app.getFireBaseAuthReference();
    this.fireBaseAuth.onAuthStateChanged((user: any) => {
      if (user) {
        const { uid, email } = user;
        const loginUser: FireBaseUser = { uid, email };
        this.firebaseUser.next(loginUser);
      } else {
        this.firebaseUser.next(null)
      }
    });
  }

}
