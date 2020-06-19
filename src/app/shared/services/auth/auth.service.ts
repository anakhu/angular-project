import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { tap, concatMap, exhaustMap, catchError, mapTo, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../../models/user/user';
import { UsersService } from '../users/users.service';
import { AppService } from '../app/app.service';
import { ErrorService } from 'src/app/modules/error-handler/error.service/error.service';
import { LoggedInUser } from '../../models/user/loggedInUser';
import { FirebaseError } from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private fireBaseAuth: firebase.auth.Auth;
  private firebaseUser = new BehaviorSubject<LoggedInUser>(null);

  constructor(
    private router: Router,
    private users: UsersService,
    private app: AppService,
    private errors: ErrorService
  ) {
    this._setFireAuthRef();
  }

  public createSubscription(): Observable<LoggedInUser> {
    return this.firebaseUser.asObservable();
  }

  public signUp(email: string, password: string, payload: Partial<User>): Observable<User> {
    return from(this.fireBaseAuth.createUserWithEmailAndPassword(email, password))
      .pipe(
        exhaustMap((response: firebase.auth.UserCredential) => {
          if (response?.user.uid) {
            const id = response.user.uid;
            return this.users.addUser({...payload, id });
          }
        }),
        tap((user: User) => user?.id
          ? this.router.navigate(['/users', user.id])
          : null)
      );
  }

  public login(email: string, password: string): Observable<string | null> {
    return from(this.fireBaseAuth.signInWithEmailAndPassword(email, password))
      .pipe(
        map((response: firebase.auth.UserCredential) => {
          if (response?.user) {
            this.router.navigate(['/users', response.user.uid]);
            return response?.user.uid;
          }
          return null;
        })
      );
  }

  public logout(): void {
    this.fireBaseAuth.signOut();
    this.firebaseUser.next(null);
    this.router.navigate(['/login']);
  }

  public deleteUserAccount(): Observable<boolean> {
    const user = this.fireBaseAuth.currentUser;
    return of(user)
      .pipe(
        concatMap((loginUser: firebase.User | null) => {
          if (loginUser) {
            return from(user.delete())
              .pipe(
                mapTo(loginUser.uid),
            );
          }
        }),
        catchError((error: FirebaseError) => {
          this.errors.handleError(error);
          return of(false);
        }),
        map((response: string | boolean) => {
          if (typeof response === 'string') {
            this.users.updateLoacalUsersOnDelete(response);
            return true;
          } else {
            return response;
          }
        })
      );
  }

  private _setFireAuthRef(): void {
    this.fireBaseAuth = this.app.getFireBaseAuthReference();
    this.fireBaseAuth.onAuthStateChanged((user: firebase.User | null) => {
      if (user) {
        const { uid, email } = user;
        const authUser: LoggedInUser = { uid, email };
        this.firebaseUser.next(authUser);
      } else {
        this.firebaseUser.next(null);
      }
    });
  }
}
