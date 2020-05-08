import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  OnChanges,
  AfterViewChecked,
} from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { FollowersService } from 'src/shared/services/followers/followers.service';

@Component({
  selector: 'app-follow-button',
  templateUrl: './follow-button.component.html',
  styleUrls: ['./follow-button.component.scss']
})
export class FollowButtonComponent implements OnInit, OnDestroy, OnChanges, AfterViewChecked {

  @Input() userId: number;

  isFollowedByAuthUser: boolean;

  clickSubscription: Subscription;
  authSubscription: Subscription;

  constructor(
    private followersService: FollowersService,
  ) {}

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.getFollowersStatus();
  }

  ngAfterViewChecked(): void {
    if (!this.clickSubscription) {
      this.createBtnFollowSubscription();
    }
  }

  ngOnDestroy(): void {
    if (this.clickSubscription) {
      this.clickSubscription.unsubscribe();
    }
  }

  private createBtnFollowSubscription(): void {
    const btnFollow = document.getElementById('btn-follow');
    this.clickSubscription = fromEvent(btnFollow, 'click')
      .subscribe((event: Event) => this.changeFollowersStatus());
  }

  private getFollowersStatus(): void {
    this.isFollowedByAuthUser = this.followersService.isFollowedbByAuthUser(this.userId);
  }

  private changeFollowersStatus(): void {
    this.isFollowedByAuthUser = !this.isFollowedByAuthUser;
    this.followersService.changeUserFollowingStatus(this.isFollowedByAuthUser, this.userId);
  }
}
