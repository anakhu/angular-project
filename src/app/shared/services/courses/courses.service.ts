import { Injectable } from '@angular/core';
import { Course } from '../../models/courses/course';
import { Observable, of, from, BehaviorSubject } from 'rxjs';
import { find, switchMap, map, exhaustMap, catchError, mapTo } from 'rxjs/operators';
import { ApiService } from '../api/api.service';
import { routes } from '../../../../environments/environment';
import { AppService } from '../app/app.service';
import { UploadService, UploadUpdate } from '../upload/upload.service';
import { NewCourse } from './course';
import { API_ERRORS } from '../api/api-errors';
import { CustomError } from '../../models/api/custom-error';
import { CourseFormData } from '../../models/courses/courseFormData';

@Injectable({
  providedIn: 'root'
})

export class CoursesService {
  constructor(
    private api: ApiService,
    private app: AppService,
    private uploads: UploadService,
    ) {
    this._listenToChanges();
  }

  private courses: Course[] = [];
  private coursesSubject = new BehaviorSubject<Course[]>([]);

  public loadCourses(): Observable<Course[]> {
    return this.api.getCollectionEntries(routes.courses)
      .pipe(
        map((courses: Course[]) => {
          courses.reverse();
          this._setCourses(courses);
          return this.courses;
        })
      );
  }

  public createSubscription(): Observable<Course[]> {
    return this.coursesSubject.asObservable();
  }

  public getCourses(): Course[] {
    return this.courses;
  }

  public getById(id: string): Observable<Course | null> {
    return from(this.courses)
      .pipe(
        find(({id: courseId}: Course) => courseId === id),
        switchMap((found: Course | undefined) => {
          if (!found) {
            return [];
          }
          return of(found);
        })
      );
  }

  public deleteCourseEntry(reference: string): Observable<any> {
    return this.api.deleteEntry(reference);
  }

  public updateCourseEntry(reference: string, update: any): Observable<any> {
    return this.api.updateEntry(reference, update);
  }

  public addCourse(courseData: CourseFormData, authorId: string): Observable<string> {
    let file;
    try {
      file = courseData.image.files[0];
    } catch (error) {
      file = null;
    }

    const { name, content, startDate, endDate, price, certificate } = courseData;

    return this.uploads.sendFile(file, 'courses', authorId)
      .pipe(
        map((result: UploadUpdate) => {
          let image;
          if (!(result instanceof Error)) {
            image = result.image;
          } else {
            image = null;
          }
          const newCourse = new NewCourse(
            name,
            content,
            authorId,
            startDate.toString(),
            endDate.toString(),
            price,
            certificate,
            image,
          );
          return newCourse;
        }),
        exhaustMap((course: Course) => {
          return this._addNewCourse(course, authorId);
        }),
      );
  }

  private _listenToChanges(): void {
    this.app.getFirebaseReference()
      .ref(routes.courses)
      .on('child_changed', (data: firebase.database.DataSnapshot) => {
        this._updateLocalCourses(data.key, {id: data.key, ...data.val()});
      });
  }

  private _setCourses(coursesArr: Course[]): void {
    this.courses = coursesArr;
    this.coursesSubject.next(this.courses);
  }

  private _updateLocalCourses(courseId: string, updatedCourse: Course = null): Course {
    const index = this.courses
      .findIndex((entry: Course) => entry.id === courseId);

    if (index !== -1) {
      if (updatedCourse) {
        this.courses.splice(index, 1, updatedCourse);
      } else {
        this.courses.splice(index, 1);
      }
      this.coursesSubject.next(this.courses);
    }
    return updatedCourse;
  }

  private async _addNewCourse(course: Course, userId: string): Promise<any> {
    const firebase = this.app.getFirebaseReference();

    let authoredCourses;

    const userRef = firebase.ref(`/${routes.users}/${userId}/authoredCourses`);
    await userRef.once('value')
      .then((response: firebase.database.DataSnapshot) => {
        authoredCourses = response.val()?.length
          ? response.val()
          : [];
      });

    const newCourseKey = await firebase.ref().child(routes.courses).push().key;
    authoredCourses.push(newCourseKey);

    const updates = {};
    updates[`/${routes.courses}/${newCourseKey}`] = course;
    updates[`/${routes.users}/${userId}/authoredCourses`] = authoredCourses;


    return from(firebase.ref().update(updates))
      .pipe(
        catchError((error: Error) => {
          const err: CustomError = {...API_ERRORS.add};
          throw err;
        }),
       mapTo(newCourseKey)
      );
  }
}

