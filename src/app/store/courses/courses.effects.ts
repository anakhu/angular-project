import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as fromCoursesActions from './courses.actions';
import { catchError, map, switchMap, finalize, share } from 'rxjs/operators';
import { of } from 'rxjs';
import { ErrorService } from 'src/app/modules/error-handler/error.service/error.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NotificationsService } from 'src/app/shared/services/notifications/notifications.service';
import { CoursesService } from 'src/app/shared/services/courses/courses.service';
import { Course } from 'src/app/shared/models/courses/course';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { routes } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable()
export class CoursesEffects {

  @Effect()
  loadCourses$ = this.actions$.pipe(
    ofType(fromCoursesActions.LOAD_COURSES),
    switchMap((action: fromCoursesActions.LoadCoursesStartAction) => {
      return this.api.getCollectionEntries(routes.courses)
        .pipe(
          map((response: Course[]) => {
            return (new fromCoursesActions.LoadCoursesSuccessAction(response));
          }),
          catchError((error) => {
            this.errors.handleError(error);
            return of(new fromCoursesActions.LoadCoursesFailedAction(error));
          }),
          finalize(() => this.loader.stop())
        );
    }),
  );

  @Effect()
  addCourse$ = this.actions$.pipe(
    ofType(fromCoursesActions.ADD_COURSE_START),
    switchMap((action: fromCoursesActions.AddCourseStartAction) => {
      const { courseData, authorId } = action.payload;
      return this.courses.addCourse(courseData, authorId)
        .pipe(
          map((newCourse: Course | undefined) => {
            if (newCourse) {
              this.notifications.createNotification('New Course Added');
              this.router.navigate(['/courses', newCourse.id]);
              return new fromCoursesActions.AddCourseSuccessAction(newCourse);
            }
            return of(new fromCoursesActions.AddCourseFailedAction());
          }),
        );
    }),
  );

  @Effect()
  updateCourse$ = this.actions$.pipe(
    ofType(fromCoursesActions.UPDATE_COURSE_START),
    switchMap((action: fromCoursesActions.UpdateCourseStartAction) => {
      if (action.payload.update) {
        return of (new fromCoursesActions.UpdateCourseSuccessAction(action.payload));
      }
      return of (new fromCoursesActions.RemoveCourseAction({id: action.payload.id}));
      // return this.courses.addCourse(courseData, authorId)
      //   .pipe(
      //     map((newCourse: Course | undefined) => {
      //       if (newCourse) {
      //         this.notifications.createNotification('New Course Added');
      //         this.router.navigate(['/courses', newCourse.id]);
      //         return new fromCoursesActions.AddCourseSuccessAction(newCourse);
      //       }
      //       return of(new fromCoursesActions.AddCourseFailedAction());
      //     }),
      //   );
    }),
  );

  constructor(
    private actions$: Actions,
    private courses: CoursesService,
    private errors: ErrorService,
    private loader: NgxUiLoaderService,
    private notifications: NotificationsService,
    private api: ApiService,
    private router: Router
    ) {}
}
