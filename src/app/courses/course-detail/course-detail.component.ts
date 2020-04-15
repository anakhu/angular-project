import { Component, OnInit, Input } from '@angular/core';
import { CoursesService } from '../../../shared/services/courses.service';
import { Course } from '../../../shared/models/course';
import { tap, catchError } from 'rxjs/operators';
import { EMPTY, Observable, of } from 'rxjs';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {

  @Input() course: Course;

  constructor(
    private coursesService: CoursesService,
  ) { }

  ngOnInit(): void {
    // this.getCourse(2);
  }


  getCourse(id: number): void {
    const obs$: Observable <Course | Error> = this.coursesService.getById(id);
    obs$.pipe(
      tap((res: Course | Error) => {
        if (res instanceof Error) {
          console.log('error');
          throw res;
        }
      }),
      catchError((error: Error) => {
        console.log(error.message);
        return EMPTY;
      })
    ).subscribe((x: Course) => this.course = x);
  }
}

