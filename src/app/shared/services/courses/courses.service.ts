import { Injectable } from '@angular/core';
import { Course } from './course-model';
import { Observable, of, from, Subject } from 'rxjs';
import { find, switchMap, map, exhaustMap, catchError } from 'rxjs/operators';
import { ApiService } from '../api/api.service';
import { routes } from '../../../../environments/environment';
import { AppService } from '../app/app.service';
import { UploadService, UploadUpdate } from '../upload/upload.service';
import { NewCourse } from './course';
import { API_ERRORS } from '../api/api-errors';
import { CustomError } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})

export class CoursesService {
  fireBase: any;

  constructor(
    private api: ApiService,
    private app: AppService,
    private uploads: UploadService
    ) {
    this._listenToChanges();
  }

  private courses: Course[] = [];
  private coursesSubject = new Subject<Course[]>();

  public loadCourses(): Observable<Course[]> {
    return this.api.getCollectionEntries(routes.courses)
      .pipe(
        map((courses: Course[]) => {
          this._setCourses(courses);
          return this.courses;
        })
      );
  }

  private _listenToChanges() {
    return this.app.getFirebaseReference()
      .ref(routes.courses)
      .on('child_changed', (data: any) => {
        this.updateLocalCourses(data.key, {id: data.key, ...data.val()});
      });
  }

  private _setCourses(coursesArr: Course[]): void {
    this.courses = coursesArr;
    this.coursesSubject.next(this.courses);
  }

  public createSubscription(): Observable<any> {
    return this.coursesSubject.asObservable();
  }

  public getCourses(): Course[] {
    return this.courses;
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

  public addCourse(courseData: any, authorId: string): Observable<any> {
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
          return this.addNewCourse(course, authorId);
        }),
      );
  }

  private updateLocalCourses(courseId: string, updatedCourse: Course = null): Course {

    const index = this.courses.findIndex((entry: Course) => entry.id === courseId);
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

  private async addNewCourse(course: Course, userId: string): Promise<any> {
    const firebase = this.app.getFirebaseReference();

    let authoredCourses;

    const userRef = firebase.ref(`/${routes.users}/${userId}/authoredCourses`);
    await userRef.once('value').then((response: any) => {
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
       map((response: any) => newCourseKey)
      );
  }
}

