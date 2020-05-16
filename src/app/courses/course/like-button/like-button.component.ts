import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { LikesService } from 'src/shared/services/likes/likes.service';
import { AuthService } from 'src/shared/services/auth/auth.service';
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
      .subscribe((user: any) => {
       this.authUserId = user ? user.id : null;
       if (this.authUserId) {
         this._setUserLikeStatus();
       }
    });
  }

  private _setUserLikeStatus(): void {
    this.isLiked = this.likesService.getLikeStatus(this.courseId);
  }

  public likeCourse(event: Event): void {
    this.isLoading = true;
    of(event)
      .pipe(
        delay(1000),
        exhaustMap((e: Event) => this.likesService.changeLikeStatus(this.courseId)),
        delay(300),
        tap((point: number) => this._setUserLikeStatus()),
        finalize(() => this.isLoading = false)
      )
      .subscribe((result: number) => console.log('success'),
      (error: Error) => console.log(error));
  }

}
