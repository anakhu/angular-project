import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Course, CourseFormData } from 'src/shared/models/course';
import { CoursesService } from '../../../shared/services/courses/courses.service';
import { Observable, fromEvent, Subscription, of, EMPTY } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { UsersService } from 'src/shared/services/users/users.service';
import { User } from 'src/shared/models/user';


@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})

export class AddCourseComponent implements OnInit {
  @Input() user: User;
  @Input() newCourse: CourseFormData = {};
  btnAddClick$: Observable<Event>;
  private btnSubscription: Subscription;
  error: string;

  @Output() addedCourseEvent = new EventEmitter<Course>();

  constructor(
    private coursesService: CoursesService,
    private usersService: UsersService,
  ) { }

  ngOnInit(): void {
    const btnAdd = document.getElementById('add-course-btn');
    this.btnAddClick$ = fromEvent(btnAdd, 'click');
    this.subscribe();
  }

  onDestroy(): void {
    this.btnSubscription.unsubscribe();
  }

  private subscribe(): void {
    this.createBtnSubscription();
  }

  private addCourse(): void {
    this.coursesService.addCourse(this.newCourse)
      .pipe(
        tap((res) => {
          if (res instanceof Error) {
            throw res;
          }
        }),
        catchError((err: Error) => {
          this.error = err.message;
          return EMPTY;
        }))
      .subscribe((result: Course) => {
        const updatedUser = { ...this.user, authoredCourses: [...this.user.authoredCourses, result.id]};
        this.user = updatedUser;
        this.usersService.updateUserDetail(updatedUser);
        this.newCourse = {};
      });
  }

  private createBtnSubscription() {
    this.btnSubscription = this.btnAddClick$
      .subscribe((e: Event) => {
        this.error = '';
        this.newCourse.author = this.user.name;
        this.addCourse();
    });
  }
}
