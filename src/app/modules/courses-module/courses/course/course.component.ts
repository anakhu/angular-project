import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Course } from 'src/app/shared/models/courses/course';
import { User } from 'src/app/shared/models/user/user';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { Subscription, Observable, from } from 'rxjs';
import { CoursesService } from '../../../../shared/services/courses/courses.service';
import { AppState } from 'src/app/store/app.reducer';
import { Store, ActionsSubject, Action } from '@ngrx/store';
import { selectAuthUserUid } from 'src/app/store/auth/auth.selectors';
import { take, mergeAll, first, tap, filter, pluck } from 'rxjs/operators';
import { selectCoursebyId } from 'src/app/store/courses/courses.selectors';
import { UPDATE_COURSE_SUCCESS } from 'src/app/store/courses/courses.actions';

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
    private cdr: ChangeDetectorRef,
    private store: Store<AppState>,
    private actionSbj: ActionsSubject
  ) { }

  ngOnInit(): void {
    this._getUser();
    this.authUserId$ = this.store.select(selectAuthUserUid);
    this._subscribeToCourseUpdates();
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

  private _subscribeToCourseUpdates(): void {
    this.coursesSubscription = this.actionSbj
      .pipe(
        filter((action: any) => {
          return action.type === UPDATE_COURSE_SUCCESS && action.payload?.id === this.course.id;
          }
        ),
        pluck('payload'),
        pluck('update')
      )
      .subscribe((update: Course) => this.course = update);
  }

  private _getUser(): void {
    this.usersService.getUser(this.course.authorId).pipe(take(1))
      .subscribe((user: User) => this.author = user);
  }
}
