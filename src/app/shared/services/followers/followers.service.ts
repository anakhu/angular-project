import { Injectable } from '@angular/core';
import { Follower } from './follower.interface';
import { BehaviorSubject, Observable, from, of, forkJoin, Subscription, zip, Subject } from 'rxjs';
import { pluck, filter, toArray, find, map, mergeAll, mergeMap, concatMap, tap, switchMap, exhaustMap } from 'rxjs/operators';
import { User } from '../../models/user';
import { AuthService, FireBaseUser } from '../auth/auth.service';
import { ApiService } from '../api/api.service';
import { LoginUser } from '../auth/login.user';
import { NewFollower } from './follower';
import { routes } from '../../../../environments/environment';
import { UsersService } from '../users/users.service';

@Injectable({
  providedIn: 'root'
})

export class FollowersService {
  isLoaded: false;
  followers: Follower[] = [];
  followersSubject = new Subject<Follower[]>();
  authUserId: string;
  authSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private api: ApiService,
    private users: UsersService
  ) {
    this._init();
  }

  private _init(): void {
    this.authSubscription = this.authService.createSubscription()
      .subscribe((user: FireBaseUser) => this.authUserId = user ? user.uid : null);
  }

  public loadFollowers(): Observable<Follower[]> {
    return this.api.getCollectionEntries(routes.followers)
      .pipe(
        map((followers: Follower[]) => {
        this._setFollowers(followers);
        return this.followers;
      })
    );
  }

  private _setFollowers(followers: Follower[]){
    this.followers = followers;
    this.followersSubject.next(this.followers);
  }

  public getFollowers(): Follower[] {
    return this.followers;
  }

  public getFollowersIds(uid: string): Observable<string[]> {
    return from(this.followers)
      .pipe(
        filter(({ userId }: Follower) => userId === uid ),
        pluck(('followerId')),
        toArray(),
    );
  }

  public getFollowingsIds(uid: string): Observable<string[]> {
    return from(this.followers)
      .pipe(
        filter(({ followerId }: Follower) => followerId === uid ),
        pluck(('userId')),
        toArray(),
    );
  }

  private _deleteFollowersEntry(entryId: string): Observable<null> {
    return this.api.deleteEntry(`${routes.followers}/${entryId}`)
      .pipe(
       map((response: any) => {
         if (!response) {
          const index = this.followers
            .findIndex((entry: Follower) => entry.id === entryId);
          if (index !== -1) {
            this.followers.splice(index, 1);
            this._setFollowers(this.followers);
          }
          return null;
        }
      })
    );
  }

  private _addFollowersEntry(uId: string, fId: string): Observable<Follower>{
    const newEntry: Follower = {
      userId: uId,
      followerId: fId,
    };
    return this.api.pushEntry(routes.followers, newEntry)
      .pipe(
        map((key: string) => {
          const id = key;
          const entry = new NewFollower(uId, fId, id);
          this.followers.push({...entry});
          this._setFollowers(this.followers);
          return entry;
        })
      );
  }

  private _changeFollowersStatus(uId: string, fId: string): Observable<Follower | null> {
    return from(this.followers)
      .pipe(
        find(({ userId, followerId }: Follower) => {
          return userId === uId && followerId === fId;
        }),
        concatMap((result: Follower | null) => {
          if (!result) {
            return this._addFollowersEntry(uId, fId);
          } else {
            console.log(result.id);
            return this._deleteFollowersEntry(result.id);
          }
        }),
      );
  }


  // private _collectUsers(uid$: Observable<string[]>): Observable<any>{
  //   return uid$.pipe(
  //     concatMap((ids: string[]) => {
  //       if (!ids.length) {
  //         return of([]);
  //       }

  //       return from(ids)
  //         .pipe(
  //           // concatMap((id: string) => this.api.getItem(routes.users, id)),
  //           //   map(({id, name, image}: User) => {
  //           //     return {
  //           //       id,
  //           //       name,
  //           //       image,
  //           //     };
  //           //   }),
  //             toArray(),
  //           );
  //         })
  //   );
  // }

  public createSubscription(): Observable<Follower[]>{
    return this.followersSubject.asObservable();
  }

  public isFollowedbByAuthUser(userId): Observable<boolean> {
    return this.getFollowingsIds(this.authUserId)
      .pipe(
        mergeAll(),
        find((id: string) => id === userId),
        map((result: string | undefined) => {
          return !!result;
        })
      );
  }

  // public getFollowersThumbs(userId): Observable<Partial<User[]>> {
  //   const followersIds$ = this._getFollowersIds(userId);
  //   return this._collectUsers(followersIds$);
  // }

  // public getFollowingsThumbs(userId): Observable<Partial<User[]>> {
  //   const followingsIds$ = this._getFollowingsIds(userId);
  //   return this._collectUsers(followingsIds$);
  // }

  public getFollowersTotal(userId): {followersNum: number, followingsNum: number} {
    const followersIds$ = this.getFollowersIds(userId);
    const followingsIds$ = this.getFollowingsIds(userId);

    const followersObj = {
      followersNum: 0,
      followingsNum: 0,
    };

    followersIds$
      .subscribe((followersIds: string[]) => followersObj.followersNum = followersIds.length);

    followingsIds$
      .subscribe((followersIds: string[]) => followersObj.followingsNum = followersIds.length);

    return followersObj;
  }

  public changeUserFollowingStatus(userId: string): Observable<Follower| null> {
    return this.api.getByChildValue(routes.users, 'id', userId)
      .pipe(
        concatMap((result: User []| null) => {
          if (!result || !result[0].isActive) {
            throw Error(`User with id ${userId} doesn\'t exist`);
          }
          return this._changeFollowersStatus(userId, this.authUserId);
        })
      );
    }
}
