import { Injectable } from '@angular/core';
import { Course } from '../models/course';
import { COURSES } from './mock';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  constructor() { }

  private courses: Course[] = [];

  getCourses(): Course[] {
    return this.courses;
  }

  setCourses(coursesArr: Course[]) {
    this.courses = coursesArr;
  }

  init() {
    this.setCourses(COURSES);
  }

  getById(id: number): Observable<Course | Error> {
    const courseIndex = this.getCourses()
      .findIndex((selectedCourse) => selectedCourse.id === id);
    if (courseIndex !== -1) {
      console.log('found');
      return of(this.getCourses()[courseIndex]);
    } else {
      console.log('not found');
      return of(new Error('not found'));
    }
  }

  addCourse(course: Course): void {
    this.setCourses([...this.getCourses(), course]);
    console.log(course);
    console.log(this.getCourses());
  }
}
