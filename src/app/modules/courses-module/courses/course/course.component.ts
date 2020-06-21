import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Course } from 'src/app/shared/models/courses/course';
import { User } from 'src/app/shared/models/user/user';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { Subscription, Observable } from 'rxjs';
import { CoursesService } from '../../../../shared/services/courses/courses.service';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { selectAuthUserUid } from 'src/app/store/auth/auth.selectors';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent implements OnInit, OnDestroy {
  @Input() course: Course;
  public author: User;
  private coursesSubscription: Subscription;
  private authUserId$: Observable<string>;

  constructor(
    private usersService: UsersService,
    private coursesService: CoursesService,
    private cdr: ChangeDetectorRef,
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this._createCoursesSubscribtion();
    this._getUser();
    this.authUserId$ = this.store.select(selectAuthUserUid);
  }

  ngOnDestroy(): void {
    this.coursesSubscription.unsubscribe();
  }

  public detectChanges(userId: string) {
    this.authUserId$.pipe(take(1))
      .subscribe((authUserId: string) => {
        if (authUserId && authUserId === userId) {
          this.cdr.detectChanges();
        }
      });
  }

  private _createCoursesSubscribtion(): void {
    this.coursesSubscription = this.coursesService.createSubscription()
      .subscribe((courses: Course[]) => {
        const currentCourse = courses
          .find((course: Course) => course.id === this.course.id );

        if (currentCourse) {
          this.course = currentCourse;
        }
      });
  }

  private _getUser(): void {
    this.usersService.getUser(this.course.authorId).pipe(take(1))
      .subscribe((user: User) => this.author = user);
  }
}
