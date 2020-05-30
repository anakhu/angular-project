import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { FollowersService } from 'src/app/shared/services/followers/followers.service';
import { Subscription } from 'rxjs';
import { Follower } from '../../../app/shared/services/followers/follower.interface';

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
    this._createFollowersSubscipton();
  }

  ngOnChanges(): void {
    this._getUsersFollowersTotal();
  }

  ngOnDestroy(): void {
    this.followersSubscription.unsubscribe();
  }

  private _createFollowersSubscipton(): void {
    this.followersSubscription = this.followersService.createSubscription()
      .subscribe((followers: Follower[]) => this._getUsersFollowersTotal());
  }

  private _getUsersFollowersTotal(): void {
    this.userFollowers = this.followersService.getFollowersTotal(this.userId);
  }

}
