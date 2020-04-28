import { Injectable } from '@angular/core';
import { Course, CourseFormData } from '../../models/course';
import { COURSES } from '../mock';
import { Observable, of, BehaviorSubject, from } from 'rxjs';
import { find, map, first, mergeAll, switchMap, pluck, toArray} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class CoursesService {
  constructor() { }

  private courses = new BehaviorSubject<Course[]>([]);

  private _setCourses(coursesArr: Course[]): void {
    this.courses.next(coursesArr);
  }

  public createSubscription(): Observable<any> {
    return this.courses.asObservable();
  }

  init() {
    this._setCourses(COURSES);
  }

  getById(id: number): Observable<Course | Error> {
    return from(this.courses)
      .pipe(
        first(),
        mergeAll(),
        find(({id: courseId}: Course) => courseId === id),
        switchMap((found: Course | undefined) => {
          if (!found) {
            return of(new Error('Course not found'));
          }

          return of(found);
        })
      );
  }

  addCourse(course: CourseFormData): Observable<Course | Error> {
    const newCourse = course as Course;
    newCourse.id = this.courses.getValue().length + 1;
    console.log('new courseId:', newCourse.id);
    console.log('new course:', newCourse);
    if (!newCourse.image) {
      newCourse.image = './assets/images/default.jpg';
    }
    this._setCourses([...this.courses.getValue(), newCourse]);
    console.log('current state of courses', this.courses.getValue());
    return of(newCourse);
  }
}
