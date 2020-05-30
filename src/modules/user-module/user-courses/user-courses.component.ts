import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Course } from '../../../app/shared/services/courses/course-model';
import { CoursesService } from 'src/app/shared/services/courses/courses.service';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { from } from 'rxjs';
import { map, switchMap, filter,toArray } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user';

const HEADERS = {
  authoredCourses: 'Authored Courses',
  enrolledCourses: 'Enrolled Courses',
  likedCourses: 'Liked Courses',
};

@Component({
  selector: 'app-user-courses',
  templateUrl: './user-courses.component.html',
  styleUrls: ['./user-courses.component.scss']
})
export class UserCoursesComponent implements OnInit, OnChanges {
  @Input() courses: Course [];
  header: string;
  userId: string;
  filterValue: string;

  constructor(
    private coursesService: CoursesService,
    private route: ActivatedRoute,
    private users: UsersService,
  ) {}

  ngOnInit(): void {
    console.log('user courses works');
    this.userId = this.route.parent.snapshot.params.id;
    this.route.queryParamMap
      .subscribe(params => {
        const value = params.get('base');
        if (value !== this.filterValue) {
          this.filterValue = value;
          this.header = HEADERS[value];
          this._getfilteredCourses();
        }
      });
  }

  ngOnChanges(): void {}

  private _getfilteredCourses(){
    return from(this.users.getUser(this.userId))
      .pipe(
        map((user: User) => {
          if (user) {
            return user[this.filterValue];
          }
        }),
        switchMap((ids: string[]) => {
          return from(this.coursesService.getCourses())
            .pipe(
              filter((course: Course) => ids?.includes(course.id)),
              toArray(),
            );
        }),
      )
      .subscribe((courses: Course[]) => this.courses = courses);
  }

}
