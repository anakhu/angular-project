import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { LikesService } from 'src/app/shared/services/likes/likes.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Subscription, of, Observable } from 'rxjs';
import { exhaustMap, delay, tap, finalize, first } from 'rxjs/operators';
import { LoggedInUser } from 'src/app/shared/models/user/loggedInUser';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { selectAuthUserUid } from 'src/app/store/auth/auth.selectors';

@Component({
  selector: 'app-like-button',
  templateUrl: './like-button.component.html',
  styleUrls: ['./like-button.component.scss']
})
export class LikeButtonComponent implements OnInit, OnDestroy {
  @Input() courseId: string;
  @Output() statusChanged = new EventEmitter();
  public isLiked: boolean;
  public isLoading = false;
  public authUserId$: Observable<string>;

  constructor(
    private likesService: LikesService,
    private cdr: ChangeDetectorRef,
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.authUserId$ = this.store.select(selectAuthUserUid)
      .pipe(
        tap((userId: string) => {
          if (userId) {
            this._setUserLikeStatus();
          }
        })
      );
  }

  ngOnDestroy(): void {}

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
      .subscribe(() => {
        this.authUserId$.subscribe((userId: string) => {
          this.statusChanged.emit(userId);
        });
      });
  }

  private _setUserLikeStatus(): void {
    this.isLiked = this.likesService.getUserStatus(this.courseId, 'likedCourses');
  }
}
