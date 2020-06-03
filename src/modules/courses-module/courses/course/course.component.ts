import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Course } from 'src/app/shared/services/courses/course-model';
import { User } from 'src/app/shared/models/user';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { Subscription } from 'rxjs';
import { CoursesService } from '../../../../app/shared/services/courses/courses.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, OnDestroy {
  @Input() course: Course;
  author: User;
  coursesSubscription: Subscription;

  constructor(
    private usersService: UsersService,
    private coursesService: CoursesService,
  ) { }

  ngOnInit(): void {
    this._createCoursesSubscribtion();
    this._getUser(this.course.authorId);
  }

  ngOnDestroy(): void {
    this.coursesSubscription.unsubscribe();
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