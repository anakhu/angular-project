import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { LikesService } from '../../../../../app/shared/services/likes/likes.service';
import { AuthService, FireBaseUser } from '../../../../../app/shared/services/auth/auth.service';
import { Subscription, of } from 'rxjs';
import { exhaustMap, delay, tap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-like-button',
  templateUrl: './like-button.component.html',
  styleUrls: ['./like-button.component.scss']
})
export class LikeButtonComponent implements OnInit, OnDestroy {

  @Input() courseId: string;
  authUserId: string;
  isLiked: boolean;
  authSubscription: Subscription;
  isLoading = false;

  constructor(
    private likesService: LikesService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this._createAuthSubscription();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  private _createAuthSubscription(): void {
    this.authSubscription = this.authService.createSubscription()
      .subscribe((user: FireBaseUser) => {
       this.authUserId = user ? user.uid : null;
       if (this.authUserId) {
         this._setUserLikeStatus();
       }
    });
  }

  private _setUserLikeStatus(): void {
    this.isLiked = this.likesService.getUserStatus(this.courseId, 'likedCourses');
  }

  public likeCourse(event: Event): void {
    this.isLoading = true;
    of(event)
      .pipe(
        delay(1000),
        exhaustMap((e: Event) => this.likesService.changeLikeStatus(this.courseId)),
        delay(300),
        tap(() => this._setUserLikeStatus()),
        finalize(() => this.isLoading = false)
      )
      .subscribe(() => {},
      (error: Error) => console.log(error));
  }

}
