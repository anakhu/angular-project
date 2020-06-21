import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LikesService } from 'src/app/shared/services/likes/likes.service';
import { of, Observable } from 'rxjs';
import { delay, exhaustMap, tap, finalize, take, mapTo, map } from 'rxjs/operators';
import { NotificationsService } from 'src/app/shared/services/notifications/notifications.service';
import { Router } from '@angular/router';
import { LoggedInUser } from 'src/app/shared/models/user/loggedInUser';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { selectAuthUserUid } from 'src/app/store/auth/auth.selectors';

@Component({
  selector: 'app-enroll-btn',
  templateUrl: './enroll-btn.component.html',
  styleUrls: ['./enroll-btn.component.scss']
})
export class EnrollBtnComponent implements OnInit, OnDestroy{
  @Input() courseId: string;
  @Input() courseAuthorId: string;
  public isLoading: boolean;
  public isEnrolled = false;
  public authUserId$: Observable<string>;

  constructor(
    private likesService: LikesService,
    private notifications: NotificationsService,
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.authUserId$ = this.store.select(selectAuthUserUid)
      .pipe(
        tap((userId: string) => {
          if (userId) {
            this._setUserEnrollStatus();
          }
        })
      );
  }

  ngOnDestroy(): void {}

  public enroll(event: Event) {
    this.isLoading = true;
    of(event)
      .pipe(
        take(1),
        delay(1000),
        exhaustMap((e: Event) => this.likesService.changeEnrollStatus(this.courseId)),
        tap(() => this._setUserEnrollStatus()),
        finalize(() => this.isLoading = false)
      )
      .subscribe(() => {
        if (this.isEnrolled) {
          this.notifications.createNotification('You successfully enrolled in the course. The author will contact you');
        }
    });
  }

  private _setUserEnrollStatus(): void {
    this.isEnrolled = this.likesService.getUserStatus(this.courseId, 'enrolledCourses');
  }
}
