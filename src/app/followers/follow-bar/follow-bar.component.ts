import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { FollowersService } from 'src/shared/services/followers/followers.service';
import { Subscription } from 'rxjs';
import { Follower } from 'src/shared/models/followers';

@Component({
  selector: 'app-follow-bar',
  templateUrl: './follow-bar.component.html',
  styleUrls: ['./follow-bar.component.scss']
})
export class FollowBarComponent implements OnInit, OnChanges, OnDestroy{
  @Input() userId;
  userFollowers: {
    followersNum: number,
    followingsNum: number,
  };

  followersSubscription: Subscription;

  constructor(
    private followersService: FollowersService
  ) { }

  ngOnInit(): void {
    this.createFollowersSubscipton();
  }

  ngOnChanges(): void {
    this.getUsersFollowersTotal();
  }

  ngOnDestroy(): void {
    this.followersSubscription.unsubscribe();
  }

  private createFollowersSubscipton(): void {
    this.followersSubscription = this.followersService.createSubscription()
      .subscribe((followers: Follower[]) => this.getUsersFollowersTotal());
  }

  private getUsersFollowersTotal(): void {
    this.userFollowers = this.followersService.getFollowersTotal(this.userId);
  }

}
