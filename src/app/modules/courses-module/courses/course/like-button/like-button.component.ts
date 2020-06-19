import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { LikesService } from 'src/app/shared/services/likes/likes.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Subscription, of } from 'rxjs';
import { exhaustMap, delay, tap, finalize, first } from 'rxjs/operators';
import { LoggedInUser } from 'src/app/shared/models/user/loggedInUser';

@Component({
  selector: 'app-like-button',
  templateUrl: './like-button.component.html',
  styleUrls: ['./like-button.component.scss']
})
export class LikeButtonComponent implements OnInit, OnDestroy {

  @Input() courseId: string;
  @Output() statusChanged = new EventEmitter();
  public authUserId: string;
  public isLiked: boolean;
  public isLoading = false;
  private authSubscription: Subscription;

  constructor(
    private likesService: LikesService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this._createAuthSubscription();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  public likeCourse(event: Event): void {
    this.isLoading = true;
    of(event)
      .pipe(
        first(),
        delay(1000),
        exhaustMap((e: Event) => this.likesService.changeLikeStatus(this.courseId)),
        delay(300),
        tap(() => this._setUserLikeStatus()),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe(() => this.statusChanged.emit(this.authUserId));
  }

  private _setUserLikeStatus(): void {
    this.isLiked = this.likesService.getUserStatus(this.courseId, 'likedCourses');
  }

  private _createAuthSubscription(): void {
    this.authSubscription = this.authService.createSubscription()
      .subscribe((user: LoggedInUser) => {
       this.authUserId = user ? user.uid : null;
       if (this.authUserId) {
         this._setUserLikeStatus();
       }
    });
  }
}
