import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { FollowersService } from 'src/app/shared/services/followers/followers.service';
import { Follower } from '../shared/models/followers';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss']
})
export class FollowersComponent implements OnInit, OnDestroy, OnChanges{
  @Input() userId;
  @Input() contentName;

  userFollowings = {
    followers: [],
    followings: [],
  };

  private followersSubscription: Subscription;

  constructor(
    private followersService: FollowersService
  ) { }

  ngOnInit(): void {
    this.createFollowersSubscription();
  }

  ngOnChanges(): void {
    if (this.followersSubscription) {
      this.setUserFollowings();
    }
  }

  ngOnDestroy(): void {
    this.followersSubscription.unsubscribe();
  }

  private createFollowersSubscription(): void {
    this.followersSubscription = this.followersService.createSubscription()
     .subscribe((followers: Follower[]) => this.setUserFollowings());
  }

  private setUserFollowings(): void {
    this.followersService.getFollowersObj(this.userId)
      .subscribe((followersObj: any) => this.userFollowings = followersObj);
  }
}
