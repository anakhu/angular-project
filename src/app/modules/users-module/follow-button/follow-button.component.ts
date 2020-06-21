import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import { of, Observable } from 'rxjs';
import { FollowersService } from '../../../shared/services/followers/followers.service';
import { exhaustMap, delay, map, finalize, take } from 'rxjs/operators';
import { Follower } from '../../../shared/models/followers/follower';

@Component({
  selector: 'app-follow-button',
  templateUrl: './follow-button.component.html',
  styleUrls: ['./follow-button.component.scss']
})
export class FollowButtonComponent implements OnInit, OnDestroy, OnChanges {
  @Input() userId: string;
  isFollowedByAuthUser: boolean;
  isLoading: boolean;

  constructor(
    private followersService: FollowersService
  ) {}

  ngOnInit(): void {
    this._getFollowersStatus();
  }

  ngOnChanges(): void {
    this._getFollowersStatus();
  }

  ngOnDestroy(): void {}

  public handleClick(event: Event): void {
    this.isLoading = true;
    of(event)
      .pipe(
        take(1),
        exhaustMap((e: Event) => this._changeFollowersStatus()),
        delay(1000),
        map((result: Follower | null) => this._getFollowersStatus()),
        finalize(() => this.isLoading = false)
      )
    .subscribe(() => {});
  }

  private _getFollowersStatus(): void {
    this.followersService.isFollowedbByAuthUser(this.userId)
      .subscribe((followersStatus: boolean) => this.isFollowedByAuthUser = followersStatus);
  }

  private _changeFollowersStatus(): Observable<Follower | null> {
    return this.followersService.changeUserFollowingStatus(this.userId);
  }
}
