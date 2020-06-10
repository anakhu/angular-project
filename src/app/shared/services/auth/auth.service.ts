import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { tap, concatMap, exhaustMap, catchError, mapTo, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { UsersService } from '../users/users.service';
import { AppService } from '../app/app.service';
import { ErrorService } from 'src/modules/error-handler/error.service/error.service';


export interface FireBaseUser {
  uid: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  fireBaseAuth: any;
  fireBaseRef: any;
  firebaseUser = new BehaviorSubject<FireBaseUser>(null);

  constructor(
    private router: Router,
    private users: UsersService,
    private app: AppService,
    private errors: ErrorService
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
    const user = this.fireBaseAuth.currentUser;
    return of(user)
      .pipe(
        concatMap((loginUser: any) => {
          if (loginUser) {
            return from(user.delete())
              .pipe(
                mapTo(loginUser.uid),
            );
          }
        }),
        catchError((error: Error) => {
          this.errors.handleError(error);
          return of(false);
        }),
        map((response: any) => {
          if (typeof response === 'string') {
            this.users.updateLoacalUsersOnDelete(response);
            return of(true);
          }
        })
      );
  }

  private _setFireAuthRef(): void {
    this.fireBaseAuth = this.app.getFireBaseAuthReference();
    this.fireBaseAuth.onAuthStateChanged((user: any) => {
      if (user) {
        const { uid, email } = user;
        const loginUser: FireBaseUser = { uid, email };
        this.firebaseUser.next(loginUser);
      } else {
        this.firebaseUser.next(null);
      }
    });
  }

}
