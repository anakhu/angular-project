import { Injectable } from '@angular/core';
import { Follower } from '../../models/followers';
import { FOLLOWERS } from '../mock';
import { BehaviorSubject, Observable, from, EMPTY, of, forkJoin } from 'rxjs';
import { pluck, filter, toArray, find, map, mergeAll, tap, mergeMap, concatMap } from 'rxjs/operators';
import { User } from 'src/shared/models/user';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})

export class FollowersService {
  private followersSubject = new BehaviorSubject <Follower[]>([]);

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  private setFollowers(followers: Follower[]){
    this.followersSubject.next(followers);
    this.updateFollowers(this.followersSubject.getValue());
  }

  private getFollowersIds(uid: number): Observable<number[]> {
    return from(this.followersSubject.getValue())
      .pipe(
        filter(({ userId }: Follower) => userId === uid ),
        pluck(('followerId')),
        toArray(),
    );
  }

  private getFollowingsIds(uid: number): Observable<number[]> {
    return from(this.followersSubject.getValue())
      .pipe(
        filter(({ followerId }: Follower) => followerId === uid ),
        pluck(('userId')),
        toArray(),
    );
  }

  private follow(userId: number, followerId: number): void {
    const newEntry: Follower = {
      userId,
      followerId,
    };
    this.setFollowers([...this.followersSubject.getValue(), newEntry]);
  }

  private unfollow(uId: number, fId: number): void {
    from(this.followersSubject.getValue())
      .pipe(
        find(({userId, followerId}: Follower) => {
          return userId === fId && followerId === uId;
        }),
        map((value: Follower | undefined) => {
          return value
            ? [...this.followersSubject.getValue()]
              .filter((entry: Follower ) => entry !== value)
            : EMPTY;
        })
      )
      .subscribe((result: Follower[]) => this.setFollowers(result));
  }

  private collectUsers(uid$: Observable<number[]>): Observable<any>{
    return uid$.pipe(
      mergeMap((ids: number[]) => {
        if (!ids.length) {
          return of([]);
        }

        return from(ids)
          .pipe(
            concatMap((id: number) => this.usersService.getUser(id)),
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
    const authUserId = this.authService.getAuthUserId();

    let followerStatus;
    this.getFollowingsIds(authUserId)
      .pipe(
        mergeAll(),
        find((id: number) => id === userId)
      ).subscribe((result: number | undefined) => {
        followerStatus = !!result;
      });

    return followerStatus;
  }

  public getFollowersObj(userId: number): any {
    const followersIds$ = this.getFollowersIds(userId);
    const followingsIds$ = this.getFollowingsIds(userId);
    const followers$ = this.collectUsers(followersIds$);
    const followings$ = this.collectUsers(followingsIds$);

    return forkJoin({
      followers: followers$,
      followings: followings$,
    });
  }

  public getFollowersTotal(userId): {followersNum: number, followingsNum: number} {
    const followersIds$ = this.getFollowersIds(userId);
    const followingsIds$ = this.getFollowingsIds(userId);

    const followersObj = {
      followersNum: 0,
      followingsNum: 0,
    };

    followersIds$
      .subscribe((followersIds: number[]) => followersObj.followersNum = followersIds.length);

    followingsIds$
      .subscribe((followersIds: number[]) => followersObj.followingsNum = followersIds.length);

    return followersObj;
  }

  public changeUserFollowingStatus(status: boolean, userId: number): void {
    const authUserId = this.authService.getAuthUserId();
    if (status) {
      this.follow(userId, authUserId);
    } else {
      this.unfollow(authUserId, userId);
    }
  }

  public init(): void {
    this.loadFollowers();
  }

  // temporary storage
  private loadFollowers(): void {
    const followers = window.localStorage.getItem('followers');
    if (followers && followers.length) {
      this.setFollowers(JSON.parse(followers));
    } else {
      this.setFollowers(FOLLOWERS);
    }
  }

  private updateFollowers(followers: Follower[]) {
    window.localStorage.setItem('followers', JSON.stringify(followers));
  }
}

