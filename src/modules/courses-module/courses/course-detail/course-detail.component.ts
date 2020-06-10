import { Component, OnInit, ViewChild, AfterContentInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CoursesService } from '../../../../app/shared/services/courses/courses.service';
import { Course } from '../../../../app/shared/services/courses/course-model';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { User } from 'src/app/shared/models/user';
import { map, concatMap } from 'rxjs/operators';
import { CourseStudentComponent } from './course-student/course-student.component';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],

})
export class CourseDetailComponent implements OnInit, AfterViewInit {
  @ViewChild(CourseStudentComponent, {static: false }) studentsViewChild: CourseStudentComponent;
  courseId: string;
  course: Course;
  author: User;
  isCourseActive: boolean;
  students: number;

  constructor(
    private coursesService: CoursesService,
    private activatedRoute: ActivatedRoute,
    private users: UsersService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.courseId = this.activatedRoute.snapshot.paramMap.get('id');
    this._getCourse(this.courseId);
  }

  ngAfterViewInit() {
    if (this.course && this.course.students?.length) {
      this.studentsViewChild.courseId = this.courseId;
      this.studentsViewChild.authorId = this.author.id;
      this.cdr.detectChanges();
    }
  }

  public onStudentsLengthChange(length: number) {
   this.students = length;
  }

  private _getCourse(id: string): void {
    this.coursesService.getById(id)
      .pipe(
        concatMap((course: Course | null) => {
          if (course) {
            return this.users.getUser(course.authorId)
              .pipe(
                map((user: User) => {
                  if (user) {
                    this.isCourseActive = true;
                  }
                  return { course, user };
              })
            );
          }
        })
      )
      .subscribe((data: any) => {
        this.course = data?.course ? data.course : null;
        this.author = data?.user ? data.user : null;
      });
  }
}

