export interface User {
  id: number;
  name: string;
  authoredCourses: number[];
  enrolledCourses: number[];
  likedCourses: number[];
  image?: string;
  followers?: number[];
  following?: number[];
}
