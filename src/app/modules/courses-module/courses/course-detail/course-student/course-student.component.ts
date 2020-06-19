import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, AfterContentInit } from '@angular/core';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { Subscription, of } from 'rxjs';
import { User } from 'src/app/shared/models/user/user';
import { map, switchMap, take, mergeAll, filter,  pluck, } from 'rxjs/operators';
import { CoursesService } from 'src/app/shared/services/courses/courses.service';
import { Course } from 'src/app/shared/models/courses/course';

@Component({
  selector: 'app-course-student',
  templateUrl: './course-student.component.html',
  styleUrls: ['./course-student.component.scss'],
})
export class CourseStudentComponent implements OnInit, AfterContentInit, OnDestroy {
  @Input() courseId: string;
  @Input() authorId: string;
  @Output() studentsValueChanged = new EventEmitter();
  studentsIds: string[] = [];
  activeStudents: number;
  hasInactiveStudents = false;
  students: Partial<User>[] = [];
  filterStr = '';
  filterField = 'name';
  displayedStudents = 5;
  courseSubscription: Subscription;
  readonly defaultStudentsMax = 5;

  constructor(
    private users: UsersService,
    private courses: CoursesService,
  ) { }

  ngOnInit(): void {}

  ngAfterContentInit() {
    this._getCourseSubscription();
  }

  ngOnDestroy(): void {
    this.courseSubscription.unsubscribe();
    this.studentsIds = [];
  }

  public onFilterValChange(value: string) {
    this.filterStr = value;
  }

  public onClick() {
    this.displayedStudents = this.displayedStudents === this.defaultStudentsMax
    ? undefined
    : this.defaultStudentsMax ;
  }

  private _getStudents(): void {
    this.users.createSubscription()
      .pipe(
        take(1),
        switchMap((users: User[]) => {
          return of(this.studentsIds)
            .pipe(
              map((ids: string[]) => {
                const studentsThumbs: Partial<User>[] = [];
                ids.forEach((userId ) => {
                  const student = users.find((user) => user.id === userId);
                  let studentThumb: Partial<User>;

                  if (student) {
                    const { id, name, image, isActive } = student;
                    studentThumb = {id, name, image, isActive };
                    studentsThumbs.push(studentThumb);
                  }
                });
                this.studentsValueChanged.emit(studentsThumbs.length);
                this.activeStudents = studentsThumbs.length;
                return studentsThumbs;
              })
            );
        })
      )
      .subscribe((users: Partial<User>[]) => this.students = users);
  }

  private _getCourseSubscription() {
    this.courseSubscription = this.courses.createSubscription()
      .pipe(
        mergeAll(),
        filter((course: Course) => course.id === this.courseId),
        pluck('students'),
      )
      .subscribe((ids: string[]) => {
        if (ids?.length) {
          this.studentsIds = ids.reverse();
        } else {
          this.studentsIds = [];
        }
        this._getStudents();
      });
  }
}
