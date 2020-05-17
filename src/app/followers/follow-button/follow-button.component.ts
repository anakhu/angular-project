import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  OnChanges,
} from '@angular/core';
import { Subscription, of, Observable } from 'rxjs';
import { FollowersService } from '../../shared/services/followers/followers.service';
import { tap, exhaustMap, delay, map, finalize } from 'rxjs/operators';
import { FireBaseFollower } from 'src/app/shared/services/followers/follower';

@Component({
  selector: 'app-follow-button',
  templateUrl: './follow-button.component.html',
  styleUrls: ['./follow-button.component.scss']
})
export class FollowButtonComponent implements OnInit, OnDestroy, OnChanges {

  @Input() userId: string;

  isFollowedByAuthUser: boolean;
  isLoading: boolean;

  clickSubscription: Subscription;
  authSubscription: Subscription;

  constructor(
    private followersService: FollowersService,
  ) {}

  ngOnInit(): void {
    this.getFollowersStatus();
  }

  ngOnChanges(): void {
    this.getFollowersStatus();
  }

  ngOnDestroy(): void {}

  private getFollowersStatus(): void {
    this.followersService.isFollowedbByAuthUser(this.userId)
      .subscribe((followersStatus: boolean) => this.isFollowedByAuthUser = followersStatus);
  }

  private changeFollowersStatus(): Observable<FireBaseFollower | null> {
    return this.followersService.changeUserFollowingStatus(this.userId);
  }

  public handleClick(event: Event): void {
    this.isLoading = true;
    of(event).pipe(
      exhaustMap((e: Event) => this.changeFollowersStatus()),
      delay(1000),
      map((result: FireBaseFollower | null) => this.getFollowersStatus()),
      finalize(() => this.isLoading = false)
    ).subscribe(res => console.log(res));
  }
}
