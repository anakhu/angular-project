import * as fromAuthReducer from '../store/auth/auth.reducer';
import * as fromCoursesReducer from '../store/courses/courses.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
  auth: fromAuthReducer.AuthState;
  courses: fromCoursesReducer.CoursesState;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuthReducer.authReducer,
  courses: fromCoursesReducer.coursesReducer,
};

