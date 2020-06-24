import { createSelector } from '@ngrx/store';
import { CoursesState } from './courses.reducer';
import { AppState } from '../app.reducer';
import { Course } from 'src/app/shared/models/courses/course';

export const selectCoursesState = (state: AppState) => state.courses;

export const selectCourses = createSelector(
  selectCoursesState,
  (course: CoursesState) => course.courses
);

export const selectCoursebyId = createSelector(
  selectCourses,
  (courses: Course[], props ) => {
    return courses.filter((course: Course) => course.id === props.id)[0];
  }
);




