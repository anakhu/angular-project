import { Injectable } from '@angular/core';
import { Follower } from '../../models/followers';
import { BehaviorSubject, Observable, from, of, forkJoin, Subscription } from 'rxjs';
import { pluck, filter, toArray, find, map, mergeAll, tap, mergeMap, concatMap, } from 'rxjs/operators';
import { User } from '../../models/user';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { ApiService } from '../api/api.service';
import { LoginUser } from '../auth/login.user';
import { FireBaseFollower } from './follower';


@Injectable({
  providedIn: 'root'
})

export class FollowersService {

  followers: Follower[] = [];
  followersSubject = new BehaviorSubject<Follower[]>([]);
  authUserId: string;
  authSubscription: Subscription;

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private api: ApiService,
  ) {
    this._init();
  }

  private _init(): void {
    this.authSubscription = this.authService.createSubscription()
      .subscribe((user: LoginUser) => this.authUserId = user ? user.id : null);
    this.loadFollowers();
  }

  public  loadFollowers(): Observable<Follower[]> {
    return this._getAllFollowers()
      .pipe(
        map((followers: Follower[]) => {
        this._setFollowers(followers);
        return this.followers;
      })
    );
  }

  private _getAllFollowers(): Observable<Follower[]> {
    return this.api.getAll('followers', true);
  }

  private _setFollowers(followers: Follower[]){
    this.followers = followers;
    this.followersSubject.next(this.followers);
  }

  private _getFollowersIds(uid: string): Observable<string[]> {
    return from(this.followersSubject.getValue())
      .pipe(
        filter(({ userId }: Follower) => userId === uid ),
        pluck(('followerId')),
        toArray(),
    );
  }

  private _getFollowingsIds(uid: string): Observable<string[]> {
    return from(this.followersSubject.getValue())
      .pipe(
        filter(({ followerId }: Follower) => followerId === uid ),
        pluck(('userId')),
        toArray(),
    );
  }

  private _deleteFollowersEntry(entryId: string): Observable<null> {
    return this.api.deleteItem('followers', entryId)
      .pipe(
       map((response: any) => {
         if (!response) {
          const index = this.followers
            .findIndex((entry: FireBaseFollower) => entry.id === entryId);
          if (index !== -1) {
            this.followers.splice(index, 1);
            this._setFollowers(this.followers);
          }
          return null;
        }
      })
    );
  }

  public deleteAllFollowersEntries(userId: string): Observable<any> {
   return from(this.followers)
      .pipe(
        filter((entry: FireBaseFollower) => userId === entry.userId || entry.followerId === userId),
        pluck('id'),
        concatMap((id: string) => this._deleteFollowersEntry(id)),
      );
  }

  private _addFollowersEntry(uId: string, fId: string): Observable<FireBaseFollower>{
    const newEntry: Follower = {
      userId: uId,
      followerId: fId,
    };
    return this.api.addItem('followers', newEntry)
      .pipe(
        map((data: {name: string}) => {
          const id = data.name;
          const entry = new FireBaseFollower(uId, fId, id);

          this.followers.push({...entry});
          this._setFollowers(this.followers);
          return entry;
        })
      );
  }


  private _changeFollowersStatus(uId: string, fId: string): Observable<FireBaseFollower | null> {
    return from(this.followersSubject.getValue())
      .pipe(
        find(({ userId, followerId }: Follower) => {
          return userId === uId && followerId === fId;
        }),
        concatMap((result: FireBaseFollower | null) => {
          if (!result) {
            return this._addFollowersEntry(uId, fId);
          } else {
            console.log(result.id);
            return this._deleteFollowersEntry(result.id);
          }
        }),
      );
  }

  private _collectUsers(uid$: Observable<string[]>): Observable<any>{
    return uid$.pipe(
      mergeMap((ids: string[]) => {
        if (!ids.length) {
          return of([]);
        }

        return from(ids)
          .pipe(
            concatMap((id: string) => this.usersService.getUser(id)),
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

  public createSubscription(): Observable<Follower[]>{
    return this.followersSubject.asObservable();
  }

  public isFollowedbByAuthUser(userId): Observable<boolean> {
    return this._getFollowingsIds(this.authUserId)
      .pipe(
        mergeAll(),
        find((id: string) => id === userId),
        map((result: string | undefined) => {
          return !!result;
        })
      );
  }

  public getFollowersObj(userId: string): any {
    const followersIds$ = this._getFollowersIds(userId);
    const followingsIds$ = this._getFollowingsIds(userId);
    const followers$ = this._collectUsers(followersIds$);
    const followings$ = this._collectUsers(followingsIds$);

    return forkJoin({
      followers: followers$,
      followings: followings$,
    });
  }

  public getFollowersTotal(userId): {followersNum: number, followingsNum: number} {
    const followersIds$ = this._getFollowersIds(userId);
    const followingsIds$ = this._getFollowingsIds(userId);

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

  public changeUserFollowingStatus(userId: string): Observable<FireBaseFollower| null> {
    return this._changeFollowersStatus(userId, this.authUserId);
  }
}

