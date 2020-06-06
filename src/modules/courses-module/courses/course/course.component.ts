import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Course } from 'src/app/shared/services/courses/course-model';
import { User } from 'src/app/shared/models/user';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { Subscription } from 'rxjs';
import { CoursesService } from '../../../../app/shared/services/courses/courses.service';
import { AuthService, FireBaseUser } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent implements OnInit, OnDestroy {
  @Input() course: Course;
  author: User;
  coursesSubscription: Subscription;
  authUser: FireBaseUser;

  constructor(
    private usersService: UsersService,
    private coursesService: CoursesService,
    private cdr: ChangeDetectorRef,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this._createCoursesSubscribtion();
    this._getUser(this.course.authorId);
    this.auth.createSubscription()
      .subscribe((user: FireBaseUser) => this.authUser = user ? user : null );
  }

  ngOnDestroy(): void {
    this.coursesSubscription.unsubscribe();
  }

  public detectChanges(data) {
    if (this.authUser && this.authUser.uid === data) {
      this.cdr.detectChanges();
    }
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

  private _getUser(id: string): void {
    this.usersService.getUser(this.course.authorId)
      .subscribe((user: User) => this.author = user);
  }
}
