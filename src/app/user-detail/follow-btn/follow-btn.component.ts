import {
  Component,
  OnInit,
  Input,
  Output,
  OnDestroy,
  EventEmitter
} from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';

@Component({
  selector: 'app-follow-btn',
  templateUrl: './follow-btn.component.html',
  styleUrls: ['./follow-btn.component.scss']
})
export class FollowBtnComponent implements OnInit, OnDestroy {

  @Input() followerStatus: boolean;
  @Input() userId: number;
  @Output() setFollowerStatus = new EventEmitter<boolean>();

  clickSubscription: Subscription;

  constructor() {}

  ngOnInit(): void {
    this.createBtnFollowSubscription();
  }

  ngOnDestroy(): void {
    this.clickSubscription.unsubscribe();
  }

  private createBtnFollowSubscription(): void {
    const btnFollow = document.getElementById('btn-follow');
    this.clickSubscription = fromEvent(btnFollow, 'click')
      .subscribe((event: Event) => {
        this.followerStatus = !this.followerStatus;
        this.changeFollowersStatus();
      });
  }

  public changeFollowersStatus(): void {
    this.setFollowerStatus.emit(this.followerStatus);
  }
}
