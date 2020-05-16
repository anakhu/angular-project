import { Injectable } from '@angular/core';
import { USERS } from '../mock';
import { User } from '../../models/user';
import {
  of,
  from,
  BehaviorSubject,
  Observable,
  Subject,
} from 'rxjs';
import {
  first,
  mergeAll,
  find,
  switchMap,
  map,
  tap,
} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../api/api.service';
import { NewUser } from './user';

@Injectable({
  providedIn: 'root'
})

export class UsersService {
  constructor( private api: ApiService) { }

  private users: User[] = [];
  private userSubject = new Subject<User[]>();

  public createSubscription(): Observable<User[]>{
    return this.userSubject.asObservable();
  }

  public getUsers(): User[] {
    return this.users;
  }

  private _setUsers(): void {
    // this.users = users;
    this.userSubject.next(this.users);
  }

  public loadUsers(): Observable<User []> {
    return this.api.getAll('users')
      .pipe(
        map((users: User[]) => {
          this.users = users;
          this._setUsers();
          return this.users;
        })
      );
  }

  public getUser(id: string): Observable<User | Error> {
    return from(this.users)
      .pipe(
        find(({id: userId}: User) => userId === id),
        switchMap((result: User | undefined) => {
          if (!result) {
            throw Error('User not found');
          } else {
            return of(result);
          }
        })
      );
  }

  public getUserById(id: string): Observable<User> {
    return this.api.getItem('users', id);
  }

  public updateUserDetail(updatedUser: User): Observable<User> {
    return this.api.updateItem('users', updatedUser)
      .pipe(
        map((user: User) => {
          const index = this.users.findIndex((entry: User) => entry.id === user.id);
          if (index !== -1) {
            this.users.splice(index, 1, user);
            this._setUsers();
            return user;
          }
        }),
      );
    //   .subscribe((user: User) => {
    //     const index = this.users
    //       .findIndex((entry: User) => {
    //         return entry.id === user.id;
    //       });

    //     if (index !== -1) {
    //       this.users.splice(index, 1, user);
    //       this._setUsers();
    //     }
    // });
  }

  public addUser(payloadData: Partial<User>): Observable<any> {
    const {id, name, country, occupation, image } = payloadData;
    const newUser = new NewUser(id, name, country, occupation, image);
    return this.api.updateItem('users', newUser)
      .pipe(
        tap((user: User) => {
          this.users.push(user);
          this._setUsers();
        })
      );
  }
}
