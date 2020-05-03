import { Injectable } from '@angular/core';
import { USERS } from '../mock';
import { User } from '../../models/user';
import {
  of,
  from,
  BehaviorSubject,
  Observable,
  forkJoin
} from 'rxjs';
import {
  first,
  mergeAll,
  find,
  switchMap,
  findIndex,
  concatMap,
  map,
  toArray,
  mergeMap
} from 'rxjs/operators';
import { FollowersService } from '../followers/followers.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})

export class UsersService {
  private usersSubject = new BehaviorSubject<User[]>([]);

  constructor(
    private followersService: FollowersService,
  ) { }

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
          return of(Error('User not found'));
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
        findIndex(({ id: userId }: User) => userId === id)
        ).subscribe((index: number) => {
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

  public collectUsers(uid$: Observable<number[]>): Observable<any>{
    return uid$.pipe(
      mergeMap((ids: number[]) => {
        if (!ids.length) {
          return of([]);
        }

        return from(ids)
          .pipe(
            concatMap((id: number) => this.getUser(id)),
             map(({id, name, image}: User) => {
              return {
                id,
                name,
                image,
              };
            }),
            toArray(),
          );
        })
    );
  }

  public getFollowersObj(userId: number): any {
    const followersIds$ = this.followersService.getFollowersIds(userId);
    const followingsIds$ = this.followersService.getFollowingsIds(userId);
    const followers$ = this.collectUsers(followersIds$);
    const followings$ = this.collectUsers(followingsIds$);

    return forkJoin({
      followers: followers$,
      followings: followings$,
    });
  }

  public changeUserFollowingStatus(status: boolean, userId: number, followerId: number): void {
    if (status) {
      this.followersService.follow(userId, followerId);
    } else {
      this.followersService.unfollow(followerId, userId);
    }
  }

  init(): void {
    // this.setUsers(USERS);
    this.loadUsers();
    this.followersService.init();
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
