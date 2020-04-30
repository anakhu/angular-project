import { Injectable } from '@angular/core';
import { Follower } from '../../models/followers';
import { FOLLOWERS } from '../mock';
import { BehaviorSubject, Observable, from, EMPTY } from 'rxjs';
import { pluck, filter, toArray, find, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class FollowersService {
  private followersSubject = new BehaviorSubject <Follower[]>([]);

  constructor() {}

  private setFollowers(followers: Follower[]){
    this.followersSubject.next(followers);
    this.updateFollowers(this.followersSubject.getValue());
  }

  public createSubscription(): Observable<Follower[]>{
    return this.followersSubject.asObservable();
  }

  public getFollowersIds(uid: number): Observable<number[]> {
    return from(this.followersSubject.getValue())
      .pipe(
        filter(({ userId }: Follower) => userId === uid ),
        pluck(('followerId')),
        toArray(),
    );
  }

  public getFollowingsIds(uid: number): Observable<number[]> {
    return from(this.followersSubject.getValue())
      .pipe(
        filter(({ followerId }: Follower) => followerId === uid ),
        pluck(('userId')),
        toArray(),
    );
  }

  public follow(userId: number, followerId: number): void {
    const newEntry: Follower = {
      userId,
      followerId,
    };
    this.setFollowers([...this.followersSubject.getValue(), newEntry]);
  }

  public unfollow(uId: number, fId: number): void {
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

