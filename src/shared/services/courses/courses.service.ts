import { Injectable } from '@angular/core';
import { Course, CourseFormData } from '../../models/course';
import { COURSES } from '../mock';
import { Observable, of, BehaviorSubject, from } from 'rxjs';
import { find, first, mergeAll, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class CoursesService {
  constructor() { }

  private coursesSubject = new BehaviorSubject<Course[]>([]);

  private setCourses(coursesArr: Course[]): void {
    this.coursesSubject.next(coursesArr);
  }

  public createSubscription(): Observable<any> {
    return this.coursesSubject.asObservable();
  }

  public getById(id: number): Observable<Course | Error> {
    return from(this.coursesSubject)
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

  public addCourse(course: CourseFormData): Observable<Course | Error> {
    const newCourse = course as Course;
    newCourse.id = this.coursesSubject.getValue().length + 1;

    if (!newCourse.image) {
      newCourse.image = './assets/images/default.jpg';
    }
    this.setCourses([...this.coursesSubject.getValue(), newCourse]);

    // temporary localStorage update
    this.updateLocalStorage();
    return of(newCourse);
  }

  public updateCourse(updatedCourse: Course): void {
    const courseIndex = this.coursesSubject.getValue()
      .findIndex((course: Course) => course.id === updatedCourse.id);
    if (courseIndex !== -1) {
      const currentCourses = [...this.coursesSubject.getValue()];
      currentCourses.splice(courseIndex, 1, updatedCourse);
      this.coursesSubject.next(currentCourses);
      // temporary
      this.updateLocalStorage();
    } else {
      console.log('failed to update')
    }
  }

  public init() {
    this.loadCourses();
  }

  // temporary storage

  private loadCourses(): void {
    const loadedCourses = window.localStorage.getItem('courses');
    if (loadedCourses) {
      this.setCourses(JSON.parse(loadedCourses));
    } else {
      this.setCourses(COURSES);
    }
  }

  private updateLocalStorage(): void {
    window.localStorage.setItem('courses', JSON.stringify(this.coursesSubject.getValue()));
  }
}
