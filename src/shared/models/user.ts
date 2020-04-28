export interface User {
  id: number;
  name: string;
  authoredCourses: number[];
  enrolledCourses: number[];
  likedCourses: number[];
  followers?: number[];
  following?: number[];
}
