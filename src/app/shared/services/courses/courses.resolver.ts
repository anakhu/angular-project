import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Course } from '../../models/courses/course';
import { Observable } from 'rxjs';
import {  map, tap, first, filter } from 'rxjs/operators';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import * as fromCoursesReducer from 'src/app/store/courses/courses.actions';
import { selectCoursesState } from 'src/app/store/courses/courses.selectors';
import { CoursesState } from 'src/app/store/courses/courses.reducer';


@Injectable({
  providedIn: 'root',
})

export class CoursesResolver implements Resolve<Course[]> {
  constructor(private store: Store<AppState>) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Course[]> {
    return this.store.select(selectCoursesState)
      .pipe(
        tap((coursesState: CoursesState) => {
          if (!coursesState.isLoaded) {
            return this.store.dispatch(new fromCoursesReducer.LoadCoursesStartAction());
          }
        }),
        filter(({ isLoaded }: CoursesState) => isLoaded),
        map((response: CoursesState) => response.courses),
        first()
      );
  }
}
