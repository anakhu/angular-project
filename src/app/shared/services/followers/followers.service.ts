import { Injectable } from '@angular/core';
import { Follower } from '../../models/followers/follower';
import { Observable, from, Subscription, Subject } from 'rxjs';
import { pluck, filter, toArray, find, map, mergeAll, concatMap } from 'rxjs/operators';
import { User } from '../../models/user/user';
import { AuthService } from '../auth/auth.service';
import { ApiService } from '../api/api.service';
import { NewFollower } from './follower';
import { routes } from '../../../../environments/environment';
import { LoggedInUser } from '../../models/user/loggedInUser';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { selectAuthUserUid } from 'src/app/store/auth/auth.selectors';

@Injectable({
  providedIn: 'root'
})

export class FollowersService {
  public isLoaded: false;
  public authUserId: string;
  private followers: Follower[] = [];
  private followersSubject = new Subject<Follower[]>();

  constructor(
    private api: ApiService,
    private store: Store<AppState>,
  ) {
    this._init();
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


  public createSubscription(): Observable<Follower[]>{
    return this.followersSubject.asObservable();
  }

  public isFollowedbByAuthUser(userId: string): Observable<boolean> {
    return this.getFollowingsIds(this.authUserId)
      .pipe(
        mergeAll(),
        find((id: string) => id === userId),
        map((result: string | undefined) => {
          return !!result;
        })
      );
  }

  public getFollowersTotal(userId: string): {followersNum: number, followingsNum: number} {
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

  private _init(): void {
    this.store.select(selectAuthUserUid)
      .subscribe((userId: string) => this.authUserId = userId);
  }

  private _setFollowers(followers: Follower[]){
    this.followers = followers;
    this.followersSubject.next(this.followers);
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
            return this._deleteFollowersEntry(result.id);
          }
        }),
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

}

