import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Course } from 'src/app/shared/models/courses/course';
import { User } from 'src/app/shared/models/user/user';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { Subscription } from 'rxjs';
import { CoursesService } from '../../../../shared/services/courses/courses.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LoggedInUser } from 'src/app/shared/models/user/loggedInUser';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent implements OnInit, OnDestroy {
  @Input() course: Course;
  public author: User;
  public authUser: LoggedInUser;
  private coursesSubscription: Subscription;
  private authSubscription: Subscription;

  constructor(
    private usersService: UsersService,
    private coursesService: CoursesService,
    private cdr: ChangeDetectorRef,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this._createCoursesSubscribtion();
    this._createAuthSubscription();
    this._getUser(this.course.authorId);
  }

  ngOnDestroy(): void {
    this.coursesSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
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

  private _createAuthSubscription(): void {
    this.authSubscription = this.auth.createSubscription()
      .subscribe((user: LoggedInUser) => this.authUser = user ? user : null );
  }

  private _getUser(id: string): void {
    this.usersService.getUser(this.course.authorId)
      .subscribe((user: User) => this.author = user);
  }
}
