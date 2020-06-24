import { CoursesActions, LOAD_COURSES_SUCCESS, LOAD_COURSES_FAILED, ADD_COURSE_SUCCESS, UPDATE_COURSE_SUCCESS } from './courses.actions';
import { Course } from 'src/app/shared/models/courses/course';

export interface CoursesState {
  courses: Course[];
  isLoaded: boolean;
}

export const  initialAuthState: CoursesState = {
  courses: [],
  isLoaded: false,
};

export function coursesReducer(state: CoursesState = initialAuthState, action: CoursesActions) {
  switch (action.type) {
    case LOAD_COURSES_SUCCESS:
      return {
        ...state,
        courses: action.payload,
        isLoaded: true,
      };

    case ADD_COURSE_SUCCESS:
      return {
        ...state,
        courses: [...state.courses, action.payload]
      };

    case LOAD_COURSES_FAILED:
      return {
        ...state,
        courses: [],
        isLoaded: true,
      };

    case UPDATE_COURSE_SUCCESS:
      const { id } = action.payload;
      const updatedCourses = [...state.courses];
      const index = updatedCourses.findIndex((course: Course) => course.id === id);
      updatedCourses.splice(index, 1, action.payload.update);
      return {
        ...state,
        courses: updatedCourses,
      };

    default:
      return state;
  }
}
