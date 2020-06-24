import { Injectable } from '@angular/core';
import { Course } from '../../models/courses/course';
import { Observable, from } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { ApiService } from '../api/api.service';
import { routes } from '../../../../environments/environment';
import { AppService } from '../app/app.service';
import { UploadService, UploadUpdate } from '../upload/upload.service';
import { NewCourse } from './course';
import { API_ERRORS } from '../api/api-errors';
import { CustomError } from '../../models/api/custom-error';
import { CourseFormData } from '../../models/courses/courseFormData';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { ErrorService } from 'src/app/modules/error-handler/error.service/error.service';
import * as fromCoursesActions from 'src/app/store/courses/courses.actions';

@Injectable({
  providedIn: 'root'
})

export class CoursesService {
  constructor(
    private api: ApiService,
    private app: AppService,
    private uploads: UploadService,
    private errors: ErrorService,
    private store: Store<AppState>,
    ) {
    this._listenToChanges();
  }

  public deleteCourseEntry(reference: string): Observable<any> {
    return this.api.deleteEntry(reference);
  }

  public updateCourseEntry(reference: string, update: any): Observable<any> {
    return this.api.updateEntry(reference, update);
  }

  public addCourse(courseData: CourseFormData, authorId: string): Observable<Course> {
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
        exhaustMap((course: Partial<Course>) => {
          return from(this._addNewCourse(course, authorId))
            .pipe(
              catchError(() => {
                const err: CustomError = {...API_ERRORS.add};
                this.errors.handleError(err);
                return undefined;
              }),
              map((newCourseId: string | undefined)  => {
                if (newCourseId) {
                  const createdCourse = { ...course, id: newCourseId} as Course;
                  return createdCourse;
                }
                return undefined;
              })
            );
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

  private _updateLocalCourses(courseId: string, updatedCourse: Course = null): Course {
    const update: {id: string, update: Course} = {
      id: courseId,
      update: updatedCourse,
    };
    this.store.dispatch(new fromCoursesActions.UpdateCourseStartAction(update));
    return updatedCourse;
  }

  private async _addNewCourse(course: Partial<Course>, userId: string): Promise<any> {
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

    return firebase.ref().update(updates)
      .then(() => newCourseKey);
  }
}

