import { Injectable } from '@angular/core';
import { Course, CourseFormData } from '../../models/course';
import { Observable, of, BehaviorSubject, from, Subject } from 'rxjs';
import { find, first, mergeAll, switchMap, tap, map } from 'rxjs/operators';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})

export class CoursesService {
  constructor( private api: ApiService) {}

  private courses: Course[] = [];
  private coursesSubject = new Subject<Course[]>();

  public loadCourses(): Observable<Course[]>{
    return this.api.getAll('courses', true)
      .pipe(
        map((result: Course[]) => {
          this._setCourses(result);
          return this.courses;
        }),
      );
  }

  public getCourses(): Course[] {
    return this.courses;
  }

  private _setCourses(coursesArr: Course[]): void {
    this.courses = coursesArr;
    this.coursesSubject.next(this.courses);
  }

  public createSubscription(): Observable<any> {
    return this.coursesSubject.asObservable();
  }

  public getById(id: string): Observable<Course | Error> {
    return from(this.courses)
      .pipe(
        find(({id: courseId}: Course) => courseId === id),
        switchMap((found: Course | undefined) => {
          if (!found) {
            throw Error('Course not found');
          }
          return of(found);
        })
      );
  }

  public addCourse(course: CourseFormData): Observable<Course | Error> {
    const newCourse = course as Course;
    // newCourse.id = this.coursesSubject.getValue().length + 1;

    // if (!newCourse.image) {
    //   newCourse.image = './assets/images/default.jpg';
    // }
    // this.setCourses([...this.coursesSubject.getValue(), newCourse]);

    // // temporary localStorage update
    // this.updateLocalStorage();
    return of(newCourse);
  }


  public updateCourse(updatedCourse: Course): Observable<Course> {
    return this.api.updateItem('courses', updatedCourse)
      .pipe(
        map((course: Course) => {
          const index = this.courses.findIndex((entry: Course) => entry.id === course.id);
          if (index !== -1) {
            this.courses.splice(index, 1, course);
            this.coursesSubject.next(this.courses);
          }
          return course;
        })
      );
  }
}
