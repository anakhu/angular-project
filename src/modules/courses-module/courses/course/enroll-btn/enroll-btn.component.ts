import { Component, OnInit, Input } from '@angular/core';
import { AuthService, FireBaseUser } from 'src/app/shared/services/auth/auth.service';
import { LikesService } from 'src/app/shared/services/likes/likes.service';
import { of } from 'rxjs';
import { delay, exhaustMap, tap, finalize } from 'rxjs/operators';
import { NotificationsService } from 'src/app/shared/services/notifications/notifications.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enroll-btn',
  templateUrl: './enroll-btn.component.html',
  styleUrls: ['./enroll-btn.component.scss']
})
export class EnrollBtnComponent implements OnInit {
  @Input() courseId: string;
  @Input() courseAuthorId: string;
  authUserId: string;
  isLoading: boolean;
  isEnrolled = false;
  authSubscription: any;

  constructor(
    private auth: AuthService,
    private likesService: LikesService,
    private notifications: NotificationsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this._createAuthSubscription();
  }

  public enroll(event: Event) {
    if (!this.authUserId) {
      this.router.navigate(['/login'], { queryParams: { action: 'sign-in' } });
      return;
    }

    this.isLoading = true;
    of(event)
      .pipe(
        delay(1000),
        exhaustMap((e: Event) => this.likesService.changeEnrollStatus(this.courseId)),
        delay(300),
        tap(() => this._setUserEnrollStatus()),
        finalize(() => this.isLoading = false)
      )
      .subscribe(() => {
        if (this.isEnrolled) {
          this.notifications.createNotification('You successfully enrolled in the course. The author will contact you');
        }
    });
  }

  private _createAuthSubscription(): void {
    this.authSubscription = this.auth.createSubscription()
      .subscribe((user: FireBaseUser) => {
       this.authUserId = user ? user.uid : null;
       if (this.authUserId) {
         this._setUserEnrollStatus();
       }
    });
  }

  private _setUserEnrollStatus(): void {
    this.isEnrolled = this.likesService.getUserStatus(this.courseId, 'enrolledCourses');
  }

}
