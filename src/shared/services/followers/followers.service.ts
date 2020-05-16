import { Injectable } from '@angular/core';
import { Follower } from '../../models/followers';
import { BehaviorSubject, Observable, from, of, forkJoin, Subscription } from 'rxjs';
import { pluck, filter, toArray, find, map, mergeAll, tap, mergeMap, concatMap,} from 'rxjs/operators';
import { User } from 'src/shared/models/user';
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
    this._loadFollowers();
  }

  private _loadFollowers(): void {
    this._getAllFollowers()
      .subscribe((followers: Follower[]) => {
        this._setFollowers(followers);
      });
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

  private _deleteFollowersEntry(entryId: string): void {
    this.api.deleteItem('followers', entryId)
      .subscribe((response: any) => {
        if (!response) {
          const index = this.followers
            .findIndex((entry: FireBaseFollower) => entry.id === entryId);
          if (index !== 1) {
            this.followers.splice(index, 1);
            this._setFollowers(this.followers);
          }
        }
      });
    // this.followersRef.remove(entryId);
  }

  private _addFollowersEntry(uId: string, fId: string) {
    const newEntry: Follower = {
      userId: uId,
      followerId: fId,
    };
    this.api.addItem('followers', newEntry)
      .subscribe((data: { name: string}) => {
        const id = data.name;
        const entry = new FireBaseFollower(uId, fId, id);
        this.followers.push(entry);
        this._setFollowers(this.followers);
      });
  }


  private _changeFollowersStatus(uId: string, fId: string): any {
    return from(this.followersSubject.getValue())
      .pipe(
        find(({ userId, followerId }: Follower) => {
          return userId === uId && followerId === fId;
        }),
        tap((result: FireBaseFollower | undefined) => {
          if (!result) {
            this._addFollowersEntry(uId, fId);
          } else {
            this._deleteFollowersEntry(result.id);
          }
        })
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

  public isFollowedbByAuthUser(userId): boolean {

    let followerStatus;
    this._getFollowingsIds(this.authUserId)
      .pipe(
        mergeAll(),
        find((id: string) => id === userId)
      )
      .subscribe((result: string | undefined) => {
        followerStatus = !!result;
      });

    return followerStatus;
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

  public changeUserFollowingStatus(userId: string): void {
    this._changeFollowersStatus(userId, this.authUserId)
      .subscribe((result) => console.log(result));
  }
}

