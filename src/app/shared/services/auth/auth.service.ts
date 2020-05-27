import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { tap, concatMap, exhaustMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { UsersService } from '../users/users.service';
import { ApiService } from '../api/api.service';
import { AppService } from '../app/app.service';


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
    // private api: ApiService,
    private app: AppService
  ) {
    this.setFireAuthRef();
  }

  private setFireAuthRef() {
    this.fireBaseAuth = this.app.getFireBaseAuthReference();
    this.fireBaseAuth.onAuthStateChanged((user: any) => {
      if (user) {
        const { uid, email } = user;
        const loginUser: FireBaseUser = { uid, email };
        this.firebaseUser.next(loginUser);
      }
    });
  }

  public signUp(email: string, password: string, payload: any = {}) {
    return from(this.fireBaseAuth.createUserWithEmailAndPassword(email, password))
      .pipe(
        exhaustMap((response: any) => {
          const id = response.user.uid;
          return this.users.addUser({...payload, id });
        }),
        tap((user: User) => user?.id
          ? this.router.navigate(['/users', user.id])
          : console.log('error occured'))
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
              throw Error('Account wasn\'t deleted. Login again and retry.');
            }
          })
        );
    }
  }

  public createSubscription(): Observable<FireBaseUser> {
    return this.firebaseUser.asObservable();
  }
}
