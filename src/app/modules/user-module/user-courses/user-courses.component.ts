import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { Course } from '../../../shared/models/courses/course';
import { CoursesService } from 'src/app/shared/services/courses/courses.service';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { from, Subscription } from 'rxjs';
import { map, switchMap, filter,toArray, take, mergeAll, first, distinctUntilChanged } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user/user';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { selectCourses } from 'src/app/store/courses/courses.selectors';

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
export class UserCoursesComponent implements OnInit, OnDestroy {
  @Input() courses: Course [];
  header: string;
  userId: string;
  filterValue: string;
  filterStr = '';
  filterField = 'name';
  private paramsSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private users: UsersService,
    private store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    this.userId = this.route.parent.snapshot.params.id;
    this._createQueryParamSubscription();
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  onFilterValChange(data: string) {
    this.filterStr = data;
  }

  private _createQueryParamSubscription(): void {
    this.paramsSubscription = this.route.queryParamMap
      .pipe(
        distinctUntilChanged()
      )
      .subscribe(params => {
        const value = params.get('base');
        if (value !== this.filterValue) {
          this.filterValue = value;
          this.header = HEADERS[value];
          this._getfilteredCourses();
        }
      });
  }

  private _getfilteredCourses(){
    return from(this.users.getUser(this.userId))
      .pipe(
        take(1),
        map((user: User) => {
          if (user) {
            return user[this.filterValue];
          }
        }),
        switchMap((ids: string[]) => {
          return this.store.select(selectCourses)
            .pipe(
              take(1),
              mergeAll(),
              filter((course: Course) => ids?.includes(course.id)),
              toArray(),
            );
        }),
      )
      .subscribe((courses: Course[]) => this.courses = courses);
  }

}
