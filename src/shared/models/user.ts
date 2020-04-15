export interface User {
  userId: number;
  name: string;
  authoredCourses: number[];
  enrolledCourses: number[];
  likedCourses: number[];
}
