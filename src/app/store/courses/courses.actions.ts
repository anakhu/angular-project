import { Action } from '@ngrx/store';
import { Course } from 'src/app/shared/models/courses/course';
import { CourseFormData } from 'src/app/shared/models/courses/courseFormData';

export const LOAD_COURSES = '[Courses] LOAD_COURSES_START';
export const LOAD_COURSES_SUCCESS = '[Courses] LOAD_COURSES_SUCCESS';
export const LOAD_COURSES_FAILED = '[Courses] LOAD_COURSES_FAILED';
export const GET_COURSES = '[Courses] GET_COURSES';
export const GET_COURSE = '[Courses] GET_COURSE';
export const UPDATE_COURSE_START = '[Courses] UPDATE_COURSE_START';
export const UPDATE_COURSE_SUCCESS = '[Courses] UPDATE_COURSE_SUCCESS';
export const UPDATE_COURSE_FAILED = '[Courses] UPDATE_COURSE_FAILED';
export const REMOVE_COURSE = '[Courses] REMOVE_COURSE';
export const ADD_COURSE_START = '[Courses] ADD_COURSE_START';
export const ADD_COURSE_SUCCESS = '[Courses] ADD_COURSE_SUCCESS';
export const ADD_COURSE_FAILED = '[Courses] ADD_COURSE_FAILED';
export const COURSES_ARE_LOADING = '[Courses] COURSES_ARE_LOADING';


export class LoadCoursesStartAction implements Action {
  readonly type = LOAD_COURSES;
  constructor(){}
}

export class LoadCoursesSuccessAction implements Action {
  readonly type = LOAD_COURSES_SUCCESS;
  constructor(public payload: Course[]){}
}

export class LoadCoursesFailedAction implements Action {
  readonly type = LOAD_COURSES_FAILED;
  constructor(public payload: any){}
}

export class GetCoursesAction implements Action {
  readonly type = GET_COURSES;
  constructor(public payload: Course[]) {}
}

export class CoursesAreLoadingAction implements Action {
  readonly type = COURSES_ARE_LOADING;
  constructor() {}
}

export class AddCourseStartAction implements Action {
  readonly type = ADD_COURSE_START;
  constructor(public payload: {courseData: CourseFormData, authorId: string}) {}
}

export class AddCourseSuccessAction implements Action {
  readonly type = ADD_COURSE_SUCCESS;
  constructor(public payload: Course) {}
}

export class AddCourseFailedAction implements Action {
  readonly type = ADD_COURSE_FAILED;
  constructor() {}
}

export class UpdateCourseStartAction implements Action {
  readonly type = UPDATE_COURSE_START;
  constructor(public payload: {id: string, update: Course}) {}
}

export class UpdateCourseSuccessAction implements Action {
  readonly type = UPDATE_COURSE_SUCCESS;
  constructor(public payload: {id: string, update: Course}) {}
}

export class UpdateCourseFailedAction implements Action {
  readonly type = UPDATE_COURSE_FAILED;
  constructor() {}
}

export class RemoveCourseAction implements Action {
  readonly type = REMOVE_COURSE;
  constructor(public payload: {id: string}) {}
}

export type CoursesActions =
  LoadCoursesStartAction |
  LoadCoursesSuccessAction |
  LoadCoursesFailedAction |
  GetCoursesAction |
  AddCourseStartAction |
  AddCourseSuccessAction |
  UpdateCourseStartAction |
  UpdateCourseSuccessAction |
  UpdateCourseFailedAction |
  RemoveCourseAction |
  CoursesAreLoadingAction;
