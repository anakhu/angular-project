import { Injectable } from '@angular/core';
import { USERS } from '../mock';
import { User } from '../../models/user';
import {
  of,
  from,
  BehaviorSubject,
  Observable,
} from 'rxjs';
import {
  first,
  mergeAll,
  find,
  switchMap,
  findIndex,
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class UsersService {
  private usersSubject = new BehaviorSubject<User[]>([]);

  constructor() { }

  public createSubscription(): Observable<User[]>{
    return this.usersSubject.asObservable();
  }

  private setUsers(users: User[]): void {
    this.usersSubject.next(users);
  }

  public getUser(id: number): Observable<User | Error> {
    return from(this.usersSubject).pipe(
      first(),
      mergeAll(),
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

  public updateUserDetail(user: User): void {
    const { id } = user;
    from(this.usersSubject.getValue())
      .pipe(
        findIndex(({ id: userId }: User) => userId === id))
          .subscribe((index: number) => {
            if (index !== -1 ){
              const updated = [...this.usersSubject.getValue()];
              updated.splice(index, 1, user);
              this.setUsers(updated);
              // temporary storage update
              this.updateLocalStorage();
            } else {
              console.log('failed to update');
          }
      });
  }

  init(): void {
    this.loadUsers();
  }

  // temparary storage

  private loadUsers(): void {
    const loadedUsers = window.localStorage.getItem('users');
    if (loadedUsers) {
      this.setUsers(JSON.parse(loadedUsers));
    } else {
      this.setUsers(USERS);
    }
  }

  private updateLocalStorage(): void {
    window.localStorage.setItem('users', JSON.stringify(this.usersSubject.getValue()));
  }
}
